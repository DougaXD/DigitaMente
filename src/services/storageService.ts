/**
 * Storage Service - Camada Abstrata de Persistência (v1.1)
 * 
 * Persistência segura em localStorage com versionamento, migração automática,
 * suporte a textos gerados por IA, histórico com exclusão individual
 * e exportação/importação integral.
 */

import { Settings, TestResult, StudyText, PersonalBest, UserStats } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'digitamente_settings_v1',
  USER_TEXTS: 'digitamente_user_texts_v1',
  AI_TEXTS: 'digitamente_ai_texts_v1',
  FAVORITES: 'digitamente_favorites_v1',
  HISTORY: 'digitamente_history_v1',
  PERSONAL_BESTS: 'digitamente_pbs_v1',
  STATS: 'digitamente_stats_v1',
  NEWS_CACHE: 'digitamente_news_cache_v1',
};

export const DEFAULT_SETTINGS: Settings = {
  settingsVersion: 2,

  // Digitação
  errorBehavior: 'free',
  allowBackspace: true,
  blockPastWords: false,
  includePunctuationInWords: false,

  // Feedback sonoro
  soundEnabled: true,
  errorSound: true,
  keySound: true,
  completionSound: true,
  volume: 0.5,       // Geral 50%
  keyVolume: 0.7,    // Tecla 70%
  errorVolume: 1.0,  // Erro 100%
  keySoundProfile: 'membrane',
  errorSoundProfile: 'descending_beep',

  // Feedback visual
  wrongLetterMode: 'jump', // Padrão "Salto"
  showWrongLetter: true,
  wrongLetterStyle: 'above',
  capsLockWarning: true,
  errorShake: false,
  colorblindMode: false,
  hideUiOnTyping: true,    // Modo foco automático ligado

  // Aparência
  theme: 'auto',
  accentColor: 'blue',
  fontFamily: 'sans',
  fontSize: 28,            // Padrão 28px
  letterSpacing: 0.5,
  lineHeight: 2.0,
  visibleLines: 3,
  caretStyle: 'underline',
  caretSmoothness: true,
  reduceMotion: false,

  // Exibição ao vivo (novos padrões: WPM e precisão DESLIGADOS)
  showLiveWpm: false,
  showLiveAccuracy: false,
  showLiveTimer: true,
  showTextMetadata: true,
  showShortcutsTip: true,

  // Modo Estudo e Biblioteca
  studyMode: false,
  studyPriorReading: false,
  virtualKeyboard: false,
  includeAiAndUserInRandom: true,

  // Padrões do teste
  defaultTestType: 'library',
  defaultDurationMode: 'time',
  defaultTimeSeconds: 60,
  defaultWordCount: 50,
  defaultPageCount: 1,
  defaultCategory: 'Aleatório',
};

export const storageService = {
  // Configurações com Migração Obrigatória v1 -> v2
  getSettings(): Settings {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // MIGRAÇÃO OBRIGATÓRIA para v2
        if (!parsed.settingsVersion || parsed.settingsVersion < 2) {
          const migrated: Settings = {
            ...DEFAULT_SETTINGS,
            ...parsed,
            settingsVersion: 2,
            // Desliga WPM e precisão ao vivo na migração
            showLiveWpm: false,
            showLiveAccuracy: false,
            showLiveTimer: true,
            wrongLetterMode: parsed.wrongLetterMode || 'jump',
            hideUiOnTyping: true,
            keyVolume: parsed.keyVolume ?? 0.7,
            errorVolume: parsed.errorVolume ?? 1.0,
            keySoundProfile: parsed.keySoundProfile || 'mechanical',
            errorSoundProfile: parsed.errorSoundProfile || 'buzzer',
            fontSize: parsed.fontSize || 28,
            includeAiAndUserInRandom: true,
          };
          this.saveSettings(migrated);
          return migrated;
        }

        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Erro ao carregar configurações do localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: Settings): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error('Erro ao salvar configurações:', e);
    }
  },

  resetSettings(): Settings {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    } catch (e) {
      console.error('Erro ao resetar configurações:', e);
    }
    return DEFAULT_SETTINGS;
  },

  // Favoritos
  getFavoriteIds(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  toggleFavorite(id: string): string[] {
    const favorites = this.getFavoriteIds();
    const index = favorites.indexOf(id);
    let updated: string[];
    if (index >= 0) {
      updated = favorites.filter((favId) => favId !== id);
    } else {
      updated = [...favorites, id];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(updated));
    } catch (e) {
      console.error('Erro ao salvar favoritos:', e);
    }
    return updated;
  },

  // Textos do Usuário (Meus Textos)
  getUserTexts(): StudyText[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USER_TEXTS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  saveUserText(text: StudyText): StudyText[] {
    const texts = this.getUserTexts();
    const existingIndex = texts.findIndex((t) => t.id === text.id);
    let updated: StudyText[];
    if (existingIndex >= 0) {
      updated = [...texts];
      updated[existingIndex] = text;
    } else {
      updated = [text, ...texts];
    }
    try {
      localStorage.setItem(STORAGE_KEYS.USER_TEXTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Erro ao salvar texto do usuário:', e);
    }
    return updated;
  },

  renameUserText(id: string, newTitle: string): StudyText[] {
    const texts = this.getUserTexts();
    const updated = texts.map((t) => (t.id === id ? { ...t, title: newTitle.trim() || t.title } : t));
    try {
      localStorage.setItem(STORAGE_KEYS.USER_TEXTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Erro ao renomear texto:', e);
    }
    return updated;
  },

  deleteUserText(id: string): StudyText[] {
    const texts = this.getUserTexts().filter((t) => t.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.USER_TEXTS, JSON.stringify(texts));
    } catch (e) {
      console.error('Erro ao excluir texto do usuário:', e);
    }
    return texts;
  },

  // Textos Gerados por IA (com limite e persistência automática)
  getAiTexts(): StudyText[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AI_TEXTS);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  },

  saveAiText(text: StudyText): { success: boolean; list: StudyText[]; error?: string } {
    try {
      const texts = this.getAiTexts();
      const existingIndex = texts.findIndex((t) => t.id === text.id);
      let updated: StudyText[];

      if (existingIndex >= 0) {
        updated = [...texts];
        updated[existingIndex] = text;
      } else {
        // Limite de 100 textos salvos
        updated = [text, ...texts.slice(0, 99)];
      }

      localStorage.setItem(STORAGE_KEYS.AI_TEXTS, JSON.stringify(updated));
      return { success: true, list: updated };
    } catch (e: any) {
      console.error('Erro ao salvar texto de IA:', e);
      return { 
        success: false, 
        list: this.getAiTexts(), 
        error: 'Armazenamento cheio. Remova alguns textos de IA antigos para salvar novos.' 
      };
    }
  },

  renameAiText(id: string, newTitle: string): StudyText[] {
    const texts = this.getAiTexts();
    const updated = texts.map((t) => (t.id === id ? { ...t, title: newTitle.trim() || t.title } : t));
    try {
      localStorage.setItem(STORAGE_KEYS.AI_TEXTS, JSON.stringify(updated));
    } catch (e) {
      console.error('Erro ao renomear texto de IA:', e);
    }
    return updated;
  },

  deleteAiText(id: string): StudyText[] {
    const texts = this.getAiTexts().filter((t) => t.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.AI_TEXTS, JSON.stringify(texts));
    } catch (e) {
      console.error('Erro ao excluir texto de IA:', e);
    }
    return texts;
  },

  // Histórico de Resultados
  getHistory(): TestResult[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!stored) return [];
      const parsed: TestResult[] = JSON.parse(stored);
      if (!Array.isArray(parsed)) return [];

      // Deduplicação única por ID mantendo a primeira ocorrência
      const seen = new Set<string>();
      let hasDuplicates = false;
      const deduplicated: TestResult[] = [];

      for (const item of parsed) {
        if (!item || !item.id) continue;
        if (!seen.has(item.id)) {
          seen.add(item.id);
          deduplicated.push(item);
        } else {
          hasDuplicates = true;
        }
      }

      if (hasDuplicates) {
        try {
          localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(deduplicated));
          this.recalculatePersonalBests(deduplicated);
        } catch (saveErr) {
          console.error('Erro ao salvar histórico deduplicado:', saveErr);
        }
      }

      return deduplicated;
    } catch (e) {
      return [];
    }
  },

  recalculatePersonalBests(history: TestResult[]): void {
    try {
      const pbs: Record<string, PersonalBest> = {};
      const chronological = [...history].reverse();
      for (const res of chronological) {
        if (res.isValid === false) continue;
        const modeKey = `${res.testType}_${res.durationMode}_${res.elapsedSeconds || ''}`;
        const existing = pbs[modeKey];
        if (!existing || res.netWpm > existing.netWpm) {
          pbs[modeKey] = {
            modeKey,
            netWpm: res.netWpm,
            accuracy: res.accuracy,
            date: res.date,
          };
        }
      }
      localStorage.setItem(STORAGE_KEYS.PERSONAL_BESTS, JSON.stringify(pbs));
    } catch (e) {
      console.error('Erro ao recalcular recordes:', e);
    }
  },

  saveResult(result: TestResult): { isNewRecord: boolean } {
    try {
      const history = this.getHistory();
      // Salva de forma estritamente idempotente (ignora se id já existe)
      if (history.some((r) => r.id === result.id)) {
        return { isNewRecord: false };
      }

      const updatedHistory = [result, ...history.filter((r) => r.id !== result.id).slice(0, 99)]; // Mantém os 100 mais recentes
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updatedHistory));

      // Proteção: se o teste foi marcado como inválido, não computa em recordes nem stats
      if (result.isValid === false) {
        return { isNewRecord: false };
      }

      // Atualiza recorde pessoal
      const pbs = this.getPersonalBests();
      const modeKey = `${result.testType}_${result.durationMode}_${result.elapsedSeconds || ''}`;
      const existingPb = pbs[modeKey];
      let isNewRecord = false;

      if (!existingPb || result.netWpm > existingPb.netWpm) {
        pbs[modeKey] = {
          modeKey,
          netWpm: result.netWpm,
          accuracy: result.accuracy,
          date: result.date,
        };
        localStorage.setItem(STORAGE_KEYS.PERSONAL_BESTS, JSON.stringify(pbs));
        isNewRecord = true;
      }

      // Atualiza estatísticas consolidadas
      this.updateStats(result);

      return { isNewRecord };
    } catch (e) {
      console.error('Erro ao salvar resultado:', e);
      return { isNewRecord: false };
    }
  },

  deleteResult(id: string): TestResult[] {
    try {
      const history = this.getHistory().filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
      return history;
    } catch (e) {
      return [];
    }
  },

  clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error('Erro ao limpar histórico:', e);
    }
  },

  // Recordes Pessoais
  getPersonalBests(): Record<string, PersonalBest> {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PERSONAL_BESTS);
      return stored ? JSON.parse(stored) : {};
    } catch (e) {
      return {};
    }
  },

  // Estatísticas do Usuário
  getStats(): UserStats {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STATS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Erro ao carregar estatísticas:', e);
    }
    return {
      totalTests: 0,
      totalTimeSeconds: 0,
      totalWords: 0,
      averageWpm: 0,
      bestWpm: 0,
      currentStreakDays: 0,
      mostMistypedKeys: {},
      quizScoresByCategory: {},
    };
  },

  updateStats(result: TestResult): void {
    try {
      if (result.isValid === false) return;

      const stats = this.getStats();
      const totalTests = stats.totalTests + 1;
      const totalTimeSeconds = stats.totalTimeSeconds + result.elapsedSeconds;
      const totalWords = stats.totalWords + result.wordsTyped;
      const averageWpm = Math.round(
        (stats.averageWpm * stats.totalTests + result.netWpm) / totalTests
      );
      const bestWpm = Math.max(stats.bestWpm, result.netWpm);

      // Streak de dias consecutivos
      const today = new Date().toISOString().split('T')[0];
      let currentStreak = stats.currentStreakDays || 0;
      if (stats.lastPracticeDate) {
        const lastDate = new Date(stats.lastPracticeDate);
        const currentDate = new Date(today);
        const diffTime = currentDate.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));

        if (diffDays === 1) {
          currentStreak += 1;
        } else if (diffDays > 1) {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      // Acumula teclas mais erradas
      const mistypedKeys = { ...stats.mostMistypedKeys };
      for (const item of result.mistypedKeys) {
        const key = item.expected;
        mistypedKeys[key] = (mistypedKeys[key] || 0) + item.count;
      }

      // Quiz por categoria
      const quizScores = { ...stats.quizScoresByCategory };
      if (result.isStudyMode && result.quizScore && result.category) {
        const cat = result.category;
        const currentCat = quizScores[cat] || { attempts: 0, correct: 0, totalQuestions: 0 };
        quizScores[cat] = {
          attempts: currentCat.attempts + 1,
          correct: currentCat.correct + result.quizScore.correct,
          totalQuestions: currentCat.totalQuestions + result.quizScore.total,
        };
      }

      const updatedStats: UserStats = {
        totalTests,
        totalTimeSeconds,
        totalWords,
        averageWpm,
        bestWpm,
        currentStreakDays: currentStreak,
        lastPracticeDate: today,
        mostMistypedKeys: mistypedKeys,
        quizScoresByCategory: quizScores,
      };

      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
    } catch (e) {
      console.error('Erro ao atualizar estatísticas:', e);
    }
  },

  // Cache de Notícias Recentes
  getNewsCache(): { timestamp: number; news: StudyText[] } | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.NEWS_CACHE);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      return null;
    }
    return null;
  },

  saveNewsCache(news: StudyText[]): void {
    try {
      const cache = { timestamp: Date.now(), news };
      localStorage.setItem(STORAGE_KEYS.NEWS_CACHE, JSON.stringify(cache));
    } catch (e) {
      console.error('Erro ao salvar cache de notícias:', e);
    }
  },

  // Exportação Integral
  exportAllData(): string {
    const bundle = {
      version: 2,
      exportDate: new Date().toISOString(),
      settings: this.getSettings(),
      userTexts: this.getUserTexts(),
      aiTexts: this.getAiTexts(),
      favorites: this.getFavoriteIds(),
      history: this.getHistory(),
      personalBests: this.getPersonalBests(),
      stats: this.getStats(),
    };
    return JSON.stringify(bundle, null, 2);
  },

  // Importação Integral
  importAllData(jsonStr: string): boolean {
    try {
      const bundle = JSON.parse(jsonStr);
      if (bundle.settings) this.saveSettings(bundle.settings);
      if (Array.isArray(bundle.userTexts)) {
        localStorage.setItem(STORAGE_KEYS.USER_TEXTS, JSON.stringify(bundle.userTexts));
      }
      if (Array.isArray(bundle.aiTexts)) {
        localStorage.setItem(STORAGE_KEYS.AI_TEXTS, JSON.stringify(bundle.aiTexts));
      }
      if (Array.isArray(bundle.favorites)) {
        localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(bundle.favorites));
      }
      if (Array.isArray(bundle.history)) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(bundle.history));
      }
      if (bundle.personalBests) {
        localStorage.setItem(STORAGE_KEYS.PERSONAL_BESTS, JSON.stringify(bundle.personalBests));
      }
      if (bundle.stats) {
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(bundle.stats));
      }
      return true;
    } catch (e) {
      console.error('Erro ao importar dados:', e);
      return false;
    }
  },
};
