import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Settings, 
  TestDurationMode, 
  KeystrokeLog, 
  TestResult, 
  TestType,
  WrongLetterMode 
} from '../types';
import { calculateMetrics } from '../utils/metrics';
import { soundService } from '../services/soundService';

export interface GhostError {
  id: number;
  char: string;
  expectedChar: string;
  position: number;
  mode: WrongLetterMode;
}

interface UseTypingEngineProps {
  targetText: string;
  settings: Settings;
  testType: TestType;
  durationMode: TestDurationMode;
  timeLimitSeconds: number;
  wordLimit: number;
  category?: string;
  textTitle?: string;
  textId?: string;
  isStudyMode: boolean;
  onNeedMoreText?: () => void;
  onFinish?: (result: TestResult) => void;
}

export function useTypingEngine({
  targetText,
  settings,
  testType,
  durationMode,
  timeLimitSeconds,
  wordLimit,
  category,
  textTitle,
  textId,
  isStudyMode,
  onNeedMoreText,
  onFinish,
}: UseTypingEngineProps) {
  // Estado do texto digitado
  const [userInput, setUserInput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(true);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Fantasmas de erro visual (máximo 6 simultâneos)
  const [ghostErrors, setGhostErrors] = useState<GhostError[]>([]);
  const [shakeError, setShakeError] = useState<boolean>(false);

  // Registro de contadores
  const [errorsCount, setErrorsCount] = useState<number>(0);
  const [correctionsCount, setCorrectionsCount] = useState<number>(0);
  const [timeline, setTimeline] = useState<{ second: number; wpm: number; rawWpm: number; errors: number }[]>([]);

  // REFS ESTÁVEIS (Nenhuma tecla recria o cronômetro)
  const startTimeRef = useRef<number | null>(null);
  const accumulatedPausesRef = useRef<number>(0);
  const pauseStartTimeRef = useRef<number | null>(null);
  const timerIntervalRef = useRef<any>(null);

  const userInputRef = useRef<string>('');
  userInputRef.current = userInput;

  const errorsCountRef = useRef<number>(0);
  errorsCountRef.current = errorsCount;

  const correctionsCountRef = useRef<number>(0);
  correctionsCountRef.current = correctionsCount;

  const targetTextRef = useRef<string>(targetText);
  targetTextRef.current = targetText;

  const durationModeRef = useRef<TestDurationMode>(durationMode);
  durationModeRef.current = durationMode;

  const timeLimitSecondsRef = useRef<number>(timeLimitSeconds);
  timeLimitSecondsRef.current = timeLimitSeconds;

  const isFocusedRef = useRef<boolean>(isFocused);
  isFocusedRef.current = isFocused;

  const settingsRef = useRef<Settings>(settings);
  settingsRef.current = settings;

  const isComposingRef = useRef<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const keystrokesRef = useRef<KeystrokeLog[]>([]);
  const mistypedKeysRef = useRef<Map<string, { expected: string; typed: string; count: number }>>(new Map());
  const finishedRef = useRef<boolean>(false);
  const lastSampleSecondRef = useRef<number>(-1);
  const ghostTimeoutsRef = useRef<Map<number, number>>(new Map());

  // Limpeza de timeouts de fantasmas ao desmontar
  useEffect(() => {
    return () => {
      ghostTimeoutsRef.current.forEach((t) => clearTimeout(t));
      ghostTimeoutsRef.current.clear();
    };
  }, []);

  // Foco
  const focusInput = useCallback(() => {
    if (textareaRef.current && !finishedRef.current) {
      textareaRef.current.focus();
      setIsFocused(true);
    }
  }, []);

  // Remover fantasma após término da animação ou timeout
  const removeGhostError = useCallback((id: number) => {
    const timerId = ghostTimeoutsRef.current.get(id);
    if (timerId) {
      clearTimeout(timerId);
      ghostTimeoutsRef.current.delete(id);
    }
    setGhostErrors((prev) => prev.filter((g) => g.id !== id));
  }, []);

  // Finalizar teste e compilar resultados
  const completeTest = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsRunning(false);
    setIsFinished(true);

    if (settingsRef.current.completionSound) {
      soundService.playCompletionSound();
    }

    const currentTarget = targetTextRef.current;
    const currentInput = userInputRef.current;
    const isTimeMode = durationModeRef.current === 'time';
    const configuredLimit = timeLimitSecondsRef.current;

    // Tempo medido em segundos de alta resolução
    const now = performance.now();
    const start = startTimeRef.current || now;
    const realElapsedSeconds = Math.max(0.1, (now - start - accumulatedPausesRef.current) / 1000);

    // Validação da duração: diverge em mais de 2s da duração configurada?
    const isDurationValid = isTimeMode
      ? Math.abs(realElapsedSeconds - configuredLimit) <= 2.0
      : true;

    // Para o cálculo oficial em testes com tempo, usa a duração exata configurada
    const calculationElapsedSeconds = isTimeMode ? configuredLimit : Math.max(1, Math.round(realElapsedSeconds));

    const grossStrokes = keystrokesRef.current.length;
    let netStrokes = 0;
    const minLen = Math.min(currentInput.length, currentTarget.length);
    for (let i = 0; i < minLen; i++) {
      if (currentInput[i] === currentTarget[i]) {
        netStrokes++;
      }
    }

    const calculated = calculateMetrics({
      grossStrokes,
      netStrokes,
      errorsCount: errorsCountRef.current,
      correctionsCount: correctionsCountRef.current,
      elapsedSeconds: calculationElapsedSeconds,
    });

    const wordsTyped = currentInput.trim().split(/\s+/).filter(Boolean).length;
    const charsTyped = currentInput.length;
    const mistypedList = Array.from(mistypedKeysRef.current.values()).sort((a, b) => b.count - a.count);

    const testResult: TestResult = {
      id: `res-${Date.now()}`,
      date: new Date().toISOString(),
      testType,
      durationMode: durationModeRef.current,
      category,
      textTitle,
      textId,
      elapsedSeconds: calculationElapsedSeconds,
      netWpm: calculated.netWpm,
      grossWpm: calculated.grossWpm,
      accuracy: calculated.accuracy,
      netStrokes: calculated.netStrokes,
      grossStrokes: calculated.grossStrokes,
      errorsCount: errorsCountRef.current,
      correctionsCount: correctionsCountRef.current,
      totalStrokes: calculated.totalStrokes,
      wordsTyped,
      charsTyped,
      wpmTimeline: timeline.length > 0 ? timeline : [
        { second: calculationElapsedSeconds, wpm: calculated.netWpm, rawWpm: calculated.grossWpm, errors: errorsCountRef.current }
      ],
      mistypedKeys: mistypedList,
      isStudyMode,
      isValid: isDurationValid,
    };

    if (onFinish) {
      onFinish(testResult);
    }
  }, [testType, category, textTitle, textId, isStudyMode, timeline, onFinish]);

  // Reiniciar teste com o mesmo texto
  const restartTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    finishedRef.current = false;
    userInputRef.current = '';
    errorsCountRef.current = 0;
    correctionsCountRef.current = 0;
    startTimeRef.current = null;
    accumulatedPausesRef.current = 0;
    pauseStartTimeRef.current = null;
    lastSampleSecondRef.current = -1;
    keystrokesRef.current = [];
    mistypedKeysRef.current.clear();

    setUserInput('');
    setIsRunning(false);
    setIsFinished(false);
    setElapsedSeconds(0);
    setErrorsCount(0);
    setCorrectionsCount(0);
    setTimeline([]);
    ghostTimeoutsRef.current.forEach((t) => clearTimeout(t));
    ghostTimeoutsRef.current.clear();
    setGhostErrors([]);
    setShakeError(false);

    if (textareaRef.current) {
      textareaRef.current.value = '';
      textareaRef.current.focus();
    }
    setIsFocused(true);
  }, []);

  // Gerenciamento de pausa por desfoque em testes sem tempo
  useEffect(() => {
    if (!isRunning || isFinished || durationMode === 'time') return;

    if (!isFocused) {
      pauseStartTimeRef.current = performance.now();
    } else if (pauseStartTimeRef.current !== null) {
      accumulatedPausesRef.current += (performance.now() - pauseStartTimeRef.current);
      pauseStartTimeRef.current = null;
    }
  }, [isFocused, isRunning, isFinished, durationMode]);

  // CRONÔMETRO ESTÁVEL: criado UMA ÚNICA VEZ ao iniciar o teste
  // Nunca é recriado por teclas digitadas!
  useEffect(() => {
    if (isRunning && !isFinished) {
      // Dispara a cada ~100ms para medição precisa e suave
      timerIntervalRef.current = setInterval(() => {
        if (finishedRef.current || !startTimeRef.current) return;

        // Se estiver pausado por perda de foco em testes sem tempo, ignora avanço
        if (durationModeRef.current !== 'time' && !isFocusedRef.current) {
          return;
        }

        const now = performance.now();
        const totalElapsedMs = now - startTimeRef.current - accumulatedPausesRef.current;
        const totalElapsedSec = Math.max(0, totalElapsedMs / 1000);
        const wholeSeconds = Math.floor(totalElapsedSec);

        // Atualiza cronômetro na tela
        setElapsedSeconds(wholeSeconds);

        // Amostra timeline para o gráfico (uma vez por segundo inteiro)
        if (wholeSeconds > lastSampleSecondRef.current && wholeSeconds >= 1) {
          lastSampleSecondRef.current = wholeSeconds;

          const grossStrokes = keystrokesRef.current.length;
          let netStrokes = 0;
          const currInput = userInputRef.current;
          const currTarget = targetTextRef.current;
          for (let i = 0; i < currInput.length; i++) {
            if (currInput[i] === currTarget[i]) netStrokes++;
          }

          const m = calculateMetrics({
            grossStrokes,
            netStrokes,
            errorsCount: errorsCountRef.current,
            correctionsCount: correctionsCountRef.current,
            elapsedSeconds: wholeSeconds,
          });

          setTimeline((prev) => [
            ...prev,
            { second: wholeSeconds, wpm: m.netWpm, rawWpm: m.grossWpm, errors: errorsCountRef.current },
          ]);
        }

        // Em testes com tempo: encerra IMEDIATAMENTE ao atingir a duração
        if (durationModeRef.current === 'time' && totalElapsedSec >= timeLimitSecondsRef.current) {
          completeTest();
        }
      }, 100);
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isRunning, isFinished, completeTest]);

  // Encontra início da palavra atual
  const getCurrentWordStartIndex = useCallback((input: string) => {
    const lastSpace = input.lastIndexOf(' ');
    return lastSpace === -1 ? 0 : lastSpace + 1;
  }, []);

  // Verifica se há erro na palavra atual
  const currentWordHasError = useCallback((input: string, target: string) => {
    const startIndex = getCurrentWordStartIndex(input);
    for (let i = startIndex; i < input.length; i++) {
      if (input[i] !== target[i]) {
        return true;
      }
    }
    return false;
  }, [getCurrentWordStartIndex]);

  // Registra erro com feedback visual e sonoro
  const triggerErrorFeedback = useCallback((expected: string, typed: string, pos: number) => {
    errorsCountRef.current += 1;
    setErrorsCount(errorsCountRef.current);

    // Toca SOMENTE o som de erro (sem o som de tecla)
    if (settingsRef.current.errorSound) {
      soundService.playErrorSound();
    }

    // Tremor sutil se habilitado
    if (settingsRef.current.errorShake) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 150);
    }

    // Registra fantasma para a camada flutuante de animação
    const mode = settingsRef.current.wrongLetterMode || 'jump';
    if (mode !== 'off') {
      const displayTyped = typed === ' ' ? '␣' : typed;
      const displayExpected = expected === ' ' ? '␣' : expected;
      const ghostId = Date.now() + Math.random();

      // Timeout de segurança: remove o fantasma após 1000ms
      const timeoutId = window.setTimeout(() => {
        setGhostErrors((prev) => prev.filter((g) => g.id !== ghostId));
        ghostTimeoutsRef.current.delete(ghostId);
      }, 1000);
      ghostTimeoutsRef.current.set(ghostId, timeoutId);

      setGhostErrors((prev) => [
        ...prev.slice(-5), // mantém no máximo 6
        {
          id: ghostId,
          char: displayTyped,
          expectedChar: displayExpected,
          position: pos,
          mode,
        },
      ]);
    }

    // Estatísticas de teclas mais erradas
    const keyKey = `${expected}__${typed}`;
    const existing = mistypedKeysRef.current.get(keyKey);
    if (existing) {
      existing.count += 1;
    } else {
      mistypedKeysRef.current.set(keyKey, { expected, typed, count: 1 });
    }

    keystrokesRef.current.push({
      timestamp: startTimeRef.current ? Math.round(performance.now() - startTimeRef.current) : 0,
      expectedChar: expected,
      typedChar: typed,
      isCorrect: false,
      position: pos,
    });
  }, []);

  // Trata tecla Backspace e atalhos
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (finishedRef.current) {
      e.preventDefault();
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      restartTest();
      return;
    }

    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
      return;
    }

    // Backspace
    if (e.key === 'Backspace') {
      if (!settingsRef.current.allowBackspace || userInput.length === 0) {
        e.preventDefault();
        return;
      }

      const wordStart = getCurrentWordStartIndex(userInput);

      // Bloquear voltar para palavras anteriores
      if (settingsRef.current.blockPastWords && userInput.length <= wordStart) {
        e.preventDefault();
        return;
      }

      // Som sutil de backspace
      if (settingsRef.current.keySound) {
        soundService.playKeySound('backspace');
      }

      // Ctrl + Backspace: apaga até o início da palavra
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const deleteCount = userInput.length - wordStart;
        if (deleteCount > 0) {
          const next = userInput.slice(0, wordStart);
          setUserInput(next);
          userInputRef.current = next;
          correctionsCountRef.current += 1;
          setCorrectionsCount(correctionsCountRef.current);
          if (textareaRef.current) textareaRef.current.value = next;
        }
        return;
      }

      // Backspace de 1 caractere
      e.preventDefault();
      const next = userInput.slice(0, -1);
      setUserInput(next);
      userInputRef.current = next;
      correctionsCountRef.current += 1;
      setCorrectionsCount(correctionsCountRef.current);
      if (textareaRef.current) textareaRef.current.value = next;
      return;
    }

    // Exigir correção por palavra: espaço bloqueado se houver erro
    if (e.key === ' ' && settingsRef.current.errorBehavior === 'require_word_correction') {
      if (currentWordHasError(userInput, targetText)) {
        e.preventDefault();
        const expected = targetText[userInput.length] || '';
        triggerErrorFeedback(expected, '␣', userInput.length);
        return;
      }
    }
  }, [
    userInput,
    targetText,
    getCurrentWordStartIndex,
    currentWordHasError,
    triggerErrorFeedback,
    restartTest,
  ]);

  // Trata inserção de caracteres via evento input
  const handleInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    if (finishedRef.current || isComposingRef.current) return;

    const nativeEvent = e.nativeEvent as InputEvent;
    if (nativeEvent.inputType === 'deleteContentBackward' || nativeEvent.inputType === 'deleteContentForward') {
      return;
    }

    const insertedText = nativeEvent.data;
    if (!insertedText) return;

    // Inicia cronômetro no primeiro caractere (performance.now() na ref)
    if (!isRunning && !startTimeRef.current) {
      startTimeRef.current = performance.now();
      accumulatedPausesRef.current = 0;
      setIsRunning(true);
    }

    let currentInput = userInputRef.current;
    const currentTarget = targetTextRef.current;

    for (let charIndex = 0; charIndex < insertedText.length; charIndex++) {
      if (finishedRef.current) break;

      const char = insertedText[charIndex];
      const currentPos = currentInput.length;
      const expectedChar = currentTarget[currentPos];

      if (!expectedChar) break; // Fim do texto

      const isCorrect = char === expectedChar;

      // 1. Comportamento 'stop_on_error': o cursor NÃO avança ao errar
      if (settingsRef.current.errorBehavior === 'stop_on_error') {
        if (!isCorrect) {
          triggerErrorFeedback(expectedChar, char, currentPos);
          if (textareaRef.current) textareaRef.current.value = currentInput;
          return;
        } else {
          // Tecla correta: toca som de tecla
          if (settingsRef.current.keySound) {
            soundService.playKeySound(char === ' ' ? 'space' : 'regular');
          }
          keystrokesRef.current.push({
            timestamp: startTimeRef.current ? Math.round(performance.now() - startTimeRef.current) : 0,
            expectedChar,
            typedChar: char,
            isCorrect: true,
            position: currentPos,
          });
          currentInput += char;
        }
      } 
      // 2. Comportamentos 'free' e 'require_word_correction': o cursor avança
      else {
        if (!isCorrect) {
          triggerErrorFeedback(expectedChar, char, currentPos);
        } else {
          if (settingsRef.current.keySound) {
            soundService.playKeySound(char === ' ' ? 'space' : 'regular');
          }
          keystrokesRef.current.push({
            timestamp: startTimeRef.current ? Math.round(performance.now() - startTimeRef.current) : 0,
            expectedChar,
            typedChar: char,
            isCorrect: true,
            position: currentPos,
          });
        }
        currentInput += char;
      }
    }

    setUserInput(currentInput);
    userInputRef.current = currentInput;
    if (textareaRef.current) textareaRef.current.value = currentInput;

    // Verifica término por contagem de palavras
    if (durationModeRef.current === 'words' && wordLimit > 0) {
      const wordsCount = currentInput.trim().split(/\s+/).filter(Boolean).length;
      if (wordsCount >= wordLimit && (currentInput.endsWith(' ') || currentInput.length >= currentTarget.length)) {
        completeTest();
        return;
      }
    }

    // Verifica término por fim do texto nos modos sem tempo
    if (durationModeRef.current !== 'time' && currentInput.length >= currentTarget.length && currentTarget.length > 0) {
      completeTest();
      return;
    }

    // Em testes com tempo: se restam menos de 300 caracteres, anexa mais texto
    if (durationModeRef.current === 'time' && currentTarget.length - currentInput.length < 300) {
      if (onNeedMoreText) onNeedMoreText();
    }
  }, [
    isRunning,
    wordLimit,
    triggerErrorFeedback,
    completeTest,
    onNeedMoreText,
  ]);

  // Trata composição (ABNT2: teclas mortas ´ ~ ^ `)
  const handleCompositionStart = useCallback(() => {
    isComposingRef.current = true;
  }, []);

  const handleCompositionEnd = useCallback((e: React.CompositionEvent<HTMLTextAreaElement>) => {
    isComposingRef.current = false;
    const data = e.data;
    if (data) {
      const fakeEvent = {
        nativeEvent: {
          inputType: 'insertText',
          data,
        },
      } as unknown as React.FormEvent<HTMLTextAreaElement>;
      handleInput(fakeEvent);
    }
  }, [handleInput]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => e.preventDefault(), []);
  const handleDrop = useCallback((e: React.DragEvent) => e.preventDefault(), []);

  // Métricas em tempo real para os mostradores ao vivo
  const currentElapsed = Math.max(elapsedSeconds, 1);
  const liveGrossStrokes = keystrokesRef.current.length;
  let liveNetStrokes = 0;
  for (let i = 0; i < userInput.length; i++) {
    if (userInput[i] === targetText[i]) liveNetStrokes++;
  }
  const liveMetrics = calculateMetrics({
    grossStrokes: liveGrossStrokes,
    netStrokes: liveNetStrokes,
    errorsCount,
    correctionsCount,
    elapsedSeconds: currentElapsed,
  });

  return {
    userInput,
    isRunning,
    isFinished,
    isFocused,
    setIsFocused,
    focusInput,
    elapsedSeconds,
    errorsCount,
    correctionsCount,
    liveWpm: liveMetrics.netWpm,
    liveAccuracy: liveMetrics.accuracy,
    ghostErrors,
    removeGhostError,
    shakeError,
    textareaRef,
    handleKeyDown,
    handleInput,
    handleCompositionStart,
    handleCompositionEnd,
    handlePaste,
    handleDrop,
    restartTest,
    completeTest,
  };
}
