export type LessonId =
  | 'chanukah-candles'
  | 'noahs-ark'
  | 'tallit-fractions'
  | 'sukkah-geometry'
  | 'batel-bshishim'
  | 'gematria-workshop'
  | 'shaot-zmaniyot'
  | 'maaser-percent'
  | 'mezuzah-thirds'
  | 'pi-gemara'
  | 'exponents-gemara';

export type TrackType = 'torah' | 'gemara' | 'shulchan-aruch';

export function formatTrackLabel(track: TrackType): string {
  switch (track) {
    case 'torah':
      return 'Torah';
    case 'gemara':
      return 'Gemara';
    case 'shulchan-aruch':
      return 'Shulchan Aruch';
  }
}

export interface LessonStage {
  step: number;
  title: string;
  prompt: string;
  takeaway: string;
}

export interface ChallengeQuestion {
  id: string;
  lessonId: LessonId;
  track: TrackType;
  sourceRef: string;
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

export interface LessonDefinition {
  id: LessonId;
  order: number;
  track: TrackType;
  title: string;
  hebrewTitle: string;
  sourceRef: string;
  mathTopic: string;
  ageRange: string;
  summary: string;
  storyHook: string;
  formulaPreview: string;
  stages: LessonStage[];
  challenges: ChallengeQuestion[];
}

export const ASSET_IMAGES = {
  hero: '/src/assets/images/hero_cheshbon_study_1795105444886.jpg',
  torahTrack: '/src/assets/images/spotlight_torah_measures_1795105496498.jpg',
  gemaraTrack: '/src/assets/images/spotlight_gemara_puzzles_1795105729873.jpg',
  shulchanAruchTrack: '/src/assets/images/spotlight_shulchan_aruch_1795147963579.jpg',
  practiceArena: '/src/assets/images/spotlight_practice_arena_1795105910170.jpg',
  mathGames: '/src/assets/images/banner_math_games_arcade_1795144639083.jpg',
  beginnerGuide: '/src/assets/images/banner_beginner_guide_1795144639307.jpg',
} as const;

export const LESSONS: LessonDefinition[] = [
  {
    id: 'chanukah-candles',
    order: 1,
    track: 'torah',
    title: 'Counting the Chanukah Candles',
    hebrewTitle: 'נרות חנוכה',
    sourceRef: 'Shabbat 21b',
    mathTopic: 'Addition & Number Patterns',
    ageRange: 'Ages 6–9',
    summary:
      'Discover how adding one candle each night creates a staircase pattern—and use a clever pairing trick to count all 8 nights in seconds.',
    storyHook:
      'In the Talmud (Shabbat 21b), Beit Hillel says we add one candle each night of Chanukah (1, 2, 3... up to 8), while Beit Shammai says we start with 8 and count down (8, 7, 6... down to 1). Which school uses more candles over the whole holiday?',
    formulaPreview: '1 + 2 + … + 8 = 36 (+ 8 Shamash = 44)',
    stages: [
      {
        step: 1,
        title: 'Light Each Night',
        prompt:
          'Slide the night selector from Night 1 to Night 8 and watch the staircase of glowing flames grow.',
        takeaway: 'Every night adds 1 more candle than the night before.',
      },
      {
        step: 2,
        title: 'Compare Beit Hillel & Beit Shammai',
        prompt:
          'Switch between Beit Hillel and Beit Shammai. Notice what happens to the total number of candles across all 8 nights.',
        takeaway:
          'Addition works in any order! Going up 1→8 and going down 8→1 both add up to 36.',
      },
      {
        step: 3,
        title: 'Spot the Pair-of-9 Shortcut',
        prompt:
          'Pair Night 1 with Night 8 (1 + 8 = 9), Night 2 with Night 7 (2 + 7 = 9), and keep pairing. Add the Shamash to see the final box count.',
        takeaway: '4 pairs of 9 make 36 candles, plus 8 Shamash candles equals 44 candles per box!',
      },
    ],
    challenges: [
      {
        id: 'chanukah-1',
        lessonId: 'chanukah-candles',
        track: 'torah',
        sourceRef: 'Shabbat 21b',
        question:
          'Following Beit Hillel, how many candles do you light during the first 4 nights of Chanukah (not counting the Shamash)?',
        options: ['8 candles', '10 candles', '12 candles', '14 candles'],
        correctIndex: 1,
        hint: 'Add Night 1 + Night 2 + Night 3 + Night 4: 1 + 2 + 3 + 4.',
        explanation:
          '1 + 2 + 3 + 4 = 10 candles! Notice you can pair (1 + 4 = 5) and (2 + 3 = 5), and 5 + 5 = 10.',
      },
      {
        id: 'chanukah-2',
        lessonId: 'chanukah-candles',
        track: 'torah',
        sourceRef: 'Shabbat 21b',
        question:
          'Why does a standard Chanukah candle box come with 44 candles?',
        options: [
          '36 night candles + 8 Shamash candles',
          '40 night candles + 4 extra candles',
          '8 nights × 5 candles each',
          '32 night candles + 12 Shamash candles',
        ],
        correctIndex: 0,
        hint: 'First add 1 through 8 to get the night candles, then add 1 Shamash for each of the 8 nights.',
        explanation:
          '1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 = 36 night candles. Plus 1 Shamash on each of the 8 nights gives 36 + 8 = 44 candles!',
      },
      {
        id: 'chanukah-3',
        lessonId: 'chanukah-candles',
        track: 'torah',
        sourceRef: 'Shabbat 21b',
        question:
          'Over all 8 nights, who uses more candles: Beit Hillel (1 up to 8) or Beit Shammai (8 down to 1)?',
        options: [
          'Beit Hillel uses 8 more',
          'Beit Shammai uses 8 more',
          'They use the exact same number (36)',
          'Beit Shammai uses twice as many',
        ],
        correctIndex: 2,
        hint: 'Does changing the order of numbers you add change their sum?',
        explanation:
          'They both use 36 candles! Adding 1 + 2 + ... + 8 is the exact same sum as 8 + 7 + ... + 1.',
      },
      {
        id: 'chanukah-4',
        lessonId: 'chanukah-candles',
        track: 'torah',
        sourceRef: 'Shabbat 21b',
        question:
          'Suppose your family lights TWO menorahs every night for all 8 nights (including a Shamash on each). How many candles do you need in total?',
        options: ['72 candles', '80 candles', '88 candles', '96 candles'],
        correctIndex: 2,
        hint: 'One full menorah uses 44 candles. Double 44 (44 + 44)!',
        explanation:
          'One menorah uses 44 candles (36 + 8 Shamash). Two menorahs use 44 + 44 = 88 candles!',
      },
      {
        id: 'chanukah-5',
        lessonId: 'chanukah-candles',
        track: 'torah',
        sourceRef: 'Shabbat 21b',
        question:
          'How many night candles do you light during the LAST 4 nights of Chanukah (Nights 5, 6, 7, and 8 combined, not counting the Shamash)?',
        options: ['22 candles', '26 candles', '30 candles', '36 candles'],
        correctIndex: 1,
        hint: 'Pair the ends: (5 + 8 = 13) and (6 + 7 = 13). Then add 13 + 13!',
        explanation:
          '5 + 6 + 7 + 8 = 26 candles! Pairing 5 + 8 = 13 and 6 + 7 = 13 makes mental addition super quick.',
      },
    ],
  },
  {
    id: 'noahs-ark',
    order: 2,
    track: 'torah',
    title: "Measuring Noah's Ark",
    hebrewTitle: 'תיבת נח',
    sourceRef: 'Bereishit 6:15–16',
    mathTopic: 'Multiplication, Area & Volume',
    ageRange: 'Ages 8–11',
    summary:
      'Step into the Torah blueprint of the Teivah: calculate floor area across 3 decks, multiply length × width × height for volume, and convert amot to feet.',
    storyHook:
      'In Bereishit 6:15, Hashem gives Noah exact blueprints: 300 amot (cubits) long, 50 amot wide, and 30 amot high, divided into 3 full decks. Let’s build the Ark mathematically to see how huge it really was!',
    formulaPreview: 'V = 300 × 50 × 30 = 450,000 cu. amot',
    stages: [
      {
        step: 1,
        title: 'Find One Deck’s Area',
        prompt:
          'Click "Torah Dimensions" to lock 300 × 50 × 30 amot, then look at the floor grid of Deck 1.',
        takeaway: 'Area = Length × Width = 300 × 50 = 15,000 square amot on a single deck.',
      },
      {
        step: 2,
        title: 'Stack All Three Decks',
        prompt:
          'Toggle between 1, 2, and 3 decks to see how total living floor space multiplies.',
        takeaway: '3 decks × 15,000 square amot = 45,000 square amot of floor space!',
      },
      {
        step: 3,
        title: 'Calculate 3D Volume & Convert Units',
        prompt:
          'Switch between Amot and Feet (1 amah ≈ 1.5 ft) and drag the sliders to test how resizing changes total volume.',
        takeaway: 'Volume = Length × Width × Height = 450,000 cubic amot—longer than 12 school buses!',
      },
    ],
    challenges: [
      {
        id: 'ark-1',
        lessonId: 'noahs-ark',
        track: 'torah',
        sourceRef: 'Bereishit 6:15',
        question:
          "Noah's Ark is 300 amot long and 50 amot wide. What is the floor area of ONE deck?",
        options: [
          '350 square amot',
          '1,500 square amot',
          '15,000 square amot',
          '150,000 square amot',
        ],
        correctIndex: 2,
        hint: 'Multiply 3 × 5 = 15, then count the three zeros in 300 and 50.',
        explanation:
          'Area = Length × Width = 300 × 50. Since 3 × 5 = 15 and there are three zeros total, the answer is 15,000 square amot.',
      },
      {
        id: 'ark-2',
        lessonId: 'noahs-ark',
        track: 'torah',
        sourceRef: 'Bereishit 6:16',
        question:
          'If each deck has 15,000 square amot of floor space and the Ark has 3 decks, how much total floor space is there?',
        options: [
          '30,000 square amot',
          '45,000 square amot',
          '60,000 square amot',
          '450,000 square amot',
        ],
        correctIndex: 1,
        hint: 'Multiply 15,000 by 3 decks (think of 15 × 3 = 45).',
        explanation: '15,000 × 3 = 45,000 square amot across the lower, middle, and upper decks.',
      },
      {
        id: 'ark-3',
        lessonId: 'noahs-ark',
        track: 'torah',
        sourceRef: 'Bereishit 6:15',
        question:
          'How many times longer is Noah’s Ark (300 amot) than it is wide (50 amot)?',
        options: ['3 times longer', '5 times longer', '6 times longer', '10 times longer'],
        correctIndex: 2,
        hint: 'Divide 300 by 50 (how many 50s fit inside 300?).',
        explanation:
          '300 ÷ 50 = 6. A 6-to-1 length-to-width ratio is actually very close to modern cargo ships for stability on waves!',
      },
      {
        id: 'ark-4',
        lessonId: 'noahs-ark',
        track: 'torah',
        sourceRef: 'Bereishit 6:15',
        question:
          "Noah's Ark is 300 amot long, 50 amot wide, and 30 amot high. What is the TOTAL 3D volume (Length × Width × Height)?",
        options: [
          '45,000 cubic amot',
          '150,000 cubic amot',
          '450,000 cubic amot',
          '900,000 cubic amot',
        ],
        correctIndex: 2,
        hint: 'Multiply one deck’s area (15,000) by the height (30). Think 15 × 3 = 45, then add four zeros!',
        explanation:
          'Volume = 300 × 50 × 30 = 15,000 × 30 = 450,000 cubic amot!',
      },
      {
        id: 'ark-5',
        lessonId: 'noahs-ark',
        track: 'torah',
        sourceRef: 'Bereishit 6:15',
        question:
          'If 1 amah is about 1.5 feet (1 and a half feet), about how tall is the 30-amah Ark in feet?',
        options: ['30 feet', '45 feet', '60 feet', '90 feet'],
        correctIndex: 1,
        hint: 'Take 30 feet plus half of 30 (which is 15 feet): 30 + 15.',
        explanation:
          '30 × 1.5 = 30 + 15 = 45 feet tall—roughly as high as a 4-story building!',
      },
    ],
  },
  {
    id: 'tallit-fractions',
    order: 3,
    track: 'gemara',
    title: 'Two Holding a Tallit',
    hebrewTitle: 'שנים אוחזין בטלית',
    sourceRef: 'Bava Metzia 2a',
    mathTopic: 'Fractions & Fair Division',
    ageRange: 'Ages 8–12',
    summary:
      'Solve the most famous opening puzzle in the Gemara! Separate what both friends agree on from what they argue over, then split the disputed piece in half.',
    storyHook:
      'Two kids, Reuven and Shimon, walk into Beit Din holding the same tallit. Reuven says, "All of it is mine!" Shimon says, "Half of it is mine!" How much does each friend get? Hint: It is NOT two-thirds and one-third!',
    formulaPreview: 'Reuven: 1/2 + 1/4 = 3/4  |  Shimon: 1/4',
    stages: [
      {
        step: 1,
        title: 'Test Equal Claims',
        prompt:
          'Start with "Both Claim All (1 vs 1)". Since they disagree over the entire tallit, they split it right down the middle.',
        takeaway: 'When the whole tallit is disputed, each friend receives 1/2.',
      },
      {
        step: 2,
        title: 'Solve the Classic Gemara Case',
        prompt:
          'Click "All vs. Half (Classic Gemara)". Notice that Shimon ONLY asks for half—so he agrees Reuven owns the other half!',
        takeaway:
          'Reuven keeps the undisputed 1/2 automatically. They split only the disputed 1/2 equally (1/4 each).',
      },
      {
        step: 3,
        title: 'Add Fractions & Count Coins',
        prompt:
          'Adjust the Tallit value in silver Zuz coins (try 120 Zuz) and check how 3/4 + 1/4 always rebuilds 1 whole.',
        takeaway: 'Reuven gets 1/2 + 1/4 = 3/4 (90 zuz) and Shimon gets 1/4 (30 zuz).',
      },
    ],
    challenges: [
      {
        id: 'tallit-1',
        lessonId: 'tallit-fractions',
        track: 'gemara',
        sourceRef: 'Bava Metzia 2a',
        question:
          'Reuven claims ALL of a tallit, and Shimon claims HALF of it. What fraction of the tallit does Reuven receive?',
        options: ['1/2', '2/3', '3/4', '7/8'],
        correctIndex: 2,
        hint: 'Reuven automatically keeps the undisputed 1/2, plus half of the remaining 1/2 (which is 1/4).',
        explanation:
          'Since Shimon only claims 1/2, the other 1/2 belongs to Reuven right away. Splitting the disputed 1/2 gives each person 1/4. So Reuven gets 1/2 + 1/4 = 3/4!',
      },
      {
        id: 'tallit-2',
        lessonId: 'tallit-fractions',
        track: 'gemara',
        sourceRef: 'Bava Metzia 2a',
        question:
          'In that same case (All vs. Half), if the tallit is worth 120 silver zuz, how many zuz does Shimon get?',
        options: ['30 zuz', '40 zuz', '60 zuz', '90 zuz'],
        correctIndex: 0,
        hint: 'Shimon gets 1/4 of the total value. What is 120 ÷ 4?',
        explanation: 'Shimon gets 1/4 of 120 zuz. 120 ÷ 4 = 30 zuz, and Reuven gets 3 × 30 = 90 zuz.',
      },
      {
        id: 'tallit-3',
        lessonId: 'tallit-fractions',
        track: 'gemara',
        sourceRef: 'Bava Metzia 2a',
        question:
          'What if Reuven claims ALL of a tallit and Shimon claims only ONE QUARTER (1/4)? How much does Shimon receive?',
        options: ['1/4', '1/8', '3/8', '1/2'],
        correctIndex: 1,
        hint: 'Only the 1/4 that Shimon claims is disputed. What is half of 1/4?',
        explanation:
          'Reuven automatically keeps the undisputed 3/4. They split the disputed 1/4 in half, so Shimon gets 1/8 and Reuven gets 7/8!',
      },
      {
        id: 'tallit-4',
        lessonId: 'tallit-fractions',
        track: 'gemara',
        sourceRef: 'Bava Metzia 2a',
        question:
          'Reuven and Shimon BOTH claim ALL of a tallit worth 80 silver zuz. How many zuz does each friend get?',
        options: ['20 zuz each', '30 zuz each', '40 zuz each', '60 zuz each'],
        correctIndex: 2,
        hint: 'When both friends claim the whole tallit, they split it 1/2 each (80 ÷ 2).',
        explanation:
          'Since the entire tallit is disputed, each friend receives 1/2 of 80 zuz = 40 zuz!',
      },
      {
        id: 'tallit-5',
        lessonId: 'tallit-fractions',
        track: 'gemara',
        sourceRef: 'Bava Metzia 2a',
        question:
          'Reuven claims ALL of a tallit and Shimon claims HALF. If the tallit is worth 200 silver zuz, how many zuz does REUVEN receive?',
        options: ['100 zuz', '125 zuz', '150 zuz', '175 zuz'],
        correctIndex: 2,
        hint: 'Reuven gets 3/4 of 200 zuz. First find 1/4 (200 ÷ 4 = 50), then multiply 3 × 50.',
        explanation:
          '1/4 of 200 is 50 zuz (Shimon’s share). Reuven gets 3/4 = 3 × 50 = 150 zuz!',
      },
    ],
  },
  {
    id: 'sukkah-geometry',
    order: 4,
    track: 'gemara',
    title: 'Circles, Pi & the Round Sukkah',
    hebrewTitle: 'עגולה וסוכה',
    sourceRef: 'Eruvin 14a · Sukkah 8a',
    mathTopic: 'Geometry, Circles & Square Diagonals',
    ageRange: 'Ages 9–12',
    summary:
      'Unroll a circle along a number line to compare the Gemara’s quick "3 times across" rule with π = 3.14, then fit a square Sukkah inside a round tent!',
    storyHook:
      'In Eruvin 14a, the Sages teach a fast mental math rule: "Anything 3 handbreadths around is 1 handbreadth across" (using π ≈ 3). And in Sukkah 8a, they measure the diagonal of a square as 1 and 2/5 (1.4) times its side!',
    formulaPreview: 'C ≈ 3 × d  (Exact: 3.14 × d)  |  Diag ≈ 1.4 × s',
    stages: [
      {
        step: 1,
        title: 'Unroll the Circle',
        prompt:
          'Drag the "Unroll Circle" slider from 0% to 100% and watch the circle’s outer rim flatten onto the ruler below.',
        takeaway: 'Every circle’s distance around (circumference) is a little bit more than 3 diameters (3.14159...).',
      },
      {
        step: 2,
        title: 'Compare Gemara Rule vs. Exact Pi',
        prompt:
          'Set the diameter to 10 tefachim (like King Solomon’s round copper sea in Kings I 7:23) and compare 3 × d with 3.14 × d.',
        takeaway: '3 × 10 = 30 gives a fast mental estimate, while exact π × 10 ≈ 31.42 is slightly longer.',
      },
      {
        step: 3,
        title: 'Fit a Square Inside a Round Sukkah',
        prompt:
          'Switch to "Round Sukkah Mode" and inspect how the square’s diagonal equals the circle’s diameter.',
        takeaway: 'Using Sukkah 8a’s rule (diagonal ≈ 1.4 × side), a 7×7 square needs a diameter of 9.8 → 10 tefachim!',
      },
    ],
    challenges: [
      {
        id: 'sukkah-1',
        lessonId: 'sukkah-geometry',
        track: 'gemara',
        sourceRef: 'Eruvin 14a',
        question:
          'Using the Gemara’s quick rule (Circumference ≈ 3 × Diameter), about how far around is a circular well that is 8 tefachim across?',
        options: ['11 tefachim', '16 tefachim', '24 tefachim', '32 tefachim'],
        correctIndex: 2,
        hint: 'Multiply the diameter (8) by 3.',
        explanation:
          'Using the Gemara’s rule C ≈ 3 × d: 3 × 8 = 24 tefachim (exact π × 8 ≈ 25.13 tefachim).',
      },
      {
        id: 'sukkah-2',
        lessonId: 'sukkah-geometry',
        track: 'gemara',
        sourceRef: 'Sukkah 8a',
        question:
          'The Gemara says a square’s diagonal is about 1.4 (1 and 2/5) times its side. About how long is the diagonal of a 10 × 10 square?',
        options: ['12 units', '14 units', '15 units', '20 units'],
        correctIndex: 1,
        hint: 'Multiply 10 by 1.4 (which is 10 + 4).',
        explanation:
          '10 × 1.4 = 14 units! The exact mathematical square root of 200 is 14.14—remarkably close!',
      },
      {
        id: 'sukkah-3',
        lessonId: 'sukkah-geometry',
        track: 'gemara',
        sourceRef: 'Eruvin 14a',
        question:
          'When you unroll ANY circle into a straight line, how does its exact circumference compare to 3 times its diameter?',
        options: [
          'It is slightly shorter than 3 × diameter',
          'It is always slightly longer than 3 × diameter (3.14...)',
          'It depends on whether the circle is big or small',
          'It is exactly 4 × diameter',
        ],
        correctIndex: 1,
        hint: 'Look at the unrolled ruler in the interactive stage—does the circle roll slightly past 3×d?',
        explanation:
          'Every circle—big or small—has an exact circumference of π × d ≈ 3.14159 × d, which is always just a bit longer than 3 × d.',
      },
      {
        id: 'sukkah-4',
        lessonId: 'sukkah-geometry',
        track: 'gemara',
        sourceRef: 'Eruvin 14a · Kings I 7:23',
        question:
          'King Solomon built a round copper basin that was 10 amot across (diameter). Using the Gemara’s rule (C ≈ 3 × d), about how many amot was it around?',
        options: ['20 amot', '30 amot', '40 amot', '100 amot'],
        correctIndex: 1,
        hint: 'Multiply the diameter (10 amot) by 3.',
        explanation:
          '3 × 10 = 30 amot! That is the exact famous measurement written in Kings I 7:23 and discussed in Eruvin 14a.',
      },
      {
        id: 'sukkah-5',
        lessonId: 'sukkah-geometry',
        track: 'gemara',
        sourceRef: 'Sukkah 8a',
        question:
          'A square Sukkah has sides of 5 tefachim each. Using Sukkah 8a’s diagonal rule (Diagonal ≈ 1.4 × side), about how long is its diagonal?',
        options: ['6 tefachim', '7 tefachim', '8 tefachim', '10 tefachim'],
        correctIndex: 1,
        hint: 'Multiply 5 by 1 and 2/5: 5 × 1 = 5, plus 5 × (2/5) = 2. What is 5 + 2?',
        explanation:
          '5 × 1.4 = 7 tefachim! Notice how cleanly 1 and 2/5 (7/5) multiplies with 5.',
      },
    ],
  },
  {
    id: 'batel-bshishim',
    order: 5,
    track: 'gemara',
    title: 'The 1-to-60 Soup Pot Ratio',
    hebrewTitle: 'בטל בשישים',
    sourceRef: 'Chullin 98a',
    mathTopic: 'Ratios, Scaling & Multiplication',
    ageRange: 'Ages 8–12',
    summary:
      'Practice ratios and multiplying by 60 in a cozy kosher kitchen! See how many spoons of soup are needed so an accidental drop becomes Batel B’Shishim.',
    storyHook:
      'Uh-oh! While cooking a giant pot of Shabbat soup, 1 tiny spoon of non-kosher sauce accidentally drips in. The Gemara (Chullin 98a) teaches Batel B’Shishim: if there is at least 60 times as much kosher soup as the drop, the flavor completely vanishes!',
    formulaPreview: 'Kosher Soup ≥ 60 × Drop  (Ratio ≥ 60 : 1)',
    stages: [
      {
        step: 1,
        title: 'Test a Single Drop',
        prompt:
          'Keep Accidental Drops at 1 spoon and slide Kosher Soup up until you cross 60 spoons.',
        takeaway: 'For 1 spoon of drop, you need at least 60 spoons of kosher soup (a 1 : 60 ratio).',
      },
      {
        step: 2,
        title: 'Scale the Ratio Up',
        prompt:
          'Increase Accidental Drops to 2 or 3 spoons. Notice how the required amount of soup scales up in multiples of 60!',
        takeaway: '2 drops need 120 spoons, 3 drops need 180 spoons, and 4 drops need 240 spoons.',
      },
      {
        step: 3,
        title: 'Inspect the 60-Block Grid',
        prompt:
          'Watch how the visual grid highlights every 60-spoon block needed to balance each drop.',
        takeaway: 'Equivalent ratios (1:60 = 2:120 = 3:180) keep the exact same proportion!',
      },
    ],
    challenges: [
      {
        id: 'ratio-1',
        lessonId: 'batel-bshishim',
        track: 'gemara',
        sourceRef: 'Chullin 98a',
        question:
          'If 3 spoons of milk accidentally fall into a pot of meat soup, how many spoons of kosher soup are needed for Batel B’Shishim (60:1)?',
        options: ['63 spoons', '120 spoons', '180 spoons', '240 spoons'],
        correctIndex: 2,
        hint: 'Multiply 3 × 60 (think 3 × 6 = 18, then add a zero).',
        explanation: '3 × 60 = 180 spoons of kosher soup! 180 : 3 simplifies right back to 60 : 1.',
      },
      {
        id: 'ratio-2',
        lessonId: 'batel-bshishim',
        track: 'gemara',
        sourceRef: 'Chullin 98a',
        question:
          'A pot has 100 spoons of kosher soup and 2 spoons accidentally drip in. Is that enough for a 60:1 ratio?',
        options: [
          'Yes, 100 is more than 60',
          'No, 2 drops require at least 120 spoons (short by 20)',
          'Yes, the ratio is 50:1 which is bigger than 60:1',
          'No, it needs 200 spoons',
        ],
        correctIndex: 1,
        hint: 'Divide 100 ÷ 2 to find the ratio per drop, or multiply 2 × 60.',
        explanation:
          'For 2 spoons, you need 2 × 60 = 120 spoons of soup. With 100 spoons, the ratio is only 50:1—you are 20 spoons short!',
      },
      {
        id: 'ratio-3',
        lessonId: 'batel-bshishim',
        track: 'gemara',
        sourceRef: 'Chullin 98a',
        question:
          'A huge pot holds 240 spoons of kosher soup. What is the MAXIMUM number of accidental spoons that can be nullified at 60:1?',
        options: ['2 spoons', '3 spoons', '4 spoons', '6 spoons'],
        correctIndex: 2,
        hint: 'How many groups of 60 fit into 240? Divide 240 ÷ 60.',
        explanation: '240 ÷ 60 = 4 spoons! Since 4 × 60 = 240, up to 4 spoons keep a 60:1 ratio.',
      },
      {
        id: 'ratio-4',
        lessonId: 'batel-bshishim',
        track: 'gemara',
        sourceRef: 'Chullin 98a',
        question:
          'If 5 spoons of non-kosher sauce accidentally spill into a huge catering pot of soup, how many spoons of kosher soup are needed for a 60:1 ratio?',
        options: ['180 spoons', '240 spoons', '300 spoons', '360 spoons'],
        correctIndex: 2,
        hint: 'Multiply 5 × 60 (think 5 × 6 = 30, then add one zero!).',
        explanation:
          '5 × 60 = 300 spoons of kosher soup! 300 : 5 simplifies right back to 60 : 1.',
      },
      {
        id: 'ratio-5',
        lessonId: 'batel-bshishim',
        track: 'gemara',
        sourceRef: 'Chullin 98a',
        question:
          'A pot has 150 spoons of kosher soup, and 3 accidental spoons fall in (which require 180 spoons). How many MORE spoons would be needed to reach 60:1?',
        options: ['10 more spoons', '20 more spoons', '30 more spoons', '60 more spoons'],
        correctIndex: 2,
        hint: 'Subtract what you already have from what you need: 180 − 150.',
        explanation:
          '3 × 60 = 180 spoons needed, and 180 − 150 = 30 spoons short of the 60:1 ratio!',
      },
    ],
  },
  {
    id: 'gematria-workshop',
    order: 6,
    track: 'torah',
    title: 'Gematria Letter-Number Workshop',
    hebrewTitle: 'גימטריא',
    sourceRef: 'Torah Hebrew Alphabet',
    mathTopic: 'Place Value & Mental Addition',
    ageRange: 'Ages 7–11',
    summary:
      'Every Hebrew letter is also a number! Build words with wooden tiles to break big sums into Hundreds, Tens, and Ones—and uncover hidden Torah math surprises.',
    storyHook:
      'In Hebrew, letters double as numbers: א through ט are Ones (1–9), י through צ are Tens (10–90), and ק through ת are Hundreds (100–400). Wait until you see what happens when you add the letters of "One" (אחד) and "Love" (אהבה)!',
    formulaPreview: 'אחד (1+8+4) = 13  |  אהבה (1+5+2+5) = 13',
    stages: [
      {
        step: 1,
        title: 'Explore Classic Torah Words',
        prompt:
          'Click the preset words like חי (Chai), אחד (Echad), and שלום (Shalom) to see each letter’s numeric value light up.',
        takeaway: 'Every word is a sum built from Ones, Tens, and Hundreds tiles!',
      },
      {
        step: 2,
        title: 'Discover the 13 + 13 Secret',
        prompt:
          'Compare אחד (One = 13) and אהבה (Love = 13). Both add up to 13—and together 13 + 13 = 26!',
        takeaway: 'Different combinations of letters can share the exact same mathematical sum.',
      },
      {
        step: 3,
        title: 'Build a Target Number',
        prompt:
          'Try the Target Number Builder! Pick Hebrew tiles from Hundreds, Tens, and Ones to hit the target score cleanly.',
        takeaway: 'Place value lets you build any number quickly by grouping 100s, 10s, and 1s.',
      },
    ],
    challenges: [
      {
        id: 'gem-1',
        lessonId: 'gematria-workshop',
        track: 'torah',
        sourceRef: 'Hebrew Gematria',
        question:
          'The word חי (Chai, meaning "Life") is spelled with Chet (ח = 8) and Yud (י = 10). What is its total value?',
        options: ['16', '18', '28', '80'],
        correctIndex: 1,
        hint: 'Add 8 + 10.',
        explanation:
          'ח (8) + י (10) = 18! That is why people often give gifts or tzedakah in multiples of 18 (18, 36, 54, 180).',
      },
      {
        id: 'gem-2',
        lessonId: 'gematria-workshop',
        track: 'torah',
        sourceRef: 'Hebrew Gematria',
        question:
          'The word שלום (Shalom, Peace) uses Shin (300) + Lamed (30) + Vav (6) + Mem (40). What is the Gematria of Shalom?',
        options: ['346', '366', '376', '436'],
        correctIndex: 2,
        hint: 'Group the Tens first: 30 + 40 = 70. Then add 300 + 70 + 6.',
        explanation:
          '300 + (30 + 40) + 6 = 300 + 70 + 6 = 376! Grouping by place value makes mental addition super fast.',
      },
      {
        id: 'gem-3',
        lessonId: 'gematria-workshop',
        track: 'torah',
        sourceRef: 'Hebrew Gematria',
        question:
          'אחד (Echad, "One") = 1 + 8 + 4 = 13. אהבה (Ahavah, "Love") = 1 + 5 + 2 + 5. What is Echad + Ahavah together?',
        options: ['24', '26', '28', '30'],
        correctIndex: 1,
        hint: 'Both words equal 13. What is 13 + 13?',
        explanation:
          '1 + 5 + 2 + 5 = 13, so אהבה also equals 13! Together, 13 + 13 = 26.',
      },
      {
        id: 'gem-4',
        lessonId: 'gematria-workshop',
        track: 'torah',
        sourceRef: 'Hebrew Gematria',
        question:
          'The word אמת (Emet, meaning "Truth") is spelled Alef (1) + Mem (40) + Tav (400). What is the Gematria of Emet?',
        options: ['414', '441', '451', '541'],
        correctIndex: 1,
        hint: 'Put the place values together: 4 Hundreds + 4 Tens + 1 One.',
        explanation:
          '400 + 40 + 1 = 441! Fun math bonus: 441 is also 21 × 21 (a perfect square!).',
      },
      {
        id: 'gem-5',
        lessonId: 'gematria-workshop',
        track: 'torah',
        sourceRef: 'Hebrew Gematria',
        question:
          'The word תורה (Torah) is spelled Tav (400) + Vav (6) + Resh (200) + Hei (5). What is the Gematria of Torah?',
        options: ['511', '601', '611', '621'],
        correctIndex: 2,
        hint: 'Group the Hundreds first (400 + 200 = 600), then add the Ones (6 + 5 = 11).',
        explanation:
          '400 + 200 = 600, and 6 + 5 = 11, so 600 + 11 = 611! In Makkot 23b, the Sages note Moshe taught us 611 mitzvot plus the first 2 heard directly = 613!',
      },
    ],
  },
  {
    id: 'shaot-zmaniyot',
    order: 7,
    track: 'shulchan-aruch',
    title: 'Daylight Hours & Morning Prayer',
    hebrewTitle: 'שעות זמניות',
    sourceRef: 'Orach Chaim 58:1 & 89:1',
    mathTopic: 'Time, Division by 12 & Seasons',
    ageRange: 'Ages 8–12',
    summary:
      'Discover how the Shulchan Aruch divides every day’s sunlight into 12 equal Halachic Hours—shorter in winter, longer in summer—to find Latest Shema and Midday.',
    storyHook:
      'In the Shulchan Aruch (Orach Chaim 58:1 & 89:1), morning Shema is said within the first 3 hours of daylight and Shacharit within 4 hours. Because winter days are short and summer days are long, Jewish law splits total sunlight from sunrise to sunset into 12 equal pieces called Shaot Zmaniyot!',
    formulaPreview: '1 Halachic Hour = (Daylight Minutes) ÷ 12',
    stages: [
      {
        step: 1,
        title: 'Test a Balanced 12-Hour Day',
        prompt:
          'Click the "Spring / Fall (12h)" preset. When sunlight lasts 12 clock hours (720 minutes), see how long 1 Halachic Hour is.',
        takeaway: '720 minutes ÷ 12 = exactly 60 minutes! On an equinox, a Halachic Hour matches a regular clock hour.',
      },
      {
        step: 2,
        title: 'Shrink to a Short Winter Day',
        prompt:
          'Click "Short Winter (10h)". Divide 600 minutes by 12 and watch Latest Shema (Hour 3) arrive earlier!',
        takeaway: '600 ÷ 12 = 50 minutes per Halachic Hour! So 3 Halachic Hours is 3 × 50 = 150 minutes (2 hrs 30 min).',
      },
      {
        step: 3,
        title: 'Stretch to a Long Summer Day',
        prompt:
          'Click "Long Summer (14h)" and slide sunrise earlier to 5:30 AM. Check Hour 3 (Shema), Hour 4 (Shacharit), and Hour 6 (Chatzot Midday).',
        takeaway: '840 ÷ 12 = 70 minutes per Halachic Hour—and Hour 6 is always the exact halfway point of the day!',
      },
    ],
    challenges: [
      {
        id: 'zman-1',
        lessonId: 'shaot-zmaniyot',
        track: 'shulchan-aruch',
        sourceRef: 'Orach Chaim 58:1',
        question:
          'On a winter day with 10 hours (600 minutes) of total daylight, how many minutes long is 1 Halachic Hour (Shaah Zmanit)?',
        options: ['45 minutes', '50 minutes', '60 minutes', '70 minutes'],
        correctIndex: 1,
        hint: 'Divide 600 minutes by 12 equal daylight hours (think 60 ÷ 12 = 5, then add a zero).',
        explanation:
          '600 ÷ 12 = 50 minutes! Each winter Halachic Hour is 10 minutes shorter than a regular clock hour.',
      },
      {
        id: 'zman-2',
        lessonId: 'shaot-zmaniyot',
        track: 'shulchan-aruch',
        sourceRef: 'Orach Chaim 58:1',
        question:
          'If sunrise is at 7:00 AM and 1 Halachic Hour is 50 minutes, when is Latest Shema (after 3 Halachic Hours)?',
        options: ['9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM'],
        correctIndex: 1,
        hint: 'First multiply 3 × 50 = 150 minutes (which is 2 hours and 30 minutes), then add that to 7:00 AM.',
        explanation:
          '3 × 50 minutes = 150 minutes = 2 hours 30 minutes. Starting at 7:00 AM, 2 hours 30 minutes later is 9:30 AM!',
      },
      {
        id: 'zman-3',
        lessonId: 'shaot-zmaniyot',
        track: 'shulchan-aruch',
        sourceRef: 'Orach Chaim 89:1',
        question:
          'On a long summer day with 14 hours (840 minutes) of daylight, how many minutes long is 1 Halachic Hour?',
        options: ['65 minutes', '70 minutes', '75 minutes', '80 minutes'],
        correctIndex: 1,
        hint: 'Divide 840 by 12 (think: 12 × 7 = 84, so 12 × 70 = 840).',
        explanation:
          '840 ÷ 12 = 70 minutes (1 hour and 10 minutes) per Halachic Hour in summer!',
      },
      {
        id: 'zman-4',
        lessonId: 'shaot-zmaniyot',
        track: 'shulchan-aruch',
        sourceRef: 'Orach Chaim 89:1',
        question:
          'On a balanced spring day with 12 hours (720 minutes) of daylight, sunrise is at 6:00 AM. When is Latest Shacharit (after 4 Halachic Hours)?',
        options: ['9:00 AM', '9:30 AM', '10:00 AM', '11:00 AM'],
        correctIndex: 2,
        hint: 'On a 12-hour day, each Halachic Hour is 60 minutes (1 full clock hour). Count 4 hours forward from 6:00 AM!',
        explanation:
          '720 ÷ 12 = 60 minutes per Halachic Hour. Four hours after 6:00 AM is 10:00 AM!',
      },
      {
        id: 'zman-5',
        lessonId: 'shaot-zmaniyot',
        track: 'shulchan-aruch',
        sourceRef: 'Orach Chaim 58:1',
        question:
          'Whether it is a short winter day or a long summer day, which Halachic Hour is ALWAYS Chatzot (exact Midday, halfway through daylight)?',
        options: ['Hour 3', 'Hour 4', 'Hour 6', 'Hour 8'],
        correctIndex: 2,
        hint: 'Every day is divided into 12 equal Halachic Hours. What is half of 12?',
        explanation:
          '12 ÷ 2 = 6! Hour 6 is always the exact midpoint between sunrise and sunset in every season.',
      },
    ],
  },
  {
    id: 'maaser-percent',
    order: 8,
    track: 'shulchan-aruch',
    title: 'Tzedakah & Maaser: 10% and 20%',
    hebrewTitle: 'מעשר כספים',
    sourceRef: 'Yoreh Deah 249:1',
    mathTopic: 'Percentages, Dividing by 10 & Money',
    ageRange: 'Ages 7–11',
    summary:
      'Use a 100-square coin chart and a brass Tzedakah pushka to learn the Shulchan Aruch’s rules of Maaser (10%) and Chomesh (20%)—with a lightning-fast mental math shortcut.',
    storyHook:
      'In Yoreh Deah 249:1, the Shulchan Aruch teaches that giving 10% (Maaser, one-tenth) of what you earn to Tzedakah is the standard mitzvah, and giving 20% (Chomesh, one-fifth) is the most generous level! Let’s see how dividing by 10 makes percentages super easy.',
    formulaPreview: 'Maaser (10%) = Total ÷ 10  |  Chomesh (20%) = 2 × Maaser',
    stages: [
      {
        step: 1,
        title: 'See 10% on the 100-Grid',
        prompt:
          'Set Earnings to $100 and click "Maaser (10%)". Notice that 10% lights up exactly 1 full column of 10 coins out of 100!',
        takeaway: '10% means 10 out of every 100—which is the exact same as 1 out of every 10 (÷ 10).',
      },
      {
        step: 2,
        title: 'Use the "Drop the Zero" Trick',
        prompt:
          'Slide Total Earnings to $60, $80, and $140 while keeping Maaser at 10%. Watch the Tzedakah amount every time!',
        takeaway: 'To find 10% of any number ending in 0, simply drop the last zero: 10% of $80 is $8!',
      },
      {
        step: 3,
        title: 'Double It for Chomesh (20%)',
        prompt:
          'Switch to "Chomesh (20%)" and test $50 and $100. Compare the highlighted columns and how much money you keep.',
        takeaway: '20% is simply double 10%! If Maaser of $50 is $5, then Chomesh (20%) is $5 × 2 = $10.',
      },
    ],
    challenges: [
      {
        id: 'maaser-1',
        lessonId: 'maaser-percent',
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 249:1',
        question:
          'You earn $80 from shoveling snow and walking dogs. Following Shulchan Aruch Yoreh Deah 249:1, how much is 10% Maaser for Tzedakah?',
        options: ['$4', '$8', '$10', '$16'],
        correctIndex: 1,
        hint: 'Use the Drop-the-Zero trick: divide $80 by 10.',
        explanation:
          '$80 ÷ 10 = $8 goes into your Tzedakah pushka, and you keep $80 − $8 = $72!',
      },
      {
        id: 'maaser-2',
        lessonId: 'maaser-percent',
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 249:1',
        question:
          'If you earn $60 and want to give the generous Chomesh level (20%) taught in Yoreh Deah 249:1, how much do you give to Tzedakah?',
        options: ['$6', '$10', '$12', '$20'],
        correctIndex: 2,
        hint: 'First find 10% ($60 ÷ 10 = $6), then double it for 20%!',
        explanation:
          '10% of $60 is $6. Doubling it for 20% Chomesh gives $6 × 2 = $12 for Tzedakah!',
      },
      {
        id: 'maaser-3',
        lessonId: 'maaser-percent',
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 249:1',
        question:
          'You earn $50 and put 10% Maaser into the Tzedakah pushka. How much money do you KEEP for yourself?',
        options: ['$40', '$45', '$48', '$5'],
        correctIndex: 1,
        hint: 'First find 10% of $50 ($5), then subtract $5 from $50.',
        explanation:
          '10% of $50 is $5 for Tzedakah, leaving $50 − $5 = $45 (which is 90% of your earnings)!',
      },
      {
        id: 'maaser-4',
        lessonId: 'maaser-percent',
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 249:1',
        question:
          'You earn $140 from a summer lemonade stand. Using the Drop-the-Zero shortcut, how much is 10% Maaser?',
        options: ['$10', '$14', '$24', '$28'],
        correctIndex: 1,
        hint: 'Divide $140 by 10 by dropping the trailing zero.',
        explanation:
          '$140 ÷ 10 = $14 for Tzedakah! You keep $140 − $14 = $126.',
      },
      {
        id: 'maaser-5',
        lessonId: 'maaser-percent',
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 249:1',
        question:
          'You earn $100 and give generous Chomesh (20%) to Tzedakah. How much money do you KEEP?',
        options: ['$20', '$70', '$80', '$90'],
        correctIndex: 2,
        hint: '20% of $100 is $20. Subtract $20 from $100!',
        explanation:
          '$20 goes to the Tzedakah pushka and you keep $100 − $20 = $80 (which is 80%)!',
      },
    ],
  },
  {
    id: 'mezuzah-thirds',
    order: 9,
    track: 'shulchan-aruch',
    title: 'Mezuzah Placement & Thirds of a Doorway',
    hebrewTitle: 'קביעת מזוזה',
    sourceRef: 'Yoreh Deah 289:2',
    mathTopic: 'Fractions (Thirds) & Measurement',
    ageRange: 'Ages 7–11',
    summary:
      'Measure a doorway blueprint in inches and divide by 3 to hang a Mezuzah in the exact kosher top-third zone taught by the Shulchan Aruch.',
    storyHook:
      'Where on a doorpost does a Mezuzah belong? In Yoreh Deah 289:2, the Shulchan Aruch gives an exact fraction rule: divide the doorway’s height into 3 equal thirds, and place the Mezuzah at the bottom of the TOP third—making sure to leave at least 1 handbreadth (about 3.5 inches) below the top lintel!',
    formulaPreview: '1/3 = Height ÷ 3  |  Kosher Zone: Top 1/3 (above 2/3 mark)',
    stages: [
      {
        step: 1,
        title: 'Split the Doorway Into 3 Equal Thirds',
        prompt:
          'Set Doorway Height to 84 inches (a standard home door). Look at how 84 ÷ 3 splits the door into three 28-inch sections.',
        takeaway: 'Bottom third is 0–28 in, Middle third is 28–56 in, and Top third starts at 56 inches (2/3 of the door)!',
      },
      {
        step: 2,
        title: 'Place the Mezuzah in the Kosher Zone',
        prompt:
          'Slide the Mezuzah height up and down. Watch the status bar change from Too Low (below 2/3) to Kosher Top Third!',
        takeaway: 'The ideal spot is right at the start of the top third (2/3 up from the floor, e.g. 56–60 in on an 84-in door).',
      },
      {
        step: 3,
        title: 'Leave 1 Tefach Space Below the Top',
        prompt:
          'Slide the Mezuzah all the way up near the top lintel and notice the 1-tefach (~3.5 in) safety margin required by Yoreh Deah 289:2.',
        takeaway: 'A kosher Mezuzah sits above the 2/3 line AND at least 1 tefach (~3.5 in) below the top frame!',
      },
    ],
    challenges: [
      {
        id: 'mez-1',
        lessonId: 'mezuzah-thirds',
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 289:2',
        question:
          'A classroom doorway is 90 inches tall. If you divide it into 3 equal thirds, how tall is ONE third (1/3) of the doorway?',
        options: ['20 inches', '30 inches', '45 inches', '60 inches'],
        correctIndex: 1,
        hint: 'Divide 90 inches by 3 equal parts (think 9 ÷ 3 = 3, then add the zero).',
        explanation:
          '90 ÷ 3 = 30 inches per third! So the bottom third is 0–30 in, middle is 30–60 in, and top third is 60–90 in.',
      },
      {
        id: 'mez-2',
        lessonId: 'mezuzah-thirds',
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 289:2',
        question:
          'On that same 90-inch doorway, at what height from the floor does the TOP THIRD (the 2/3 mark) begin?',
        options: ['30 inches', '45 inches', '60 inches', '75 inches'],
        correctIndex: 2,
        hint: 'Two thirds is 2 × 30 inches.',
        explanation:
          'Since 1/3 is 30 inches, 2/3 is 2 × 30 = 60 inches from the floor—the ideal height to start hanging the Mezuzah!',
      },
      {
        id: 'mez-3',
        lessonId: 'mezuzah-thirds',
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 289:2',
        question:
          'A smaller playroom door is 72 inches tall (each third is 24 inches). Which Mezuzah height is inside the kosher Top Third (between 48 in and 68.5 in)?',
        options: ['36 inches', '42 inches', '52 inches', '71 inches'],
        correctIndex: 2,
        hint: 'Check which height is ABOVE the 2/3 mark (48 in) and at least 3.5 inches BELOW the 72-inch top!',
        explanation:
          '52 inches is above the 48-inch (2/3) line and safely more than 1 tefach below the 72-inch top lintel!',
      },
      {
        id: 'mez-4',
        lessonId: 'mezuzah-thirds',
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 289:2',
        question:
          'A standard home doorway is 84 inches tall (each third is 28 inches). At what height from the floor does the TOP THIRD (the 2/3 mark) start?',
        options: ['28 inches', '42 inches', '56 inches', '70 inches'],
        correctIndex: 2,
        hint: 'Two thirds is 2 × 28 inches (28 + 28).',
        explanation:
          '28 + 28 = 56 inches from the floor! That is right where the kosher Top Third begins.',
      },
      {
        id: 'mez-5',
        lessonId: 'mezuzah-thirds',
        track: 'shulchan-aruch',
        sourceRef: 'Yoreh Deah 289:2',
        question:
          'Yoreh Deah 289:2 teaches that a Mezuzah must stay at least 1 tefach (~3.5 inches) BELOW the top lintel. On an 84-inch door, what is the highest kosher spot?',
        options: ['74.5 inches', '80.5 inches', '83.5 inches', '84 inches'],
        correctIndex: 1,
        hint: 'Subtract 3.5 inches from 84 inches: 84 − 3 = 81, then take away 0.5 more!',
        explanation:
          '84 − 3.5 = 80.5 inches! Hanging it between 56 in and 80.5 in keeps it inside the kosher top third with 1 tefach to spare.',
      },
    ],
  },
  {
    id: 'pi-gemara',
    order: 10,
    track: 'gemara',
    title: 'Pi (π) & Circle Area in the Gemara',
    hebrewTitle: 'יחס העיגול (π)',
    sourceRef: 'Eruvin 14a & 76b · Rambam',
    mathTopic: 'Pi (π ≈ 3, 22/7, 3.14) & Circle Area (πr²)',
    ageRange: 'Ages 9–12',
    summary:
      'Discover how the Gemara finds the area of a circle by removing 1/4 of a square (3 × r²), then compare the Sages’ quick 3 rule with Rambam & Tosafot’s 22/7 and exact π!',
    storyHook:
      'In Eruvin 76b, the Gemara teaches a remarkable geometry shortcut: "A square is larger than the circle fitted inside it by one quarter!" Since a square around a circle has area 4 × r², taking away 1/4 leaves 3 × r². Later, Rambam and Tosafot explain that exact π is closer to 3 and 1/7 (22/7 ≈ 3.1429)!',
    formulaPreview: 'A ≈ 3 × r²  |  Rambam: (22/7) × r²  |  Exact: π × r²',
    stages: [
      {
        step: 1,
        title: 'See Why a Square Loses 1/4 to a Circle',
        prompt:
          'Look at the 4 equal r × r quadrants inside the square. Notice how the four empty corner scraps around the circle add up to about 1 full quadrant (1/4 of the square)!',
        takeaway:
          'Removing 1/4 from 4r² leaves 3r²—that is the Gemara’s Eruvin 76b rule for circle area (π ≈ 3)!',
      },
      {
        step: 2,
        title: 'Test Radius 7 with Rambam’s 22/7',
        prompt:
          'Switch to "Compare 3 vs 22/7 vs π" and click the "Radius 7 (22/7 Magic!)" preset. Watch how 22/7 cancels the 7 cleanly!',
        takeaway:
          'When r = 7, (22/7) × 7² = 22 × 7 = 154—almost identical to exact π × 49 = 153.94!',
      },
      {
        step: 3,
        title: 'Compare Radius vs. Diameter',
        prompt:
          'Slide the Radius from 2 to 10 and watch Diameter (2 × r) double while Area (π × r²) grows much faster by squaring r!',
        takeaway:
          'Radius is halfway across; Diameter is all the way across (d = 2r). Area always squares the radius (r × r)!',
      },
    ],
    challenges: [
      {
        id: 'pi-1',
        lessonId: 'pi-gemara',
        track: 'gemara',
        sourceRef: 'Eruvin 14a',
        question:
          'A round courtyard has a radius (center to edge) of 6 amot. What is its diameter (all the way across)?',
        options: ['3 amot', '6 amot', '12 amot', '36 amot'],
        correctIndex: 2,
        hint: 'Diameter is always double the radius (d = 2 × r).',
        explanation:
          'Diameter = 2 × radius = 2 × 6 = 12 amot all the way across!',
      },
      {
        id: 'pi-2',
        lessonId: 'pi-gemara',
        track: 'gemara',
        sourceRef: 'Eruvin 76b',
        question:
          'Using the Gemara’s Eruvin 76b area rule (Area ≈ 3 × r²), about what is the area of a circle with radius r = 4 amot?',
        options: [
          '24 square amot',
          '48 square amot',
          '64 square amot',
          '96 square amot',
        ],
        correctIndex: 1,
        hint: 'First square the radius (4 × 4 = 16), then multiply by 3!',
        explanation:
          'r² = 4 × 4 = 16, and 3 × 16 = 48 square amot! (Exact π × 16 ≈ 50.27 square amot.)',
      },
      {
        id: 'pi-3',
        lessonId: 'pi-gemara',
        track: 'gemara',
        sourceRef: 'Eruvin 76b',
        question:
          'Eruvin 76b teaches that a square is larger than the circle inside it by 1/4. If a square courtyard has area 100 sq. amot, about how large is the circle fitted inside it?',
        options: [
          '25 square amot',
          '50 square amot',
          '75 square amot',
          '90 square amot',
        ],
        correctIndex: 2,
        hint: 'Find 1/4 of 100 (25) and subtract it from 100: 100 − 25.',
        explanation:
          '1/4 of 100 is 25, so taking away the 4 corner scraps leaves 100 − 25 = 75 square amot (exact π × 25 ≈ 78.54)!',
      },
      {
        id: 'pi-4',
        lessonId: 'pi-gemara',
        track: 'gemara',
        sourceRef: 'Rambam Eruvin 1:5 · Tosafot',
        question:
          'Rambam and Tosafot explain that π is very close to 3 and 1/7 (22/7). Using π ≈ 22/7, what is the circumference (C = π × d) of a circle with diameter d = 7 amot?',
        options: ['14 amot', '20 amot', '21 amot', '22 amot'],
        correctIndex: 3,
        hint: 'Multiply (22/7) × 7—the 7s cancel right out!',
        explanation:
          '(22/7) × 7 = 22 amot! Notice how much closer 22 is to exact π × 7 = 21.99 than 3 × 7 = 21!',
      },
      {
        id: 'pi-5',
        lessonId: 'pi-gemara',
        track: 'gemara',
        sourceRef: 'Rambam Eruvin 1:5',
        question:
          'Using Rambam’s 22/7 approximation, what is the area (A = π × r²) of a round plaza with radius r = 7 amot?',
        options: [
          '147 square amot',
          '154 square amot',
          '168 square amot',
          '196 square amot',
        ],
        correctIndex: 1,
        hint: 'Compute (22/7) × 7 × 7 = 22 × 7 (think 20 × 7 = 140, plus 2 × 7 = 14).',
        explanation:
          '(22/7) × 49 = 22 × 7 = 154 square amot! Exact π × 49 is 153.94—incredibly accurate!',
      },
    ],
  },
  {
    id: 'exponents-gemara',
    order: 11,
    track: 'gemara',
    title: 'Exponents & Powers in the Gemara',
    hebrewTitle: 'חזקות וריבועים',
    sourceRef: 'Berachot 32b · Eruvin 23b',
    mathTopic: 'Exponents, Squares (x²) & Powers of 10',
    ageRange: 'Ages 8–12',
    summary:
      'Learn what exponents really mean by building square courtyards from Eruvin 23b (50² = 2,500), doubling powers of 2, and counting the starry sky in Berachot 32b using Powers of 10!',
    storyHook:
      'In Berachot 32b, the Sage Reish Lakish counts the stars in the universe by multiplying huge groups by 10,000 × 10,000—climbing all the way to 10¹⁸ (a 1 with 18 zeros)! And in Eruvin 23b, the Sages measure square Mishkan courtyards as 50 × 50 = 50². Exponents are math’s superpower for repeated multiplication!',
    formulaPreview: 'bᵉ = b × b × … × b  |  50² = 2,500  |  10⁴ = 10,000',
    stages: [
      {
        step: 1,
        title: 'Exponents Multiply—They Don’t Just Add!',
        prompt:
          'Set Base = 2 and slide the Exponent from 1 up to 6. Compare the real exponent value (2ᵉ) against the common trap (2 × e)!',
        takeaway:
          '2⁴ means 2 × 2 × 2 × 2 = 16—NOT 2 × 4 = 8! Every +1 on the exponent multiplies by the base one more time.',
      },
      {
        step: 2,
        title: 'Build a Square (x²) & Cube (x³)',
        prompt:
          'Click "Eruvin Square (5²)" to see a 5 × 5 grid of 25 squares (just like Eruvin 23b’s 50² = 2,500 Beit Se’ah), then click "3D Cube (3³)" to see 3 × 3 × 3 = 27!',
        takeaway:
          'Exponent 2 makes a flat square (Area = s²); exponent 3 makes a 3D cube (Volume = s³)!',
      },
      {
        step: 3,
        title: 'Count the Stars of Berachot 32b (10ⁿ)',
        prompt:
          'Switch to "Stars of Berachot 32b (10ⁿ)" and slide the Power of 10 from 10¹ to 10⁶—then click Reish Lakish’s 10¹⁸!',
        takeaway:
          'With base 10, the exponent simply tells you how many zeros follow the 1: 10⁴ = 10,000 (a myriad in the Gemara)!',
      },
    ],
    challenges: [
      {
        id: 'exp-1',
        lessonId: 'exponents-gemara',
        track: 'gemara',
        sourceRef: 'Exponents Basics',
        question: 'What is the value of 2⁴ (2 to the 4th power)?',
        options: [
          '6 (2 + 4)',
          '8 (2 × 4)',
          '16 (2 × 2 × 2 × 2)',
          '32 (five 2s)',
        ],
        correctIndex: 2,
        hint: 'Multiply four 2s together: 2 × 2 = 4, 4 × 2 = 8, 8 × 2 = ?',
        explanation:
          '2⁴ = 2 × 2 × 2 × 2 = 16! Remember: the exponent tells how many times to multiply the base by itself.',
      },
      {
        id: 'exp-2',
        lessonId: 'exponents-gemara',
        track: 'gemara',
        sourceRef: 'Eruvin 23b',
        question:
          'In Eruvin 23b, a classic Beit Se’ah courtyard is a square measuring 50 amot × 50 amot (50²). What is 50²?',
        options: [
          '1,000 square amot',
          '2,500 square amot',
          '5,000 square amot',
          '25,000 square amot',
        ],
        correctIndex: 1,
        hint: 'Multiply 5 × 5 = 25, then attach the two zeros from 50 and 50!',
        explanation:
          '50² = 50 × 50 = 2,500 square amot—the exact area of a Beit Se’ah in Eruvin 23b!',
      },
      {
        id: 'exp-3',
        lessonId: 'exponents-gemara',
        track: 'gemara',
        sourceRef: 'Berachot 32b',
        question:
          'In Berachot 32b, Reish Lakish counts the stars using groups of a "myriad" (10,000). How do you write 10,000 as a power of 10?',
        options: ['10²', '10³', '10⁴', '10⁵'],
        correctIndex: 2,
        hint: 'Count the number of zeros in 10,000!',
        explanation:
          '10,000 has 4 zeros, because 10 × 10 × 10 × 10 = 10,000 = 10⁴!',
      },
      {
        id: 'exp-4',
        lessonId: 'exponents-gemara',
        track: 'gemara',
        sourceRef: 'Eruvin 23b · 3D Cubes',
        question:
          'What is 3³ ("3 cubed", like a 3 × 3 × 3 cube of wooden blocks)?',
        options: ['6', '9', '18', '27'],
        correctIndex: 3,
        hint: 'Multiply 3 × 3 = 9, then multiply 9 × 3!',
        explanation:
          '3³ = 3 × 3 × 3 = 9 × 3 = 27! Notice that 3³ (27) is much bigger than 3 × 3 (9).',
      },
      {
        id: 'exp-5',
        lessonId: 'exponents-gemara',
        track: 'gemara',
        sourceRef: 'Berachot 32b',
        question:
          'When you multiply powers of 10, you add the exponents (like 10³ × 10² = 10⁵). What number is 10⁵?',
        options: ['100,000', '50,000', '10,000', '1,000,000'],
        correctIndex: 0,
        hint: 'Write a 1 followed by 5 zeros!',
        explanation:
          '10⁵ = 100,000 (one hundred thousand)—1,000 × 100 = 100,000 with 3 + 2 = 5 zeros!',
      },
    ],
  },
];

export const ALL_QUIZ_QUESTIONS: ChallengeQuestion[] = LESSONS.flatMap(
  (lesson) => lesson.challenges
);

export function getLessonById(id: LessonId): LessonDefinition {
  return LESSONS.find((l) => l.id === id) ?? LESSONS[0];
}
