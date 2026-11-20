import { useState } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Star,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react';
import { playTap, playSuccess, playTryAgain, playFanfare } from '../../utils/soundFx';

interface BeitDinScaleGameProps {
  onBack: () => void;
  onCompleteRound: (score: number) => void;
}

type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY';
type Difficulty = 'beginner' | 'explorer';

interface ScalePuzzle {
  story: string;
  source: string;
  leftLabel: string;
  targetValue: number;
  unit: string;
  hint: string;
}

const BEGINNER_PUZZLES: ScalePuzzle[] = [
  {
    story: 'Two friends share 8 silver zuz equally. Put ONE friend’s fair half on the right pan!',
    source: 'Bava Metzia 2a',
    leftLabel: 'Half of 8 zuz',
    targetValue: 4,
    unit: 'zuz',
    hint: 'Split 8 into 2 equal halves: 4 + 4 = 8.',
  },
  {
    story: 'A tallit is worth 12 zuz and split equally in half. Balance ONE share on the scale!',
    source: 'Bava Metzia 2a',
    leftLabel: 'Half of 12 zuz',
    targetValue: 6,
    unit: 'zuz',
    hint: '6 + 6 = 12, so half of 12 is 6 zuz.',
  },
  {
    story: 'You earned 10 coins and give 1/10 (Maaser) to tzedakah. How many coins is Maaser?',
    source: 'Devarim 14:22',
    leftLabel: 'Maaser of 10',
    targetValue: 1,
    unit: 'zuz',
    hint: '1 out of every 10 coins goes to Maaser (10 ÷ 10 = 1).',
  },
  {
    story: 'Add 5 zuz from Monday and 7 zuz from Tuesday. Balance the total on the right pan!',
    source: 'Gemara Money Math',
    leftLabel: '5 + 7 zuz',
    targetValue: 12,
    unit: 'zuz',
    hint: 'Start at 7 and count up 5 more: 8, 9, 10, 11, 12.',
  },
  {
    story: 'Two kids share 20 silver zuz equally. Balance ONE kid’s half!',
    source: 'Bava Metzia 2a',
    leftLabel: 'Half of 20 zuz',
    targetValue: 10,
    unit: 'zuz',
    hint: '10 + 10 = 20!',
  },
  {
    story: 'A kosher box has 8 Shamash candles plus 7 candles on Night 7. Balance the total!',
    source: 'Shabbat 21b',
    leftLabel: '8 + 7 candles',
    targetValue: 15,
    unit: 'zuz',
    hint: 'Use a 10 weight and a 5 weight to make 15!',
  },
];

const EXPLORER_PUZZLES: ScalePuzzle[] = [
  {
    story: 'Classic Bava Metzia! A tallit worth 20 zuz is split 3/4 to Reuven and 1/4 to Shimon. Balance REUVEN’S 3/4 share!',
    source: 'Bava Metzia 2a',
    leftLabel: '3/4 of 20 zuz',
    targetValue: 15,
    unit: 'zuz',
    hint: '1/4 of 20 is 5. Three quarters is 3 × 5 = 15 zuz!',
  },
  {
    story: 'You earned 30 silver zuz and give Maaser (10% = 1/10) to tzedakah. Balance the Maaser!',
    source: 'Devarim 14:22',
    leftLabel: '10% of 30 zuz',
    targetValue: 3,
    unit: 'zuz',
    hint: 'Divide 30 by 10 to find 10%: 30 ÷ 10 = 3.',
  },
  {
    story: 'In Bava Metzia, a 24-zuz cloak is split 3/4 and 1/4. Balance SHIMON’S 1/4 share!',
    source: 'Bava Metzia 2a',
    leftLabel: '1/4 of 24 zuz',
    targetValue: 6,
    unit: 'zuz',
    hint: 'Divide 24 by 4 equal quarters: 24 ÷ 4 = 6.',
  },
  {
    story: 'A circular well has a diameter of 7 tefachim. Using Eruvin 14a (C ≈ 3 × d), balance its circumference!',
    source: 'Eruvin 14a',
    leftLabel: '3 × 7 tefachim',
    targetValue: 21,
    unit: 'zuz',
    hint: '3 × 7 = 21. Try two 10s and one 1!',
  },
  {
    story: 'Add the Gematria of חי (Chai = 18) and אחד (Echad = 13) together!',
    source: 'Torah Gematria',
    leftLabel: '18 + 13',
    targetValue: 31,
    unit: 'zuz',
    hint: '18 + 10 = 28, then + 3 = 31!',
  },
  {
    story: 'A 36-zuz tallit is split 3/4 to Reuven and 1/4 to Shimon. Balance REUVEN’S 3/4 share!',
    source: 'Bava Metzia 2a',
    leftLabel: '3/4 of 36 zuz',
    targetValue: 27,
    unit: 'zuz',
    hint: '1/4 of 36 is 9. Three quarters is 3 × 9 = 27 zuz!',
  },
];

const COIN_WEIGHTS = [1, 2, 5, 10];

export function BeitDinScaleGame({
  onBack,
  onCompleteRound,
}: BeitDinScaleGameProps) {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const [panCoins, setPanCoins] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [balanced, setBalanced] = useState(false);

  const puzzles = difficulty === 'beginner' ? BEGINNER_PUZZLES : EXPLORER_PUZZLES;
  const current = puzzles[puzzleIdx];
  const rightTotal = panCoins.reduce((a, b) => a + b, 0);
  const diff = rightTotal - current.targetValue;

  // Tilt angle in degrees (-16 to +16)
  const tiltDeg = Math.max(-16, Math.min(16, diff * 2.2));

  function startGame(selectedDifficulty = difficulty) {
    playTap();
    setDifficulty(selectedDifficulty);
    setPuzzleIdx(0);
    setPanCoins([]);
    setShowHint(false);
    setScore(0);
    setBalanced(false);
    setGameState('PLAYING');
  }

  function addCoin(val: number) {
    if (balanced) return;
    if (panCoins.length >= 10) return;
    const nextCoins = [...panCoins, val];
    const nextTotal = nextCoins.reduce((a, b) => a + b, 0);
    setPanCoins(nextCoins);

    if (nextTotal === current.targetValue) {
      playSuccess();
      setBalanced(true);
      const nextScore = score + 15;
      setScore(nextScore);

      window.setTimeout(() => {
        if (puzzleIdx + 1 >= puzzles.length) {
          playFanfare();
          setGameState('ROUND_SUMMARY');
          onCompleteRound(nextScore);
        } else {
          setPuzzleIdx((idx) => idx + 1);
          setPanCoins([]);
          setShowHint(false);
          setBalanced(false);
        }
      }, 1050);
    } else if (nextTotal > current.targetValue) {
      playTryAgain();
    } else {
      playTap();
    }
  }

  function removeCoinAt(idx: number) {
    if (balanced) return;
    playTap();
    setPanCoins((prev) => prev.filter((_, i) => i !== idx));
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
              Scale {puzzleIdx + 1}/{puzzles.length}
            </span>
            <span className="text-blue-700">Score: {score}</span>
          </div>
        )}
      </div>

      {/* TITLE MENU */}
      {gameState === 'TITLE_MENU' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-10 max-w-2xl mx-auto text-center space-y-6">
          <p className="text-xs font-medium text-slate-500">
            Gemara Math Game · Bava Metzia 2a &amp; Maaser · Fair Sharing &amp; Equations
          </p>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">
              Beit Din Scale Balancer
            </h2>
            <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
              Step into the Beit Din courtroom! Drop silver zuz weights (`1`, `2`, `5`, `10`) onto the right pan until the gleaming brass scale levels out perfectly.
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
                Beginner (Halves &amp; Adding)
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
                Explorer (Quarters &amp; 10% Maaser)
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Animated SVG Brass Balance Scale */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">
                  Source: {current.source}
                </p>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5 leading-snug">
                  {current.story}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHint((h) => !h)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                <span>Hint</span>
              </button>
            </div>

            {showHint && (
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <strong>Hint:</strong> {current.hint}
              </div>
            )}

            {/* Interactive SVG Brass Balance Beam */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <svg
                viewBox="0 0 460 220"
                className="w-full h-auto"
                role="img"
                aria-label={`Balance scale with ${current.leftLabel} on the left and ${rightTotal} on the right`}
              >
                {/* Pedestal base */}
                <path d="M180 206 L280 206 L266 192 L194 192 Z" fill="#92400E" />
                <rect x="223" y="54" width="14" height="138" rx="4" fill="#B45309" />
                <circle cx="230" cy="54" r="10" fill="#D97706" stroke="#78350F" strokeWidth="2" />

                {/* Rotating Balance Beam */}
                <g
                  transform={`rotate(${tiltDeg}, 230, 54)`}
                  style={{ transition: 'transform 220ms cubic-bezier(0.16, 1, 0.3, 1)' }}
                >
                  <rect x="74" y="49" width="312" height="10" rx="5" fill="#D97706" />

                  {/* Left Pan (Puzzle Weight) */}
                  <line x1="94" y1="59" x2="72" y2="128" stroke="#92400E" strokeWidth="2" />
                  <line x1="94" y1="59" x2="116" y2="128" stroke="#92400E" strokeWidth="2" />
                  <path d="M54 128 Q94 150 134 128 Z" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />
                  <rect x="54" y="96" width="80" height="30" rx="6" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="2" />
                  <text
                    x="94"
                    y="115"
                    textAnchor="middle"
                    fontSize="10.5"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontWeight="700"
                    fill="#1E3A8A"
                  >
                    {current.leftLabel}
                  </text>

                  {/* Right Pan (Student's Coins) */}
                  <line x1="366" y1="59" x2="344" y2="128" stroke="#92400E" strokeWidth="2" />
                  <line x1="366" y1="59" x2="388" y2="128" stroke="#92400E" strokeWidth="2" />
                  <path d="M326 128 Q366 150 406 128 Z" fill="#F59E0B" stroke="#92400E" strokeWidth="2" />
                  <rect
                    x="332"
                    y="96"
                    width="68"
                    height="30"
                    rx="6"
                    fill={balanced ? '#D1FAE5' : '#FFFFFF'}
                    stroke={balanced ? '#047857' : '#64748B'}
                    strokeWidth="2"
                  />
                  <text
                    x="366"
                    y="116"
                    textAnchor="middle"
                    fontSize="14"
                    fontFamily="IBM Plex Mono, monospace"
                    fontWeight="700"
                    fill={balanced ? '#065F46' : '#0F172A'}
                  >
                    {rightTotal}
                  </text>
                </g>

                {/* Status text at bottom */}
                <text
                  x="230"
                  y="182"
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="700"
                  fill={
                    balanced
                      ? '#047857'
                      : diff > 0
                      ? '#BE123C'
                      : '#475569'
                  }
                >
                  {balanced
                    ? 'BALANCED! Fair & Equal!'
                    : diff > 0
                    ? 'Too Heavy — Tap a coin on the right to remove it'
                    : 'Too Light — Add more silver zuz weights'}
                </text>
              </svg>
            </div>
          </div>

          {/* Right: Coin Weight Tray & Active Pan Coins */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Tap a Silver Zuz Weight to Drop on the Right Pan
              </p>
              <div className="grid grid-cols-2 gap-3">
                {COIN_WEIGHTS.map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => addCoin(w)}
                    disabled={balanced}
                    className="h-16 rounded-xl border-2 border-slate-200 bg-slate-50 hover:border-blue-600 hover:bg-blue-50 font-mono text-xl font-bold text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    +{w} zuz
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Coins on Right Pan (tap to remove)</span>
                <span className="font-mono font-bold text-blue-700 tabular-nums">
                  Total = {rightTotal}
                </span>
              </div>

              {panCoins.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">
                  No coins placed yet. Tap +1, +2, +5, or +10 above!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {panCoins.map((c, idx) => (
                    <button
                      key={`${c}-${idx}`}
                      type="button"
                      onClick={() => removeCoinAt(idx)}
                      className="w-11 h-11 rounded-full border-2 border-amber-400 bg-amber-50 hover:bg-rose-50 hover:border-rose-400 font-mono text-sm font-bold text-amber-950 transition-colors cursor-pointer"
                      title="Remove coin"
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {balanced && (
              <div
                role="status"
                className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                <span className="font-semibold">
                  Perfect Balance! {current.leftLabel} = {current.targetValue}!
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setPanCoins([]);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear Pan</span>
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
              All {puzzles.length} Scales Balanced!
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Wise Beit Din Judge!
            </h2>
            <p className="text-sm text-slate-600">
              You earned <strong className="font-mono text-slate-900">{score}</strong> points balancing every silver zuz puzzle fairly.
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
