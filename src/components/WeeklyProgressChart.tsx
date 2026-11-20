import { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { ALL_QUIZ_QUESTIONS, type TrackType } from '../data/lessons';

interface WeeklyProgressChartProps {
  solvedLog: Record<string, string>;
  onStartPractice: () => void;
}

interface WeekBucket {
  weekStartMs: number;
  label: string;
  rangeLabel: string;
  torah: number;
  gemara: number;
  shulchanAruch: number;
  total: number;
  isCurrentWeek: boolean;
}

const QUESTION_TRACK_MAP: Record<string, TrackType> = Object.fromEntries(
  ALL_QUIZ_QUESTIONS.map((q) => [q.id, q.track])
);

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function getSundayStart(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatShortMonthDay(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: WeekBucket }>;
}

function WeeklyTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm px-3.5 py-2.5 text-xs">
      <p className="font-semibold text-slate-900 mb-1">
        {data.isCurrentWeek ? 'This Week' : `Week of ${data.label}`}
      </p>
      <p className="text-slate-500 mb-2">{data.rangeLabel}</p>
      <div className="space-y-1 font-mono tabular-nums">
        <div className="flex items-center justify-between gap-4">
          <span className="text-blue-700">Torah</span>
          <span className="font-semibold text-slate-900">{data.torah}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-emerald-700">Gemara</span>
          <span className="font-semibold text-slate-900">{data.gemara}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-amber-700">Shulchan Aruch</span>
          <span className="font-semibold text-slate-900">{data.shulchanAruch}</span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-100">
          <span className="text-slate-700 font-semibold">Total Solved</span>
          <span className="font-bold text-slate-900">{data.total}</span>
        </div>
      </div>
    </div>
  );
}

export function WeeklyProgressChart({
  solvedLog,
  onStartPractice,
}: WeeklyProgressChartProps) {
  const [weekSpan, setWeekSpan] = useState<4 | 6 | 8>(6);
  const [chartMode, setChartMode] = useState<'total' | 'split'>('split');

  const { buckets, thisWeekCount, bestWeekCount, totalSolved, yMax } =
    useMemo(() => {
      const currentSunday = getSundayStart(new Date());
      const list: WeekBucket[] = [];

      for (let i = weekSpan - 1; i >= 0; i--) {
        const start = new Date(currentSunday.getTime() - i * MS_PER_WEEK);
        const end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
        const isCurrent = i === 0;
        list.push({
          weekStartMs: start.getTime(),
          label: isCurrent ? 'This Week' : formatShortMonthDay(start),
          rangeLabel: `${formatShortMonthDay(start)} – ${formatShortMonthDay(end)}`,
          torah: 0,
          gemara: 0,
          shulchanAruch: 0,
          total: 0,
          isCurrentWeek: isCurrent,
        });
      }

      const earliestMs = list[0].weekStartMs;
      let curriculumCount = 0;

      for (const [entryId, isoString] of Object.entries(solvedLog)) {
        let track: TrackType | undefined = QUESTION_TRACK_MAP[entryId];
        if (track) {
          curriculumCount += 1;
        } else if (entryId.startsWith('game:torah:')) {
          track = 'torah';
        } else if (entryId.startsWith('game:gemara:')) {
          track = 'gemara';
        } else if (entryId.startsWith('game:shulchan-aruch:')) {
          track = 'shulchan-aruch';
        }
        if (!track) continue;

        const parsed = new Date(isoString);
        const solvedSunday = Number.isNaN(parsed.getTime())
          ? currentSunday
          : getSundayStart(parsed);
        const solvedMs = solvedSunday.getTime();

        if (solvedMs < earliestMs) continue;
        const diffWeeks = Math.round((solvedMs - earliestMs) / MS_PER_WEEK);
        if (diffWeeks >= 0 && diffWeeks < list.length) {
          if (track === 'torah') {
            list[diffWeeks].torah += 1;
          } else if (track === 'gemara') {
            list[diffWeeks].gemara += 1;
          } else {
            list[diffWeeks].shulchanAruch += 1;
          }
          list[diffWeeks].total += 1;
        }
      }

      const currentCount = list[list.length - 1]?.total ?? 0;
      const peak = list.reduce((max, b) => Math.max(max, b.total), 0);
      const computedYMax = Math.max(4, peak + 1);

      return {
        buckets: list,
        thisWeekCount: currentCount,
        bestWeekCount: peak,
        totalSolved: curriculumCount,
        yMax: computedYMax,
      };
    }, [solvedLog, weekSpan]);

  return (
    <section
      aria-labelledby="weekly-progress-heading"
      className="bg-white border border-slate-200 rounded-xl p-6 lg:p-8 space-y-6"
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500 mb-1">
            Weekly Study Log · Challenges Solved Per Week (Sun–Sat)
          </p>
          <h2
            id="weekly-progress-heading"
            className="text-2xl font-bold text-slate-900"
          >
            Your Progress Over Time
          </h2>
        </div>

        {/* Interactive Chart Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              type="button"
              onClick={() => setChartMode('split')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                chartMode === 'split'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              By Track
            </button>
            <button
              type="button"
              onClick={() => setChartMode('total')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                chartMode === 'total'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Total
            </button>
          </div>

          <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            {([4, 6, 8] as const).map((span) => (
              <button
                key={span}
                type="button"
                onClick={() => setWeekSpan(span)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  weekSpan === span
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {span} Weeks
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Unboxed Quantitative Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div>
          <p className="text-xs text-slate-500">Solved This Week</p>
          <p className="font-mono text-2xl font-bold text-blue-700 tabular-nums mt-0.5">
            {thisWeekCount}{' '}
            <span className="text-xs font-sans font-normal text-slate-500">
              {thisWeekCount === 1 ? 'challenge' : 'challenges'}
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Best Week ({weekSpan}-Week Window)</p>
          <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums mt-0.5">
            {bestWeekCount}{' '}
            <span className="text-xs font-sans font-normal text-slate-500">
              {bestWeekCount === 1 ? 'challenge' : 'challenges'}
            </span>
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Overall Curriculum Mastery</p>
          <p className="font-mono text-2xl font-bold text-emerald-700 tabular-nums mt-0.5">
            {totalSolved} / {ALL_QUIZ_QUESTIONS.length}{' '}
            <span className="text-xs font-sans font-normal text-slate-500">
              ({Math.round((totalSolved / ALL_QUIZ_QUESTIONS.length) * 100)}%)
            </span>
          </p>
        </div>
      </div>

      {/* Recharts Weekly Bar Chart */}
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={buckets}
            margin={{ top: 12, right: 16, left: -12, bottom: 4 }}
            barCategoryGap="28%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="label"
              axisLine={{ stroke: '#CBD5E1' }}
              tickLine={false}
              tick={{
                fill: '#475569',
                fontSize: 12,
                fontFamily: 'IBM Plex Mono, monospace',
              }}
              dy={6}
            />
            <YAxis
              allowDecimals={false}
              domain={[0, yMax]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#64748B',
                fontSize: 12,
                fontFamily: 'IBM Plex Mono, monospace',
              }}
            />
            <Tooltip
              content={<WeeklyTooltip />}
              cursor={{ fill: '#F1F5F9' }}
            />
            <ReferenceLine
              y={3}
              stroke="#94A3B8"
              strokeDasharray="4 4"
              label={{
                value: 'Weekly Goal (3)',
                position: 'insideTopRight',
                fill: '#64748B',
                fontSize: 11,
                fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}
            />

            {chartMode === 'split' ? (
              <>
                <Bar
                  dataKey="torah"
                  name="Torah"
                  stackId="weekly"
                  fill="#1D4ED8"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="gemara"
                  name="Gemara"
                  stackId="weekly"
                  fill="#047857"
                  radius={[0, 0, 0, 0]}
                  maxBarSize={48}
                />
                <Bar
                  dataKey="shulchanAruch"
                  name="Shulchan Aruch"
                  stackId="weekly"
                  fill="#D97706"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </>
            ) : (
              <Bar
                dataKey="total"
                name="Total Solved"
                fill="#1D4ED8"
                radius={[6, 6, 0, 0]}
                maxBarSize={48}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Legend & Empty-State Nudge */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        {chartMode === 'split' ? (
          <div className="flex flex-wrap items-center gap-5">
            <span className="inline-flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-xs bg-blue-700 inline-block"
                aria-hidden="true"
              />
              <span>Torah Challenges</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-xs bg-emerald-700 inline-block"
                aria-hidden="true"
              />
              <span>Gemara</span>
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-xs bg-amber-600 inline-block"
                aria-hidden="true"
              />
              <span>Shulchan Aruch</span>
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">
              Dashed line marks 1 full lesson (3 challenges) per week
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
            <BarChart3 className="w-3.5 h-3.5 text-blue-700" aria-hidden="true" />
            <span>Showing combined Torah, Gemara, and Shulchan Aruch challenges per week</span>
          </div>
        )}

        {totalSolved === 0 && (
          <button
            type="button"
            onClick={onStartPractice}
            className="text-blue-700 hover:text-blue-800 font-semibold inline-flex items-center gap-1 whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <span>Solve your first challenge to fill This Week</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
    </section>
  );
}
