import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Flame, 
  Clock, 
  Hash, 
  BarChart3, 
  Target, 
  Trash2, 
  AlertCircle,
  GraduationCap,
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { storageService } from '../../services/storageService';
import { TestResult, UserStats, PersonalBest } from '../../types';
import { formatTime } from '../../utils/metrics';
import { t } from '../../i18n';

interface StatsViewProps {
  onStartNewTest: () => void;
}

export const StatsView: React.FC<StatsViewProps> = ({ onStartNewTest }) => {
  const [history, setHistory] = useState<TestResult[]>(() => storageService.getHistory());
  const [stats, setStats] = useState<UserStats>(() => storageService.getStats());
  const [personalBests, setPersonalBests] = useState<Record<string, PersonalBest>>(() => 
    storageService.getPersonalBests()
  );

  const [filterMode, setFilterMode] = useState<string>('all');

  const handleDeleteTest = (id: string) => {
    if (window.confirm(t.stats.confirmDeleteTest)) {
      const updated = storageService.deleteResult(id);
      setHistory(updated);
      setStats(storageService.getStats());
      setPersonalBests(storageService.getPersonalBests());
    }
  };

  const handleClearAll = () => {
    if (confirm(t.stats.confirmClearHistory)) {
      storageService.clearHistory();
      setHistory([]);
    }
  };

  // Prepara dados de evolução para os gráficos
  const chartData = useMemo(() => {
    return [...history].reverse().map((item, index) => ({
      index: index + 1,
      date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      wpm: item.netWpm,
      accuracy: item.accuracy,
    }));
  }, [history]);

  // Teclas mais erradas acumuladas
  const mistypedKeysList = useMemo(() => {
    const entries = Object.entries(stats.mostMistypedKeys || {});
    return entries.sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [stats.mostMistypedKeys]);

  // Histórico filtrado
  const filteredHistory = useMemo(() => {
    if (filterMode === 'all') return history;
    return history.filter((h) => h.durationMode === filterMode || h.testType === filterMode);
  }, [history, filterMode]);

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8 animate-in fade-in duration-200">
      
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {t.stats.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.stats.subtitle}
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.stats.clearAllHistory}</span>
          </button>
        )}
      </div>

      {/* Cartões de Indicadores Gerais */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* WPM Médio */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 block font-medium">
            {t.stats.averageWpm}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">
            {stats.averageWpm}
          </span>
        </div>

        {/* Recorde WPM */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 block font-medium">
            {t.stats.bestWpm}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-amber-500 font-mono flex items-center gap-1">
            <Trophy className="w-5 h-5" />
            <span>{stats.bestWpm}</span>
          </span>
        </div>

        {/* Streak de Dias */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 block font-medium">
            {t.stats.streakDays}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-orange-500 font-mono flex items-center gap-1">
            <Flame className="w-5 h-5 fill-orange-500" />
            <span>{stats.currentStreakDays}</span>
          </span>
        </div>

        {/* Testes Realizados */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 block font-medium">
            {t.stats.totalTests}
          </span>
          <span className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 font-mono">
            {stats.totalTests}
          </span>
        </div>

        {/* Tempo Praticado */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 block font-medium">
            {t.stats.totalTime}
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
            {formatTime(stats.totalTimeSeconds)}
          </span>
        </div>

        {/* Palavras Digitadas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <span className="text-[11px] text-slate-400 block font-medium">
            {t.stats.totalWords}
          </span>
          <span className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-mono">
            {stats.totalWords}
          </span>
        </div>

      </div>

      {/* Gráficos de Evolução */}
      {chartData.length > 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Gráfico de WPM */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-500" />
              <span>{t.stats.wpmEvolution}</span>
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} stroke="var(--line)" />
                  <XAxis dataKey="index" stroke="var(--ink-muted)" fontSize={11} tickLine={false} />
                  <YAxis stroke="var(--ink-muted)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--panel)',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)',
                      fontSize: '12px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    name="WPM Líquido" 
                    stroke="#3b82f6" 
                    strokeWidth={2.5} 
                    dot={{ r: 3 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico de Precisão */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-500" />
              <span>{t.stats.accuracyEvolution}</span>
            </h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.15} stroke="var(--line)" />
                  <XAxis dataKey="index" stroke="var(--ink-muted)" fontSize={11} tickLine={false} />
                  <YAxis domain={[70, 100]} stroke="var(--ink-muted)" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--panel)',
                      borderRadius: '8px',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)',
                      fontSize: '12px',
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="accuracy" 
                    name="Precisão (%)" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    dot={{ r: 3 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      ) : null}

      {/* Seção Dupla: Teclas Mais Erradas & Desempenho no Modo Estudo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Teclas Mais Erradas Acumuladas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500" />
            <span>{t.stats.mostMistypedKeys}</span>
          </h3>

          {mistypedKeysList.length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Nenhuma tecla errada registrada até o momento.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {mistypedKeysList.map(([key, count]) => (
                <div 
                  key={key}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-2 text-xs font-mono"
                >
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {key === ' ' ? 'Espaço (␣)' : key}
                  </span>
                  <span className="text-rose-500 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded text-[11px]">
                    {count}x
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desempenho no Modo Estudo (Quizzes por Área) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-emerald-500" />
            <span>{t.stats.quizPerformance}</span>
          </h3>

          {Object.keys(stats.quizScoresByCategory || {}).length === 0 ? (
            <p className="text-xs text-slate-400 italic">
              Pratique no Modo Estudo para registrar seu aproveitamento nos quizzes.
            </p>
          ) : (
            <div className="space-y-2.5 text-xs">
              {Object.entries(stats.quizScoresByCategory).map(([cat, score]) => {
                const percent = Math.round((score.correct / Math.max(score.totalQuestions, 1)) * 100);
                return (
                  <div key={cat} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-700 dark:text-slate-300">{cat}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {score.correct}/{score.totalQuestions} ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* Tabela de Histórico Recente de Testes */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t.stats.historyTableTitle} ({history.length})
          </h3>

          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="all">Todos os modos</option>
            <option value="time">Por Tempo</option>
            <option value="words">Por Palavras</option>
            <option value="pages">Por Páginas</option>
            <option value="library">Biblioteca</option>
            <option value="common_words">Palavras comuns</option>
          </select>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">
              {t.stats.emptyHistory}
            </p>
            <button
              onClick={onStartNewTest}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              Iniciar meu primeiro teste
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">{t.stats.thDate}</th>
                  <th className="py-2.5 px-3">{t.stats.thMode}</th>
                  <th className="py-2.5 px-3">{t.stats.thCategory}</th>
                  <th className="py-2.5 px-3">{t.stats.thWpm}</th>
                  <th className="py-2.5 px-3">{t.stats.thAccuracy}</th>
                  <th className="py-2.5 px-3">{t.stats.thTime}</th>
                  <th className="py-2.5 px-3 text-right">{t.stats.thActions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5 px-3 text-slate-500">
                      {new Date(item.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                      {item.durationMode === 'time' ? `${item.elapsedSeconds}s` : item.durationMode}
                    </td>
                    <td className="py-2.5 px-3 text-slate-500">
                      {item.category || item.testType}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400 font-mono">
                      {item.netWpm}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                      {item.accuracy}%
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono">
                      {formatTime(item.elapsedSeconds)}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleDeleteTest(item.id)}
                        className="p-1 text-slate-300 hover:text-rose-500 transition-colors"
                        title={t.stats.deleteTest}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
};
