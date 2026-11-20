import { useState } from 'react';
import { RotateCcw, Layers, Ruler } from 'lucide-react';
import type { LessonDefinition } from '../../data/lessons';

interface SandboxProps {
  lesson: LessonDefinition;
}

export function NoahsArkSandbox({ lesson }: SandboxProps) {
  const [length, setLength] = useState(300);
  const [width, setWidth] = useState(50);
  const [height, setHeight] = useState(30);
  const [decks, setDecks] = useState<1 | 2 | 3>(3);
  const [unit, setUnit] = useState<'amot' | 'feet'>('amot');
  const [activeStage, setActiveStage] = useState(0);

  const unitFactor = unit === 'amot' ? 1 : 1.5;
  const unitLabel = unit === 'amot' ? 'amot' : 'ft';

  const displayL = Math.round(length * unitFactor);
  const displayW = Math.round(width * unitFactor);
  const displayH = Math.round(height * unitFactor);

  const singleDeckArea = displayL * displayW;
  const totalDeckArea = singleDeckArea * decks;
  const totalVolume = displayL * displayW * displayH;

  // Real-world comparison: 1 school bus ≈ 35 ft; 1 amah ≈ 1.5 ft
  const lengthInFeet = length * 1.5;
  const schoolBuses = (lengthInFeet / 35).toFixed(1);
  const ratioLW = (length / width).toFixed(1);

  // Proportional visual geometry inside 560x270 SVG
  const visL = 130 + ((length - 60) / 300) * 210; // 130..340
  const visW = 24 + ((width - 20) / 60) * 52; // 24..76 (depth skew)
  const visH = 38 + ((height - 15) / 45) * 68; // 38..106

  const baseX = 76;
  const baseY = 205;
  const dx = visW * 0.9;
  const dy = visW * 0.48;

  const isTorahExact = length === 300 && width === 50 && height === 30 && decks === 3;

  function applyTorahDimensions() {
    setLength(300);
    setWidth(50);
    setHeight(30);
    setDecks(3);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Interactive Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Interactive 3D Blueprint · Bereishit 6:15–16
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
              Teivat Noach ({displayL.toLocaleString()} × {displayW.toLocaleString()} × {displayH.toLocaleString()} {unitLabel})
            </h3>
          </div>
          <div className="font-mono text-xs font-semibold text-blue-800 tabular-nums">
            {isTorahExact ? 'Exact Torah Blueprint' : 'Custom Blueprint'}
          </div>
        </div>

        {/* Isometric Ark Blueprint SVG */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 overflow-hidden">
          <svg
            viewBox="0 0 560 265"
            className="w-full h-auto"
            role="img"
            aria-label={`Isometric diagram of Noah's Ark measuring ${displayL} by ${displayW} by ${displayH} ${unitLabel} with ${decks} decks`}
          >
            {/* Subtle blueprint grid */}
            <defs>
              <pattern id="arkGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                <path
                  d="M 24 0 L 0 0 0 24"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="560" height="265" fill="url(#arkGrid)" rx="8" />

            {/* Water ripple baseline */}
            <line
              x1="28"
              y1={baseY + 8}
              x2="532"
              y2={baseY + 8}
              stroke="#93C5FD"
              strokeWidth="2"
              strokeDasharray="6 6"
            />

            {/* Back top face */}
            <polygon
              points={`
                ${baseX},${baseY - visH}
                ${baseX + visL},${baseY - visH}
                ${baseX + visL + dx},${baseY - visH - dy}
                ${baseX + dx},${baseY - visH - dy}
              `}
              fill="#DBEAFE"
              stroke="#1D4ED8"
              strokeWidth="1.8"
            />

            {/* Right side face (Width × Height) */}
            <polygon
              points={`
                ${baseX + visL},${baseY}
                ${baseX + visL + dx},${baseY - dy}
                ${baseX + visL + dx},${baseY - visH - dy}
                ${baseX + visL},${baseY - visH}
              `}
              fill="#BFDBFE"
              stroke="#1D4ED8"
              strokeWidth="1.8"
            />

            {/* Front face (Length × Height) */}
            <rect
              x={baseX}
              y={baseY - visH}
              width={visL}
              height={visH}
              fill="#EFF6FF"
              stroke="#1D4ED8"
              strokeWidth="2"
            />

            {/* Internal Deck Floors */}
            {Array.from({ length: decks - 1 }).map((_, idx) => {
              const levelY = baseY - ((idx + 1) * visH) / decks;
              return (
                <g key={idx}>
                  <line
                    x1={baseX}
                    y1={levelY}
                    x2={baseX + visL}
                    y2={levelY}
                    stroke="#047857"
                    strokeWidth="2"
                    strokeDasharray="6 4"
                  />
                  <line
                    x1={baseX + visL}
                    y1={levelY}
                    x2={baseX + visL + dx}
                    y2={levelY - dy}
                    stroke="#047857"
                    strokeWidth="1.6"
                    strokeDasharray="4 4"
                  />
                </g>
              );
            })}

            {/* Deck labels inside front face */}
            {Array.from({ length: decks }).map((_, idx) => {
              const deckCenterY =
                baseY - ((idx + 0.5) * visH) / decks + 4;
              const deckNames = ['Deck 1 (Lower)', 'Deck 2 (Middle)', 'Deck 3 (Upper)'];
              return (
                <text
                  key={idx}
                  x={baseX + visL / 2}
                  y={deckCenterY}
                  textAnchor="middle"
                  fontSize="10.5"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="600"
                  fill="#1E3A8A"
                >
                  {deckNames[idx]} · {singleDeckArea.toLocaleString()} sq {unitLabel}
                </text>
              );
            })}

            {/* Length Dimension Arrow */}
            <g>
              <line
                x1={baseX}
                y1={baseY + 26}
                x2={baseX + visL}
                y2={baseY + 26}
                stroke="#0F172A"
                strokeWidth="1.6"
              />
              <line x1={baseX} y1={baseY + 20} x2={baseX} y2={baseY + 32} stroke="#0F172A" strokeWidth="1.6" />
              <line x1={baseX + visL} y1={baseY + 20} x2={baseX + visL} y2={baseY + 32} stroke="#0F172A" strokeWidth="1.6" />
              <text
                x={baseX + visL / 2}
                y={baseY + 44}
                textAnchor="middle"
                fontSize="12"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="600"
                fill="#0F172A"
              >
                Length = {displayL} {unitLabel}
              </text>
            </g>

            {/* Height Dimension Arrow */}
            <g>
              <line
                x1={baseX - 18}
                y1={baseY}
                x2={baseX - 18}
                y2={baseY - visH}
                stroke="#B45309"
                strokeWidth="1.6"
              />
              <line x1={baseX - 24} y1={baseY} x2={baseX - 12} y2={baseY} stroke="#B45309" strokeWidth="1.6" />
              <line x1={baseX - 24} y1={baseY - visH} x2={baseX - 12} y2={baseY - visH} stroke="#B45309" strokeWidth="1.6" />
              <text
                x={baseX - 28}
                y={baseY - visH / 2 + 4}
                textAnchor="end"
                fontSize="11.5"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="600"
                fill="#B45309"
              >
                H={displayH}
              </text>
            </g>

            {/* Width Dimension Label */}
            <text
              x={baseX + visL + dx / 2 + 12}
              y={baseY - dy / 2 + 16}
              fontSize="11.5"
              fontFamily="IBM Plex Mono, monospace"
              fontWeight="600"
              fill="#047857"
            >
              W={displayW} {unitLabel}
            </text>
          </svg>
        </div>

        {/* Live Calculation Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">1 Deck Area (L × W)</p>
            <p className="font-mono text-lg font-semibold text-slate-900 tabular-nums">
              {singleDeckArea.toLocaleString()}
            </p>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              sq {unitLabel}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">All {decks} {decks === 1 ? 'Deck' : 'Decks'} Floor Area</p>
            <p className="font-mono text-lg font-semibold text-emerald-700 tabular-nums">
              {totalDeckArea.toLocaleString()}
            </p>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              {decks} × {singleDeckArea.toLocaleString()} sq {unitLabel}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Total Volume (L × W × H)</p>
            <p className="font-mono text-lg font-semibold text-blue-700 tabular-nums">
              {totalVolume.toLocaleString()}
            </p>
            <p className="text-xs font-mono text-slate-500 mt-0.5">
              cubic {unitLabel}
            </p>
          </div>
        </div>

        {/* Real-World Kid Scale Reference */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 pt-3 border-t border-slate-200">
          <span>
            Kid-Size Comparison: About <strong className="font-mono text-slate-900 tabular-nums">{schoolBuses}</strong> school buses lined up end-to-end.
          </span>
          <span className="font-mono text-slate-700 tabular-nums">
            Length : Width = {ratioLW} : 1
          </span>
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
                      setLength(300);
                      setWidth(50);
                      setHeight(30);
                      setDecks(1);
                    } else if (idx === 1) {
                      setDecks(3);
                    } else if (idx === 2) {
                      setUnit('feet');
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

          {/* Sliders */}
          <div className="space-y-4 pt-5 border-t border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="ark-length" className="text-sm font-medium text-slate-800">
                  Length
                </label>
                <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                  {displayL} {unitLabel}
                </span>
              </div>
              <input
                id="ark-length"
                type="range"
                min={60}
                max={360}
                step={10}
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="studio-slider"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="ark-width" className="text-sm font-medium text-slate-800">
                  Width
                </label>
                <span className="font-mono text-sm font-semibold text-emerald-700 tabular-nums">
                  {displayW} {unitLabel}
                </span>
              </div>
              <input
                id="ark-width"
                type="range"
                min={20}
                max={80}
                step={5}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="studio-slider"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="ark-height" className="text-sm font-medium text-slate-800">
                  Height
                </label>
                <span className="font-mono text-sm font-semibold text-amber-700 tabular-nums">
                  {displayH} {unitLabel}
                </span>
              </div>
              <input
                id="ark-height"
                type="range"
                min={15}
                max={60}
                step={5}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="studio-slider"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                  <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                  Number of Decks
                </span>
                <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
                  {([1, 2, 3] as const).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDecks(d)}
                      className={`py-1.5 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                        decks === d
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1.5">
                  <Ruler className="w-3.5 h-3.5" aria-hidden="true" />
                  Measure Unit
                </span>
                <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setUnit('amot')}
                    className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      unit === 'amot'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Amot
                  </button>
                  <button
                    type="button"
                    onClick={() => setUnit('feet')}
                    className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      unit === 'feet'
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Feet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formula & Reset */}
        <div className="pt-5 border-t border-slate-200 space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 font-mono text-xs text-slate-700 tabular-nums">
            Volume = {displayL} × {displayW} × {displayH} ={' '}
            <strong className="text-blue-700">{totalVolume.toLocaleString()}</strong> cu. {unitLabel}
          </div>

          <button
            type="button"
            onClick={applyTorahDimensions}
            className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Snap to Torah Dimensions (300 × 50 × 30)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
