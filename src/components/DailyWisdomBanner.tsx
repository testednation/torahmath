import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  WifiOff,
} from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export interface DailyWisdom {
  date: string;
  title: string;
  hebrewPhrase: string;
  fact: string;
  source: string;
  mathConcept: string;
  quickQuestion: string;
  quickAnswer: string;
}

const CACHE_KEY = 'cheshbon_daily_wisdom_v1';

const OFFLINE_WISDOM_BANK: Omit<DailyWisdom, 'date'>[] = [
  {
    title: 'Counting the Omer Is a 7 × 7 Square!',
    hebrewPhrase: 'ספירת העומר',
    fact: 'Between Passover and Shavuot, the Torah (Vayikra 23:15) tells us to count 7 full weeks of 7 days each—making 49 days, a perfect 7 × 7 square—before celebrating Shavuot on Day 50!',
    source: 'Vayikra 23:15',
    mathConcept: 'Multiplication & Square Numbers',
    quickQuestion: 'If you have counted 4 full weeks of the Omer, how many days have you counted?',
    quickAnswer: '4 × 7 = 28 days (with 21 days left to reach 49)!',
  },
  {
    title: 'A 10-Handbreadth Circle in the Talmud',
    hebrewPhrase: 'כל שיש בהיקפו שלשה טפחים',
    fact: 'In Eruvin 14a, the Sages share a quick mental geometry shortcut: any circle that is 3 handbreadths around is roughly 1 handbreadth across, letting kids estimate circles fast!',
    source: 'Eruvin 14a',
    mathConcept: 'Circles & Estimation (π ≈ 3)',
    quickQuestion: 'Using the Sages’ quick 3× rule, about how far around is a round table 4 feet wide?',
    quickAnswer: '3 × 4 = 12 feet around (exact π × 4 is about 12.57 feet)!',
  },
  {
    title: 'One + Love = 26 in Gematria',
    hebrewPhrase: 'אחד + אהבה = כ״ו',
    fact: 'In Hebrew Gematria, the word for One (אחד: 1+8+4) equals 13, and the word for Love (אהבה: 1+5+2+5) ALSO equals 13. Together, 13 + 13 = 26!',
    source: 'Hebrew Gematria',
    mathConcept: 'Place Value & Equal Sums',
    quickQuestion: 'What is the Gematria of חי (Chai, Life), spelled ח (8) + י (10)?',
    quickAnswer: '8 + 10 = 18!',
  },
  {
    title: 'Twelve Equal Daylight Hours Every Season',
    hebrewPhrase: 'שעות זמניות',
    fact: 'In Shulchan Aruch Orach Chaim 58:1, every day’s sunlight from sunrise to sunset is divided into 12 equal Halachic Hours—50 minutes on a 10-hour winter day, and 70 minutes on a 14-hour summer day!',
    source: 'Orach Chaim 58:1',
    mathConcept: 'Division by 12 & Time',
    quickQuestion: 'On a 12-hour spring day (720 minutes), how many minutes long is 1 Halachic Hour?',
    quickAnswer: '720 ÷ 12 = 60 minutes (an exact clock hour)!',
  },
  {
    title: 'Splitting a Tallit in Beit Din',
    hebrewPhrase: 'שנים אוחזין בטלית',
    fact: 'In Bava Metzia 2a, if Reuven claims ALL of a tallit and Shimon claims HALF, Shimon agrees Reuven owns the other half—so they only split the disputed half, giving Reuven 3/4 and Shimon 1/4!',
    source: 'Bava Metzia 2a',
    mathConcept: 'Fractions & Fair Division',
    quickQuestion: 'If the tallit is worth 40 silver zuz, how much is Shimon’s 1/4 share?',
    quickAnswer: '40 ÷ 4 = 10 zuz (and Reuven gets 30 zuz)!',
  },
  {
    title: 'The Drop-the-Zero Maaser Shortcut',
    hebrewPhrase: 'מעשר כספים',
    fact: 'Shulchan Aruch Yoreh Deah 249:1 teaches giving 10% (Maaser) of earnings to Tzedakah. Dividing by 10 is easy—just drop one trailing zero, and double it for 20% Chomesh!',
    source: 'Yoreh Deah 249:1',
    mathConcept: 'Percentages (10% & 20%)',
    quickQuestion: 'If you earn $90, how much is 10% Maaser and how much is 20% Chomesh?',
    quickAnswer: '10% Maaser is $9, and 20% Chomesh is $18!',
  },
  {
    title: 'Pairing Chanukah Candles to Count Fast',
    hebrewPhrase: 'נרות חנוכה',
    fact: 'Over 8 nights of Chanukah you light 1+2+3+4+5+6+7+8 candles. Pair Night 1 with Night 8 (9), Night 2 with Night 7 (9), Night 3 with Night 6 (9), and Night 4 with Night 5 (9) = 4 × 9 = 36 candles!',
    source: 'Shabbat 21b',
    mathConcept: 'Addition Patterns & Pairing',
    quickQuestion: 'Add 8 Shamash candles to the 36 night candles—how many come in a box?',
    quickAnswer: '36 + 8 = 44 candles in every Chanukah box!',
  },
];

function getLocalDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatReadableDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  if (!y || !m || !d) return dateKey;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

function readCachedWisdom(todayKey: string, allowStale = false): DailyWisdom | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailyWisdom;
    if (
      parsed &&
      parsed.title &&
      parsed.fact &&
      (allowStale || parsed.date === todayKey)
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveCachedWisdom(wisdom: DailyWisdom) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(wisdom));
  } catch {
    // Ignore storage quota errors
  }
}

function getOfflineWisdomForIndex(idx: number, todayKey: string): DailyWisdom {
  const item =
    OFFLINE_WISDOM_BANK[
      ((idx % OFFLINE_WISDOM_BANK.length) + OFFLINE_WISDOM_BANK.length) %
        OFFLINE_WISDOM_BANK.length
    ];
  return { ...item, date: todayKey };
}

export function DailyWisdomBanner() {
  const isOnline = useOnlineStatus();
  const todayKey = getLocalDateKey();
  const [offlineIdx, setOfflineIdx] = useState<number>(() => new Date().getDay());
  const [isOfflineSource, setIsOfflineSource] = useState<boolean>(false);

  const [wisdom, setWisdom] = useState<DailyWisdom | null>(() => {
    const exact = readCachedWisdom(todayKey, false);
    if (exact) return exact;
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return (
        readCachedWisdom(todayKey, true) ??
        getOfflineWisdomForIndex(new Date().getDay(), todayKey)
      );
    }
    return null;
  });
  const [seenTitles, setSeenTitles] = useState<string[]>(() => {
    const cached = readCachedWisdom(todayKey, false);
    return cached ? [cached.title] : [];
  });
  const [loading, setLoading] = useState<boolean>(() => {
    if (readCachedWisdom(todayKey, false)) return false;
    if (typeof navigator !== 'undefined' && !navigator.onLine) return false;
    return true;
  });
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const loadOfflineFact = useCallback(
    (advance: boolean) => {
      setError(null);
      setShowAnswer(false);
      setIsOfflineSource(true);
      setOfflineIdx((prev) => {
        const next = advance ? (prev + 1) % OFFLINE_WISDOM_BANK.length : prev;
        setWisdom(getOfflineWisdomForIndex(next, todayKey));
        return next;
      });
      setLoading(false);
    },
    [todayKey]
  );

  const fetchWisdom = useCallback(
    async (refresh: boolean, excludeList: string[]) => {
      if (!navigator.onLine) {
        loadOfflineFact(refresh);
        return;
      }

      setLoading(true);
      setError(null);
      setShowAnswer(false);

      try {
        const params = new URLSearchParams({ date: todayKey });
        if (refresh) {
          params.set('refresh', 'true');
          if (excludeList.length > 0) {
            params.set('exclude', excludeList.slice(-5).join('|'));
          }
        }

        const res = await fetch(`/api/daily-wisdom?${params.toString()}`);
        const data = (await res.json()) as DailyWisdom & { error?: string };

        if (!res.ok) {
          throw new Error(
            data.error || 'Unable to load today’s Torah math wisdom.'
          );
        }

        setWisdom(data);
        setIsOfflineSource(false);
        setSeenTitles((prev) =>
          prev.includes(data.title) ? prev : [...prev, data.title]
        );
        saveCachedWisdom(data);
      } catch (err) {
        if (!navigator.onLine) {
          loadOfflineFact(refresh);
          return;
        }
        // If a network fetch fails (e.g. offline cache miss), fall back gracefully to local library
        const stale = readCachedWisdom(todayKey, true);
        if (stale && !refresh) {
          setWisdom(stale);
          setIsOfflineSource(true);
        } else if (err instanceof TypeError) {
          loadOfflineFact(refresh);
        } else {
          setError(
            err instanceof Error
              ? err.message
              : 'Unable to load today’s Torah math wisdom.'
          );
        }
      } finally {
        setLoading(false);
      }
    },
    [todayKey, loadOfflineFact]
  );

  useEffect(() => {
    if (!wisdom) {
      void fetchWisdom(false, []);
    }
  }, [wisdom, fetchWisdom]);

  const readableDate = formatReadableDate(todayKey);

  return (
    <section
      aria-labelledby="daily-wisdom-heading"
      className="bg-white border border-slate-200 rounded-xl p-5 lg:p-6"
    >
      {/* Top unboxed metadata row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <BookOpen
            className="w-3.5 h-3.5 text-blue-700 shrink-0"
            aria-hidden="true"
          />
          <span className="font-semibold text-blue-800">
            Daily Torah Math Wisdom
          </span>
          <span aria-hidden="true">·</span>
          <span>{readableDate}</span>
          {(!isOnline || isOfflineSource) && (
            <>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1 font-medium text-amber-800">
                <WifiOff className="w-3 h-3" aria-hidden="true" />
                <span>Offline Library</span>
              </span>
            </>
          )}
          {wisdom && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-medium text-slate-700">{wisdom.source}</span>
              <span aria-hidden="true">·</span>
              <span>{wisdom.mathConcept}</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => void fetchWisdom(true, seenTitles)}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`}
            aria-hidden="true"
          />
          <span>
            {loading
              ? 'Loading...'
              : !isOnline
              ? `Next Fact (${offlineIdx + 1}/${OFFLINE_WISDOM_BANK.length})`
              : 'New Fact'}
          </span>
        </button>
      </div>

      {/* Loading skeleton */}
      {loading && !wisdom && (
        <div className="pt-4 space-y-3" aria-busy="true" aria-live="polite">
          <div className="h-5 w-64 bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-full max-w-3xl bg-slate-100 rounded animate-pulse" />
          <div className="h-4 w-2/3 max-w-2xl bg-slate-100 rounded animate-pulse" />
        </div>
      )}

      {/* Error state (only shown if online server returns an API error) */}
      {error && !loading && (
        <div
          role="alert"
          className="mt-4 p-4 rounded-lg bg-rose-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-rose-950"
        >
          <div className="flex items-start gap-2.5">
            <AlertCircle
              className="w-4 h-4 text-rose-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => loadOfflineFact(false)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 transition-colors whitespace-nowrap cursor-pointer"
            >
              Use Offline Fact
            </button>
            <button
              type="button"
              onClick={() => void fetchWisdom(true, seenTitles)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 transition-colors whitespace-nowrap cursor-pointer"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loaded Daily Wisdom Content */}
      {wisdom && !error && (
        <div
          className={`pt-4 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start transition-opacity ${
            loading ? 'opacity-60' : 'opacity-100'
          }`}
        >
          <div className="lg:col-span-8 space-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2
                id="daily-wisdom-heading"
                className="text-lg lg:text-xl font-bold text-slate-900"
              >
                {wisdom.title}
              </h2>
              {wisdom.hebrewPhrase && (
                <span
                  dir="rtl"
                  className="text-base font-semibold text-blue-800"
                >
                  {wisdom.hebrewPhrase}
                </span>
              )}
            </div>
            <p className="text-sm lg:text-base text-slate-600 leading-relaxed max-w-3xl">
              {wisdom.fact}
            </p>
          </div>

          {/* Interactive Quick-Think Prompt from Today's Fact */}
          {wisdom.quickQuestion && (
            <div className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2.5">
              <p className="text-xs font-semibold text-slate-700">
                Quick Mental Math
              </p>
              <p className="text-sm text-slate-800 leading-snug">
                {wisdom.quickQuestion}
              </p>
              <button
                type="button"
                onClick={() => setShowAnswer((v) => !v)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>{showAnswer ? 'Hide Answer' : 'Show Answer'}</span>
                {showAnswer ? (
                  <ChevronUp className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" aria-hidden="true" />
                )}
              </button>
              {showAnswer && wisdom.quickAnswer && (
                <p className="pt-2 border-t border-slate-200 text-xs font-mono text-emerald-800 leading-relaxed tabular-nums">
                  {wisdom.quickAnswer}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
