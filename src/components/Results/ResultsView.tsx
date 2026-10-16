import React, { useEffect, useState, useMemo } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  ArrowRight, 
  BarChart2, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Award,
  HelpCircle,
  Clock,
  Zap,
  Target,
  Hash,
  AlertCircle
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
import confetti from 'canvas-confetti';
import { TestResult, QuizQuestion, StudyText } from '../../types';
import { formatTime } from '../../utils/metrics';
import { storageService } from '../../services/storageService';
import { t , ui } from '../../i18n';

interface ResultsViewProps {
  result: TestResult;
  isNewRecord: boolean;
  studyText?: StudyText | null;
  onRetry: () => void;
  onNewText: () => void;
  onViewStats: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  isNewRecord,
  studyText,
  onRetry,
  onNewText,
  onViewStats,
}) => {
  // Estado do quiz interativo de fixação
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Efeito de confetes para novo recorde
  useEffect(() => {
    if (isNewRecord) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Ignora
      }
    }
  }, [isNewRecord]);

  const rawQuizQuestions: QuizQuestion[] = studyText?.quiz || result.quiz || [];
  const keyPoints: string[] = studyText?.keyPoints || result.keyPoints || [];

  // Fisher-Yates shuffle helper
  const fisherYatesShuffle = <T,>(array: T[]): T[] => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // Prepara as perguntas com opções embaralhadas e distribuição justa (shuffle bag 0..3)
  const preparedQuiz = useMemo(() => {
    if (!rawQuizQuestions || rawQuizQuestions.length === 0) return [];

    // Shuffle bag de posições (0..3) para garantir distribuição uniforme e evitar padrões fixos
    let bag: number[] = [];
    const refillBag = () => {
      bag = fisherYatesShuffle([0, 1, 2, 3]);
    };

    return rawQuizQuestions.map((q) => {
      const correctText = q.options[q.answerIndex] ?? q.options[0];
      const incorrectOptions = q.options.filter((_, idx) => idx !== q.answerIndex);
      const shuffledIncorrect = fisherYatesShuffle(incorrectOptions);

      if (bag.length === 0) {
        refillBag();
      }
      const targetPos = bag.pop()!;
      // Garante que o targetPos cabe nas opções disponíveis
      const safePos = Math.min(targetPos, q.options.length - 1);

      const finalOptions: string[] = [];
      let incIdx = 0;
      for (let i = 0; i < q.options.length; i++) {
        if (i === safePos) {
          finalOptions.push(correctText);
        } else {
          finalOptions.push(shuffledIncorrect[incIdx++] ?? '');
        }
      }

      return {
        question: q.question,
        options: finalOptions,
        correctValue: correctText,
        explanation: q.explanation,
      };
    });
  }, [rawQuizQuestions]);

  const handleSelectOption = (qIndex: number, optionValue: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qIndex]: optionValue }));
  };

  const handleFinishQuiz = () => {
    let score = 0;
    preparedQuiz.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctValue) {
        score++;
      }
    });
    setQuizScore(score);
    setQuizSubmitted(true);

    // Atualiza resultado e estatísticas de quiz no storageService
    const updatedResult: TestResult = {
      ...result,
      quizScore: { total: preparedQuiz.length, correct: score },
    };
    storageService.saveResult(updatedResult);

    if (score === preparedQuiz.length) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      
      {/* Banner de Novo Recorde */}
      {isNewRecord && (
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-400/20 to-amber-500/20 border border-amber-500/40 rounded-2xl p-4 flex items-center justify-between text-amber-800 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white shadow-md">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                {t.results.newRecord}
              </h3>
              <p className="text-xs text-amber-700/80 dark:text-amber-300/80">
                Você superou seu recorde anterior neste modo de digitação!
              </p>
            </div>
          </div>
          <span className="text-2xl font-black font-mono">
            {result.netWpm} WPM
          </span>
        </div>
      )}

      {/* Cartões Principais de Desempenho */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* WPM Líquido (Grande Destaque) */}
        <div className="col-span-2 sm:col-span-1 bg-white dark:bg-slate-900 border-2 border-blue-500/30 dark:border-blue-500/40 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>{t.results.netWpm}</span>
            <Zap className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-4xl sm:text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tight font-mono">
            {result.netWpm}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            Bruto: <span className="font-semibold">{result.grossWpm} WPM</span>
          </div>
        </div>

        {/* Precisão */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>{t.results.accuracy}</span>
            <Target className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
            {result.accuracy}%
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            {result.grossStrokes - result.errorsCount} certos de {result.grossStrokes}
          </div>
        </div>

        {/* Erros e Correções */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>{ui.results_erros_e_correcoes}</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-rose-600 dark:text-rose-400 font-mono">
            {result.errorsCount}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            {result.correctionsCount} Backspaces usados
          </div>
        </div>

        {/* Tempo e Toques */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold mb-2">
            <span>{t.results.totalTime}</span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-200 font-mono">
            {formatTime(result.elapsedSeconds)}
          </div>
          <div className="text-[11px] text-slate-400 dark:text-slate-500 mt-2">
            {result.totalStrokes} toques totais
          </div>
        </div>

      </div>

      {/* Grade de Métricas Secundárias (Fórmulas Oficiais) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 block">{t.results.netStrokes}</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
            {result.netStrokes} caracteres
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">{t.results.grossStrokes}</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
            {result.grossStrokes} caracteres
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">{t.results.wordsTyped}</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
            {result.wordsTyped} {t.library.words}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block">{t.results.totalStrokes}</span>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
            {result.totalStrokes} ({result.grossStrokes} + {result.correctionsCount})
          </span>
        </div>
      </div>

      {/* Gráfico de Evolução ao Longo do Teste [P1] */}
      {result.wpmTimeline && result.wpmTimeline.length > 1 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-blue-500" />
              <span>{t.results.chartTitle}</span>
            </h3>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>{ui.results_wpm_liquido}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                <span>{ui.results_wpm_bruto}</span>
              </span>
            </div>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.wpmTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} stroke="var(--line)" />
                <XAxis dataKey="second" unit="s" stroke="var(--ink-muted)" fontSize={11} tickLine={false} />
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
                  dataKey="rawWpm" 
                  name={ui.results_wpm_bruto} 
                  stroke="#94a3b8" 
                  strokeWidth={1.5} 
                  strokeDasharray="4 4"
                  dot={false} 
                />
                <Line 
                  type="monotone" 
                  dataKey="wpm" 
                  name={ui.results_wpm_liquido} 
                  stroke="#3b82f6" 
                  strokeWidth={2.5} 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Teclas com Mais Erros [P1] */}
      {result.mistypedKeys && result.mistypedKeys.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">
            {t.results.mistypedKeysTitle}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {result.mistypedKeys.slice(0, 6).map((item, index) => (
              <div 
                key={index}
                className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="font-bold text-slate-800 dark:text-slate-100">
                    {item.expected === ' ' ? '␣' : item.expected}
                  </span>
                  <span className="text-slate-400">→</span>
                  <span className="text-rose-500 font-bold">
                    {item.typed === ' ' ? '␣' : item.typed}
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-semibold">
                  {item.count}x
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEÇÃO FIXAÇÃO DE CONTEÚDO (Modo Estudo) [P1] */}
      {Boolean(result.isStudyMode && (keyPoints.length > 0 || preparedQuiz.length > 0)) && (
        <div className="bg-gradient-to-b from-blue-50/50 to-white dark:from-slate-900 dark:to-slate-900 border border-blue-200 dark:border-blue-900/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {t.results.studySectionTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Fixe os principais conceitos do texto que você acabou de ler e digitar.
              </p>
            </div>
          </div>

          {/* Pontos-chave do texto */}
          {keyPoints.length > 0 && (
            <div className="bg-white dark:bg-slate-800/70 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                {t.results.keyPointsTitle}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                {keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mini Quiz Interativo */}
          {preparedQuiz.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {t.results.quizTitle}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t.results.quizSubtitle}
                  </p>
                </div>
                {quizSubmitted && (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                    {ui.quiz_corretas_de.replace("{score}", String(quizScore)).replace("{total}", String(preparedQuiz.length))}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {preparedQuiz.map((q, qIndex) => {
                  const userAnswer = selectedAnswers[qIndex];

                  return (
                    <div 
                      key={qIndex}
                      className="bg-white dark:bg-slate-800/70 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3"
                    >
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {qIndex + 1}. {q.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = userAnswer === opt;
                          const isCorrectOption = opt === q.correctValue;

                          let btnStyle = 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50';

                          if (quizSubmitted) {
                            if (isCorrectOption) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold';
                            } else if (isSelected && !isCorrectOption) {
                              btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                            }
                          } else if (isSelected) {
                            btnStyle = 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium';
                          }

                          return (
                            <button
                              key={optIndex}
                              disabled={quizSubmitted}
                              onClick={() => handleSelectOption(qIndex, opt)}
                              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                            >
                              <span>{opt}</span>
                              {quizSubmitted && isCorrectOption && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                              )}
                              {quizSubmitted && isSelected && !isCorrectOption && (
                                <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explicação após o envio */}
                      {quizSubmitted && q.explanation && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-1 border-t border-slate-100 dark:border-slate-700/50">
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {!quizSubmitted && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleFinishQuiz}
                    disabled={Object.keys(selectedAnswers).length < preparedQuiz.length}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    {t.results.finishQuiz}
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* Botões de Ação Inferiores */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={onViewStats}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors cursor-pointer"
        >
          <BarChart2 className="w-4 h-4" />
          <span>{t.results.viewStats}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.results.tryAgain}</span>
          </button>

          <button
            onClick={onNewText}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>{t.results.nextText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
