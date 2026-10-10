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

  // Aplica classe de tema ao documento HTML
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // auto
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
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

  // Predefinição Typing.com
  const applyTypingComPreset = useCallback(() => {
    updateSettings({
      soundEnabled: true,
      errorSound: true,
      keySound: true,
      completionSound: true,
      showWrongLetter: true,
      wrongLetterStyle: 'above',
      visibleLines: 3,
      caretStyle: 'line',
      errorBehavior: 'free',
    });
  }, [updateSettings]);

  // Predefinição Typing Core
  const applyTypingCorePreset = useCallback(() => {
    updateSettings({
      soundEnabled: false,
      errorSound: false,
      keySound: false,
      completionSound: false,
      showWrongLetter: true,
      wrongLetterStyle: 'above',
      visibleLines: 3,
      caretStyle: 'line',
      caretSmoothness: true,
      errorBehavior: 'free',
      theme: 'dark',
    });
  }, [updateSettings]);

  // Predefinição Foco Total
  const applyTotalFocusPreset = useCallback(() => {
    updateSettings({
      showLiveWpm: false,
      showLiveAccuracy: false,
      showLiveTimer: false,
      errorShake: false,
      visibleLines: 3,
    });
  }, [updateSettings]);

  // Restaurar padrão
  const resetToDefaults = useCallback(() => {
    const defaults = storageService.resetSettings();
    setSettings(defaults);
  }, []);

  return {
    settings,
    updateSettings,
    applyTypingComPreset,
    applyTypingCorePreset,
    applyTotalFocusPreset,
    resetToDefaults,
  };
}
