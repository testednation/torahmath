import { useState } from 'react';
import { Check, Flame, Pencil, Save, Lock } from 'lucide-react';
import {
  REWARD_BADGES,
  type BadgeDefinition,
  type BadgeIconType,
} from '../data/badges';
import type { SavedProgressState } from '../utils/localProgress';
import { PWAInstallButton } from './PWAInstallButton';

interface BadgesShowcaseProps {
  progress: SavedProgressState;
  onUpdateName: (name: string) => void;
}

export function BadgeMedalArt({
  iconType,
  accent,
  earned,
  size = 52,
}: {
  iconType: BadgeIconType;
  accent: BadgeDefinition['accent'];
  earned: boolean;
  size?: number;
}) {
  const palette = !earned
    ? { bg: '#F1F5F9', ring: '#CBD5E1', fg: '#94A3B8', detail: '#CBD5E1' }
    : accent === 'amber'
    ? { bg: '#FEF3C7', ring: '#D97706', fg: '#B45309', detail: '#F59E0B' }
    : accent === 'emerald'
    ? { bg: '#D1FAE5', ring: '#059669', fg: '#047857', detail: '#10B981' }
    : { bg: '#DBEAFE', ring: '#1D4ED8', fg: '#1E40AF', detail: '#3B82F6' };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="32" cy="32" r="29" fill={palette.bg} stroke={palette.ring} strokeWidth="2.5" />
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke={palette.ring}
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.55"
      />
      {iconType === 'spark' && (
        <path
          d="M32 14L36.5 26.5L49 31L36.5 35.5L32 48L27.5 35.5L15 31L27.5 26.5L32 14Z"
          fill={palette.fg}
        />
      )}
      {iconType === 'tablets' && (
        <g stroke={palette.fg} strokeWidth="2.4" fill="none">
          <path d="M18 44V26C18 21.5 21 19 24.5 19C28 19 31 21.5 31 26V44H18Z" fill={palette.detail} fillOpacity="0.22" />
          <path d="M33 44V26C33 21.5 36 19 39.5 19C43 19 46 21.5 46 26V44H33Z" fill={palette.detail} fillOpacity="0.22" />
          <line x1="21.5" y1="27" x2="27.5" y2="27" />
          <line x1="21.5" y1="33" x2="27.5" y2="33" />
          <line x1="36.5" y1="27" x2="42.5" y2="27" />
          <line x1="36.5" y1="33" x2="42.5" y2="33" />
        </g>
      )}
      {iconType === 'menorah' && (
        <g stroke={palette.fg} strokeWidth="2.5" strokeLinecap="round">
          <line x1="32" y1="18" x2="32" y2="46" />
          <path d="M18 24C18 33 24 36 32 36C40 36 46 33 46 24" fill="none" />
          <path d="M23 24C23 30 27 32 32 32C37 32 41 30 41 24" fill="none" />
          <line x1="25" y1="46" x2="39" y2="46" />
          <circle cx="32" cy="14" r="2.2" fill={palette.detail} stroke="none" />
          <circle cx="18" cy="20" r="1.8" fill={palette.detail} stroke="none" />
          <circle cx="23" cy="20" r="1.8" fill={palette.detail} stroke="none" />
          <circle cx="41" cy="20" r="1.8" fill={palette.detail} stroke="none" />
          <circle cx="46" cy="20" r="1.8" fill={palette.detail} stroke="none" />
        </g>
      )}
      {iconType === 'ark' && (
        <g stroke={palette.fg} strokeWidth="2.4" strokeLinejoin="round">
          <path d="M15 35H49L44 45H20L15 35Z" fill={palette.detail} fillOpacity="0.25" />
          <rect x="21" y="24" width="22" height="11" fill={palette.detail} fillOpacity="0.15" />
          <path d="M19 24L32 17L45 24Z" fill={palette.fg} />
        </g>
      )}
      {iconType === 'tallit' && (
        <g>
          <rect x="17" y="21" width="30" height="22" rx="2" fill={palette.detail} fillOpacity="0.2" stroke={palette.fg} strokeWidth="2.4" />
          <line x1="22" y1="21" x2="22" y2="43" stroke={palette.fg} strokeWidth="2.2" />
          <line x1="42" y1="21" x2="42" y2="43" stroke={palette.fg} strokeWidth="2.2" />
          <line x1="32" y1="21" x2="32" y2="43" stroke={palette.ring} strokeWidth="1.5" strokeDasharray="3 2" />
        </g>
      )}
      {iconType === 'sukkah' && (
        <g stroke={palette.fg} strokeWidth="2.3">
          <circle cx="32" cy="32" r="15" fill="none" strokeDasharray="4 2" />
          <rect x="21.5" y="21.5" width="21" height="21" fill={palette.detail} fillOpacity="0.2" />
          <line x1="21.5" y1="42.5" x2="42.5" y2="21.5" strokeWidth="1.8" />
        </g>
      )}
      {iconType === 'soup' && (
        <g stroke={palette.fg} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 28H46V39C46 43 42 46 37 46H27C22 46 18 43 18 39V28Z" fill={palette.detail} fillOpacity="0.25" />
          <line x1="15" y1="28" x2="49" y2="28" />
          <path d="M26 22C26 19 28 19 28 16" fill="none" />
          <path d="M32 22C32 19 34 19 34 16" fill="none" />
          <path d="M38 22C38 19 40 19 40 16" fill="none" />
        </g>
      )}
      {iconType === 'gematria' && (
        <g>
          <rect x="18" y="18" width="28" height="28" rx="5" fill={palette.detail} fillOpacity="0.2" stroke={palette.fg} strokeWidth="2.4" />
          <text
            x="32"
            y="38"
            textAnchor="middle"
            fontSize="20"
            fontWeight="700"
            fill={palette.fg}
            fontFamily="sans-serif"
          >
            א
          </text>
        </g>
      )}
      {iconType === 'shulchan' && (
        <g stroke={palette.fg} strokeWidth="2.3" strokeLinejoin="round">
          <path d="M16 22H30C31.5 22 32 23 32 24V44C32 43 30.5 42 29 42H16V22Z" fill={palette.detail} fillOpacity="0.22" />
          <path d="M48 22H34C32.5 22 32 23 32 24V44C32 43 33.5 42 35 42H48V22Z" fill={palette.detail} fillOpacity="0.22" />
        </g>
      )}
      {iconType === 'arcade' && (
        <g stroke={palette.fg} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 20H42V29C42 35 37.5 39 32 39C26.5 39 22 35 22 29V20Z" fill={palette.detail} fillOpacity="0.25" />
          <path d="M22 23H17C17 28 19 31 22 31" fill="none" />
          <path d="M42 23H47C47 28 45 31 42 31" fill="none" />
          <line x1="32" y1="39" x2="32" y2="45" />
          <line x1="25" y1="45" x2="39" y2="45" />
        </g>
      )}
      {iconType === 'worksheet' && (
        <g stroke={palette.fg} strokeWidth="2.3" strokeLinejoin="round">
          <path d="M21 17H37L43 23V47H21V17Z" fill={palette.detail} fillOpacity="0.2" />
          <line x1="26" y1="29" x2="38" y2="29" strokeLinecap="round" />
          <line x1="26" y1="35" x2="38" y2="35" strokeLinecap="round" />
          <line x1="26" y1="41" x2="33" y2="41" strokeLinecap="round" />
        </g>
      )}
      {iconType === 'daily' && (
        <g stroke={palette.fg} strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="32" cy="34" r="13" fill={palette.detail} fillOpacity="0.22" />
          <line x1="27" y1="17" x2="37" y2="17" />
          <line x1="32" y1="17" x2="32" y2="21" />
          <polyline points="32 27 32 34 37 37" fill="none" />
        </g>
      )}
      {iconType === 'crown' && (
        <g stroke={palette.fg} strokeWidth="2.4" strokeLinejoin="round">
          <path d="M16 42L19 23L27 31L32 19L37 31L45 23L48 42H16Z" fill={palette.detail} fillOpacity="0.3" />
          <line x1="17" y1="46" x2="47" y2="46" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export function BadgesShowcase({
  progress,
  onUpdateName,
}: BadgesShowcaseProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(progress.studentName);

  const evaluated = REWARD_BADGES.map((badge) => ({
    badge,
    status: badge.evaluate(progress),
  }));
  const earnedCount = evaluated.filter((item) => item.status.earned).length;

  function handleSaveName() {
    onUpdateName(nameDraft.trim().slice(0, 24));
    setEditingName(false);
  }

  return (
    <section
      aria-labelledby="badges-shelf-heading"
      className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6"
    >
      {/* Top Kid Explorer Header & Offline Install / Autosave Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-500">
            <span className="font-semibold text-blue-800">
              My Reward Badges &amp; Trophy Shelf
            </span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
              <Save className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Autosaved on this device</span>
            </span>
            {progress.streakDays > 0 && (
              <>
                <span aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 font-mono tabular-nums">
                  <Flame className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {progress.streakDays}-day streak
                  </span>
                </span>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h2
              id="badges-shelf-heading"
              className="text-2xl lg:text-3xl font-bold text-slate-900"
            >
              {progress.studentName
                ? `${progress.studentName}’s Badge Collection`
                : `Collect All ${REWARD_BADGES.length} Cheshbon Badges`}
            </h2>

            {editingName ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSaveName();
                }}
                className="inline-flex items-center gap-2"
              >
                <input
                  type="text"
                  value={nameDraft}
                  onChange={(e) => setNameDraft(e.target.value)}
                  placeholder="Your first name..."
                  maxLength={24}
                  aria-label="Student name"
                  autoFocus
                  className="px-3 py-1.5 rounded-lg border border-blue-400 text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 w-44"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Save</span>
                </button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setNameDraft(progress.studentName);
                  setEditingName(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-800 px-2.5 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                <span>
                  {progress.studentName ? 'Edit Name' : 'Add Your Name'}
                </span>
              </button>
            )}
          </div>
          <p className="text-sm text-slate-600 max-w-2xl">
            Solve lesson challenges, finish the Total Beginner Tutorial, win Math Games, or print an offline PDF worksheet to unlock collectible medals!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <div className="text-left lg:text-right">
            <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
              {earnedCount} / {REWARD_BADGES.length}
            </p>
            <p className="text-xs text-slate-500">Badges unlocked</p>
          </div>
          <PWAInstallButton />
        </div>
      </div>

      {/* 12 Collectible Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {evaluated.map(({ badge, status }) => {
          const pct = Math.min(
            100,
            Math.round((status.current / status.target) * 100)
          );
          return (
            <div
              key={badge.id}
              className={`rounded-xl border p-4 flex flex-col justify-between gap-3 transition-colors ${
                status.earned
                  ? 'bg-white border-emerald-200 shadow-2xs'
                  : 'bg-slate-50/80 border-slate-200'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <BadgeMedalArt
                  iconType={badge.iconType}
                  accent={badge.accent}
                  earned={status.earned}
                  size={52}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1.5">
                    <h3
                      className={`text-sm font-bold leading-snug ${
                        status.earned ? 'text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      {badge.title}
                    </h3>
                    {!status.earned && (
                      <Lock
                        className="w-3.5 h-3.5 text-slate-400 shrink-0"
                        aria-label="Locked"
                      />
                    )}
                  </div>
                  <p
                    dir="rtl"
                    className={`text-xs font-semibold ${
                      status.earned ? 'text-blue-800' : 'text-slate-400'
                    }`}
                  >
                    {badge.hebrewTitle}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-1">
                    {badge.description}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/70">
                <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
                  <span
                    className={
                      status.earned
                        ? 'font-semibold text-emerald-700'
                        : 'text-slate-500'
                    }
                  >
                    {status.earned ? 'Unlocked!' : 'In progress'}
                  </span>
                  <span className="font-semibold text-slate-700">
                    {status.current}/{status.target}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-200/80 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      status.earned ? 'bg-emerald-600' : 'bg-blue-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
