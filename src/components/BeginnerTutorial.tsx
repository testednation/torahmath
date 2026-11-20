import { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Volume2,
  VolumeX,
  RotateCcw,
  Play,
  Gamepad2,
  BookOpen,
} from 'lucide-react';
import { ASSET_IMAGES, type LessonId } from '../data/lessons';
import { ResilientImage } from './ResilientImage';
import {
  isSoundEnabled,
  setSoundEnabled,
  playTap,
  playSuccess,
  playFanfare,
} from '../utils/soundFx';

interface BeginnerTutorialProps {
  completed: boolean;
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onComplete: () => void;
  onOpenGames: () => void;
  onOpenLesson: (lessonId: LessonId) => void;
}

const STEPS = [
  { id: 0, title: '1. Counting 1–10', subtitle: 'The Two Tablets' },
  { id: 1, title: '2. Take Away (−)', subtitle: 'Seder Matzah' },
  { id: 2, title: '3. Adding Groups (+)', subtitle: 'The 12 Tribes' },
  { id: 3, title: '4. Sharing Fractions', subtitle: 'Shabbat Challah' },
  { id: 4, title: '5. Equal Groups (×)', subtitle: 'Counting the Omer' },
  { id: 5, title: '6. Ready to Play!', subtitle: 'Pick Your Next Step' },
] as const;

const NUMBER_WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
];

export function BeginnerTutorial({
  completed,
  initialStep = 0,
  onStepChange,
  onComplete,
  onOpenGames,
  onOpenLesson,
}: BeginnerTutorialProps) {
  const [step, setStep] = useState(() =>
    Math.max(0, Math.min(5, initialStep))
  );
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  // Step 1 (Total Beginner): Counting 1 to 10 on the Two Tablets (Shemot 20)
  const [litTablets, setLitTablets] = useState<number[]>([1, 2, 3]);
  const [tabletPulse, setTabletPulse] = useState<number | null>(null);
  const [step0Done, setStep0Done] = useState(false);

  // Step 2 (Total Beginner): Take-Away Subtraction with 8 Seder Matzot (Orach Chaim 475)
  const [eatenMatzot, setEatenMatzot] = useState<number[]>([0]);
  const [step1Done, setStep1Done] = useState(false);

  // Step 3: Adding wooden blocks (12 Tribes — Bereishit 35:22)
  const [blueBlocks, setBlueBlocks] = useState(4);
  const [amberBlocks, setAmberBlocks] = useState(3);
  const [highlightCount, setHighlightCount] = useState<number | null>(null);
  const [step2Done, setStep2Done] = useState(false);

  // Step 4: Sharing Shabbat Challah fractions (Orach Chaim 274)
  const [challahSlices, setChallahSlices] = useState<2 | 4>(4);
  const [selectedSlices, setSelectedSlices] = useState<number[]>([0]);
  const [step3Done, setStep3Done] = useState(false);

  // Step 5: Multiplication via Counting the Omer (Vayikra 23:15)
  const [omerWeeks, setOmerWeeks] = useState(2);
  const [step4Done, setStep4Done] = useState(false);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  function clearActiveTimer() {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setTabletPulse(null);
    setHighlightCount(null);
  }

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playTap();
  }

  // Step 1 (Counting 1-10) helpers
  function toggleTabletSpot(num: number) {
    clearActiveTimer();
    playTap();
    setLitTablets((prev) => {
      const next = prev.includes(num)
        ? prev.filter((n) => n !== num)
        : [...prev, num].sort((a, b) => a - b);
      if (next.length === 10 && !step0Done) {
        setStep0Done(true);
        playSuccess();
      }
      return next;
    });
  }

  function countTabletsTogether() {
    clearActiveTimer();
    setLitTablets([1]);
    setTabletPulse(1);
    playTap();
    let current = 1;
    timerRef.current = window.setInterval(() => {
      current += 1;
      if (current > 10) {
        clearActiveTimer();
        if (!step0Done) {
          setStep0Done(true);
          playSuccess();
        }
      } else {
        setLitTablets(Array.from({ length: current }, (_, i) => i + 1));
        setTabletPulse(current);
        playTap();
      }
    }, 320);
  }

  // Step 2 (Subtraction with Matzah) helpers
  const totalMatzot = 8;
  const takenAway = eatenMatzot.length;
  const matzotLeft = totalMatzot - takenAway;

  function toggleMatzah(idx: number) {
    playTap();
    setEatenMatzot((prev) => {
      const next = prev.includes(idx)
        ? prev.filter((m) => m !== idx)
        : [...prev, idx];
      if (next.length === 3 && !step1Done) {
        setStep1Done(true);
        playSuccess();
      }
      return next;
    });
  }

  // Step 3 (Adding 12 Tribes) helpers
  const totalBlocks = blueBlocks + amberBlocks;

  function adjustBlocks(color: 'blue' | 'amber', delta: number) {
    clearActiveTimer();
    playTap();
    const nextBlue =
      color === 'blue' ? Math.max(1, Math.min(8, blueBlocks + delta)) : blueBlocks;
    const nextAmber =
      color === 'amber'
        ? Math.max(1, Math.min(8, amberBlocks + delta))
        : amberBlocks;
    setBlueBlocks(nextBlue);
    setAmberBlocks(nextAmber);

    if (nextBlue + nextAmber === 12 && !step2Done) {
      setStep2Done(true);
      playSuccess();
    }
  }

  function runCountTogether() {
    clearActiveTimer();
    let current = 1;
    setHighlightCount(1);
    playTap();
    timerRef.current = window.setInterval(() => {
      current += 1;
      if (current > totalBlocks) {
        clearActiveTimer();
        if (totalBlocks === 12 && !step2Done) {
          setStep2Done(true);
          playSuccess();
        }
      } else {
        setHighlightCount(current);
        playTap();
      }
    }, 340);
  }

  // Step 4 (Challah Fractions) helpers
  function toggleChallahSlice(idx: number) {
    playTap();
    setSelectedSlices((prev) => {
      const next = prev.includes(idx)
        ? prev.filter((s) => s !== idx)
        : [...prev, idx];
      if (next.length * 2 === challahSlices && !step3Done) {
        setStep3Done(true);
        playSuccess();
      }
      return next;
    });
  }

  function handleChangeChallahSlices(slices: 2 | 4) {
    playTap();
    setChallahSlices(slices);
    setSelectedSlices([0]);
  }

  // Step 5 (Omer Multiplication) helpers
  function handleSetOmerWeeks(weeks: number) {
    const clamped = Math.max(1, Math.min(7, weeks));
    playTap();
    setOmerWeeks(clamped);
    if (clamped === 7 && !step4Done) {
      setStep4Done(true);
      playSuccess();
    }
  }

  function goToStep(nextStep: number) {
    clearActiveTimer();
    playTap();
    setStep(nextStep);
    onStepChange?.(nextStep);
    if (nextStep === 5) {
      if (!completed) {
        onComplete();
      }
      playFanfare();
    }
  }

  return (
    <div className="space-y-8">
      {/* Friendly Total-Beginner Header Split */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-center">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <p className="text-xs font-medium text-slate-500">
              Total Beginner Tutorial · Start From Zero · Ages 4–10
            </p>
            <button
              type="button"
              onClick={toggleSound}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 px-2.5 py-1 rounded-md bg-slate-100 cursor-pointer"
            >
              {soundOn ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                  <span>Sounds On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
                  <span>Sounds Off</span>
                </>
              )}
            </button>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight mb-3">
            Total Beginner Math Path: From Counting 1 to 10 Up to Multiplication
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-xl">
            Brand new to math? Start right at Step 1! In 5 gentle, tap-and-count steps using the Two Tablets, Seder Matzah, 12 Tribes, Shabbat Challah, and the Omer, you’ll learn counting, take-away, adding, fractions, and multiplication—with zero timers.
          </p>
        </div>

        <div className="lg:col-span-5 min-h-[200px]">
          <ResilientImage
            src={ASSET_IMAGES.beginnerGuide}
            alt="Sunlit beginner math table with colorful wooden counting blocks, sliced braided Shabbat challah, and a 7-by-7 wooden pegboard"
            fallbackTitle="Total Beginner Math Guide"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 6-Step Progress Switcher Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {STEPS.map((st, idx) => {
          const isCurrent = step === idx;
          const isDone =
            (idx === 0 && step0Done) ||
            (idx === 1 && step1Done) ||
            (idx === 2 && step2Done) ||
            (idx === 3 && step3Done) ||
            (idx === 4 && step4Done) ||
            (idx === 5 && completed);

          return (
            <button
              key={st.id}
              type="button"
              onClick={() => goToStep(idx)}
              className={`text-left p-3.5 rounded-xl border transition-colors cursor-pointer ${
                isCurrent
                  ? 'bg-white border-blue-700 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 mb-1">
                <span
                  className={`text-xs font-semibold ${
                    isCurrent ? 'text-blue-800' : 'text-slate-900'
                  }`}
                >
                  {st.title}
                </span>
                {isDone && (
                  <CheckCircle2
                    className="w-3.5 h-3.5 text-emerald-700 shrink-0"
                    aria-label="Completed"
                  />
                )}
              </div>
              <p className="text-[11px] text-slate-500">{st.subtitle}</p>
            </button>
          );
        })}
      </div>

      {/* Active Tutorial Step Card */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8">
        {/* STEP 1 (NEW): COUNTING 1 TO 10 — TWO STONE TABLETS TEN-FRAME */}
        {step === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">
                  Step 1 of 5 · Counting 1 to 10 · Shemot 20 (The Ten Commandments)
                </p>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Counting to 10 in Two Neat Groups of 5
                </h2>
                <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                  At Mount Sinai, the Ten Commandments were written on <strong>Two Stone Tablets</strong>—<strong>5</strong> on the first tablet and <strong>5</strong> on the second tablet! Tap each number below to light up all 10 spots.
                </p>
              </div>

              {/* Interactive Two-Tablet Ten-Frame */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Tablet 1 (1-5) */}
                  <div className="bg-white border-2 border-slate-300 rounded-t-3xl rounded-b-xl p-4 space-y-2.5">
                    <p className="text-center text-xs font-semibold text-slate-500">
                      Tablet I (1 to 5)
                    </p>
                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((num) => {
                        const lit = litTablets.includes(num);
                        const pulsing = tabletPulse === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => toggleTabletSpot(num)}
                            className={`w-full px-3.5 py-2.5 rounded-lg border font-mono text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                              pulsing
                                ? 'bg-blue-700 border-blue-800 text-white scale-[1.03]'
                                : lit
                                ? 'bg-blue-50 border-blue-500 text-blue-900'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            <span>{num}</span>
                            <span className="font-sans text-xs font-semibold">
                              {lit ? NUMBER_WORDS[num] : 'Tap to count'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tablet 2 (6-10) */}
                  <div className="bg-white border-2 border-slate-300 rounded-t-3xl rounded-b-xl p-4 space-y-2.5">
                    <p className="text-center text-xs font-semibold text-slate-500">
                      Tablet II (6 to 10)
                    </p>
                    <div className="space-y-2">
                      {[6, 7, 8, 9, 10].map((num) => {
                        const lit = litTablets.includes(num);
                        const pulsing = tabletPulse === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => toggleTabletSpot(num)}
                            className={`w-full px-3.5 py-2.5 rounded-lg border font-mono text-sm font-bold flex items-center justify-between transition-all cursor-pointer ${
                              pulsing
                                ? 'bg-amber-600 border-amber-700 text-white scale-[1.03]'
                                : lit
                                ? 'bg-amber-50 border-amber-500 text-amber-950'
                                : 'bg-slate-50 border-slate-200 text-slate-400 hover:border-slate-300'
                            }`}
                          >
                            <span>{num}</span>
                            <span className="font-sans text-xs font-semibold">
                              {lit ? NUMBER_WORDS[num] : 'Tap to count'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Big Counting Readout */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono text-3xl font-bold text-blue-700 tabular-nums">
                      {litTablets.length}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">
                      ({NUMBER_WORDS[litTablets.length]} out of 10 lit)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={countTabletsTogether}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                    <span>Count 1 to 10 Together</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Mission Box */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-1">
                  Mini-Goal for Step 1
                </p>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Light Up All 10 Commandments!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tap every empty number on Tablet I and Tablet II—or press <strong>Count 1 to 10 Together</strong>—to see how <strong>5 + 5 = 10</strong> makes a full Ten-Frame!
                </p>
              </div>

              {litTablets.length === 10 ? (
                <div
                  role="status"
                  className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Wonderful! You counted to 10!</p>
                    <p className="text-xs mt-0.5 font-mono tabular-nums">
                      5 on Tablet I + 5 on Tablet II = 10!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-white border border-slate-200 text-sm text-slate-700">
                  You have <strong className="font-mono">{litTablets.length}</strong> lit up. Tap{' '}
                  <strong className="font-mono">{10 - litTablets.length}</strong> more to reach 10!
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    clearActiveTimer();
                    setLitTablets([]);
                  }}
                  className="text-xs font-medium text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Clear</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Next: Take Away (−)</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 (NEW): TAKE-AWAY SUBTRACTION — SEDER MATZAH (ORACH CHAIM 475) */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">
                  Step 2 of 5 · Take Away (Subtraction) · Shulchan Aruch Orach Chaim 475 (Seder Matzah)
                </p>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Subtracting Means Taking Some Away and Counting What’s Left
                </h2>
                <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                  We set <strong>8 square Matzot</strong> on the Passover Seder table. Tap a Matzah to eat it (take it away) and watch the minus sign (<strong className="font-mono">−</strong>) show how many are left!
                </p>
              </div>

              {/* Interactive 8-Matzah Table */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5">
                <div className="grid grid-cols-4 gap-3">
                  {Array.from({ length: totalMatzot }).map((_, idx) => {
                    const isTaken = eatenMatzot.includes(idx);
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleMatzah(idx)}
                        className={`aspect-square rounded-xl border-2 p-2 flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                          isTaken
                            ? 'bg-slate-100 border-dashed border-slate-300 text-slate-400'
                            : 'bg-amber-50 border-amber-400 hover:border-blue-600 text-amber-950 shadow-2xs'
                        }`}
                        aria-label={
                          isTaken
                            ? `Matzah ${idx + 1} taken away, tap to put back`
                            : `Matzah ${idx + 1} on table, tap to take away`
                        }
                      >
                        {/* Crispy Matzah dot pattern */}
                        <div className="grid grid-cols-3 gap-1.5 mb-1.5">
                          {Array.from({ length: 6 }).map((__, dot) => (
                            <span
                              key={dot}
                              className={`w-1.5 h-1.5 rounded-full ${
                                isTaken ? 'bg-slate-300' : 'bg-amber-500/70'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-mono text-xs font-bold">
                          {isTaken ? 'Eaten' : `#${idx + 1}`}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Live Subtraction Equation Strip */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                    <span>{totalMatzot}</span> −{' '}
                    <span className="text-rose-700">{takenAway}</span> ={' '}
                    <span
                      className={
                        takenAway === 3 ? 'text-emerald-700' : 'text-blue-700'
                      }
                    >
                      {matzotLeft}
                    </span>{' '}
                    <span className="font-sans text-sm font-medium text-slate-500">
                      left
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playTap();
                      setEatenMatzot([]);
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 cursor-pointer"
                  >
                    Put All 8 Back
                  </button>
                </div>
              </div>
            </div>

            {/* Right Mission Box */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-1">
                  Mini-Goal for Step 2
                </p>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Show 8 − 3 = 5 Matzot!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tap Matzot on the table so that exactly <strong>3 are taken away</strong>—and count the <strong>5 golden Matzot</strong> still left on the Seder plate!
                </p>
              </div>

              {takenAway === 3 ? (
                <div
                  role="status"
                  className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">You nailed subtraction!</p>
                    <p className="text-xs mt-0.5 font-mono tabular-nums">
                      8 Matzot − 3 eaten = 5 left on the table!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-white border border-slate-200 text-sm text-slate-700">
                  Right now you took away <strong className="font-mono">{takenAway}</strong>.{' '}
                  {takenAway < 3
                    ? `Tap ${3 - takenAway} more ${3 - takenAway === 1 ? 'Matzah' : 'Matzot'} to eat!`
                    : `Tap ${takenAway - 3} eaten ${takenAway - 3 === 1 ? 'Matzah' : 'Matzot'} to put back!`}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => goToStep(0)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Next: Adding (+)</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: ADDING GROUPS — THE 12 TRIBES */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">
                  Step 3 of 5 · Addition · Bereishit 35:22 (The 12 Tribes of Israel)
                </p>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Adding Means Putting Two Groups Together
                </h2>
                <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                  Jacob had <strong>12 sons</strong> who became the 12 Tribes of Israel. Add blue and amber wooden blocks below until you reach <strong>12 blocks</strong> all together!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-blue-800">
                        Blue Group: {blueBlocks}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustBlocks('blue', -1)}
                          className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 font-mono text-base font-bold text-slate-800 cursor-pointer"
                          aria-label="Remove one blue block"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustBlocks('blue', 1)}
                          className="w-9 h-9 rounded-lg bg-blue-700 hover:bg-blue-800 font-mono text-base font-bold text-white cursor-pointer"
                          aria-label="Add one blue block"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[52px]">
                      {Array.from({ length: blueBlocks }).map((_, i) => {
                        const num = i + 1;
                        const active = highlightCount === num;
                        return (
                          <div
                            key={num}
                            className={`w-11 h-11 rounded-lg flex items-center justify-center font-mono text-sm font-bold transition-transform ${
                              active
                                ? 'bg-blue-700 text-white scale-110 ring-2 ring-blue-300'
                                : 'bg-blue-100 text-blue-900 border border-blue-300'
                            }`}
                          >
                            {num}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-amber-800">
                        Amber Group: {amberBlocks}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => adjustBlocks('amber', -1)}
                          className="w-9 h-9 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 font-mono text-base font-bold text-slate-800 cursor-pointer"
                          aria-label="Remove one amber block"
                        >
                          −
                        </button>
                        <button
                          type="button"
                          onClick={() => adjustBlocks('amber', 1)}
                          className="w-9 h-9 rounded-lg bg-amber-600 hover:bg-amber-700 font-mono text-base font-bold text-white cursor-pointer"
                          aria-label="Add one amber block"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 min-h-[52px]">
                      {Array.from({ length: amberBlocks }).map((_, i) => {
                        const num = blueBlocks + i + 1;
                        const active = highlightCount === num;
                        return (
                          <div
                            key={num}
                            className={`w-11 h-11 rounded-lg flex items-center justify-center font-mono text-sm font-bold transition-transform ${
                              active
                                ? 'bg-amber-600 text-white scale-110 ring-2 ring-amber-300'
                                : 'bg-amber-100 text-amber-950 border border-amber-300'
                            }`}
                          >
                            {num}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                    <span className="text-blue-700">{blueBlocks}</span> +{' '}
                    <span className="text-amber-700">{amberBlocks}</span> ={' '}
                    <span
                      className={
                        totalBlocks === 12 ? 'text-emerald-700' : 'text-slate-900'
                      }
                    >
                      {totalBlocks}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={runCountTogether}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
                    <span>Count Together</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-1">
                  Mini-Goal for Step 3
                </p>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Build the Number 12!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Use the <strong>+</strong> and <strong>−</strong> buttons to make your blue and amber blocks add up to <strong>12</strong> (like 6 + 6, 7 + 5, or 8 + 4).
                </p>
              </div>

              {totalBlocks === 12 ? (
                <div
                  role="status"
                  className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Awesome! You made 12 Tribes!</p>
                    <p className="text-xs mt-0.5 font-mono tabular-nums">
                      {blueBlocks} + {amberBlocks} = 12
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-white border border-slate-200 text-sm text-slate-700">
                  Right now you have <strong className="font-mono tabular-nums">{totalBlocks}</strong>.{' '}
                  {totalBlocks < 12
                    ? `Add ${12 - totalBlocks} more block${12 - totalBlocks === 1 ? '' : 's'}!`
                    : `Take away ${totalBlocks - 12} block${totalBlocks - 12 === 1 ? '' : 's'}!`}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Next: Fractions</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: SHARING FRACTIONS — SHABBAT CHALLAH */}
        {step === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">
                  Step 4 of 5 · Fractions · Shulchan Aruch Orach Chaim 274 (Sharing Shabbat Challah)
                </p>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  A Fraction Is Just Equal Pieces of One Whole
                </h2>
                <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                  Before solving the famous Gemara Tallit puzzle or Mezuzah thirds, let’s slice a round Shabbat Challah! The <strong>bottom number</strong> tells how many equal slices exist, and the <strong>top number</strong> tells how many slices you picked.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-around gap-6">
                <svg
                  viewBox="0 0 220 220"
                  className="w-52 h-52 shrink-0"
                  role="img"
                  aria-label={`Round Shabbat challah cut into ${challahSlices} equal pieces, with ${selectedSlices.length} selected`}
                >
                  {challahSlices === 2 ? (
                    <>
                      <path
                        d="M 110 110 L 110 20 A 90 90 0 0 0 110 200 Z"
                        fill={selectedSlices.includes(0) ? '#2563EB' : '#FDE68A'}
                        stroke="#92400E"
                        strokeWidth="3"
                        onClick={() => toggleChallahSlice(0)}
                        className="cursor-pointer transition-colors"
                      />
                      <text
                        x="65"
                        y="115"
                        textAnchor="middle"
                        fontSize="16"
                        fontFamily="IBM Plex Mono, monospace"
                        fontWeight="700"
                        fill={selectedSlices.includes(0) ? '#FFFFFF' : '#78350F'}
                        className="pointer-events-none"
                      >
                        1/2
                      </text>
                      <path
                        d="M 110 110 L 110 20 A 90 90 0 0 1 110 200 Z"
                        fill={selectedSlices.includes(1) ? '#2563EB' : '#FEF3C7'}
                        stroke="#92400E"
                        strokeWidth="3"
                        onClick={() => toggleChallahSlice(1)}
                        className="cursor-pointer transition-colors"
                      />
                      <text
                        x="155"
                        y="115"
                        textAnchor="middle"
                        fontSize="16"
                        fontFamily="IBM Plex Mono, monospace"
                        fontWeight="700"
                        fill={selectedSlices.includes(1) ? '#FFFFFF' : '#78350F'}
                        className="pointer-events-none"
                      >
                        1/2
                      </text>
                    </>
                  ) : (
                    <>
                      {[
                        {
                          idx: 0,
                          d: 'M 110 110 L 110 20 A 90 90 0 0 1 200 110 Z',
                          tx: 148,
                          ty: 76,
                        },
                        {
                          idx: 1,
                          d: 'M 110 110 L 200 110 A 90 90 0 0 1 110 200 Z',
                          tx: 148,
                          ty: 152,
                        },
                        {
                          idx: 2,
                          d: 'M 110 110 L 110 200 A 90 90 0 0 1 20 110 Z',
                          tx: 72,
                          ty: 152,
                        },
                        {
                          idx: 3,
                          d: 'M 110 110 L 20 110 A 90 90 0 0 1 110 20 Z',
                          tx: 72,
                          ty: 76,
                        },
                      ].map((q) => {
                        const active = selectedSlices.includes(q.idx);
                        return (
                          <g key={q.idx}>
                            <path
                              d={q.d}
                              fill={active ? '#2563EB' : q.idx % 2 === 0 ? '#FDE68A' : '#FEF3C7'}
                              stroke="#92400E"
                              strokeWidth="3"
                              onClick={() => toggleChallahSlice(q.idx)}
                              className="cursor-pointer transition-colors"
                            />
                            <text
                              x={q.tx}
                              y={q.ty}
                              textAnchor="middle"
                              fontSize="14"
                              fontFamily="IBM Plex Mono, monospace"
                              fontWeight="700"
                              fill={active ? '#FFFFFF' : '#78350F'}
                              className="pointer-events-none"
                            >
                              1/4
                            </text>
                          </g>
                        );
                      })}
                    </>
                  )}
                </svg>

                <div className="space-y-4 text-center sm:text-left">
                  <div>
                    <p className="text-xs font-medium text-slate-500 mb-1">
                      You Picked (Tap Slices!)
                    </p>
                    <p className="font-mono text-4xl font-bold text-blue-700 tabular-nums">
                      {selectedSlices.length} / {challahSlices}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {selectedSlices.length === 0
                        ? 'Tap any golden slice to pick it up'
                        : selectedSlices.length === challahSlices
                        ? 'That’s 1 Whole Challah!'
                        : selectedSlices.length * 2 === challahSlices
                        ? 'Exactly Half (1/2) of the Challah!'
                        : `${selectedSlices.length} out of ${challahSlices} equal pieces`}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-600 mb-1.5">
                      Cut Challah Into:
                    </p>
                    <div className="inline-flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                      <button
                        type="button"
                        onClick={() => handleChangeChallahSlices(2)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          challahSlices === 2
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        2 Halves
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChangeChallahSlices(4)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                          challahSlices === 4
                            ? 'bg-white text-slate-900 shadow-sm'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        4 Quarters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-1">
                  Mini-Goal for Step 4
                </p>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Pick Exactly Half of the Challah!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tap the challah slices on the left until <strong>exactly half</strong> is highlighted in blue. Notice that <strong>2/4</strong> is the exact same amount as <strong>1/2</strong>!
                </p>
              </div>

              {selectedSlices.length * 2 === challahSlices ? (
                <div
                  role="status"
                  className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">Spot on! That is Half (1/2)!</p>
                    <p className="text-xs mt-0.5">
                      {challahSlices === 4
                        ? '2 quarters (2/4) equals 1 half (1/2)!'
                        : '1 out of 2 equal slices makes 1/2!'}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-white border border-slate-200 text-sm text-slate-700">
                  Tip: With {challahSlices} slices, half means picking{' '}
                  <strong className="font-mono">{challahSlices / 2}</strong>{' '}
                  {challahSlices / 2 === 1 ? 'slice' : 'slices'}.
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(4)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Next: Equal Groups (×)</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: MULTIPLICATION — COUNTING THE OMER */}
        {step === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">
                  Step 5 of 5 · Multiplication · Vayikra 23:15 (Counting the Omer)
                </p>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Multiplication Is Fast Repeated Adding
                </h2>
                <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
                  Between Passover and Shavuot, the Torah teaches us to count <strong>7 full weeks</strong>—and each week has <strong>7 days</strong>. Tap to add weeks and watch how fast rows of 7 grow!
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-700">
                    Omer Pegboard ({omerWeeks} {omerWeeks === 1 ? 'Week' : 'Weeks'} × 7 Days)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSetOmerWeeks(omerWeeks - 1)}
                      disabled={omerWeeks <= 1}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                    >
                      − 1 Week
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSetOmerWeeks(omerWeeks + 1)}
                      disabled={omerWeeks >= 7}
                      className="px-3 py-1.5 rounded-lg bg-blue-700 text-white text-xs font-semibold hover:bg-blue-800 disabled:opacity-40 cursor-pointer"
                    >
                      + 1 Week (+7)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-8 gap-1.5 text-center text-[11px] font-mono text-slate-400">
                  <span className="text-left">Week</span>
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Shab'].map((d) => (
                    <span key={d}>{d}</span>
                  ))}
                </div>

                <div className="space-y-1.5">
                  {Array.from({ length: 7 }).map((_, wIdx) => {
                    const active = wIdx < omerWeeks;
                    return (
                      <div key={wIdx} className="grid grid-cols-8 gap-1.5 items-center">
                        <span
                          className={`text-xs font-mono tabular-nums ${
                            active ? 'font-bold text-blue-800' : 'text-slate-300'
                          }`}
                        >
                          W{wIdx + 1}
                        </span>
                        {Array.from({ length: 7 }).map((__, dIdx) => {
                          const dayNum = wIdx * 7 + dIdx + 1;
                          return (
                            <div
                              key={dayNum}
                              className={`h-8 rounded-md flex items-center justify-center font-mono text-xs font-semibold tabular-nums transition-colors ${
                                active
                                  ? dIdx === 6
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-blue-100 text-blue-900 border border-blue-200'
                                  : 'bg-slate-100 text-slate-300'
                              }`}
                            >
                              {active ? dayNum : '·'}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-1 font-mono tabular-nums">
                  <p className="text-xs text-slate-600">
                    Adding: {Array.from({ length: omerWeeks }, () => '7').join(' + ')} ={' '}
                    <strong>{omerWeeks * 7}</strong>
                  </p>
                  <p className="text-lg font-bold text-blue-700">
                    Shortcut: {omerWeeks} × 7 = {omerWeeks * 7} days
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-5">
              <div>
                <p className="text-xs font-semibold text-blue-800 mb-1">
                  Mini-Goal for Step 5
                </p>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  Fill All 7 Weeks of the Omer!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Click <strong>+ 1 Week (+7)</strong> until all 7 rows are lit up, and watch the green Shabbat column count by 7s: <strong>7, 14, 21, 28, 35, 42, 49</strong>!
                </p>
              </div>

              {omerWeeks === 7 ? (
                <div
                  role="status"
                  className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="font-semibold">7 × 7 = 49 Days of the Omer!</p>
                    <p className="text-xs mt-0.5">
                      And the very next day (Day 50) is the holiday of Shavuot!
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-white border border-slate-200 text-sm text-slate-700">
                  Keep going! Add <strong className="font-mono">{7 - omerWeeks}</strong> more{' '}
                  {7 - omerWeeks === 1 ? 'week' : 'weeks'} to reach 49 days.
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => goToStep(5)}
                  className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Finish Tutorial</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: GRADUATION */}
        {step === 5 && (
          <div className="max-w-3xl mx-auto text-center py-6 space-y-6">
            <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-emerald-700" aria-hidden="true" />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-emerald-700">
                Total Beginner Path Complete
              </p>
              <h2 className="text-3xl font-bold text-slate-900">
                Mazal Tov! You’re Ready for Torah, Gemara &amp; Shulchan Aruch Math
              </h2>
              <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
                You just practiced counting to 10 (Two Tablets), take-away subtraction (Seder Matzah), adding groups (12 Tribes), sharing fractions (Shabbat Challah), and multiplying by 7s (Omer). Pick your next adventure!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-left">
              <button
                type="button"
                onClick={onOpenGames}
                className="p-5 rounded-xl border border-blue-200 bg-blue-50/50 hover:border-blue-600 transition-colors space-y-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-blue-800 font-semibold text-sm">
                  <Gamepad2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Play 6 Math Games</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Manna Catcher, Ark Pairs, Gematria Memory, Beit Din Scales, Tzedakah Pushka, and Shabbat Clock.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onOpenLesson('chanukah-candles')}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-blue-600 transition-colors space-y-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <BookOpen className="w-4 h-4 text-blue-700 shrink-0" aria-hidden="true" />
                  <span>Lesson 1: Chanukah Candles</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Light the interactive Chanukiah across 8 nights and discover the Pair-of-9 addition trick.
                </p>
              </button>

              <button
                type="button"
                onClick={() => onOpenLesson('maaser-percent')}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-amber-600 transition-colors space-y-2 cursor-pointer"
              >
                <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                  <BookOpen className="w-4 h-4 text-amber-600 shrink-0" aria-hidden="true" />
                  <span>Shulchan Aruch: Maaser 10%</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Explore Yoreh Deah 249:1 on a 100-square grid and learn the Drop-the-Zero percentage shortcut.
                </p>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
