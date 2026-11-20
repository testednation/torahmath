import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  RefreshCw,
  ChevronDown,
  ChevronUp,
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

const BUILTIN_WISDOM_BANK: Omit<DailyWisdom, 'date'>[] = [
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
  {
    title: 'Noah’s Ark: A Giant 6-to-1 Ship Ratio',
    hebrewPhrase: 'תיבת נח',
    fact: 'Bereishit 6:15 gives Noah’s Ark exact blueprints: 300 amot long by 50 amot wide by 30 amot tall. Its 6-to-1 length-to-width ratio matches modern cargo ships designed to stay steady in waves!',
    source: 'Bereishit 6:15',
    mathConcept: 'Ratios & 3D Volume',
    quickQuestion: 'What is the floor area of ONE deck of the Ark (300 amot × 50 amot)?',
    quickAnswer: '300 × 50 = 15,000 square amot (and 45,000 across all 3 decks)!',
  },
  {
    title: 'The 18-Minute Shabbat Candle Countdown',
    hebrewPhrase: 'הדלקת נרות',
    fact: 'Following Shulchan Aruch Orach Chaim 263:4, many communities light Shabbat candles 18 minutes before sunset—and 18 is the exact Gematria of חי (Chai, Life)!',
    source: 'Orach Chaim 263:4',
    mathConcept: 'Time Subtraction',
    quickQuestion: 'If sunset is at 6:00 PM, what time is 18 minutes earlier?',
    quickAnswer: '6:00 PM − 18 minutes = 5:42 PM!',
  },
  {
    title: 'Measuring the Top Third for a Mezuzah',
    hebrewPhrase: 'קביעת מזוזה',
    fact: 'In Yoreh Deah 289:2, the Shulchan Aruch instructs hanging a Mezuzah at the start of the top third (2/3 up the doorway) while staying at least 1 handbreadth below the top lintel.',
    source: 'Yoreh Deah 289:2',
    mathConcept: 'Fractions (Thirds) & Measurement',
    quickQuestion: 'On a 90-inch doorway, how many inches tall is each one-third section?',
    quickAnswer: '90 ÷ 3 = 30 inches per third, so the top third begins at 60 inches!',
  },
  {
    title: 'The 1-to-60 Kosher Kitchen Ratio',
    hebrewPhrase: 'בטל בשישים',
    fact: 'In Chullin 98a, the Sages teach Batel B’Shishim: if 1 accidental drop falls into a pot with at least 60 times as much kosher soup, the ratio is 60:1 and the flavor disappears!',
    source: 'Chullin 98a',
    mathConcept: 'Ratios & Multiplying by 60',
    quickQuestion: 'If 2 spoons drip into a pot, how many spoons of kosher soup are needed for 60:1?',
    quickAnswer: '2 × 60 = 120 spoons of kosher soup!',
  },
  {
    title: 'The Square Diagonal Shortcut in Sukkah 8a',
    hebrewPhrase: 'אלכסון הריבוע',
    fact: 'In Sukkah 8a, the Gemara gives a clever rule for any square: its diagonal is about 1 and 2/5 (1.4) times its side length—remarkably close to √2 ≈ 1.414!',
    source: 'Sukkah 8a',
    mathConcept: 'Geometry & Square Diagonals',
    quickQuestion: 'Using the Sages’ 1.4 rule, about how long is the diagonal of a 10 × 10 square?',
    quickAnswer: '10 × 1.4 = 14 units!',
  },
  {
    title: 'Shabbat Walking Boundary: 2,000 Amot',
    hebrewPhrase: 'תחום שבת',
    fact: 'In Eruvin 51a, the Sages measure the Techum Shabbat—how far you may walk outside a town on Shabbat—as 2,000 amot in every direction, forming a big boundary around the city.',
    source: 'Eruvin 51a',
    mathConcept: 'Perimeter & Large Numbers',
    quickQuestion: 'If you can walk 2,000 amot East and 2,000 amot West from town, how wide is that span?',
    quickAnswer: '2,000 + 2,000 = 4,000 amot across!',
  },
  {
    title: 'Twelve Tribes and Four Camps in the Desert',
    hebrewPhrase: 'שנים עשר שבטים',
    fact: 'In Bamidbar 2, the 12 Tribes of Israel camped symmetrically around the Mishkan in 4 equal groups—North, South, East, and West—showing neat division and symmetry!',
    source: 'Bamidbar 2:2',
    mathConcept: 'Division & Symmetry',
    quickQuestion: 'If 12 Tribes are split evenly into 4 directional camps, how many Tribes are in each camp?',
    quickAnswer: '12 ÷ 4 = 3 Tribes on each side of the Mishkan!',
  },
];

function getLocalDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getDayOfYearIndex(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return dayOfYear % BUILTIN_WISDOM_BANK.length;
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

function getBuiltinWisdomForIndex(idx: number, todayKey: string): DailyWisdom {
  const item =
    BUILTIN_WISDOM_BANK[
      ((idx % BUILTIN_WISDOM_BANK.length) + BUILTIN_WISDOM_BANK.length) %
        BUILTIN_WISDOM_BANK.length
    ];
  return { ...item, date: todayKey };
}

export function DailyWisdomBanner() {
  const isOnline = useOnlineStatus();
  const todayKey = getLocalDateKey();
  const [builtinIdx, setBuiltinIdx] = useState<number>(() => getDayOfYearIndex());
  const [sourceMode, setSourceMode] = useState<'live' | 'library'>(() =>
    typeof navigator !== 'undefined' && !navigator.onLine ? 'library' : 'live'
  );

  const [wisdom, setWisdom] = useState<DailyWisdom | null>(() => {
    const exact = readCachedWisdom(todayKey, false);
    if (exact) return exact;
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return (
        readCachedWisdom(todayKey, true) ??
        getBuiltinWisdomForIndex(getDayOfYearIndex(), todayKey)
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
  const [showAnswer, setShowAnswer] = useState(false);

  const loadBuiltinFact = useCallback(
    (advance: boolean) => {
      setShowAnswer(false);
      setSourceMode('library');
      setBuiltinIdx((prev) => {
        const next = advance ? (prev + 1) % BUILTIN_WISDOM_BANK.length : prev;
        setWisdom(getBuiltinWisdomForIndex(next, todayKey));
        return next;
      });
      setLoading(false);
    },
    [todayKey]
  );

  const fetchWisdom = useCallback(
    async (refresh: boolean, excludeList: string[]) => {
      // If offline or already using built-in library (e.g. static deployment without /api route), cycle locally
      if (!navigator.onLine || (refresh && sourceMode === 'library')) {
        loadBuiltinFact(refresh);
        return;
      }

      setLoading(true);
      setShowAnswer(false);

      try {
        const params = new URLSearchParams({ date: todayKey });
        if (refresh) {
          params.set('refresh', 'true');
          if (excludeList.length > 0) {
            params.set('exclude', excludeList.slice(-5).join('|'));
          }
        }

        const res = await fetch(`/api/daily-wisdom?${params.toString()}`, {
          headers: { Accept: 'application/json' },
        });

        const contentType = res.headers.get('content-type') ?? '';
        const rawText = await res.text();

        // Guard against static-host 404 plain text ("The page could not be found") or HTML SPA fallbacks
        if (!contentType.includes('application/json') || !rawText.trim().startsWith('{')) {
          loadBuiltinFact(refresh);
          return;
        }

        let data: (DailyWisdom & { error?: string }) | null = null;
        try {
          data = JSON.parse(rawText) as DailyWisdom & { error?: string };
        } catch {
          loadBuiltinFact(refresh);
          return;
        }

        if (!res.ok || !data || !data.title || !data.fact) {
          // Fall back gracefully to cached or built-in Sage Wisdom library
          const stale = !refresh ? readCachedWisdom(todayKey, true) : null;
          if (stale) {
            setWisdom(stale);
            setSourceMode('library');
          } else {
            loadBuiltinFact(refresh);
          }
          return;
        }

        setWisdom(data);
        setSourceMode('live');
        setSeenTitles((prev) =>
          prev.includes(data.title) ? prev : [...prev, data.title]
        );
        saveCachedWisdom(data);
      } catch {
        const stale = !refresh ? readCachedWisdom(todayKey, true) : null;
        if (stale) {
          setWisdom(stale);
          setSourceMode('library');
        } else {
          loadBuiltinFact(refresh);
        }
      } finally {
        setLoading(false);
      }
    },
    [todayKey, sourceMode, loadBuiltinFact]
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
          {!isOnline && (
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
              : sourceMode === 'library'
              ? `Next Fact (${builtinIdx + 1}/${BUILTIN_WISDOM_BANK.length})`
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

      {/* Loaded Daily Wisdom Content */}
      {wisdom && (
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
