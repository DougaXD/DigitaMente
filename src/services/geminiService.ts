/**
 * Gemini Service - Cliente do frontend para geração de textos educativos e notícias
 * 
 * As chamadas ao SDK @google/genai ocorrem exclusivamente no backend (server.ts),
 * mantendo a chave de API segura no servidor.
 */

import { StudyText, TextCategory, TextLevel } from '../types';
import { normalizeText } from '../utils/textNormalizer';

export interface GenerateTextParams {
  category: TextCategory;
  customTopic?: string;
  length?: TextLevel | 'página';
  difficulty?: 'simples' | 'intermediário';
}

export const geminiService = {
  /**
   * Gera um texto educativo de estudo estruturado
   */
  async generateStudyText(params: GenerateTextParams): Promise<StudyText> {
    const res = await fetch('/api/gemini/generate-study-text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Falha na comunicação com o serviço de IA.');
    }

    const data = await res.json();
    const cleanBody = normalizeText(data.body || '');
    const wordCount = cleanBody.split(/\s+/).filter(Boolean).length;

    const studyText: StudyText = {
      id: `ia-${Date.now()}`,
      title: data.title || 'Texto Gerado por IA',
      category: params.category,
      subcategory: params.customTopic || 'Estudos com IA',
      lang: 'pt',
      level: params.length === 'curto' ? 'curto' : params.length === 'longo' ? 'longo' : 'médio',
      wordCount,
      body: cleanBody,
      sourceType: 'ia',
      sourceName: 'Gerado com Google Gemini',
      license: 'Educacional',
      keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
      quiz: Array.isArray(data.quiz) ? data.quiz : [],
      createdAt: new Date().toISOString(),
    };

    return studyText;
  },

  /**
   * Busca e resume notícias factuais recentes com grounding de pesquisa do Google
   */
  async fetchLatestNews(topic?: string): Promise<StudyText> {
    const res = await fetch('/api/gemini/latest-news', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Falha ao buscar notícias recentes com IA.');
    }

    const data = await res.json();
    const cleanBody = normalizeText(data.body || '');
    const wordCount = cleanBody.split(/\s+/).filter(Boolean).length;

    const firstSource = data.sources?.[0];

    const newsText: StudyText = {
      id: `news-ia-${Date.now()}`,
      title: data.title || 'Notícia Recente',
      category: 'Notícias',
      subcategory: 'Notícias Globais e Brasileiras',
      lang: 'pt',
      level: 'médio',
      wordCount,
      body: cleanBody,
      sourceType: 'ia',
      sourceName: firstSource?.title || 'Notícias Verificadas via Busca',
      sourceUrl: firstSource?.url,
      license: 'Factual / Noticioso',
      keyPoints: Array.isArray(data.keyPoints) ? data.keyPoints : [],
      quiz: Array.isArray(data.quiz) ? data.quiz : [],
      createdAt: new Date().toISOString(),
    };

    return newsText;
  },
};
