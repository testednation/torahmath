import { useState, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Star,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react';
import { playTap, playSuccess, playTryAgain, playFanfare } from '../../utils/soundFx';

interface ArkPairsGameProps {
  onBack: () => void;
  onCompleteRound: (score: number) => void;
}

type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY';
type Difficulty = 'beginner' | 'explorer';

interface ArkQuestion {
  animal: string;
  groupSize: 2 | 7;
  groups: number;
  total: number;
  options: number[];
}

const TOTAL_ROUNDS = 6;

const ANIMALS_BY_TWO = ['Elephants', 'Lions', 'Giraffes', 'Bears', 'Camels', 'Zebras'];
const ANIMALS_BY_SEVEN = ['Doves', 'Sheep', 'Gazelles', 'Cows', 'Goats', 'Deer'];

function buildArkQuestions(difficulty: Difficulty): ArkQuestion[] {
  const configs: Array<{ groupSize: 2 | 7; groups: number }> =
    difficulty === 'beginner'
      ? [
          { groupSize: 2, groups: 2 },
          { groupSize: 2, groups: 3 },
          { groupSize: 2, groups: 4 },
          { groupSize: 2, groups: 5 },
          { groupSize: 2, groups: 6 },
          { groupSize: 2, groups: 7 },
        ]
      : [
          { groupSize: 2, groups: 6 },
          { groupSize: 7, groups: 2 },
          { groupSize: 2, groups: 8 },
          { groupSize: 7, groups: 3 },
          { groupSize: 7, groups: 4 },
          { groupSize: 7, groups: 5 },
        ];

  return configs.map((cfg, idx) => {
    const total = cfg.groupSize * cfg.groups;
    const wrongSet = new Set<number>([total]);
    const candidates = [
      total + cfg.groupSize,
      Math.max(2, total - cfg.groupSize),
      total + 2,
      total + cfg.groups,
      Math.max(1, total - 1),
    ];
    for (const c of candidates) {
      if (wrongSet.size < 4 && c > 0) wrongSet.add(c);
    }
    const options = Array.from(wrongSet).sort((a, b) => a - b);
    const animal =
      cfg.groupSize === 2
        ? ANIMALS_BY_TWO[idx % ANIMALS_BY_TWO.length]
        : ANIMALS_BY_SEVEN[idx % ANIMALS_BY_SEVEN.length];
    return {
      animal,
      groupSize: cfg.groupSize,
      groups: cfg.groups,
      total,
      options,
    };
  });
}

export function ArkPairsGame({ onBack, onCompleteRound }: ArkPairsGameProps) {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [questions, setQuestions] = useState<ArkQuestion[]>(() =>
    buildArkQuestions('beginner')
  );
  const [roundIdx, setRoundIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [countingGroupIdx, setCountingGroupIdx] = useState<number | null>(null);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, []);

  const current = questions[roundIdx];

  function clearCountTimer() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setCountingGroupIdx(null);
  }

  function startGame(selectedDifficulty = difficulty) {
    clearCountTimer();
    playTap();
    setDifficulty(selectedDifficulty);
    setQuestions(buildArkQuestions(selectedDifficulty));
    setRoundIdx(0);
    setScore(0);
    setStreak(0);
    setFeedback(null);
    setSelectedAnswer(null);
    setGameState('PLAYING');
  }

  function runSkipCountHelper() {
    clearCountTimer();
    let idx = 0;
    setCountingGroupIdx(0);
    playTap();
    timerRef.current = window.setInterval(() => {
      idx += 1;
      if (idx >= current.groups) {
        clearCountTimer();
      } else {
        setCountingGroupIdx(idx);
        playTap();
      }
    }, 520);
  }

  function handleAnswer(choice: number) {
    if (feedback === 'correct') return;
    clearCountTimer();
    setSelectedAnswer(choice);

    if (choice === current.total) {
      playSuccess();
      setFeedback('correct');
      const nextScore = score + 15;
      setScore(nextScore);
      setStreak((s) => s + 1);

      window.setTimeout(() => {
        if (roundIdx + 1 >= TOTAL_ROUNDS) {
          playFanfare();
          setGameState('ROUND_SUMMARY');
          onCompleteRound(nextScore);
        } else {
          setRoundIdx((r) => r + 1);
          setFeedback(null);
          setSelectedAnswer(null);
        }
      }, 950);
    } else {
      playTryAgain();
      setFeedback('wrong');
      setStreak(0);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>All Math Games</span>
        </button>

        {gameState === 'PLAYING' && (
          <div className="flex items-center gap-5 text-xs font-mono font-semibold text-slate-700 tabular-nums">
            <span>
              Ramp {roundIdx + 1}/{TOTAL_ROUNDS}
            </span>
            <span className="text-emerald-700">Streak: {streak}</span>
            <span className="text-blue-700">Score: {score}</span>
          </div>
        )}
      </div>

      {/* TITLE MENU */}
      {gameState === 'TITLE_MENU' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-10 max-w-2xl mx-auto text-center space-y-6">
          <p className="text-xs font-medium text-slate-500">
            Torah Math Game · Bereishit 7:2 · Skip Counting &amp; Multiplication
          </p>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">
              Noah’s Ark Animal Pairs
            </h2>
            <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
              Help Noah count the animals walking onto the Ark! Animals enter in pairs of <strong>2</strong>—and kosher animals enter in groups of <strong>7</strong>. Use the <strong>Count Together</strong> helper anytime!
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">
              Choose Your Level
            </p>
            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setDifficulty('beginner')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  difficulty === 'beginner'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Beginner (Count by 2s)
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('explorer')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  difficulty === 'explorer'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Explorer (2s &amp; 7s)
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => startGame(difficulty)}
              className="px-7 py-3 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              <span>Start Game</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE PLAY */}
      {gameState === 'PLAYING' && current && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-500">
                Bereishit 7:2 · {current.groupSize === 2 ? 'Walking in Pairs (2s)' : 'Kosher Groups of 7'}
              </p>
              <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mt-0.5">
                {current.groups} {current.groupSize === 2 ? 'pairs' : 'groups of 7'} of{' '}
                {current.animal} board the Ark. How many {current.animal.toLowerCase()} in total?
              </h3>
            </div>

            <button
              type="button"
              onClick={runSkipCountHelper}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-700" aria-hidden="true" />
              <span>Count Together ({current.groupSize}s)</span>
            </button>
          </div>

          {/* Visual Animal Groups on the Wooden Ramp */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Array.from({ length: current.groups }).map((_, gIdx) => {
                const runningCount = (gIdx + 1) * current.groupSize;
                const isLit =
                  countingGroupIdx !== null && gIdx <= countingGroupIdx;
                const isCurrentStep = countingGroupIdx === gIdx;

                return (
                  <div
                    key={gIdx}
                    className={`rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-transform ${
                      isCurrentStep
                        ? 'border-blue-700 bg-blue-50 scale-105'
                        : isLit
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex flex-wrap justify-center gap-1 max-w-[110px]">
                      {Array.from({ length: current.groupSize }).map((__, dotIdx) => (
                        <span
                          key={dotIdx}
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-mono ${
                            current.groupSize === 2
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          }`}
                        >
                          {current.animal[0]}
                        </span>
                      ))}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-700 tabular-nums">
                      {isLit ? runningCount : `Group ${gIdx + 1}`}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-center font-mono text-xs text-slate-500 mt-4 tabular-nums">
              Equation: {current.groups} × {current.groupSize} = ?
            </p>
          </div>

          {/* 4 Big Answer Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {current.options.map((opt) => {
              const isPicked = selectedAnswer === opt;
              const isRight = feedback === 'correct' && opt === current.total;
              const isWrong = feedback === 'wrong' && isPicked;

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleAnswer(opt)}
                  className={`h-16 rounded-xl border-2 font-mono text-2xl font-bold tabular-nums transition-colors flex items-center justify-center gap-2 cursor-pointer ${
                    isRight
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900'
                      : isWrong
                      ? 'border-rose-600 bg-rose-50 text-rose-900'
                      : 'border-slate-200 bg-white hover:border-blue-600 hover:bg-blue-50 text-slate-900'
                  }`}
                >
                  <span>{opt}</span>
                  {isRight && <CheckCircle2 className="w-5 h-5 text-emerald-700" aria-hidden="true" />}
                  {isWrong && <XCircle className="w-5 h-5 text-rose-700" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          {feedback === 'wrong' && (
            <div
              role="status"
              className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-sm"
            >
              Try again! Tap <strong>Count Together</strong> to skip-count by {current.groupSize}s.
            </div>
          )}
        </div>
      )}

      {/* ROUND SUMMARY */}
      {gameState === 'ROUND_SUMMARY' && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-emerald-700">
              All Animals Safely Aboard!
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Great Skip-Counting!
            </h2>
            <p className="text-sm text-slate-600">
              You earned <strong className="font-mono text-slate-900">{score}</strong> points loading all {TOTAL_ROUNDS} animal groups onto Noah’s Ark.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => startGame(difficulty)}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Play Again</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
