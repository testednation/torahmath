import { useState } from 'react';
import { CheckCircle2, AlertTriangle, Plus, RotateCcw } from 'lucide-react';
import type { LessonDefinition } from '../../data/lessons';

interface SandboxProps {
  lesson: LessonDefinition;
}

export function BatelBShishimSandbox({ lesson }: SandboxProps) {
  const [drops, setDrops] = useState(2);
  const [soupSpoons, setSoupSpoons] = useState(100);
  const [activeStage, setActiveStage] = useState(0);

  const requiredSoup = drops * 60;
  const isBatel = soupSpoons >= requiredSoup;
  const ratio = soupSpoons / drops;
  const spoonsShort = Math.max(0, requiredSoup - soupSpoons);
  const progressPct = Math.min(100, Math.round((soupSpoons / requiredSoup) * 100));

  // Soup liquid height inside pot (max 360 spoons)
  const liquidLevelPct = Math.min(100, Math.max(12, (soupSpoons / 320) * 100));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Interactive Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Interactive Soup Pot Lab · Gemara Chullin 98a (1 : 60 Ratio)
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
              {drops} Accidental {drops === 1 ? 'Spoon' : 'Spoons'} vs. {soupSpoons} Spoons of Soup
            </h3>
          </div>
          <div className="font-mono text-sm font-semibold text-blue-800 tabular-nums">
            Current Ratio = {ratio.toFixed(1)} : 1
          </div>
        </div>

        {/* Dual-Coded Semantic Verdict Banner (Always icon + explicit text) */}
        <div
          role="status"
          className={`rounded-lg border p-4 flex items-center justify-between gap-4 ${
            isBatel
              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
              : 'bg-amber-50 border-amber-200 text-amber-950'
          }`}
        >
          <div className="flex items-start gap-3">
            {isBatel ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <div>
              <p className="text-sm font-semibold">
                {isBatel
                  ? 'Batel B’Shishim Reached! (At least 60 : 1)'
                  : `Not Yet 60 : 1 — Needs ${spoonsShort} More Spoons of Soup`}
              </p>
              <p className="text-xs mt-0.5 opacity-90">
                {isBatel
                  ? `You have ${soupSpoons} spoons of kosher soup for ${drops} accidental ${drops === 1 ? 'spoon' : 'spoons'} (needed ${requiredSoup}).`
                  : `For ${drops} accidental ${drops === 1 ? 'spoon' : 'spoons'}, 60 × ${drops} = ${requiredSoup} spoons are needed.`}
              </p>
            </div>
          </div>
          <span className="font-mono text-sm font-bold tabular-nums shrink-0">
            {progressPct}%
          </span>
        </div>

        {/* Visual Split: Bubbling Soup Pot + 60-Unit Ratio Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center bg-slate-50 border border-slate-200 rounded-xl p-5">
          {/* Soup Pot SVG */}
          <div className="md:col-span-5 flex flex-col items-center">
            <svg
              viewBox="0 0 210 210"
              className="w-48 h-48"
              role="img"
              aria-label={`Soup pot filled with ${soupSpoons} spoons of kosher soup and ${drops} accidental drops`}
            >
              {/* Steam wisps */}
              <path d="M78 40 Q84 28 78 18" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
              <path d="M105 35 Q111 22 105 12" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
              <path d="M132 40 Q138 28 132 18" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

              {/* Pot handles */}
              <path d="M36 90 C16 90 16 122 36 122" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />
              <path d="M174 90 C194 90 194 122 174 122" fill="none" stroke="#475569" strokeWidth="5" strokeLinecap="round" />

              {/* Pot body mask clip */}
              <defs>
                <clipPath id="potInterior">
                  <path d="M38 68 L172 68 L166 172 C165 184 156 190 144 190 L66 190 C54 190 45 184 44 172 Z" />
                </clipPath>
              </defs>

              {/* Pot interior background */}
              <path
                d="M38 68 L172 68 L166 172 C165 184 156 190 144 190 L66 190 C54 190 45 184 44 172 Z"
                fill="#FFFFFF"
                stroke="#334155"
                strokeWidth="3"
              />

              {/* Soup liquid fill */}
              <g clipPath="url(#potInterior)">
                <rect
                  x="34"
                  y={190 - (liquidLevelPct / 100) * 114}
                  width="142"
                  height={(liquidLevelPct / 100) * 114 + 10}
                  fill={isBatel ? '#A7F3D0' : '#FDE68A'}
                />
                {/* 60× Target threshold dashed line inside pot */}
                {requiredSoup <= 320 && (
                  <line
                    x1="36"
                    y1={190 - (requiredSoup / 320) * 114}
                    x2="174"
                    y2={190 - (requiredSoup / 320) * 114}
                    stroke="#047857"
                    strokeWidth="2"
                    strokeDasharray="4 3"
                  />
                )}
              </g>

              {/* Pot outer outline & rim */}
              <path
                d="M38 68 L172 68 L166 172 C165 184 156 190 144 190 L66 190 C54 190 45 184 44 172 Z"
                fill="none"
                stroke="#334155"
                strokeWidth="3"
              />
              <rect x="30" y="60" width="150" height="10" rx="5" fill="#475569" />

              {/* Accidental drop indicators floating near top */}
              {Array.from({ length: drops }).map((_, i) => {
                const spacing = 18;
                const start = 105 - ((drops - 1) * spacing) / 2;
                return (
                  <circle
                    key={i}
                    cx={start + i * spacing}
                    cy={50}
                    r="6"
                    fill="#BE123C"
                  />
                );
              })}

              {/* Center readout on pot */}
              <text
                x="105"
                y="142"
                textAnchor="middle"
                fontSize="18"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fill="#0F172A"
              >
                {soupSpoons}
              </text>
              <text
                x="105"
                y="160"
                textAnchor="middle"
                fontSize="10.5"
                fontFamily="Plus Jakarta Sans, sans-serif"
                fill="#475569"
              >
                spoons kosher
              </text>
            </svg>
          </div>

          {/* 60-Unit Ratio Blocks (1 grid of 60 cells per accidental drop!) */}
          <div className="md:col-span-7 space-y-3">
            <p className="text-xs font-semibold text-slate-700">
              Each accidental drop needs 1 full block of 60 kosher spoons:
            </p>
            <div className="space-y-3">
              {Array.from({ length: drops }).map((_, dropIdx) => {
                const filledForThisBlock = Math.max(
                  0,
                  Math.min(60, soupSpoons - dropIdx * 60)
                );
                const blockComplete = filledForThisBlock === 60;
                return (
                  <div key={dropIdx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                      <span className="text-slate-700">
                        Drop #{dropIdx + 1} (needs 60)
                      </span>
                      <span
                        className={
                          blockComplete
                            ? 'text-emerald-700 font-semibold'
                            : 'text-amber-800 font-semibold'
                        }
                      >
                        {filledForThisBlock}/60
                      </span>
                    </div>
                    <div className="grid grid-cols-15 gap-0.5">
                      {Array.from({ length: 60 }).map((__, cellIdx) => (
                        <div
                          key={cellIdx}
                          className={`h-2 rounded-[2px] ${
                            cellIdx < filledForThisBlock
                              ? blockComplete
                                ? 'bg-emerald-600'
                                : 'bg-blue-600'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
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
                      setDrops(1);
                      setSoupSpoons(45);
                    } else if (idx === 1) {
                      setDrops(3);
                      setSoupSpoons(180);
                    } else {
                      setDrops(2);
                      setSoupSpoons(120);
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

          {/* Sliders & Quick Buttons */}
          <div className="space-y-5 pt-5 border-t border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="drops-slider" className="text-sm font-medium text-slate-800">
                  Accidental Drops (Spoons)
                </label>
                <span className="font-mono text-sm font-semibold text-rose-700 tabular-nums">
                  {drops} {drops === 1 ? 'spoon' : 'spoons'}
                </span>
              </div>
              <input
                id="drops-slider"
                type="range"
                min={1}
                max={5}
                step={1}
                value={drops}
                onChange={(e) => setDrops(Number(e.target.value))}
                className="studio-slider"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400 mt-1 tabular-nums">
                {[1, 2, 3, 4, 5].map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="soup-slider" className="text-sm font-medium text-slate-800">
                  Kosher Soup Volume (Spoons)
                </label>
                <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                  {soupSpoons} spoons
                </span>
              </div>
              <input
                id="soup-slider"
                type="range"
                min={10}
                max={320}
                step={5}
                value={soupSpoons}
                onChange={(e) => setSoupSpoons(Number(e.target.value))}
                className="studio-slider"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSoupSpoons((s) => Math.min(320, s + 10))}
                className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Add 10 Spoons</span>
              </button>
              <button
                type="button"
                onClick={() => setSoupSpoons(Math.min(320, requiredSoup))}
                className="px-3 py-2 rounded-lg bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Make Exact 60:1 ({requiredSoup})
              </button>
            </div>
          </div>
        </div>

        {/* Formula & Reset */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 font-mono text-xs text-slate-700 tabular-nums space-y-1">
            <div>
              Required: {drops} × 60 = <strong>{requiredSoup}</strong> spoons
            </div>
            <div>
              Your Pot: {soupSpoons} ÷ {drops} ={' '}
              <strong className={isBatel ? 'text-emerald-700' : 'text-amber-800'}>
                {ratio.toFixed(1)} : 1
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setDrops(1);
              setSoupSpoons(40);
            }}
            className="w-full py-2 px-4 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset Pot</span>
          </button>
        </div>
      </div>
    </div>
  );
}
