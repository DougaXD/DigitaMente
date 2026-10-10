/**
 * Normalizador de Texto do DigitaMente (v1.1)
 * 
 * Garante que textos de qualquer origem (colados, gerados por IA ou da biblioteca)
 * sejam agradáveis e padronizados para digitação:
 * - Toda sequência de espaços e quebras de linha (\s+) substituída por um único espaço
 * - Aspas curvas em retas
 * - Travessões e meia-riscas em hífen
 * - Reticências em três pontos "..."
 * - Remoção de caracteres invisíveis
 * - Palavras com mais de 25 caracteres quebradas para evitar quebra de layout
 * - Normalização de acentos para o modo "Sem acentos"
 */

export function normalizeText(text: string): string {
  if (!text) return '';

  let cleaned = text
    // Remove caracteres invisíveis (zero-width spaces, soft hyphens, BOM)
    .replace(/[\u200B-\u200D\uFEFF\u00AD]/g, '')
    // Converte aspas curvas duplas e simples
    .replace(/[“”«»]/g, '"')
    .replace(/[‘’]/g, "'")
    // Converte travessão (—) e meia-risca (–) em hífen comum (-)
    .replace(/[—–]/g, '-')
    // Converte reticências especiais (…) em três pontos (...)
    .replace(/…/g, '...')
    // Substitui TODA sequência de espaços e quebras de linha (\s+) por um único espaço
    .replace(/\s+/g, ' ')
    // Remove espaços no início e final
    .trim();

  // Trata palavras com mais de 25 caracteres em textos colados pelo usuário
  const words = cleaned.split(' ');
  const normalizedWords = words.map((w) => {
    if (w.length > 25) {
      // Divide em pedaços de no máximo 24 caracteres com hífen
      return w.match(/.{1,24}/g)?.join('- ') || w;
    }
    return w;
  });

  return normalizedWords.join(' ');
}

/**
 * Remove diacríticos e acentos (ex: "Ação e coração" -> "Acao e coracao")
 */
export function removeDiacritics(text: string): string {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Trata cedilha e outros caracteres que podem não decompor inteiramente
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C');
}

/**
 * Divide o texto em palavras preservando o espaço final como parte do token
 */
export function splitTextIntoWords(text: string): string[] {
  if (!text) return [];
  return text.split(' ').filter(Boolean);
}
