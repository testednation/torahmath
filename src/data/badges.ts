import { LESSONS, type LessonId } from './lessons';
import type { SavedProgressState } from '../utils/localProgress';

export type BadgeIconType =
  | 'spark'
  | 'tablets'
  | 'menorah'
  | 'ark'
  | 'tallit'
  | 'sukkah'
  | 'soup'
  | 'gematria'
  | 'shulchan'
  | 'arcade'
  | 'worksheet'
  | 'crown';

export interface BadgeProgress {
  earned: boolean;
  current: number;
  target: number;
}

export interface BadgeDefinition {
  id: string;
  title: string;
  hebrewTitle: string;
  description: string;
  accent: 'blue' | 'amber' | 'emerald';
  iconType: BadgeIconType;
  evaluate: (state: SavedProgressState) => BadgeProgress;
}

function countLessonSolved(
  solvedLog: Record<string, string>,
  lessonId: LessonId
): { solved: number; total: number } {
  const lesson = LESSONS.find((l) => l.id === lessonId);
  if (!lesson) return { solved: 0, total: 5 };
  const solved = lesson.challenges.filter((c) => Boolean(solvedLog[c.id])).length;
  return { solved, total: lesson.challenges.length };
}

function countTotalSolvedChallenges(solvedLog: Record<string, string>): number {
  return Object.keys(solvedLog).filter((k) => !k.startsWith('game:')).length;
}

function countTotalGameWins(state: SavedProgressState): number {
  return Object.values(state.gameStats).reduce((sum, g) => sum + g.wins, 0);
}

export const REWARD_BADGES: BadgeDefinition[] = [
  {
    id: 'first-spark',
    title: 'First Spark',
    hebrewTitle: 'ניצוץ ראשון',
    description: 'Solve your very first Torah, Gemara, or Shulchan Aruch math challenge.',
    accent: 'amber',
    iconType: 'spark',
    evaluate: (state) => {
      const count = countTotalSolvedChallenges(state.solvedLog);
      return { earned: count >= 1, current: Math.min(count, 1), target: 1 };
    },
  },
  {
    id: 'beginner-grad',
    title: 'Two Tablets Graduate',
    hebrewTitle: 'בוגר מתחילים',
    description: 'Complete all 5 steps of the Total Beginner Tutorial.',
    accent: 'blue',
    iconType: 'tablets',
    evaluate: (state) => ({
      earned: state.beginnerDone,
      current: state.beginnerDone ? 5 : Math.min(state.beginnerStep, 4),
      target: 5,
    }),
  },
  {
    id: 'chanukah-master',
    title: 'Menorah Counter',
    hebrewTitle: 'מומחה נרות',
    description: 'Master all 5 challenges in Counting the Chanukah Candles.',
    accent: 'amber',
    iconType: 'menorah',
    evaluate: (state) => {
      const { solved, total } = countLessonSolved(state.solvedLog, 'chanukah-candles');
      return { earned: solved >= total, current: solved, target: total };
    },
  },
  {
    id: 'ark-builder',
    title: 'Master Ark Builder',
    hebrewTitle: 'בונה התיבה',
    description: "Master all 5 challenges in Measuring Noah's Ark.",
    accent: 'blue',
    iconType: 'ark',
    evaluate: (state) => {
      const { solved, total } = countLessonSolved(state.solvedLog, 'noahs-ark');
      return { earned: solved >= total, current: solved, target: total };
    },
  },
  {
    id: 'beit-din-judge',
    title: 'Beit Din Fair Judge',
    hebrewTitle: 'דיין צדק',
    description: 'Master all 5 fraction puzzles in Two Holding a Tallit.',
    accent: 'blue',
    iconType: 'tallit',
    evaluate: (state) => {
      const { solved, total } = countLessonSolved(state.solvedLog, 'tallit-fractions');
      return { earned: solved >= total, current: solved, target: total };
    },
  },
  {
    id: 'sukkah-architect',
    title: 'Sukkah Architect',
    hebrewTitle: 'אדריכל הסוכה',
    description: 'Master all 5 geometry puzzles in Circles, Pi & the Round Sukkah.',
    accent: 'emerald',
    iconType: 'sukkah',
    evaluate: (state) => {
      const { solved, total } = countLessonSolved(state.solvedLog, 'sukkah-geometry');
      return { earned: solved >= total, current: solved, target: total };
    },
  },
  {
    id: 'kitchen-ratio-pro',
    title: '1-to-60 Chef',
    hebrewTitle: 'בטל בשישים',
    description: 'Master all 5 ratio challenges in The 1-to-60 Soup Pot.',
    accent: 'amber',
    iconType: 'soup',
    evaluate: (state) => {
      const { solved, total } = countLessonSolved(state.solvedLog, 'batel-bshishim');
      return { earned: solved >= total, current: solved, target: total };
    },
  },
  {
    id: 'gematria-decoder',
    title: 'Gematria Decoder',
    hebrewTitle: 'מפענח גימטריא',
    description: 'Master all 5 place-value puzzles in Gematria Workshop.',
    accent: 'blue',
    iconType: 'gematria',
    evaluate: (state) => {
      const { solved, total } = countLessonSolved(state.solvedLog, 'gematria-workshop');
      return { earned: solved >= total, current: solved, target: total };
    },
  },
  {
    id: 'shulchan-aruch-scholar',
    title: 'Halachic Math Scholar',
    hebrewTitle: 'תלמיד שו״ע',
    description: 'Solve at least 5 challenges across Shulchan Aruch lessons.',
    accent: 'emerald',
    iconType: 'shulchan',
    evaluate: (state) => {
      const saLessons = LESSONS.filter((l) => l.track === 'shulchan-aruch');
      const solved = saLessons.reduce(
        (sum, l) => sum + l.challenges.filter((c) => Boolean(state.solvedLog[c.id])).length,
        0
      );
      return { earned: solved >= 5, current: Math.min(solved, 5), target: 5 };
    },
  },
  {
    id: 'arcade-champ',
    title: 'Arcade Champion',
    hebrewTitle: 'אלוף המשחקים',
    description: 'Win 3 rounds in the Torah & Shulchan Aruch Math Games Arcade.',
    accent: 'amber',
    iconType: 'arcade',
    evaluate: (state) => {
      const wins = countTotalGameWins(state);
      return { earned: wins >= 3, current: Math.min(wins, 3), target: 3 };
    },
  },
  {
    id: 'offline-scholar',
    title: 'Paper & Pencil Pro',
    hebrewTitle: 'לומד בדף ועט',
    description: 'Download your first printable offline PDF math worksheet.',
    accent: 'emerald',
    iconType: 'worksheet',
    evaluate: (state) => ({
      earned: state.worksheetsDownloaded >= 1,
      current: Math.min(state.worksheetsDownloaded, 1),
      target: 1,
    }),
  },
  {
    id: 'cheshbon-master',
    title: 'Grand Cheshbon Master',
    hebrewTitle: 'גאון החשבון',
    description: 'Solve 25 math challenges across the full curriculum.',
    accent: 'blue',
    iconType: 'crown',
    evaluate: (state) => {
      const count = countTotalSolvedChallenges(state.solvedLog);
      return { earned: count >= 25, current: Math.min(count, 25), target: 25 };
    },
  },
];

export function getBadgeById(id: string): BadgeDefinition | undefined {
  return REWARD_BADGES.find((b) => b.id === id);
}
