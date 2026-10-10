import React from 'react';
import { Settings, TestDurationMode } from '../../types';
import { formatTime } from '../../utils/metrics';

interface LiveStatsProps {
  settings: Settings;
  liveWpm: number;
  liveAccuracy: number;
  elapsedSeconds: number;
  timeLimitSeconds: number;
  durationMode: TestDurationMode;
  typedWords: number;
  wordLimit: number;
  totalCharsTyped: number;
  targetTotalChars: number;
}

export const LiveStats: React.FC<LiveStatsProps> = ({
  settings,
  liveWpm,
  liveAccuracy,
  elapsedSeconds,
  timeLimitSeconds,
  durationMode,
  typedWords,
  wordLimit,
  totalCharsTyped,
  targetTotalChars,
}) => {
  const isAnyActive = settings.showLiveWpm || settings.showLiveAccuracy || settings.showLiveTimer;

  // Se nada estiver ligado, mantém um espaçador fixo de ~44 px para a caixa nunca se mover
  if (!isAnyActive) {
    return <div className="h-[44px] mb-2 select-none pointer-events-none" aria-hidden="true" />;
  }

  // Calcula exibição do tempo ou progresso
  let progressDisplay = '';
  if (durationMode === 'time') {
    const remaining = Math.max(0, timeLimitSeconds - elapsedSeconds);
    progressDisplay = formatTime(remaining);
  } else if (durationMode === 'words') {
    progressDisplay = `${typedWords} / ${wordLimit}`;
  } else {
    progressDisplay = `${totalCharsTyped} / ${targetTotalChars}`;
  }

  return (
    <div className="w-full flex items-center justify-end gap-6 h-[44px] mb-2 tabular-nums select-none">
      {/* WPM Ao Vivo (se ligado, menor 20px) */}
      {settings.showLiveWpm && (
        <span className="flex items-baseline gap-1.5 text-[20px] font-bold text-slate-700 dark:text-slate-200">
          <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">WPM</span>
          <span>{liveWpm}</span>
        </span>
      )}

      {/* Precisão Ao Vivo (se ligada, menor 20px) */}
      {settings.showLiveAccuracy && (
        <span className="flex items-baseline gap-1.5 text-[20px] font-bold text-slate-700 dark:text-slate-200">
          <span className="text-[12px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">Precisão</span>
          <span>{liveAccuracy}%</span>
        </span>
      )}

      {/* Contador de tempo / progresso: 32px, font-weight 700, alto contraste (7:1) */}
      {settings.showLiveTimer && (
        <span className="font-mono text-[32px] font-bold tracking-tight text-blue-700 dark:text-blue-300">
          {progressDisplay}
        </span>
      )}
    </div>
  );
};

