import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Loader2, 
  ArrowRight, 
  RotateCcw, 
  BookOpen,
  AlertTriangle 
} from 'lucide-react';
import { TextCategory, TextLevel, StudyText } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { geminiService } from '../../services/geminiService';
import { t } from '../../i18n';

interface AiGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGeneratedText: (text: StudyText) => void;
}

export const AiGenerateModal: React.FC<AiGenerateModalProps> = ({
  isOpen,
  onClose,
  onSelectGeneratedText,
}) => {
  const [category, setCategory] = useState<TextCategory>('Estudos');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [length, setLength] = useState<TextLevel | 'página'>('médio');
  const [difficulty, setDifficulty] = useState<'simples' | 'intermediário'>('simples');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [generatedText, setGeneratedText] = useState<StudyText | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const text = await geminiService.generateStudyText({
        category,
        customTopic: customTopic.trim() || undefined,
        length,
        difficulty,
      });
      setGeneratedText(text);
    } catch (err: any) {
      console.error('Falha na IA:', err);
      setErrorMsg(
        err?.message ||
          'Não foi possível conectar com o serviço de IA no momento. Verifique sua conexão ou escolha um dos textos da nossa biblioteca.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTyping = () => {
    if (generatedText) {
      onSelectGeneratedText(generatedText);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Cabeçalho */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {t.aiModal.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.aiModal.subtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário de Configuração da Geração */}
        {!generatedText && (
          <div className="space-y-4">
            
            {/* Categoria */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.aiModal.fieldCategory}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TextCategory)}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} — {cat.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Tema ou Assunto Específico */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {t.aiModal.fieldTopic}
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder={t.aiModal.fieldTopicPlaceholder}
                className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Tamanho e Dificuldade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.aiModal.fieldLength}
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value as any)}
                  className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="curto">{t.aiModal.lengths.curto}</option>
                  <option value="médio">{t.aiModal.lengths.médio}</option>
                  <option value="longo">{t.aiModal.lengths.longo}</option>
                  <option value="página">{t.aiModal.lengths.página}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  {t.aiModal.fieldDifficulty}
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="simples">{t.aiModal.difficulties.simples}</option>
                  <option value="intermediário">{t.aiModal.difficulties.intermediário}</option>
                </select>
              </div>
            </div>

            {/* Mensagem de Erro com Fallback */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">{errorMsg}</span>
                  <p className="mt-1 text-slate-600 dark:text-slate-400">
                    Você pode praticar agora mesmo com os textos da nossa biblioteca de estudos!
                  </p>
                </div>
              </div>
            )}

            {/* Botão de Disparo */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isLoading}
                onClick={handleGenerate}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t.aiModal.generating}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>{t.aiModal.generateBtn}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        )}

        {/* Prévia do Texto Gerado com Sucesso */}
        {generatedText && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-200/80 dark:border-blue-900/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {generatedText.category} · {generatedText.wordCount} {t.library.words}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-200 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-[10px] font-semibold">
                  {t.library.sourceIa}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {generatedText.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans max-h-56 overflow-y-auto pr-1">
                {generatedText.body}
              </p>
            </div>

            {/* Aviso de Transparência de IA [P1] */}
            <p className="text-[11px] text-slate-400 dark:text-slate-500 italic text-center">
              {t.aiModal.aiDisclaimer}
            </p>

            {/* Botões de Ação na Prévia */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setGeneratedText(null)}
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.aiModal.generateAnother}</span>
              </button>

              <button
                type="button"
                onClick={handleStartTyping}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                <span>{t.aiModal.startTypingGenerated}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
