import { StudyText, normalizeStudyText } from '../../types';

// Carrega de forma estática em tempo de build/bundle todos os arquivos de textos agrupados por idioma
const modules = import.meta.glob<{ texts: StudyText[] }>('./*/*.ts', { eager: true });

const textsByLang: Record<string, StudyText[]> = {};

for (const [path, mod] of Object.entries(modules)) {
  // Exemplo de path: "./pt/legacy.ts" ou "./en/texts.ts"
  const parts = path.split('/');
  if (parts.length >= 3) {
    const lang = parts[1]; // 'pt', 'en', 'es', etc.
    if (!textsByLang[lang]) {
      textsByLang[lang] = [];
    }
    if (mod && Array.isArray(mod.texts)) {
      for (const item of mod.texts) {
        textsByLang[lang].push(normalizeStudyText(item));
      }
    }
  }
}

/**
 * Retorna todos os textos disponíveis para o idioma informado ('pt', 'en', 'es').
 * Pasta sem arquivos retorna lista vazia, sem erro.
 */
export function getTexts(lang: string): StudyText[] {
  // Mapeia caso venha com variante regional (ex: 'pt-BR' -> 'pt')
  const key = lang.startsWith('pt') ? 'pt' : lang.startsWith('es') ? 'es' : lang.startsWith('en') ? 'en' : lang;
  return textsByLang[key] || [];
}
