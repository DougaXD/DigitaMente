import React, { useState, useRef, useEffect } from 'react';
import { 
  Keyboard, 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Globe
} from 'lucide-react';
import { APP_NAME } from '../constants';
import { t, AVAILABLE_LANGUAGES } from '../i18n';
import { Settings } from '../types';

export type ActiveTab = 'test' | 'library' | 'stats' | 'settings';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  settings: Settings;
  onUpdateSettings: (newSettings: Partial<Settings>) => void;
  isTypingFocus?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  settings,
  onUpdateSettings,
  isTypingFocus = false,
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement | null>(null);

  // Modo foco: volta com fade ao mover o mouse
  const [mouseAwake, setMouseAwake] = useState(false);
  const lastMouseMoveRef = useRef<number>(0);
  const mouseTimerRef = useRef<any>(null);

  useEffect(() => {
    if (!isTypingFocus || !settings.hideUiOnTyping) {
      setMouseAwake(false);
      return;
    }

    const handleMouseMove = () => {
      const now = performance.now();
      if (now - lastMouseMoveRef.current < 100) return;
      lastMouseMoveRef.current = now;

      setMouseAwake(true);
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
      mouseTimerRef.current = setTimeout(() => {
        setMouseAwake(false);
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (mouseTimerRef.current) clearTimeout(mouseTimerRef.current);
    };
  }, [isTypingFocus, settings.hideUiOnTyping]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleSound = () => {
    onUpdateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const toggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ theme: nextTheme });
  };

  const isFaded = isTypingFocus && settings.hideUiOnTyping && !mouseAwake;

  return (
    <header 
      className={`border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 sticky top-0 z-50 transition-opacity duration-300 ${
        isFaded ? 'opacity-10 pointer-events-none' : 'opacity-100'
      }`}
      style={{ height: '56px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between">
        
        {/* Logo e Nome da Aplicação (SEM slogan) */}
        <div 
          onClick={() => onTabChange('test')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Keyboard className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-slate-800 dark:text-slate-100 group-hover:text-blue-600 transition-colors">
            {APP_NAME}
          </span>
        </div>

        {/* Navegação Principal (Links de texto discretos, sem fundo preenchido) */}
        <nav className="flex items-center gap-5 sm:gap-7">
          <button
            onClick={() => onTabChange('test')}
            className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer relative py-1 ${
              activeTab === 'test'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{t.nav.test}</span>
            {activeTab === 'test' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('library')}
            className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer relative py-1 ${
              activeTab === 'library'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{t.nav.library}</span>
            {activeTab === 'library' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onTabChange('stats')}
            className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer relative py-1 ${
              activeTab === 'stats'
                ? 'text-blue-600 dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <span>{t.nav.stats}</span>
            {activeTab === 'stats' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Ícones pequenos sem fundo */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Som */}
          <button
            onClick={toggleSound}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title={settings.soundEnabled ? 'Silenciar som' : 'Ativar som'}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4 text-blue-500" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Tema */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title={settings.theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          >
            {settings.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Idioma (apenas ícone de globo) */}
          <div className="relative" ref={langDropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Idioma"
            >
              <Globe className="w-4 h-4" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs">
                {AVAILABLE_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    disabled={!lang.active}
                    onClick={() => setLangDropdownOpen(false)}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between ${
                      lang.active 
                        ? 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium cursor-pointer' 
                        : 'text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </span>
                    {!lang.active && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-600 italic">
                        {t.nav.comingSoon}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Configurações */}
          <button
            onClick={() => onTabChange('settings')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'settings' 
                ? 'text-blue-600 dark:text-blue-400' 
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
            title="Configurações"
          >
            <SettingsIcon className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
