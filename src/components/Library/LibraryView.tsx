import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Plus, 
  Star, 
  BookOpen, 
  Clock, 
  RefreshCw, 
  ExternalLink, 
  Trash2, 
  Edit3,
  Play,
  CheckCircle2,
  Newspaper,
  FileText,
  AlertTriangle,
  Loader2,
  Check,
  X
} from 'lucide-react';
import { StudyText, TextCategory, TextLevel } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { SEED_TEXTS } from '../../data/seedTexts';
import { storageService } from '../../services/storageService';
import { geminiService } from '../../services/geminiService';
import { normalizeText } from '../../utils/textNormalizer';
import { t } from '../../i18n';

interface LibraryViewProps {
  onSelectText: (text: StudyText) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onSelectText }) => {
  // Tabs da biblioteca
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'ai_texts' | 'my_texts' | 'add_text'>('all');

  // Filtros e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TextCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<TextLevel | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Estados de dados persistentes
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavoriteIds());
  const [userTexts, setUserTexts] = useState<StudyText[]>(() => storageService.getUserTexts());
  const [aiTexts, setAiTexts] = useState<StudyText[]>(() => storageService.getAiTexts());
  const [newsList, setNewsList] = useState<StudyText[]>(() => {
    const cached = storageService.getNewsCache();
    return cached?.news || [];
  });
  const [isLoadingNews, setIsLoadingNews] = useState(false);

  // Modal de Prévia
  const [previewText, setPreviewText] = useState<StudyText | null>(null);

  // Estado de Renomear Título
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');

  // Formulário da aba "Adicionar texto"
  const [addMode, setAddMode] = useState<'write' | 'ai'>('ai');
  
  // Campos de Escrever Texto
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<TextCategory>('Estudos');
  const [customBody, setCustomBody] = useState('');

  // Campos de IA
  const [aiCategory, setAiCategory] = useState<TextCategory>('Estudos');
  const [aiTopic, setAiTopic] = useState('');
  const [aiLength, setAiLength] = useState<TextLevel | 'página'>('médio');
  const [aiDifficulty, setAiDifficulty] = useState<'simples' | 'intermediário'>('simples');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiGeneratedSuccess, setAiGeneratedSuccess] = useState<StudyText | null>(null);

  // Todos os textos disponíveis
  const allTexts = useMemo(() => {
    return [...userTexts, ...aiTexts, ...SEED_TEXTS];
  }, [userTexts, aiTexts]);

  // Carrega notícias automaticamente se necessário
  useEffect(() => {
    if (activeTab === 'news' && newsList.length === 0 && !isLoadingNews) {
      handleRefreshNews();
    }
  }, [activeTab]);

  const handleRefreshNews = async () => {
    setIsLoadingNews(true);
    try {
      const newsItem = await geminiService.fetchLatestNews(
        'Acontecimentos recentes e avanços da ciência, tecnologia ou sociedade no Brasil e no mundo'
      );
      const updated = [newsItem, ...newsList.slice(0, 7)];
      setNewsList(updated);
      storageService.saveNewsCache(updated);
    } catch (e) {
      console.warn('Erro ao atualizar notícias:', e);
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = storageService.toggleFavorite(id);
    setFavorites(updated);
  };

  // Exclusão de texto com confirmação
  const handleDeleteText = (id: string, isAi: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza de que deseja excluir este texto permanentemente?')) {
      if (isAi) {
        const updated = storageService.deleteAiText(id);
        setAiTexts(updated);
      } else {
        const updated = storageService.deleteUserText(id);
        setUserTexts(updated);
      }
    }
  };

  // Iniciar renomeação
  const handleStartRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(id);
    setRenameValue(currentTitle);
  };

  const handleSaveRename = (id: string, isAi: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!renameValue.trim()) return;
    if (isAi) {
      const updated = storageService.renameAiText(id, renameValue);
      setAiTexts(updated);
    } else {
      const updated = storageService.renameUserText(id, renameValue);
      setUserTexts(updated);
    }
    setRenamingId(null);
  };

  // Salvar texto escrito manualmente
  const handleSaveCustomText = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = normalizeText(customBody);
    if (!clean) return;

    const words = clean.split(' ').filter(Boolean);
    const newText: StudyText = {
      id: `user-${Date.now()}`,
      title: customTitle.trim() || 'Meu Texto de Estudo',
      category: customCategory,
      lang: 'pt',
      level: words.length < 90 ? 'curto' : words.length < 220 ? 'médio' : 'longo',
      wordCount: words.length,
      body: clean,
      sourceType: 'usuario',
      sourceName: 'Criado pelo Usuário',
      createdAt: new Date().toISOString(),
    };

    const updated = storageService.saveUserText(newText);
    setUserTexts(updated);
    setCustomTitle('');
    setCustomBody('');
    setActiveTab('my_texts');
  };

  // Gerar texto por IA com persistência automática (Seção 7)
  const handleGenerateAiText = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingAi(true);
    setAiError(null);
    setAiGeneratedSuccess(null);

    try {
      const generated = await geminiService.generateStudyText({
        category: aiCategory,
        customTopic: aiTopic.trim() || undefined,
        length: aiLength,
        difficulty: aiDifficulty,
      });

      // Salva AUTOMATICAMENTE via storageService no momento da geração
      const saveRes = storageService.saveAiText(generated);
      if (saveRes.success) {
        setAiTexts(saveRes.list);
      } else if (saveRes.error) {
        setAiError(saveRes.error);
      }

      setAiGeneratedSuccess(generated);
    } catch (err: any) {
      setAiError(err?.message || 'Falha na conexão com a IA. Tente novamente mais tarde.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Textos filtrados conforme a aba ativa
  const displayedTexts = useMemo(() => {
    let list: StudyText[] = [];

    if (activeTab === 'ai_texts') {
      list = aiTexts;
    } else if (activeTab === 'my_texts') {
      list = userTexts;
    } else if (activeTab === 'news') {
      const seedNews = SEED_TEXTS.filter((t) => t.category === 'Notícias');
      list = [...newsList, ...seedNews];
    } else {
      // 'all'
      list = allTexts;
    }

    return list.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchBody = item.body.toLowerCase().includes(q);
        if (!matchTitle && !matchBody) return false;
      }
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedLevel !== 'all' && item.level !== selectedLevel) {
        return false;
      }
      if (favoritesOnly && !favorites.includes(item.id)) {
        return false;
      }
      return true;
    });
  }, [activeTab, aiTexts, userTexts, newsList, allTexts, searchQuery, selectedCategory, selectedLevel, favoritesOnly, favorites]);

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      
      {/* Cabeçalho Limpo da Biblioteca (SEM botão flutuante de gerar IA) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.library.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t.library.subtitle}
          </p>
        </div>
      </div>

      {/* Tabs da Biblioteca */}
      <div className="flex items-center gap-1 sm:gap-2 border-b border-slate-200/60 dark:border-slate-800 text-xs sm:text-sm overflow-x-auto scrollbar-none pb-0.5">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-2.5 px-2.5 font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
            activeTab === 'all'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Todos ({allTexts.length})
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`pb-2.5 px-2.5 font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
            activeTab === 'news'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Newspaper className="w-3.5 h-3.5" />
          <span>Notícias</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_texts')}
          className={`pb-2.5 px-2.5 font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
            activeTab === 'ai_texts'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Gerados por IA ({aiTexts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('my_texts')}
          className={`pb-2.5 px-2.5 font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 ${
            activeTab === 'my_texts'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Meus Textos ({userTexts.length})
        </button>

        <button
          onClick={() => setActiveTab('add_text')}
          className={`pb-2.5 px-2.5 font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 flex items-center gap-1.5 ${
            activeTab === 'add_text'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
              : 'border-transparent text-blue-600 dark:text-blue-400 hover:underline'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Adicionar texto</span>
        </button>
      </div>

      {/* ABA ESPECIAL: ADICIONAR TEXTO (Onde vive a geração por IA e escrita de textos) */}
      {activeTab === 'add_text' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-xs animate-in fade-in duration-150">
          
          {/* Seletor entre Gerar com IA e Escrever/Colar texto próprio */}
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl max-w-sm">
            <button
              onClick={() => setAddMode('ai')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                addMode === 'ai'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>Gerar com IA</span>
            </button>

            <button
              onClick={() => setAddMode('write')}
              className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                addMode === 'write'
                  ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-500" />
              <span>Escrever / Colar</span>
            </button>
          </div>

          {/* MODO IA: FORMULÁRIO DE GERAÇÃO */}
          {addMode === 'ai' && (
            <form onSubmit={handleGenerateAiText} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Área temática:
                </label>
                <select
                  value={aiCategory}
                  onChange={(e) => setAiCategory(e.target.value as TextCategory)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tema ou assunto específico (opcional):
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ex: Como funciona a fotossíntese, A história da escrita..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Tamanho do texto:
                  </label>
                  <select
                    value={aiLength}
                    onChange={(e) => setAiLength(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  >
                    <option value="curto">Curto (~60 palavras)</option>
                    <option value="médio">Médio (~150 palavras)</option>
                    <option value="longo">Longo (~280 palavras)</option>
                    <option value="página">Página (~250 palavras)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nível de vocabulário:
                  </label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                  >
                    <option value="simples">Simples e direto</option>
                    <option value="intermediário">Intermediário</option>
                  </select>
                </div>
              </div>

              {aiError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{aiError}</span>
                </div>
              )}

              {aiGeneratedSuccess && (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Texto gerado e salvo automaticamente com sucesso!</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                    {aiGeneratedSuccess.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                    {aiGeneratedSuccess.body}
                  </p>
                  <button
                    type="button"
                    onClick={() => onSelectText(aiGeneratedSuccess)}
                    className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Digitar este texto agora</span>
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isGeneratingAi}
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isGeneratingAi ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gerando texto educativo com IA...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Gerar e Salvar Texto</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* MODO ESCREVER/COLAR PRÓPRIO */}
          {addMode === 'write' && (
            <form onSubmit={handleSaveCustomText} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Título do texto:
                </label>
                <input
                  type="text"
                  required
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Ex: Resumo de Biologia, Minha Anotação..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Área temática:
                </label>
                <select
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value as TextCategory)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Conteúdo do texto:
                </label>
                <textarea
                  rows={6}
                  required
                  value={customBody}
                  onChange={(e) => setCustomBody(e.target.value)}
                  placeholder="Cole aqui seu parágrafo ou artigo..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={!customTitle.trim() || !customBody.trim()}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Texto na Minha Biblioteca</span>
              </button>
            </form>
          )}

        </div>
      )}

      {/* ÁREA DE LISTAGEM DOS TEXTOS (Abas All, News, AI Texts, My Texts) */}
      {activeTab !== 'add_text' && (
        <div className="space-y-4">
          
          {/* Barra de Filtros e Busca */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-slate-300 dark:focus:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {activeTab === 'all' && (
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                  className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 outline-none"
                >
                  <option value="all">Todas as áreas</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              )}

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="all">Todos os tamanhos</option>
                <option value="curto">Curto (~60 pal.)</option>
                <option value="médio">Médio (~150 pal.)</option>
                <option value="longo">Longo (~280 pal.)</option>
              </select>

              <button
                onClick={() => setFavoritesOnly(!favoritesOnly)}
                className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1 transition-colors cursor-pointer ${
                  favoritesOnly
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
                <span>Favoritos</span>
              </button>

              {activeTab === 'news' && (
                <button
                  onClick={handleRefreshNews}
                  disabled={isLoadingNews}
                  className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center gap-1.5 font-medium hover:bg-blue-100 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingNews ? 'animate-spin' : ''}`} />
                  <span>Atualizar notícias</span>
                </button>
              )}
            </div>
          </div>

          {/* Grade de Textos */}
          {displayedTexts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                Nenhum texto encontrado
              </h3>
              <p className="text-xs text-slate-400">
                Tente ajustar os filtros de busca ou adicione um novo texto.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {displayedTexts.map((text) => {
                const isFav = favorites.includes(text.id);
                const estReadMins = Math.max(1, Math.round(text.wordCount / 120));
                const isUserOrAi = text.sourceType === 'usuario' || text.sourceType === 'ia';

                return (
                  <div
                    key={text.id}
                    onClick={() => setPreviewText(text)}
                    className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group space-y-2.5"
                  >
                    <div className="space-y-1.5">
                      
                      {/* Topo do Cartão: Metadados limpos sem pill */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-semibold text-slate-600 dark:text-slate-300">
                            {text.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          {text.sourceType === 'ia' ? (
                            <span className="font-medium text-indigo-500">Gerado por IA</span>
                          ) : text.sourceType === 'usuario' ? (
                            <span className="font-medium text-emerald-500">Meu texto</span>
                          ) : text.sourceType === 'real' ? (
                            <span className="font-medium text-amber-500">Domínio Público</span>
                          ) : (
                            <span className="font-medium text-slate-400">Texto editorial</span>
                          )}
                        </div>

                        <button
                          onClick={(e) => handleToggleFavorite(text.id, e)}
                          className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                          title="Favoritar"
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>

                      {/* Título com opção de renomeação inline se for user ou AI */}
                      {renamingId === text.id ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(text.id, text.sourceType === 'ia', e as any)}
                            className="flex-1 px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded-lg outline-none"
                            autoFocus
                          />
                          <button
                            onClick={(e) => handleSaveRename(text.id, text.sourceType === 'ia', e)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setRenamingId(null); }}
                            className="p-1 text-slate-400 hover:bg-slate-100 rounded"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {text.title}
                        </h3>
                      )}

                      {/* Excerto */}
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {text.body}
                      </p>
                    </div>

                    {/* Rodapé do Cartão */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        <span>{text.wordCount} pal.</span>
                        <span aria-hidden="true"> · </span>
                        <span>~{estReadMins} min</span>
                      </div>

                      {isUserOrAi ? (
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleStartRename(text.id, text.title, e)}
                            className="p-1 text-slate-400 hover:text-blue-500 rounded"
                            title="Renomear título"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteText(text.id, text.sourceType === 'ia', e)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded"
                            title="Excluir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onSelectText(text)}
                            className="p-1 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded font-semibold flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-current" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 group-hover:underline">
                          <span>Digitar</span>
                          <Play className="w-3 h-3 fill-current" />
                        </span>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* Modal de Prévia do Texto Escolhido */}
      {previewText && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {previewText.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {previewText.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>{previewText.wordCount} palavras</span>
                  {previewText.sourceName && (
                    <>
                      <span>·</span>
                      <span>{previewText.sourceName}</span>
                    </>
                  )}
                  {previewText.sourceType === 'editorial' && (
                    <>
                      <span>·</span>
                      <span>Texto editorial</span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPreviewText(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl text-slate-700 dark:text-slate-300 text-sm leading-relaxed max-h-56 overflow-y-auto">
              {previewText.body}
            </div>

            {previewText.keyPoints && previewText.keyPoints.length > 0 && (
              <div className="space-y-1.5 text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                  Pontos-chave:
                </span>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  {previewText.keyPoints.map((pt, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setPreviewText(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  onSelectText(previewText);
                  setPreviewText(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Digitar este texto</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
