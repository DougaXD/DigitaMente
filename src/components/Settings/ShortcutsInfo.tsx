import React from 'react';
import { Keyboard } from 'lucide-react';
import { t } from '../../i18n';

export const ShortcutsInfo: React.FC = () => {
  const shortcuts = [
    { key: t.shortcuts?.tabEnterKey || 'Tab + Enter', desc: t.shortcuts?.newText || 'Novo texto' },
    { key: t.shortcuts?.escKey || 'Esc', desc: t.shortcuts?.restart || 'Reiniciar o texto' },
    { key: t.shortcuts?.ctrlBackspaceKey || 'Ctrl + Backspace', desc: t.shortcuts?.deleteWord || 'Apagar a palavra' },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 rounded-3xl p-6 space-y-3 text-xs">
      <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
        <Keyboard className="w-4 h-4 text-blue-500" />
        <span>{t.shortcuts?.title || 'Atalhos de teclado'}</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {shortcuts.map((sc, i) => (
          <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60">
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400 block mb-0.5">
              {sc.key}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">
              {sc.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
