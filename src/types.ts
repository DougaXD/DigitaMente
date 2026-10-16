/**
 * Tipos e Interfaces do DigitaMente
 */

export type TestType = 
  | 'library'       // Texto da biblioteca
  | 'common_words'  // Palavras comuns (~500 mais frequentes)
  | 'no_accents'    // Sem acentos
  | 'alphabet'      // Alfabeto
  | 'numbers'       // Sequências numéricas
  | 'custom';       // Texto colado pelo usuário

export type Language = 'pt-BR' | 'en' | 'es';

export type TestDurationMode = 'time' | 'words' | 'pages' | 'full_text';

export type TextCategory = 
  | 'ciencia'
  | 'natureza'
  | 'tecnologia'
  | 'saude'
  | 'sociedade'
  | 'historia'
  | 'economia'
  | 'literatura'
  | 'curiosidades'
  | 'atualidades';

export function normalizeCategory(raw: string | undefined | null): TextCategory {
  if (!raw) return 'curiosidades';
  const val = String(raw).trim();
  switch (val) {
    case 'ciencia': return 'ciencia';
    case 'natureza': return 'natureza';
    case 'tecnologia': return 'tecnologia';
    case 'saude': return 'saude';
    case 'sociedade': return 'sociedade';
    case 'filosofia': return 'sociedade';
    case 'historia': return 'historia';
    case 'economia': return 'economia';
    case 'literatura': return 'literatura';
    case 'curiosidades': return 'curiosidades';
    case 'atualidades': return 'atualidades';
    // Mapeamento de compatibilidade de categorias legadas:
    case 'Notícias': return 'atualidades';
    case 'Atualidades': return 'atualidades';
    case 'Estudos': return 'ciencia';
    case 'Curiosidades': return 'curiosidades';
    case 'Tecnologia': return 'tecnologia';
    case 'Saúde e Bem-estar': return 'saude';
    case 'Negócios e Finanças': return 'economia';
    case 'Literatura clássica': return 'literatura';
    default: return 'curiosidades';
  }
}

export type TextDifficulty = 'facil' | 'medio' | 'dificil';
export type TextOrigin = 'universal' | 'br-specific';
export type TextLocale = 'pt-BR';

export interface Text {
  id: string;
  title: string;
  text: string;
  category: TextCategory;
  difficulty: TextDifficulty;
  origin: TextOrigin;
  locale: TextLocale;
}

export type TextLevel = 'curto' | 'médio' | 'longo';
export type SourceType = 'editorial' | 'real' | 'ia' | 'usuario';

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

export interface StudyText extends Partial<Text> {
  id: string;
  title: string;
  category: TextCategory;
  subcategory?: string;
  lang: string;
  level: TextLevel;
  wordCount: number;
  body: string;
  text?: string;
  difficulty?: TextDifficulty;
  origin?: TextOrigin;
  locale?: TextLocale;
  scope?: 'global' | 'regional';
  region?: string;
  groupId?: string;
  sourceType: SourceType;
  sourceName?: string;
  sourceUrl?: string;
  license?: string;
  keyPoints?: string[];
  quiz?: QuizQuestion[];
  isFavorite?: boolean;
  createdAt?: string;
}

export function normalizeStudyText(raw: StudyText): StudyText {
  const normCategory = normalizeCategory(raw.category);
  const scope = raw.scope ?? (raw.origin === 'br-specific' ? 'regional' : 'global');
  const region = raw.region ?? (scope === 'regional' ? 'BR' : undefined);
  const body = raw.body ?? raw.text ?? '';
  return {
    ...raw,
    category: normCategory,
    scope,
    region,
    body,
    text: body,
  };
}

export type ErrorBehavior = 'free' | 'stop_on_error' | 'require_word_correction';
export type WrongLetterMode = 'jump' | 'replace' | 'above' | 'off';
export type CaretStyle = 'line' | 'underline' | 'block';
export type FontFamily = 'sans' | 'mono' | 'serif';
export type AccentColor = 'blue' | 'emerald' | 'amber' | 'rose' | 'violet' | 'cyan';

export type KeySoundProfile = 'mechanical' | 'clicky' | 'membrane';
export type ErrorSoundProfile = 'buzzer' | 'descending_beep' | 'dry_knock';

export interface Settings {
  settingsVersion: number;

  // Digitação
  errorBehavior: ErrorBehavior;
  allowBackspace: boolean;
  blockPastWords: boolean;
  includePunctuationInWords: boolean;
  omitInvertedMarks: boolean;
  language: Language;

  // Feedback sonoro
  soundEnabled: boolean;
  errorSound: boolean;
  keySound: boolean;
  completionSound: boolean;
  volume: number; // 0 to 1 (geral)
  keyVolume: number; // 0 to 1
  errorVolume: number; // 0 to 1
  keySoundProfile: KeySoundProfile;
  errorSoundProfile: ErrorSoundProfile;

  // Feedback visual
  wrongLetterMode: WrongLetterMode;
  showWrongLetter?: boolean; // compatibilidade
  wrongLetterStyle?: 'above' | 'replace'; // compatibilidade
  capsLockWarning: boolean;
  errorShake: boolean;
  colorblindMode: boolean;
  hideUiOnTyping: boolean; // Modo foco automático

  // Aparência
  theme: 'light' | 'dark' | 'auto';
  accentColor: AccentColor;
  fontFamily: FontFamily;
  fontSize: number; // 16 to 40
  letterSpacing: number; // -1 to 4
  lineHeight: number; // 1.4 to 2.4
  visibleLines: number; // 2 to 5
  caretStyle: CaretStyle;
  caretSmoothness: boolean;
  reduceMotion: boolean;

  // Exibição ao vivo durante o teste
  showLiveWpm: boolean;
  showLiveAccuracy: boolean;
  showLiveTimer: boolean;
  showTextMetadata: boolean;
  showShortcutsTip: boolean;

  // Modo Estudo e Biblioteca
  studyMode: boolean;
  studyPriorReading: boolean;
  virtualKeyboard: boolean;
  includeAiAndUserInRandom: boolean;

  // Padrões do teste
  defaultTestType: TestType;
  defaultDurationMode: TestDurationMode;
  defaultTimeSeconds: number;
  defaultWordCount: number;
  defaultPageCount: number;
  defaultCategory: TextCategory | 'Aleatório';
}

export interface KeystrokeLog {
  timestamp: number; // ms from test start
  expectedChar: string;
  typedChar: string;
  isCorrect: boolean;
  position: number;
  isCorrection?: boolean; // if backspace
}

export interface TestResult {
  id: string;
  date: string;
  testType: TestType;
  durationMode: TestDurationMode;
  category?: string;
  textTitle?: string;
  textId?: string;
  lang?: string;

  // Métricas principais
  elapsedSeconds: number;
  netWpm: number;
  grossWpm: number;
  accuracy: number;
  netStrokes: number;
  grossStrokes: number;
  errorsCount: number;
  correctionsCount: number;
  totalStrokes: number;
  wordsTyped: number;
  charsTyped: number;

  // Amostras para gráficos
  wpmTimeline: { second: number; wpm: number; rawWpm: number; errors: number }[];
  mistypedKeys: { expected: string; typed: string; count: number }[];

  // Quiz e estudo
  isStudyMode: boolean;
  isValid?: boolean; // Falso se tempo real divergiu mais de 2s da duração configurada
  quizScore?: { total: number; correct: number };
  keyPoints?: string[];
  quiz?: QuizQuestion[];
}

export interface PersonalBest {
  modeKey: string; // e.g. "time_60" or "words_50"
  netWpm: number;
  accuracy: number;
  date: string;
}

export interface UserStats {
  totalTests: number;
  totalTimeSeconds: number;
  totalWords: number;
  averageWpm: number;
  bestWpm: number;
  currentStreakDays: number;
  lastPracticeDate?: string;
  mostMistypedKeys: Record<string, number>;
  quizScoresByCategory: Record<string, { attempts: number; correct: number; totalQuestions: number }>;
}
