import { useState } from 'react';
import { Coins, Scale } from 'lucide-react';
import type { LessonDefinition } from '../../data/lessons';

interface SandboxProps {
  lesson: LessonDefinition;
}

interface ClaimOption {
  label: string;
  value: number; // fraction of 1 (e.g. 1, 0.75, 0.5, 0.25)
  fractionText: string;
}

const CLAIM_OPTIONS: ClaimOption[] = [
  { label: 'All (1)', value: 1, fractionText: '1' },
  { label: 'Three-Quarters (3/4)', value: 0.75, fractionText: '3/4' },
  { label: 'Half (1/2)', value: 0.5, fractionText: '1/2' },
  { label: 'Quarter (1/4)', value: 0.25, fractionText: '1/4' },
];

function formatFraction(val: number): string {
  // Exact denominator up to 8
  const eighths = Math.round(val * 8);
  if (eighths === 0) return '0';
  if (eighths === 8) return '1';
  if (eighths % 4 === 0) return `${eighths / 4}/2`;
  if (eighths % 2 === 0) return `${eighths / 2}/4`;
  return `${eighths}/8`;
}

export function TallitFractionsSandbox({ lesson }: SandboxProps) {
  const [reuvenClaim, setReuvenClaim] = useState(1);
  const [shimonClaim, setShimonClaim] = useState(0.5);
  const [tallitValue, setTallitValue] = useState(120);
  const [activeStage, setActiveStage] = useState(1);

  // Gemara Bava Metzia 2a division math:
  // If total claims <= 1, both simply get what they claim (no overlap!).
  // If total claims > 1:
  //   Undisputed for Reuven = max(0, 1 - shimonClaim)
  //   Undisputed for Shimon = max(0, 1 - reuvenClaim)
  //   Disputed overlap = reuvenClaim + shimonClaim - 1
  //   Each gets their undisputed part + half of the disputed overlap!
  const overlap = Math.max(0, reuvenClaim + shimonClaim - 1);
  const reuvenUndisputed = Math.min(reuvenClaim, Math.max(0, 1 - shimonClaim));
  const shimonUndisputed = Math.min(shimonClaim, Math.max(0, 1 - reuvenClaim));
  const splitEach = overlap / 2;

  const reuvenFinal = reuvenUndisputed + splitEach;
  const shimonFinal = shimonUndisputed + splitEach;
  const unclaimed = Math.max(0, 1 - reuvenFinal - shimonFinal);

  const reuvenZuz = Math.round(reuvenFinal * tallitValue * 10) / 10;
  const shimonZuz = Math.round(shimonFinal * tallitValue * 10) / 10;

  // Tallit visual coordinates (480px total fabric width)
  const fabricW = 460;
  const startX = 50;
  const wReuvenUndisp = reuvenUndisputed * fabricW;
  const wDisputedHalf = splitEach * fabricW;
  const wShimonUndisp = shimonUndisputed * fabricW;

  function applyPreset(r: number, s: number, stageIdx: number) {
    setReuvenClaim(r);
    setShimonClaim(s);
    setActiveStage(stageIdx);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Interactive Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Interactive Tallit Division · Gemara Bava Metzia 2a
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
              Reuven Claims {formatFraction(reuvenClaim)} · Shimon Claims {formatFraction(shimonClaim)}
            </h3>
          </div>
          <div className="font-mono text-sm font-semibold text-blue-800 tabular-nums">
            Value: {tallitValue} Zuz
          </div>
        </div>

        {/* Visual Tallit Fraction Bar SVG */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
          <svg
            viewBox="0 0 560 220"
            className="w-full h-auto"
            role="img"
            aria-label={`Tallit split: Reuven gets ${formatFraction(reuvenFinal)} and Shimon gets ${formatFraction(shimonFinal)}`}
          >
            {/* Tzitzit fringes on left & right edges */}
            {[62, 86, 110, 134].map((y) => (
              <g key={y}>
                <line x1="26" y1={y} x2={startX} y2={y} stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
                <line x1={startX + fabricW} y1={y} x2="534" y2={y} stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 2" />
              </g>
            ))}

            {/* Base white tallit outline */}
            <rect
              x={startX}
              y="54"
              width={fabricW}
              height="92"
              rx="4"
              fill="#FFFFFF"
              stroke="#CBD5E1"
              strokeWidth="2"
            />

            {/* Segment 1: Reuven Undisputed */}
            {wReuvenUndisp > 0 && (
              <g>
                <rect
                  x={startX}
                  y="54"
                  width={wReuvenUndisp}
                  height="92"
                  fill="#DBEAFE"
                  stroke="#1D4ED8"
                  strokeWidth="2"
                />
                <text
                  x={startX + wReuvenUndisp / 2}
                  y="95"
                  textAnchor="middle"
                  fontSize="13"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="600"
                  fill="#1E3A8A"
                >
                  {formatFraction(reuvenUndisputed)}
                </text>
                <text
                  x={startX + wReuvenUndisp / 2}
                  y="114"
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fill="#1E40AF"
                >
                  Undisputed
                </text>
              </g>
            )}

            {/* Segment 2a: Reuven's half of disputed zone */}
            {wDisputedHalf > 0 && (
              <g>
                <rect
                  x={startX + wReuvenUndisp}
                  y="54"
                  width={wDisputedHalf}
                  height="92"
                  fill="#93C5FD"
                  stroke="#1D4ED8"
                  strokeWidth="2"
                />
                <text
                  x={startX + wReuvenUndisp + wDisputedHalf / 2}
                  y="95"
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="600"
                  fill="#0F172A"
                >
                  +{formatFraction(splitEach)}
                </text>
                <text
                  x={startX + wReuvenUndisp + wDisputedHalf / 2}
                  y="114"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fill="#1E3A8A"
                >
                  Split (R)
                </text>
              </g>
            )}

            {/* Segment 2b: Shimon's half of disputed zone */}
            {wDisputedHalf > 0 && (
              <g>
                <rect
                  x={startX + wReuvenUndisp + wDisputedHalf}
                  y="54"
                  width={wDisputedHalf}
                  height="92"
                  fill="#FDE68A"
                  stroke="#B45309"
                  strokeWidth="2"
                />
                <text
                  x={startX + wReuvenUndisp + wDisputedHalf + wDisputedHalf / 2}
                  y="95"
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="600"
                  fill="#78350F"
                >
                  {formatFraction(splitEach)}
                </text>
                <text
                  x={startX + wReuvenUndisp + wDisputedHalf + wDisputedHalf / 2}
                  y="114"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fill="#92400E"
                >
                  Split (S)
                </text>
              </g>
            )}

            {/* Segment 3: Shimon Undisputed */}
            {wShimonUndisp > 0 && (
              <g>
                <rect
                  x={startX + fabricW - wShimonUndisp}
                  y="54"
                  width={wShimonUndisp}
                  height="92"
                  fill="#FEF3C7"
                  stroke="#B45309"
                  strokeWidth="2"
                />
                <text
                  x={startX + fabricW - wShimonUndisp / 2}
                  y="95"
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="IBM Plex Mono, monospace"
                  fontWeight="600"
                  fill="#78350F"
                >
                  {formatFraction(shimonUndisputed)}
                </text>
                <text
                  x={startX + fabricW - wShimonUndisp / 2}
                  y="114"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fill="#92400E"
                >
                  Undisputed
                </text>
              </g>
            )}

            {/* Classic tekhelet blue tallit stripes across top & bottom */}
            <line x1={startX} y1="64" x2={startX + fabricW} y2="64" stroke="#1D4ED8" strokeWidth="2.5" opacity="0.35" />
            <line x1={startX} y1="136" x2={startX + fabricW} y2="136" stroke="#1D4ED8" strokeWidth="2.5" opacity="0.35" />

            {/* Top Bracket showing Disputed Zone */}
            {overlap > 0 && (
              <g>
                <line
                  x1={startX + wReuvenUndisp}
                  y1="38"
                  x2={startX + wReuvenUndisp + wDisputedHalf * 2}
                  y2="38"
                  stroke="#BE123C"
                  strokeWidth="2"
                />
                <line x1={startX + wReuvenUndisp} y1="34" x2={startX + wReuvenUndisp} y2="44" stroke="#BE123C" strokeWidth="2" />
                <line
                  x1={startX + wReuvenUndisp + wDisputedHalf * 2}
                  y1="34"
                  x2={startX + wReuvenUndisp + wDisputedHalf * 2}
                  y2="44"
                  stroke="#BE123C"
                  strokeWidth="2"
                />
                <text
                  x={startX + wReuvenUndisp + wDisputedHalf}
                  y="27"
                  textAnchor="middle"
                  fontSize="11"
                  fontFamily="Plus Jakarta Sans, sans-serif"
                  fontWeight="600"
                  fill="#BE123C"
                >
                  Disputed Overlap: {formatFraction(overlap)} (Split 50/50!)
                </text>
              </g>
            )}

            {/* Ruler ticks along bottom (0, 1/4, 1/2, 3/4, 1) */}
            {[
              { frac: 0, label: '0' },
              { frac: 0.25, label: '1/4' },
              { frac: 0.5, label: '1/2' },
              { frac: 0.75, label: '3/4' },
              { frac: 1, label: '1 Whole' },
            ].map((tick) => {
              const tx = startX + tick.frac * fabricW;
              return (
                <g key={tick.label}>
                  <line x1={tx} y1="154" x2={tx} y2="164" stroke="#64748B" strokeWidth="1.5" />
                  <text
                    x={tx}
                    y="180"
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="IBM Plex Mono, monospace"
                    fill="#475569"
                  >
                    {tick.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Beit Din Verdict & Zuz Coin Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-blue-950">Reuven Receives</span>
              <span className="font-mono text-lg font-bold text-blue-700 tabular-nums">
                {formatFraction(reuvenFinal)}
              </span>
            </div>
            <p className="font-mono text-xs text-blue-900 tabular-nums mb-2">
              {reuvenUndisputed > 0 && splitEach > 0
                ? `${formatFraction(reuvenUndisputed)} undisputed + ${formatFraction(splitEach)} split = ${formatFraction(reuvenFinal)}`
                : reuvenUndisputed > 0
                ? `${formatFraction(reuvenUndisputed)} undisputed`
                : `${formatFraction(splitEach)} from disputed split`}
            </p>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 font-mono tabular-nums pt-2 border-t border-blue-200">
              <Coins className="w-4 h-4 text-blue-700" aria-hidden="true" />
              <span>{reuvenZuz} silver zuz</span>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold text-amber-950">Shimon Receives</span>
              <span className="font-mono text-lg font-bold text-amber-800 tabular-nums">
                {formatFraction(shimonFinal)}
              </span>
            </div>
            <p className="font-mono text-xs text-amber-900 tabular-nums mb-2">
              {shimonUndisputed > 0 && splitEach > 0
                ? `${formatFraction(shimonUndisputed)} undisputed + ${formatFraction(splitEach)} split = ${formatFraction(shimonFinal)}`
                : shimonUndisputed > 0
                ? `${formatFraction(shimonUndisputed)} undisputed`
                : `${formatFraction(splitEach)} from disputed split`}
            </p>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 font-mono tabular-nums pt-2 border-t border-amber-200">
              <Coins className="w-4 h-4 text-amber-700" aria-hidden="true" />
              <span>{shimonZuz} silver zuz</span>
            </div>
          </div>
        </div>

        {unclaimed > 0 && (
          <p className="text-xs text-slate-600 font-mono tabular-nums">
            Note: Because their claims add up to less than 1 whole, {formatFraction(unclaimed)} of the tallit has no dispute at all!
          </p>
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
                    if (idx === 0) applyPreset(1, 1, 0);
                    else if (idx === 1) applyPreset(1, 0.5, 1);
                    else {
                      setActiveStage(2);
                      setTallitValue(120);
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

          {/* Classic Gemara Case Presets */}
          <div className="space-y-4 pt-5 border-t border-slate-200">
            <div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-2">
                <Scale className="w-3.5 h-3.5" aria-hidden="true" />
                Gemara Case Presets
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => applyPreset(1, 1, 0)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                    reuvenClaim === 1 && shimonClaim === 1
                      ? 'border-blue-700 bg-blue-50 text-blue-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  Both Claim All (1 vs 1)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(1, 0.5, 1)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                    reuvenClaim === 1 && shimonClaim === 0.5
                      ? 'border-blue-700 bg-blue-50 text-blue-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  All vs. Half (Classic!)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(1, 0.25, 1)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                    reuvenClaim === 1 && shimonClaim === 0.25
                      ? 'border-blue-700 bg-blue-50 text-blue-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  All vs. Quarter (1 vs 1/4)
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset(0.75, 0.5, 1)}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border text-left transition-colors cursor-pointer ${
                    reuvenClaim === 0.75 && shimonClaim === 0.5
                      ? 'border-blue-700 bg-blue-50 text-blue-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  3/4 vs. 1/2 Overlap
                </button>
              </div>
            </div>

            {/* Individual Claim Selectors */}
            <div>
              <span className="block text-xs font-medium text-slate-700 mb-1.5">
                Reuven’s Claim (Blue)
              </span>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg">
                {CLAIM_OPTIONS.map((opt) => (
                  <button
                    key={opt.fractionText}
                    type="button"
                    onClick={() => setReuvenClaim(opt.value)}
                    className={`py-1.5 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                      reuvenClaim === opt.value
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {opt.fractionText}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="block text-xs font-medium text-slate-700 mb-1.5">
                Shimon’s Claim (Amber)
              </span>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-lg">
                {CLAIM_OPTIONS.map((opt) => (
                  <button
                    key={opt.fractionText}
                    type="button"
                    onClick={() => setShimonClaim(opt.value)}
                    className={`py-1.5 text-xs font-mono font-medium rounded-md transition-colors cursor-pointer ${
                      shimonClaim === opt.value
                        ? 'bg-white text-amber-800 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {opt.fractionText}
                  </button>
                ))}
              </div>
            </div>

            {/* Tallit Coin Value Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="tallit-zuz-slider" className="text-sm font-medium text-slate-800">
                  Tallit Value (Zuz Coins)
                </label>
                <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                  {tallitValue} zuz
                </span>
              </div>
              <input
                id="tallit-zuz-slider"
                type="range"
                min={16}
                max={160}
                step={8}
                value={tallitValue}
                onChange={(e) => setTallitValue(Number(e.target.value))}
                className="studio-slider"
              />
            </div>
          </div>
        </div>

        {/* Summary Formula */}
        <div className="pt-4 border-t border-slate-200">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 font-mono text-xs text-slate-700 tabular-nums">
            Total Distributed: {formatFraction(reuvenFinal)} + {formatFraction(shimonFinal)} ={' '}
            <strong className="text-emerald-700">{formatFraction(reuvenFinal + shimonFinal)}</strong>{' '}
            ({reuvenZuz + shimonZuz} zuz)
          </div>
        </div>
      </div>
    </div>
  );
}
