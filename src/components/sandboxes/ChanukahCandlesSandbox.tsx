import { useState, useRef, useEffect } from 'react';
import { Flame, RotateCcw, Play, Pause } from 'lucide-react';
import type { LessonDefinition } from '../../data/lessons';

interface SandboxProps {
  lesson: LessonDefinition;
}

export function ChanukahCandlesSandbox({ lesson }: SandboxProps) {
  const [night, setNight] = useState(5);
  const [school, setSchool] = useState<'hillel' | 'shammai'>('hillel');
  const [includeShamash, setIncludeShamash] = useState(true);
  const [showPairingTrick, setShowPairingTrick] = useState(false);
  const [activeStage, setActiveStage] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  // Compute candle count for each night 1..8
  const candlesForNight = (n: number) => (school === 'hillel' ? n : 9 - n);
  const tonightCandles = candlesForNight(night);
  const tonightTotal = tonightCandles + (includeShamash ? 1 : 0);

  // Cumulative sum through selected night
  const cumulativeNightCandles = Array.from({ length: night }, (_, i) =>
    candlesForNight(i + 1)
  ).reduce((a, b) => a + b, 0);
  const cumulativeShamash = includeShamash ? night : 0;
  const cumulativeTotal = cumulativeNightCandles + cumulativeShamash;

  const fullHolidayTotal = 36 + (includeShamash ? 8 : 0);

  function stopPlayback() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  }

  // Step through nights smoothly when Play is clicked
  function handlePlayToggle() {
    if (isPlaying) {
      stopPlayback();
      return;
    }
    setIsPlaying(true);
    let current = night === 8 ? 1 : night;
    setNight(current);
    timerRef.current = window.setInterval(() => {
      current += 1;
      if (current > 8) {
        stopPlayback();
      } else {
        setNight(current);
      }
    }, 750);
  }

  function handleReset() {
    stopPlayback();
    setNight(1);
    setSchool('hillel');
    setIncludeShamash(true);
    setShowPairingTrick(false);
  }

  // Pair colors for Gauss's trick: (1,8), (2,7), (3,6), (4,5)
  const pairColor = (n: number) => {
    const idx = Math.min(n, 9 - n);
    if (idx === 1) return '#1D4ED8';
    if (idx === 2) return '#047857';
    if (idx === 3) return '#B45309';
    return '#7C3AED';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Interactive Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Interactive Chanukiah · {school === 'hillel' ? 'Beit Hillel (Add 1 each night)' : 'Beit Shammai (Subtract 1 each night)'}
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
              Night {night}: {tonightCandles} {tonightCandles === 1 ? 'Candle' : 'Candles'}
              {includeShamash ? ' + 1 Shamash' : ''}
            </h3>
          </div>
          <div className="font-mono text-sm font-semibold text-blue-800 tabular-nums">
            Tonight = {tonightTotal} · Running Total = {cumulativeTotal}
          </div>
        </div>

        {/* SVG Interactive Chanukiah */}
        <div className="bg-slate-950 rounded-xl p-4 sm:p-6 overflow-hidden">
          <svg
            viewBox="0 0 560 225"
            className="w-full h-auto"
            role="img"
            aria-label={`Chanukiah on Night ${night} with ${tonightCandles} lit candles`}
          >
            {/* Subtle warm glow behind lit candles */}
            <defs>
              <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Menorah base and stem */}
            <rect x="268" y="150" width="24" height="50" rx="3" fill="#B45309" />
            <path d="M220 200 L340 200 L328 214 L232 214 Z" fill="#D97706" />
            <rect x="78" y="142" width="404" height="10" rx="5" fill="#D97706" />

            {/* 8 regular branches (4 left, 4 right) + center Shamash */}
            {[
              { branchIndex: 8, x: 96, isShamash: false },
              { branchIndex: 7, x: 142, isShamash: false },
              { branchIndex: 6, x: 188, isShamash: false },
              { branchIndex: 5, x: 234, isShamash: false },
              { branchIndex: 0, x: 280, isShamash: true },
              { branchIndex: 4, x: 326, isShamash: false },
              { branchIndex: 3, x: 372, isShamash: false },
              { branchIndex: 2, x: 418, isShamash: false },
              { branchIndex: 1, x: 464, isShamash: false },
            ].map((slot) => {
              const isLit = slot.isShamash
                ? includeShamash
                : slot.branchIndex <= tonightCandles;
              const candleTop = slot.isShamash ? 54 : 74;
              const candleHeight = slot.isShamash ? 78 : 68;
              const cupY = slot.isShamash ? 132 : 142;

              return (
                <g
                  key={slot.x}
                  onClick={() => {
                    if (slot.isShamash) {
                      setIncludeShamash((v) => !v);
                    } else {
                      const targetNight =
                        school === 'hillel'
                          ? slot.branchIndex
                          : 9 - slot.branchIndex;
                      setNight(targetNight);
                    }
                  }}
                  className="cursor-pointer"
                >
                  {/* Brass cup */}
                  <rect
                    x={slot.x - 10}
                    y={cupY - 6}
                    width="20"
                    height="8"
                    rx="2"
                    fill="#F59E0B"
                  />
                  {slot.isShamash && (
                    <rect
                      x={slot.x - 5}
                      y={132}
                      width="10"
                      height="18"
                      fill="#B45309"
                    />
                  )}

                  {/* Candle wax */}
                  <rect
                    x={slot.x - 7}
                    y={candleTop}
                    width="14"
                    height={candleHeight}
                    rx="2"
                    fill={
                      isLit
                        ? slot.isShamash
                          ? '#FEF3C7'
                          : '#EFF6FF'
                        : '#334155'
                    }
                    opacity={isLit ? 1 : 0.45}
                  />

                  {/* Flame & glow */}
                  {isLit && (
                    <g>
                      <circle
                        cx={slot.x}
                        cy={candleTop - 16}
                        r="24"
                        fill="url(#flameGlow)"
                      />
                      <path
                        d={`M ${slot.x} ${candleTop - 28} C ${slot.x + 8} ${candleTop - 16}, ${slot.x + 7} ${candleTop - 4}, ${slot.x} ${candleTop - 4} C ${slot.x - 7} ${candleTop - 4}, ${slot.x - 8} ${candleTop - 16}, ${slot.x} ${candleTop - 28} Z`}
                        fill="#F59E0B"
                      />
                      <path
                        d={`M ${slot.x} ${candleTop - 18} C ${slot.x + 4} ${candleTop - 11}, ${slot.x + 3} ${candleTop - 5}, ${slot.x} ${candleTop - 5} C ${slot.x - 3} ${candleTop - 5}, ${slot.x - 4} ${candleTop - 11}, ${slot.x} ${candleTop - 18} Z`}
                        fill="#FEF08A"
                      />
                    </g>
                  )}

                  {/* Label under branch */}
                  <text
                    x={slot.x}
                    y="174"
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="IBM Plex Mono, monospace"
                    fill={isLit ? '#F8FAFC' : '#64748B'}
                  >
                    {slot.isShamash ? 'S' : slot.branchIndex}
                  </text>
                </g>
              );
            })}

            <text
              x="280"
              y="26"
              textAnchor="middle"
              fontSize="12"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fill="#CBD5E1"
            >
              Click any candle to jump to that night · S = Shamash (helper candle)
            </text>
          </svg>
        </div>

        {/* Staircase Visual Pattern Across All 8 Nights */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span className="text-sm font-semibold text-slate-800">
              8-Night Candle Staircase (Click any column)
            </span>
            <button
              type="button"
              onClick={() => setShowPairingTrick((v) => !v)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                showPairingTrick
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {showPairingTrick ? 'Hide Pair-of-9 Trick' : 'Show Pair-of-9 Trick'}
            </button>
          </div>

          <div className="grid grid-cols-8 gap-2 items-end h-32 pt-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => {
              const count = candlesForNight(n);
              const isPastOrCurrent = n <= night;
              const isSelected = n === night;
              const barColor = showPairingTrick
                ? pairColor(n)
                : isSelected
                ? '#1D4ED8'
                : isPastOrCurrent
                ? '#3B82F6'
                : '#CBD5E1';

              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNight(n)}
                  className="flex flex-col items-center gap-1 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                >
                  <span className="font-mono text-xs font-semibold text-slate-700 tabular-nums">
                    {count}
                  </span>
                  <div className="w-full flex flex-col-reverse gap-0.5 items-center">
                    {Array.from({ length: count }).map((_, blockIdx) => (
                      <div
                        key={blockIdx}
                        style={{ backgroundColor: barColor }}
                        className="w-full h-2 rounded-xs transition-colors"
                      />
                    ))}
                  </div>
                  <span
                    className={`font-mono text-xs tabular-nums ${
                      isSelected
                        ? 'font-bold text-blue-700'
                        : 'text-slate-500'
                    }`}
                  >
                    N{n}
                  </span>
                </button>
              );
            })}
          </div>

          {showPairingTrick && (
            <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-700 font-mono tabular-nums flex flex-wrap gap-x-4 gap-y-1">
              <span className="text-blue-700 font-semibold">N1+N8 = 1+8 = 9</span>
              <span className="text-emerald-700 font-semibold">N2+N7 = 2+7 = 9</span>
              <span className="text-amber-700 font-semibold">N3+N6 = 3+6 = 9</span>
              <span className="text-violet-700 font-semibold">N4+N5 = 4+5 = 9</span>
              <span className="text-slate-900 font-semibold">→ 4 × 9 = 36 candles!</span>
            </div>
          )}
        </div>
      </div>

      {/* Right Control & Concept Deck */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="space-y-6">
          {/* Guided Stages */}
          <div>
            <p className="text-xs font-medium text-slate-500 mb-2">
              Guided Discovery
            </p>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg mb-3">
              {lesson.stages.map((st, idx) => (
                <button
                  key={st.step}
                  type="button"
                  onClick={() => {
                    setActiveStage(idx);
                    if (idx === 1) setSchool('shammai');
                    if (idx === 2) {
                      setSchool('hillel');
                      setNight(8);
                      setShowPairingTrick(true);
                    }
                  }}
                  className={`flex-1 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    activeStage === idx
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Step {st.step}
                </button>
              ))}
            </div>
            <h4 className="text-base font-semibold text-slate-900 mb-1">
              {lesson.stages[activeStage].title}
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed mb-2">
              {lesson.stages[activeStage].prompt}
            </p>
            <p className="text-sm font-medium text-blue-900 bg-blue-50 border border-blue-100 rounded-lg px-3.5 py-2.5">
              Key Idea: {lesson.stages[activeStage].takeaway}
            </p>
          </div>

          {/* Interactive Controls */}
          <div className="space-y-5 pt-5 border-t border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="chanukah-night-slider"
                  className="text-sm font-medium text-slate-800"
                >
                  Night of Chanukah
                </label>
                <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                  Night {night} of 8
                </span>
              </div>
              <input
                id="chanukah-night-slider"
                type="range"
                min={1}
                max={8}
                step={1}
                value={night}
                onChange={(e) => setNight(Number(e.target.value))}
                className="studio-slider"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400 mt-1 tabular-nums">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <span key={n}>{n}</span>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-sm font-medium text-slate-800 mb-2">
                Talmudic Counting Method
              </span>
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setSchool('hillel')}
                  className={`py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    school === 'hillel'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Beit Hillel (1 → 8)
                </button>
                <button
                  type="button"
                  onClick={() => setSchool('shammai')}
                  className={`py-2 px-3 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    school === 'shammai'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Beit Shammai (8 → 1)
                </button>
              </div>
            </div>

            <label className="flex items-center justify-between gap-3 py-2 cursor-pointer">
              <span className="text-sm font-medium text-slate-800 flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600" aria-hidden="true" />
                Include Shamash (+1 per night)
              </span>
              <input
                type="checkbox"
                checked={includeShamash}
                onChange={(e) => setIncludeShamash(e.target.checked)}
                className="w-5 h-5 accent-blue-700 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Live Equation Readout & Playback */}
        <div className="pt-5 border-t border-slate-200 space-y-4">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Running Sum (Nights 1–{night})</span>
              <span className="font-mono font-semibold text-slate-900 tabular-nums">
                {cumulativeTotal} candles
              </span>
            </div>
            <div className="font-mono text-xs text-slate-700 break-words tabular-nums">
              {Array.from({ length: night }, (_, i) => candlesForNight(i + 1)).join(' + ')}
              {includeShamash ? ` + ${night} (Shamash)` : ''} ={' '}
              <strong className="text-blue-700">{cumulativeTotal}</strong>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>All 8 Nights Complete Box</span>
              <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                {fullHolidayTotal} candles
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePlayToggle}
              className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" aria-hidden="true" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" aria-hidden="true" />
                  <span>Animate 8 Nights</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="py-2.5 px-4 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
