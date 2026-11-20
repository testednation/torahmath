import { useState } from 'react';
import {
  ArrowRight,
  Volume2,
  VolumeX,
  Trophy,
  Star,
} from 'lucide-react';
import { ASSET_IMAGES, formatTrackLabel, type TrackType } from '../data/lessons';
import { ResilientImage } from './ResilientImage';
import { MannaBasketGame } from './games/MannaBasketGame';
import { ArkPairsGame } from './games/ArkPairsGame';
import { GematriaMemoryGame } from './games/GematriaMemoryGame';
import { BeitDinScaleGame } from './games/BeitDinScaleGame';
import { TzedakahPushkaGame } from './games/TzedakahPushkaGame';
import { ShabbatClockGame } from './games/ShabbatClockGame';
import { GematriaCalculatorGame } from './games/GematriaCalculatorGame';
import { isSoundEnabled, setSoundEnabled, playTap } from '../utils/soundFx';

export type GameId =
  | 'manna-basket'
  | 'ark-pairs'
  | 'gematria-memory'
  | 'beit-din-scale'
  | 'tzedakah-pushka'
  | 'shabbat-clock'
  | 'gematria-calculator';

export interface GameStats {
  wins: number;
  bestScore: number;
}

interface MathGamesHubProps {
  gameStats: Record<string, GameStats>;
  onRecordGameWin: (gameId: GameId, track: TrackType, score: number) => void;
  initialGameId?: GameId | null;
}

interface GameCatalogItem {
  id: GameId;
  order: number;
  track: TrackType;
  title: string;
  hebrewTitle: string;
  sourceRef: string;
  mathSkill: string;
  ageRange: string;
  summary: string;
}

const GAME_CATALOG: GameCatalogItem[] = [
  {
    id: 'manna-basket',
    order: 1,
    track: 'torah',
    title: 'Manna Basket Catcher',
    hebrewTitle: 'לקט המן',
    sourceRef: 'Shemot 16:16',
    mathSkill: 'Addition & Making Tens',
    ageRange: 'Ages 5–10',
    summary:
      'Tap numbered golden Manna loaves to fill each family’s Omer basket to the exact target sum—not too little and not too much!',
  },
  {
    id: 'ark-pairs',
    order: 2,
    track: 'torah',
    title: 'Noah’s Ark Animal Pairs',
    hebrewTitle: 'שנים שנים לתיבה',
    sourceRef: 'Bereishit 7:2',
    mathSkill: 'Skip Counting & Multiplication (2s & 7s)',
    ageRange: 'Ages 5–10',
    summary:
      'Count animals marching aboard the Ark in pairs of 2 and kosher groups of 7, with an animated Count Together helper for beginners.',
  },
  {
    id: 'gematria-memory',
    order: 3,
    track: 'torah',
    title: 'Gematria Memory Match',
    hebrewTitle: 'זיכרון גימטריא',
    sourceRef: 'Torah Alef-Bet',
    mathSkill: 'Hebrew Letters & Number Values',
    ageRange: 'Ages 6–12',
    summary:
      'Flip wooden memory cards to pair Hebrew letters like א (1), ח (8), י (10), and words like חי (18) with their numeric values.',
  },
  {
    id: 'beit-din-scale',
    order: 4,
    track: 'gemara',
    title: 'Beit Din Scale Balancer',
    hebrewTitle: 'מאזני צדק',
    sourceRef: 'Bava Metzia 2a · Maaser',
    mathSkill: 'Halves, Quarters, 10% & Equations',
    ageRange: 'Ages 6–12',
    summary:
      'Drop silver zuz coin weights onto the gleaming brass courtroom scale until both pans balance evenly in fair division puzzles.',
  },
  {
    id: 'tzedakah-pushka',
    order: 5,
    track: 'shulchan-aruch',
    title: 'Tzedakah Pushka 10% Dash',
    hebrewTitle: 'קופת צדקה',
    sourceRef: 'Yoreh Deah 249:1',
    mathSkill: 'Dividing by 10, 10% Maaser & 20% Chomesh',
    ageRange: 'Ages 6–12',
    summary:
      'Drop $1, $5, and $10 coins into the brass Tzedakah pushka to match exact 10% Maaser or 20% Chomesh gifts using the Drop-the-Zero trick.',
  },
  {
    id: 'shabbat-clock',
    order: 6,
    track: 'shulchan-aruch',
    title: 'Shabbat Candle-Lighting Clock',
    hebrewTitle: 'הדלקת נרות שבת',
    sourceRef: 'Orach Chaim 263:4',
    mathSkill: 'Clock Reading & Subtracting Minutes (18 min)',
    ageRange: 'Ages 6–12',
    summary:
      'Wind the analog and digital clock backward from Friday sunset—by 10 or 15 minutes in Beginner mode, or the authentic 18 minutes in Explorer mode!',
  },
  {
    id: 'gematria-calculator',
    order: 7,
    track: 'torah',
    title: 'Gematria Calculator',
    hebrewTitle: 'מחשבון גימטריא',
    sourceRef: 'Mispar Hechrechi',
    mathSkill: 'Hebrew Letter Values & Real-Time Addition',
    ageRange: 'Ages 5–12',
    summary:
      'Type any Hebrew word or your own name—with a built-in Alef-Bet keyboard—to see its real-time Gematria sum, letter breakdown, and Torah twins!',
  },
];

function GameMiniIllustration({ gameId }: { gameId: GameId }) {
  switch (gameId) {
    case 'manna-basket':
      return (
        <svg viewBox="0 0 220 84" className="w-full h-20" aria-hidden="true">
          <rect width="220" height="84" rx="10" fill="#F8FAFC" />
          {[
            { x: 34, val: '3', active: true },
            { x: 92, val: '7', active: true },
            { x: 150, val: '4', active: false },
          ].map((b) => (
            <g key={b.x}>
              <rect
                x={b.x}
                y="16"
                width="38"
                height="40"
                rx="8"
                fill={b.active ? '#DBEAFE' : '#FEF3C7'}
                stroke={b.active ? '#1D4ED8' : '#D97706'}
                strokeWidth="1.8"
              />
              <text
                x={b.x + 19}
                y="42"
                textAnchor="middle"
                fontSize="16"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fill={b.active ? '#1E3A8A' : '#92400E'}
              >
                {b.val}
              </text>
            </g>
          ))}
          <text
            x="110"
            y="74"
            textAnchor="middle"
            fontSize="10"
            fontFamily="IBM Plex Mono, monospace"
            fill="#047857"
            fontWeight="600"
          >
            3 + 7 = 10 Omers
          </text>
        </svg>
      );

    case 'ark-pairs':
      return (
        <svg viewBox="0 0 220 84" className="w-full h-20" aria-hidden="true">
          <rect width="220" height="84" rx="10" fill="#F8FAFC" />
          {[0, 1, 2, 3].map((g) => {
            const x = 22 + g * 46;
            return (
              <g key={g}>
                <rect x={x} y="16" width="38" height="36" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
                <circle cx={x + 12} cy="34" r="6" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="1.5" />
                <circle cx={x + 26} cy="34" r="6" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="1.5" />
                <text
                  x={x + 19}
                  y="68"
                  textAnchor="middle"
                  fontSize="10"
                  fontFamily="IBM Plex Mono, monospace"
                  fill="#1D4ED8"
                  fontWeight="600"
                >
                  {(g + 1) * 2}
                </text>
              </g>
            );
          })}
        </svg>
      );

    case 'gematria-memory':
      return (
        <svg viewBox="0 0 220 84" className="w-full h-20" aria-hidden="true">
          <rect width="220" height="84" rx="10" fill="#F8FAFC" />
          <rect x="28" y="14" width="44" height="54" rx="8" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.8" />
          <text x="50" y="47" textAnchor="middle" fontSize="20" fontWeight="700" fill="#1E3A8A">
            חי
          </text>
          <rect x="88" y="14" width="44" height="54" rx="8" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" />
          <text x="110" y="48" textAnchor="middle" fontSize="18" fontFamily="IBM Plex Mono, monospace" fontWeight="700" fill="#92400E">
            18
          </text>
          <rect x="148" y="14" width="44" height="54" rx="8" fill="#1E293B" />
          <text x="170" y="48" textAnchor="middle" fontSize="18" fontWeight="700" fill="#94A3B8">
            ?
          </text>
        </svg>
      );

    case 'beit-din-scale':
      return (
        <svg viewBox="0 0 220 84" className="w-full h-20" aria-hidden="true">
          <rect width="220" height="84" rx="10" fill="#F8FAFC" />
          <rect x="107" y="20" width="6" height="48" rx="2" fill="#B45309" />
          <rect x="86" y="66" width="48" height="6" rx="3" fill="#92400E" />
          <line x1="48" y1="26" x2="172" y2="26" stroke="#D97706" strokeWidth="4" strokeLinecap="round" />
          <rect x="34" y="34" width="32" height="20" rx="4" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="1.5" />
          <text x="50" y="48" textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="700" fill="#1E3A8A">
            1/2
          </text>
          <rect x="154" y="34" width="32" height="20" rx="4" fill="#D1FAE5" stroke="#047857" strokeWidth="1.5" />
          <text x="170" y="48" textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="700" fill="#065F46">
            6
          </text>
        </svg>
      );

    case 'tzedakah-pushka':
      return (
        <svg viewBox="0 0 220 84" className="w-full h-20" aria-hidden="true">
          <rect width="220" height="84" rx="10" fill="#F8FAFC" />
          <rect x="34" y="18" width="54" height="50" rx="6" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.8" />
          <rect x="30" y="14" width="62" height="8" rx="3" fill="#D97706" />
          <text x="61" y="42" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1E3A8A">
            צדקה
          </text>
          <text x="61" y="58" textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="700" fill="#047857">
            10%
          </text>
          {[
            { cx: 124, label: '$1' },
            { cx: 156, label: '$5' },
            { cx: 188, label: '$10' },
          ].map((c) => (
            <g key={c.label}>
              <circle cx={c.cx} cy="42" r="13" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.8" />
              <text x={c.cx} y="46" textAnchor="middle" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fontWeight="700" fill="#92400E">
                {c.label}
              </text>
            </g>
          ))}
        </svg>
      );

    case 'shabbat-clock':
      return (
        <svg viewBox="0 0 220 84" className="w-full h-20" aria-hidden="true">
          <rect width="220" height="84" rx="10" fill="#F8FAFC" />
          <circle cx="62" cy="42" r="27" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
          <line x1="62" y1="42" x2="73" y2="52" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="62" y1="42" x2="62" y2="22" stroke="#1D4ED8" strokeWidth="2" strokeLinecap="round" />
          <circle cx="62" cy="42" r="2.5" fill="#D97706" />
          <text x="150" y="38" textAnchor="middle" fontSize="13" fontFamily="IBM Plex Mono, monospace" fontWeight="700" fill="#1D4ED8">
            −18 min
          </text>
          <text x="150" y="56" textAnchor="middle" fontSize="9.5" fontFamily="Plus Jakarta Sans, sans-serif" fontWeight="600" fill="#64748B">
            Before Sunset
          </text>
        </svg>
      );

    case 'gematria-calculator':
      return (
        <svg viewBox="0 0 220 84" className="w-full h-20" aria-hidden="true">
          <rect width="220" height="84" rx="10" fill="#F8FAFC" />
          <rect x="18" y="14" width="112" height="34" rx="7" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.6" />
          <text x="74" y="37" textAnchor="middle" fontSize="19" fontWeight="700" fill="#0F172A">
            שלום
          </text>
          <rect x="140" y="14" width="62" height="34" rx="7" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="1.8" />
          <text x="171" y="36" textAnchor="middle" fontSize="15" fontFamily="IBM Plex Mono, monospace" fontWeight="700" fill="#1D4ED8">
            = 376
          </text>
          <text x="110" y="68" textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fill="#047857">
            300 + 30 + 6 + 40
          </text>
        </svg>
      );
  }
}

export function MathGamesHub({
  gameStats,
  onRecordGameWin,
  initialGameId = null,
}: MathGamesHubProps) {
  const [activeGame, setActiveGame] = useState<GameId | null>(initialGameId);
  const [soundOn, setSoundOn] = useState(() => isSoundEnabled());

  const totalWins = Object.values(gameStats).reduce((s, g) => s + g.wins, 0);

  function toggleSound() {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) playTap();
  }

  function openGame(id: GameId) {
    playTap();
    setActiveGame(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (activeGame === 'manna-basket') {
    return (
      <MannaBasketGame
        onBack={() => setActiveGame(null)}
        onCompleteRound={(score) => onRecordGameWin('manna-basket', 'torah', score)}
      />
    );
  }

  if (activeGame === 'ark-pairs') {
    return (
      <ArkPairsGame
        onBack={() => setActiveGame(null)}
        onCompleteRound={(score) => onRecordGameWin('ark-pairs', 'torah', score)}
      />
    );
  }

  if (activeGame === 'gematria-memory') {
    return (
      <GematriaMemoryGame
        onBack={() => setActiveGame(null)}
        onCompleteRound={(score) => onRecordGameWin('gematria-memory', 'torah', score)}
      />
    );
  }

  if (activeGame === 'beit-din-scale') {
    return (
      <BeitDinScaleGame
        onBack={() => setActiveGame(null)}
        onCompleteRound={(score) => onRecordGameWin('beit-din-scale', 'gemara', score)}
      />
    );
  }

  if (activeGame === 'tzedakah-pushka') {
    return (
      <TzedakahPushkaGame
        onBack={() => setActiveGame(null)}
        onCompleteRound={(score) =>
          onRecordGameWin('tzedakah-pushka', 'shulchan-aruch', score)
        }
      />
    );
  }

  if (activeGame === 'shabbat-clock') {
    return (
      <ShabbatClockGame
        onBack={() => setActiveGame(null)}
        onCompleteRound={(score) =>
          onRecordGameWin('shabbat-clock', 'shulchan-aruch', score)
        }
      />
    );
  }

  if (activeGame === 'gematria-calculator') {
    return (
      <GematriaCalculatorGame
        onBack={() => setActiveGame(null)}
        onCompleteRound={(score) =>
          onRecordGameWin('gematria-calculator', 'torah', score)
        }
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Arcade Header Banner */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
        <div className="lg:col-span-7 p-6 lg:p-8 flex flex-col justify-center">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <p className="text-xs font-medium text-slate-500">
              Torah, Gemara &amp; Shulchan Aruch Math Games · Beginner &amp; Explorer Levels
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
            Play &amp; Practice Math Through Fun Torah Games
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-xl mb-5">
            Every game offers a calm <strong>Beginner</strong> level for younger kids (ages 5–7) and an <strong>Explorer</strong> level (ages 8–12)—with zero stressful countdowns, helpful visual hints, and gentle chimes.
          </p>

          <div className="flex items-center gap-6 text-xs font-mono text-slate-600 tabular-nums">
            <span className="inline-flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <strong className="text-slate-900">{totalWins}</strong> games completed
            </span>
            <span>·</span>
            <span>{GAME_CATALOG.length} interactive games &amp; tools</span>
          </div>
        </div>

        <div className="lg:col-span-5 min-h-[210px]">
          <ResilientImage
            src={ASSET_IMAGES.mathGames}
            alt="Sunlit wooden play table with a memory tile game, miniature Noah's Ark animal pairs on a ramp, baskets of golden manna loaves, and a brass balance scale"
            fallbackTitle="Torah Math Games Arcade"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* 6 Game Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {GAME_CATALOG.map((game) => {
          const stats = gameStats[game.id] ?? { wins: 0, bestScore: 0 };
          return (
            <button
              key={game.id}
              type="button"
              onClick={() => openGame(game.id)}
              className="group text-left bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-600 transition-all flex flex-col justify-between gap-5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                  <span className="truncate">
                    Game 0{game.order} · {formatTrackLabel(game.track)} · {game.sourceRef}
                  </span>
                  <span className="font-mono shrink-0 tabular-nums text-slate-400">
                    {game.ageRange}
                  </span>
                </div>

                <GameMiniIllustration gameId={game.id} />

                <div>
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {game.title}
                    </h2>
                    <span
                      dir="rtl"
                      className="text-sm font-semibold text-slate-500 shrink-0"
                    >
                      {game.hebrewTitle}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-blue-800 mb-2">
                    {game.mathSkill}
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {game.summary}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                <span className="font-mono text-slate-600 tabular-nums inline-flex items-center gap-1.5">
                  <Star
                    className={`w-3.5 h-3.5 ${
                      stats.wins > 0
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-slate-300'
                    }`}
                    aria-hidden="true"
                  />
                  {stats.wins > 0
                    ? `${stats.wins} ${stats.wins === 1 ? 'win' : 'wins'} · Best ${stats.bestScore}`
                    : 'Beginner & Explorer modes'}
                </span>
                <span className="text-blue-700 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  {game.id === 'gematria-calculator' ? 'Open Calculator' : 'Play Game'}
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </span>
              </div>
            </button>
          );
        })}
      </section>
    </div>
  );
}
