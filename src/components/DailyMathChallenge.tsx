import { useState, useEffect, useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  BookOpen,
  Calendar,
} from 'lucide-react';
import {
  formatTrackLabel,
  type LessonId,
  type TrackType,
} from '../data/lessons';
import {
  generateDailyMathChallenge,
  getLocalDateKey,
  getTimeRemainingInDay,
} from '../utils/dailyChallenge';
import { BadgeMedalArt } from './BadgesShowcase';
import {
  playTap,
  playSuccess,
  playTryAgain,
  playFanfare,
} from '../utils/soundFx';

interface DailyMathChallengeProps {
  dailyChallengesSolved: Record<string, string>;
  onSolveDaily: (dateKey: string, track: TrackType) => void;
  onOpenLesson: (lessonId: LessonId) => void;
}

export function DailyMathChallenge({
  dailyChallengesSolved,
  onSolveDaily,
  onOpenLesson,
}: DailyMathChallengeProps) {
  const [dateKey, setDateKey] = useState<string>(() => getLocalDateKey());
  const [countdown, setCountdown] = useState(() => getTimeRemainingInDay());
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Live 1-second 24-hour countdown timer & automatic midnight rollover
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = new Date();
      const nextDateKey = getLocalDateKey(now);
      setCountdown(getTimeRemainingInDay(now));
      setDateKey((prev) => {
        if (prev !== nextDateKey) {
          setSelectedIdx(null);
          setSubmitted(false);
          setShowHint(false);
          return nextDateKey;
        }
        return prev;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const challenge = useMemo(
    () => generateDailyMathChallenge(dateKey),
    [dateKey]
  );

  const solvedTodayAt = dailyChallengesSolved[dateKey] ?? null;
  const isSolvedToday = Boolean(solvedTodayAt);
  const totalDailySolved = Object.keys(dailyChallengesSolved).length;
  const isCorrect =
    isSolvedToday || (submitted && selectedIdx === challenge.correctIndex);

  function handleSelectOption(idx: number) {
    if (isCorrect) return;
    playTap();
    setSelectedIdx(idx);
    if (submitted) {
      setSubmitted(false);
    }
  }

  function handleCheck() {
    if (selectedIdx === null || isSolvedToday) return;
    setSubmitted(true);
    if (selectedIdx === challenge.correctIndex) {
      if (totalDailySolved === 0) {
        playFanfare();
      } else {
        playSuccess();
      }
      onSolveDaily(dateKey, challenge.track);
    } else {
      playTryAgain();
    }
  }

  const formattedSolvedTime = solvedTodayAt
    ? new Date(solvedTodayAt).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  return (
    <section
      id="daily-challenge"
      aria-labelledby="daily-challenge-heading"
      className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 scroll-mt-24"
    >
      {/* Top Unboxed Metadata Bar + Live 24h Timer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <Calendar
            className="w-3.5 h-3.5 text-amber-700 shrink-0"
            aria-hidden="true"
          />
          <span className="font-semibold text-amber-800">
            Daily Math Challenge #{challenge.challengeNumber}
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-medium text-slate-700">
            {formatTrackLabel(challenge.track)}
          </span>
          <span aria-hidden="true">·</span>
          <span>{challenge.sourceRef}</span>
          <span aria-hidden="true">·</span>
          <span>{challenge.topic}</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-semibold tabular-nums text-slate-700 shrink-0">
          <Clock
            className="w-3.5 h-3.5 text-blue-700 shrink-0"
            aria-hidden="true"
          />
          <span>
            {isSolvedToday
              ? `Next challenge in ${countdown.formatted}`
              : `${countdown.formatted} left today`}
          </span>
        </div>
      </div>

      {/* Two-Column Interactive Workspace + 24h Bonus Badge Card */}
      <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 8 Columns: Today's Unique Problem */}
        <div className="lg:col-span-8 space-y-5">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
              <h2
                id="daily-challenge-heading"
                className="text-2xl lg:text-3xl font-bold text-slate-900"
              >
                {challenge.title}
              </h2>
              <span
                dir="rtl"
                className="text-lg font-semibold text-blue-800"
              >
                {challenge.hebrewTitle}
              </span>
            </div>
            <p className="text-base lg:text-lg font-medium text-slate-800 leading-relaxed">
              {challenge.question}
            </p>
          </div>

          {/* 4 Large Touch-Friendly Answer Choices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {challenge.options.map((option, idx) => {
              const isSelected = selectedIdx === idx;
              const showRight =
                (isSolvedToday && idx === challenge.correctIndex) ||
                (submitted && idx === challenge.correctIndex && isCorrect);
              const showWrong =
                !isSolvedToday &&
                submitted &&
                isSelected &&
                idx !== challenge.correctIndex;

              let btnStyle =
                'border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50/40';
              let letterStyle = 'bg-slate-100 text-slate-600';

              if (showRight) {
                btnStyle =
                  'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold';
                letterStyle = 'bg-emerald-600 text-white';
              } else if (showWrong) {
                btnStyle =
                  'border-rose-600 bg-rose-50 text-rose-950 font-semibold';
                letterStyle = 'bg-rose-600 text-white';
              } else if (isSelected) {
                btnStyle =
                  'border-blue-700 bg-blue-50 text-blue-950 font-semibold';
                letterStyle = 'bg-blue-700 text-white';
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={isSolvedToday}
                  onClick={() => handleSelectOption(idx)}
                  className={`min-h-[56px] text-left px-4 py-3.5 rounded-xl border-2 text-base transition-all flex items-center justify-between gap-3 ${
                    isSolvedToday ? 'cursor-default' : 'cursor-pointer'
                  } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${btnStyle}`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 tabular-nums transition-colors ${letterStyle}`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </span>
                  {showRight && (
                    <CheckCircle2
                      className="w-5 h-5 text-emerald-700 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  {showWrong && (
                    <XCircle
                      className="w-5 h-5 text-rose-700 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Action Row */}
          {!isSolvedToday && (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCheck}
                disabled={selectedIdx === null}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Check Daily Answer
              </button>

              {submitted && !isCorrect && (
                <button
                  type="button"
                  onClick={() => {
                    playTap();
                    setSelectedIdx(null);
                    setSubmitted(false);
                  }}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Try Again</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  playTap();
                  setShowHint((h) => !h);
                }}
                className="px-4 py-3 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <HelpCircle
                  className="w-4 h-4 text-amber-600"
                  aria-hidden="true"
                />
                <span>{showHint ? 'Hide Hint' : 'Need a Hint?'}</span>
              </button>
            </div>
          )}

          {/* Hint Box */}
          {showHint && !isCorrect && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-950">
              <span className="font-bold">Friendly Hint: </span>
              {challenge.hint}
            </div>
          )}

          {/* Solved or Wrong Feedback */}
          {(isSolvedToday || submitted) && (
            <div
              role="status"
              className={`p-4 rounded-xl border text-sm flex items-start gap-3 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2
                  className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              ) : (
                <XCircle
                  className="w-5 h-5 text-rose-700 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
              )}
              <div>
                <p className="font-bold mb-0.5">
                  {isCorrect
                    ? `Kol HaKavod! Today’s Daily Challenge solved${
                        formattedSolvedTime ? ` at ${formattedSolvedTime}` : ''
                      }!`
                    : 'Not quite yet — give it another try!'}
                </p>
                <p className="leading-relaxed">
                  {isCorrect
                    ? challenge.explanation
                    : 'Tap “Need a Hint?” or explore the related interactive lesson to test the math visually.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Columns: 24-Hour Bonus Badge Reward Card */}
        <aside className="lg:col-span-4 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
          <div className="flex items-start gap-3.5">
            <BadgeMedalArt
              iconType="daily"
              accent="amber"
              earned={totalDailySolved >= 1}
              size={54}
            />
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                24-Hour Bonus Badge
              </p>
              <h3 className="text-base font-bold text-slate-900 leading-snug">
                24-Hour Daily Champion
              </h3>
              <p dir="rtl" className="text-xs font-semibold text-blue-800">
                אתגר יומי
              </p>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            {isSolvedToday
              ? 'Awesome work! You solved today’s problem within the 24-hour window. Come back tomorrow for a brand-new challenge!'
              : 'Solve today’s unique problem before the 24-hour timer hits zero to earn the extra 24-Hour Daily Champion badge!'}
          </p>

          {/* 24-Hour Window Progress Meter */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-slate-600">
              <span>24h Window</span>
              <span className="font-semibold text-slate-800">
                {countdown.formatted}
              </span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  isSolvedToday ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
                style={{
                  width: `${isSolvedToday ? 100 : 100 - countdown.percentElapsed}%`,
                }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2 text-xs">
            <span className="font-mono font-semibold text-slate-700 tabular-nums">
              {totalDailySolved}{' '}
              {totalDailySolved === 1 ? 'day' : 'days'} conquered
            </span>
            <button
              type="button"
              onClick={() => onOpenLesson(challenge.relatedLessonId)}
              className="font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Related Lesson</span>
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
