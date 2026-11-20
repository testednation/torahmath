import { useState, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Star,
  BookOpen,
} from 'lucide-react';
import {
  ALL_QUIZ_QUESTIONS,
  ASSET_IMAGES,
  LESSONS,
  formatTrackLabel,
  type LessonId,
  type TrackType,
} from '../data/lessons';
import { ResilientImage } from './ResilientImage';

interface PracticeArenaProps {
  solvedIds: string[];
  onSolveQuestion: (questionId: string) => void;
  onOpenLesson: (lessonId: LessonId) => void;
}

export function PracticeArena({
  solvedIds,
  onSolveQuestion,
  onOpenLesson,
}: PracticeArenaProps) {
  const [trackFilter, setTrackFilter] = useState<'all' | TrackType>('all');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const filteredQuestions = useMemo(() => {
    if (trackFilter === 'all') return ALL_QUIZ_QUESTIONS;
    return ALL_QUIZ_QUESTIONS.filter((q) => q.track === trackFilter);
  }, [trackFilter]);

  const safeIdx = Math.min(questionIdx, filteredQuestions.length - 1);
  const currentQ = filteredQuestions[safeIdx];
  const isCorrect = submitted && selectedIdx === currentQ.correctIndex;
  const totalSolved = solvedIds.length;
  const totalQuestions = ALL_QUIZ_QUESTIONS.length;

  function handleFilterChange(nextFilter: 'all' | TrackType) {
    setTrackFilter(nextFilter);
    setQuestionIdx(0);
    setSelectedIdx(null);
    setSubmitted(false);
    setShowHint(false);
  }

  function handleCheck() {
    if (selectedIdx === null) return;
    setSubmitted(true);
    if (selectedIdx === currentQ.correctIndex) {
      onSolveQuestion(currentQ.id);
    }
  }

  function handleNext() {
    const next = (safeIdx + 1) % filteredQuestions.length;
    setQuestionIdx(next);
    setSelectedIdx(null);
    setSubmitted(false);
    setShowHint(false);
  }

  function handleJumpTo(idx: number) {
    setQuestionIdx(idx);
    setSelectedIdx(null);
    setSubmitted(false);
    setShowHint(false);
  }

  return (
    <div className="space-y-8">
      {/* Arena Header Split */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-center">
          <p className="text-xs font-medium text-slate-500 mb-2">
            Beit Midrash Practice Arena · {totalSolved} of {totalQuestions} Questions Mastered
          </p>
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-3">
            Test Your Torah, Gemara &amp; Shulchan Aruch Math Skills
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-xl mb-6">
            Practice addition patterns, 3D volume, Tallit fractions, circles, 1-to-60 ratios, Gematria, Halachic daylight hours, 10% Maaser, and Mezuzah thirds—with helpful hints on every question.
          </p>

          {/* Interactive Track Filter */}
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg self-start">
            {(
              [
                { key: 'all', label: `All Topics (${ALL_QUIZ_QUESTIONS.length})` },
                {
                  key: 'torah',
                  label: `Torah (${ALL_QUIZ_QUESTIONS.filter((q) => q.track === 'torah').length})`,
                },
                {
                  key: 'gemara',
                  label: `Gemara (${ALL_QUIZ_QUESTIONS.filter((q) => q.track === 'gemara').length})`,
                },
                {
                  key: 'shulchan-aruch',
                  label: `Shulchan Aruch (${ALL_QUIZ_QUESTIONS.filter((q) => q.track === 'shulchan-aruch').length})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => handleFilterChange(tab.key)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  trackFilter === tab.key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 min-h-[220px]">
          <ResilientImage
            src={ASSET_IMAGES.practiceArena}
            alt="Student solving geometric and balance-scale math puzzles at a sunlit wooden study table"
            fallbackTitle="Beit Midrash Practice Arena"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Main Quiz Workspace + Mastery Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Quiz Card */}
        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 lg:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200">
            <div className="text-xs text-slate-500 font-medium">
              Question {safeIdx + 1} of {filteredQuestions.length} ·{' '}
              {formatTrackLabel(currentQ.track)} · {currentQ.sourceRef}
            </div>
            <button
              type="button"
              onClick={() => onOpenLesson(currentQ.lessonId)}
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Open Interactive Lesson</span>
            </button>
          </div>

          <h2 className="text-xl lg:text-2xl font-semibold text-slate-900 leading-snug mt-6 mb-6">
            {currentQ.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              const showRight = submitted && idx === currentQ.correctIndex && isCorrect;
              const showWrong = submitted && isSelected && idx !== currentQ.correctIndex;

              let style =
                'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';
              if (showRight) {
                style = 'border-emerald-600 bg-emerald-50 text-emerald-950 font-medium';
              } else if (showWrong) {
                style = 'border-rose-600 bg-rose-50 text-rose-950 font-medium';
              } else if (isSelected) {
                style = 'border-blue-700 bg-blue-50 text-blue-950 font-medium';
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    if (submitted && isCorrect) return;
                    setSelectedIdx(idx);
                    if (submitted) setSubmitted(false);
                  }}
                  className={`text-left px-4 py-3.5 rounded-lg border text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer ${style}`}
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-slate-500">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>{opt}</span>
                  </span>
                  {showRight && <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />}
                  {showWrong && <XCircle className="w-4 h-4 text-rose-700 shrink-0" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {!isCorrect && (
              <button
                type="button"
                onClick={handleCheck}
                disabled={selectedIdx === null}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Check Answer
              </button>
            )}

            {submitted && !isCorrect && (
              <button
                type="button"
                onClick={() => {
                  setSelectedIdx(null);
                  setSubmitted(false);
                }}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Try Again</span>
              </button>
            )}

            {!isCorrect && (
              <button
                type="button"
                onClick={() => setShowHint((h) => !h)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" aria-hidden="true" />
                <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer ${
                isCorrect
                  ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 ml-auto'
              }`}
            >
              <span>{isCorrect ? 'Next Question' : 'Skip'}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {showHint && !isCorrect && (
            <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-950">
              <span className="font-semibold">Hint: </span>
              {currentQ.hint}
            </div>
          )}

          {submitted && (
            <div
              role="status"
              className={`mt-4 p-4 rounded-lg border text-sm flex items-start gap-3 ${
                isCorrect
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50 border-rose-200 text-rose-950'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
              )}
              <div>
                <p className="font-semibold mb-0.5">
                  {isCorrect ? 'Spot on!' : 'Give it another try!'}
                </p>
                <p className="leading-relaxed">
                  {isCorrect
                    ? currentQ.explanation
                    : 'Click Show Hint or open the interactive lesson sandbox to explore the model visually.'}
                </p>
              </div>
            </div>
          )}

          {/* Question Navigator Grid */}
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs font-medium text-slate-500 mb-3">
              Jump to Any Question
            </p>
            <div className="flex flex-wrap gap-1.5">
              {filteredQuestions.map((q, idx) => {
                const isSolved = solvedIds.includes(q.id);
                const isActive = idx === safeIdx;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => handleJumpTo(idx)}
                    className={`w-9 h-9 rounded-lg font-mono text-xs font-semibold tabular-nums transition-colors cursor-pointer border ${
                      isActive
                        ? 'border-blue-700 bg-blue-700 text-white'
                        : isSolved
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Mastery Progress Sidebar */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Topic Mastery
            </h3>
            <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" aria-hidden="true" />
              {totalSolved}/{totalQuestions}
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {LESSONS.map((lesson) => {
              const solvedInLesson = lesson.challenges.filter((c) =>
                solvedIds.includes(c.id)
              ).length;
              const pct = Math.round(
                (solvedInLesson / lesson.challenges.length) * 100
              );
              return (
                <div key={lesson.id} className="py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <button
                      type="button"
                      onClick={() => onOpenLesson(lesson.id)}
                      className="text-sm font-medium text-slate-800 hover:text-blue-700 text-left transition-colors cursor-pointer"
                    >
                      {lesson.order}. {lesson.title}
                    </button>
                    <span className="font-mono text-xs font-semibold text-slate-600 tabular-nums shrink-0">
                      {solvedInLesson}/{lesson.challenges.length}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct === 100 ? 'bg-emerald-600' : 'bg-blue-600'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}
