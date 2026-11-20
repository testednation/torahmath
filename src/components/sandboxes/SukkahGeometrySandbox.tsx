import { useState } from 'react';
import { Compass, RotateCcw } from 'lucide-react';
import type { LessonDefinition } from '../../data/lessons';

interface SandboxProps {
  lesson: LessonDefinition;
}

export function SukkahGeometrySandbox({ lesson }: SandboxProps) {
  const [mode, setMode] = useState<'circle' | 'sukkah'>('circle');
  const [diameter, setDiameter] = useState(10); // tefachim (10 matches King Solomon's copper sea)
  const [unrollPct, setUnrollPct] = useState(100); // 0..100%
  const [squareSide, setSquareSide] = useState(7); // 7 tefachim minimum kosher sukkah
  const [activeStage, setActiveStage] = useState(0);

  // Circle calculations
  const gemaraCircumference = diameter * 3;
  const exactCircumference = diameter * Math.PI;
  const difference = exactCircumference - gemaraCircumference;

  // Sukkah (inscribed square) calculations
  const gemaraDiagonal = squareSide * 1.4; // Sukkah 8a: 1 and 2/5
  const exactDiagonal = squareSide * Math.SQRT2;
  const sukkahCircleCircumferenceGemara = Math.ceil(gemaraDiagonal) * 3;

  // SVG Unroller geometry (diameter unit scaled nicely to 110px per diameter)
  const unitPx = 112;
  const radiusPx = unitPx / 2;
  const startX = 56;
  const groundY = 175;
  const rolledDistance = (unrollPct / 100) * Math.PI * unitPx;
  const circleCenterX = startX + rolledDistance;
  const circleCenterY = groundY - radiusPx;
  const rotationDeg = (unrollPct / 100) * 360;

  // Sukkah SVG geometry
  const sukkahRadiusPx = 46 + ((squareSide - 4) / 8) * 34; // 46..80
  const inscribedSidePx = sukkahRadiusPx * Math.SQRT2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Interactive Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {mode === 'circle'
                ? 'Circle Unroller · Gemara Eruvin 14a (π ≈ 3 vs 3.14)'
                : 'Round Sukkah Fit · Gemara Sukkah 7b–8a (Diagonal ≈ 1.4 × Side)'}
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
              {mode === 'circle'
                ? `Diameter = ${diameter} tefachim`
                : `${squareSide} × ${squareSide} Square Inside a Round Sukkah`}
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('circle')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'circle'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Circle Unroller
            </button>
            <button
              type="button"
              onClick={() => setMode('sukkah')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'sukkah'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Round Sukkah
            </button>
          </div>
        </div>

        {/* Interactive Geometry SVG */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-hidden">
          {mode === 'circle' ? (
            <svg
              viewBox="0 0 560 235"
              className="w-full h-auto"
              role="img"
              aria-label={`Circle with diameter ${diameter} unrolled ${unrollPct} percent along a ruler`}
            >
              {/* Ruler Baseline */}
              <line x1={startX} y1={groundY} x2={520} y2={groundY} stroke="#94A3B8" strokeWidth="2" />

              {/* Diameter unit segments along ruler (1d, 2d, 3d, exact πd) */}
              {[0, 1, 2, 3].map((step) => {
                const tx = startX + step * unitPx;
                return (
                  <g key={step}>
                    <line
                      x1={tx}
                      y1={groundY - 7}
                      x2={tx}
                      y2={groundY + 10}
                      stroke={step === 3 ? '#B45309' : '#475569'}
                      strokeWidth={step === 3 ? 2.5 : 1.5}
                    />
                    <text
                      x={tx}
                      y={groundY + 26}
                      textAnchor="middle"
                      fontSize="11.5"
                      fontFamily="IBM Plex Mono, monospace"
                      fontWeight={step === 3 ? '700' : '500'}
                      fill={step === 3 ? '#B45309' : '#475569'}
                    >
                      {step === 0 ? '0' : `${step}×d (${step * diameter})`}
                    </text>
                  </g>
                );
              })}

              {/* Exact Pi marker */}
              <g>
                <line
                  x1={startX + Math.PI * unitPx}
                  y1={groundY - 12}
                  x2={startX + Math.PI * unitPx}
                  y2={groundY + 42}
                  stroke="#1D4ED8"
                  strokeWidth="2"
                  strokeDasharray="3 2"
                />
                <text
                  x={startX + Math.PI * unitPx + 6}
                  y={groundY + 44}
                  fontSize="11"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="600"
                  fill="#1D4ED8"
                >
                  Exact π×d = {exactCircumference.toFixed(2)}
                </text>
              </g>

              {/* Unrolled colored ribbon along the ruler */}
              <line
                x1={startX}
                y1={groundY}
                x2={circleCenterX}
                y2={groundY}
                stroke="#1D4ED8"
                strokeWidth="5"
                strokeLinecap="round"
              />

              {/* Rolling Circle */}
              <g transform={`translate(${circleCenterX}, ${circleCenterY})`}>
                <circle
                  cx={0}
                  cy={0}
                  r={radiusPx}
                  fill="#EFF6FF"
                  stroke="#1D4ED8"
                  strokeWidth="3"
                />
                {/* Rotating spokes & starting point dot */}
                <g transform={`rotate(${rotationDeg})`}>
                  <line
                    x1={-radiusPx}
                    y1={0}
                    x2={radiusPx}
                    y2={0}
                    stroke="#93C5FD"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={radiusPx}
                    stroke="#1D4ED8"
                    strokeWidth="2"
                  />
                  <circle cx={0} cy={radiusPx} r="5" fill="#BE123C" />
                </g>
                <text
                  x={0}
                  y={-6}
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="600"
                  fill="#1E3A8A"
                >
                  d = {diameter}
                </text>
              </g>

              {/* Gemara 3×d bracket above ruler */}
              <text
                x={startX + 1.5 * unitPx}
                y={30}
                textAnchor="middle"
                fontSize="12"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fontWeight="600"
                fill="#334155"
              >
                Watch the red dot roll 1 full turn around the circle ({unrollPct}%)
              </text>
            </svg>
          ) : (
            <svg
              viewBox="0 0 560 235"
              className="w-full h-auto"
              role="img"
              aria-label={`Square of ${squareSide} by ${squareSide} tefachim inscribed inside a circular Sukkah`}
            >
              {/* Subtle grid */}
              <defs>
                <pattern id="sukkahGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="560" height="235" fill="url(#sukkahGrid)" rx="8" />

              {/* Left side: Circular Sukkah with Inscribed Square */}
              <g transform="translate(185, 118)">
                {/* Outer Round Sukkah */}
                <circle
                  cx={0}
                  cy={0}
                  r={sukkahRadiusPx}
                  fill="#ECFDF5"
                  stroke="#047857"
                  strokeWidth="3"
                />
                {/* Inner Square */}
                <rect
                  x={-inscribedSidePx / 2}
                  y={-inscribedSidePx / 2}
                  width={inscribedSidePx}
                  height={inscribedSidePx}
                  fill="#FFFFFF"
                  fillOpacity="0.9"
                  stroke="#1D4ED8"
                  strokeWidth="2.5"
                />
                {/* Diagonal = Circle Diameter */}
                <line
                  x1={-inscribedSidePx / 2}
                  y1={inscribedSidePx / 2}
                  x2={inscribedSidePx / 2}
                  y2={-inscribedSidePx / 2}
                  stroke="#D97706"
                  strokeWidth="2.5"
                  strokeDasharray="5 3"
                />
                {/* Corner contact points */}
                {[
                  [-1, -1],
                  [1, -1],
                  [1, 1],
                  [-1, 1],
                ].map(([sx, sy], i) => (
                  <circle
                    key={i}
                    cx={(sx * inscribedSidePx) / 2}
                    cy={(sy * inscribedSidePx) / 2}
                    r="4"
                    fill="#1D4ED8"
                  />
                ))}

                {/* Side label */}
                <text
                  x={0}
                  y={inscribedSidePx / 2 + 18}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="600"
                  fill="#1D4ED8"
                >
                  Side = {squareSide} tefachim
                </text>
                {/* Diagonal label */}
                <text
                  x={0}
                  y={-6}
                  textAnchor="middle"
                  fontSize="11.5"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="700"
                  fill="#B45309"
                >
                  Diag ≈ {gemaraDiagonal.toFixed(1)}
                </text>
              </g>

              {/* Right side: Visual Step Breakdown */}
              <g transform="translate(325, 42)">
                <text x="0" y="14" fontSize="12.5" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="700" fill="#0F172A">
                  How the Gemara Solves It:
                </text>
                <text x="0" y="42" fontSize="11.5" fontFamily="Plus Jakarta Sans, sans-serif" fill="#475569">
                  1. Square Side = {squareSide} tefachim
                </text>
                <text x="0" y="68" fontSize="11.5" fontFamily="IBM Plex Mono, monospace" fill="#B45309" fontWeight="600">
                  2. Diagonal ≈ {squareSide} × 1.4 = {gemaraDiagonal.toFixed(1)}
                </text>
                <text x="0" y="92" fontSize="11" fontFamily="IBM Plex Mono, monospace" fill="#64748B">
                  (Exact √2 × {squareSide} = {exactDiagonal.toFixed(2)})
                </text>
                <text x="0" y="124" fontSize="11.5" fontFamily="Plus Jakarta Sans, sans-serif" fill="#047857" fontWeight="600">
                  3. Circle Diameter = Diagonal
                </text>
                <text x="0" y="148" fontSize="11.5" fontFamily="IBM Plex Mono, monospace" fill="#047857" fontWeight="600">
                  Around ≈ 3 × {Math.ceil(gemaraDiagonal)} = {sukkahCircleCircumferenceGemara} tefachim
                </text>
              </g>
            </svg>
          )}
        </div>

        {/* Comparison Metrics */}
        {mode === 'circle' ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs text-amber-900 mb-1">Gemara Quick Rule (3 × d)</p>
              <p className="font-mono text-lg font-bold text-amber-900 tabular-nums">
                {gemaraCircumference} tefachim
              </p>
              <p className="text-xs font-mono text-amber-800 mt-0.5">
                3 × {diameter} = {gemaraCircumference}
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-900 mb-1">Exact Pi Formula (π × d)</p>
              <p className="font-mono text-lg font-bold text-blue-800 tabular-nums">
                {exactCircumference.toFixed(2)} tefachim
              </p>
              <p className="text-xs font-mono text-blue-800 mt-0.5">
                3.1416 × {diameter}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <p className="text-xs text-slate-600 mb-1">Tiny Extra Piece</p>
              <p className="font-mono text-lg font-bold text-slate-900 tabular-nums">
                +{difference.toFixed(2)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                From the .14159… in π
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-xs text-blue-900 mb-1">Inner Square Area</p>
              <p className="font-mono text-lg font-bold text-blue-800 tabular-nums">
                {squareSide * squareSide} sq tef.
              </p>
              <p className="text-xs font-mono text-blue-800 mt-0.5">
                {squareSide} × {squareSide}
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-xs text-amber-900 mb-1">Gemara Diagonal (1.4 × s)</p>
              <p className="font-mono text-lg font-bold text-amber-900 tabular-nums">
                {gemaraDiagonal.toFixed(1)} tef.
              </p>
              <p className="text-xs font-mono text-amber-800 mt-0.5">
                Exact √2: {exactDiagonal.toFixed(2)}
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
              <p className="text-xs text-emerald-900 mb-1">Round Sukkah Wall</p>
              <p className="font-mono text-lg font-bold text-emerald-800 tabular-nums">
                ~{sukkahCircleCircumferenceGemara} tef.
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                {squareSide >= 7 ? 'Fits kosher 7×7 minimum' : 'Smaller than 7×7 kosher min'}
              </p>
            </div>
          </div>
        )}
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
                      setMode('circle');
                      setUnrollPct(100);
                    } else if (idx === 1) {
                      setMode('circle');
                      setDiameter(10);
                      setUnrollPct(100);
                    } else if (idx === 2) {
                      setMode('sukkah');
                      setSquareSide(7);
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

          {/* Mode-Specific Controls */}
          <div className="space-y-5 pt-5 border-t border-slate-200">
            {mode === 'circle' ? (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="circle-unroll" className="text-sm font-medium text-slate-800">
                      Unroll Circle Along Ruler
                    </label>
                    <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                      {unrollPct}%
                    </span>
                  </div>
                  <input
                    id="circle-unroll"
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={unrollPct}
                    onChange={(e) => setUnrollPct(Number(e.target.value))}
                    className="studio-slider"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="circle-diameter" className="text-sm font-medium text-slate-800">
                      Circle Diameter (Width)
                    </label>
                    <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                      {diameter} tefachim
                    </span>
                  </div>
                  <input
                    id="circle-diameter"
                    type="range"
                    min={2}
                    max={16}
                    step={1}
                    value={diameter}
                    onChange={(e) => setDiameter(Number(e.target.value))}
                    className="studio-slider"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDiameter(10);
                      setUnrollPct(100);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    King Solomon’s Sea (d = 10)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiameter(4);
                      setUnrollPct(100);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Small Well (d = 4)
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="sukkah-side" className="text-sm font-medium text-slate-800">
                      Inner Square Side Length
                    </label>
                    <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                      {squareSide} tefachim
                    </span>
                  </div>
                  <input
                    id="sukkah-side"
                    type="range"
                    min={4}
                    max={12}
                    step={1}
                    value={squareSide}
                    onChange={(e) => setSquareSide(Number(e.target.value))}
                    className="studio-slider"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSquareSide(7)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Minimum Kosher Sukkah (7×7)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSquareSide(10)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    10×10 Square (Diag ≈ 14)
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer action */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Compass className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
            <span>1 tefach ≈ 1 handbreadth (~3.5 inches)</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setDiameter(10);
              setUnrollPct(100);
              setSquareSide(7);
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
