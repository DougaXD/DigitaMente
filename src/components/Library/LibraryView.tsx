import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Star, 
  BookOpen, 
  Trash2, 
  Edit3,
  Play,
  CheckCircle2,
  Newspaper,
  Check,
  X
} from 'lucide-react';
import { StudyText, TextCategory, TextLevel, normalizeCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { getTexts } from '../../data/texts';
import { storageService } from '../../services/storageService';
import { normalizeText } from '../../utils/textNormalizer';
import { t , ui } from '../../i18n';

interface LibraryViewProps {
  onSelectText: (text: StudyText) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ onSelectText }) => {
  const currentSettings = storageService.getSettings();
  const currentLang = currentSettings.language || 'pt-BR';
  const langCode = currentLang.startsWith('pt') ? 'pt' : currentLang.startsWith('es') ? 'es' : 'en';
  // Tabs da biblioteca
  const [activeTab, setActiveTab] = useState<'all' | 'my_texts' | 'add_text'>('all');

  // Filtros e busca
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TextCategory | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<TextLevel | 'all'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Estados de dados persistentes
  const [favorites, setFavorites] = useState<string[]>(() => storageService.getFavoriteIds());
  const [userTexts, setUserTexts] = useState<StudyText[]>(() => storageService.getUserTexts());

  // Modal de Prévia
  const [previewText, setPreviewText] = useState<StudyText | null>(null);

  // Estado de Renomear Título
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');

  // Formulário da aba "Adicionar texto" (Texto próprio do usuário)
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState<TextCategory>('ciencia');
  const [customBody, setCustomBody] = useState('');

  // Textos da biblioteca por idioma filtrados por scope
  const libraryTexts = useMemo(() => {
    const rawList = getTexts(langCode);
    if (langCode === 'pt') {
      return rawList;
    }
    // Em 'en' e 'es', exclui textos 'regional', exceto das categorias 'curiosidades' e 'atualidades'
    return rawList.filter((item) => {
      if (item.scope === 'regional') {
        const cat = normalizeCategory(item.category);
        return cat === 'curiosidades' || cat === 'atualidades';
      }
      return true;
    });
  }, [langCode]);

  // "Meus textos" aparecem em qualquer idioma
  const allTexts = useMemo(() => {
    return [...userTexts, ...libraryTexts];
  }, [userTexts, libraryTexts]);

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = storageService.toggleFavorite(id);
    setFavorites(updated);
  };

  // Exclusão de texto com confirmação
  const handleDeleteText = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(ui.library_tem_certeza_de_que_deseja_excl)) {
      const updated = storageService.deleteUserText(id);
      setUserTexts(updated);
    }
  };

  // Iniciar renomeação
  const handleStartRename = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(id);
    setRenameValue(currentTitle);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!renameValue.trim()) return;
    const updated = storageService.renameUserText(id, renameValue);
    setUserTexts(updated);
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

  // Textos filtrados conforme a aba ativa (apenas dados fixos locais e textos do usuário)
  const displayedTexts = useMemo(() => {
    let list: StudyText[] = [];
    if (activeTab === 'my_texts') {
      list = userTexts;
    } else {
      // 'all'
      list = allTexts;
    }

    return list.filter((item) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchBody = (item.body ?? item.text ?? '').toLowerCase().includes(q);
        if (!matchTitle && !matchBody) return false;
      }
      const itemCategory = normalizeCategory(item.category);
      if (selectedCategory !== 'all' && itemCategory !== selectedCategory) {
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
  }, [activeTab, userTexts, allTexts, searchQuery, selectedCategory, selectedLevel, favoritesOnly, favorites]);

  return (
    <div className="w-full max-w-7xl mx-auto py-4 px-4 sm:px-6 space-y-6">
      
      {/* Cabeçalho Limpo da Biblioteca */}
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
          <span>{ui.library_adicionar_texto}</span>
        </button>
      </div>

      {/* ABA ESPECIAL: ADICIONAR TEXTO (Criação direta de textos do usuário) */}
      {activeTab === 'add_text' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-3xl mx-auto shadow-xs animate-in fade-in duration-150">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Adicionar Novo Texto à Biblioteca
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Escreva ou cole seu próprio texto para treinar digitação. Ele ficará salvo com segurança no seu navegador.
            </p>
          </div>

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
                placeholder={ui.library_ex_resumo_de_biologia_minha_an}
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
                  <option key={c.name} value={c.name}>{t.categories[c.name]?.name || c.name}</option>
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
                placeholder={ui.library_cole_aqui_seu_paragrafo_ou_art}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none resize-none font-sans"
              />
            </div>

            <button
              type="submit"
              disabled={!customTitle.trim() || !customBody.trim()}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{ui.library_salvar_texto_na_minha_bibliote}</span>
            </button>
          </form>
        </div>
      )}

      {/* ÁREA DE LISTAGEM DOS TEXTOS (Abas All, News, My Texts) */}
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
                placeholder={ui.library_buscar_por_titulo}
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
                  <option value="all">{ui.library_todas_as_areas}</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>{t.categories[c.name]?.name || c.name}</option>
                  ))}
                </select>
              )}

              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as any)}
                className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="all">{t.library.allLevels}</option>
                <option value="curto">{t.library.levels.curto} (~60 pal.)</option>
                <option value="médio">{t.library.levels['médio']} (~150 pal.)</option>
                <option value="longo">{t.library.levels.longo} (~280 pal.)</option>
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
                <span>{ui.library_favoritos}</span>
              </button>
            </div>
          </div>

          {/* Grade de Textos */}
          {libraryTexts.length === 0 && activeTab === 'all' && userTexts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {t.library.emptyLanguageTitle}
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {t.library.emptyLanguageDesc}
              </p>
            </div>
          ) : displayedTexts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-12 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                {t.library.emptyTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.library.emptyDesc}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {displayedTexts.map((text) => {
                const isFav = favorites.includes(text.id);
                const estReadMins = Math.max(1, Math.round(text.wordCount / 120));
                const isUserText = text.sourceType === 'usuario';

                return (
                  <div
                    key={text.id}
                    onClick={() => setPreviewText(text)}
                    className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-4 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group space-y-2.5"
                  >
                    <div className="space-y-1.5">
                      
                      {/* Topo do Cartão */}
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-semibold text-slate-600 dark:text-slate-300">
                            {t.categories[normalizeCategory(text.category)]?.name || text.category}
                          </span>
                          <span aria-hidden="true">·</span>
                          {text.sourceType === 'ia' ? (
                            <span className="font-medium text-indigo-500 dark:text-indigo-400">{t.library.sourceIa}</span>
                          ) : text.sourceType === 'usuario' ? (
                            <span className="font-medium text-emerald-500">{t.library.sourceUser}</span>
                          ) : text.sourceType === 'real' ? (
                            <span className="font-medium text-amber-500">{t.library.sourceReal}</span>
                          ) : (
                            <span className="font-medium text-slate-400">{t.library.sourceEditorial}</span>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleToggleFavorite(text.id, e)}
                          className="p-1 text-slate-300 hover:text-amber-400 transition-colors"
                          title={ui.library_favoritar}
                        >
                          <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                        </button>
                      </div>

                      {/* Título com opção de renomeação inline se for texto do usuário */}
                      {renamingId === text.id ? (
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(text.id, e as any)}
                            className="flex-1 px-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded-lg outline-none"
                            autoFocus
                          />
                          <button
                            onClick={(e) => handleSaveRename(text.id, e)}
                            className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); setRenamingId(null); }}
                            className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
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
                        {text.body ?? text.text ?? ''}
                      </p>
                    </div>

                    {/* Rodapé do Cartão */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <div>
                        <span>{text.wordCount} pal.</span>
                        <span aria-hidden="true"> · </span>
                        <span>~{estReadMins} min</span>
                      </div>

                      {isUserText ? (
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={(e) => handleStartRename(text.id, text.title, e)}
                            className="p-1 text-slate-400 hover:text-blue-500 rounded"
                            title={ui.library_renomear_titulo}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteText(text.id, e)}
                            className="p-1 text-slate-400 hover:text-rose-500 rounded"
                            title={ui.library_excluir}
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
                          <span>{ui.library_digitar}</span>
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

      {/* MODAL DE PRÉVIA COMPLETA DO TEXTO */}
      {previewText && (
        <div 
          onClick={() => setPreviewText(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-4 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {previewText.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span>{t.categories[normalizeCategory(previewText.category)]?.name || previewText.category}</span>
                  <span>·</span>
                  <span>{previewText.wordCount} {t.library.words}</span>
                  {previewText.sourceName && (
                    <>
                      <span>·</span>
                      <span>{previewText.sourceName}</span>
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
              {previewText.body ?? previewText.text ?? ''}
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
                <span>{ui.library_digitar_este_texto}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
