import React, { useRef } from 'react';
import { 
  Settings as SettingsIcon, 
  RotateCcw, 
  Download, 
  Upload, 
  Eye, 
  Sparkles, 
  Volume2, 
  VolumeX,
  Palette, 
  Keyboard, 
  Check, 
  Zap, 
  Sliders, 
  HelpCircle, 
  X,
  Play
} from 'lucide-react';
import { 
  Settings, 
  AccentColor, 
  FontFamily, 
  CaretStyle, 
  ErrorBehavior, 
  WrongLetterMode,
  KeySoundProfile,
  ErrorSoundProfile
} from '../../types';
import { soundService } from '../../services/soundService';
import { ShortcutsInfo } from './ShortcutsInfo';
import { t } from '../../i18n';

interface SettingsModalProps {
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  onResetDefaults: () => void;
  onApplyTypingCom: () => void;
  onApplyTypingCore: () => void;
  onApplyTotalFocus: () => void;
  onClose?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults,
  onApplyTypingCom,
  onApplyTypingCore,
  onApplyTotalFocus,
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Exportar configurações para arquivo JSON
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `digitamente_settings_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Importar configurações de arquivo JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        onUpdateSettings(parsed);
      } catch (err) {
        alert('Arquivo de configurações inválido.');
      }
    };
    reader.readAsText(file);
  };

  // Cores de destaque pré-definidas
  const ACCENT_COLORS: { id: AccentColor; name: string; bg: string }[] = [
    { id: 'blue', name: 'Azul', bg: 'bg-blue-600' },
    { id: 'emerald', name: 'Esmeralda', bg: 'bg-emerald-600' },
    { id: 'amber', name: 'Âmbar', bg: 'bg-amber-600' },
    { id: 'rose', name: 'Rosa', bg: 'bg-rose-600' },
    { id: 'violet', name: 'Violeta', bg: 'bg-violet-600' },
    { id: 'cyan', name: 'Ciano', bg: 'bg-cyan-600' },
  ];

  const getFontFamilyClass = (f: FontFamily) => {
    switch (f) {
      case 'mono': return 'font-mono';
      case 'serif': return 'font-serif';
      default: return 'font-sans';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-200">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <SettingsIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>{t.settings.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.settings.subtitle}
          </p>
        </div>

        {/* Botões de Ação Global (Restaurar, Exportar, Importar) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Restaurar valores padrão recomendados"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.settings.resetDefaults}</span>
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Baixar arquivo JSON das configurações"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar</span>
          </button>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>Importar</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Caixa de Pré-visualização em Tempo Real [P0] */}
      <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-3xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>{t.settings.previewTitle}</span>
          </span>
          <span>{settings.fontSize}px · {settings.fontFamily}</span>
        </div>

        <div 
          className={`p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 transition-all ${getFontFamilyClass(settings.fontFamily)} select-none`}
          style={{
            fontSize: `${settings.fontSize}px`,
            letterSpacing: `${settings.letterSpacing}px`,
            lineHeight: settings.lineHeight,
          }}
        >
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">A curiosidade</span>{' '}
          <span className="relative inline-block text-rose-600 dark:text-rose-400 font-medium bg-rose-500/15 rounded-xs">
            {settings.showWrongLetter && settings.wrongLetterStyle === 'above' && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-rose-600 pointer-events-none">
                x
              </span>
            )}
            {settings.showWrongLetter && settings.wrongLetterStyle === 'replace' ? 'x' : 'é'}
          </span>{' '}
          <span className="relative inline-block text-slate-400">
            o
            <span 
              className={`absolute top-0 bottom-0 ${
                settings.caretStyle === 'underline' 
                  ? 'left-0 right-0 border-b-2 border-blue-500' 
                  : settings.caretStyle === 'block'
                  ? 'left-0 right-0 bg-blue-500/30'
                  : 'left-0 border-l-2 border-blue-500'
              }`} 
            />
          </span>{' '}
          <span className="text-slate-400">primeiro passo para o conhecimento verdadeiro.</span>
        </div>
      </div>

      {/* Predefinições Rápidas de Um Clique */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {t.settings.sections.presets}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          <button
            onClick={onApplyTypingCom}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-blue-600 transition-colors">
              {t.settings.presets.typingCom}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.settings.presets.typingComDesc}
            </p>
          </button>

          <button
            onClick={onApplyTypingCore}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-blue-600 transition-colors">
              {t.settings.presets.typingCore}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.settings.presets.typingCoreDesc}
            </p>
          </button>

          <button
            onClick={onApplyTotalFocus}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 text-left transition-all shadow-2xs group cursor-pointer"
          >
            <div className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-blue-600 transition-colors">
              {t.settings.presets.totalFocus}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {t.settings.presets.totalFocusDesc}
            </p>
          </button>

        </div>
      </div>

      {/* SEÇÃO 1: DIGITAÇÃO & REGRAS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-blue-500" />
          <span>{t.settings.sections.typing}</span>
        </h3>

        {/* Comportamento ao errar */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            {t.settings.errorBehavior.label}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'free', label: 'Livre', desc: 'O cursor avança e o erro é marcado; corrija com Backspace.' },
              { id: 'stop_on_error', label: 'Parar no erro', desc: 'O cursor não avança até você digitar a tecla correta.' },
              { id: 'require_word_correction', label: 'Corrigir palavra', desc: 'O Espaço fica travado até você corrigir os erros da palavra.' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => onUpdateSettings({ errorBehavior: opt.id as ErrorBehavior })}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  settings.errorBehavior === opt.id
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 shadow-2xs font-medium'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="font-bold text-xs">{opt.label}</div>
                <div className="text-[11px] mt-1 leading-snug opacity-90">{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Toggles de Backspace e Pontuação */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                {t.settings.allowBackspace}
              </span>
              <span className="text-[11px] text-slate-400">
                {t.settings.allowBackspaceDesc}
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.allowBackspace}
              onChange={(e) => onUpdateSettings({ allowBackspace: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                {t.settings.blockPastWords}
              </span>
              <span className="text-[11px] text-slate-400">
                {t.settings.blockPastWordsDesc}
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.blockPastWords}
              onChange={(e) => onUpdateSettings({ blockPastWords: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Pontuação em palavras comuns
              </span>
              <span className="text-[11px] text-slate-400">
                Gera maiúsculas e vírgulas/pontos no modo de palavras frequentes.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.includePunctuationInWords}
              onChange={(e) => onUpdateSettings({ includePunctuationInWords: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          <ShortcutsInfo />

        </div>
      </div>

      {/* SEÇÃO 2: FEEDBACK SONORO & VISUAL */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-emerald-500" />
          <span>{t.settings.sections.feedback}</span>
        </h3>

        {/* Feedback Sonoro */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t.settings.sounds.main}
            </span>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => onUpdateSettings({ soundEnabled: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-700 dark:text-slate-300">{t.settings.sounds.error}</span>
              <input
                type="checkbox"
                disabled={!settings.soundEnabled}
                checked={settings.errorSound}
                onChange={(e) => onUpdateSettings({ errorSound: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-700 dark:text-slate-300">{t.settings.sounds.key}</span>
              <input
                type="checkbox"
                disabled={!settings.soundEnabled}
                checked={settings.keySound}
                onChange={(e) => onUpdateSettings({ keySound: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-700 dark:text-slate-300">{t.settings.sounds.completion}</span>
              <input
                type="checkbox"
                disabled={!settings.soundEnabled}
                checked={settings.completionSound}
                onChange={(e) => onUpdateSettings({ completionSound: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Perfis de Som e Controles de Volume Independentes */}
          <div className="pt-2 space-y-4">
            
            {/* Perfis de Som */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              
              {/* Perfil do Som de Tecla */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Perfil das Teclas
                  </span>
                  <button
                    type="button"
                    onClick={() => soundService.testKeySound(settings.keySoundProfile || 'mechanical')}
                    className="flex items-center gap-1 text-[11px] font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer"
                    title="Ouvir amostra do som da tecla"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Testar</span>
                  </button>
                </div>
                <select
                  value={settings.keySoundProfile || 'mechanical'}
                  onChange={(e) => {
                    const prof = e.target.value as KeySoundProfile;
                    onUpdateSettings({ keySoundProfile: prof });
                    soundService.setKeyProfile(prof);
                    soundService.testKeySound(prof);
                  }}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="mechanical">Mecânico (Thock autêntico)</option>
                  <option value="clicky">Clicky (Click agudo nítido)</option>
                  <option value="membrane">Suave / Membrana (Discreto)</option>
                </select>
              </div>

              {/* Perfil do Som de Erro */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Perfil do Erro
                  </span>
                  <button
                    type="button"
                    onClick={() => soundService.testErrorSound(settings.errorSoundProfile || 'buzzer')}
                    className="flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
                    title="Ouvir amostra do som de erro"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Testar</span>
                  </button>
                </div>
                <select
                  value={settings.errorSoundProfile || 'buzzer'}
                  onChange={(e) => {
                    const prof = e.target.value as ErrorSoundProfile;
                    onUpdateSettings({ errorSoundProfile: prof });
                    soundService.setErrorProfile(prof);
                    soundService.testErrorSound(prof);
                  }}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="buzzer">Buzzer (Grave descendente - padrão)</option>
                  <option value="descending_beep">Bipe Duplo Descendente (440Hz → 330Hz)</option>
                  <option value="dry_knock">Toc Seco (Percussivo curto)</option>
                </select>
              </div>

            </div>

            {/* Sliders de Volume Separados */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Volume Geral */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Volume Geral</span>
                  <span className="font-mono">{Math.round((settings.volume ?? 0.5) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.volume ?? 0.5}
                  onChange={(e) => onUpdateSettings({ volume: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Volume Teclas */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Volume das Teclas</span>
                  <span className="font-mono">{Math.round((settings.keyVolume ?? 0.7) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.keyVolume ?? 0.7}
                  onChange={(e) => onUpdateSettings({ keyVolume: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Volume Erro */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Volume do Erro</span>
                  <span className="font-mono">{Math.round((settings.errorVolume ?? 1.0) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.errorVolume ?? 1.0}
                  onChange={(e) => onUpdateSettings({ errorVolume: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />
              </div>
            </div>

          </div>
        </div>

        {/* Feedback Visual */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">
            Feedback Visual & Acessibilidade
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Modo da Letra Errada */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                    Modo da Tecla Errada
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Estilo visual ao pressionar tecla incorreta.
                  </span>
                </div>
              </div>
              <select
                value={settings.wrongLetterMode || 'jump'}
                onChange={(e) => {
                  const mode = e.target.value as WrongLetterMode;
                  onUpdateSettings({ 
                    wrongLetterMode: mode,
                    showWrongLetter: mode !== 'off',
                    wrongLetterStyle: mode === 'replace' ? 'replace' : 'above'
                  });
                }}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-200 outline-none"
              >
                <option value="jump">Salto animado (Padrão — flutua e sobe)</option>
                <option value="replace">Substituição temporária na linha</option>
                <option value="above">Pequena flutuante acima</option>
                <option value="off">Desativado (somente cor/fundo)</option>
              </select>
            </div>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {t.settings.visuals.capsLockWarning}
                </span>
                <span className="text-[11px] text-slate-400">
                  Avisa quando o Caps Lock estiver ativo.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.capsLockWarning}
                onChange={(e) => onUpdateSettings({ capsLockWarning: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {t.settings.visuals.colorblindMode}
                </span>
                <span className="text-[11px] text-slate-400">
                  Sublinhado ondulado em letras erradas.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.colorblindMode}
                onChange={(e) => onUpdateSettings({ colorblindMode: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {t.settings.visuals.errorShake}
                </span>
                <span className="text-[11px] text-slate-400">
                  Pequeno tremor sutil na tela ao errar.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.errorShake}
                onChange={(e) => onUpdateSettings({ errorShake: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Reduzir Animações
                </span>
                <span className="text-[11px] text-slate-400">
                  Transições instantâneas para maior fluidez.
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.reduceMotion}
                onChange={(e) => onUpdateSettings({ reduceMotion: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  {t.settings.visuals.hideUiOnTyping}
                </span>
                <span className="text-[11px] text-slate-400">
                  {t.settings.visuals.hideUiOnTypingDesc}
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.hideUiOnTyping}
                onChange={(e) => onUpdateSettings({ hideUiOnTyping: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>

          </div>
        </div>

        {/* Exibição ao vivo no teste */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
          <span className="font-bold text-slate-700 dark:text-slate-300 block">
            Mostradores ao Vivo Durante o Teste
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span>{t.settings.visuals.showLiveWpm}</span>
              <input
                type="checkbox"
                checked={settings.showLiveWpm}
                onChange={(e) => onUpdateSettings({ showLiveWpm: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span>{t.settings.visuals.showLiveAccuracy}</span>
              <input
                type="checkbox"
                checked={settings.showLiveAccuracy}
                onChange={(e) => onUpdateSettings({ showLiveAccuracy: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
              <span>{t.settings.visuals.showLiveTimer}</span>
              <input
                type="checkbox"
                checked={settings.showLiveTimer}
                onChange={(e) => onUpdateSettings({ showLiveTimer: e.target.checked })}
                className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

      </div>

      {/* SEÇÃO 3: APARÊNCIA & TIPOGRAFIA */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-violet-500" />
          <span>{t.settings.sections.appearance}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          {/* Fonte do Texto */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.settings.appearance.fontFamily}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sans', label: 'Sem serifa', font: 'font-sans' },
                { id: 'mono', label: 'Mono', font: 'font-mono' },
                { id: 'serif', label: 'Serifa', font: 'font-serif' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateSettings({ fontFamily: f.id as FontFamily })}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    settings.fontFamily === f.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className={`${f.font} text-sm block`}>Aa</span>
                  <span className="text-[11px] block mt-0.5">{f.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Estilo do Cursor (Caret) */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.settings.appearance.caretStyle}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'line', label: 'Linha fina' },
                { id: 'underline', label: 'Sublinhado' },
                { id: 'block', label: 'Bloco' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => onUpdateSettings({ caretStyle: c.id as CaretStyle })}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    settings.caretStyle === c.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className="text-[11px] block">{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cor de Destaque */}
          <div className="sm:col-span-2 pt-2">
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Cor de Destaque
            </label>
            <div className="grid grid-cols-6 gap-2">
              {[
                { id: 'blue', label: 'Azul', bg: 'bg-blue-600' },
                { id: 'emerald', label: 'Esmeralda', bg: 'bg-emerald-600' },
                { id: 'violet', label: 'Violeta', bg: 'bg-violet-600' },
                { id: 'amber', label: 'Âmbar', bg: 'bg-amber-600' },
                { id: 'rose', label: 'Rosa', bg: 'bg-rose-600' },
                { id: 'cyan', label: 'Ciano', bg: 'bg-cyan-600' },
              ].map((acc) => (
                <button
                  key={acc.id}
                  onClick={() => onUpdateSettings({ accentColor: acc.id as AccentColor })}
                  className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    settings.accentColor === acc.id
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                      : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${acc.bg}`} />
                  <span className="text-[10px]">{acc.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Sliders: Tamanho da Fonte, Altura da Linha e Linhas Visíveis */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          
          <div>
            <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Tamanho da Fonte</span>
              <span>{settings.fontSize}px</span>
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

          <div>
            <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Altura da Linha</span>
              <span>{settings.lineHeight}</span>
            </div>
            <input
              type="range"
              min="1.4"
              max="2.4"
              step="0.1"
              value={settings.lineHeight}
              onChange={(e) => onUpdateSettings({ lineHeight: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div>
            <div className="flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-1">
              <span>Linhas Visíveis</span>
              <span>{settings.visibleLines} linhas</span>
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

        </div>

      </div>

      {/* SEÇÃO 4: MODO ESTUDO & EXTRAS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 text-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Opções de Estudo & Recursos Adicionais</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Modo Estudo Padrão
              </span>
              <span className="text-[11px] text-slate-400">
                Fixação e quiz em todos os testes.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.studyMode}
              onChange={(e) => onUpdateSettings({ studyMode: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Leitura Prévia
              </span>
              <span className="text-[11px] text-slate-400">
                Pausa para ler o texto antes de digitar.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.studyPriorReading}
              onChange={(e) => onUpdateSettings({ studyPriorReading: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Teclado Virtual na Tela
              </span>
              <span className="text-[11px] text-slate-400">
                Destaque visual da próxima tecla.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.virtualKeyboard}
              onChange={(e) => onUpdateSettings({ virtualKeyboard: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer sm:col-span-3">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                Incluir Textos de IA e Meus Textos no Modo Aleatório
              </span>
              <span className="text-[11px] text-slate-400">
                Quando ativado, textos gerados por IA e textos criados por você também entram no sorteio aleatório da biblioteca.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.includeAiAndUserInRandom ?? true}
              onChange={(e) => onUpdateSettings({ includeAiAndUserInRandom: e.target.checked })}
              className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* SEÇÃO 5: GUIA DE ATALHOS DE TECLADO */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-3 text-xs">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-blue-500" />
          <span>Atalhos de Teclado Rápidos</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
          {t.settings.shortcutsList.map((sc, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block mb-0.5">
                {sc.key}
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                {sc.desc}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
