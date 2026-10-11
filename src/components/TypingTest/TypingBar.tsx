import React, { useState, useRef, useEffect } from 'react';
import { 
  Clock, 
  GraduationCap, 
  SlidersHorizontal, 
  ChevronDown,
  Check,
  Volume2,
  VolumeX,
  Type
} from 'lucide-react';
import { 
  TestType, 
  TestDurationMode, 
  TextCategory,
  Settings,
  ErrorBehavior
} from '../../types';
import { CATEGORIES } from '../../data/categories';
import { t } from '../../i18n';

interface TypingBarProps {
  testType: TestType;
  onChangeTestType: (type: TestType) => void;
  durationMode: TestDurationMode;
  onChangeDurationMode: (mode: TestDurationMode) => void;
  timeSeconds: number;
  onChangeTimeSeconds: (sec: number) => void;
  wordCount: number;
  onChangeWordCount: (words: number) => void;
  pageCount: number;
  onChangePageCount: (pages: number) => void;
  category: TextCategory | 'Aleatório';
  onChangeCategory: (cat: TextCategory | 'Aleatório') => void;
  isStudyMode: boolean;
  onToggleStudyMode: () => void;
  onOpenCustomModal?: () => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  isFaded?: boolean;
  children?: React.ReactNode;
}

const TIME_OPTIONS = [15, 30, 60, 120, 180, 300, 600];
const WORD_OPTIONS = [25, 50, 100, 200, 300];
const PAGE_OPTIONS = [1, 2, 3, 5];

export const TypingBar: React.FC<TypingBarProps> = ({
  testType,
  onChangeTestType,
  durationMode,
  onChangeDurationMode,
  timeSeconds,
  onChangeTimeSeconds,
  wordCount,
  onChangeWordCount,
  pageCount,
  onChangePageCount,
  category,
  onChangeCategory,
  isStudyMode,
  onToggleStudyMode,
  onOpenCustomModal,
  settings,
  onUpdateSettings,
  isFaded = false,
  children,
}) => {
  // Popovers abertos
  const [isDurationOpen, setIsDurationOpen] = useState(false);
  const [durationTab, setDurationTab] = useState<TestDurationMode>(durationMode);
  const [customMinutesInput, setCustomMinutesInput] = useState('');
  const [isQuickOptionsOpen, setIsQuickOptionsOpen] = useState(false);

  const durationPopoverRef = useRef<HTMLDivElement | null>(null);
  const quickOptionsRef = useRef<HTMLDivElement | null>(null);

  // Fecha popovers ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (durationPopoverRef.current && !durationPopoverRef.current.contains(e.target as Node)) {
        setIsDurationOpen(false);
      }
      if (quickOptionsRef.current && !quickOptionsRef.current.contains(e.target as Node)) {
        setIsQuickOptionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Formatação do rótulo atual de duração
  const getDurationLabel = () => {
    if (durationMode === 'time') {
      return timeSeconds >= 60 ? `${timeSeconds / 60} min` : `${timeSeconds}s`;
    }
    if (durationMode === 'words') {
      return `${wordCount} palavras`;
    }
    if (durationMode === 'pages') {
      return `${pageCount} ${pageCount === 1 ? 'página' : 'páginas'}`;
    }
    return 'Texto completo';
  };

  const handleApplyCustomMinutes = () => {
    const mins = parseFloat(customMinutesInput);
    if (!isNaN(mins) && mins > 0) {
      onChangeDurationMode('time');
      onChangeTimeSeconds(Math.round(mins * 60));
      setIsDurationOpen(false);
      setCustomMinutesInput('');
    }
  };

  return (
    <div className="w-full flex items-center justify-between text-sm text-slate-700 dark:text-slate-300 select-none mb-3 min-h-[40px] flex-wrap sm:flex-nowrap gap-y-2">
      
      {/* Grupo Esquerdo: Tipo, Duração e Área (Botões de 40px de altura com 10px de espaçamento, esmaece no foco) */}
      <div className={`flex items-center gap-[10px] flex-wrap transition-opacity duration-300 ${isFaded ? 'opacity-10 pointer-events-none' : 'opacity-100'}`}>
        
        {/* Seletor Tipo (Menu suspenso com aparência de botão de 40px) */}
        <div className="relative">
          <select
            value={testType}
            onChange={(e) => {
              const val = e.target.value as TestType;
              if (val === 'custom') {
                if (onOpenCustomModal) onOpenCustomModal();
              } else {
                onChangeTestType(val);
              }
            }}
            aria-label="Tipo de teste"
            className="h-[40px] appearance-none bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-[10px] py-2 pl-[14px] pr-8 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer transition-colors shadow-2xs"
          >
            <option value="library" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Texto da biblioteca</option>
            <option value="common_words" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Palavras comuns</option>
            <option value="no_accents" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Sem acentos</option>
            <option value="alphabet" className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">Alfabeto</option>
            <option value="numbers" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Números</option>
            <option value="custom" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Customizado...</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Seletor Duração (Popover unificado com abas) */}
        <div className="relative" ref={durationPopoverRef}>
          <button
            type="button"
            aria-expanded={isDurationOpen}
            onClick={() => {
              setDurationTab(durationMode);
              setIsDurationOpen(!isDurationOpen);
            }}
            className={`h-[40px] flex items-center gap-2 border rounded-[10px] py-2 px-[14px] text-sm font-medium cursor-pointer transition-colors shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${
              isDurationOpen
                ? 'bg-slate-100 dark:bg-white/[0.10] border-slate-300 dark:border-white/20 text-slate-900 dark:text-white'
                : 'bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.08] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-800 dark:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{getDurationLabel()}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDurationOpen && (
            <div className="absolute left-0 mt-1.5 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 z-50 text-xs animate-in fade-in duration-150">
              {/* Abas do Popover de Duração */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-3">
                <button
                  onClick={() => setDurationTab('time')}
                  className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                    durationTab === 'time'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Tempo
                </button>
                <button
                  onClick={() => setDurationTab('words')}
                  className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                    durationTab === 'words'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Palavras
                </button>
                <button
                  onClick={() => setDurationTab('pages')}
                  className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                    durationTab === 'pages'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Páginas
                </button>
                {testType === 'library' && (
                  <button
                    onClick={() => {
                      onChangeDurationMode('full_text');
                      setIsDurationOpen(false);
                    }}
                    className={`flex-1 py-1 rounded-lg font-medium transition-colors cursor-pointer text-center ${
                      durationMode === 'full_text'
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Completo
                  </button>
                )}
              </div>

              {/* Opções da Aba Tempo */}
              {durationTab === 'time' && (
                <div className="space-y-2.5">
                  <div className="grid grid-cols-4 gap-1.5">
                    {TIME_OPTIONS.map((sec) => (
                      <button
                        key={sec}
                        onClick={() => {
                          onChangeDurationMode('time');
                          onChangeTimeSeconds(sec);
                          setIsDurationOpen(false);
                        }}
                        className={`py-1.5 rounded-lg font-medium text-center transition-colors cursor-pointer ${
                          durationMode === 'time' && timeSeconds === sec
                            ? 'bg-blue-600 text-white font-bold'
                            : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {sec >= 60 ? `${sec / 60}m` : `${sec}s`}
                      </button>
                    ))}
                  </div>

                  {/* Tempo customizado em minutos */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      placeholder="Minutos"
                      value={customMinutesInput}
                      onChange={(e) => setCustomMinutesInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomMinutes()}
                      className="flex-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white outline-none"
                    />
                    <button
                      onClick={handleApplyCustomMinutes}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}

              {/* Opções da Aba Palavras */}
              {durationTab === 'words' && (
                <div className="grid grid-cols-3 gap-1.5">
                  {WORD_OPTIONS.map((w) => (
                    <button
                      key={w}
                      onClick={() => {
                        onChangeDurationMode('words');
                        onChangeWordCount(w);
                        setIsDurationOpen(false);
                      }}
                      className={`py-1.5 rounded-lg font-medium text-center transition-colors cursor-pointer ${
                        durationMode === 'words' && wordCount === w
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {w} pal.
                    </button>
                  ))}
                </div>
              )}

              {/* Opções da Aba Páginas */}
              {durationTab === 'pages' && (
                <div className="grid grid-cols-2 gap-1.5">
                  {PAGE_OPTIONS.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        onChangeDurationMode('pages');
                        onChangePageCount(p);
                        setIsDurationOpen(false);
                      }}
                      className={`py-1.5 rounded-lg font-medium text-center transition-colors cursor-pointer ${
                        durationMode === 'pages' && pageCount === p
                          ? 'bg-blue-600 text-white font-bold'
                          : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {p} {p === 1 ? 'página' : 'páginas'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Seletor Área (menu suspenso em formato de botão, só se tipo for 'library') */}
        {testType === 'library' && (
          <div className="relative">
            <select
              value={category}
              onChange={(e) => onChangeCategory(e.target.value as any)}
              aria-label="Área temática"
              className="h-[40px] appearance-none bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.08] border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 rounded-[10px] py-2 pl-[14px] pr-8 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 cursor-pointer transition-colors shadow-2xs"
            >
              <option value="Aleatório" className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">Área: Aleatório</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.name} value={cat.name} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

      </div>

      {/* Grupo Direito: Modo Estudo, Opções Rápidas e Contador (Alinhados à direita, altura 40px) */}
      <div className="flex items-center justify-end shrink-0 ml-auto sm:ml-0">
        
        {/* Subgrupo Botões: Estudo e Opções Rápidas (esmaecem no modo foco) */}
        <div className={`flex items-center gap-[10px] transition-opacity duration-300 ${isFaded ? 'opacity-10 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Alternador Modo Estudo (Botão estilizado com altura 40px) */}
        {(() => {
          const isLibrary = testType === 'library';
          const isActive = isLibrary && isStudyMode;
          const buttonTitle = !isLibrary
            ? 'Disponível para textos da biblioteca'
            : isActive
            ? 'Modo Estudo ativado (quiz e pontos-chave)'
            : 'Ativar Modo Estudo';

          let buttonClasses = 'h-[40px] flex items-center gap-2 px-[14px] rounded-[10px] border text-sm font-medium transition-colors shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ';

          if (!isLibrary) {
            buttonClasses += 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-500';
          } else if (isActive) {
            buttonClasses += 'cursor-pointer bg-blue-600/15 text-blue-600 dark:text-blue-400 border-blue-500/30 font-semibold';
          } else {
            buttonClasses += 'cursor-pointer bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.08] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300';
          }

          return (
            <button
              onClick={isLibrary ? onToggleStudyMode : undefined}
              disabled={!isLibrary}
              aria-pressed={isActive}
              className={buttonClasses}
              title={buttonTitle}
            >
              <GraduationCap className="w-4 h-4" />
              <span className="hidden sm:inline">Estudo</span>
              <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-blue-600 dark:bg-blue-400' : 'bg-transparent'}`} />
            </button>
          );
        })()}

        {/* Ícone Opções Rápidas (Botão quadrado 40x40px) */}
        <div className="relative" ref={quickOptionsRef}>
          <button
            onClick={() => setIsQuickOptionsOpen(!isQuickOptionsOpen)}
            aria-expanded={isQuickOptionsOpen}
            className={`w-[40px] h-[40px] inline-flex items-center justify-center rounded-[10px] border transition-colors cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-500 outline-none ${
              isQuickOptionsOpen
                ? 'bg-slate-100 dark:bg-white/[0.10] border-slate-300 dark:border-white/20 text-slate-900 dark:text-white'
                : 'bg-white dark:bg-white/[0.05] hover:bg-slate-50 dark:hover:bg-white/[0.08] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 text-slate-700 dark:text-slate-300'
            }`}
            title="Ajustes rápidos de digitação e aparência"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {isQuickOptionsOpen && (
            <div className="absolute right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3.5 z-50 text-xs space-y-3.5 animate-in fade-in duration-150">
              <div className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
                Ajustes Rápidos
              </div>

              {/* Tamanho da Fonte */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Tamanho da fonte</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{settings.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="40"
                  step="1"
                  value={settings.fontSize}
                  onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Linhas Visíveis */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Linhas visíveis</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{settings.visibleLines}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="5"
                  step="1"
                  value={settings.visibleLines}
                  onChange={(e) => onUpdateSettings({ visibleLines: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Comportamento ao Errar */}
              <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <label className="text-slate-500 block">Ao errar:</label>
                <select
                  value={settings.errorBehavior}
                  onChange={(e) => onUpdateSettings({ errorBehavior: e.target.value as ErrorBehavior })}
                  className="w-full p-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="free">Livre (avança, Backspace)</option>
                  <option value="stop_on_error">Parar no erro (não avança)</option>
                  <option value="require_word_correction">Exigir correção por palavra</option>
                </select>
              </div>

              {/* Sons Rápidos */}
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-slate-600 dark:text-slate-400">Som geral</span>
                <button
                  onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                  className={`p-1 rounded-md transition-colors ${
                    settings.soundEnabled ? 'text-blue-600 bg-blue-50 dark:bg-blue-950/40' : 'text-slate-400'
                  }`}
                >
                  {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Esconder UI ao digitar */}
              <label className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 cursor-pointer">
                <span className="text-slate-600 dark:text-slate-400">Foco automático</span>
                <input
                  type="checkbox"
                  checked={settings.hideUiOnTyping}
                  onChange={(e) => onUpdateSettings({ hideUiOnTyping: e.target.checked })}
                  className="w-3.5 h-3.5 accent-blue-600 rounded cursor-pointer"
                />
              </label>

            </div>
          )}
        </div>

        </div>

        {/* Contador / Estatísticas ao vivo (16px de espaço do grupo de botões, centralizado verticalmente, sem esmaecer) */}
        {children && (
          <div className="ml-4 flex items-center shrink-0">
            {children}
          </div>
        )}

      </div>

    </div>
  );
};
