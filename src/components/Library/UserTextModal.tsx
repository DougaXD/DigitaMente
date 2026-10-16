import React, { useState, useEffect } from 'react';
import { X, BookPlus, Check } from 'lucide-react';
import { StudyText, TextCategory } from '../../types';
import { CATEGORIES } from '../../data/categories';
import { normalizeText } from '../../utils/textNormalizer';
import { t , ui } from '../../i18n';

interface UserTextModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: StudyText) => void;
  initialText?: StudyText | null;
}

export const UserTextModal: React.FC<UserTextModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialText,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TextCategory>('ciencia');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (initialText) {
      setTitle(initialText.title);
      setCategory(initialText.category);
      setBody(initialText.body);
    } else {
      setTitle('');
      setCategory('ciencia');
      setBody('');
    }
  }, [initialText, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanBody = normalizeText(body);
    const words = cleanBody.split(/\s+/).filter(Boolean);

    const newText: StudyText = {
      id: initialText?.id || `user-${Date.now()}`,
      title: title.trim() || 'Meu Texto de Estudo',
      category,
      lang: 'pt',
      level: words.length < 90 ? 'curto' : words.length < 220 ? 'médio' : 'longo',
      wordCount: words.length,
      body: cleanBody,
      sourceType: 'usuario',
      sourceName: 'Criado pelo Usuário',
      createdAt: initialText?.createdAt || new Date().toISOString(),
    };

    onSave(newText);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <BookPlus className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {initialText ? t.library.customTextModalEditTitle : t.library.customTextModalTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.library.inputTitle}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={ui.user_text_ex_resumo_de_biologia_celular}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.library.inputCategory}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TextCategory)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {CATEGORIES.map((cat) => (
                <option key={t.categories[cat.name]?.name || cat.name} value={t.categories[cat.name]?.name || cat.name}>
                  {t.categories[cat.name]?.name || cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {t.library.inputBody}
            </label>
            <textarea
              rows={6}
              required
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={ui.user_text_digite_ou_cole_aqui_o_conteudo}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 resize-none font-sans"
            />
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              {t.library.inputBodyHint}
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              {t.library.cancel}
            </button>
            <button
              type="submit"
              disabled={!title.trim() || !body.trim()}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{t.library.saveText}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
