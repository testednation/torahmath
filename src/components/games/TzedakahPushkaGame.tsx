import { useState, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Star,
  ArrowLeft,
  HelpCircle,
} from 'lucide-react';
import { playTap, playSuccess, playTryAgain, playFanfare } from '../../utils/soundFx';

interface TzedakahPushkaGameProps {
  onBack: () => void;
  onCompleteRound: (score: number) => void;
}

type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY';
type Difficulty = 'beginner' | 'explorer';

interface PushkaRound {
  story: string;
  earnings: number;
  percent: 10 | 20;
  target: number;
  hint: string;
}

const BEGINNER_ROUNDS: PushkaRound[] = [
  {
    story: 'You earned $20 helping organize books for Shabbat. Drop 10% Maaser into the pushka!',
    earnings: 20,
    percent: 10,
    target: 2,
    hint: 'Drop the zero from $20: $20 ÷ 10 = $2!',
  },
  {
    story: 'You received $50 as Chanukah gelt! Put 10% Maaser into the Tzedakah box.',
    earnings: 50,
    percent: 10,
    target: 5,
    hint: 'Drop the zero from $50: $50 ÷ 10 = $5!',
  },
  {
    story: 'Your lemonade stand made $30! Drop 10% Maaser into the pushka.',
    earnings: 30,
    percent: 10,
    target: 3,
    hint: '$30 ÷ 10 = $3 (try three $1 coins!).',
  },
  {
    story: 'You earned $80 walking neighbors’ dogs. Put 10% Maaser into the Tzedakah box!',
    earnings: 80,
    percent: 10,
    target: 8,
    hint: 'Drop the zero from $80 to get $8 (try $5 + $1 + $1 + $1).',
  },
  {
    story: 'Grandma gave you $100 for your birthday! Drop 10% Maaser into the pushka.',
    earnings: 100,
    percent: 10,
    target: 10,
    hint: '$100 ÷ 10 = $10 — one single $10 coin does it!',
  },
  {
    story: 'You saved $70 from chores this month. Put 10% Maaser in the Tzedakah pushka!',
    earnings: 70,
    percent: 10,
    target: 7,
    hint: '$70 ÷ 10 = $7 (try $5 + $1 + $1).',
  },
];

const EXPLORER_ROUNDS: PushkaRound[] = [
  {
    story: 'You earned $40 raking autumn leaves and want to give 20% Chomesh (Yoreh Deah 249:1)!',
    earnings: 40,
    percent: 20,
    target: 8,
    hint: 'First find 10% ($40 ÷ 10 = $4), then double it for 20%: $4 × 2 = $8!',
  },
  {
    story: 'You made $120 at a bake sale! Drop 10% Maaser into the Tzedakah pushka.',
    earnings: 120,
    percent: 10,
    target: 12,
    hint: 'Drop the zero from $120: $120 ÷ 10 = $12 ($10 + $1 + $1).',
  },
  {
    story: 'You earned $60 tutoring younger kids and choose generous 20% Chomesh!',
    earnings: 60,
    percent: 20,
    target: 12,
    hint: '10% of $60 is $6. Double it for 20% Chomesh: $6 × 2 = $12!',
  },
  {
    story: 'Your family earned $90 from a garage sale. Give 20% Chomesh to Tzedakah!',
    earnings: 90,
    percent: 20,
    target: 18,
    hint: '10% of $90 is $9. Double it for 20%: $9 × 2 = $18!',
  },
  {
    story: 'You earned $150 over summer break. Drop 10% Maaser into the pushka!',
    earnings: 150,
    percent: 10,
    target: 15,
    hint: '$150 ÷ 10 = $15 ($10 + $5)!',
  },
  {
    story: 'You earned $110 mowing lawns and decide to give generous 20% Chomesh!',
    earnings: 110,
    percent: 20,
    target: 22,
    hint: '10% of $110 is $11. Double it for 20%: $11 × 2 = $22!',
  },
];

const COIN_VALUES = [1, 5, 10] as const;

export function TzedakahPushkaGame({
  onBack,
  onCompleteRound,
}: TzedakahPushkaGameProps) {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [roundIdx, setRoundIdx] = useState(0);
  const [coins, setCoins] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [matched, setMatched] = useState(false);
  const nextTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (nextTimerRef.current !== null) {
        window.clearTimeout(nextTimerRef.current);
      }
    };
  }, []);

  const rounds = difficulty === 'beginner' ? BEGINNER_ROUNDS : EXPLORER_ROUNDS;
  const current = rounds[roundIdx];
  const currentTotal = coins.reduce((a, b) => a + b, 0);
  const overTarget = currentTotal > current.target;

  function startGame(level = difficulty) {
    if (nextTimerRef.current !== null) {
      window.clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }
    playTap();
    setDifficulty(level);
    setRoundIdx(0);
    setCoins([]);
    setShowHint(false);
    setScore(0);
    setMatched(false);
    setGameState('PLAYING');
  }

  function dropCoin(val: number) {
    if (matched) return;
    if (coins.length >= 12) return;
    const nextCoins = [...coins, val];
    const nextTotal = nextCoins.reduce((a, b) => a + b, 0);
    setCoins(nextCoins);

    if (nextTotal === current.target) {
      playSuccess();
      setMatched(true);
      const nextScore = score + 15;
      setScore(nextScore);

      nextTimerRef.current = window.setTimeout(() => {
        if (roundIdx + 1 >= rounds.length) {
          playFanfare();
          setGameState('ROUND_SUMMARY');
          onCompleteRound(nextScore);
        } else {
          setRoundIdx((i) => i + 1);
          setCoins([]);
          setShowHint(false);
          setMatched(false);
        }
      }, 1050);
    } else if (nextTotal > current.target) {
      playTryAgain();
    } else {
      playTap();
    }
  }

  function removeCoin(idx: number) {
    if (matched) return;
    playTap();
    setCoins((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
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
              Mitzvah {roundIdx + 1}/{rounds.length}
            </span>
            <span className="text-blue-700">Score: {score}</span>
          </div>
        )}
      </div>

      {/* TITLE MENU */}
      {gameState === 'TITLE_MENU' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-10 max-w-2xl mx-auto text-center space-y-6">
          <p className="text-xs font-medium text-slate-500">
            Shulchan Aruch Math Game · Yoreh Deah 249:1 · 10% Maaser &amp; 20% Chomesh
          </p>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">
              Tzedakah Pushka 10% Dash
            </h2>
            <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
              Practice dividing by 10 and doubling! Drop $1, $5, and $10 coins into the brass Tzedakah pushka to match exact Maaser (10%) or Chomesh (20%) gifts.
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
                Beginner (10% Maaser)
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
                Explorer (10% &amp; 20% Chomesh)
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
          {/* Left Stage: Story + Animated Brass Pushka SVG */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">
                  Yoreh Deah 249:1 · {current.percent === 10 ? 'Maaser (10%)' : 'Chomesh (20%)'}
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
                <strong>Drop-the-Zero Hint:</strong> {current.hint}
              </div>
            )}

            {/* Visual Stage: Earnings Card + Tzedakah Pushka SVG */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div className="space-y-3 text-center sm:text-left">
                <div className="p-4 rounded-xl bg-white border border-slate-200">
                  <p className="text-xs text-slate-500">Total Earned</p>
                  <p className="font-mono text-3xl font-bold text-slate-900 tabular-nums mt-0.5">
                    ${current.earnings}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <p className="text-xs font-medium text-amber-800">
                    Goal: Give {current.percent}%
                  </p>
                  <p className="font-mono text-sm font-bold text-amber-950 tabular-nums mt-1">
                    {current.percent === 10
                      ? `$${current.earnings} ÷ 10 = ?`
                      : `2 × ($${current.earnings} ÷ 10) = ?`}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <svg
                  viewBox="0 0 180 195"
                  className="w-44 h-48"
                  role="img"
                  aria-label={`Tzedakah pushka currently holding $${currentTotal}`}
                >
                  {/* Top brass cap & slot */}
                  <rect x="34" y="28" width="112" height="16" rx="5" fill="#D97706" stroke="#92400E" strokeWidth="2" />
                  <rect x="66" y="34" width="48" height="5" rx="2.5" fill="#0F172A" />

                  {/* Pushka body */}
                  <rect
                    x="40"
                    y="44"
                    width="100"
                    height="122"
                    rx="8"
                    fill={matched ? '#ECFDF5' : overTarget ? '#FFF1F2' : '#EFF6FF'}
                    stroke={matched ? '#047857' : overTarget ? '#BE123C' : '#1D4ED8'}
                    strokeWidth="2.5"
                  />

                  {/* Bottom brass rim */}
                  <rect x="34" y="160" width="112" height="15" rx="5" fill="#D97706" stroke="#92400E" strokeWidth="2" />

                  {/* Hebrew title */}
                  <text
                    x="90"
                    y="78"
                    textAnchor="middle"
                    fontSize="19"
                    fontWeight="700"
                    fill={matched ? '#065F46' : '#1E3A8A'}
                  >
                    צדקה
                  </text>
                  <text
                    x="90"
                    y="95"
                    textAnchor="middle"
                    fontSize="9.5"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontWeight="700"
                    fill="#64748B"
                  >
                    PUSHKA TOTAL
                  </text>

                  {/* Digital Readout Window */}
                  <rect x="52" y="106" width="76" height="38" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                  <text
                    x="90"
                    y="131"
                    textAnchor="middle"
                    fontSize="19"
                    fontFamily="IBM Plex Mono, monospace"
                    fontWeight="700"
                    fill={matched ? '#047857' : overTarget ? '#BE123C' : '#0F172A'}
                  >
                    ${currentTotal}
                  </text>
                </svg>

                <p
                  className={`text-xs font-semibold text-center ${
                    matched
                      ? 'text-emerald-700'
                      : overTarget
                      ? 'text-rose-700'
                      : 'text-slate-500'
                  }`}
                >
                  {matched
                    ? 'Exact Mitzvah Match!'
                    : overTarget
                    ? 'Too much in the box — tap a coin on the right to take it out'
                    : 'Tap coins on the right to drop them in'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel: Coin Drop Buttons + Inserted Coins */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Tap a Coin to Drop Into the Pushka
              </p>
              <div className="grid grid-cols-3 gap-3">
                {COIN_VALUES.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => dropCoin(val)}
                    disabled={matched}
                    className="h-16 rounded-xl border-2 border-amber-300 bg-amber-50 hover:border-blue-600 hover:bg-blue-50 font-mono text-xl font-bold text-amber-950 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    +${val}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Coins Dropped (tap to remove)</span>
                <span className="font-mono font-bold text-blue-700 tabular-nums">
                  ${currentTotal}
                </span>
              </div>

              {coins.length === 0 ? (
                <p className="text-xs text-slate-400 py-3">
                  No coins dropped yet. Tap +$1, +$5, or +$10 above!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {coins.map((c, idx) => (
                    <button
                      key={`${c}-${idx}`}
                      type="button"
                      onClick={() => removeCoin(idx)}
                      className="w-11 h-11 rounded-full border-2 border-amber-400 bg-amber-50 hover:bg-rose-50 hover:border-rose-400 font-mono text-xs font-bold text-amber-950 transition-colors cursor-pointer"
                      title="Remove coin"
                    >
                      ${c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {matched && (
              <div
                role="status"
                className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm flex items-center gap-2"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
                <span className="font-semibold">
                  Kol HaKavod! {current.percent}% of ${current.earnings} = ${current.target}!
                </span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setCoins([]);
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Empty Coins</span>
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
              All {rounds.length} Tzedakah Gifts Completed!
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Generous Maaser Champion!
            </h2>
            <p className="text-sm text-slate-600">
              You scored <strong className="font-mono text-slate-900">{score}</strong> points mastering Shulchan Aruch percentages (Yoreh Deah 249:1).
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
