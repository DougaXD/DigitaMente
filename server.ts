import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  const apiKey = process.env.GEMINI_API_KEY;
  const ai = apiKey
    ? new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      })
    : null;

  // Endpoint to check status
  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, hasGeminiKey: Boolean(apiKey) });
  });

  // Endpoint to generate study texts
  app.post('/api/gemini/generate-study-text', async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({
          error: 'Chave GEMINI_API_KEY não configurada no servidor.',
        });
      }

      const { category = 'Estudos', customTopic, length = 'médio', difficulty = 'simples' } = req.body;

      let wordTarget = 150;
      if (length === 'curto') wordTarget = 60;
      else if (length === 'médio') wordTarget = 150;
      else if (length === 'longo') wordTarget = 280;
      else if (length === 'página') wordTarget = 250;

      const prompt = `Gere um texto informativo de estudo em Português do Brasil (pt-BR) sobre o tema "${customTopic || category}".
Categoria: ${category}.
Nível de vocabulário: ${difficulty}.
Tamanho aproximado: cerca de ${wordTarget} palavras.
Regras fundamentais de digitação:
1. Sem listas com marcadores, sem títulos intermediários, sem emojis, sem markdown (sem negrito ou itálico).
2. Frases curtas e objetivas, parágrafos fluidos.
3. Use pontuação padrão (ponto, vírgula, ponto de interrogação, dois pontos e ponto e vírgula). Evite aspas curvas, travessões, parênteses e símbolos raros.
4. Retorne também 3 a 4 pontos-chave de aprendizado e 3 perguntas de múltipla escolha com 4 alternativas cada para testar a retenção.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'Você é um educador e redator para testes de digitação e estudo em língua portuguesa (pt-BR). Seus textos são educativos, prazerosos de digitar, claros, neutros e factualmente acurados.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: 'Título conciso do texto' },
              body: { type: Type.STRING, description: 'Corpo do texto para digitação contínua' },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: '3 a 4 pontos centrais de aprendizado',
              },
              quiz: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: 'Exatamente 4 opções',
                    },
                    answerIndex: { type: Type.INTEGER, description: 'Índice de 0 a 3 da alternativa correta' },
                    explanation: { type: Type.STRING, description: 'Explicação breve da resposta correta' },
                  },
                  required: ['question', 'options', 'answerIndex', 'explanation'],
                },
                description: 'Exatamente 3 perguntas sobre o conteúdo',
              },
            },
            required: ['title', 'body', 'keyPoints', 'quiz'],
          },
        },
      });

      const text = response.text;
      if (!text) {
        return res.status(500).json({ error: 'Nenhuma resposta recebida do Gemini.' });
      }

      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (error: any) {
      console.error('Error generating study text:', error);
      res.status(500).json({
        error: error?.message || 'Falha ao gerar texto com a IA.',
      });
    }
  });

  // Endpoint for latest news with Google Search grounding
  app.post('/api/gemini/latest-news', async (req, res) => {
    try {
      if (!ai) {
        return res.status(503).json({
          error: 'Chave GEMINI_API_KEY não configurada no servidor.',
        });
      }

      const { topic = 'Notícias do Brasil e do Mundo sobre ciência, tecnologia ou sociedade' } = req.body;

      // Pass 1: Search with grounding
      const searchResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Pesquise e resuma uma notícia recente, real e factual sobre: ${topic}.
Escreva um resumo conciso de 3 parágrafos curtos em Português do Brasil com dados verídicos e neutros.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const summaryText = searchResponse.text || '';
      
      // Extract search grounding metadata if available
      const searchChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources: { title: string; url: string }[] = [];
      for (const chunk of searchChunks) {
        if (chunk.web?.uri) {
          sources.push({
            title: chunk.web.title || 'Fonte de Notícia',
            url: chunk.web.uri,
          });
        }
      }

      // Pass 2: Format into structured JSON without markdown and suitable for typing
      const formatPrompt = `Com base neste resumo factual de notícia recente:
---
${summaryText}
---
Estruture um texto de digitação em pt-BR.
Regras:
1. Sem markdown, sem listas com marcadores, sem emojis.
2. Frases curtas e fluidas para digitação.
3. Crie título, corpo (cerca de 120 a 180 palavras), 3 pontos-chave e 3 perguntas de fixação.`;

      const formatResponse = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formatPrompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              body: { type: Type.STRING },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              quiz: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    answerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                  },
                  required: ['question', 'options', 'answerIndex', 'explanation'],
                },
              },
            },
            required: ['title', 'body', 'keyPoints', 'quiz'],
          },
        },
      });

      const formattedJson = JSON.parse(formatResponse.text || '{}');
      res.json({
        ...formattedJson,
        sources: sources.slice(0, 3),
      });
    } catch (error: any) {
      console.error('Error fetching latest news with Gemini:', error);
      res.status(500).json({
        error: error?.message || 'Falha ao buscar notícias recentes com IA.',
      });
    }
  });

  // Mount Vite or static server
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DigitaMente server running on http://localhost:${PORT}`);
  });
}

startServer();
