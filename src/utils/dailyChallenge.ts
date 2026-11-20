import type { LessonId, TrackType } from '../data/lessons';

export interface DailyMathChallenge {
  dateKey: string;
  challengeNumber: number;
  track: TrackType;
  sourceRef: string;
  topic: string;
  title: string;
  hebrewTitle: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
  relatedLessonId: LessonId;
}

export interface DayCountdown {
  hours: number;
  minutes: number;
  seconds: number;
  formatted: string;
  percentElapsed: number;
}

export function getLocalDateKey(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTimeRemainingInDay(now = new Date()): DayCountdown {
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  const totalMs = endOfDay.getTime() - startOfDay.getTime();
  const remainingMs = Math.max(0, endOfDay.getTime() - now.getTime());
  const totalSec = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSec / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;
  const formatted = `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  const percentElapsed = Math.min(100, Math.max(0, Math.round(((totalMs - remainingMs) / totalMs) * 100)));
  return { hours, minutes, seconds, formatted, percentElapsed };
}

/**
 * Deterministic 32-bit PRNG (Mulberry32) seeded from YYYY-MM-DD so every day
 * automatically generates a unique, reproducible, mathematically exact problem.
 */
function createDateRng(dateKey: string): () => number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < dateKey.length; i++) {
    h ^= dateKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let state = h >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

function buildShuffledOptions(
  rng: () => number,
  correctLabel: string,
  distractors: string[]
): { options: string[]; correctIndex: number } {
  const uniqueDistractors = Array.from(
    new Set(distractors.filter((d) => d !== correctLabel))
  ).slice(0, 3);
  const combined = [correctLabel, ...uniqueDistractors];

  // Fisher-Yates deterministic shuffle
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  return {
    options: combined,
    correctIndex: combined.indexOf(correctLabel),
  };
}

function computeChallengeNumber(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  const target = Date.UTC(y || 2026, (m || 1) - 1, d || 1);
  const origin = Date.UTC(2026, 0, 1);
  const diffDays = Math.floor((target - origin) / (1000 * 60 * 60 * 24));
  return Math.max(1, diffDays + 1);
}

function formatClockTime(totalMinutes: number): string {
  const minsInDay = ((totalMinutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(minsInDay / 60);
  const m = minsInDay % 60;
  const suffix = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}

export function generateDailyMathChallenge(
  dateKey = getLocalDateKey()
): DailyMathChallenge {
  const rng = createDateRng(`cheshbon-daily-${dateKey}`);
  const challengeNumber = computeChallengeNumber(dateKey);
  const templateIndex = (challengeNumber + Math.floor(rng() * 12)) % 12;

  switch (templateIndex) {
    // 0. Chanukah Multi-Menorah Candle Count (Torah / Shabbat 21b)
    case 0: {
      const menorahs = pick(rng, [2, 3, 4, 5, 6] as const);
      const includeShamash = rng() > 0.4;
      const perMenorah = includeShamash ? 44 : 36;
      const answer = menorahs * perMenorah;
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        `${answer} candles`,
        [
          `${answer - 8 * menorahs} candles`,
          `${answer + 8} candles`,
          `${menorahs * (includeShamash ? 36 : 44)} candles`,
          `${answer + 12} candles`,
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'torah',
        sourceRef: 'Shabbat 21b',
        topic: 'Addition Patterns & Multiplication',
        title: 'Multi-Menorah Candle Count',
        hebrewTitle: 'נרות חנוכה',
        question: includeShamash
          ? `A family lights ${menorahs} menorahs for all 8 nights of Chanukah (44 candles per menorah, including the Shamash). How many candles do they need in total?`
          : `A classroom lights ${menorahs} menorahs for all 8 nights of Chanukah (36 night candles per menorah, not counting the Shamash). How many night candles is that in total?`,
        options,
        correctIndex,
        hint: `Multiply ${menorahs} menorahs by ${perMenorah} candles each (split ${perMenorah} into ${Math.floor(perMenorah / 10) * 10} + ${perMenorah % 10}).`,
        explanation: `${menorahs} × ${perMenorah} = ${answer} candles! (${menorahs} × ${Math.floor(perMenorah / 10) * 10} = ${menorahs * Math.floor(perMenorah / 10) * 10}, plus ${menorahs} × ${perMenorah % 10} = ${menorahs * (perMenorah % 10)}).`,
        relatedLessonId: 'chanukah-candles',
      };
    }

    // 1. Noah's Ark Deck Area & Scaling (Torah / Bereishit 6:15)
    case 1: {
      const length = pick(rng, [40, 60, 80, 100, 120, 150, 200] as const);
      const width = pick(rng, [20, 30, 40, 50] as const);
      const decks = pick(rng, [2, 3] as const);
      const oneDeck = length * width;
      const totalArea = oneDeck * decks;
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        `${totalArea.toLocaleString()} sq. amot`,
        [
          `${oneDeck.toLocaleString()} sq. amot`,
          `${(totalArea + oneDeck).toLocaleString()} sq. amot`,
          `${((length + width) * decks).toLocaleString()} sq. amot`,
          `${(totalArea - Math.floor(oneDeck / 2)).toLocaleString()} sq. amot`,
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'torah',
        sourceRef: 'Bereishit 6:15–16',
        topic: 'Area & Multi-Step Multiplication',
        title: "Mini-Ark Blueprint Floor Space",
        hebrewTitle: 'תיבת נח',
        question: `Imagine building a wooden model Ark that is ${length} amot long and ${width} amot wide, with ${decks} identical decks stacked inside. What is the TOTAL floor area across all ${decks} decks?`,
        options,
        correctIndex,
        hint: `First find 1 deck’s area (${length} × ${width} = ${oneDeck.toLocaleString()}), then multiply by ${decks} decks.`,
        explanation: `One deck is ${length} × ${width} = ${oneDeck.toLocaleString()} square amot. Multiply by ${decks} decks to get ${totalArea.toLocaleString()} square amot!`,
        relatedLessonId: 'noahs-ark',
      };
    }

    // 2. Two Holding a Tallit Fair Division (Gemara / Bava Metzia 2a)
    case 2: {
      const quarterValue = pick(rng, [10, 15, 20, 25, 30, 35, 40, 45, 50, 60] as const);
      const totalZuz = quarterValue * 4;
      const askReuven = rng() > 0.45;
      const answer = askReuven ? quarterValue * 3 : quarterValue;
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        `${answer} zuz`,
        [
          `${quarterValue * 2} zuz`,
          `${askReuven ? quarterValue : quarterValue * 3} zuz`,
          `${Math.round(totalZuz / 3)} zuz`,
          `${answer + 10} zuz`,
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'gemara',
        sourceRef: 'Bava Metzia 2a',
        topic: 'Fractions & Fair Division',
        title: 'Beit Din Silver Zuz Split',
        hebrewTitle: 'שנים אוחזין בטלית',
        question: `Reuven claims ALL of a tallit worth ${totalZuz} silver zuz, and Shimon claims HALF of it. Following Bava Metzia 2a (Reuven gets 3/4, Shimon gets 1/4), how many zuz does ${askReuven ? 'REUVEN' : 'SHIMON'} receive?`,
        options,
        correctIndex,
        hint: askReuven
          ? `First find 1/4 of ${totalZuz} (${totalZuz} ÷ 4 = ${quarterValue}), then multiply by 3 for Reuven’s 3/4 share.`
          : `Shimon receives 1/4 of the total value. Divide ${totalZuz} by 4!`,
        explanation: `1/4 of ${totalZuz} zuz is ${quarterValue} zuz (Shimon’s share), and 3/4 is 3 × ${quarterValue} = ${quarterValue * 3} zuz (Reuven’s share)!`,
        relatedLessonId: 'tallit-fractions',
      };
    }

    // 3. Eruvin Circle Circumference Estimation (Gemara / Eruvin 14a)
    case 3: {
      const diameter = pick(rng, [6, 7, 9, 11, 12, 14, 15, 16, 18, 20] as const);
      const answer = diameter * 3;
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        `${answer} tefachim`,
        [
          `${diameter * 2} tefachim`,
          `${diameter * 4} tefachim`,
          `${diameter + 3} tefachim`,
          `${answer + 6} tefachim`,
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'gemara',
        sourceRef: 'Eruvin 14a',
        topic: 'Circles & Estimation (C ≈ 3 × d)',
        title: 'Sages’ Round Courtyard Estimate',
        hebrewTitle: 'עגולה בעירובין',
        question: `A round stone well in the Mishnah measures ${diameter} tefachim straight across (diameter). Using the Sages’ quick rule in Eruvin 14a (Circumference ≈ 3 × Diameter), about how many tefachim is it all the way around?`,
        options,
        correctIndex,
        hint: `Multiply the diameter (${diameter}) by 3.`,
        explanation: `3 × ${diameter} = ${answer} tefachim! (Using exact π ≈ 3.14, it is about ${(diameter * Math.PI).toFixed(1)} tefachim.)`,
        relatedLessonId: 'sukkah-geometry',
      };
    }

    // 4. Sukkah Square Diagonal Shortcut (Gemara / Sukkah 8a)
    case 4: {
      const side = pick(rng, [5, 10, 15, 20, 25, 30] as const);
      const answer = Math.round(side * 1.4);
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        `${answer} tefachim`,
        [
          `${side + 2} tefachim`,
          `${side * 2} tefachim`,
          `${answer + 3} tefachim`,
          `${Math.max(4, answer - 2)} tefachim`,
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'gemara',
        sourceRef: 'Sukkah 8a',
        topic: 'Square Diagonals (1.4 × side)',
        title: 'Round Sukkah Diagonal Check',
        hebrewTitle: 'אלכסון הסוכה',
        question: `A square Sukkah has walls that are ${side} tefachim long on each side. Using Sukkah 8a’s diagonal rule (Diagonal ≈ 1 and 2/5, or 1.4, times the side), about how long is its corner-to-corner diagonal?`,
        options,
        correctIndex,
        hint: `Split 1.4 × ${side} into (1 × ${side}) + (2/5 × ${side}). Since 1/5 of ${side} is ${side / 5}, 2/5 is ${(side / 5) * 2}!`,
        explanation: `${side} + ${(side / 5) * 2} = ${answer} tefachim! That means a round tent needs a diameter of about ${answer} tefachim to fit this square Sukkah inside.`,
        relatedLessonId: 'sukkah-geometry',
      };
    }

    // 5. Batel B'Shishim 1:60 Kitchen Ratio (Gemara / Chullin 98a)
    case 5: {
      const drops = pick(rng, [2, 3, 4, 5, 6, 7, 8] as const);
      const needed = drops * 60;
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        `${needed} spoons`,
        [
          `${drops * 60 - 60} spoons`,
          `${drops * 60 + 60} spoons`,
          `${drops + 60} spoons`,
          `${drops * 30} spoons`,
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'gemara',
        sourceRef: 'Chullin 98a',
        topic: 'Ratios & Multiplying by 60',
        title: 'Shabbat Soup Pot 60:1 Check',
        hebrewTitle: 'בטל בשישים',
        question: `While cooking for a big Shabbat meal, ${drops} spoons of non-kosher sauce accidentally fall into a soup pot. Following Batel B’Shishim (60:1), how many spoons of kosher soup are needed?`,
        options,
        correctIndex,
        hint: `Multiply ${drops} × 6 = ${drops * 6}, then add a zero to multiply by 60!`,
        explanation: `${drops} × 60 = ${needed} spoons of kosher soup! Notice ${needed} : ${drops} simplifies right back to 60 : 1.`,
        relatedLessonId: 'batel-bshishim',
      };
    }

    // 6. Gematria Place-Value Challenge (Torah / Hebrew Alphabet)
    case 6: {
      const words = [
        { hebrew: 'שבת', name: 'Shabbat', breakdown: 'Shin (300) + Bet (2) + Tav (400)', total: 702 },
        { hebrew: 'ברכה', name: 'Brachah (Blessing)', breakdown: 'Bet (2) + Resh (200) + Kaf (20) + Hei (5)', total: 227 },
        { hebrew: 'שמחה', name: 'Simchah (Joy)', breakdown: 'Shin (300) + Mem (40) + Chet (8) + Hei (5)', total: 353 },
        { hebrew: 'מצוה', name: 'Mitzvah', breakdown: 'Mem (40) + Tzadi (90) + Vav (6) + Hei (5)', total: 141 },
        { hebrew: 'חכמה', name: 'Chochmah (Wisdom)', breakdown: 'Chet (8) + Kaf (20) + Mem (40) + Hei (5)', total: 73 },
        { hebrew: 'מזל', name: 'Mazal', breakdown: 'Mem (40) + Zayin (7) + Lamed (30)', total: 77 },
        { hebrew: 'צדיק', name: 'Tzaddik', breakdown: 'Tzadi (90) + Dalet (4) + Yud (10) + Kuf (100)', total: 204 },
      ] as const;
      const w = pick(rng, words);
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        `${w.total}`,
        [
          `${w.total - 10}`,
          `${w.total + 10}`,
          `${w.total + 20}`,
          `${w.total - 2}`,
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'torah',
        sourceRef: 'Hebrew Gematria',
        topic: 'Place Value & Mental Addition',
        title: `Decode ${w.name} in Gematria`,
        hebrewTitle: w.hebrew,
        question: `The Hebrew word ${w.hebrew} (${w.name}) is spelled with ${w.breakdown}. What is its total Gematria value?`,
        options,
        correctIndex,
        hint: `Group the Hundreds, Tens, and Ones separately first, then combine them!`,
        explanation: `Adding ${w.breakdown} gives a total Gematria of ${w.total}!`,
        relatedLessonId: 'gematria-workshop',
      };
    }

    // 7. Shulchan Aruch Shaot Zmaniyot (Orach Chaim 58:1)
    case 7: {
      const seasons = [
        { label: 'short winter day', hours: 10, mins: 600, shaah: 50, sunriseMin: 7 * 60 },
        { label: 'balanced spring day', hours: 12, mins: 720, shaah: 60, sunriseMin: 6 * 60 + 30 },
        { label: 'long summer day', hours: 14, mins: 840, shaah: 70, sunriseMin: 5 * 60 + 30 },
        { label: 'late autumn day', hours: 10, mins: 600, shaah: 50, sunriseMin: 6 * 60 + 40 },
        { label: 'midsummer day', hours: 14, mins: 840, shaah: 70, sunriseMin: 5 * 60 + 20 },
      ] as const;
      const s = pick(rng, seasons);
      const targetHour = pick(rng, [3, 4] as const);
      const mitzvahLabel = targetHour === 3 ? 'Latest Shema (3 Halachic Hours)' : 'Latest Shacharit (4 Halachic Hours)';
      const elapsed = targetHour * s.shaah;
      const answerTime = formatClockTime(s.sunriseMin + elapsed);
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        answerTime,
        [
          formatClockTime(s.sunriseMin + elapsed - 30),
          formatClockTime(s.sunriseMin + elapsed + 30),
          formatClockTime(s.sunriseMin + targetHour * 60),
          formatClockTime(s.sunriseMin + elapsed + 20),
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'shulchan-aruch',
        sourceRef: targetHour === 3 ? 'Orach Chaim 58:1' : 'Orach Chaim 89:1',
        topic: 'Time & Halachic Daylight Hours',
        title: `Find ${targetHour === 3 ? 'Latest Shema' : 'Latest Shacharit'}`,
        hebrewTitle: 'שעות זמניות',
        question: `On a ${s.label} with ${s.hours} hours of sunlight (1 Halachic Hour = ${s.shaah} minutes), sunrise is at ${formatClockTime(s.sunriseMin)}. When is ${mitzvahLabel}?`,
        options,
        correctIndex,
        hint: `Multiply ${targetHour} × ${s.shaah} = ${elapsed} minutes (${Math.floor(elapsed / 60)} hr ${elapsed % 60} min), then add that to ${formatClockTime(s.sunriseMin)}.`,
        explanation: `${targetHour} × ${s.shaah} minutes = ${elapsed} minutes (${Math.floor(elapsed / 60)} hours and ${elapsed % 60} minutes). Starting at ${formatClockTime(s.sunriseMin)}, that lands on ${answerTime}!`,
        relatedLessonId: 'shaot-zmaniyot',
      };
    }

    // 8. Shulchan Aruch Maaser 10% & Chomesh 20% (Yoreh Deah 249:1)
    case 8: {
      const earnings = pick(rng, [40, 70, 90, 110, 120, 130, 150, 160, 180, 200] as const);
      const isChomesh = rng() > 0.5;
      const maaser = earnings / 10;
      const answer = isChomesh ? maaser * 2 : maaser;
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        `$${answer}`,
        [
          `$${isChomesh ? maaser : maaser * 2}`,
          `$${answer + 5}`,
          `$${Math.max(2, answer - 4)}`,
          `$${earnings - answer}`,
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 249:1',
        topic: 'Percentages (10% & 20%)',
        title: isChomesh ? 'Generous Chomesh (20%) Calculation' : 'Daily Maaser (10%) Pushka Count',
        hebrewTitle: 'מעשר כספים',
        question: isChomesh
          ? `You earn $${earnings} helping neighbors this week and decide to give the generous Chomesh level (20%) to Tzedakah. How much goes into the Tzedakah pushka?`
          : `You earn $${earnings} from a weekend bake sale and set aside 10% Maaser for Tzedakah (Yoreh Deah 249:1). How much goes into the pushka?`,
        options,
        correctIndex,
        hint: isChomesh
          ? `First find 10% by dropping the zero ($${earnings} ÷ 10 = $${maaser}), then double it for 20%!`
          : `Use the Drop-the-Zero trick: divide $${earnings} by 10!`,
        explanation: isChomesh
          ? `10% of $${earnings} is $${maaser}, and doubling it for 20% Chomesh gives $${answer} for Tzedakah!`
          : `$${earnings} ÷ 10 = $${maaser} for Tzedakah, leaving $${earnings - maaser} to keep!`,
        relatedLessonId: 'maaser-percent',
      };
    }

    // 9. Shulchan Aruch Mezuzah Top Third (Yoreh Deah 289:2)
    case 9: {
      const third = pick(rng, [24, 25, 26, 27, 28, 30, 32, 33] as const);
      const doorHeight = third * 3;
      const topThirdStart = third * 2;
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        `${topThirdStart} inches`,
        [
          `${third} inches`,
          `${Math.round(doorHeight / 2)} inches`,
          `${topThirdStart + 10} inches`,
          `${doorHeight - 2} inches`,
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 289:2',
        topic: 'Fractions (Thirds) & Measurement',
        title: 'Doorway Blueprint for a Mezuzah',
        hebrewTitle: 'קביעת מזוזה',
        question: `A school doorway measures ${doorHeight} inches tall. Following Shulchan Aruch Yoreh Deah 289:2, you divide the doorway into 3 equal thirds and place the Mezuzah at the start of the TOP THIRD (the 2/3 line). How many inches above the floor is that?`,
        options,
        correctIndex,
        hint: `First divide ${doorHeight} ÷ 3 = ${third} inches per third, then multiply ${third} × 2 for two-thirds!`,
        explanation: `${doorHeight} ÷ 3 = ${third} inches per third. Two thirds up from the floor is 2 × ${third} = ${topThirdStart} inches!`,
        relatedLessonId: 'mezuzah-thirds',
      };
    }

    // 10. Pi Circle Area in the Gemara (Eruvin 76b)
    case 10: {
      const radius = pick(rng, [2, 3, 4, 5, 6, 8, 9, 10] as const);
      const rSq = radius * radius;
      const answer = 3 * rSq;
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        `${answer} sq. amot`,
        [
          `${radius * 6} sq. amot`,
          `${4 * rSq} sq. amot`,
          `${2 * rSq} sq. amot`,
          `${answer + 12} sq. amot`,
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'gemara',
        sourceRef: 'Eruvin 76b',
        topic: 'Pi (π ≈ 3) & Circle Area',
        title: 'Eruvin 76b Circle Area Shortcut',
        hebrewTitle: 'יחס העיגול (π)',
        question: `Using the Gemara’s Eruvin 76b area rule (Area ≈ 3 × r²), about what is the area of a round courtyard with radius r = ${radius} amot?`,
        options,
        correctIndex,
        hint: `First square the radius (${radius} × ${radius} = ${rSq}), then multiply ${rSq} × 3!`,
        explanation: `r² = ${radius} × ${radius} = ${rSq}, and 3 × ${rSq} = ${answer} square amot!`,
        relatedLessonId: 'pi-gemara',
      };
    }

    // 11. Exponents & Squares in the Gemara (Eruvin 23b · Berachot 32b)
    default: {
      const pairs = [
        { b: 2, e: 4, label: '2⁴', val: 16, trap: 8 },
        { b: 2, e: 5, label: '2⁵', val: 32, trap: 10 },
        { b: 3, e: 3, label: '3³', val: 27, trap: 9 },
        { b: 4, e: 3, label: '4³', val: 64, trap: 12 },
        { b: 5, e: 3, label: '5³', val: 125, trap: 15 },
        { b: 6, e: 2, label: '6²', val: 36, trap: 12 },
        { b: 7, e: 2, label: '7²', val: 49, trap: 14 },
        { b: 10, e: 4, label: '10⁴', val: 10000, trap: 40 },
      ] as const;
      const p = pick(rng, pairs);
      const { options, correctIndex } = buildShuffledOptions(
        rng,
        `${p.val.toLocaleString()}`,
        [
          `${p.trap.toLocaleString()}`,
          `${(p.val + p.b).toLocaleString()}`,
          `${Math.max(2, Math.floor(p.val / 2)).toLocaleString()}`,
          `${(p.val * 2).toLocaleString()}`,
        ]
      );
      return {
        dateKey,
        challengeNumber,
        track: 'gemara',
        sourceRef: 'Berachot 32b · Eruvin 23b',
        topic: 'Exponents & Repeated Multiplication',
        title: `Gemara Powers Challenge (${p.label})`,
        hebrewTitle: 'חזקות וריבועים',
        question: `Remember that an exponent means repeated multiplication (not ${p.b} × ${p.e}!). What is the exact value of ${p.label}?`,
        options,
        correctIndex,
        hint: `Multiply ${p.e} copies of ${p.b} together: ${Array.from({ length: p.e }, () => p.b).join(' × ')}.`,
        explanation: `${p.label} = ${Array.from({ length: p.e }, () => p.b).join(' × ')} = ${p.val.toLocaleString()}!`,
        relatedLessonId: 'exponents-gemara',
      };
    }
  }
}
