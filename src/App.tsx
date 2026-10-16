import { ui } from './i18n';
/**
 * DigitaMente - Aplicação Principal
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Header, ActiveTab } from './components/Header';
import { TypingBar } from './components/TypingTest/TypingBar';
import { TypingArea } from './components/TypingTest/TypingArea';
import { LiveStats } from './components/TypingTest/LiveStats';
import { VirtualKeyboard } from './components/TypingTest/VirtualKeyboard';
import { StudyPreviewModal } from './components/TypingTest/StudyPreviewModal';
import { CustomTextModal } from './components/TypingTest/CustomTextModal';
import { ResultsView } from './components/Results/ResultsView';
import { LibraryView } from './components/Library/LibraryView';
import { StatsView } from './components/Stats/StatsView';
import { SettingsModal } from './components/Settings/SettingsModal';

import { useSettings } from './hooks/useSettings';
import { useTypingEngine } from './hooks/useTypingEngine';
import { storageService } from './services/storageService';
import { getTexts } from './data/texts';
import { 
  generateCommonWordsText, 
  generateAlphabetText, 
  generateNumbersText 
} from './data/commonWords';
import { normalizeText, removeDiacritics, removeInvertedMarks } from './utils/textNormalizer';
import { soundService } from './services/soundService';
import { 
  normalizeCategory,
  TestType, 
  TestDurationMode, 
  TextCategory, 
  StudyText, 
  TestResult 
} from './types';
import { t } from './i18n';
import { Smartphone, RotateCcw, Shuffle } from 'lucide-react';

export default function App() {
  const {
    settings,
    updateSettings,
    resetToDefaults,
  } = useSettings();

  // Navegação
  const [activeTab, setActiveTab] = useState<ActiveTab>('test');

  // Parâmetros do teste
  const [testType, setTestType] = useState<TestType>(settings.defaultTestType);
  const [durationMode, setDurationMode] = useState<TestDurationMode>(settings.defaultDurationMode);
  const [timeSeconds, setTimeSeconds] = useState<number>(settings.defaultTimeSeconds);
  const [wordCount, setWordCount] = useState<number>(settings.defaultWordCount);
  const [pageCount, setPageCount] = useState<number>(settings.defaultPageCount);
  const [category, setCategory] = useState<TextCategory | 'Aleatório'>(settings.defaultCategory);
  const isStudyMode = testType === 'library' && settings.studyMode;

  // Textos atuais
  const [currentStudyText, setCurrentStudyText] = useState<StudyText | null>(null);
  const [rawTargetText, setRawTargetText] = useState<string>('');
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isPriorReadingOpen, setIsPriorReadingOpen] = useState(false);

  // Resultado mais recente
  const [latestResult, setLatestResult] = useState<TestResult | null>(null);
  const [isNewRecord, setIsNewRecord] = useState(false);

  // Sorteia ou monta o texto para digitação
  const prepareText = useCallback((
    type: TestType,
    cat: TextCategory | 'Aleatório',
    durMode: TestDurationMode,
    words: number,
    pages: number,
    chosenStudyText?: StudyText | null,
    customString?: string
  ): { target: string; studyObj: StudyText | null } => {
    let text = '';
    let studyObj: StudyText | null = null;

    const currentLang = settings.language || 'pt-BR';
    const langCode = currentLang.startsWith('pt') ? 'pt' : currentLang.startsWith('es') ? 'es' : 'en';

    if (customString) {
      let norm = normalizeText(customString);
      if (currentLang === 'es' && settings.omitInvertedMarks) norm = removeInvertedMarks(norm);
      return { target: norm, studyObj: null };
    }

    // Carrega pool da biblioteca para o idioma atual com filtros de escopo regional
    const allLibTexts = getTexts(langCode);
    const validLibTexts = langCode === 'pt'
      ? allLibTexts
      : allLibTexts.filter((item) => {
          if (item.scope === 'regional') {
            const c = normalizeCategory(item.category);
            return c === 'curiosidades' || c === 'atualidades';
          }
          return true;
        });

    // Se o idioma não tiver textos na biblioteca e o tipo for 'library', cai automaticamente em 'common_words'
    let effectiveType = type;
    if (type === 'library' && !chosenStudyText && validLibTexts.length === 0) {
      effectiveType = 'common_words';
    }

    if (effectiveType === 'custom') {
      text = 'Digite aqui o seu texto personalizado...';
    } else if (effectiveType === 'common_words') {
      const count = durMode === 'words' ? Math.max(words, 30) : 120;
      text = generateCommonWordsText(count, settings.includePunctuationInWords, langCode);
    } else if (effectiveType === 'alphabet') {
      text = generateAlphabetText(4, langCode);
    } else if (effectiveType === 'numbers') {
      text = generateNumbersText(25);
    } else if (effectiveType === 'no_accents') {
      const pool = validLibTexts.length > 0 ? validLibTexts : storageService.getUserTexts();
      if (pool.length > 0) {
        const pick = pool[Math.floor(Math.random() * pool.length)];
        text = removeDiacritics(pick.body ?? pick.text ?? '');
      } else {
        const wordsText = generateCommonWordsText(120, false, langCode);
        text = removeDiacritics(wordsText);
      }
    } else {
      // 'library'
      if (chosenStudyText) {
        studyObj = chosenStudyText;
        text = chosenStudyText.body ?? chosenStudyText.text ?? '';
      } else {
        const pool = (settings.includeAiAndUserInRandom ?? true)
          ? [...storageService.getUserTexts(), ...validLibTexts]
          : [...validLibTexts];
        const filtered = cat === 'Aleatório'
          ? pool
          : pool.filter((item) => normalizeCategory(item.category) === cat);
        const candidates = filtered.length > 0 ? filtered : pool;
        if (candidates.length > 0) {
          const pick = storageService.getNextShuffleText(candidates, langCode) || candidates[0];
          studyObj = pick;
          text = pick.body ?? pick.text ?? '';
        } else {
          text = generateCommonWordsText(120, settings.includePunctuationInWords, langCode);
        }
      }

      // Se for modo por páginas (1 página ≈ 250 palavras), compõe textos adicionais da mesma área
      if (durMode === 'pages' && pages > 1 && validLibTexts.length > 0) {
        const pool = validLibTexts.filter((item) => cat === 'Aleatório' || normalizeCategory(item.category) === cat);
        if (pool.length > 0) {
          let accumulated = text;
          for (let p = 1; p < pages; p++) {
            const next = pool[p % pool.length];
            accumulated += ' ' + (next.body ?? next.text ?? '');
          }
          text = accumulated;
        }
      }
    }

    let normalized = normalizeText(text);
    if (currentLang === 'es' && settings.omitInvertedMarks) {
      normalized = removeInvertedMarks(normalized);
    }

    return { target: normalized, studyObj };
  }, [settings.language, settings.omitInvertedMarks, settings.includePunctuationInWords, settings.includeAiAndUserInRandom]);

  // Inicializa o primeiro texto
  useEffect(() => {
    const { target, studyObj } = prepareText(
      testType,
      category,
      durationMode,
      wordCount,
      pageCount
    );
    setRawTargetText(target);
    setCurrentStudyText(studyObj);
    if (testType === 'library' && settings.studyMode && settings.studyPriorReading && studyObj) {
      setIsPriorReadingOpen(true);
    }
  }, []);

  // Callback de conclusão do teste
  const handleTestFinish = useCallback((result: TestResult) => {
    const saveOutcome = storageService.saveResult(result);
    setIsNewRecord(saveOutcome.isNewRecord);
    setLatestResult(result);
  }, []);

  // Anexar mais texto dinamicamente em testes com tempo (para o texto nunca acabar)
  const handleNeedMoreText = useCallback(() => {
    const currentLang = settings.language || 'pt-BR';
    const langCode = currentLang.startsWith('pt') ? 'pt' : currentLang.startsWith('es') ? 'es' : 'en';
    if (testType === 'common_words') {
      let more = ' ' + generateCommonWordsText(40, settings.includePunctuationInWords, langCode);
      if (currentLang === 'es' && settings.omitInvertedMarks) more = removeInvertedMarks(more);
      setRawTargetText((prev) => prev + more);
    } else {
      const validLibTexts = getTexts(langCode);
      if (validLibTexts.length > 0) {
        const pool = validLibTexts.filter((t) => category === 'Aleatório' || normalizeCategory(t.category) === category);
        const randomNext = pool[Math.floor(Math.random() * pool.length)] || validLibTexts[0];
        let bodyStr = randomNext.body ?? randomNext.text ?? '';
        if (currentLang === 'es' && settings.omitInvertedMarks) bodyStr = removeInvertedMarks(bodyStr);
        const appendStr = ' ' + (testType === 'no_accents' ? removeDiacritics(bodyStr) : bodyStr);
        setRawTargetText((prev) => prev + appendStr);
      } else {
        let moreWords = ' ' + generateCommonWordsText(30, settings.includePunctuationInWords, langCode);
        if (currentLang === 'es' && settings.omitInvertedMarks) moreWords = removeInvertedMarks(moreWords);
        setRawTargetText((prev) => prev + moreWords);
      }
    }
  }, [testType, category, settings.includePunctuationInWords]);

  // Motor de digitação
  const engine = useTypingEngine({
    targetText: rawTargetText,
    settings,
    testType,
    durationMode,
    timeLimitSeconds: timeSeconds,
    wordLimit: wordCount,
    category: currentStudyText ? normalizeCategory(currentStudyText.category) : (category !== 'Aleatório' ? category : undefined),
    textTitle: currentStudyText?.title,
    textId: currentStudyText?.id,
    lang: currentStudyText?.lang || (settings.language?.startsWith('pt') ? 'pt' : settings.language?.startsWith('es') ? 'es' : 'en'),
    isStudyMode,
    onNeedMoreText: handleNeedMoreText,
    onFinish: handleTestFinish,
  });

  const engineRef = useRef(engine);
  engineRef.current = engine;

  // Trocar para um novo texto
  const startNewText = useCallback((specificStudyText?: StudyText) => {
    setLatestResult(null);
    setIsNewRecord(false);
    const effectiveType = specificStudyText ? 'library' : testType;
    if (specificStudyText && testType !== 'library') {
      setTestType('library');
    }
    const { target, studyObj } = prepareText(
      effectiveType,
      category,
      durationMode,
      wordCount,
      pageCount,
      specificStudyText
    );
    setRawTargetText(target);
    setCurrentStudyText(studyObj);
    engineRef.current.restartTest();

    if ((specificStudyText || effectiveType === 'library') && settings.studyMode && settings.studyPriorReading && studyObj) {
      setIsPriorReadingOpen(true);
    }
  }, [prepareText, testType, category, durationMode, wordCount, pageCount, settings.studyMode, settings.studyPriorReading]);

  // Reiniciar mesmo texto
  const handleRetrySameText = useCallback(() => {
    setLatestResult(null);
    setIsNewRecord(false);
    engineRef.current.restartTest();
  }, []);

  // Ao trocar o idioma durante o teste, reinicia o teste com texto do novo idioma
  const prevLangRef = useRef(settings.language);
  useEffect(() => {
    if (prevLangRef.current && prevLangRef.current !== settings.language) {
      prevLangRef.current = settings.language;
      startNewText();
    } else {
      prevLangRef.current = settings.language;
    }
  }, [settings.language, startNewText]);

  // Atalho global Tab -> Enter para novo texto e listener global de foco/digitação
  useEffect(() => {
    let tabPressedRecently = false;
    let tabTimeout: any = null;

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Retoma AudioContext na primeira interação de tecla
      soundService.resume();

      // Atalho Tab -> Enter
      if (e.key === 'Tab') {
        tabPressedRecently = true;
        clearTimeout(tabTimeout);
        tabTimeout = setTimeout(() => {
          tabPressedRecently = false;
        }, 1200);
      } else if (e.key === 'Enter' && tabPressedRecently) {
        e.preventDefault();
        tabPressedRecently = false;
        startNewText();
        return;
      }

      const eng = engineRef.current;

      // Se não estiver na tela de Teste, ou teste finalizado, ou modal/popover aberto, não intercepta
      if (activeTab !== 'test' || latestResult !== null || eng.isFinished) {
        return;
      }
      if (isCustomModalOpen || isPriorReadingOpen) {
        return;
      }

      // Verifica se o elemento atualmente focado é um campo editável ou controle interativo (input, select, textarea, etc.)
      const activeEl = document.activeElement;
      const isTargetTextarea = activeEl === eng.textareaRef.current;
      const isEditableOrInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable);

      if (isEditableOrInput && !isTargetTextarea) {
        return;
      }

      // Se for tecla com modificadores de sistema, não intercepta
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Teclas imprimíveis (comprimento 1) ou Backspace
      const isPrintable = e.key.length === 1;
      const isBackspace = e.key === 'Backspace';

      if (isPrintable || isBackspace) {
        const textarea = eng.textareaRef.current;
        if (textarea) {
          if (!isTargetTextarea) {
            textarea.focus({ preventScroll: true });
            eng.setIsFocused(true);

            // Simula ou despacha a tecla no textarea para que o primeiro caractere não se perca
            if (isPrintable) {
              const start = textarea.selectionStart || 0;
              const end = textarea.selectionEnd || 0;
              const val = textarea.value;
              textarea.value = val.slice(0, start) + e.key + val.slice(end);
              textarea.selectionStart = textarea.selectionEnd = start + 1;

              // Dispara evento de input nativo no textarea
              const inputEvt = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                data: e.key,
                inputType: 'insertText',
              });
              textarea.dispatchEvent(inputEvt);
              e.preventDefault();
            } else if (isBackspace) {
              // Dispara evento synthetic/keydown no engine se não estiver focado
              const synthEvent = {
                key: 'Backspace',
                ctrlKey: false,
                metaKey: false,
                altKey: false,
                shiftKey: false,
                preventDefault: () => {},
                stopPropagation: () => {},
              } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;
              eng.handleKeyDown(synthEvent);
              e.preventDefault();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
      clearTimeout(tabTimeout);
    };
  }, [
    startNewText,
    activeTab,
    latestResult,
    isCustomModalOpen,
    isPriorReadingOpen,
  ]);

  // Focar o textarea oculto ao abrir/voltar para a aba Teste, ao fechar modais e quando a janela recuperar foco
  useEffect(() => {
    if (activeTab === 'test' && !latestResult && !isCustomModalOpen && !isPriorReadingOpen) {
      engineRef.current.focusInput();
    }
  }, [activeTab, latestResult, isCustomModalOpen, isPriorReadingOpen]);

  useEffect(() => {
    const handleWindowFocus = () => {
      if (activeTab === 'test' && !latestResult && !isCustomModalOpen && !isPriorReadingOpen) {
        engineRef.current.focusInput();
      }
    };
    window.addEventListener('focus', handleWindowFocus);
    return () => window.removeEventListener('focus', handleWindowFocus);
  }, [activeTab, latestResult, isCustomModalOpen, isPriorReadingOpen]);

  // Manipuladores de alteração da barra de controle
  const handleChangeTestType = (newType: TestType) => {
    setTestType(newType);
    setLatestResult(null);
    const { target, studyObj } = prepareText(
      newType,
      category,
      durationMode,
      wordCount,
      pageCount
    );
    setRawTargetText(target);
    setCurrentStudyText(studyObj);
    engine.restartTest();
    if (newType === 'library' && settings.studyMode && settings.studyPriorReading && studyObj) {
      setIsPriorReadingOpen(true);
    }
    setTimeout(() => {
      engine.textareaRef.current?.focus({ preventScroll: true });
      engine.setIsFocused(true);
    }, 0);
  };

  const handleToggleStudyMode = useCallback(() => {
    if (testType !== 'library') return;
    const nextStudyMode = !settings.studyMode;
    updateSettings({ studyMode: nextStudyMode });
    if (nextStudyMode && settings.studyPriorReading && currentStudyText && !engine.isRunning) {
      setIsPriorReadingOpen(true);
    }
  }, [testType, settings.studyMode, settings.studyPriorReading, updateSettings, currentStudyText, engine.isRunning]);

  const handleChangeDurationMode = (newMode: TestDurationMode) => {
    setDurationMode(newMode);
    setLatestResult(null);
    const { target, studyObj } = prepareText(
      testType,
      category,
      newMode,
      wordCount,
      pageCount,
      currentStudyText
    );
    setRawTargetText(target);
    engine.restartTest();
    setTimeout(() => {
      engine.textareaRef.current?.focus({ preventScroll: true });
      engine.setIsFocused(true);
    }, 0);
  };

  const handleChangeCategory = (newCat: TextCategory | 'Aleatório') => {
    setCategory(newCat);
    setLatestResult(null);
    const { target, studyObj } = prepareText(
      'library',
      newCat,
      durationMode,
      wordCount,
      pageCount
    );
    setRawTargetText(target);
    setCurrentStudyText(studyObj);
    engine.restartTest();
    setTimeout(() => {
      engine.textareaRef.current?.focus({ preventScroll: true });
      engine.setIsFocused(true);
    }, 0);
  };

  const handleCustomTextSubmit = (customText: string) => {
    setTestType('custom');
    setLatestResult(null);
    const clean = normalizeText(customText);
    setRawTargetText(clean);
    setCurrentStudyText(null);
    engine.restartTest();
    setTimeout(() => {
      engine.textareaRef.current?.focus({ preventScroll: true });
      engine.setIsFocused(true);
    }, 0);
  };

  // Próximo caractere a digitar para o teclado virtual
  const nextExpectedChar = rawTargetText[engine.userInput.length] || '';

  // Modo foco: esmaecimento dos controles durante a digitação com volta ao mover o mouse
  const [mouseAwakeOnTyping, setMouseAwakeOnTyping] = useState(false);
  const lastMouseTypingMoveRef = useRef<number>(0);
  const mouseTypingTimerRef = useRef<any>(null);

  useEffect(() => {
    const isTypingActive = engine.isRunning && !engine.isFinished;
    if (!isTypingActive || !settings.hideUiOnTyping) {
      setMouseAwakeOnTyping(false);
      return;
    }

    const handleMouseMove = () => {
      const now = performance.now();
      // Throttle de ~100 ms
      if (now - lastMouseTypingMoveRef.current < 100) return;
      lastMouseTypingMoveRef.current = now;

      setMouseAwakeOnTyping(true);
      if (mouseTypingTimerRef.current) clearTimeout(mouseTypingTimerRef.current);
      mouseTypingTimerRef.current = setTimeout(() => {
        setMouseAwakeOnTyping(false);
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTypingTimerRef.current) clearTimeout(mouseTypingTimerRef.current);
    };
  }, [engine.isRunning, engine.isFinished, settings.hideUiOnTyping]);

  // Ao digitar qualquer nova tecla, volta a esmaecer se o mouse estava parado
  useEffect(() => {
    if (mouseAwakeOnTyping && engine.isRunning && !engine.isFinished) {
      setMouseAwakeOnTyping(false);
    }
  }, [engine.userInput]);

  const isUiFaded = settings.hideUiOnTyping && engine.isRunning && !engine.isFinished && !mouseAwakeOnTyping;

  return (
    <div key={settings.language} className="min-h-screen flex flex-col bg-app text-ink transition-colors">
      
      {/* Cabeçalho */}
      <Header
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === 'test' && !latestResult) {
            engine.focusInput();
          }
        }}
        settings={settings}
        onUpdateSettings={updateSettings}
        isTypingFocus={engine.isRunning && !engine.isFinished}
      />

      {/* Conteúdo Principal */}
      <main 
        className={`flex-1 flex flex-col ${
          activeTab === 'test' && !latestResult 
            ? 'justify-center items-center py-2 overflow-hidden' 
            : 'justify-start py-6'
        } px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full`}
        style={{
          minHeight: 'calc(100vh - 56px)',
        }}
      >
        
        {/* Aviso de teclado físico em dispositivos móveis [P0] */}
        <div className="md:hidden mb-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
          <Smartphone className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>{t.typingArea.smallScreenWarning}</span>
        </div>

        {/* TELA 1: TESTE E DIGITAÇÃO (ou RESULTADOS ao concluir) */}
        {activeTab === 'test' && (
          <>
            {latestResult ? (
              <ResultsView
                result={latestResult}
                isNewRecord={isNewRecord}
                studyText={currentStudyText}
                onRetry={handleRetrySameText}
                onNewText={() => startNewText()}
                onViewStats={() => setActiveTab('stats')}
              />
            ) : (
              <div 
                className="w-full max-w-[960px] mx-auto my-auto flex flex-col justify-center"
                style={{ paddingBottom: '14vh' }}
              >
                
                {/* Linha Única Acima da Caixa (estilo Typing Core, 40px, a 12px da caixa) */}
                <TypingBar
                  settings={settings}
                  onUpdateSettings={updateSettings}
                  testType={testType}
                  onChangeTestType={handleChangeTestType}
                  durationMode={durationMode}
                  onChangeDurationMode={handleChangeDurationMode}
                  timeSeconds={timeSeconds}
                  onChangeTimeSeconds={(sec) => {
                    setTimeSeconds(sec);
                    engine.restartTest();
                  }}
                  wordCount={wordCount}
                  onChangeWordCount={(w) => {
                    setWordCount(w);
                    startNewText();
                  }}
                  pageCount={pageCount}
                  onChangePageCount={(p) => {
                    setPageCount(p);
                    startNewText();
                  }}
                  category={category}
                  onChangeCategory={handleChangeCategory}
                  isStudyMode={isStudyMode}
                  onToggleStudyMode={handleToggleStudyMode}
                  onOpenCustomModal={() => setIsCustomModalOpen(true)}
                  isFaded={isUiFaded}
                >
                  <LiveStats
                    settings={settings}
                    liveWpm={engine.liveWpm}
                    liveAccuracy={engine.liveAccuracy}
                    elapsedSeconds={engine.elapsedSeconds}
                    timeLimitSeconds={timeSeconds}
                    durationMode={durationMode}
                    typedWords={engine.userInput.trim().split(/\s+/).filter(Boolean).length}
                    wordLimit={wordCount}
                    totalCharsTyped={engine.userInput.length}
                    targetTotalChars={rawTargetText.length}
                  />
                </TypingBar>

                {/* Área de Digitação Principal [P0] */}
                <TypingArea
                  targetText={rawTargetText}
                  userInput={engine.userInput}
                  settings={settings}
                  isFocused={engine.isFocused}
                  onFocus={engine.focusInput}
                  onBlur={() => engine.setIsFocused(false)}
                  shakeError={engine.shakeError}
                  ghostErrors={engine.ghostErrors}
                  onRemoveGhostError={engine.removeGhostError}
                  textareaRef={engine.textareaRef}
                  onKeyDown={engine.handleKeyDown}
                  onInput={engine.handleInput}
                  onCompositionStart={engine.handleCompositionStart}
                  onCompositionEnd={engine.handleCompositionEnd}
                  onPaste={engine.handlePaste}
                  onDrop={engine.handleDrop}
                  onRestart={engine.restartTest}
                  onNewText={() => startNewText()}
                  activeStudyText={currentStudyText}
                />

                {/* Botões de Ação (Alinhados à direita, esmaecem no modo foco) */}
                <div className={`mt-4 flex items-center justify-end transition-opacity duration-300 ${
                  isUiFaded ? 'opacity-10 pointer-events-none' : 'opacity-100'
                }`}>
                  <div className="flex items-center gap-[12px]">
                    <button
                      onClick={() => {
                        engine.restartTest();
                        setTimeout(() => {
                          engine.textareaRef.current?.focus({ preventScroll: true });
                          engine.setIsFocused(true);
                        }, 0);
                      }}
                      className="w-[140px] h-[40px] inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer whitespace-nowrap text-xs font-medium"
                      title={ui.app_reiniciar_esc}
                    >
                      <RotateCcw className="w-4 h-4 shrink-0" />
                      <span>{t.typingArea.restart}</span>
                    </button>
                    <button
                      onClick={() => {
                        startNewText();
                        setTimeout(() => {
                          engine.textareaRef.current?.focus({ preventScroll: true });
                          engine.setIsFocused(true);
                        }, 0);
                      }}
                      className="w-[140px] h-[40px] inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs cursor-pointer whitespace-nowrap text-xs font-medium"
                      title={ui.app_novo_texto_tab_enter}
                    >
                      <Shuffle className="w-4 h-4 shrink-0" />
                      <span>{t.typingArea.newText}</span>
                    </button>
                  </div>
                </div>

                {/* Teclado Virtual na Tela [P2, Opcional] */}
                {settings.virtualKeyboard && (
                  <VirtualKeyboard nextChar={nextExpectedChar} />
                )}

              </div>
            )}
          </>
        )}

        {/* TELA 2: BIBLIOTECA DE TEXTOS */}
        {activeTab === 'library' && (
          <LibraryView
            onSelectText={(selectedText) => {
              setTestType('library');
              setCategory(selectedText.category);
              setActiveTab('test');
              startNewText(selectedText);
            }}
          />
        )}

        {/* TELA 3: ESTATÍSTICAS E HISTÓRICO */}
        {activeTab === 'stats' && (
          <StatsView
            onStartNewTest={() => {
              setActiveTab('test');
              startNewText();
            }}
          />
        )}

        {/* TELA 4: CONFIGURAÇÕES */}
        {activeTab === 'settings' && (
          <SettingsModal
            settings={settings}
            onUpdateSettings={updateSettings}
            onResetDefaults={resetToDefaults}
          />
        )}

      </main>

      {/* Modal de Texto Customizado */}
      <CustomTextModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSubmit={handleCustomTextSubmit}
      />

      {/* Modal de Leitura Prévia no Modo Estudo */}
      {currentStudyText && (
        <StudyPreviewModal
          studyText={currentStudyText}
          isOpen={isPriorReadingOpen}
          onReady={() => {
            setIsPriorReadingOpen(false);
            engine.focusInput();
          }}
          onClose={() => {
            setIsPriorReadingOpen(false);
            engine.focusInput();
          }}
        />
      )}

    </div>
  );
}
