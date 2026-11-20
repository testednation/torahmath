import type { LessonId } from '../data/lessons';
import type { GameStats } from '../components/MathGamesHub';

export type AppView = 'explore' | 'beginner' | 'games' | 'lesson' | 'practice';

export interface SavedProgressState {
  studentName: string;
  solvedLog: Record<string, string>;
  beginnerDone: boolean;
  beginnerStep: number;
  gameStats: Record<string, GameStats>;
  unlockedBadges: Record<string, string>;
  worksheetsDownloaded: number;
  streakDays: number;
  lastStudyDate: string | null;
  lastView: AppView;
  lastLessonId: LessonId;
  lastSavedAt: string | null;
}

const PROGRESS_BUNDLE_KEY = 'cheshbon_progress_v2';
const LEGACY_SOLVED_KEY = 'cheshbon_solved_questions_v1';
const LEGACY_SOLVED_LOG_KEY = 'cheshbon_solved_log_v1';
const LEGACY_BEGINNER_KEY = 'cheshbon_beginner_done_v1';
const LEGACY_GAME_STATS_KEY = 'cheshbon_game_stats_v1';

export function getLocalDayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function computeNextStreak(
  prevStreak: number,
  lastStudyDate: string | null
): { streakDays: number; lastStudyDate: string } {
  const today = getLocalDayKey();
  if (lastStudyDate === today) {
    return { streakDays: Math.max(1, prevStreak), lastStudyDate: today };
  }
  if (lastStudyDate) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (lastStudyDate === getLocalDayKey(yesterday)) {
      return { streakDays: prevStreak + 1, lastStudyDate: today };
    }
  }
  return { streakDays: 1, lastStudyDate: today };
}

export const DEFAULT_PROGRESS: SavedProgressState = {
  studentName: '',
  solvedLog: {},
  beginnerDone: false,
  beginnerStep: 0,
  gameStats: {},
  unlockedBadges: {},
  worksheetsDownloaded: 0,
  streakDays: 0,
  lastStudyDate: null,
  lastView: 'explore',
  lastLessonId: 'chanukah-candles',
  lastSavedAt: null,
};

function sanitizeStringRecord(raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const clean: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof k === 'string' && typeof v === 'string') {
      clean[k] = v;
    }
  }
  return clean;
}

export function loadLocalProgress(): SavedProgressState {
  try {
    const rawBundle = window.localStorage.getItem(PROGRESS_BUNDLE_KEY);
    if (rawBundle) {
      const parsed = JSON.parse(rawBundle) as Partial<SavedProgressState>;
      return {
        ...DEFAULT_PROGRESS,
        studentName:
          typeof parsed.studentName === 'string' ? parsed.studentName : '',
        solvedLog: sanitizeStringRecord(parsed.solvedLog),
        beginnerDone: Boolean(parsed.beginnerDone),
        beginnerStep:
          typeof parsed.beginnerStep === 'number' &&
          parsed.beginnerStep >= 0 &&
          parsed.beginnerStep <= 5
            ? parsed.beginnerStep
            : 0,
        gameStats:
          parsed.gameStats && typeof parsed.gameStats === 'object'
            ? (parsed.gameStats as Record<string, GameStats>)
            : {},
        unlockedBadges: sanitizeStringRecord(parsed.unlockedBadges),
        worksheetsDownloaded:
          typeof parsed.worksheetsDownloaded === 'number'
            ? parsed.worksheetsDownloaded
            : 0,
        streakDays:
          typeof parsed.streakDays === 'number' ? parsed.streakDays : 0,
        lastStudyDate:
          typeof parsed.lastStudyDate === 'string'
            ? parsed.lastStudyDate
            : null,
        lastView:
          parsed.lastView &&
          ['explore', 'beginner', 'games', 'lesson', 'practice'].includes(
            parsed.lastView
          )
            ? parsed.lastView
            : 'explore',
        lastLessonId:
          typeof parsed.lastLessonId === 'string'
            ? (parsed.lastLessonId as LessonId)
            : 'chanukah-candles',
        lastSavedAt:
          typeof parsed.lastSavedAt === 'string' ? parsed.lastSavedAt : null,
      };
    }

    // Seamless migration from v1 individual keys
    let solvedLog: Record<string, string> = {};
    const rawLog = window.localStorage.getItem(LEGACY_SOLVED_LOG_KEY);
    if (rawLog) {
      solvedLog = sanitizeStringRecord(JSON.parse(rawLog));
    } else {
      const rawLegacyIds = window.localStorage.getItem(LEGACY_SOLVED_KEY);
      if (rawLegacyIds) {
        const arr = JSON.parse(rawLegacyIds);
        if (Array.isArray(arr)) {
          const now = new Date().toISOString();
          for (const id of arr) {
            if (typeof id === 'string') solvedLog[id] = now;
          }
        }
      }
    }

    const beginnerDone =
      window.localStorage.getItem(LEGACY_BEGINNER_KEY) === 'true';

    let gameStats: Record<string, GameStats> = {};
    const rawGames = window.localStorage.getItem(LEGACY_GAME_STATS_KEY);
    if (rawGames) {
      const parsedGames = JSON.parse(rawGames);
      if (parsedGames && typeof parsedGames === 'object') {
        gameStats = parsedGames as Record<string, GameStats>;
      }
    }

    return {
      ...DEFAULT_PROGRESS,
      solvedLog,
      beginnerDone,
      gameStats,
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveLocalProgress(state: SavedProgressState): void {
  try {
    const payload: SavedProgressState = {
      ...state,
      lastSavedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(PROGRESS_BUNDLE_KEY, JSON.stringify(payload));
    // Also keep legacy keys synced so nothing breaks across tabs
    window.localStorage.setItem(
      LEGACY_SOLVED_LOG_KEY,
      JSON.stringify(state.solvedLog)
    );
    window.localStorage.setItem(
      LEGACY_SOLVED_KEY,
      JSON.stringify(
        Object.keys(state.solvedLog).filter((k) => !k.startsWith('game:'))
      )
    );
    window.localStorage.setItem(
      LEGACY_BEGINNER_KEY,
      state.beginnerDone ? 'true' : 'false'
    );
    window.localStorage.setItem(
      LEGACY_GAME_STATS_KEY,
      JSON.stringify(state.gameStats)
    );
  } catch {
    // Ignore quota errors in restricted sandboxes
  }
}

export function clearLocalProgress(): void {
  try {
    window.localStorage.removeItem(PROGRESS_BUNDLE_KEY);
    window.localStorage.removeItem(LEGACY_SOLVED_LOG_KEY);
    window.localStorage.removeItem(LEGACY_SOLVED_KEY);
    window.localStorage.removeItem(LEGACY_BEGINNER_KEY);
    window.localStorage.removeItem(LEGACY_GAME_STATS_KEY);
  } catch {
    // Ignore storage errors
  }
}
