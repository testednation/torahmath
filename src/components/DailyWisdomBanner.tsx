import { useState, useEffect, useCallback } from 'react';
import {
  BookOpen,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';

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

function readCachedWisdom(todayKey: string): DailyWisdom | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailyWisdom;
    if (parsed && parsed.date === todayKey && parsed.title && parsed.fact) {
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

export function DailyWisdomBanner() {
  const todayKey = getLocalDateKey();
  const [wisdom, setWisdom] = useState<DailyWisdom | null>(() =>
    readCachedWisdom(todayKey)
  );
  const [seenTitles, setSeenTitles] = useState<string[]>(() => {
    const cached = readCachedWisdom(todayKey);
    return cached ? [cached.title] : [];
  });
  const [loading, setLoading] = useState<boolean>(() => !readCachedWisdom(todayKey));
  const [error, setError] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const fetchWisdom = useCallback(
    async (refresh: boolean, excludeList: string[]) => {
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
        setSeenTitles((prev) =>
          prev.includes(data.title) ? prev : [...prev, data.title]
        );
        saveCachedWisdom(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load today’s Torah math wisdom.'
        );
      } finally {
        setLoading(false);
      }
    },
    [todayKey]
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
          <span>{loading ? 'Loading...' : 'New Fact'}</span>
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

      {/* Error state (never silently masked) */}
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
          <button
            type="button"
            onClick={() => void fetchWisdom(true, seenTitles)}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
          >
            Try Again
          </button>
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
