import React, { useState } from 'react';
import { X, Play, FileText, Check } from 'lucide-react';
import { normalizeText } from '../../utils/textNormalizer';
import { t , ui } from '../../i18n';

interface CustomTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
}

export const CustomTextModal: React.FC<CustomTextModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [textInput, setTextInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = normalizeText(textInput);
    if (cleaned.length > 0) {
      onSubmit(cleaned);
      setTextInput('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.testBar.types.custom}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              {t.typingArea.customTextPrompt}
            </label>
            <textarea
              rows={5}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={ui.custom_text_cole_aqui_seu_paragrafo_artigo}
              className="w-full p-3 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
              autoFocus
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Espaços duplicados e quebras de linha excedentes serão normalizados automaticamente.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {t.typingArea.cancel}
            </button>
            <button
              type="submit"
              disabled={textInput.trim().length === 0}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{t.typingArea.startCustom}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
