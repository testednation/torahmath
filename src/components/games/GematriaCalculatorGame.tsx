import { useState, useMemo, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Calculator,
  Delete,
  RotateCcw,
  BookmarkPlus,
  Trash2,
  CheckCircle2,
  BookOpen,
  Trophy,
  Star,
  HelpCircle,
  Space,
} from 'lucide-react';
import {
  playTap,
  playSuccess,
  playTryAgain,
  playFanfare,
} from '../../utils/soundFx';

interface GematriaCalculatorGameProps {
  onBack: () => void;
  onCompleteRound: (score: number) => void;
}

type Mode = 'calculator' | 'quiz';
type QuizDifficulty = 'beginner' | 'explorer';

interface HebrewLetterSpec {
  char: string;
  name: string;
  value: number;
  group: 'ones' | 'tens' | 'hundreds';
  isSofit?: boolean;
}

const HEBREW_LETTERS: HebrewLetterSpec[] = [
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
  // Final letters (Sofit — standard Mispar Hechrechi values)
  { char: 'ך', name: 'Kaf Sofit', value: 20, group: 'tens', isSofit: true },
  { char: 'ם', name: 'Mem Sofit', value: 40, group: 'tens', isSofit: true },
  { char: 'ן', name: 'Nun Sofit', value: 50, group: 'tens', isSofit: true },
  { char: 'ף', name: 'Pei Sofit', value: 80, group: 'tens', isSofit: true },
  { char: 'ץ', name: 'Tzadi Sofit', value: 90, group: 'tens', isSofit: true },
];

const LETTER_MAP: Record<string, HebrewLetterSpec> = Object.fromEntries(
  HEBREW_LETTERS.map((l) => [l.char, l])
);

// Strip Hebrew cantillation & vowel marks (nikud) so pasted Torah text works cleanly
function stripNikud(text: string): string {
  return text.replace(/[\u0591-\u05C7]/g, '');
}

function normalizeForCompare(text: string): string {
  return stripNikud(text).replace(/\s+/g, ' ').trim();
}

interface ParsedWord {
  raw: string;
  letters: HebrewLetterSpec[];
  sum: number;
}

function analyzeGematria(input: string): {
  words: ParsedWord[];
  allLetters: HebrewLetterSpec[];
  total: number;
  hundredsSum: number;
  tensSum: number;
  onesSum: number;
  hasIgnoredLatinOrDigits: boolean;
} {
  const cleaned = stripNikud(input);
  const hasIgnoredLatinOrDigits = /[A-Za-z0-9]/.test(cleaned);

  const rawWords = cleaned.trim() ? cleaned.trim().split(/\s+/) : [];
  const words: ParsedWord[] = [];
  const allLetters: HebrewLetterSpec[] = [];

  for (const raw of rawWords) {
    const letters: HebrewLetterSpec[] = [];
    for (const ch of raw) {
      const spec = LETTER_MAP[ch];
      if (spec) {
        letters.push(spec);
        allLetters.push(spec);
      }
    }
    if (letters.length > 0) {
      const sum = letters.reduce((acc, item) => acc + item.value, 0);
      words.push({ raw, letters, sum });
    }
  }

  let hundredsSum = 0;
  let tensSum = 0;
  let onesSum = 0;
  for (const l of allLetters) {
    if (l.group === 'hundreds') hundredsSum += l.value;
    else if (l.group === 'tens') tensSum += l.value;
    else onesSum += l.value;
  }

  return {
    words,
    allLetters,
    total: hundredsSum + tensSum + onesSum,
    hundredsSum,
    tensSum,
    onesSum,
    hasIgnoredLatinOrDigits,
  };
}

interface PresetItem {
  hebrew: string;
  label: string;
  meaning?: string;
}

const NAME_PRESETS: PresetItem[] = [
  { hebrew: 'דוד', label: 'David' },
  { hebrew: 'שרה', label: 'Sarah' },
  { hebrew: 'משה', label: 'Moshe' },
  { hebrew: 'מרים', label: 'Miriam' },
  { hebrew: 'אברהם', label: 'Avraham' },
  { hebrew: 'רחל', label: 'Rachel' },
  { hebrew: 'יוסף', label: 'Yosef' },
  { hebrew: 'אסתר', label: 'Esther' },
  { hebrew: 'נח', label: 'Noach' },
  { hebrew: 'חנה', label: 'Chana' },
  { hebrew: 'דניאל', label: 'Daniel' },
  { hebrew: 'תמר', label: 'Tamar' },
];

const TORAH_WORD_PRESETS: PresetItem[] = [
  { hebrew: 'חי', label: 'Chai', meaning: 'Life' },
  { hebrew: 'אחד', label: 'Echad', meaning: 'One' },
  { hebrew: 'אהבה', label: 'Ahavah', meaning: 'Love' },
  { hebrew: 'לב', label: 'Lev', meaning: 'Heart' },
  { hebrew: 'יין', label: 'Yayin', meaning: 'Wine' },
  { hebrew: 'חסד', label: 'Chesed', meaning: 'Kindness' },
  { hebrew: 'שלום', label: 'Shalom', meaning: 'Peace' },
  { hebrew: 'אמת', label: 'Emet', meaning: 'Truth' },
  { hebrew: 'תורה', label: 'Torah', meaning: 'Torah' },
  { hebrew: 'משה רבינו', label: 'Moshe Rabbeinu', meaning: '613 Mitzvot' },
  { hebrew: 'שבת', label: 'Shabbat', meaning: 'Sabbath' },
];

interface TwinEntry {
  hebrew: string;
  translit: string;
  meaning: string;
  fact: string;
}

// Verified standard Gematria (Mispar Hechrechi) dictionary for fun Torah twin discoveries
const GEMATRIA_TWINS: Record<number, TwinEntry[]> = {
  13: [
    {
      hebrew: 'אחד',
      translit: 'Echad',
      meaning: 'One',
      fact: 'Echad (One) and Ahavah (Love) both equal 13 — and 13 + 13 = 26!',
    },
    {
      hebrew: 'אהבה',
      translit: 'Ahavah',
      meaning: 'Love',
      fact: 'Love (אהבה) and One (אחד) share the exact same Gematria of 13.',
    },
  ],
  14: [
    {
      hebrew: 'דוד',
      translit: 'David',
      meaning: 'King David',
      fact: 'King David’s name equals 4 + 6 + 4 = 14 — the same as יד (Yad, Hand)!',
    },
    {
      hebrew: 'יד',
      translit: 'Yad',
      meaning: 'Hand',
      fact: 'A hand has 14 finger joints — and יד = 10 + 4 = 14!',
    },
  ],
  17: [
    {
      hebrew: 'טוב',
      translit: 'Tov',
      meaning: 'Good',
      fact: 'ט (9) + ו (6) + ב (2) = 17 — the Torah word for Good!',
    },
  ],
  18: [
    {
      hebrew: 'חי',
      translit: 'Chai',
      meaning: 'Life',
      fact: 'ח (8) + י (10) = 18 — why Jewish families love giving Tzedakah in multiples of 18!',
    },
  ],
  26: [
    {
      hebrew: 'אחד אהבה',
      translit: 'Echad + Ahavah',
      meaning: 'One + Love',
      fact: '13 + 13 = 26 — the Gematria of Hashem’s sacred four-letter Name (י-ה-ו-ה)!',
    },
  ],
  32: [
    {
      hebrew: 'לב',
      translit: 'Lev',
      meaning: 'Heart',
      fact: 'The Torah begins with ב (Bet) and ends with ל (Lamed) — spelling לב (Heart = 32)!',
    },
    {
      hebrew: 'כבוד',
      translit: 'Kavod',
      meaning: 'Honor',
      fact: 'Kavod (Honor) and Lev (Heart) both equal 32 — true honor comes from the heart.',
    },
  ],
  36: [
    {
      hebrew: 'לאה',
      translit: 'Leah',
      meaning: 'Matriarch Leah',
      fact: '36 is also the number of main Chanukah candles lit over 8 nights (1+2+3+4+5+6+7+8)!',
    },
  ],
  45: [
    {
      hebrew: 'אדם',
      translit: 'Adam',
      meaning: 'Humanity',
      fact: 'Adam (אדם = 45) shares the same Gematria as מה (Mah = 45), teaching humility.',
    },
    {
      hebrew: 'מה',
      translit: 'Mah',
      meaning: 'What?',
      fact: 'מ (40) + ה (5) = 45 — the exact same value as אדם (Adam)!',
    },
  ],
  58: [
    {
      hebrew: 'נח',
      translit: 'Noach',
      meaning: 'Noah',
      fact: 'Rashi (Bereishit 6:8): Noach (נח = 58) found Grace (חן = 58) — the exact same letters flipped!',
    },
    {
      hebrew: 'חן',
      translit: 'Chen',
      meaning: 'Grace',
      fact: 'ח (8) + ן (50) = 58 — matching the name of Noach (נח)!',
    },
  ],
  68: [
    {
      hebrew: 'חיים',
      translit: 'Chaim',
      meaning: 'Life',
      fact: 'ח (8) + י (10) + י (10) + ם (40) = 68 — the plural word for Life!',
    },
  ],
  70: [
    {
      hebrew: 'יין',
      translit: 'Yayin',
      meaning: 'Wine',
      fact: 'Gemara Eruvin 65a: "When wine (יין = 70) goes in, a secret (סוד = 70) comes out!"',
    },
    {
      hebrew: 'סוד',
      translit: 'Sod',
      meaning: 'Secret',
      fact: 'ס (60) + ו (6) + ד (4) = 70 — the famous Gemara twin of יין (Wine)!',
    },
  ],
  72: [
    {
      hebrew: 'חסד',
      translit: 'Chesed',
      meaning: 'Kindness',
      fact: 'ח (8) + ס (60) + ד (4) = 72 — four times Chai (4 × 18 = 72)!',
    },
  ],
  90: [
    {
      hebrew: 'מים',
      translit: 'Mayim',
      meaning: 'Water',
      fact: 'Water (מים = 90) and King (מלך = 90) share the same value of 90!',
    },
    {
      hebrew: 'מלך',
      translit: 'Melech',
      meaning: 'King',
      fact: 'מ (40) + ל (30) + ך (20) = 90 — matching Mayim (Water)!',
    },
  ],
  91: [
    {
      hebrew: 'אמן',
      translit: 'Amen',
      meaning: 'Amen',
      fact: 'Amen (אמן = 91) has the same Gematria as Malach (מלאך = Angel = 91)!',
    },
    {
      hebrew: 'מלאך',
      translit: 'Malach',
      meaning: 'Angel',
      fact: 'מ (40) + ל (30) + א (1) + ך (20) = 91 — the twin of אמן (Amen)!',
    },
  ],
  156: [
    {
      hebrew: 'יוסף',
      translit: 'Yosef',
      meaning: 'Joseph',
      fact: 'Yosef (יוסף = 156) equals Tzion (ציון = 156) — and 6 × 26 = 156!',
    },
    {
      hebrew: 'ציון',
      translit: 'Tzion',
      meaning: 'Zion / Jerusalem',
      fact: 'צ (90) + י (10) + ו (6) + ן (50) = 156 — matching Yosef (יוסף)!',
    },
  ],
  207: [
    {
      hebrew: 'אור',
      translit: 'Or',
      meaning: 'Light',
      fact: 'א (1) + ו (6) + ר (200) = 207 — the very first creation in Bereishit!',
    },
  ],
  248: [
    {
      hebrew: 'אברהם',
      translit: 'Avraham',
      meaning: 'Abraham',
      fact: 'Avraham’s name equals 248 — matching the 248 Positive Mitzvot in the Torah!',
    },
  ],
  318: [
    {
      hebrew: 'אליעזר',
      translit: 'Eliezer',
      meaning: 'Avraham’s student',
      fact: 'Gemara Nedarim 32a: Avraham’s 318 helpers were actually one person — Eliezer (318)!',
    },
  ],
  345: [
    {
      hebrew: 'משה',
      translit: 'Moshe',
      meaning: 'Moses',
      fact: 'מ (40) + ש (300) + ה (5) = 345 — add רבינו (268) to reach 613 Mitzvot!',
    },
  ],
  376: [
    {
      hebrew: 'שלום',
      translit: 'Shalom',
      meaning: 'Peace',
      fact: 'ש (300) + ל (30) + ו (6) + ם (40) = 376 — one of the most treasured Torah words!',
    },
  ],
  441: [
    {
      hebrew: 'אמת',
      translit: 'Emet',
      meaning: 'Truth',
      fact: 'Truth uses the first (א), middle (מ), and last (ת) letters of the Alef-Bet = 441 (21²)!',
    },
  ],
  541: [
    {
      hebrew: 'ישראל',
      translit: 'Yisrael',
      meaning: 'Israel',
      fact: 'י (10) + ש (300) + ר (200) + א (1) + ל (30) = 541!',
    },
  ],
  611: [
    {
      hebrew: 'תורה',
      translit: 'Torah',
      meaning: 'Torah',
      fact: 'Gemara Makkot 23b: Torah = 611 mitzvot taught by Moshe, plus 2 heard from Hashem = 613!',
    },
  ],
  613: [
    {
      hebrew: 'משה רבינו',
      translit: 'Moshe Rabbeinu',
      meaning: 'Moses our Teacher',
      fact: '345 + 268 = 613 — the exact number of Mitzvot in the entire Torah!',
    },
  ],
  702: [
    {
      hebrew: 'שבת',
      translit: 'Shabbat',
      meaning: 'Sabbath',
      fact: 'ש (300) + ב (2) + ת (400) = 702!',
    },
  ],
};

interface SavedWord {
  id: string;
  hebrew: string;
  total: number;
}

interface QuizQuestion {
  hebrew: string;
  translit: string;
  meaning: string;
  answer: number;
}

const BEGINNER_QUIZ: QuizQuestion[] = [
  { hebrew: 'חי', translit: 'Chai', meaning: 'Life', answer: 18 },
  { hebrew: 'אחד', translit: 'Echad', meaning: 'One', answer: 13 },
  { hebrew: 'דוד', translit: 'David', meaning: 'King David', answer: 14 },
  { hebrew: 'לב', translit: 'Lev', meaning: 'Heart', answer: 32 },
  { hebrew: 'טוב', translit: 'Tov', meaning: 'Good', answer: 17 },
  { hebrew: 'אהבה', translit: 'Ahavah', meaning: 'Love', answer: 13 },
];

const EXPLORER_QUIZ: QuizQuestion[] = [
  { hebrew: 'אדם', translit: 'Adam', meaning: 'Humanity', answer: 45 },
  { hebrew: 'נח', translit: 'Noach', meaning: 'Noah', answer: 58 },
  { hebrew: 'יין', translit: 'Yayin', meaning: 'Wine', answer: 70 },
  { hebrew: 'חסד', translit: 'Chesed', meaning: 'Kindness', answer: 72 },
  { hebrew: 'אור', translit: 'Or', meaning: 'Light', answer: 207 },
  { hebrew: 'שלום', translit: 'Shalom', meaning: 'Peace', answer: 376 },
];

function pickQuizRound(difficulty: QuizDifficulty): QuizQuestion[] {
  const pool = [...(difficulty === 'beginner' ? BEGINNER_QUIZ : EXPLORER_QUIZ)];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 4);
}

export function GematriaCalculatorGame({
  onBack,
  onCompleteRound,
}: GematriaCalculatorGameProps) {
  const [mode, setMode] = useState<Mode>('calculator');

  // Calculator state
  const [inputText, setInputText] = useState('שלום');
  const [savedWords, setSavedWords] = useState<SavedWord[]>([
    { id: 'seed-1', hebrew: 'אחד', total: 13 },
    { id: 'seed-2', hebrew: 'אהבה', total: 13 },
  ]);
  const [justSavedMsg, setJustSavedMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Word Detective Quiz state
  const [quizDifficulty, setQuizDifficulty] = useState<QuizDifficulty>('beginner');
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() =>
    pickQuizRound('beginner')
  );
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showQuizHint, setShowQuizHint] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  const analysis = useMemo(() => analyzeGematria(inputText), [inputText]);

  const matchingTwins = useMemo(() => {
    if (analysis.total <= 0) return [];
    const entries = GEMATRIA_TWINS[analysis.total] ?? [];
    const normalizedInput = normalizeForCompare(inputText);
    // Show related facts even if it's the exact word, prioritizing different twin words first
    const otherTwins = entries.filter(
      (e) => normalizeForCompare(e.hebrew) !== normalizedInput
    );
    return otherTwins.length > 0 ? otherTwins : entries;
  }, [analysis.total, inputText]);

  const savedCombinedTotal = useMemo(
    () => savedWords.reduce((sum, item) => sum + item.total, 0),
    [savedWords]
  );

  function appendChar(ch: string) {
    playTap();
    setInputText((prev) => {
      if (prev.length >= 40) return prev;
      return prev + ch;
    });
    inputRef.current?.focus();
  }

  function handleBackspace() {
    playTap();
    setInputText((prev) => prev.slice(0, -1));
    inputRef.current?.focus();
  }

  function handleClear() {
    playTap();
    setInputText('');
    inputRef.current?.focus();
  }

  function loadPreset(hebrew: string) {
    playTap();
    setInputText(hebrew);
  }

  function handleSaveWord() {
    const trimmed = inputText.trim();
    if (!trimmed || analysis.total === 0) return;
    playSuccess();
    setSavedWords((prev) => {
      const exists = prev.some(
        (w) => normalizeForCompare(w.hebrew) === normalizeForCompare(trimmed)
      );
      if (exists) return prev;
      return [{ id: `${Date.now()}`, hebrew: trimmed, total: analysis.total }, ...prev].slice(0, 8);
    });
    setJustSavedMsg(`Saved "${trimmed}" (= ${analysis.total})`);
    window.setTimeout(() => setJustSavedMsg(null), 1800);
  }

  function removeSavedWord(id: string) {
    playTap();
    setSavedWords((prev) => prev.filter((item) => item.id !== id));
  }

  // Quiz handlers
  function startQuiz(diff: QuizDifficulty) {
    playTap();
    setQuizDifficulty(diff);
    setQuizQuestions(pickQuizRound(diff));
    setQuizIdx(0);
    setQuizAnswer('');
    setQuizFeedback('idle');
    setShowQuizHint(false);
    setQuizScore(0);
    setQuizDone(false);
  }

  function checkQuizAnswer(e: React.FormEvent) {
    e.preventDefault();
    const current = quizQuestions[quizIdx];
    if (!current) return;
    const numeric = Number(quizAnswer.trim());
    if (!Number.isFinite(numeric) || quizAnswer.trim() === '') return;

    if (numeric === current.answer) {
      playSuccess();
      const earned = showQuizHint ? 20 : 30;
      const nextScore = quizScore + earned;
      setQuizScore(nextScore);
      setQuizFeedback('correct');

      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        if (quizIdx + 1 >= quizQuestions.length) {
          playFanfare();
          setQuizDone(true);
          onCompleteRound(nextScore);
        } else {
          setQuizIdx((i) => i + 1);
          setQuizAnswer('');
          setQuizFeedback('idle');
          setShowQuizHint(false);
        }
      }, 900);
    } else {
      playTryAgain();
      setQuizFeedback('wrong');
    }
  }

  const currentQuizQ = quizQuestions[quizIdx];
  const currentQuizLetters = useMemo(
    () => (currentQuizQ ? analyzeGematria(currentQuizQ.hebrew).allLetters : []),
    [currentQuizQ]
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>All Math Games</span>
        </button>

        {/* Segmented Mode Switch */}
        <div
          role="tablist"
          aria-label="Gematria Calculator modes"
          className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'calculator'}
            onClick={() => {
              playTap();
              setMode('calculator');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer ${
              mode === 'calculator'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Live Calculator</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'quiz'}
            onClick={() => {
              playTap();
              setMode('quiz');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 cursor-pointer ${
              mode === 'quiz'
                ? 'bg-white text-blue-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Word Detective Game</span>
          </button>
        </div>
      </div>

      {/* MODE 1: REAL-TIME GEMATRIA CALCULATOR */}
      {mode === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Zone: Live Input, Letter Tiles & Built-in Alef-Bet Keyboard */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
            {/* Title + Real-Time Sum */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500">
                  Standard Gematria (Mispar Hechrechi) · Real-Time Word &amp; Name Sum
                </p>
                <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mt-0.5">
                  Gematria Calculator{' '}
                  <span dir="rtl" className="text-blue-700 font-semibold text-xl">
                    מחשבון גימטריא
                  </span>
                </h1>
              </div>

              <div className="text-right shrink-0">
                <p className="text-xs font-medium text-slate-500">Gematria Total</p>
                <p
                  aria-live="polite"
                  className="font-mono text-4xl font-bold text-blue-700 tabular-nums leading-none mt-1"
                >
                  {analysis.total}
                </p>
              </div>
            </div>

            {/* Interactive Hebrew Typing Field */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label
                  htmlFor="hebrew-gematria-input"
                  className="text-xs font-semibold text-slate-700"
                >
                  Type a Hebrew word or name (or tap letters below)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSaveWord}
                    disabled={analysis.total === 0}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-40 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <BookmarkPlus className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Save to Notebook</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={inputText.length === 0}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Clear</span>
                  </button>
                </div>
              </div>

              <div className="relative">
                <input
                  ref={inputRef}
                  id="hebrew-gematria-input"
                  type="text"
                  dir="rtl"
                  lang="he"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="הקלד מילה או שם (לדוגמה: שלום או דוד)"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full rounded-xl border-2 border-slate-200 focus:border-blue-600 focus:outline-none bg-slate-50 focus:bg-white px-5 py-4 text-3xl sm:text-4xl font-bold text-slate-900 placeholder:text-slate-400 placeholder:text-lg placeholder:font-normal transition-colors"
                />
              </div>

              {analysis.hasIgnoredLatinOrDigits && (
                <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3.5 py-2">
                  Tip: English letters and digits aren’t counted in Gematria—tap the Hebrew Alef-Bet keys below (or switch your keyboard to Hebrew) to add Hebrew letters!
                </p>
              )}

              {justSavedMsg && (
                <p
                  role="status"
                  className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg px-3.5 py-2 inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                  <span>{justSavedMsg}</span>
                </p>
              )}
            </div>

            {/* Letter-by-Letter Visual Breakdown */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>Letter-by-Letter Breakdown (read right-to-left)</span>
                <span className="font-mono tabular-nums">
                  {analysis.allLetters.length}{' '}
                  {analysis.allLetters.length === 1 ? 'letter' : 'letters'}
                </span>
              </div>

              {analysis.allLetters.length === 0 ? (
                <div className="py-6 text-center text-sm text-slate-500">
                  Type a Hebrew word above or pick a name from the right to see every letter’s Gematria value light up!
                </div>
              ) : (
                <div className="space-y-4">
                  <div
                    dir="rtl"
                    className="flex flex-wrap items-center justify-center gap-4"
                  >
                    {analysis.words.map((word, wIdx) => (
                      <div
                        key={`${word.raw}-${wIdx}`}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {word.letters.map((tile, lIdx) => {
                            const tone =
                              tile.group === 'hundreds'
                                ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                                : tile.group === 'tens'
                                ? 'border-blue-300 bg-blue-50 text-blue-950'
                                : 'border-amber-300 bg-amber-50 text-amber-950';
                            return (
                              <div
                                key={`${tile.char}-${wIdx}-${lIdx}`}
                                className={`min-w-[3.75rem] px-2 py-2.5 rounded-xl border-2 flex flex-col items-center justify-center ${tone}`}
                              >
                                <span className="text-2xl font-bold leading-none">
                                  {tile.char}
                                </span>
                                <span className="font-mono text-xs font-bold tabular-nums mt-1">
                                  {tile.value}
                                </span>
                                <span className="text-[10px] opacity-75 mt-0.5 whitespace-nowrap">
                                  {tile.name}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        {analysis.words.length > 1 && (
                          <span className="font-mono text-xs font-semibold text-slate-600 tabular-nums">
                            {word.raw} = {word.sum}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Live Addition Equation */}
                  <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 font-mono text-sm text-slate-800 tabular-nums">
                    <span className="break-all">
                      {analysis.allLetters.map((l) => l.value).join(' + ')} ={' '}
                      <strong className="text-blue-700">{analysis.total}</strong>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Place-Value Breakdown Strip */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3.5">
                <p className="text-xs text-emerald-900">Hundreds (ק–ת)</p>
                <p className="font-mono text-lg font-bold text-emerald-800 tabular-nums mt-0.5">
                  {analysis.hundredsSum}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3.5">
                <p className="text-xs text-blue-900">Tens (י–צ)</p>
                <p className="font-mono text-lg font-bold text-blue-800 tabular-nums mt-0.5">
                  {analysis.tensSum}
                </p>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3.5">
                <p className="text-xs text-amber-900">Ones (א–ט)</p>
                <p className="font-mono text-lg font-bold text-amber-900 tabular-nums mt-0.5">
                  {analysis.onesSum}
                </p>
              </div>
            </div>

            {/* Gematria Twin / Fun Torah Discovery Callout */}
            {matchingTwins.length > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800">
                  <BookOpen className="w-4 h-4 text-emerald-700 shrink-0" aria-hidden="true" />
                  <span>
                    Torah Gematria Connection ({analysis.total})
                  </span>
                </div>
                <div className="space-y-2">
                  {matchingTwins.map((twin) => (
                    <div
                      key={twin.hebrew}
                      className="flex items-start justify-between gap-3 text-sm text-emerald-950"
                    >
                      <div>
                        <p className="font-semibold">
                          {twin.translit} · {twin.meaning}
                        </p>
                        <p className="text-xs text-emerald-900/90 leading-relaxed mt-0.5">
                          {twin.fact}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => loadPreset(twin.hebrew)}
                        dir="rtl"
                        className="px-2.5 py-1 rounded-md bg-white border border-emerald-300 text-base font-bold text-emerald-900 hover:bg-emerald-100 shrink-0 cursor-pointer"
                        title={`Load ${twin.translit}`}
                      >
                        {twin.hebrew}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Built-In Click-to-Type Hebrew Alef-Bet Keyboard */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-slate-700">
                  Tap-to-Type Hebrew Keyboard (Standard Values)
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => appendChar(' ')}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Space className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Space</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleBackspace}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Delete className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Backspace</span>
                  </button>
                </div>
              </div>

              {(
                [
                  { key: 'ones', label: 'Ones (1–9)', items: HEBREW_LETTERS.filter((l) => l.group === 'ones') },
                  { key: 'tens', label: 'Tens (10–90)', items: HEBREW_LETTERS.filter((l) => l.group === 'tens' && !l.isSofit) },
                  { key: 'hundreds', label: 'Hundreds (100–400)', items: HEBREW_LETTERS.filter((l) => l.group === 'hundreds') },
                  { key: 'sofit', label: 'Final Letters — Sofit (Same Standard Values)', items: HEBREW_LETTERS.filter((l) => l.isSofit) },
                ] as const
              ).map((row) => (
                <div key={row.key}>
                  <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                    {row.label}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {row.items.map((letter) => (
                      <button
                        key={letter.char}
                        type="button"
                        onClick={() => appendChar(letter.char)}
                        title={`${letter.name} = ${letter.value}`}
                        className="w-11 h-12 rounded-lg border border-slate-200 bg-white hover:border-blue-600 hover:bg-blue-50 active:scale-95 flex flex-col items-center justify-center transition-all cursor-pointer"
                      >
                        <span className="text-lg font-bold text-slate-900 leading-none">
                          {letter.char}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500 tabular-nums mt-0.5">
                          {letter.value}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Zone: Names, Famous Torah Words & Comparison Notebook */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between gap-6">
            <div className="space-y-6">
              {/* Popular Hebrew Names */}
              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1">
                  Try a Hebrew Name
                </p>
                <p className="text-xs text-slate-500 mb-3">
                  Tap any name to calculate its Gematria, or spell your own name!
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
                  {NAME_PRESETS.map((preset) => {
                    const sum = analyzeGematria(preset.hebrew).total;
                    const isActive =
                      normalizeForCompare(inputText) === normalizeForCompare(preset.hebrew);
                    return (
                      <button
                        key={preset.hebrew}
                        type="button"
                        onClick={() => loadPreset(preset.hebrew)}
                        className={`px-3 py-2 rounded-lg border text-left transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                          isActive
                            ? 'border-blue-600 bg-blue-50 text-blue-950'
                            : 'border-slate-200 bg-white hover:border-blue-500 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate">{preset.label}</p>
                          <p className="font-mono text-[11px] text-slate-500 tabular-nums">
                            = {sum}
                          </p>
                        </div>
                        <span
                          dir="rtl"
                          className="text-lg font-bold text-blue-800 shrink-0"
                        >
                          {preset.hebrew}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Famous Torah Words */}
              <div className="pt-5 border-t border-slate-200">
                <p className="text-xs font-semibold text-slate-700 mb-2.5">
                  Famous Torah Words
                </p>
                <div className="flex flex-wrap gap-2">
                  {TORAH_WORD_PRESETS.map((preset) => {
                    const sum = analyzeGematria(preset.hebrew).total;
                    const isActive =
                      normalizeForCompare(inputText) === normalizeForCompare(preset.hebrew);
                    return (
                      <button
                        key={preset.hebrew}
                        type="button"
                        onClick={() => loadPreset(preset.hebrew)}
                        className={`px-3 py-1.5 rounded-lg border text-xs transition-colors inline-flex items-center gap-2 cursor-pointer ${
                          isActive
                            ? 'border-blue-600 bg-blue-50 text-blue-950 font-semibold'
                            : 'border-slate-200 bg-white hover:border-blue-500 text-slate-700'
                        }`}
                      >
                        <span dir="rtl" className="text-sm font-bold text-blue-800">
                          {preset.hebrew}
                        </span>
                        <span>{preset.label}</span>
                        <span className="font-mono text-slate-400 tabular-nums">
                          {sum}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* My Gematria Notebook (Compare Words & Names) */}
              <div className="pt-5 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-slate-700">
                      My Gematria Notebook
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Save words or family names to compare their totals
                    </p>
                  </div>
                  {savedWords.length > 0 && (
                    <span className="font-mono text-xs font-semibold text-slate-600 tabular-nums">
                      Sum: {savedCombinedTotal}
                    </span>
                  )}
                </div>

                {savedWords.length === 0 ? (
                  <p className="text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    No words saved yet. Type a word or name and click <strong>Save to Notebook</strong>!
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {savedWords.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                      >
                        <button
                          type="button"
                          onClick={() => loadPreset(item.hebrew)}
                          className="flex-1 flex items-center justify-between gap-2 text-left cursor-pointer group"
                        >
                          <span
                            dir="rtl"
                            className="text-base font-bold text-slate-900 group-hover:text-blue-700"
                          >
                            {item.hebrew}
                          </span>
                          <span className="font-mono text-sm font-bold text-blue-700 tabular-nums">
                            = {item.total}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSavedWord(item.id)}
                          aria-label={`Remove ${item.hebrew}`}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Rule Reference Footer */}
            <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 leading-relaxed">
              <strong className="text-slate-700">How Standard Gematria Works:</strong>{' '}
              Alef–Tet count by <strong>1s</strong> (1–9), Yud–Tzadi count by{' '}
              <strong>10s</strong> (10–90), and Kuf–Tav count by{' '}
              <strong>100s</strong> (100–400). Final letters (ך ם ן ף ץ) keep the same standard value!
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: WORD DETECTIVE MINI-GAME */}
      {mode === 'quiz' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 max-w-2xl mx-auto space-y-6">
          {quizDone ? (
            <div className="text-center space-y-5 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
                <Star className="w-8 h-8 text-amber-500 fill-amber-500" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-emerald-700">
                  All 4 Hebrew Words Solved!
                </p>
                <h2 className="text-3xl font-bold text-slate-900">
                  Master Gematria Detective!
                </h2>
                <p className="text-sm text-slate-600">
                  You scored{' '}
                  <strong className="font-mono text-slate-900 tabular-nums">
                    {quizScore}
                  </strong>{' '}
                  points adding Hebrew letter values!
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => startQuiz(quizDifficulty)}
                  className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Play New Round</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('calculator')}
                  className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Back to Calculator
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Word Detective · Question {quizIdx + 1} of {quizQuestions.length}
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900 mt-0.5">
                    What is the Gematria of this word?
                  </h2>
                </div>

                <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => startQuiz('beginner')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      quizDifficulty === 'beginner'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Beginner
                  </button>
                  <button
                    type="button"
                    onClick={() => startQuiz('explorer')}
                    className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                      quizDifficulty === 'explorer'
                        ? 'bg-white text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Explorer
                  </button>
                </div>
              </div>

              {currentQuizQ && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center space-y-4">
                  <p className="text-sm font-medium text-slate-600">
                    {currentQuizQ.translit} ({currentQuizQ.meaning})
                  </p>

                  <div
                    dir="rtl"
                    className="flex flex-wrap items-center justify-center gap-3"
                  >
                    {currentQuizLetters.map((tile, idx) => (
                      <div
                        key={`${tile.char}-${idx}`}
                        className="w-16 h-20 rounded-xl border-2 border-blue-200 bg-white flex flex-col items-center justify-center"
                      >
                        <span className="text-3xl font-bold text-slate-900 leading-none">
                          {tile.char}
                        </span>
                        <span className="font-mono text-xs font-semibold text-blue-700 tabular-nums mt-1.5">
                          {showQuizHint ? tile.value : '?'}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => {
                        playTap();
                        setShowQuizHint(true);
                      }}
                      disabled={showQuizHint}
                      className="text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 disabled:opacity-60 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>
                        {showQuizHint
                          ? `Hint: ${currentQuizLetters.map((l) => l.value).join(' + ')}`
                          : 'Show Letter Values'}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              <form
                onSubmit={checkQuizAnswer}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
              >
                <label htmlFor="quiz-gematria-input" className="sr-only">
                  Enter Gematria sum
                </label>
                <input
                  id="quiz-gematria-input"
                  type="number"
                  inputMode="numeric"
                  value={quizAnswer}
                  onChange={(e) => {
                    setQuizAnswer(e.target.value);
                    if (quizFeedback !== 'idle') setQuizFeedback('idle');
                  }}
                  placeholder="Type the total number..."
                  className="flex-1 rounded-lg border border-slate-300 focus:border-blue-600 focus:outline-none px-4 py-3 font-mono text-lg font-semibold text-slate-900 tabular-nums"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Check Sum
                </button>
              </form>

              {quizFeedback === 'correct' && (
                <div
                  role="status"
                  className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-semibold text-emerald-900 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                  <span>
                    Spot on! {currentQuizQ?.hebrew} = {currentQuizQ?.answer}.
                  </span>
                </div>
              )}

              {quizFeedback === 'wrong' && (
                <div
                  role="status"
                  className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm font-medium text-amber-900"
                >
                  Not quite yet! Try tapping <strong>Show Letter Values</strong> to add each letter one by one.
                </div>
              )}

              {/* Quick Reference Cheat Sheet for Kids */}
              <div className="pt-4 border-t border-slate-200">
                <p className="text-[11px] font-medium text-slate-500 mb-2">
                  Alef-Bet Value Reference
                </p>
                <div
                  dir="rtl"
                  className="flex flex-wrap gap-1.5 text-[11px] font-mono text-slate-700 tabular-nums"
                >
                  {HEBREW_LETTERS.filter((l) => !l.isSofit).map((l) => (
                    <span
                      key={l.char}
                      className="px-2 py-1 rounded bg-slate-100 border border-slate-200"
                    >
                      <strong className="font-sans text-xs text-slate-900">
                        {l.char}
                      </strong>{' '}
                      {l.value}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
