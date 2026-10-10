/**
 * Métricas de Digitação do DigitaMente
 * 
 * Fórmulas oficiais conforme padrão internacional de digitação:
 * 1. minutos = tempo decorrido em segundos / 60
 * 2. WPM bruto (Gross WPM) = (toques brutos / 5) / minutos
 *    - Onde 5 caracteres é a média de tamanho de palavra universal.
 * 3. WPM líquido (Net WPM) = (toques líquidos / 5) / minutos
 *    - Onde toques líquidos são os caracteres corretos presentes no resultado.
 * 4. Precisão (%) = ((toques brutos - erros cometidos) / toques brutos) * 100
 *    - Toques brutos compreende cada caractere digitado (corretos + errados).
 * 5. Toques totais = toques brutos + correções (uso de Backspace)
 */

export interface MetricCalculationInput {
  grossStrokes: number;       // Todos os caracteres digitados (certos e errados)
  netStrokes: number;         // Caracteres corretos no resultado final
  errorsCount: number;        // Toques errados cometidos ao longo do teste
  correctionsCount: number;   // Quantidade de toques de Backspace efetuados
  elapsedSeconds: number;     // Duração do teste em segundos
}

export interface MetricResults {
  grossWpm: number;
  netWpm: number;
  accuracy: number;
  grossStrokes: number;
  netStrokes: number;
  errorsCount: number;
  correctionsCount: number;
  totalStrokes: number;
  elapsedSeconds: number;
}

/**
 * Calcula todas as métricas oficiais de desempenho a partir dos contadores de toques e tempo.
 */
export function calculateMetrics(input: MetricCalculationInput): MetricResults {
  const {
    grossStrokes,
    netStrokes,
    errorsCount,
    correctionsCount,
    elapsedSeconds,
  } = input;

  // Proteção: não calcula WPM com menos de 1 segundo decorrido (mostra 0)
  if (elapsedSeconds < 1) {
    const totalStrokes = grossStrokes + correctionsCount;
    return {
      grossWpm: 0,
      netWpm: 0,
      accuracy: 100,
      grossStrokes,
      netStrokes,
      errorsCount,
      correctionsCount,
      totalStrokes,
      elapsedSeconds: 0,
    };
  }

  const minutes = elapsedSeconds / 60;

  // WPM bruto: todas as tentativas / 5 caracteres / minutos
  const rawGrossWpm = minutes > 0 ? (grossStrokes / 5) / minutes : 0;
  const grossWpm = Math.max(0, Math.round(rawGrossWpm));

  // WPM líquido: caracteres corretos / 5 caracteres / minutos
  const rawNetWpm = minutes > 0 ? (netStrokes / 5) / minutes : 0;
  const netWpm = Math.max(0, Math.round(rawNetWpm));

  // Precisão em porcentagem: (toques brutos - erros) / toques brutos * 100
  let accuracy = 100;
  if (grossStrokes > 0) {
    const validStrokes = Math.max(0, grossStrokes - errorsCount);
    accuracy = Math.round((validStrokes / grossStrokes) * 1000) / 10; // 1 casa decimal
  }

  // Toques totais: caracteres digitados + backspaces usados
  const totalStrokes = grossStrokes + correctionsCount;

  return {
    grossWpm,
    netWpm,
    accuracy,
    grossStrokes,
    netStrokes,
    errorsCount,
    correctionsCount,
    totalStrokes,
    elapsedSeconds,
  };
}

/**
 * Formata segundos em formato legível mm:ss ou ss
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  if (mins > 0) {
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
  return `${secs}s`;
}
