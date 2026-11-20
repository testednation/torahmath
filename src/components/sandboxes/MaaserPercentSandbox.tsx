import { useState } from 'react';
import { RotateCcw, Coins } from 'lucide-react';
import type { LessonDefinition } from '../../data/lessons';

interface SandboxProps {
  lesson: LessonDefinition;
}

export function MaaserPercentSandbox({ lesson }: SandboxProps) {
  const [earnings, setEarnings] = useState(100);
  const [percent, setPercent] = useState(10);
  const [activeStage, setActiveStage] = useState(0);

  const tzedakahAmount = Number(((earnings * percent) / 100).toFixed(2));
  const keepAmount = Number((earnings - tzedakahAmount).toFixed(2));
  const tenPercent = Number((earnings / 10).toFixed(2));

  const formatDollars = (val: number) =>
    Number.isInteger(val) ? `$${val}` : `$${val.toFixed(2)}`;

  const levelLabel =
    percent === 10
      ? 'Maaser (Standard 10%)'
      : percent === 20
      ? 'Chomesh (Generous 20%)'
      : `Custom Giving (${percent}%)`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Interactive Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Interactive 100-Square Percent Grid · Yoreh Deah 249:1
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
              {percent}% of {formatDollars(earnings)} ={' '}
              <span className="font-mono text-amber-700 tabular-nums">
                {formatDollars(tzedakahAmount)}
              </span>{' '}
              for Tzedakah
            </h3>
          </div>
          <span className="text-xs font-semibold text-blue-800">
            {levelLabel}
          </span>
        </div>

        {/* Visual Split: 10x10 Hundred-Grid + Brass Tzedakah Pushka */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-slate-50 border border-slate-200 rounded-xl p-5">
          {/* 10x10 Hundred Percent Grid */}
          <div className="md:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold">100 Equal Percent Squares</span>
              <span className="font-mono font-bold text-amber-700 tabular-nums">
                {percent} / 100 shaded
              </span>
            </div>

            <div
              className="grid grid-cols-10 gap-1"
              role="img"
              aria-label={`10 by 10 grid with ${percent} out of 100 squares shaded for Tzedakah`}
            >
              {Array.from({ length: 100 }).map((_, idx) => {
                // Fill column-by-column so 10% = 1 neat vertical column, 20% = 2 vertical columns!
                const col = idx % 10;
                const row = Math.floor(idx / 10);
                const colMajorIndex = col * 10 + row;
                const isShaded = colMajorIndex < percent;
                return (
                  <div
                    key={idx}
                    className={`aspect-square rounded-[3px] transition-colors ${
                      isShaded
                        ? 'bg-amber-500 border border-amber-600'
                        : 'bg-white border border-slate-200'
                    }`}
                  />
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono tabular-nums pt-1">
              <span>Each full column = 10% ({formatDollars(tenPercent)})</span>
              <span>Keep {100 - percent}%</span>
            </div>
          </div>

          {/* Brass & Blue Tzedakah Pushka SVG */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <svg
              viewBox="0 0 180 205"
              className="w-44 h-48"
              role="img"
              aria-label={`Tzedakah pushka receiving ${formatDollars(tzedakahAmount)} out of ${formatDollars(earnings)}`}
            >
              {/* Falling golden coins above slot */}
              <circle cx="90" cy="22" r="11" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
              <text
                x="90"
                y="26"
                textAnchor="middle"
                fontSize="10"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fill="#78350F"
              >
                $
              </text>
              <line x1="90" y1="36" x2="90" y2="52" stroke="#D97706" strokeWidth="2" strokeDasharray="3 2" />

              {/* Pushka top lid */}
              <rect x="34" y="54" width="112" height="16" rx="5" fill="#D97706" stroke="#92400E" strokeWidth="2" />
              {/* Coin slot */}
              <rect x="68" y="60" width="44" height="5" rx="2.5" fill="#1E293B" />

              {/* Pushka body */}
              <rect x="40" y="70" width="100" height="114" rx="8" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2.5" />
              {/* Brass bottom trim */}
              <rect x="36" y="174" width="108" height="14" rx="5" fill="#D97706" stroke="#92400E" strokeWidth="2" />

              {/* Hebrew label צדקה */}
              <text
                x="90"
                y="102"
                textAnchor="middle"
                fontSize="17"
                fontWeight="700"
                fill="#1E3A8A"
              >
                צדקה
              </text>
              <text
                x="90"
                y="120"
                textAnchor="middle"
                fontSize="10"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontWeight="600"
                fill="#475569"
              >
                TZEDAKAH BOX
              </text>

              {/* Amount display window */}
              <rect x="52" y="130" width="76" height="32" rx="6" fill="#FFFFFF" stroke="#93C5FD" strokeWidth="1.5" />
              <text
                x="90"
                y="151"
                textAnchor="middle"
                fontSize="15"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fill="#047857"
              >
                {formatDollars(tzedakahAmount)}
              </text>
            </svg>
          </div>
        </div>

        {/* Equation Readout Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-[11px] font-medium text-amber-800">
              Give ({percent}%)
            </p>
            <p className="font-mono text-xl font-bold text-amber-950 tabular-nums mt-0.5">
              {formatDollars(tzedakahAmount)}
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-[11px] font-medium text-emerald-800">
              Keep ({100 - percent}%)
            </p>
            <p className="font-mono text-xl font-bold text-emerald-950 tabular-nums mt-0.5">
              {formatDollars(keepAmount)}
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-medium text-slate-500">Total Earned</p>
            <p className="font-mono text-xl font-bold text-slate-900 tabular-nums mt-0.5">
              {formatDollars(earnings)}
            </p>
          </div>
        </div>
      </div>

      {/* Right Control & Concept Deck */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="space-y-6">
          {/* Guided Discovery */}
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
                    if (idx === 0) {
                      setEarnings(100);
                      setPercent(10);
                    } else if (idx === 1) {
                      setEarnings(80);
                      setPercent(10);
                    } else {
                      setEarnings(50);
                      setPercent(20);
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

          {/* Giving Level Presets & Sliders */}
          <div className="space-y-5 pt-5 border-t border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                <span>Shulchan Aruch Levels</span>
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPercent(10)}
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    percent === 10
                      ? 'border-blue-700 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Maaser (10%)
                </button>
                <button
                  type="button"
                  onClick={() => setPercent(20)}
                  className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    percent === 20
                      ? 'border-blue-700 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Chomesh (20%)
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="earnings-slider"
                  className="text-sm font-medium text-slate-800"
                >
                  Total Money Earned
                </label>
                <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                  {formatDollars(earnings)}
                </span>
              </div>
              <input
                id="earnings-slider"
                type="range"
                min={10}
                max={200}
                step={10}
                value={earnings}
                onChange={(e) => setEarnings(Number(e.target.value))}
                className="studio-slider"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400 mt-1 tabular-nums">
                <span>$10</span>
                <span>$50</span>
                <span>$100</span>
                <span>$150</span>
                <span>$200</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="percent-slider"
                  className="text-sm font-medium text-slate-800"
                >
                  Tzedakah Percentage
                </label>
                <span className="font-mono text-sm font-semibold text-amber-700 tabular-nums">
                  {percent}%
                </span>
              </div>
              <input
                id="percent-slider"
                type="range"
                min={10}
                max={20}
                step={1}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                className="studio-slider"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400 mt-1 tabular-nums">
                <span>10% Maaser</span>
                <span>15%</span>
                <span>20% Chomesh</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mental Math Shortcut & Reset */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 font-mono text-xs text-slate-700 tabular-nums space-y-1">
            <div>
              Drop-the-Zero (10%): {formatDollars(earnings)} ÷ 10 ={' '}
              <strong>{formatDollars(tenPercent)}</strong>
            </div>
            <div>
              Check: {formatDollars(tzedakahAmount)} + {formatDollars(keepAmount)}{' '}
              = <strong>{formatDollars(earnings)}</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEarnings(100);
              setPercent(10);
            }}
            className="w-full py-2 px-4 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset to $100 Maaser</span>
          </button>
        </div>
      </div>
    </div>
  );
}
