import { useState, useEffect, useCallback } from 'react';
import { Settings } from '../types';
import { storageService, DEFAULT_SETTINGS } from '../services/storageService';
import { soundService } from '../services/soundService';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => storageService.getSettings());

  // Sincroniza som, perfis e volumes no soundService
  useEffect(() => {
    soundService.setMuted(!settings.soundEnabled);
    soundService.setVolume(settings.volume);
    soundService.setKeyVolume(settings.keyVolume ?? 0.7);
    soundService.setErrorVolume(settings.errorVolume ?? 1.0);
    soundService.setKeyProfile(settings.keySoundProfile || 'mechanical');
    soundService.setErrorProfile(settings.errorSoundProfile || 'buzzer');
  }, [
    settings.soundEnabled,
    settings.volume,
    settings.keyVolume,
    settings.errorVolume,
    settings.keySoundProfile,
    settings.errorSoundProfile,
  ]);

  // Aplica classe de tema e data-theme ao documento HTML
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
    };

    if (settings.theme === 'dark') {
      applyTheme(true);
    } else if (settings.theme === 'light') {
      applyTheme(false);
    } else {
      // auto
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [settings.theme]);

  // Atualiza uma ou mais configurações
  const updateSettings = useCallback((newPartial: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newPartial };
      storageService.saveSettings(updated);
      return updated;
    });
  }, []);

  // Restaurar padrão
  const resetToDefaults = useCallback(() => {
    const defaults = storageService.resetSettings();
    setSettings(defaults);
  }, []);

  return {
    settings,
    updateSettings,
    resetToDefaults,
  };
}
