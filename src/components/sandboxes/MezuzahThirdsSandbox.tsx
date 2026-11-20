import { useState } from 'react';
import { CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';
import type { LessonDefinition } from '../../data/lessons';

interface SandboxProps {
  lesson: LessonDefinition;
}

const TEFACH_INCHES = 3.5;

export function MezuzahThirdsSandbox({ lesson }: SandboxProps) {
  const [doorHeight, setDoorHeight] = useState(84); // inches (divisible by 3!)
  const [mezuzahHeight, setMezuzahHeight] = useState(58); // inches from floor
  const [activeStage, setActiveStage] = useState(0);

  const oneThird = Number((doorHeight / 3).toFixed(1));
  const twoThirds = Number(((doorHeight * 2) / 3).toFixed(1));
  const maxKosherHeight = Number((doorHeight - TEFACH_INCHES).toFixed(1));

  const isTooLow = mezuzahHeight < twoThirds;
  const isTooHigh = mezuzahHeight > maxKosherHeight;
  const isKosher = !isTooLow && !isTooHigh;

  // Map door height [0..doorHeight] to SVG y [258..28] (height = 230px)
  const doorBottomY = 258;
  const doorTopY = 28;
  const doorSvgHeight = doorBottomY - doorTopY;

  const yFromInches = (inches: number) =>
    doorBottomY - (Math.min(doorHeight, Math.max(0, inches)) / doorHeight) * doorSvgHeight;

  const oneThirdY = yFromInches(oneThird);
  const twoThirdsY = yFromInches(twoThirds);
  const tefachLimitY = yFromInches(maxKosherHeight);
  const mezuzahY = yFromInches(mezuzahHeight);

  function handleDoorHeightChange(nextHeight: number) {
    setDoorHeight(nextHeight);
    if (mezuzahHeight > nextHeight - 1) {
      setMezuzahHeight(Math.round((nextHeight * 2) / 3) + 2);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Interactive Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Interactive Doorway Blueprint · Yoreh Deah 289:2
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
              {doorHeight}-Inch Doorway ÷ 3 ={' '}
              <span className="font-mono text-blue-700 tabular-nums">
                {oneThird} in
              </span>{' '}
              per Third
            </h3>
          </div>
          <div className="font-mono text-xs font-semibold text-slate-600 tabular-nums">
            Mezuzah at {mezuzahHeight} in
          </div>
        </div>

        {/* Dual-Coded Kosher Placement Status Banner */}
        <div
          role="status"
          className={`rounded-lg border p-4 flex items-start gap-3 ${
            isKosher
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          {isKosher ? (
            <CheckCircle2
              className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
          ) : (
            <AlertTriangle
              className="w-5 h-5 text-amber-700 shrink-0 mt-0.5"
              aria-hidden="true"
            />
          )}
          <div>
            <p className="text-sm font-semibold">
              {isKosher
                ? 'Kosher Mezuzah Placement! (Inside the Top Third)'
                : isTooLow
                ? `Too Low — Move Above the 2/3 Mark (${twoThirds} in)`
                : `Too Close to the Top — Leave 1 Tefach (~3.5 in) Below ${doorHeight} in`}
            </p>
            <p className="text-xs mt-0.5 opacity-90">
              {isKosher
                ? `At ${mezuzahHeight} inches, your Mezuzah sits cleanly inside the top third (${twoThirds}–${maxKosherHeight} in).`
                : isTooLow
                ? `Raise the Mezuzah by at least ${(twoThirds - mezuzahHeight).toFixed(1)} inches to reach the Top Third.`
                : `Lower the Mezuzah below ${maxKosherHeight} inches so it isn’t touching the top door frame.`}
            </p>
          </div>
        </div>

        {/* Interactive Doorway SVG */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <svg
            viewBox="0 0 420 282"
            className="w-full h-auto"
            role="img"
            aria-label={`Doorway ${doorHeight} inches tall divided into three equal thirds of ${oneThird} inches each, with Mezuzah placed at ${mezuzahHeight} inches`}
          >
            {/* Floor line */}
            <line x1="36" y1={doorBottomY} x2="384" y2={doorBottomY} stroke="#334155" strokeWidth="2.5" />

            {/* Left vertical ruler ticks */}
            <line x1="88" y1={doorTopY} x2="88" y2={doorBottomY} stroke="#94A3B8" strokeWidth="1.5" />
            {[
              { y: doorTopY, label: `${doorHeight} in (3/3)` },
              { y: twoThirdsY, label: `${twoThirds} in (2/3)` },
              { y: oneThirdY, label: `${oneThird} in (1/3)` },
              { y: doorBottomY, label: '0 in (Floor)' },
            ].map((tick) => (
              <g key={tick.label}>
                <line x1="82" y1={tick.y} x2="94" y2={tick.y} stroke="#475569" strokeWidth="1.5" />
                <text
                  x="76"
                  y={tick.y + 4}
                  textAnchor="end"
                  fontSize="10"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="600"
                  fill="#475569"
                >
                  {tick.label}
                </text>
              </g>
            ))}

            {/* Door Frame Outer Wood */}
            <rect x="128" y={doorTopY - 10} width="156" height={doorSvgHeight + 10} rx="4" fill="#E2E8F0" stroke="#475569" strokeWidth="2" />

            {/* Doorway Opening (Split into 3 Visual Thirds) */}
            {/* Top 1-Tefach clearance strip */}
            <rect
              x="144"
              y={doorTopY}
              width="124"
              height={tefachLimitY - doorTopY}
              fill="#FEE2E2"
            />
            {/* Kosher Top-Third Target Zone */}
            <rect
              x="144"
              y={tefachLimitY}
              width="124"
              height={twoThirdsY - tefachLimitY}
              fill="#D1FAE5"
            />
            {/* Middle Third */}
            <rect
              x="144"
              y={twoThirdsY}
              width="124"
              height={oneThirdY - twoThirdsY}
              fill="#EFF6FF"
            />
            {/* Bottom Third */}
            <rect
              x="144"
              y={oneThirdY}
              width="124"
              height={doorBottomY - oneThirdY}
              fill="#FFFFFF"
            />

            {/* Opening inner outline */}
            <rect
              x="144"
              y={doorTopY}
              width="124"
              height={doorSvgHeight}
              fill="none"
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Dashed Third Dividers */}
            <line
              x1="144"
              y1={tefachLimitY}
              x2="268"
              y2={tefachLimitY}
              stroke="#BE123C"
              strokeWidth="1.2"
              strokeDasharray="3 3"
            />
            <line
              x1="144"
              y1={twoThirdsY}
              x2="268"
              y2={twoThirdsY}
              stroke="#047857"
              strokeWidth="2"
              strokeDasharray="5 3"
            />
            <line
              x1="144"
              y1={oneThirdY}
              x2="268"
              y2={oneThirdY}
              stroke="#64748B"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />

            {/* Zone Labels inside Doorway */}
            <text
              x="206"
              y={(tefachLimitY + twoThirdsY) / 2 + 4}
              textAnchor="middle"
              fontSize="11"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight="700"
              fill="#065F46"
            >
              KOSHER TOP 1/3
            </text>
            <text
              x="206"
              y={(twoThirdsY + oneThirdY) / 2 + 4}
              textAnchor="middle"
              fontSize="11"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight="600"
              fill="#1E3A8A"
            >
              Middle 1/3 ({oneThird} in)
            </text>
            <text
              x="206"
              y={(oneThirdY + doorBottomY) / 2 + 4}
              textAnchor="middle"
              fontSize="11"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight="600"
              fill="#475569"
            >
              Bottom 1/3 ({oneThird} in)
            </text>

            {/* Right Doorpost Mezuzah Case (slanted inward per Ashkenazi custom!) */}
            <g transform={`translate(276, ${mezuzahY})`}>
              <rect
                x="-5"
                y="-15"
                width="10"
                height="30"
                rx="3"
                fill={isKosher ? '#D97706' : '#BE123C'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                transform="rotate(-15)"
              />
              <text
                x="0"
                y="4"
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill="#FFFFFF"
                transform="rotate(-15)"
              >
                ש
              </text>
              {/* Pointer tag */}
              <line x1="12" y1="0" x2="28" y2="0" stroke={isKosher ? '#047857' : '#B45309'} strokeWidth="2" />
              <rect
                x="28"
                y="-13"
                width="96"
                height="26"
                rx="6"
                fill={isKosher ? '#ECFDF5' : '#FFFBEB'}
                stroke={isKosher ? '#047857' : '#D97706'}
                strokeWidth="1.5"
              />
              <text
                x="76"
                y="4"
                textAnchor="middle"
                fontSize="11"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fill={isKosher ? '#065F46' : '#92400E'}
              >
                {mezuzahHeight} in
              </text>
            </g>

            {/* Top 1-Tefach callout */}
            <text
              x="306"
              y={doorTopY + 10}
              fontSize="9.5"
              fontFamily="Plus Jakarta Sans, sans-serif"
              fontWeight="600"
              fill="#BE123C"
            >
              1-tefach top margin
            </text>
          </svg>
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
                      setDoorHeight(84);
                      setMezuzahHeight(58);
                    } else if (idx === 1) {
                      setDoorHeight(90);
                      setMezuzahHeight(45);
                    } else {
                      setDoorHeight(84);
                      setMezuzahHeight(82);
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

          {/* Sliders & Doorway Presets */}
          <div className="space-y-5 pt-5 border-t border-slate-200">
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Playroom (72")', h: 72 },
                { label: 'Home (84")', h: 84 },
                { label: 'School (90")', h: 90 },
              ].map((preset) => (
                <button
                  key={preset.h}
                  type="button"
                  onClick={() => handleDoorHeightChange(preset.h)}
                  className={`px-2.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    doorHeight === preset.h
                      ? 'border-blue-700 bg-blue-50 text-blue-900'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="door-height-slider"
                  className="text-sm font-medium text-slate-800"
                >
                  Doorway Height (Inches)
                </label>
                <span className="font-mono text-sm font-semibold text-slate-900 tabular-nums">
                  {doorHeight} in
                </span>
              </div>
              <input
                id="door-height-slider"
                type="range"
                min={60}
                max={108}
                step={3}
                value={doorHeight}
                onChange={(e) => handleDoorHeightChange(Number(e.target.value))}
                className="studio-slider"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400 mt-1 tabular-nums">
                <span>60 in</span>
                <span>84 in</span>
                <span>108 in</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="mezuzah-height-slider"
                  className="text-sm font-medium text-slate-800"
                >
                  Mezuzah Height from Floor
                </label>
                <span
                  className={`font-mono text-sm font-semibold tabular-nums ${
                    isKosher ? 'text-emerald-700' : 'text-amber-700'
                  }`}
                >
                  {mezuzahHeight} in
                </span>
              </div>
              <input
                id="mezuzah-height-slider"
                type="range"
                min={12}
                max={doorHeight - 1}
                step={1}
                value={mezuzahHeight}
                onChange={(e) => setMezuzahHeight(Number(e.target.value))}
                className="studio-slider"
              />
            </div>

            <button
              type="button"
              onClick={() => setMezuzahHeight(Math.ceil(twoThirds) + 1)}
              className="w-full py-2 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Snap to Ideal Spot ({Math.ceil(twoThirds) + 1} in)
            </button>
          </div>
        </div>

        {/* Formula & Reset */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 font-mono text-xs text-slate-700 tabular-nums space-y-1">
            <div>
              1/3 = {doorHeight} ÷ 3 = <strong>{oneThird} in</strong>
            </div>
            <div>
              Top Third Starts (2/3) = 2 × {oneThird} ={' '}
              <strong className="text-emerald-700">{twoThirds} in</strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setDoorHeight(84);
              setMezuzahHeight(58);
            }}
            className="w-full py-2 px-4 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Standard 84-Inch Door</span>
          </button>
        </div>
      </div>
    </div>
  );
}
