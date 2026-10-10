import { ptBR, TranslationType } from './pt-BR';

export type LanguageCode = 'pt' | 'en' | 'es';

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
  active: boolean;
}

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  { code: 'pt', label: 'Português', flag: '🇧🇷', active: true },
  { code: 'en', label: 'English', flag: '🇺🇸', active: false },
  { code: 'es', label: 'Español', flag: '🇪🇸', active: false },
];

export function getDictionary(lang: LanguageCode = 'pt'): TranslationType {
  // Atualmente 'pt' é o único idioma ativo; 'en' e 'es' retornarão 'pt' como fallback seguro
  return ptBR;
}

export const t = ptBR;
