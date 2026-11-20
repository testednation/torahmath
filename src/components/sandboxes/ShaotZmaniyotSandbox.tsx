import { useState } from 'react';
import { Sun, RotateCcw } from 'lucide-react';
import type { LessonDefinition } from '../../data/lessons';

interface SandboxProps {
  lesson: LessonDefinition;
}

function formatClockMinutes(totalMinutes: number): string {
  const normalized = ((Math.round(totalMinutes) % 1440) + 1440) % 1440;
  const h24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const period = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(mins).padStart(2, '0')} ${period}`;
}

export function ShaotZmaniyotSandbox({ lesson }: SandboxProps) {
  // Sunrise in minutes after midnight (default 6:30 AM = 390)
  const [sunriseMins, setSunriseMins] = useState(390);
  // Total daylight hours (default 12 hrs = 720 mins)
  const [daylightHours, setDaylightHours] = useState(12);
  const [activeStage, setActiveStage] = useState(0);

  const totalDaylightMins = daylightHours * 60;
  const shaahZmanitMins = totalDaylightMins / 12;
  const sunsetMins = sunriseMins + totalDaylightMins;

  const latestShemaMins = sunriseMins + shaahZmanitMins * 3;
  const latestShacharitMins = sunriseMins + shaahZmanitMins * 4;
  const chatzotMins = sunriseMins + shaahZmanitMins * 6;

  // Build 12 proportional wedges across 180° sky semicircle (center 220, 195, radius 155)
  const cx = 220;
  const cy = 195;
  const r = 152;

  function polarPoint(hourIdx: number, radius = r) {
    const angle = Math.PI - (hourIdx / 12) * Math.PI;
    return {
      x: cx + Math.cos(angle) * radius,
      y: cy - Math.sin(angle) * radius,
    };
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Interactive Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Interactive Daylight Sundial · Orach Chaim 58:1 &amp; 89:1
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
              {daylightHours} Hours of Sunlight ÷ 12 ={' '}
              <span className="font-mono text-amber-700 tabular-nums">
                {shaahZmanitMins} min
              </span>{' '}
              per Halachic Hour
            </h3>
          </div>
          <div className="font-mono text-xs font-semibold text-blue-800 tabular-nums">
            {totalDaylightMins} min ÷ 12 = {shaahZmanitMins} min
          </div>
        </div>

        {/* Interactive 12-Hour Daylight Arc SVG */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <svg
            viewBox="0 0 440 232"
            className="w-full h-auto"
            role="img"
            aria-label={`Daylight arc divided into 12 Halachic hours of ${shaahZmanitMins} minutes each from ${formatClockMinutes(sunriseMins)} to ${formatClockMinutes(sunsetMins)}`}
          >
            {/* 12 Proportional Wedges */}
            {Array.from({ length: 12 }).map((_, i) => {
              const p1 = polarPoint(i);
              const p2 = polarPoint(i + 1);
              const labelPos = polarPoint(i + 0.5, r * 0.78);

              let fill = '#FFFBEB';
              if (i < 3) {
                fill = '#DBEAFE'; // Shema window (Hours 1-3)
              } else if (i === 3) {
                fill = '#FEF3C7'; // Shacharit Hour 4
              } else if (i >= 6) {
                fill = '#F1F5F9'; // Afternoon Hours 7-12
              }

              return (
                <g key={i}>
                  <path
                    d={`M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} Z`}
                    fill={fill}
                    stroke="#CBD5E1"
                    strokeWidth="1.2"
                  />
                  <text
                    x={labelPos.x}
                    y={labelPos.y + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fontFamily="IBM Plex Mono, monospace"
                    fontWeight="600"
                    fill={i < 3 ? '#1E3A8A' : i === 3 ? '#92400E' : '#475569'}
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}

            {/* Highlight Key Prayer Rays: Hour 3 (Shema), Hour 4 (Shacharit), Hour 6 (Midday) */}
            {[
              { hr: 3, color: '#1D4ED8', label: 'Shema (Hr 3)' },
              { hr: 4, color: '#D97706', label: 'Shacharit (Hr 4)' },
              { hr: 6, color: '#047857', label: 'Midday (Hr 6)' },
            ].map((marker) => {
              const pt = polarPoint(marker.hr, r + 4);
              const tip = polarPoint(marker.hr, r + 20);
              return (
                <g key={marker.hr}>
                  <line
                    x1={cx}
                    y1={cy}
                    x2={pt.x}
                    y2={pt.y}
                    stroke={marker.color}
                    strokeWidth="2.4"
                  />
                  <circle cx={pt.x} cy={pt.y} r="4.5" fill={marker.color} />
                  <text
                    x={tip.x}
                    y={tip.y}
                    textAnchor={marker.hr === 6 ? 'middle' : 'end'}
                    fontSize="10"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fontWeight="700"
                    fill={marker.color}
                  >
                    {marker.label}
                  </text>
                </g>
              );
            })}

            {/* Sun disc at zenith */}
            <circle cx={cx} cy={cy - r + 26} r="10" fill="#F59E0B" opacity="0.22" />
            <circle cx={cx} cy={cy - r + 26} r="6" fill="#D97706" />

            {/* Horizon line & Sunrise/Sunset readouts */}
            <line x1="28" y1={cy} x2="412" y2={cy} stroke="#334155" strokeWidth="2" />
            <text
              x="68"
              y={cy + 20}
              textAnchor="middle"
              fontSize="11"
              fontFamily="IBM Plex Mono, monospace"
              fontWeight="700"
              fill="#0F172A"
            >
              Sunrise {formatClockMinutes(sunriseMins)}
            </text>
            <text
              x="372"
              y={cy + 20}
              textAnchor="middle"
              fontSize="11"
              fontFamily="IBM Plex Mono, monospace"
              fontWeight="700"
              fill="#0F172A"
            >
              Sunset {formatClockMinutes(sunsetMins)}
            </text>
          </svg>
        </div>

        {/* 4 Live Key Zmanim Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p className="text-[11px] font-medium text-slate-500">1 Halachic Hr</p>
            <p className="font-mono text-base font-bold text-slate-900 tabular-nums mt-0.5">
              {shaahZmanitMins} min
            </p>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-[11px] font-medium text-blue-800">Latest Shema (3)</p>
            <p className="font-mono text-base font-bold text-blue-950 tabular-nums mt-0.5">
              {formatClockMinutes(latestShemaMins)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-[11px] font-medium text-amber-800">Shacharit (4)</p>
            <p className="font-mono text-base font-bold text-amber-950 tabular-nums mt-0.5">
              {formatClockMinutes(latestShacharitMins)}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-[11px] font-medium text-emerald-800">Midday (6)</p>
            <p className="font-mono text-base font-bold text-emerald-950 tabular-nums mt-0.5">
              {formatClockMinutes(chatzotMins)}
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
                      setDaylightHours(12);
                      setSunriseMins(390);
                    } else if (idx === 1) {
                      setDaylightHours(10);
                      setSunriseMins(420);
                    } else {
                      setDaylightHours(14);
                      setSunriseMins(330);
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

          {/* Season Presets & Sliders */}
          <div className="space-y-5 pt-5 border-t border-slate-200">
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
                <span>Season Presets</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Winter (10h)', hrs: 10, rise: 420 },
                  { label: 'Equinox (12h)', hrs: 12, rise: 390 },
                  { label: 'Summer (14h)', hrs: 14, rise: 330 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setDaylightHours(preset.hrs);
                      setSunriseMins(preset.rise);
                    }}
                    className={`px-2.5 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                      daylightHours === preset.hrs
                        ? 'border-blue-700 bg-blue-50 text-blue-900'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="daylight-slider"
                  className="text-sm font-medium text-slate-800"
                >
                  Total Daylight Length
                </label>
                <span className="font-mono text-sm font-semibold text-amber-700 tabular-nums">
                  {daylightHours} hrs ({totalDaylightMins} min)
                </span>
              </div>
              <input
                id="daylight-slider"
                type="range"
                min={8}
                max={16}
                step={1}
                value={daylightHours}
                onChange={(e) => setDaylightHours(Number(e.target.value))}
                className="studio-slider"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400 mt-1 tabular-nums">
                <span>8h</span>
                <span>10h</span>
                <span>12h</span>
                <span>14h</span>
                <span>16h</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="sunrise-slider"
                  className="text-sm font-medium text-slate-800"
                >
                  Sunrise Time (Netz)
                </label>
                <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                  {formatClockMinutes(sunriseMins)}
                </span>
              </div>
              <input
                id="sunrise-slider"
                type="range"
                min={300}
                max={480}
                step={15}
                value={sunriseMins}
                onChange={(e) => setSunriseMins(Number(e.target.value))}
                className="studio-slider"
              />
              <div className="flex justify-between text-xs font-mono text-slate-400 mt-1 tabular-nums">
                <span>5:00 AM</span>
                <span>6:30 AM</span>
                <span>8:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formula & Reset */}
        <div className="pt-4 border-t border-slate-200 space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 font-mono text-xs text-slate-700 tabular-nums space-y-1">
            <div>
              1 Halachic Hour = {totalDaylightMins} ÷ 12 ={' '}
              <strong>{shaahZmanitMins} min</strong>
            </div>
            <div>
              Latest Shema = {formatClockMinutes(sunriseMins)} + (3 ×{' '}
              {shaahZmanitMins}m) ={' '}
              <strong className="text-blue-700">
                {formatClockMinutes(latestShemaMins)}
              </strong>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setDaylightHours(12);
              setSunriseMins(390);
            }}
            className="w-full py-2 px-4 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset to 12-Hour Equinox</span>
          </button>
        </div>
      </div>
    </div>
  );
}
