import { useState } from 'react';
import { Compass, RotateCcw } from 'lucide-react';
import type { LessonDefinition } from '../../data/lessons';

interface SandboxProps {
  lesson: LessonDefinition;
}

export function PiGemaraSandbox({ lesson }: SandboxProps) {
  const [mode, setMode] = useState<'square-circle' | 'compare-pi'>('square-circle');
  const [radius, setRadius] = useState(4); // 1..10 amot
  const [highlightCorners, setHighlightCorners] = useState(true);
  const [activeStage, setActiveStage] = useState(0);

  const diameter = radius * 2;
  const squareArea = diameter * diameter; // 4 * r^2
  const rSquared = radius * radius;
  const gemaraArea = 3 * rSquared; // Eruvin 76b: square minus 1/4 = 3 * r^2
  const rambamArea = (22 / 7) * rSquared; // Rambam / Tosafot: 3 1/7 * r^2
  const exactArea = Math.PI * rSquared;

  const gemaraCirc = 3 * diameter;
  const rambamCirc = (22 / 7) * diameter;
  const exactCirc = Math.PI * diameter;

  // SVG sizing for inscribed circle inside 2r × 2r square
  const boxSize = 152;
  const boxX = 68;
  const boxY = 38;
  const cx = boxX + boxSize / 2;
  const cy = boxY + boxSize / 2;
  const rPx = boxSize / 2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Interactive Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {mode === 'square-circle'
                ? 'Gemara Eruvin 76b · Square Minus 1/4 = Circle Area (3 × r²)'
                : 'Rambam (Eruvin 1:5) & Tosafot · Comparing 3 vs 22/7 vs Exact π'}
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
              Radius r = {radius} amot · Diameter d = {diameter} amot
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('square-circle')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'square-circle'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Square vs. Circle
            </button>
            <button
              type="button"
              onClick={() => setMode('compare-pi')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'compare-pi'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              3 vs 22/7 vs π
            </button>
          </div>
        </div>

        {/* Interactive Diagram */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-hidden">
          {mode === 'square-circle' ? (
            <svg
              viewBox="0 0 560 232"
              className="w-full h-auto"
              role="img"
              aria-label={`Circle of radius ${radius} inside a ${diameter} by ${diameter} square showing the 4 corner scraps equal roughly 1/4 of the square`}
            >
              {/* Outer 2r x 2r square (4 quadrants of r^2) */}
              <rect
                x={boxX}
                y={boxY}
                width={boxSize}
                height={boxSize}
                fill={highlightCorners ? '#FEF3C7' : '#FFFFFF'}
                stroke="#334155"
                strokeWidth="2.5"
              />

              {/* Inscribed Circle */}
              <circle
                cx={cx}
                cy={cy}
                r={rPx}
                fill="#DBEAFE"
                stroke="#1D4ED8"
                strokeWidth="2.8"
              />

              {/* 4 Quadrant Crosshairs (each quadrant = r × r = r²) */}
              <line
                x1={cx}
                y1={boxY}
                x2={cx}
                y2={boxY + boxSize}
                stroke="#64748B"
                strokeWidth="1.4"
                strokeDasharray="4 3"
              />
              <line
                x1={boxX}
                y1={cy}
                x2={boxX + boxSize}
                y2={cy}
                stroke="#64748B"
                strokeWidth="1.4"
                strokeDasharray="4 3"
              />

              {/* Radius Highlight Line */}
              <line
                x1={cx}
                y1={cy}
                x2={cx + rPx}
                y2={cy}
                stroke="#B45309"
                strokeWidth="3"
              />
              <circle cx={cx} cy={cy} r="4.5" fill="#B45309" />
              <text
                x={cx + rPx / 2}
                y={cy - 8}
                textAnchor="middle"
                fontSize="11.5"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fill="#92400E"
              >
                r = {radius}
              </text>

              {/* Top Diameter Label */}
              <text
                x={cx}
                y={boxY - 12}
                textAnchor="middle"
                fontSize="11.5"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="600"
                fill="#334155"
              >
                Square Side = d = {diameter}
              </text>

              {/* Quadrant r² labels */}
              <text
                x={cx - rPx / 2}
                y={cy - rPx / 2 + 4}
                textAnchor="middle"
                fontSize="10.5"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="600"
                fill="#1E3A8A"
              >
                r²={rSquared}
              </text>
              <text
                x={cx - rPx / 2}
                y={cy + rPx / 2 + 4}
                textAnchor="middle"
                fontSize="10.5"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="600"
                fill="#1E3A8A"
              >
                r²={rSquared}
              </text>
              <text
                x={cx + rPx / 2}
                y={cy + rPx / 2 + 4}
                textAnchor="middle"
                fontSize="10.5"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="600"
                fill="#1E3A8A"
              >
                r²={rSquared}
              </text>

              {/* Right Explanation Column */}
              <g transform="translate(262, 34)">
                <text
                  x="0"
                  y="14"
                  fontSize="13"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="700"
                  fill="#0F172A"
                >
                  Eruvin 76b: “Square beats Circle by 1/4”
                </text>

                <text
                  x="0"
                  y="44"
                  fontSize="11.5"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fill="#334155"
                >
                  1. Full Square = 4 quadrants of r²:
                </text>
                <text
                  x="14"
                  y="64"
                  fontSize="12"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="700"
                  fill="#0F172A"
                >
                  {diameter} × {diameter} = {squareArea} sq. amot (4 × {rSquared})
                </text>

                <text
                  x="0"
                  y="94"
                  fontSize="11.5"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fill="#92400E"
                >
                  2. Remove 4 yellow corners (≈ 1/4 = {rSquared}):
                </text>
                <text
                  x="14"
                  y="114"
                  fontSize="12"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="700"
                  fill="#B45309"
                >
                  {squareArea} − {rSquared} = {gemaraArea} sq. amot (3 × r²)
                </text>

                <text
                  x="0"
                  y="144"
                  fontSize="11.5"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fill="#1D4ED8"
                >
                  3. Exact Pi Area (π × r²):
                </text>
                <text
                  x="14"
                  y="164"
                  fontSize="12"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="700"
                  fill="#1D4ED8"
                >
                  3.1416 × {rSquared} = {exactArea.toFixed(2)} sq. amot
                </text>
              </g>
            </svg>
          ) : (
            <div className="space-y-4 p-2">
              <p className="text-xs font-semibold text-slate-700">
                Compare All Three Values of π for Radius r = {radius} (Diameter d = {diameter}):
              </p>

              {[
                {
                  name: 'Gemara Quick Rule (Eruvin 14a)',
                  piLabel: 'π ≈ 3',
                  circ: gemaraCirc.toFixed(2),
                  area: gemaraArea.toFixed(2),
                  widthPct: (3 / 3.2) * 100,
                  barColor: 'bg-amber-500',
                  textColor: 'text-amber-900',
                },
                {
                  name: 'Rambam & Tosafot Fraction',
                  piLabel: 'π ≈ 3 1/7 (22/7 ≈ 3.1429)',
                  circ: rambamCirc.toFixed(2),
                  area: rambamArea.toFixed(2),
                  widthPct: ((22 / 7) / 3.2) * 100,
                  barColor: 'bg-emerald-600',
                  textColor: 'text-emerald-900',
                },
                {
                  name: 'Exact Mathematical Pi',
                  piLabel: 'π ≈ 3.14159…',
                  circ: exactCirc.toFixed(2),
                  area: exactArea.toFixed(2),
                  widthPct: (Math.PI / 3.2) * 100,
                  barColor: 'bg-blue-700',
                  textColor: 'text-blue-900',
                },
              ].map((row) => (
                <div
                  key={row.name}
                  className="bg-white border border-slate-200 rounded-lg p-3.5 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className={`font-bold ${row.textColor}`}>
                      {row.name}
                    </span>
                    <span className="font-mono font-semibold text-slate-600 tabular-nums">
                      {row.piLabel}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.barColor}`}
                      style={{ width: `${row.widthPct}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono tabular-nums text-slate-700">
                    <span>Circumference: {row.circ}</span>
                    <span>Area: {row.area} sq. amot</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3 Live Metric Readouts */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-xs text-amber-900 mb-1">Gemara Area (3 × r²)</p>
            <p className="font-mono text-lg font-bold text-amber-900 tabular-nums">
              {gemaraArea} sq. amot
            </p>
            <p className="text-xs font-mono text-amber-800 mt-0.5 tabular-nums">
              3 × {radius}² = 3 × {rSquared}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-xs text-emerald-900 mb-1">Rambam Area (22/7 × r²)</p>
            <p className="font-mono text-lg font-bold text-emerald-800 tabular-nums">
              {Number.isInteger(rambamArea)
                ? rambamArea
                : rambamArea.toFixed(2)}{' '}
              sq. amot
            </p>
            <p className="text-xs font-mono text-emerald-800 mt-0.5 tabular-nums">
              {radius === 7 ? 'Exact 22 × 7 = 154!' : `(22/7) × ${rSquared}`}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-900 mb-1">Exact Pi Area (π × r²)</p>
            <p className="font-mono text-lg font-bold text-blue-800 tabular-nums">
              {exactArea.toFixed(2)} sq. amot
            </p>
            <p className="text-xs font-mono text-blue-800 mt-0.5 tabular-nums">
              3.1416 × {rSquared}
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
                      setMode('square-circle');
                      setRadius(4);
                      setHighlightCorners(true);
                    } else if (idx === 1) {
                      setMode('compare-pi');
                      setRadius(7);
                    } else if (idx === 2) {
                      setMode('square-circle');
                      setRadius(5);
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

          {/* Interactive Sliders & Gemara Presets */}
          <div className="space-y-5 pt-5 border-t border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="pi-radius-slider"
                  className="text-sm font-medium text-slate-800"
                >
                  Circle Radius (r)
                </label>
                <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                  r = {radius} (d = {diameter})
                </span>
              </div>
              <input
                id="pi-radius-slider"
                type="range"
                min={1}
                max={10}
                step={1}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="studio-slider"
              />
            </div>

            {mode === 'square-circle' && (
              <label className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={highlightCorners}
                  onChange={(e) => setHighlightCorners(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-blue-600 cursor-pointer"
                />
                <span>Highlight the 1/4 square corner scraps</span>
              </label>
            )}

            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-500">
                Classic Gemara Examples
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRadius(7);
                    setMode('compare-pi');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Radius 7 (22/7 Magic!)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRadius(5);
                    setMode('square-circle');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  King Solomon’s Sea (r = 5)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRadius(4);
                    setMode('square-circle');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                >
                  Eruvin Courtyard (r = 4)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Compass className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
            <span>Rambam notes π cannot be written as an exact fraction!</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setMode('square-circle');
              setRadius(4);
              setHighlightCorners(true);
              setActiveStage(0);
            }}
            className="px-3 py-2 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
