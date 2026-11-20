import type { LessonId } from './lessons';

export interface WorksheetProblem {
  number: number;
  isBonus?: boolean;
  prompt: string;
  hint: string;
  answer: string;
  explanation: string;
}

export interface LessonWorksheetSpec {
  lessonId: LessonId;
  conceptTitle: string;
  conceptSummary: string;
  keyFormula: string;
  workedExample: {
    problem: string;
    steps: string[];
    answer: string;
  };
  practiceProblems: WorksheetProblem[];
}

export const LESSON_WORKSHEETS: Record<LessonId, LessonWorksheetSpec> = {
  'chanukah-candles': {
    lessonId: 'chanukah-candles',
    conceptTitle: 'Consecutive Addition & Pairing Shortcuts',
    conceptSummary:
      'Following Beit Hillel (Shabbat 21b), we add 1 more Chanukah candle each night: 1, 2, 3, 4, 5, 6, 7, 8. Instead of adding one number at a time, you can pair the smallest and largest numbers so every pair makes the exact same sum (1 + 8 = 9, 2 + 7 = 9, 3 + 6 = 9, 4 + 5 = 9).',
    keyFormula: 'Total Night Candles = 1 + 2 + ... + 8 = 4 pairs of 9 = 36  (+ 8 Shamash = 44)',
    workedExample: {
      problem: 'How many total night candles are lit during the first 6 nights of Chanukah (without the Shamash)?',
      steps: [
        'Write the candles for Nights 1 through 6: 1 + 2 + 3 + 4 + 5 + 6.',
        'Pair the ends together: (1 + 6) = 7, (2 + 5) = 7, and (3 + 4) = 7.',
        'Multiply 3 pairs x 7 = 21 night candles!',
      ],
      answer: '21 candles',
    },
    practiceProblems: [
      {
        number: 1,
        prompt:
          'Count the candles lit on Nights 1, 2, 3, 4, and 5 (not counting the Shamash). Show how you added them.',
        hint: 'Add 1 + 2 + 3 + 4 + 5. Try pairing (1 + 4 = 5) and (2 + 3 = 5), then add the last 5!',
        answer: '15 candles',
        explanation: '1 + 2 + 3 + 4 + 5 = 15 candles.',
      },
      {
        number: 2,
        prompt:
          'On Nights 6, 7, and 8, you also light 1 Shamash candle each night. How many candles do you use in total during those last 3 nights?',
        hint: 'First add the night candles (6 + 7 + 8), then add 3 Shamash candles.',
        answer: '24 candles',
        explanation: '(6 + 7 + 8) = 21 night candles + 3 Shamash candles = 24 candles.',
      },
      {
        number: 3,
        prompt:
          'A family has 3 kids, and each kid lights their own Menorah for all 8 nights (using 44 candles per box). How many candles does the whole family need?',
        hint: 'Multiply 44 x 3 (think 40 x 3 = 120, plus 4 x 3 = 12).',
        answer: '132 candles',
        explanation: '3 x 44 = (3 x 40) + (3 x 4) = 120 + 12 = 132 candles.',
      },
      {
        number: 4,
        prompt:
          'Beit Shammai counts down: 8, 7, 6, 5 on the first 4 nights. How many MORE candles does Beit Shammai use in the first 4 nights than Beit Hillel (1 + 2 + 3 + 4)?',
        hint: 'Find Beit Shammai’s sum (8 + 7 + 6 + 5 = 26) and subtract Beit Hillel’s sum (10).',
        answer: '16 more candles',
        explanation: 'Beit Shammai: 8 + 7 + 6 + 5 = 26. Beit Hillel: 1 + 2 + 3 + 4 = 10. Difference: 26 - 10 = 16.',
      },
      {
        number: 5,
        isBonus: true,
        prompt:
          'Bonus Challenge: Imagine a holiday lasted 10 nights and added 1 candle each night (1 + 2 + ... + 10). Use the pairing shortcut to find the total night candles!',
        hint: 'Pair 1 + 10 = 11, 2 + 9 = 11, 3 + 8 = 11, 4 + 7 = 11, 5 + 6 = 11. How many pairs of 11?',
        answer: '55 candles',
        explanation: 'There are 5 pairs that each add up to 11, and 5 x 11 = 55 candles!',
      },
    ],
  },

  'noahs-ark': {
    lessonId: 'noahs-ark',
    conceptTitle: 'Area, 3D Volume & Multi-Deck Scaling',
    conceptSummary:
      'In Bereishit 6:15-16, Noah’s Ark measures 300 amot long, 50 amot wide, and 30 amot high across 3 decks. Area measures flat floor space (Length x Width), while Volume measures total 3D space inside (Length x Width x Height).',
    keyFormula: 'Area = Length x Width  |  Volume = Length x Width x Height = 450,000 cu. amot',
    workedExample: {
      problem: 'A small wooden storage room inside the Ark is 20 amot long, 10 amot wide, and 10 amot high. Find its floor area and 3D volume.',
      steps: [
        'Floor Area = Length x Width = 20 x 10 = 200 square amot.',
        'Volume = Floor Area x Height = 200 x 10 = 2,000 cubic amot.',
      ],
      answer: 'Area = 200 sq. amot, Volume = 2,000 cu. amot',
    },
    practiceProblems: [
      {
        number: 1,
        prompt:
          'One deck of Noah’s Ark is 300 amot long and 50 amot wide. Calculate the floor area of ONE deck, and then multiply by 3 for all three decks.',
        hint: 'First solve 300 x 50 (3 x 5 = 15 with three zeros), then multiply your answer by 3.',
        answer: '15,000 sq. amot per deck; 45,000 sq. amot total',
        explanation: 'One deck = 300 x 50 = 15,000 sq. amot. Three decks = 15,000 x 3 = 45,000 sq. amot.',
      },
      {
        number: 2,
        prompt:
          'Since the Ark is 30 amot tall and divided equally into 3 decks (lower, middle, and upper), how tall is EACH deck?',
        hint: 'Divide total height (30 amot) by 3 decks.',
        answer: '10 amot high per deck',
        explanation: '30 / 3 = 10 amot tall per deck (about 15 feet—taller than a basketball hoop!).',
      },
      {
        number: 3,
        prompt:
          'If 1 amah is about 1.5 feet, how many feet wide is Noah’s Ark (50 amot)?',
        hint: '50 x 1.5 is the same as 50 + half of 50!',
        answer: '75 feet wide',
        explanation: '50 x 1.5 = 50 + 25 = 75 feet wide.',
      },
      {
        number: 4,
        prompt:
          'Find the full 3D Volume of Noah’s Ark in cubic amot: 300 amot long x 50 amot wide x 30 amot high.',
        hint: 'Multiply 15,000 (floor area) by 30 (height). Think 15 x 3 = 45, then attach four zeros!',
        answer: '450,000 cubic amot',
        explanation: '300 x 50 x 30 = 15,000 x 30 = 450,000 cubic amot.',
      },
      {
        number: 5,
        isBonus: true,
        prompt:
          'Bonus Challenge: A room on Deck 2 holds hay bales and measures 40 amot long by 25 amot wide. What is the perimeter (distance all the way around) of that room?',
        hint: 'Perimeter adds all four sides: 40 + 25 + 40 + 25.',
        answer: '130 amot',
        explanation: 'Perimeter = 2 x (40 + 25) = 2 x 65 = 130 amot.',
      },
    ],
  },

  'tallit-fractions': {
    lessonId: 'tallit-fractions',
    conceptTitle: 'Fair Division & Adding Fractions (Bava Metzia 2a)',
    conceptSummary:
      'When two people disagree over an object in Beit Din, first give each person whatever the other person does NOT claim (the undisputed part). Then divide ONLY the disputed piece equally in half!',
    keyFormula: 'Classic Case (All vs. 1/2):  Reuven = 1/2 + 1/4 = 3/4  |  Shimon = 1/4',
    workedExample: {
      problem: 'A tallit is worth 40 silver zuz. Reuven claims ALL of it, and Shimon claims HALF of it. How many zuz does each get?',
      steps: [
        'Shimon only claims half (20 zuz), so Reuven automatically gets the undisputed half (20 zuz).',
        'They split the disputed 20 zuz equally: 20 / 2 = 10 zuz each.',
        'Total: Reuven gets 20 + 10 = 30 zuz (3/4), and Shimon gets 10 zuz (1/4).',
      ],
      answer: 'Reuven: 30 zuz (3/4), Shimon: 10 zuz (1/4)',
    },
    practiceProblems: [
      {
        number: 1,
        prompt:
          'Both Reuven and Shimon claim ALL of a tallit worth 64 silver zuz. What fraction and how many zuz does each friend receive?',
        hint: 'The entire tallit is disputed, so split 64 in half (64 / 2).',
        answer: '1/2 each (32 zuz each)',
        explanation: 'When both claim all, each receives 1/2. Half of 64 is 32 zuz.',
      },
      {
        number: 2,
        prompt:
          'Reuven claims ALL of an 80-zuz tallit, and Shimon claims HALF of it. Use the Bava Metzia rule to find how many zuz each person receives.',
        hint: 'Reuven gets 3/4 of 80, and Shimon gets 1/4 of 80. Start by finding 80 / 4!',
        answer: 'Reuven gets 60 zuz; Shimon gets 20 zuz',
        explanation: '1/4 of 80 = 20 zuz for Shimon. 3/4 of 80 = 3 x 20 = 60 zuz for Reuven.',
      },
      {
        number: 3,
        prompt:
          'What is 1/2 + 1/4? Draw a rectangle split into 4 equal boxes to prove your answer.',
        hint: 'Rewrite 1/2 as 2/4 so both fractions have the same bottom number (4).',
        answer: '3/4',
        explanation: '1/2 = 2/4, and 2/4 + 1/4 = 3/4.',
      },
      {
        number: 4,
        prompt:
          'Reuven claims ALL of a tallit, and Shimon claims only ONE THIRD (1/3) of it. How much of the tallit is undisputed, and what fraction does Shimon get?',
        hint: 'Undisputed = 1 - 1/3 = 2/3. Then take half of the disputed 1/3!',
        answer: '2/3 undisputed; Shimon gets 1/6 (Reuven gets 5/6)',
        explanation: 'Half of 1/3 is 1/6! So Shimon gets 1/6, and Reuven gets 2/3 + 1/6 = 5/6.',
      },
      {
        number: 5,
        isBonus: true,
        prompt:
          'Bonus Challenge: A tallit is worth 100 zuz. Reuven claims ALL and Shimon claims 1/4 (25 zuz). How much does each receive?',
        hint: 'Reuven keeps the undisputed 75 zuz automatically, and they split the disputed 25 zuz in half (12.50 each).',
        answer: 'Reuven: 87.5 zuz (7/8), Shimon: 12.5 zuz (1/8)',
        explanation: 'Half of 25 is 12.5 zuz for Shimon; 75 + 12.5 = 87.5 zuz for Reuven.',
      },
    ],
  },

  'sukkah-geometry': {
    lessonId: 'sukkah-geometry',
    conceptTitle: 'Circle Circumference (Pi) & Square Diagonals',
    conceptSummary:
      'In Eruvin 14a, the Gemara gives a super-fast estimate for any circle: the distance around (Circumference) is about 3 times the distance across (Diameter), while exact pi is 3.14159. In Sukkah 8a, the Sages estimate a square’s diagonal as 1.4 times its side!',
    keyFormula: 'Gemara Rule: C ~ 3 x d  (Exact: 3.14 x d)  |  Square Diagonal ~ 1.4 x side',
    workedExample: {
      problem: 'A round fountain has a diameter of 6 tefachim. Find its estimated circumference using the Gemara rule (3 x d) and compare it to 3.14 x d.',
      steps: [
        'Gemara estimate: 3 x 6 = 18 tefachim.',
        'Exact pi estimate: 3.14 x 6 = 18.84 tefachim.',
        'Difference: 18.84 - 18 = 0.84 tefachim.',
      ],
      answer: '18 tefachim (Gemara rule) vs. 18.84 tefachim (exact pi)',
    },
    practiceProblems: [
      {
        number: 1,
        prompt:
          'King Solomon’s round copper basin (I Kings 7:23) was 10 amot across (diameter). Find its circumference using the Gemara rule (3 x d) AND using exact pi (3.14 x d).',
        hint: 'Multiply 10 by 3, then multiply 10 by 3.14 (move the decimal point one spot right!).',
        answer: '30 amot (Gemara) and 31.4 amot (exact pi)',
        explanation: '3 x 10 = 30 amot; 3.14 x 10 = 31.4 amot.',
      },
      {
        number: 2,
        prompt:
          'Using the Gemara rule (C ~ 3 x d) backward: if a circular tree trunk measures 27 tefachim around, about how wide is its diameter?',
        hint: 'Divide 27 by 3.',
        answer: 'About 9 tefachim across',
        explanation: '27 / 3 = 9 tefachim.',
      },
      {
        number: 3,
        prompt:
          'Using Sukkah 8a (Diagonal ~ 1.4 x side), about how long is the diagonal of a square Sukkah that is 5 amot on each side?',
        hint: 'Multiply 5 x 1.4 (think 5 x 1 = 5, plus 5 x 0.4 = 2).',
        answer: '7 amot',
        explanation: '5 x 1.4 = 5 + 2 = 7 amot!',
      },
      {
        number: 4,
        prompt:
          'A square Sukkah has sides of 10 tefachim each. What is its floor AREA (side x side), and what is its PERIMETER (all 4 sides added)?',
        hint: 'Area = 10 x 10. Perimeter = 10 + 10 + 10 + 10.',
        answer: 'Area = 100 sq. tefachim; Perimeter = 40 tefachim',
        explanation: 'Area = 10 x 10 = 100 sq. tefachim; Perimeter = 4 x 10 = 40 tefachim.',
      },
      {
        number: 5,
        isBonus: true,
        prompt:
          'Bonus Challenge: A round Sukkah needs to fit a 7 x 7 tefachim square inside it. Using Diagonal ~ 1.4 x side, what diameter does the round Sukkah need?',
        hint: 'Multiply 7 x 1.4 (7 x 1 = 7, plus 7 x 0.4 = 2.8).',
        answer: '9.8 tefachim (rounded up to 10 tefachim)',
        explanation: '7 x 1.4 = 9.8 tefachim—so a 10-tefach diameter fits a 7 x 7 square comfortably!',
      },
    ],
  },

  'batel-bshishim': {
    lessonId: 'batel-bshishim',
    conceptTitle: 'Ratios & Multiplying by 60 (Batel B’Shishim)',
    conceptSummary:
      'In Chullin 98a, the Gemara teaches Batel B’Shishim: if an accidental drop falls into a kosher pot, you need at least 60 times as much kosher food (a 60 : 1 ratio) for the drop’s flavor to vanish. Equivalent ratios scale both numbers by the exact same multiplier!',
    keyFormula: 'Required Kosher Soup = 60 x Accidental Drops  (Ratio >= 60 : 1)',
    workedExample: {
      problem: '2 spoons of milk accidentally drip into a pot of soup. How many spoons of kosher soup are needed for a 60 : 1 ratio?',
      steps: [
        'Multiply the number of accidental spoons by 60: 2 x 60.',
        'Think 2 x 6 = 12, then attach the zero -> 120 spoons.',
        'Check the ratio: 120 : 2 simplifies right back to 60 : 1!',
      ],
      answer: '120 spoons of kosher soup',
    },
    practiceProblems: [
      {
        number: 1,
        prompt:
          'Fill in the missing numbers in this 60 : 1 ratio table: 1 drop -> 60 spoons; 3 drops -> ___ spoons; 5 drops -> ___ spoons.',
        hint: 'Multiply 3 x 60 and 5 x 60.',
        answer: '180 spoons (for 3 drops) and 300 spoons (for 5 drops)',
        explanation: '3 x 60 = 180 spoons; 5 x 60 = 300 spoons.',
      },
      {
        number: 2,
        prompt:
          'A pot holds 150 spoons of kosher soup and 3 spoons accidentally fall in. Is the soup Batel B’Shishim? If not, how many MORE spoons would have been needed?',
        hint: 'First find 3 x 60 = 180, then compare 150 to 180.',
        answer: 'No — short by 30 spoons',
        explanation: '3 drops require 180 spoons, and 180 - 150 = 30 spoons short.',
      },
      {
        number: 3,
        prompt:
          'A giant Shabbat cholent pot holds 360 spoons of kosher food. What is the maximum number of accidental spoons that can be nullified at 60 : 1?',
        hint: 'Divide 360 by 60 (think: how many 6s are in 36?).',
        answer: '6 spoons',
        explanation: '360 / 60 = 6 spoons (since 6 x 60 = 360).',
      },
      {
        number: 4,
        prompt:
          'Half a spoon (0.5 spoon) accidentally drips into a pot. How many spoons of kosher soup are needed for Batel B’Shishim?',
        hint: 'What is half of 60?',
        answer: '30 spoons',
        explanation: '0.5 x 60 = 30 spoons of kosher soup!',
      },
      {
        number: 5,
        isBonus: true,
        prompt:
          'Bonus Challenge: A soup pot has 240 spoons of broth and 4 accidental drops. Simplify the ratio 240 : 4 to find how many spoons of broth exist per 1 drop.',
        hint: 'Divide both numbers by 4 (240 / 4 and 4 / 4).',
        answer: '60 : 1 (Yes, Batel B’Shishim!)',
        explanation: '240 / 4 = 60, so the ratio is exactly 60 : 1!',
      },
    ],
  },

  'gematria-workshop': {
    lessonId: 'gematria-workshop',
    conceptTitle: 'Place Value & Mental Addition via Gematria',
    conceptSummary:
      'In Hebrew Gematria, every letter stands for a place-value number: Alef through Tet are Ones (1-9), Yud through Tzadi are Tens (10-90), and Kuf through Tav are Hundreds (100-400). Grouping Hundreds, Tens, and Ones makes big mental sums super fast!',
    keyFormula: 'Echad (1+8+4) = 13  |  Ahavah (1+5+2+5) = 13  |  Chai (8+10) = 18',
    workedExample: {
      problem: 'Find the Gematria of Shalom (Peace) using its letters: Shin = 300, Lamed = 30, Vav = 6, Mem = 40.',
      steps: [
        'Group by place value: Hundreds = 300, Tens = 30 + 40, Ones = 6.',
        'Add the Tens: 30 + 40 = 70.',
        'Combine all places: 300 + 70 + 6 = 376!',
      ],
      answer: '376',
    },
    practiceProblems: [
      {
        number: 1,
        prompt:
          'The Hebrew word "Tov" (Good) has Tet (9) + Vav (6) + Bet (2). What is its total Gematria value?',
        hint: 'Add 9 + 6 + 2 (try making a 10 first: 9 + 1 + 5 + 2).',
        answer: '17',
        explanation: '9 + 6 + 2 = 17.',
      },
      {
        number: 2,
        prompt:
          'The word "Torah" uses Tav (400) + Vav (6) + Resh (200) + Heh (5). Group the Hundreds and Ones to find its Gematria!',
        hint: 'Add the Hundreds (400 + 200) first, then add the Ones (6 + 5).',
        answer: '611',
        explanation: '(400 + 200) + (6 + 5) = 600 + 11 = 611!',
      },
      {
        number: 3,
        prompt:
          'People love giving gifts in multiples of Chai (18). Fill in the next 3 multiples of 18: 18, 36, ___, ___, ___.',
        hint: 'Keep adding 18 each time (or add 20 and subtract 2!).',
        answer: '54, 72, 90',
        explanation: '36 + 18 = 54; 54 + 18 = 72; 72 + 18 = 90.',
      },
      {
        number: 4,
        prompt:
          'The word "Emet" (Truth) has Alef (1) + Mem (40) + Tav (400). What is the Gematria of Emet?',
        hint: 'Put the Hundreds, Tens, and Ones together: 400 + 40 + 1.',
        answer: '441',
        explanation: '400 + 40 + 1 = 441 (which is also 21 x 21!).',
      },
      {
        number: 5,
        isBonus: true,
        prompt:
          'Bonus Challenge: The word "Chochmah" (Wisdom) is Chet (8) + Kaf (20) + Mem (40) + Heh (5). Find its Gematria by adding the Tens first, then the Ones!',
        hint: 'Tens: 20 + 40 = 60. Ones: 8 + 5 = 13.',
        answer: '73',
        explanation: '(20 + 40) + (8 + 5) = 60 + 13 = 73.',
      },
    ],
  },

  'shaot-zmaniyot': {
    lessonId: 'shaot-zmaniyot',
    conceptTitle: 'Halachic Daylight Hours & Dividing by 12 (Orach Chaim 58:1)',
    conceptSummary:
      'In Shulchan Aruch Orach Chaim 58:1 & 89:1, each day’s sunlight from sunrise to sunset is divided into 12 equal Halachic Hours (Shaot Zmaniyot). Morning Shema is within the first 3 Halachic Hours, Shacharit within 4, and Midday (Chatzot) is always Hour 6!',
    keyFormula: '1 Halachic Hour = (Total Daylight Minutes) / 12  |  Shema = Sunrise + (3 x Hour)',
    workedExample: {
      problem: 'On a winter day with 10 hours of daylight (600 minutes) and sunrise at 7:00 AM, find 1 Halachic Hour and Latest Shema (Hour 3).',
      steps: [
        'Divide total daylight minutes by 12: 600 / 12 = 50 minutes per Halachic Hour.',
        'Multiply by 3 for Shema: 3 x 50 = 150 minutes = 2 hours and 30 minutes.',
        'Add 2 hrs 30 min to 7:00 AM -> Latest Shema is 9:30 AM!',
      ],
      answer: '1 Halachic Hour = 50 min; Latest Shema = 9:30 AM',
    },
    practiceProblems: [
      {
        number: 1,
        prompt:
          'On a spring equinox day with 12 hours of daylight (720 minutes), how many minutes long is 1 Halachic Hour? If sunrise is 6:30 AM, when is Midday (Hour 6)?',
        hint: '720 / 12 = 60 minutes. Add 6 hours to 6:30 AM!',
        answer: '60 minutes; Midday is 12:30 PM',
        explanation: '720 / 12 = 60 min per hour. 6:30 AM + 6 hours = 12:30 PM.',
      },
      {
        number: 2,
        prompt:
          'On a very short winter day, there are only 9 hours of daylight (540 minutes). How many minutes long is 1 Halachic Hour?',
        hint: 'Divide 540 by 12 (think: 12 x 40 = 480, leaving 60 more; 60 / 12 = 5!).',
        answer: '45 minutes',
        explanation: '540 / 12 = 45 minutes per Halachic Hour.',
      },
      {
        number: 3,
        prompt:
          'On a bright summer day with 14 hours of daylight (840 minutes), 1 Halachic Hour is 70 minutes. How many minutes is 3 Halachic Hours (Shema), and how many hours + minutes is that?',
        hint: 'Multiply 3 x 70 = 210 minutes. Every 60 minutes makes 1 hour!',
        answer: '210 minutes (3 hours and 30 minutes)',
        explanation: '3 x 70 = 210 minutes = 180 + 30 = 3 hours 30 minutes.',
      },
      {
        number: 4,
        prompt:
          'If sunrise is 6:00 AM and 1 Halachic Hour is 65 minutes, what time is Latest Shacharit (after 4 Halachic Hours)?',
        hint: '4 x 65 = 260 minutes = 4 hours and 20 minutes. Add that to 6:00 AM!',
        answer: '10:20 AM',
        explanation: '4 x 65 = 260 min = 4 hrs 20 min. 6:00 AM + 4 hrs 20 min = 10:20 AM.',
      },
      {
        number: 5,
        isBonus: true,
        prompt:
          'Bonus Challenge: If sunrise is 5:30 AM and sunset is 7:30 PM, how many total hours of daylight are there, and what exact clock time is Midday (Chatzot, Hour 6)?',
        hint: 'Count hours from 5:30 AM to 7:30 PM (14 hours). Half of 14 is 7 hours after sunrise!',
        answer: '14 hours of daylight; Midday is 12:30 PM',
        explanation: 'From 5:30 AM to 7:30 PM is 14 hours. Halfway (7 hours after 5:30 AM) is 12:30 PM.',
      },
    ],
  },

  'maaser-percent': {
    lessonId: 'maaser-percent',
    conceptTitle: 'Percentages, Dividing by 10 & Tzedakah (Yoreh Deah 249:1)',
    conceptSummary:
      'In Shulchan Aruch Yoreh Deah 249:1, Maaser means giving 10% (one-tenth) of earnings to Tzedakah, and Chomesh means giving a generous 20% (one-fifth). To find 10% of any round-ten dollar amount, just drop the last zero (divide by 10)—and double it for 20%!',
    keyFormula: 'Maaser (10%) = Total / 10  |  Chomesh (20%) = 2 x Maaser  |  Keep = Total - Give',
    workedExample: {
      problem: 'You earn $70 babysitting. Find both 10% Maaser and 20% Chomesh, plus how much you keep after giving Maaser.',
      steps: [
        'Drop the zero for 10% Maaser: $70 / 10 = $7.',
        'Double Maaser for 20% Chomesh: $7 x 2 = $14.',
        'Money kept after 10% Maaser: $70 - $7 = $63.',
      ],
      answer: 'Maaser = $7, Chomesh = $14, Keep (after Maaser) = $63',
    },
    practiceProblems: [
      {
        number: 1,
        prompt:
          'Use the Drop-the-Zero shortcut to find 10% Maaser for each amount: $40 -> $___, $90 -> $___, $130 -> $___.',
        hint: 'Divide each dollar amount by 10.',
        answer: '$4, $9, and $13',
        explanation: '$40 / 10 = $4; $90 / 10 = $9; $130 / 10 = $13.',
      },
      {
        number: 2,
        prompt:
          'You earn $80 mowing lawns and choose generous 20% Chomesh (Yoreh Deah 249:1). How much goes into the Tzedakah pushka, and how much do you keep?',
        hint: 'First find 10% ($8), double it for 20% ($16), then subtract $80 - $16.',
        answer: 'Give $16; Keep $64',
        explanation: '10% of $80 is $8, so 20% is $16. You keep $80 - $16 = $64.',
      },
      {
        number: 3,
        prompt:
          'Your class bake sale raises $200. How much is 10% Maaser, and how much is 20% Chomesh?',
        hint: '$200 / 10 = $20. Double $20 for Chomesh!',
        answer: 'Maaser = $20; Chomesh = $40',
        explanation: '10% of $200 = $20; 20% of $200 = 2 x $20 = $40.',
      },
      {
        number: 4,
        prompt:
          'You earned $35 and want to give 10% Maaser. How many dollars and cents go into the pushka?',
        hint: 'Divide 35 by 10 by moving the decimal point one place to the left ($3.50)!',
        answer: '$3.50',
        explanation: '$35 / 10 = $3.50 (three dollars and fifty cents).',
      },
      {
        number: 5,
        isBonus: true,
        prompt:
          'Bonus Challenge: You put $12 into your Tzedakah pushka, and that $12 was exactly 10% Maaser of your birthday money. How much total birthday money did you receive?',
        hint: 'Go backward! Multiply $12 by 10.',
        answer: '$120',
        explanation: 'Since $12 is 1/10 of the total, the full amount is $12 x 10 = $120!',
      },
    ],
  },

  'mezuzah-thirds': {
    lessonId: 'mezuzah-thirds',
    conceptTitle: 'Dividing Into Thirds & Measurement (Yoreh Deah 289:2)',
    conceptSummary:
      'In Shulchan Aruch Yoreh Deah 289:2, we measure a doorway’s height and divide by 3 to find three equal thirds (Bottom 1/3, Middle 1/3, Top 1/3). A kosher Mezuzah goes in the Top Third (above the 2/3 line) while leaving at least 1 tefach (~3.5 inches) below the top frame.',
    keyFormula: '1/3 = Height / 3  |  Top Third Starts at 2/3 = 2 x (Height / 3)',
    workedExample: {
      problem: 'A front doorway is 84 inches tall. Find 1/3 of the door, the 2/3 mark where the Top Third starts, and one kosher Mezuzah height.',
      steps: [
        'Divide 84 inches by 3: 84 / 3 = 28 inches per third.',
        'Multiply by 2 for the 2/3 mark: 2 x 28 = 56 inches.',
        'Leave 3.5 inches below the top (84 - 3.5 = 80.5 in). Any height from 56 to 80.5 in (like 58 in) is kosher!',
      ],
      answer: '1/3 = 28 in; Top Third starts at 56 in (e.g., 58 in is ideal)',
    },
    practiceProblems: [
      {
        number: 1,
        prompt:
          'A bedroom doorway is 78 inches tall. Divide by 3 to find how many inches tall ONE third (1/3) is, and where the 2/3 mark begins.',
        hint: 'Split 78 into 60 + 18: 60 / 3 = 20 and 18 / 3 = 6, so 78 / 3 = 26!',
        answer: '1/3 = 26 inches; 2/3 mark = 52 inches',
        explanation: '78 / 3 = 26 in per third; 2 x 26 = 52 inches.',
      },
      {
        number: 2,
        prompt:
          'A tall school entrance is 96 inches tall. Calculate 1/3 and 2/3 of the doorway height.',
        hint: '96 / 3 = (90 / 3) + (6 / 3) = 30 + 2 = 32 inches.',
        answer: '1/3 = 32 inches; 2/3 mark = 64 inches',
        explanation: '96 / 3 = 32 in; 2 x 32 = 64 inches from the floor.',
      },
      {
        number: 3,
        prompt:
          'On a 90-inch doorway (where each third is 30 inches), someone hangs a Mezuzah at 55 inches from the floor. Is it in the Top Third? Explain why or why not!',
        hint: 'Check where the 2/3 mark starts: 2 x 30 = 60 inches.',
        answer: 'No — 55 inches is 5 inches below the 60-inch (2/3) mark',
        explanation: 'Top third starts at 60 inches, so 55 inches is still in the Middle Third (5 inches too low).',
      },
      {
        number: 4,
        prompt:
          'A playroom door is 72 inches tall. Subtract 3.5 inches (1 tefach) from 72 inches to find the HIGHEST kosher spot for a Mezuzah.',
        hint: '72 - 3 = 69, then subtract 0.5 more!',
        answer: '68.5 inches',
        explanation: '72 - 3.5 = 68.5 inches from the floor.',
      },
      {
        number: 5,
        isBonus: true,
        prompt:
          'Bonus Challenge: The 1/3 height of a grand sanctuary doorway is 35 inches. How tall is the ENTIRE doorway, and where does the Top Third (2/3) begin?',
        hint: 'Multiply 35 x 3 for the whole door, and 35 x 2 for the 2/3 mark!',
        answer: 'Whole doorway = 105 inches; Top Third starts at 70 inches',
        explanation: '3 x 35 = 105 inches total height; 2 x 35 = 70 inches for the 2/3 mark.',
      },
    ],
  },

  'pi-gemara': {
    lessonId: 'pi-gemara',
    conceptTitle: 'Pi (π), Circle Area & Eruvin 76b’s Quarter Rule',
    conceptSummary:
      'In Eruvin 76b, the Gemara teaches that a square is larger than the circle fitted inside it by one quarter (1/4). Because a square around a circle of radius r has area 4 x r^2, taking away 1/4 leaves Area ~ 3 x r^2. Rambam (Eruvin 1:5) and Tosafot add that exact pi is closer to 3 and 1/7 (22/7 ~ 3.1429).',
    keyFormula: 'd = 2 x r  |  Gemara Area ~ 3 x r^2  |  Rambam Area ~ (22/7) x r^2',
    workedExample: {
      problem: 'Find the approximate area of a round courtyard with radius r = 5 amot using the Gemara’s rule (3 x r^2).',
      steps: [
        'Square the radius first: r^2 = 5 x 5 = 25.',
        'Multiply by 3 (the Gemara’s quick pi rule): 3 x 25 = 75 square amot.',
        'Check with Eruvin 76b: the outer 10 x 10 square has area 100, and 100 minus 1/4 (25) = 75!',
      ],
      answer: '75 square amot (exact pi x 25 ~ 78.54 sq. amot)',
    },
    practiceProblems: [
      {
        number: 1,
        prompt:
          'A round courtyard has radius r = 3 amot. What is its diameter (d = 2 x r), and what is its approximate area using 3 x r^2?',
        hint: 'Diameter is 2 x 3. For area, find r^2 = 3 x 3 = 9, then multiply by 3!',
        answer: 'Diameter = 6 amot; Gemara Area = 27 square amot',
        explanation: 'd = 2 x 3 = 6 amot. Area ~ 3 x (3 x 3) = 3 x 9 = 27 square amot.',
      },
      {
        number: 2,
        prompt:
          'Using Eruvin 76b’s rule ("square beats circle by 1/4"), if a square courtyard has an area of 64 square amot, about what is the area of the largest circle fitted inside it?',
        hint: 'Find 1/4 of 64 (64 / 4 = 16), then subtract 64 - 16!',
        answer: '48 square amot',
        explanation: '64 / 4 = 16 corner area removed; 64 - 16 = 48 square amot.',
      },
      {
        number: 3,
        prompt:
          'Using Rambam’s fraction pi ~ 22/7, calculate the circumference (C = pi x d) of a round garden with diameter d = 14 amot.',
        hint: 'Multiply (22/7) x 14: divide 14 / 7 = 2 first, then multiply 22 x 2!',
        answer: '44 amot',
        explanation: '(22/7) x 14 = 22 x 2 = 44 amot!',
      },
      {
        number: 4,
        prompt:
          'A circular plaza has radius r = 7 amot. Compare its area using the Gemara quick rule (3 x r^2) versus Rambam’s rule ((22/7) x r^2).',
        hint: '7^2 = 49. Compute 3 x 49 and (22/7) x 49 = 22 x 7!',
        answer: 'Gemara quick rule: 147 sq. amot; Rambam 22/7 rule: 154 sq. amot',
        explanation: '3 x 49 = 147 sq. amot; (22/7) x 49 = 22 x 7 = 154 sq. amot (very close to exact 153.94).',
      },
      {
        number: 5,
        isBonus: true,
        prompt:
          'Bonus Challenge: If you DOUBLE the radius of a circle from r = 3 to r = 6, how many times larger does its area become?',
        hint: 'Compare 3 x (3^2) = 27 with 3 x (6^2) = 108. Divide 108 / 27!',
        answer: '4 times larger (2^2 = 4)',
        explanation: 'Area grows with r^2: doubling r makes r^2 grow by 2 x 2 = 4 times (108 / 27 = 4)!',
      },
    ],
  },

  'exponents-gemara': {
    lessonId: 'exponents-gemara',
    conceptTitle: 'Exponents, Squares (x^2), Cubes (x^3) & Powers of 10',
    conceptSummary:
      'An exponent tells you how many times to multiply the base number by itself (so 2^4 = 2 x 2 x 2 x 2 = 16, NOT 2 x 4 = 8). In Eruvin 23b, a square Beit Se’ah courtyard is 50^2 = 2,500 sq. amot, and in Berachot 32b Reish Lakish counts the starry sky using huge Powers of 10 (10^4 = 10,000, climbing to 10^18)!',
    keyFormula: 'b^e = b x b x ... x b (e times)  |  50^2 = 2,500  |  10^n = 1 with n zeros',
    workedExample: {
      problem: 'Calculate 2^5 and compare it to 2 x 5.',
      steps: [
        'Write five 2s multiplied together: 2 x 2 x 2 x 2 x 2.',
        'Multiply step by step: 2 x 2 = 4 -> 4 x 2 = 8 -> 8 x 2 = 16 -> 16 x 2 = 32.',
        'Notice that 2^5 = 32 is much larger than 2 x 5 = 10!',
      ],
      answer: '2^5 = 32',
    },
    practiceProblems: [
      {
        number: 1,
        prompt:
          'Write out 4^3 as repeated multiplication and find its exact value.',
        hint: 'Multiply three 4s together: 4 x 4 = 16, then 16 x 4!',
        answer: '4 x 4 x 4 = 64',
        explanation: '4 x 4 = 16, and 16 x 4 = 64.',
      },
      {
        number: 2,
        prompt:
          'In Eruvin 23b, a square courtyard has sides of 50 amot (50^2). Find 50^2, and also find the area of a smaller square courtyard of 20^2.',
        hint: '50 x 50 = (5 x 5) with two zeros; 20 x 20 = (2 x 2) with two zeros.',
        answer: '50^2 = 2,500 sq. amot; 20^2 = 400 sq. amot',
        explanation: '50 x 50 = 2,500 and 20 x 20 = 400 square amot.',
      },
      {
        number: 3,
        prompt:
          'In Berachot 32b, Reish Lakish counts stars in groups of 10,000 (a myriad). Write 10,000 and 1,000,000 as Powers of 10.',
        hint: 'Count the zeros after the 1 in each number!',
        answer: '10,000 = 10^4; 1,000,000 = 10^6',
        explanation: '10,000 has 4 zeros (10^4) and 1,000,000 has 6 zeros (10^6).',
      },
      {
        number: 4,
        prompt:
          'Which is bigger: 2^6 or 6^2? Show both answers!',
        hint: 'Compute 2 x 2 x 2 x 2 x 2 x 2 and compare with 6 x 6!',
        answer: '2^6 (64) is bigger than 6^2 (36)',
        explanation: '2^6 = 64 while 6^2 = 36, so 2^6 is 28 larger!',
      },
      {
        number: 5,
        isBonus: true,
        prompt:
          'Bonus Challenge (Berachot 32b): If you multiply 10^4 (10,000) x 10^4 (10,000), what Power of 10 do you get, and how many zeros does it have?',
        hint: 'When multiplying powers of 10, add the exponents: 4 + 4!',
        answer: '10^8 (100,000,000 — 8 zeros, one hundred million!)',
        explanation: '10^4 x 10^4 = 10^(4+4) = 10^8 = 100,000,000!',
      },
    ],
  },
};
