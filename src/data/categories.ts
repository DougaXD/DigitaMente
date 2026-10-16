import { TextCategory } from '../types';
import { 
  FlaskConical, 
  Leaf, 
  Cpu, 
  HeartPulse, 
  Users, 
  Landmark, 
  TrendingUp, 
  BookOpen, 
  Sparkles, 
  Newspaper 
} from 'lucide-react';

export interface CategoryInfo {
  name: TextCategory;
  icon: typeof FlaskConical;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    name: 'ciencia',
    icon: FlaskConical,
    color: 'emerald',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-400/10',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'natureza',
    icon: Leaf,
    color: 'teal',
    badgeBg: 'bg-teal-500/10 dark:bg-teal-400/10',
    badgeText: 'text-teal-600 dark:text-teal-400',
  },
  {
    name: 'tecnologia',
    icon: Cpu,
    color: 'cyan',
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-400/10',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
  },
  {
    name: 'saude',
    icon: HeartPulse,
    color: 'rose',
    badgeBg: 'bg-rose-500/10 dark:bg-rose-400/10',
    badgeText: 'text-rose-600 dark:text-rose-400',
  },
  {
    name: 'sociedade',
    icon: Users,
    color: 'violet',
    badgeBg: 'bg-violet-500/10 dark:bg-violet-400/10',
    badgeText: 'text-violet-600 dark:text-violet-400',
  },
  {
    name: 'historia',
    icon: Landmark,
    color: 'orange',
    badgeBg: 'bg-orange-500/10 dark:bg-orange-400/10',
    badgeText: 'text-orange-600 dark:text-orange-400',
  },
  {
    name: 'economia',
    icon: TrendingUp,
    color: 'blue',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-400/10',
    badgeText: 'text-blue-600 dark:text-blue-400',
  },
  {
    name: 'literatura',
    icon: BookOpen,
    color: 'amber',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-400/10',
    badgeText: 'text-amber-600 dark:text-amber-400',
  },
  {
    name: 'curiosidades',
    icon: Sparkles,
    color: 'fuchsia',
    badgeBg: 'bg-fuchsia-500/10 dark:bg-fuchsia-400/10',
    badgeText: 'text-fuchsia-600 dark:text-fuchsia-400',
  },
  {
    name: 'atualidades',
    icon: Newspaper,
    color: 'sky',
    badgeBg: 'bg-sky-500/10 dark:bg-sky-400/10',
    badgeText: 'text-sky-600 dark:text-sky-400',
  },
];
