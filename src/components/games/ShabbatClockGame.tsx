import { useState, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Star,
  ArrowLeft,
  HelpCircle,
  Flame,
} from 'lucide-react';
import { playTap, playSuccess, playTryAgain, playFanfare } from '../../utils/soundFx';

interface ShabbatClockGameProps {
  onBack: () => void;
  onCompleteRound: (score: number) => void;
}

type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY';
type Difficulty = 'beginner' | 'explorer';

interface FridayRound {
  seasonLabel: string;
  sunsetMins: number; // minutes past 12:00 PM (e.g. 5:30 PM = 330)
  subtractMins: number; // 10 or 15 in Beginner, 18 in Explorer (Orach Chaim 263:4)
  hint: string;
}

const BEGINNER_FRIDAYS: FridayRound[] = [
  {
    seasonLabel: 'Autumn Friday',
    sunsetMins: 5 * 60 + 30, // 5:30 PM
    subtractMins: 10,
    hint: 'Start at 5:30 PM and take away 10 minutes: 30 − 10 = 20 → 5:20 PM!',
  },
  {
    seasonLabel: 'Winter Friday',
    sunsetMins: 4 * 60 + 45, // 4:45 PM
    subtractMins: 15,
    hint: '45 − 15 = 30, so candle lighting is 4:30 PM!',
  },
  {
    seasonLabel: 'Spring Friday',
    sunsetMins: 6 * 60 + 20, // 6:20 PM
    subtractMins: 10,
    hint: '20 − 10 = 10, so candle lighting is 6:10 PM!',
  },
  {
    seasonLabel: 'Early Summer Friday',
    sunsetMins: 7 * 60 + 50, // 7:50 PM
    subtractMins: 15,
    hint: 'Take away 10 first (7:40), then 5 more → 7:35 PM!',
  },
  {
    seasonLabel: 'Crisp November Friday',
    sunsetMins: 5 * 60 + 0, // 5:00 PM
    subtractMins: 10,
    hint: '10 minutes before 5:00 PM steps back into the 4 o’clock hour: 4:50 PM!',
  },
  {
    seasonLabel: 'Sunny June Friday',
    sunsetMins: 8 * 60 + 15, // 8:15 PM
    subtractMins: 15,
    hint: '15 − 15 = 0, so candle lighting is right on the hour: 8:00 PM!',
  },
];

const EXPLORER_FRIDAYS: FridayRound[] = [
  {
    seasonLabel: 'Autumn Friday (18 min rule)',
    sunsetMins: 5 * 60 + 48, // 5:48 PM
    subtractMins: 18,
    hint: '48 − 18 = 30! Candle lighting is 5:30 PM.',
  },
  {
    seasonLabel: 'Winter Friday (18 min rule)',
    sunsetMins: 4 * 60 + 38, // 4:38 PM
    subtractMins: 18,
    hint: '38 − 18 = 20! Candle lighting is 4:20 PM.',
  },
  {
    seasonLabel: 'Spring Friday (18 min rule)',
    sunsetMins: 6 * 60 + 30, // 6:30 PM
    subtractMins: 18,
    hint: 'Subtract 20 minutes first (6:10), then add 2 back → 6:12 PM!',
  },
  {
    seasonLabel: 'Summer Friday (18 min rule)',
    sunsetMins: 8 * 60 + 10, // 8:10 PM
    subtractMins: 18,
    hint: 'Take away 10 to reach 8:00 PM, then take away 8 more → 7:52 PM!',
  },
  {
    seasonLabel: 'Late Winter Friday (18 min rule)',
    sunsetMins: 5 * 60 + 5, // 5:05 PM
    subtractMins: 18,
    hint: 'Take away 5 to hit 5:00 PM, then take away 13 more (60 − 13 = 47) → 4:47 PM!',
  },
  {
    seasonLabel: 'Mid-Summer Friday (18 min rule)',
    sunsetMins: 7 * 60 + 42, // 7:42 PM
    subtractMins: 18,
    hint: '42 − 10 = 32, then 32 − 8 = 24 → 7:24 PM!',
  },
];

function formatPmTime(minsAfterNoon: number): string {
  const safe = Math.max(60, Math.min(11 * 60 + 59, minsAfterNoon));
  const hrs = Math.floor(safe / 60);
  const mins = safe % 60;
  return `${hrs}:${String(mins).padStart(2, '0')} PM`;
}

export function ShabbatClockGame({
  onBack,
  onCompleteRound,
}: ShabbatClockGameProps) {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [roundIdx, setRoundIdx] = useState(0);
  const [selectedMins, setSelectedMins] = useState(BEGINNER_FRIDAYS[0].sunsetMins);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);
  const nextTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (nextTimerRef.current !== null) {
        window.clearTimeout(nextTimerRef.current);
      }
    };
  }, []);

  const rounds = difficulty === 'beginner' ? BEGINNER_FRIDAYS : EXPLORER_FRIDAYS;
  const current = rounds[roundIdx];
  const targetMins = current.sunsetMins - current.subtractMins;

  // Analog clock angles
  const hours = Math.floor(selectedMins / 60);
  const minutes = selectedMins % 60;
  const minuteAngle = minutes * 6;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;

  function startGame(level = difficulty) {
    if (nextTimerRef.current !== null) {
      window.clearTimeout(nextTimerRef.current);
      nextTimerRef.current = null;
    }
    const list = level === 'beginner' ? BEGINNER_FRIDAYS : EXPLORER_FRIDAYS;
    playTap();
    setDifficulty(level);
    setRoundIdx(0);
    setSelectedMins(list[0].sunsetMins);
    setShowHint(false);
    setFeedback('idle');
    setScore(0);
    setGameState('PLAYING');
  }

  function nudgeTime(delta: number) {
    if (feedback === 'correct') return;
    playTap();
    setFeedback('idle');
    setSelectedMins((prev) =>
      Math.max(3 * 60, Math.min(9 * 60 + 30, prev + delta))
    );
  }

  function checkTime() {
    if (feedback === 'correct') return;
    if (selectedMins === targetMins) {
      playSuccess();
      setFeedback('correct');
      const nextScore = score + 15;
      setScore(nextScore);

      nextTimerRef.current = window.setTimeout(() => {
        if (roundIdx + 1 >= rounds.length) {
          playFanfare();
          setGameState('ROUND_SUMMARY');
          onCompleteRound(nextScore);
        } else {
          const nextIdx = roundIdx + 1;
          setRoundIdx(nextIdx);
          setSelectedMins(rounds[nextIdx].sunsetMins);
          setShowHint(false);
          setFeedback('idle');
        }
      }, 1150);
    } else {
      playTryAgain();
      setFeedback('wrong');
    }
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
              Friday {roundIdx + 1}/{rounds.length}
            </span>
            <span className="text-blue-700">Score: {score}</span>
          </div>
        )}
      </div>

      {/* TITLE MENU */}
      {gameState === 'TITLE_MENU' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-10 max-w-2xl mx-auto text-center space-y-6">
          <p className="text-xs font-medium text-slate-500">
            Shulchan Aruch Math Game · Orach Chaim 263:4 · Clock Subtraction
          </p>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">
              Shabbat Candle-Lighting Clock
            </h2>
            <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
              In Orach Chaim 263:4, we welcome Shabbat early by lighting candles before Friday sunset (traditionally <strong>18 minutes</strong> before!). Wind the clock backward to light the Shabbat candles right on time.
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
                Beginner (−10 or −15 min)
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
                Explorer (−18 min Custom)
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
          {/* Left Stage: Live Analog Clock + Shabbat Candlesticks SVG */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">
                  Orach Chaim 263:4 · {current.seasonLabel}
                </p>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5 leading-snug">
                  Friday sunset is{' '}
                  <span className="font-mono text-blue-700 tabular-nums">
                    {formatPmTime(current.sunsetMins)}
                  </span>
                  . Set the clock{' '}
                  <span className="font-mono text-amber-700 tabular-nums">
                    {current.subtractMins} minutes earlier
                  </span>
                  !
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
                <strong>Clock Trick:</strong> {current.hint}
              </div>
            )}

            {/* Analog Clock + Two Brass Shabbat Candlesticks */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-around gap-6">
              {/* Interactive SVG Analog Clock */}
              <svg
                viewBox="0 0 210 210"
                className="w-48 h-48 shrink-0"
                role="img"
                aria-label={`Analog clock set to ${formatPmTime(selectedMins)}`}
              >
                <circle
                  cx="105"
                  cy="105"
                  r="94"
                  fill="#FFFFFF"
                  stroke={feedback === 'correct' ? '#047857' : '#334155'}
                  strokeWidth="4"
                />
                {/* 12 Hour Numbers & Ticks */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const num = i === 0 ? 12 : i;
                  const angleRad = ((i * 30 - 90) * Math.PI) / 180;
                  const tx = 105 + Math.cos(angleRad) * 72;
                  const ty = 105 + Math.sin(angleRad) * 72 + 4;
                  const x1 = 105 + Math.cos(angleRad) * 84;
                  const y1 = 105 + Math.sin(angleRad) * 84;
                  const x2 = 105 + Math.cos(angleRad) * 90;
                  const y2 = 105 + Math.sin(angleRad) * 90;
                  return (
                    <g key={num}>
                      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#94A3B8" strokeWidth="2" />
                      <text
                        x={tx}
                        y={ty}
                        textAnchor="middle"
                        fontSize="12"
                        fontFamily="IBM Plex Mono, monospace"
                        fontWeight="700"
                        fill="#334155"
                      >
                        {num}
                      </text>
                    </g>
                  );
                })}

                {/* Hour Hand */}
                <line
                  x1="105"
                  y1="105"
                  x2="105"
                  y2="56"
                  stroke="#0F172A"
                  strokeWidth="5"
                  strokeLinecap="round"
                  transform={`rotate(${hourAngle}, 105, 105)`}
                  style={{ transition: 'transform 180ms ease-out' }}
                />

                {/* Minute Hand */}
                <line
                  x1="105"
                  y1="105"
                  x2="105"
                  y2="34"
                  stroke="#1D4ED8"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${minuteAngle}, 105, 105)`}
                  style={{ transition: 'transform 180ms ease-out' }}
                />

                {/* Center pin */}
                <circle cx="105" cy="105" r="5" fill="#D97706" />
              </svg>

              {/* Two Shabbat Candlesticks + Digital Readout */}
              <div className="flex flex-col items-center space-y-4">
                <svg
                  viewBox="0 0 150 130"
                  className="w-36 h-32"
                  aria-hidden="true"
                >
                  {[46, 104].map((x) => (
                    <g key={x}>
                      {/* Flame glows when correct! */}
                      {feedback === 'correct' && (
                        <>
                          <ellipse cx={x} cy="24" rx="11" ry="15" fill="#FEF3C7" />
                          <ellipse cx={x} cy="25" rx="6" ry="10" fill="#F59E0B" />
                          <ellipse cx={x} cy="28" rx="3" ry="5" fill="#FFFFFF" />
                        </>
                      )}
                      {/* Wick */}
                      <line x1={x} y1="36" x2={x} y2="42" stroke="#1E293B" strokeWidth="1.5" />
                      {/* White Shabbat candle */}
                      <rect x={x - 7} y="42" width="14" height="44" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                      {/* Brass candlestick */}
                      <rect x={x - 11} y="86" width="22" height="6" rx="2" fill="#D97706" />
                      <rect x={x - 4} y="92" width="8" height="22" fill="#B45309" />
                      <path d={`M ${x - 16} 122 Q ${x} 108 ${x + 16} 122 Z`} fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
                    </g>
                  ))}
                </svg>

                <div className="text-center">
                  <p className="text-[11px] font-medium text-slate-500">
                    Your Candle-Lighting Clock
                  </p>
                  <p
                    className={`font-mono text-3xl font-bold tabular-nums mt-0.5 ${
                      feedback === 'correct'
                        ? 'text-emerald-700'
                        : feedback === 'wrong'
                        ? 'text-rose-700'
                        : 'text-blue-700'
                    }`}
                  >
                    {formatPmTime(selectedMins)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Time Stepper Controls & Light Button */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 font-mono text-xs text-slate-700 tabular-nums space-y-1">
              <div className="flex items-center justify-between">
                <span>Friday Sunset:</span>
                <strong className="text-slate-900">
                  {formatPmTime(current.sunsetMins)}
                </strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Subtract Before Sunset:</span>
                <strong className="text-amber-700">
                  − {current.subtractMins} min
                </strong>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2">
                Wind the Clock Backward (or Forward)
              </p>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {([-10, -5, -1] as const).map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => nudgeTime(delta)}
                    disabled={feedback === 'correct'}
                    className="h-12 rounded-lg border-2 border-slate-200 bg-slate-50 hover:border-blue-600 hover:bg-blue-50 font-mono text-sm font-bold text-slate-900 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {delta} min
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {([1, 5] as const).map((delta) => (
                  <button
                    key={delta}
                    type="button"
                    onClick={() => nudgeTime(delta)}
                    disabled={feedback === 'correct'}
                    className="h-11 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 font-mono text-xs font-semibold text-slate-700 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    +{delta} min
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={checkTime}
              disabled={feedback === 'correct'}
              className="w-full py-3 px-5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-60"
            >
              <Flame className="w-4 h-4 text-amber-300" aria-hidden="true" />
              <span>Light Shabbat Candles</span>
            </button>

            {feedback === 'correct' && (
              <div
                role="status"
                className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Shabbat Shalom!</p>
                  <p className="text-xs mt-0.5 font-mono tabular-nums">
                    {formatPmTime(current.sunsetMins)} − {current.subtractMins}m ={' '}
                    {formatPmTime(targetMins)}
                  </p>
                </div>
              </div>
            )}

            {feedback === 'wrong' && (
              <div
                role="status"
                className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-950 text-sm flex items-start gap-2.5"
              >
                <XCircle className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="font-semibold">Not quite yet!</p>
                  <p className="text-xs mt-0.5">
                    {selectedMins > targetMins
                      ? 'Your clock is a little too late — wind it backward a bit more!'
                      : 'Your clock is a little too early — add a few minutes back!'}
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  playTap();
                  setSelectedMins(current.sunsetMins);
                  setFeedback('idle');
                }}
                className="px-3.5 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Reset to Sunset</span>
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
              All {rounds.length} Fridays Lit On Time!
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Shabbat Shalom Timekeeper!
            </h2>
            <p className="text-sm text-slate-600">
              You scored <strong className="font-mono text-slate-900">{score}</strong> points subtracting minutes on the analog and digital clocks (Orach Chaim 263:4).
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
