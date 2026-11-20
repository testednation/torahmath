import { useState } from 'react';
import { Delete, RotateCcw, CheckCircle2, Target } from 'lucide-react';
import type { LessonDefinition } from '../../data/lessons';

interface SandboxProps {
  lesson: LessonDefinition;
}

interface HebrewLetterTile {
  char: string;
  name: string;
  value: number;
  group: 'ones' | 'tens' | 'hundreds';
}

const HEBREW_TILES: HebrewLetterTile[] = [
  // Ones (1–9)
  { char: 'א', name: 'Alef', value: 1, group: 'ones' },
  { char: 'ב', name: 'Bet', value: 2, group: 'ones' },
  { char: 'ג', name: 'Gimel', value: 3, group: 'ones' },
  { char: 'ד', name: 'Dalet', value: 4, group: 'ones' },
  { char: 'ה', name: 'Hei', value: 5, group: 'ones' },
  { char: 'ו', name: 'Vav', value: 6, group: 'ones' },
  { char: 'ז', name: 'Zayin', value: 7, group: 'ones' },
  { char: 'ח', name: 'Chet', value: 8, group: 'ones' },
  { char: 'ט', name: 'Tet', value: 9, group: 'ones' },
  // Tens (10–90)
  { char: 'י', name: 'Yud', value: 10, group: 'tens' },
  { char: 'כ', name: 'Kaf', value: 20, group: 'tens' },
  { char: 'ל', name: 'Lamed', value: 30, group: 'tens' },
  { char: 'מ', name: 'Mem', value: 40, group: 'tens' },
  { char: 'נ', name: 'Nun', value: 50, group: 'tens' },
  { char: 'ס', name: 'Samech', value: 60, group: 'tens' },
  { char: 'ע', name: 'Ayin', value: 70, group: 'tens' },
  { char: 'פ', name: 'Pei', value: 80, group: 'tens' },
  { char: 'צ', name: 'Tzadi', value: 90, group: 'tens' },
  // Hundreds (100–400)
  { char: 'ק', name: 'Kuf', value: 100, group: 'hundreds' },
  { char: 'ר', name: 'Reish', value: 200, group: 'hundreds' },
  { char: 'ש', name: 'Shin', value: 300, group: 'hundreds' },
  { char: 'ת', name: 'Tav', value: 400, group: 'hundreds' },
];

const TILE_BY_CHAR = Object.fromEntries(
  HEBREW_TILES.map((t) => [t.char, t])
) as Record<string, HebrewLetterTile>;

interface WordPreset {
  hebrew: string;
  translit: string;
  meaning: string;
  letters: string[];
  note: string;
}

const WORD_PRESETS: WordPreset[] = [
  {
    hebrew: 'אחד',
    translit: 'Echad',
    meaning: 'One',
    letters: ['א', 'ח', 'ד'],
    note: '1 + 8 + 4 = 13 — same sum as Ahavah (Love)!',
  },
  {
    hebrew: 'אהבה',
    translit: 'Ahavah',
    meaning: 'Love',
    letters: ['א', 'ה', 'ב', 'ה'],
    note: '1 + 5 + 2 + 5 = 13 — Echad + Ahavah = 26!',
  },
  {
    hebrew: 'חי',
    translit: 'Chai',
    meaning: 'Life',
    letters: ['ח', 'י'],
    note: '8 + 10 = 18 — the famous number for Life!',
  },
  {
    hebrew: 'שלום',
    translit: 'Shalom',
    meaning: 'Peace',
    letters: ['ש', 'ל', 'ו', 'מ'],
    note: '300 + 30 + 6 + 40 = 376',
  },
  {
    hebrew: 'תורה',
    translit: 'Torah',
    meaning: 'Torah',
    letters: ['ת', 'ו', 'ר', 'ה'],
    note: '400 + 6 + 200 + 5 = 611',
  },
];

const TARGET_CHALLENGES = [18, 26, 36, 72, 136, 254];

export function GematriaWorkshopSandbox({ lesson }: SandboxProps) {
  const [selectedChars, setSelectedChars] = useState<string[]>(['א', 'ח', 'ד']);
  const [activePresetLabel, setActivePresetLabel] = useState<string | null>('Echad (One)');
  const [targetIdx, setTargetIdx] = useState<number | null>(null);
  const [activeStage, setActiveStage] = useState(0);

  const selectedTiles = selectedChars
    .map((ch) => TILE_BY_CHAR[ch])
    .filter(Boolean);

  const totalSum = selectedTiles.reduce((sum, t) => sum + t.value, 0);
  const hundredsSum = selectedTiles
    .filter((t) => t.group === 'hundreds')
    .reduce((s, t) => s + t.value, 0);
  const tensSum = selectedTiles
    .filter((t) => t.group === 'tens')
    .reduce((s, t) => s + t.value, 0);
  const onesSum = selectedTiles
    .filter((t) => t.group === 'ones')
    .reduce((s, t) => s + t.value, 0);

  const currentTarget = targetIdx !== null ? TARGET_CHALLENGES[targetIdx] : null;
  const hitTarget = currentTarget !== null && totalSum === currentTarget;

  function addLetter(char: string) {
    if (selectedChars.length >= 10) return;
    setSelectedChars((prev) => [...prev, char]);
    setActivePresetLabel(null);
  }

  function removeTileAt(idx: number) {
    setSelectedChars((prev) => prev.filter((_, i) => i !== idx));
    setActivePresetLabel(null);
  }

  function loadPreset(preset: WordPreset) {
    setSelectedChars(preset.letters);
    setActivePresetLabel(`${preset.translit} (${preset.meaning})`);
    setTargetIdx(null);
  }

  function startTargetChallenge(idx: number) {
    setTargetIdx(idx);
    setSelectedChars([]);
    setActivePresetLabel(null);
    setActiveStage(2);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      {/* Left Interactive Stage */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              Interactive Hebrew Letter-Number Board · Place Value &amp; Addition
            </p>
            <h3 className="text-lg font-semibold text-slate-900 mt-0.5">
              {currentTarget !== null
                ? `Target Challenge: Build the Number ${currentTarget}`
                : activePresetLabel
                ? `Word: ${activePresetLabel}`
                : 'Custom Tile Expression'}
            </h3>
          </div>
          <div className="font-mono text-2xl font-bold text-blue-700 tabular-nums">
            = {totalSum}
          </div>
        </div>

        {/* Target Challenge Feedback Banner */}
        {currentTarget !== null && (
          <div
            role="status"
            className={`rounded-lg border p-3.5 flex items-center justify-between gap-3 text-sm ${
              hitTarget
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-blue-50 border-blue-200 text-blue-950'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {hitTarget ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
              ) : (
                <Target className="w-5 h-5 text-blue-700 shrink-0" aria-hidden="true" />
              )}
              <span className="font-medium">
                {hitTarget
                  ? `You built ${currentTarget}! Try the next target number.`
                  : totalSum < currentTarget
                  ? `Need ${currentTarget - totalSum} more to reach ${currentTarget}.`
                  : `Overshot by ${totalSum - currentTarget} — click a tile on the board to remove it.`}
              </span>
            </div>
            {hitTarget && (
              <button
                type="button"
                onClick={() =>
                  startTargetChallenge((targetIdx! + 1) % TARGET_CHALLENGES.length)
                }
                className="px-3 py-1.5 rounded-md bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 whitespace-nowrap shrink-0 cursor-pointer"
              >
                Next Target
              </button>
            )}
          </div>
        )}

        {/* Active Wooden Tile Board (RTL display for authentic Hebrew reading order) */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 min-h-[150px] flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Selected Letter Tiles (read right-to-left · click a tile to remove)</span>
            <button
              type="button"
              onClick={() => {
                setSelectedChars([]);
                setActivePresetLabel(null);
              }}
              className="text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer"
            >
              <Delete className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Clear Board</span>
            </button>
          </div>

          {selectedTiles.length === 0 ? (
            <div className="py-8 text-center text-sm text-slate-500">
              Tap any Hebrew letter tile below or choose a Torah word preset to start adding!
            </div>
          ) : (
            <div
              dir="rtl"
              className="flex flex-wrap items-center justify-center gap-3 py-2"
            >
              {selectedTiles.map((tile, idx) => {
                const groupColor =
                  tile.group === 'hundreds'
                    ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                    : tile.group === 'tens'
                    ? 'border-blue-300 bg-blue-50 text-blue-950'
                    : 'border-amber-300 bg-amber-50 text-amber-950';
                return (
                  <button
                    key={`${tile.char}-${idx}`}
                    type="button"
                    onClick={() => removeTileAt(idx)}
                    title={`Remove ${tile.name} (${tile.value})`}
                    className={`w-16 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-transform hover:-translate-y-0.5 cursor-pointer ${groupColor}`}
                  >
                    <span className="text-2xl font-bold leading-none mb-1">
                      {tile.char}
                    </span>
                    <span className="font-mono text-xs font-semibold tabular-nums">
                      {tile.value}
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Live Addition Equation */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-slate-700 tabular-nums">
            <span>
              {selectedTiles.length > 0
                ? `${selectedTiles.map((t) => t.value).join(' + ')} = ${totalSum}`
                : '0 = 0'}
            </span>
            <span className="text-slate-500">
              {selectedTiles.length}/10 tiles
            </span>
          </div>
        </div>

        {/* Place-Value Breakdown Strip */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5">
            <p className="text-xs text-emerald-900">Hundreds (ק–ת)</p>
            <p className="font-mono text-lg font-bold text-emerald-800 tabular-nums mt-0.5">
              {hundredsSum}
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5">
            <p className="text-xs text-blue-900">Tens (י–צ)</p>
            <p className="font-mono text-lg font-bold text-blue-800 tabular-nums mt-0.5">
              {tensSum}
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5">
            <p className="text-xs text-amber-900">Ones (א–ט)</p>
            <p className="font-mono text-lg font-bold text-amber-900 tabular-nums mt-0.5">
              {onesSum}
            </p>
          </div>
        </div>

        {/* Interactive Letter Trays (Ones, Tens, Hundreds) */}
        <div className="space-y-3 pt-2">
          {(['ones', 'tens', 'hundreds'] as const).map((group) => {
            const label =
              group === 'ones'
                ? 'Ones (1–9)'
                : group === 'tens'
                ? 'Tens (10–90)'
                : 'Hundreds (100–400)';
            const tiles = HEBREW_TILES.filter((t) => t.group === group);
            return (
              <div key={group}>
                <p className="text-xs font-medium text-slate-600 mb-1.5">{label}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tiles.map((t) => (
                    <button
                      key={t.char}
                      type="button"
                      onClick={() => addLetter(t.char)}
                      className="w-11 h-12 rounded-lg border border-slate-200 bg-white hover:border-blue-600 hover:bg-blue-50 flex flex-col items-center justify-center transition-colors cursor-pointer"
                    >
                      <span className="text-base font-bold text-slate-900 leading-none">
                        {t.char}
                      </span>
                      <span className="font-mono text-[10px] text-slate-500 tabular-nums mt-0.5">
                        {t.value}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
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
                    if (idx === 0) loadPreset(WORD_PRESETS[2]); // Chai
                    else if (idx === 1) loadPreset(WORD_PRESETS[1]); // Ahavah
                    else startTargetChallenge(2); // Build 36
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

          {/* Torah Word Presets */}
          <div className="pt-5 border-t border-slate-200">
            <p className="text-xs font-medium text-slate-600 mb-2.5">
              Famous Torah Words to Inspect
            </p>
            <div className="space-y-2">
              {WORD_PRESETS.map((preset) => (
                <button
                  key={preset.hebrew}
                  type="button"
                  onClick={() => loadPreset(preset)}
                  className="w-full text-left px-3.5 py-2.5 rounded-lg border border-slate-200 hover:border-blue-600 hover:bg-blue-50/50 transition-colors flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {preset.translit} · {preset.meaning}
                    </p>
                    <p className="text-xs text-slate-500">{preset.note}</p>
                  </div>
                  <span className="text-xl font-bold text-blue-800 shrink-0" dir="rtl">
                    {preset.hebrew}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Number Builder */}
          <div className="pt-5 border-t border-slate-200">
            <p className="text-xs font-medium text-slate-600 mb-2">
              Target Number Builder (Click a Goal)
            </p>
            <div className="grid grid-cols-3 gap-2">
              {TARGET_CHALLENGES.map((num, idx) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => startTargetChallenge(idx)}
                  className={`py-2 px-3 rounded-lg border font-mono text-sm font-semibold tabular-nums transition-colors cursor-pointer ${
                    targetIdx === idx
                      ? 'border-blue-700 bg-blue-700 text-white'
                      : 'border-slate-200 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <button
            type="button"
            onClick={() => loadPreset(WORD_PRESETS[0])}
            className="w-full py-2 px-4 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Reset to אחד (Echad = 13)</span>
          </button>
        </div>
      </div>
    </div>
  );
}
