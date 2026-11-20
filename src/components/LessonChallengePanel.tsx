import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  Star,
} from 'lucide-react';
import type { ChallengeQuestion } from '../data/lessons';

interface LessonChallengePanelProps {
  lessonTitle: string;
  challenges: ChallengeQuestion[];
  solvedIds: string[];
  onSolveQuestion: (questionId: string) => void;
  onNextLesson?: () => void;
  nextLessonTitle?: string;
}

export function LessonChallengePanel({
  lessonTitle,
  challenges,
  solvedIds,
  onSolveQuestion,
  onNextLesson,
  nextLessonTitle,
}: LessonChallengePanelProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const currentQuestion = challenges[currentIdx];
  const isCorrect = submitted && selectedIdx === currentQuestion.correctIndex;
  const solvedCount = challenges.filter((c) => solvedIds.includes(c.id)).length;
  const allSolved = solvedCount === challenges.length;

  function handleSelectOption(idx: number) {
    if (submitted && isCorrect) return;
    setSelectedIdx(idx);
    if (submitted) {
      setSubmitted(false);
    }
  }

  function handleCheck() {
    if (selectedIdx === null) return;
    setSubmitted(true);
    if (selectedIdx === currentQuestion.correctIndex) {
      onSolveQuestion(currentQuestion.id);
    }
  }

  function handleSelectQuestion(idx: number) {
    setCurrentIdx(idx);
    setSelectedIdx(null);
    setSubmitted(false);
    setShowHint(false);
  }

  function handleTryAgain() {
    setSelectedIdx(null);
    setSubmitted(false);
  }

  return (
    <section
      aria-labelledby="challenge-heading"
      className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">
            Check Your Understanding · {lessonTitle}
          </p>
          <h3
            id="challenge-heading"
            className="text-xl font-semibold text-slate-900"
          >
            Lesson Mini-Challenge
          </h3>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 font-mono tabular-nums">
            <Star
              className={`w-4 h-4 ${
                allSolved ? 'text-amber-500 fill-amber-500' : 'text-slate-400'
              }`}
              aria-hidden="true"
            />
            <span>
              {solvedCount}/{challenges.length} solved
            </span>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {challenges.map((q, idx) => {
              const isSolved = solvedIds.includes(q.id);
              const isActive = idx === currentIdx;
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleSelectQuestion(idx)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  {isSolved && (
                    <CheckCircle2
                      className="w-3.5 h-3.5 text-emerald-700"
                      aria-label="Solved"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-6 max-w-3xl">
        <p className="text-xs text-slate-500 mb-2">
          Question {currentIdx + 1} of {challenges.length} · Source:{' '}
          {currentQuestion.sourceRef}
        </p>
        <p className="text-lg font-medium text-slate-900 leading-relaxed mb-5">
          {currentQuestion.question}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedIdx === idx;
            const showRight =
              submitted && idx === currentQuestion.correctIndex && isCorrect;
            const showWrong =
              submitted && isSelected && idx !== currentQuestion.correctIndex;

            let btnStyle =
              'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';
            if (showRight) {
              btnStyle =
                'border-emerald-600 bg-emerald-50 text-emerald-950 font-medium';
            } else if (showWrong) {
              btnStyle =
                'border-rose-600 bg-rose-50 text-rose-950 font-medium';
            } else if (isSelected) {
              btnStyle =
                'border-blue-700 bg-blue-50 text-blue-950 font-medium';
            }

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`text-left px-4 py-3.5 rounded-lg border text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${btnStyle}`}
              >
                <span className="flex items-center gap-3">
                  <span className="font-mono text-xs text-slate-500 tabular-nums">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <span>{option}</span>
                </span>
                {showRight && (
                  <CheckCircle2
                    className="w-4 h-4 text-emerald-700 shrink-0"
                    aria-hidden="true"
                  />
                )}
                {showWrong && (
                  <XCircle
                    className="w-4 h-4 text-rose-700 shrink-0"
                    aria-hidden="true"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Action row */}
        <div className="flex flex-wrap items-center gap-3">
          {!submitted || !isCorrect ? (
            <button
              type="button"
              onClick={handleCheck}
              disabled={selectedIdx === null}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Check Answer
            </button>
          ) : null}

          {submitted && !isCorrect && (
            <button
              type="button"
              onClick={handleTryAgain}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Try Again</span>
            </button>
          )}

          {!isCorrect && (
            <button
              type="button"
              onClick={() => setShowHint((h) => !h)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
            </button>
          )}

          {isCorrect && currentIdx < challenges.length - 1 && (
            <button
              type="button"
              onClick={() => handleSelectQuestion(currentIdx + 1)}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}

          {allSolved && onNextLesson && nextLessonTitle && (
            <button
              type="button"
              onClick={onNextLesson}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Continue to {nextLessonTitle}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Hint box */}
        {showHint && !isCorrect && (
          <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-950">
            <span className="font-semibold">Hint: </span>
            {currentQuestion.hint}
          </div>
        )}

        {/* Feedback box */}
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
              <p className="font-semibold mb-0.5">
                {isCorrect ? 'Correct! Well done.' : 'Not quite yet — try another answer.'}
              </p>
              <p className="leading-relaxed">
                {isCorrect
                  ? currentQuestion.explanation
                  : 'Use the interactive model above or click Show Hint to work it out step by step.'}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
