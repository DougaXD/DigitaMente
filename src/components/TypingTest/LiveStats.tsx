import { ui } from '../../i18n';
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

  if (!isAnyActive) {
    return null;
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
    <div className="flex items-center gap-3.5 select-none shrink-0 tabular-nums">
      {/* WPM Ao Vivo (texto simples de 16px) */}
      {settings.showLiveWpm && (
        <span className="flex items-baseline gap-1 text-[16px] text-slate-600 dark:text-slate-400">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">WPM</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{liveWpm}</span>
        </span>
      )}

      {/* Precisão Ao Vivo (texto simples de 16px) */}
      {settings.showLiveAccuracy && (
        <span className="flex items-baseline gap-1 text-[16px] text-slate-600 dark:text-slate-400">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">{ui.live_stats_acc}</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{liveAccuracy}%</span>
        </span>
      )}

      {/* Contador menor: .test-counter (--counter-size: 22px, font-weight 600, tabular-nums, cor principal) */}
      {settings.showLiveTimer && (
        <span className="test-counter">
          {progressDisplay}
        </span>
      )}
    </div>
  );
};

