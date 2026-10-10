import React from 'react';

interface VirtualKeyboardProps {
  nextChar?: string;
  capsLockOn?: boolean;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  nextChar = '',
  capsLockOn = false,
}) => {
  const rows = [
    ['\'', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '´', '['],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'ç', '~', ']'],
    ['\\', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', ';', '/'],
    ['espaço'],
  ];

  const targetLower = nextChar.toLowerCase();

  return (
    <div className="w-full max-w-3xl mx-auto p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 select-none text-xs my-4 shadow-sm">
      <div className="flex flex-col gap-1.5 items-center">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5 justify-center w-full">
            {row.map((key) => {
              const isSpace = key === 'espaço';
              const isNext = isSpace
                ? nextChar === ' '
                : key === targetLower;

              return (
                <div
                  key={key}
                  className={`h-9 flex items-center justify-center rounded-lg border font-mono font-medium transition-all ${
                    isSpace ? 'w-64 text-[11px]' : 'w-9 sm:w-11 text-xs'
                  } ${
                    isNext
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105 font-bold animate-pulse'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600 shadow-2xs'
                  }`}
                >
                  {isSpace ? 'Espaço' : capsLockOn ? key.toUpperCase() : key}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
