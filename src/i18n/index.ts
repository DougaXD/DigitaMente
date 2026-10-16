import { ptBR, TranslationType } from './pt-BR';
import { en } from './en';
import { es } from './es';
import { uiPt } from './ui-pt';
import { uiEn } from './ui-en';
import { uiEs } from './ui-es';
import { Language } from '../types';

export type LanguageCode = Language;

const dictionaries: Record<Language, TranslationType> = {
  'pt-BR': ptBR,
  en,
  es,
};

const uiDictionaries: Record<Language, typeof uiPt> = {
  'pt-BR': uiPt,
  en: uiEn,
  es: uiEs,
};

let currentLanguage: Language = 'pt-BR';

export function setLanguage(lang: Language): void {
  if (dictionaries[lang]) {
    currentLanguage = lang;
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
      document.title = dictionaries[lang].app.name + ' — ' + dictionaries[lang].app.taglineShort;
    }
  }
}

export function getCurrentLanguage(): Language {
  return currentLanguage;
}

export function getDictionary(lang: Language = currentLanguage): TranslationType {
  return dictionaries[lang] || dictionaries['pt-BR'];
}

export function getUiDictionary(lang: Language = currentLanguage): typeof uiPt {
  return uiDictionaries[lang] || uiDictionaries['pt-BR'];
}

/**
 * Proxy reativo para t:
 * Qualquer acesso a t.<seção> ou t.<chave> resolve dinamicamente
 * no dicionário do idioma atualmente ativo (pt-BR, en, es).
 */
export const t: TranslationType = new Proxy({} as TranslationType, {
  get(_target, prop: string | symbol) {
    const dict = getDictionary(currentLanguage);
    return (dict as any)[prop];
  },
});

/**
 * Proxy reativo para ui:
 * Qualquer acesso a ui.<chave> resolve dinamicamente
 * no dicionário de UI do idioma atualmente ativo (pt-BR, en, es).
 */
export const ui: typeof uiPt = new Proxy({} as typeof uiPt, {
  get(_target, prop: string | symbol) {
    const dict = getUiDictionary(currentLanguage);
    return (dict as any)[prop];
  },
});
