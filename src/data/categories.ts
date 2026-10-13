import { TextCategory } from '../types';
import { 
  Newspaper, 
  Flame, 
  GraduationCap, 
  Sparkles, 
  Cpu, 
  HeartPulse, 
  TrendingUp, 
  BookOpen 
} from 'lucide-react';

export interface CategoryInfo {
  name: TextCategory;
  description: string;
  icon: typeof Newspaper;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export const CATEGORIES: CategoryInfo[] = [
  // Novas categorias do schema padronizado
  {
    name: 'ciencia',
    description: 'Ciências exatas, biológicas, neurociência e saúde.',
    icon: GraduationCap,
    color: 'emerald',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'literatura',
    description: 'Obras clássicas, prosa e ficção de valor cultural.',
    icon: BookOpen,
    color: 'amber',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-400/10',
    badgeText: 'text-amber-600 dark:text-amber-400',
  },
  {
    name: 'tecnologia',
    description: 'Inovação, computação, chips e conectividade.',
    icon: Cpu,
    color: 'cyan',
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-400/10',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    name: 'natureza',
    description: 'Fauna, flora, ecossistemas e meio ambiente.',
    icon: Sparkles,
    color: 'emerald',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'filosofia',
    description: 'Pensamento crítico, ética, cidadania e sociedade.',
    icon: GraduationCap,
    color: 'violet',
    badgeBg: 'bg-violet-500/10 dark:bg-violet-400/10',
    badgeText: 'text-violet-600 dark:text-violet-400',
  },
  {
    name: 'historia',
    description: 'Grandes períodos, transformações sociais e patrimônio histórico.',
    icon: Flame,
    color: 'rose',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-400/10',
    badgeText: 'text-rose-600 dark:text-rose-400',
  },
  {
    name: 'atualidades',
    description: 'Economia, sustentabilidade urbana e conjuntura.',
    icon: Newspaper,
    color: 'blue',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-400/10',
    badgeText: 'text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Notícias',
    description: 'Acontecimentos factuais e conceitos cívicos essenciais.',
    icon: Newspaper,
    color: 'blue',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-400/10',
    badgeText: 'text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Atualidades',
    description: 'Transformações globais, sociedade, clima e tendências.',
    icon: Flame,
    color: 'amber',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-400/10',
    badgeText: 'text-amber-600 dark:text-amber-400',
  },
  {
    name: 'Estudos',
    description: 'Ciências, história, geografia, língua e matemática.',
    icon: GraduationCap,
    color: 'emerald',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'Curiosidades',
    description: 'Fatos surpreendentes sobre o mundo natural e o cotidiano.',
    icon: Sparkles,
    color: 'violet',
    badgeBg: 'bg-violet-500/10 dark:bg-violet-400/10',
    badgeText: 'text-violet-600 dark:text-violet-400',
  },
  {
    name: 'Tecnologia',
    description: 'Computação, exploração espacial, engenharia e futuro.',
    icon: Cpu,
    color: 'cyan',
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-400/10',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    name: 'Saúde e Bem-estar',
    description: 'Neurociência, hábitos saudáveis, sono e qualidade de vida.',
    icon: HeartPulse,
    color: 'rose',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-400/10',
    badgeText: 'text-rose-600 dark:text-rose-400',
  },
  {
    name: 'Negócios e Finanças',
    description: 'Economia doméstica, planejamento financeiro e carreira.',
    icon: TrendingUp,
    color: 'emerald',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'Literatura clássica',
    description: 'Grandes trechos em prosa da língua portuguesa em domínio público.',
    icon: BookOpen,
    color: 'amber',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-400/10',
    badgeText: 'text-amber-600 dark:text-amber-400',
  },
];
