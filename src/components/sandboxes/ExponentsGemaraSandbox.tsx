import { useState } from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import type { LessonDefinition } from '../../data/lessons';

interface SandboxProps {
  lesson: LessonDefinition;
}

const SUPERSCRIPTS = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];

function toSuperscript(n: number): string {
  return String(n)
    .split('')
    .map((ch) => SUPERSCRIPTS[Number(ch)] ?? ch)
    .join('');
}

const STAR_POWERS = [
  { exp: 1, name: 'Ten', gemaraNote: '10 Commandments (Shemot 20)' },
  { exp: 2, name: 'One Hundred', gemaraNote: '100 daily blessings (Menachot 43b)' },
  { exp: 3, name: 'One Thousand', gemaraNote: '1,000 years in a psalm (Tehillim 90:4)' },
  { exp: 4, name: 'Ten Thousand (Myriad)', gemaraNote: '1 Ribbo — Reish Lakish’s star unit (Berachot 32b)' },
  { exp: 5, name: 'One Hundred Thousand', gemaraNote: '10 Ribbo (10 × 10,000)' },
  { exp: 6, name: 'One Million', gemaraNote: '1,000 × 1,000 (10³ × 10³)' },
  { exp: 18, name: 'One Quintillion', gemaraNote: 'Reish Lakish’s ~10¹⁸ stars in Berachot 32b!' },
] as const;

export function ExponentsGemaraSandbox({ lesson }: SandboxProps) {
  const [mode, setMode] = useState<'builder' | 'stars'>('builder');
  const [base, setBase] = useState<number>(2);
  const [exponent, setExponent] = useState<number>(4);
  const [starPowerIdx, setStarPowerIdx] = useState<number>(3); // 10^4 myriad
  const [activeStage, setActiveStage] = useState(0);

  const powerValue = Math.pow(base, exponent);
  const multiplyTrap = base * exponent;
  const factors = Array.from({ length: exponent }, () => base);

  const currentStar = STAR_POWERS[starPowerIdx];
  const starNumberDisplay =
    currentStar.exp <= 6
      ? Math.pow(10, currentStar.exp).toLocaleString()
      : '1,000,000,000,000,000,000';

  // Build growth bars for powers 1..exponent
  const growthSteps = Array.from({ length: exponent }, (_, idx) => {
    const e = idx + 1;
    const val = Math.pow(base, e);
    return { e, val };
  });
  const maxGrowthVal = growthSteps[growthSteps.length - 1]?.val ?? 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Interactive Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {mode === 'builder'
                ? 'Interactive Exponent Builder · Eruvin 23b Squares & Doubling Powers'
                : 'Powers of 10 in the Talmud · Berachot 32b (Counting the Stars)'}
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-0.5 font-mono tabular-nums">
              {mode === 'builder'
                ? `${base}${toSuperscript(exponent)} = ${powerValue.toLocaleString()}`
                : `10${toSuperscript(currentStar.exp)} = ${starNumberDisplay}`}
            </h3>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('builder')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'builder'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Power Builder (bᵉ)
            </button>
            <button
              type="button"
              onClick={() => setMode('stars')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                mode === 'stars'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stars of Berachot 32b (10ⁿ)
            </button>
          </div>
        </div>

        {/* Visual Model Stage */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 overflow-hidden">
          {mode === 'builder' ? (
            <div className="space-y-5">
              {/* Expanded Multiplication Chain */}
              <div className="bg-white border border-slate-200 rounded-lg p-4 text-center space-y-1.5">
                <p className="text-xs font-medium text-slate-500">
                  Repeated Multiplication ({exponent} {exponent === 1 ? 'copy' : 'copies'} of {base})
                </p>
                <p className="font-mono text-lg sm:text-xl font-bold text-blue-800 tabular-nums break-words">
                  {base}
                  {toSuperscript(exponent)} = {factors.join(' × ')} ={' '}
                  <span className="text-emerald-700">
                    {powerValue.toLocaleString()}
                  </span>
                </p>
              </div>

              {/* Dynamic Visual: True Square Grid for e=2 (b<=10), 3D Cube Layers for e=3 (b<=4), or Exponential Growth Bars */}
              {exponent === 2 && base <= 10 ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                  <div
                    className="grid gap-1 bg-white p-3 rounded-lg border border-slate-200"
                    style={{
                      gridTemplateColumns: `repeat(${base}, minmax(0, 1fr))`,
                    }}
                    aria-label={`${base} by ${base} square grid containing ${powerValue} squares`}
                  >
                    {Array.from({ length: powerValue }).map((_, idx) => (
                      <div
                        key={idx}
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-xs bg-blue-600/85 border border-blue-700/30"
                      />
                    ))}
                  </div>
                  <div className="text-center sm:text-left space-y-1 max-w-xs">
                    <p className="text-xs font-bold uppercase tracking-wide text-blue-800">
                      A True Square ({base}²)
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {base} rows × {base} columns ={' '}
                      <strong className="font-mono">{powerValue}</strong> unit squares! Just like Eruvin 23b’s{' '}
                      <span className="font-mono font-semibold">50² = 2,500</span> Beit Se’ah courtyard.
                    </p>
                  </div>
                </div>
              ) : exponent === 3 && base <= 4 ? (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-2">
                  <div className="flex items-end gap-3">
                    {Array.from({ length: base }).map((_, layer) => (
                      <div key={layer} className="text-center space-y-1">
                        <div
                          className="grid gap-1 bg-white p-2 rounded-lg border border-amber-300"
                          style={{
                            gridTemplateColumns: `repeat(${base}, minmax(0, 1fr))`,
                          }}
                        >
                          {Array.from({ length: base * base }).map((__, cell) => (
                            <div
                              key={cell}
                              className="w-4 h-4 rounded-xs bg-amber-500/85"
                            />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                          Layer {layer + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="text-center sm:text-left space-y-1 max-w-xs">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                      A 3D Cube ({base}³)
                    </p>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {base} stacked layers of {base} × {base} ({base * base}) ={' '}
                      <strong className="font-mono">{powerValue}</strong> unit cubes!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <p className="text-xs font-semibold text-slate-600">
                    Watch How Fast Powers of {base} Grow at Each Step:
                  </p>
                  <div className="space-y-2">
                    {growthSteps.map((step) => {
                      const pct = Math.max(
                        6,
                        Math.round((step.val / maxGrowthVal) * 100)
                      );
                      return (
                        <div
                          key={step.e}
                          className="grid grid-cols-12 items-center gap-2 text-xs font-mono tabular-nums"
                        >
                          <span className="col-span-2 font-bold text-slate-700">
                            {base}
                            {toSuperscript(step.e)}
                          </span>
                          <div className="col-span-7 h-5 bg-slate-200/70 rounded-md overflow-hidden">
                            <div
                              className={`h-full rounded-md transition-all ${
                                step.e === exponent
                                  ? 'bg-blue-700'
                                  : 'bg-blue-400'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="col-span-3 text-right font-semibold text-slate-900">
                            {step.val.toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Cosmic Stars of Berachot 32b Visual */
            <div className="space-y-4">
              <div className="rounded-xl bg-slate-900 p-5 text-white relative overflow-hidden">
                <svg
                  viewBox="0 0 520 150"
                  className="w-full h-36"
                  role="img"
                  aria-label={`Night sky illustrating 10 to the power of ${currentStar.exp} stars from Berachot 32b`}
                >
                  {/* Deterministic starfield scaled with exponent */}
                  {Array.from({
                    length: Math.min(95, 8 + currentStar.exp * 7),
                  }).map((_, i) => {
                    const x = ((i * 73 + 29) % 500) + 10;
                    const y = ((i * 47 + 19) % 126) + 12;
                    const r = i % 5 === 0 ? 2.4 : i % 2 === 0 ? 1.5 : 1;
                    return (
                      <circle
                        key={i}
                        cx={x}
                        cy={y}
                        r={r}
                        fill={i % 6 === 0 ? '#FCD34D' : '#E2E8F0'}
                        opacity={0.45 + ((i % 4) * 0.15)}
                      />
                    );
                  })}
                  <text
                    x="260"
                    y="66"
                    textAnchor="middle"
                    fontSize="34"
                    fontFamily="IBM Plex Mono, monospace"
                    fontWeight="700"
                    fill="#FCD34D"
                  >
                    10{toSuperscript(currentStar.exp)}
                  </text>
                  <text
                    x="260"
                    y="98"
                    textAnchor="middle"
                    fontSize={currentStar.exp > 6 ? '14' : '18'}
                    fontFamily="IBM Plex Mono, monospace"
                    fontWeight="600"
                    fill="#FFFFFF"
                  >
                    = {starNumberDisplay}
                  </text>
                  <text
                    x="260"
                    y="128"
                    textAnchor="middle"
                    fontSize="12"
                    fontFamily="Plus Jakarta Sans, sans-serif"
                    fill="#CBD5E1"
                  >
                    {currentStar.name} · 1 followed by {currentStar.exp}{' '}
                    {currentStar.exp === 1 ? 'zero' : 'zeros'}
                  </text>
                </svg>
              </div>
              <p className="text-xs font-medium text-blue-900 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2.5">
                Gemara Connection: {currentStar.gemaraNote}
              </p>
            </div>
          )}
        </div>

        {/* Comparison Metrics (Especially Busting the b^e vs b×e Myth!) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-blue-900 mb-1">Real Exponent ({base}{toSuperscript(exponent)})</p>
            <p className="font-mono text-lg font-bold text-blue-800 tabular-nums">
              {powerValue.toLocaleString()}
            </p>
            <p className="text-xs text-blue-800 mt-0.5">
              Multiply {base} × itself {exponent}×
            </p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <p className="text-xs text-rose-900 mb-1">Watch Out! ({base} × {exponent})</p>
            <p className="font-mono text-lg font-bold text-rose-800 tabular-nums">
              {multiplyTrap}
            </p>
            <p className="text-xs text-rose-800 mt-0.5">
              {powerValue === multiplyTrap
                ? 'Only equal here by coincidence!'
                : 'Not the same as an exponent!'}
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <p className="text-xs text-emerald-900 mb-1">Beit Se’ah Benchmark</p>
            <p className="font-mono text-lg font-bold text-emerald-800 tabular-nums">
              50² = 2,500
            </p>
            <p className="text-xs text-emerald-800 mt-0.5">
              Eruvin 23b square courtyard
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
                      setMode('builder');
                      setBase(2);
                      setExponent(4);
                    } else if (idx === 1) {
                      setMode('builder');
                      setBase(5);
                      setExponent(2);
                    } else if (idx === 2) {
                      setMode('stars');
                      setStarPowerIdx(3);
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
            {mode === 'builder' ? (
              <>
                <div>
                  <p className="text-sm font-medium text-slate-800 mb-2">
                    Choose Base Number (b)
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {[2, 3, 4, 5, 10].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setBase(b)}
                        className={`py-2 rounded-lg font-mono text-sm font-bold border transition-colors cursor-pointer ${
                          base === b
                            ? 'bg-blue-700 border-blue-700 text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="exp-power-slider"
                      className="text-sm font-medium text-slate-800"
                    >
                      Exponent (Power e)
                    </label>
                    <span className="font-mono text-sm font-semibold text-blue-700 tabular-nums">
                      e = {exponent} ({base}
                      {toSuperscript(exponent)})
                    </span>
                  </div>
                  <input
                    id="exp-power-slider"
                    type="range"
                    min={1}
                    max={6}
                    step={1}
                    value={exponent}
                    onChange={(e) => setExponent(Number(e.target.value))}
                    className="studio-slider"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setBase(5);
                      setExponent(2);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Eruvin Square (5²)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBase(3);
                      setExponent(3);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    3D Cube (3³)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setBase(2);
                      setExponent(5);
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
                  >
                    Doubling Power (2⁵)
                  </button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm font-medium text-slate-800 mb-2">
                    Pick a Power of 10 from the Gemara
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {STAR_POWERS.map((sp, idx) => (
                      <button
                        key={sp.exp}
                        type="button"
                        onClick={() => setStarPowerIdx(idx)}
                        className={`px-3 py-2 rounded-lg font-mono text-xs font-bold border transition-colors cursor-pointer ${
                          starPowerIdx === idx
                            ? 'bg-blue-700 border-blue-700 text-white'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        10{toSuperscript(sp.exp)}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tip: In Berachot 32b, Reish Lakish multiplies 12 constellations × 30 armies × 30 camps × 365 leaders × 10,000 × 10,000 stars—reaching roughly{' '}
                  <strong className="font-mono text-slate-900">10¹⁸</strong> stars!
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
            <span>Exponent = how many times to multiply the base!</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setMode('builder');
              setBase(2);
              setExponent(4);
              setStarPowerIdx(3);
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
