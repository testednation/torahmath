import { useState } from 'react';
import {
  Play,
  RotateCcw,
  HelpCircle,
  CheckCircle2,
  Star,
  ArrowLeft,
} from 'lucide-react';
import { playTap, playSuccess, playTryAgain, playFanfare } from '../../utils/soundFx';

interface MannaBasketGameProps {
  onBack: () => void;
  onCompleteRound: (score: number) => void;
}

type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY';
type Difficulty = 'beginner' | 'explorer';

interface MannaRound {
  target: number;
  loaves: number[];
  hintPair: [number, number];
  familyLabel: string;
}

const TOTAL_BASKETS = 6;

function buildMannaRound(difficulty: Difficulty, roundIndex: number): MannaRound {
  const familyNames = [
    'Miriam’s Tent',
    'Aharon’s Tent',
    'Yehoshua’s Tent',
    'Calev’s Tent',
    'Nachshon’s Tent',
    'Bezalel’s Tent',
  ];

  if (difficulty === 'beginner') {
    // Targets 6..10 with clean guaranteed 2-loaf solution
    const targets = [6, 8, 10, 7, 9, 10];
    const target = targets[roundIndex % targets.length];
    const a = 1 + Math.floor(Math.random() * (target - 2));
    const b = target - a;
    const pool = [a, b];
    while (pool.length < 9) {
      pool.push(1 + Math.floor(Math.random() * 8));
    }
    // Shuffle while tracking indices of the guaranteed pair
    const indexed = pool.map((val, i) => ({ val, isSolution: i === 0 || i === 1 }));
    for (let i = indexed.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
    }
    const hintIndices = indexed
      .map((item, idx) => (item.isSolution ? idx : -1))
      .filter((idx) => idx >= 0);

    return {
      target,
      loaves: indexed.map((item) => item.val),
      hintPair: [hintIndices[0], hintIndices[1]],
      familyLabel: familyNames[roundIndex % familyNames.length],
    };
  }

  // Explorer mode: Targets 13..22 with guaranteed 2-loaf solution
  const targets = [13, 15, 18, 16, 20, 22];
  const target = targets[roundIndex % targets.length];
  const a = 4 + Math.floor(Math.random() * (target - 8));
  const b = target - a;
  const pool = [a, b];
  while (pool.length < 9) {
    pool.push(2 + Math.floor(Math.random() * 13));
  }
  const indexed = pool.map((val, i) => ({ val, isSolution: i === 0 || i === 1 }));
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  const hintIndices = indexed
    .map((item, idx) => (item.isSolution ? idx : -1))
    .filter((idx) => idx >= 0);

  return {
    target,
    loaves: indexed.map((item) => item.val),
    hintPair: [hintIndices[0], hintIndices[1]],
    familyLabel: familyNames[roundIndex % familyNames.length],
  };
}

export function MannaBasketGame({
  onBack,
  onCompleteRound,
}: MannaBasketGameProps) {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [basketNum, setBasketNum] = useState(0);
  const [round, setRound] = useState<MannaRound>(() => buildMannaRound('beginner', 0));
  const [pickedIndices, setPickedIndices] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [perfectBaskets, setPerfectBaskets] = useState(0);
  const [usedMistakeOnBasket, setUsedMistakeOnBasket] = useState(false);

  const currentSum = pickedIndices.reduce((acc, idx) => acc + round.loaves[idx], 0);
  const fillPct = Math.min(100, Math.round((currentSum / round.target) * 100));

  function startGame(selectedDifficulty = difficulty) {
    playTap();
    setDifficulty(selectedDifficulty);
    setBasketNum(0);
    setRound(buildMannaRound(selectedDifficulty, 0));
    setPickedIndices([]);
    setShowHint(false);
    setStatusMessage(null);
    setScore(0);
    setPerfectBaskets(0);
    setUsedMistakeOnBasket(false);
    setGameState('PLAYING');
  }

  function handlePickLoaf(idx: number) {
    if (statusMessage === 'MATCHED') return;

    if (pickedIndices.includes(idx)) {
      playTap();
      setPickedIndices((prev) => prev.filter((i) => i !== idx));
      setStatusMessage(null);
      return;
    }

    const nextPicked = [...pickedIndices, idx];
    const nextSum = nextPicked.reduce((acc, i) => acc + round.loaves[i], 0);

    if (nextSum === round.target) {
      playSuccess();
      setPickedIndices(nextPicked);
      setStatusMessage('MATCHED');
      const earned = usedMistakeOnBasket ? 10 : 15;
      const nextScore = score + earned;
      setScore(nextScore);
      if (!usedMistakeOnBasket) {
        setPerfectBaskets((p) => p + 1);
      }

      window.setTimeout(() => {
        if (basketNum + 1 >= TOTAL_BASKETS) {
          playFanfare();
          setGameState('ROUND_SUMMARY');
          onCompleteRound(nextScore);
        } else {
          const nextNum = basketNum + 1;
          setBasketNum(nextNum);
          setRound(buildMannaRound(difficulty, nextNum));
          setPickedIndices([]);
          setShowHint(false);
          setStatusMessage(null);
          setUsedMistakeOnBasket(false);
        }
      }, 900);
    } else if (nextSum > round.target) {
      playTryAgain();
      setPickedIndices(nextPicked);
      setUsedMistakeOnBasket(true);
      setStatusMessage(
        `Oops! ${nextSum} is more than ${round.target}. Tap any loaf in your basket to put it back.`
      );
    } else {
      playTap();
      setPickedIndices(nextPicked);
      setStatusMessage(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Bar Back & Unobtrusive HUD */}
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
              Basket {basketNum + 1}/{TOTAL_BASKETS}
            </span>
            <span className="text-blue-700">Score: {score}</span>
          </div>
        )}
      </div>

      {/* TITLE MENU */}
      {gameState === 'TITLE_MENU' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-10 max-w-2xl mx-auto text-center space-y-6">
          <p className="text-xs font-medium text-slate-500">
            Torah Math Game · Shemot 16:16 · Addition &amp; Making Tens
          </p>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">
              Manna Basket Catcher
            </h2>
            <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
              Every morning in the desert, each family gathered the exact Omer measure of Manna they needed—not too little, not too much! Tap numbered Manna loaves so they add up to the exact target on the basket.
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
                Beginner (Sums to 10)
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
                Explorer (Sums to 22)
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
      {gameState === 'PLAYING' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Manna Camp Table (3×3 tactile grid) */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-xs text-slate-500">
                  {round.familyLabel} · Tap loaves to put them in the basket
                </p>
                <h3 className="text-lg font-bold text-slate-900">
                  Gather Exactly {round.target} Omers of Manna
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHint(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                <span>Show Hint</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {round.loaves.map((val, idx) => {
                const isPicked = pickedIndices.includes(idx);
                const isHinted =
                  showHint &&
                  (idx === round.hintPair[0] || idx === round.hintPair[1]);

                return (
                  <button
                    key={`${basketNum}-${idx}`}
                    type="button"
                    onClick={() => handlePickLoaf(idx)}
                    className={`h-24 rounded-xl border-2 flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer ${
                      isPicked
                        ? 'border-blue-700 bg-blue-50 text-blue-900 scale-[0.98]'
                        : isHinted
                        ? 'border-amber-500 bg-amber-50 text-amber-950 ring-2 ring-amber-200'
                        : 'border-amber-200 bg-amber-50/40 hover:border-amber-400 hover:bg-amber-50 text-slate-900'
                    }`}
                  >
                    <span className="font-mono text-3xl font-bold tabular-nums leading-none">
                      {val}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 mt-1">
                      {isPicked ? 'In Basket' : isHinted ? 'Try Me!' : 'Manna'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Visual Omer Basket & Live Sum */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">
                Your Family Basket
              </span>
              <span className="font-mono text-sm font-bold text-blue-700 tabular-nums">
                {currentSum} / {round.target}
              </span>
            </div>

            {/* Visual Basket Progress Bar */}
            <div className="space-y-2">
              <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div
                  className={`h-full transition-all duration-200 ${
                    currentSum === round.target
                      ? 'bg-emerald-600'
                      : currentSum > round.target
                      ? 'bg-rose-600'
                      : 'bg-blue-600'
                  }`}
                  style={{ width: `${fillPct}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 font-mono tabular-nums">
                {pickedIndices.length === 0
                  ? `Target = ${round.target} (pick 2 or more loaves)`
                  : `${pickedIndices.map((i) => round.loaves[i]).join(' + ')} = ${currentSum}`}
              </p>
            </div>

            {statusMessage === 'MATCHED' && (
              <div
                role="status"
                className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm flex items-center gap-2.5"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                <span className="font-semibold">
                  Exact Omer Measure! {currentSum} = {round.target}!
                </span>
              </div>
            )}

            {statusMessage && statusMessage !== 'MATCHED' && (
              <div
                role="status"
                className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 text-sm"
              >
                {statusMessage}
              </div>
            )}

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setPickedIndices([]);
                  setStatusMessage(null);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Empty Basket</span>
              </button>
              <button
                type="button"
                onClick={() => startGame(difficulty)}
                className="text-xs font-medium text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                Restart Game
              </button>
            </div>
          </div>
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
              All 6 Family Baskets Filled!
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Wonderful Gathering!
            </h2>
            <p className="text-sm text-slate-600">
              You scored <strong className="font-mono text-slate-900">{score}</strong> points with{' '}
              <strong className="font-mono text-slate-900">
                {perfectBaskets}/{TOTAL_BASKETS}
              </strong>{' '}
              first-try baskets.
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
