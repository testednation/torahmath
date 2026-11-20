import type { LessonId } from '../data/lessons';

interface LessonPreviewArtProps {
  lessonId: LessonId;
}

export function LessonPreviewArt({ lessonId }: LessonPreviewArtProps) {
  switch (lessonId) {
    case 'chanukah-candles':
      return (
        <svg viewBox="0 0 220 92" className="w-full h-24" aria-hidden="true">
          <rect x="0" y="0" width="220" height="92" rx="10" fill="#F8FAFC" />
          {/* Staircase of 8 nights */}
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => {
            const x = 22 + i * 23;
            const h = 8 + n * 6;
            const y = 76 - h;
            return (
              <g key={n}>
                <rect x={x} y={y} width="14" height={h} rx="2" fill="#1D4ED8" opacity={0.2 + n * 0.1} />
                <ellipse cx={x + 7} cy={y - 5} rx="3.2" ry="5" fill="#D97706" />
              </g>
            );
          })}
          <line x1="16" y1="78" x2="204" y2="78" stroke="#CBD5E1" strokeWidth="2" />
        </svg>
      );

    case 'noahs-ark':
      return (
        <svg viewBox="0 0 220 92" className="w-full h-24" aria-hidden="true">
          <rect x="0" y="0" width="220" height="92" rx="10" fill="#F8FAFC" />
          {/* 3-deck Ark cutaway */}
          <polygon points="36,74 184,74 198,36 22,36" fill="#E2E8F0" stroke="#334155" strokeWidth="1.8" />
          <rect x="52" y="22" width="116" height="14" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="1.6" />
          <line x1="27" y1="49" x2="193" y2="49" stroke="#64748B" strokeWidth="1.2" strokeDasharray="3 3" />
          <line x1="32" y1="62" x2="188" y2="62" stroke="#64748B" strokeWidth="1.2" strokeDasharray="3 3" />
          <text x="110" y="86" textAnchor="middle" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="#475569">
            300 × 50 × 30
          </text>
        </svg>
      );

    case 'tallit-fractions':
      return (
        <svg viewBox="0 0 220 92" className="w-full h-24" aria-hidden="true">
          <rect x="0" y="0" width="220" height="92" rx="10" fill="#F8FAFC" />
          {/* Tallit partitioned into 1/2 + 1/4 + 1/4 */}
          <rect x="24" y="20" width="86" height="44" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="1.8" />
          <rect x="110" y="20" width="43" height="44" fill="#BFDBFE" stroke="#1D4ED8" strokeWidth="1.8" />
          <rect x="153" y="20" width="43" height="44" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.8" />
          <line x1="24" y1="28" x2="196" y2="28" stroke="#1D4ED8" strokeWidth="1.5" opacity="0.45" />
          <line x1="24" y1="56" x2="196" y2="56" stroke="#1D4ED8" strokeWidth="1.5" opacity="0.45" />
          <text x="67" y="46" textAnchor="middle" fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fill="#1E3A8A">
            1/2
          </text>
          <text x="131.5" y="46" textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fill="#1E3A8A">
            1/4
          </text>
          <text x="174.5" y="46" textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fill="#92400E">
            1/4
          </text>
          <text x="110" y="80" textAnchor="middle" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="#475569">
            Reuven 3/4 · Shimon 1/4
          </text>
        </svg>
      );

    case 'sukkah-geometry':
      return (
        <svg viewBox="0 0 220 92" className="w-full h-24" aria-hidden="true">
          <rect x="0" y="0" width="220" height="92" rx="10" fill="#F8FAFC" />
          {/* Inscribed square inside circle */}
          <circle cx="72" cy="46" r="30" fill="#EFF6FF" stroke="#1D4ED8" strokeWidth="2" />
          <rect x="51" y="25" width="42" height="42" fill="#FFFFFF" fillOpacity="0.85" stroke="#047857" strokeWidth="1.8" />
          <line x1="51" y1="67" x2="93" y2="25" stroke="#D97706" strokeWidth="1.8" strokeDasharray="3 2" />
          {/* Unrolled ruler lines */}
          <line x1="120" y1="58" x2="202" y2="58" stroke="#334155" strokeWidth="2" />
          <line x1="120" y1="52" x2="120" y2="64" stroke="#334155" strokeWidth="2" />
          <line x1="146" y1="54" x2="146" y2="62" stroke="#1D4ED8" strokeWidth="1.5" />
          <line x1="172" y1="54" x2="172" y2="62" stroke="#1D4ED8" strokeWidth="1.5" />
          <line x1="198" y1="52" x2="198" y2="64" stroke="#D97706" strokeWidth="2" />
          <text x="160" y="42" textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fill="#1E293B">
            C ≈ 3 × d
          </text>
          <text x="160" y="76" textAnchor="middle" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="#475569">
            π ≈ 3.14
          </text>
        </svg>
      );

    case 'batel-bshishim':
      return (
        <svg viewBox="0 0 220 92" className="w-full h-24" aria-hidden="true">
          <rect x="0" y="0" width="220" height="92" rx="10" fill="#F8FAFC" />
          {/* 1 drop vs 60-cell ratio block */}
          <circle cx="38" cy="46" r="10" fill="#FEF3C7" stroke="#B45309" strokeWidth="2" />
          <text x="38" y="50" textAnchor="middle" fontSize="10" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fill="#92400E">
            1
          </text>
          <text x="61" y="50" textAnchor="middle" fontSize="13" fontFamily="IBM Plex Mono, monospace" fill="#64748B">
            :
          </text>
          {/* 10x6 mini grid representing 60 parts */}
          {Array.from({ length: 60 }).map((_, idx) => {
            const col = idx % 10;
            const row = Math.floor(idx / 10);
            return (
              <rect
                key={idx}
                x={76 + col * 11.5}
                y={18 + row * 9.5}
                width="9"
                height="7"
                rx="1.5"
                fill="#047857"
                opacity={0.22 + ((idx % 5) * 0.12)}
              />
            );
          })}
          <text x="133" y="85" textAnchor="middle" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="#047857">
            60 parts kosher
          </text>
        </svg>
      );

    case 'gematria-workshop':
      return (
        <svg viewBox="0 0 220 92" className="w-full h-24" aria-hidden="true">
          <rect x="0" y="0" width="220" height="92" rx="10" fill="#F8FAFC" />
          {[
            { letter: 'א', val: '1', x: 144 },
            { letter: 'ח', val: '8', x: 92 },
            { letter: 'ד', val: '4', x: 40 },
          ].map((tile) => (
            <g key={tile.letter}>
              <rect
                x={tile.x}
                y="18"
                width="38"
                height="44"
                rx="6"
                fill="#FFFFFF"
                stroke="#CBD5E1"
                strokeWidth="1.8"
              />
              <text
                x={tile.x + 19}
                y="42"
                textAnchor="middle"
                fontSize="19"
                fontWeight="700"
                fill="#0F172A"
              >
                {tile.letter}
              </text>
              <text
                x={tile.x + 19}
                y="56"
                textAnchor="middle"
                fontSize="9.5"
                fontFamily="IBM Plex Mono, monospace"
                fill="#1D4ED8"
              >
                {tile.val}
              </text>
            </g>
          ))}
          <text x="110" y="80" textAnchor="middle" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="#475569">
            1 + 8 + 4 = 13 (Echad)
          </text>
        </svg>
      );

    case 'shaot-zmaniyot':
      return (
        <svg viewBox="0 0 220 92" className="w-full h-24" aria-hidden="true">
          <rect x="0" y="0" width="220" height="92" rx="10" fill="#F8FAFC" />
          {/* 12-wedge daylight sun arc */}
          <path d="M 38 70 A 72 72 0 0 1 182 70" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
          <path d="M 110 70 L 38 70 A 72 72 0 0 1 59 19 Z" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="1.5" />
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((h) => {
            const rad = Math.PI - (h / 12) * Math.PI;
            const x2 = 110 + Math.cos(rad) * 72;
            const y2 = 70 - Math.sin(rad) * 72;
            return (
              <line
                key={h}
                x1="110"
                y1="70"
                x2={x2}
                y2={y2}
                stroke={h === 3 ? '#1D4ED8' : '#CBD5E1'}
                strokeWidth={h === 3 || h === 6 ? '1.8' : '1'}
              />
            );
          })}
          <circle cx="110" cy="24" r="6" fill="#F59E0B" />
          <line x1="26" y1="70" x2="194" y2="70" stroke="#64748B" strokeWidth="1.5" />
          <text x="110" y="85" textAnchor="middle" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="#475569">
            12 Daylight Hours · Shema = Hr 3
          </text>
        </svg>
      );

    case 'maaser-percent':
      return (
        <svg viewBox="0 0 220 92" className="w-full h-24" aria-hidden="true">
          <rect x="0" y="0" width="220" height="92" rx="10" fill="#F8FAFC" />
          {/* 10x5 mini percent grid with 1st column highlighted (10%) */}
          {Array.from({ length: 50 }).map((_, idx) => {
            const col = idx % 10;
            const row = Math.floor(idx / 10);
            const isMaaser = col === 0;
            return (
              <rect
                key={idx}
                x={24 + col * 11}
                y={16 + row * 10}
                width="8.5"
                height="7.5"
                rx="1.5"
                fill={isMaaser ? '#D97706' : '#CBD5E1'}
              />
            );
          })}
          {/* Mini Pushka box */}
          <rect x="150" y="20" width="42" height="46" rx="6" fill="#DBEAFE" stroke="#1D4ED8" strokeWidth="1.8" />
          <rect x="163" y="26" width="16" height="3.5" rx="1.5" fill="#1E3A8A" />
          <text x="171" y="50" textAnchor="middle" fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="700" fill="#1E3A8A">
            10%
          </text>
          <text x="110" y="83" textAnchor="middle" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="#475569">
            Maaser (10%) · Chomesh (20%)
          </text>
        </svg>
      );

    case 'mezuzah-thirds':
      return (
        <svg viewBox="0 0 220 92" className="w-full h-24" aria-hidden="true">
          <rect x="0" y="0" width="220" height="92" rx="10" fill="#F8FAFC" />
          {/* Doorway divided into 3 equal thirds */}
          <rect x="74" y="12" width="52" height="66" rx="2" fill="#FFFFFF" stroke="#334155" strokeWidth="2" />
          <rect x="75" y="13" width="50" height="21" fill="#D1FAE5" />
          <line x1="74" y1="34" x2="126" y2="34" stroke="#047857" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="74" y1="56" x2="126" y2="56" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="3 2" />
          {/* Slanted mezuzah case on right post in top third */}
          <rect
            x="128"
            y="20"
            width="6"
            height="14"
            rx="2"
            fill="#D97706"
            transform="rotate(-14, 131, 27)"
          />
          <text x="58" y="27" textAnchor="end" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="#047857" fontWeight="700">
            Top 1/3
          </text>
          <text x="58" y="48" textAnchor="end" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="#64748B">
            Mid 1/3
          </text>
          <text x="58" y="70" textAnchor="end" fontSize="9" fontFamily="IBM Plex Mono, monospace" fill="#64748B">
            Bot 1/3
          </text>
          <text x="174" y="48" textAnchor="middle" fontSize="9.5" fontFamily="IBM Plex Mono, monospace" fill="#475569">
            Height ÷ 3
          </text>
        </svg>
      );
  }
}
