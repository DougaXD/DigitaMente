import React from 'react';
import { BookOpen, CheckCircle, ArrowRight, X } from 'lucide-react';
import { StudyText } from '../../types';
import { t } from '../../i18n';

interface StudyPreviewModalProps {
  studyText: StudyText;
  isOpen: boolean;
  onReady: () => void;
  onClose: () => void;
}

export const StudyPreviewModal: React.FC<StudyPreviewModalProps> = ({
  studyText,
  isOpen,
  onReady,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Cabeçalho */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {t.typingArea.studyReadingTitle}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t.typingArea.studyReadingDesc}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Título do texto e Categoria */}
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            {t.categories[studyText.category]?.name || studyText.category} {studyText.subcategory ? `· ${studyText.subcategory}` : ''}
          </span>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1">
            {studyText.title}
          </h3>
        </div>

        {/* Conteúdo do Texto para Leitura Prévia */}
        <div className="max-h-72 overflow-y-auto pr-2 text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
          {studyText.body}
        </div>

        {/* Pontos de Destaque se houver */}
        {studyText.keyPoints && studyText.keyPoints.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t.results.keyPointsTitle}:
            </h4>
            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {studyText.keyPoints.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Ação */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {t.typingArea.skipReading}
          </button>

          <button
            onClick={onReady}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>{t.typingArea.readyToType}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
