import { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Star,
  Menu,
  X,
  FileText,
  Download,
} from 'lucide-react';
import {
  ASSET_IMAGES,
  ALL_QUIZ_QUESTIONS,
  LESSONS,
  formatTrackLabel,
  getLessonById,
  type LessonId,
  type TrackType,
} from './data/lessons';
import { REWARD_BADGES, type BadgeDefinition } from './data/badges';
import {
  DEFAULT_PROGRESS,
  loadLocalProgress,
  saveLocalProgress,
  clearLocalProgress,
  computeNextStreak,
  type AppView,
  type SavedProgressState,
} from './utils/localProgress';
import { playFanfare } from './utils/soundFx';
import { ResilientImage } from './components/ResilientImage';
import { LessonPreviewArt } from './components/LessonPreviewArt';
import { LessonChallengePanel } from './components/LessonChallengePanel';
import { PracticeArena } from './components/PracticeArena';
import { DailyWisdomBanner } from './components/DailyWisdomBanner';
import { WeeklyProgressChart } from './components/WeeklyProgressChart';
import { BeginnerTutorial } from './components/BeginnerTutorial';
import { WorksheetModal } from './components/WorksheetModal';
import { BadgesShowcase } from './components/BadgesShowcase';
import { BadgeUnlockToast } from './components/BadgeUnlockToast';
import { OfflineIndicator } from './components/OfflineIndicator';
import { PWAInstallButton } from './components/PWAInstallButton';
import { downloadLessonWorksheetPdf } from './utils/worksheetPdf';
import { MathGamesHub, type GameId } from './components/MathGamesHub';
import { ChanukahCandlesSandbox } from './components/sandboxes/ChanukahCandlesSandbox';
import { NoahsArkSandbox } from './components/sandboxes/NoahsArkSandbox';
import { TallitFractionsSandbox } from './components/sandboxes/TallitFractionsSandbox';
import { SukkahGeometrySandbox } from './components/sandboxes/SukkahGeometrySandbox';
import { BatelBShishimSandbox } from './components/sandboxes/BatelBShishimSandbox';
import { GematriaWorkshopSandbox } from './components/sandboxes/GematriaWorkshopSandbox';
import { ShaotZmaniyotSandbox } from './components/sandboxes/ShaotZmaniyotSandbox';
import { MaaserPercentSandbox } from './components/sandboxes/MaaserPercentSandbox';
import { MezuzahThirdsSandbox } from './components/sandboxes/MezuzahThirdsSandbox';

export default function App() {
  const [progress, setProgress] = useState<SavedProgressState>(() =>
    loadLocalProgress()
  );
  const [view, setView] = useState<AppView>(() => progress.lastView);
  const [activeLessonId, setActiveLessonId] = useState<LessonId>(() =>
    LESSONS.some((l) => l.id === progress.lastLessonId)
      ? progress.lastLessonId
      : 'chanukah-candles'
  );
  const [initialGameId, setInitialGameId] = useState<GameId | null>(null);
  const [trackFilter, setTrackFilter] = useState<'all' | TrackType>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [worksheetLessonId, setWorksheetLessonId] = useState<LessonId | null>(null);
  const [toastBadge, setToastBadge] = useState<BadgeDefinition | null>(null);

  const { solvedLog, beginnerDone, beginnerStep, gameStats, studentName } = progress;

  const solvedIds = Object.keys(solvedLog).filter(
    (k) => !k.startsWith('game:')
  );

  // Autosave all progress locally on every change
  useEffect(() => {
    saveLocalProgress(progress);
  }, [progress]);

  // Evaluate 12 reward badges and trigger celebratory unlock toast for newly earned badges
  useEffect(() => {
    const newlyUnlocked: BadgeDefinition[] = [];
    for (const badge of REWARD_BADGES) {
      if (!progress.unlockedBadges[badge.id] && badge.evaluate(progress).earned) {
        newlyUnlocked.push(badge);
      }
    }
    if (newlyUnlocked.length > 0) {
      const now = new Date().toISOString();
      setProgress((prev) => {
        const nextUnlocked = { ...prev.unlockedBadges };
        for (const b of newlyUnlocked) {
          nextUnlocked[b.id] = now;
        }
        return { ...prev, unlockedBadges: nextUnlocked };
      });
      setToastBadge(newlyUnlocked[0]);
      playFanfare();
    }
  }, [progress]);

  const activeLesson = getLessonById(activeLessonId);
  const currentLessonIndex = LESSONS.findIndex((l) => l.id === activeLessonId);
  const nextLesson =
    currentLessonIndex >= 0 && currentLessonIndex < LESSONS.length - 1
      ? LESSONS[currentLessonIndex + 1]
      : null;

  // Next uncompleted lesson for primary CTA
  const recommendedLesson =
    LESSONS.find(
      (l) => !l.challenges.every((c) => solvedIds.includes(c.id))
    ) ?? LESSONS[0];

  const filteredLessons =
    trackFilter === 'all'
      ? LESSONS
      : LESSONS.filter((l) => l.track === trackFilter);

  const completedLessonsCount = LESSONS.filter((l) =>
    l.challenges.every((c) => solvedIds.includes(c.id))
  ).length;

  const totalGameWins = Object.values(gameStats).reduce(
    (acc, g) => acc + g.wins,
    0
  );

  const earnedBadgesCount = REWARD_BADGES.filter(
    (b) => b.evaluate(progress).earned
  ).length;

  function handleSolveQuestion(questionId: string) {
    setProgress((prev) => {
      if (prev.solvedLog[questionId]) return prev;
      const streak = computeNextStreak(prev.streakDays, prev.lastStudyDate);
      return {
        ...prev,
        solvedLog: {
          ...prev.solvedLog,
          [questionId]: new Date().toISOString(),
        },
        ...streak,
      };
    });
  }

  function handleRecordGameWin(
    gameId: GameId,
    track: TrackType,
    score: number
  ) {
    setProgress((prev) => {
      const existing = prev.gameStats[gameId] ?? { wins: 0, bestScore: 0 };
      const streak = computeNextStreak(prev.streakDays, prev.lastStudyDate);
      const entryKey = `game:${track}:${gameId}:${Date.now()}`;
      return {
        ...prev,
        gameStats: {
          ...prev.gameStats,
          [gameId]: {
            wins: existing.wins + 1,
            bestScore: Math.max(existing.bestScore, score),
          },
        },
        solvedLog: {
          ...prev.solvedLog,
          [entryKey]: new Date().toISOString(),
        },
        ...streak,
      };
    });
  }

  function handleBeginnerStepChange(step: number) {
    setProgress((prev) =>
      prev.beginnerStep === step ? prev : { ...prev, beginnerStep: step }
    );
  }

  function handleBeginnerComplete() {
    setProgress((prev) => {
      const streak = computeNextStreak(prev.streakDays, prev.lastStudyDate);
      return { ...prev, beginnerDone: true, beginnerStep: 5, ...streak };
    });
  }

  function handleWorksheetDownloaded() {
    setProgress((prev) => ({
      ...prev,
      worksheetsDownloaded: prev.worksheetsDownloaded + 1,
    }));
  }

  function handleUpdateStudentName(name: string) {
    setProgress((prev) => ({ ...prev, studentName: name }));
  }

  const dismissToast = useCallback(() => setToastBadge(null), []);

  function openLesson(id: LessonId) {
    setActiveLessonId(id);
    setView('lesson');
    setProgress((prev) => ({ ...prev, lastView: 'lesson', lastLessonId: id }));
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openBeginnerGuide() {
    setView('beginner');
    setProgress((prev) => ({ ...prev, lastView: 'beginner' }));
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openGames(gameId: GameId | null = null) {
    setInitialGameId(gameId);
    setView('games');
    setProgress((prev) => ({ ...prev, lastView: 'games' }));
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function openExploreWithFilter(filter: 'all' | TrackType, scrollToGrid = false) {
    setTrackFilter(filter);
    setView('explore');
    setProgress((prev) => ({ ...prev, lastView: 'explore' }));
    setMobileMenuOpen(false);
    if (scrollToGrid) {
      window.setTimeout(() => {
        document.getElementById('curriculum')?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function openPractice() {
    setView('practice');
    setProgress((prev) => ({ ...prev, lastView: 'practice' }));
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderSandbox(lessonId: LessonId) {
    const lesson = getLessonById(lessonId);
    switch (lessonId) {
      case 'chanukah-candles':
        return <ChanukahCandlesSandbox lesson={lesson} />;
      case 'noahs-ark':
        return <NoahsArkSandbox lesson={lesson} />;
      case 'tallit-fractions':
        return <TallitFractionsSandbox lesson={lesson} />;
      case 'sukkah-geometry':
        return <SukkahGeometrySandbox lesson={lesson} />;
      case 'batel-bshishim':
        return <BatelBShishimSandbox lesson={lesson} />;
      case 'gematria-workshop':
        return <GematriaWorkshopSandbox lesson={lesson} />;
      case 'shaot-zmaniyot':
        return <ShaotZmaniyotSandbox lesson={lesson} />;
      case 'maaser-percent':
        return <MaaserPercentSandbox lesson={lesson} />;
      case 'mezuzah-thirds':
        return <MezuzahThirdsSandbox lesson={lesson} />;
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Strict 3-Zone Top Bar */}
      <header
        className={`sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 ${
          worksheetLessonId ? 'print:hidden' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            type="button"
            onClick={() => openExploreWithFilter('all', false)}
            className="font-display text-xl font-bold tracking-tight text-slate-900 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Cheshbon
          </button>

          {/* Zone 2: 5 concise single-line text nav links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            <button
              type="button"
              onClick={() => openExploreWithFilter('all', false)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'explore'
                  ? 'border-blue-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Explore
            </button>
            <button
              type="button"
              onClick={openBeginnerGuide}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'beginner'
                  ? 'border-blue-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Beginner Guide
            </button>
            <button
              type="button"
              onClick={() => openGames(null)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'games'
                  ? 'border-blue-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Math Games
            </button>
            <button
              type="button"
              onClick={() => openExploreWithFilter('all', true)}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'lesson'
                  ? 'border-blue-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Lessons
            </button>
            <button
              type="button"
              onClick={openPractice}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                view === 'practice'
                  ? 'border-blue-700 text-slate-900'
                  : 'border-transparent hover:text-slate-900'
              }`}
            >
              Practice Quiz
            </button>
          </nav>

          {/* Zone 3: 1 primary CTA button (+ mobile menu icon on small screens) */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() =>
                beginnerDone
                  ? openLesson(recommendedLesson.id)
                  : openBeginnerGuide()
              }
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {beginnerDone ? 'Start Lesson' : 'Start Tutorial'}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 px-6 py-4 flex flex-col gap-3 text-sm font-medium text-slate-700">
            <button
              type="button"
              onClick={() => openExploreWithFilter('all', false)}
              className="text-left py-1.5 hover:text-blue-700 cursor-pointer"
            >
              Explore
            </button>
            <button
              type="button"
              onClick={openBeginnerGuide}
              className="text-left py-1.5 hover:text-blue-700 cursor-pointer"
            >
              Beginner Guide
            </button>
            <button
              type="button"
              onClick={() => openGames(null)}
              className="text-left py-1.5 hover:text-blue-700 cursor-pointer"
            >
              Math Games
            </button>
            <button
              type="button"
              onClick={() => openExploreWithFilter('all', true)}
              className="text-left py-1.5 hover:text-blue-700 cursor-pointer"
            >
              Lessons
            </button>
            <button
              type="button"
              onClick={openPractice}
              className="text-left py-1.5 hover:text-blue-700 cursor-pointer"
            >
              Practice Quiz
            </button>
          </div>
        )}
      </header>

      {/* Main Content Container */}
      <main
        className={`flex-1 max-w-7xl w-full mx-auto px-6 lg:px-8 py-8 lg:py-12 ${
          worksheetLessonId ? 'print:hidden' : ''
        }`}
      >
        {view === 'explore' && (
          <div className="space-y-12">
            {/* Daily Torah Math Wisdom Banner powered by Gemini */}
            <DailyWisdomBanner />

            {/* Hero Section (Balanced 2-Column Split, 1 Dominant Visual Anchor) */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center">
                <p className="text-xs font-medium text-slate-500 mb-3">
                  {studentName ? `Shalom, ${studentName}! · ` : ''}
                  Torah, Gemara &amp; Shulchan Aruch Math Studio · Offline Ready · Autosaved Locally
                </p>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-[1.12] tracking-tight mb-5">
                  Hands-On Math Through Torah, Gemara &amp; Shulchan Aruch
                </h1>
                <p className="text-base lg:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
                  Start from counting 1 to 10 on the Two Tablets, measure Noah’s Ark in 3D, split a disputed Tallit in Bava Metzia, and explore Shulchan Aruch daylight hours, 10% Maaser, and Mezuzah thirds.
                </p>

                <div className="flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    onClick={() =>
                      beginnerDone
                        ? openLesson(recommendedLesson.id)
                        : openBeginnerGuide()
                    }
                    className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>
                      {beginnerDone
                        ? solvedIds.length > 0
                          ? `Continue: ${recommendedLesson.title}`
                          : 'Start Lesson 1: Chanukah Candles'
                        : 'Start Total Beginner Guide'}
                    </span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => openGames(null)}
                    className="text-sm font-semibold text-slate-700 hover:text-blue-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Play 6 Math Games →
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-slate-200 bg-white min-h-[260px]">
                <ResilientImage
                  src={ASSET_IMAGES.hero}
                  alt="Sunlit study table with a brass menorah, wooden Noah's Ark model, counting cubes, compass, and open geometry notebook"
                  fallbackTitle="Cheshbon Math Studio"
                  className="w-full h-full object-cover"
                />
              </div>
            </section>

            {/* Full-Width 4-Column Summary Strip Below Hero Split */}
            <section
              aria-label="Curriculum Overview"
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-y border-slate-200"
            >
              <div>
                <p className="font-mono text-2xl font-bold text-slate-900 tabular-nums">
                  {solvedIds.length} / {ALL_QUIZ_QUESTIONS.length}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Math challenges solved so far
                </p>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() =>
                    document
                      .getElementById('badges-shelf-heading')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="text-left group cursor-pointer"
                >
                  <p className="font-mono text-2xl font-bold text-amber-700 group-hover:text-amber-800 tabular-nums">
                    {earnedBadgesCount} / {REWARD_BADGES.length} Badges
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Collectible medals unlocked →
                  </p>
                </button>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-blue-700 tabular-nums">
                  6 Math Games
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {totalGameWins > 0
                    ? `${totalGameWins} ${totalGameWins === 1 ? 'round' : 'rounds'} won so far`
                    : 'Beginner & Explorer modes (Ages 4–12)'}
                </p>
              </div>
              <div>
                <p className="font-mono text-2xl font-bold text-emerald-700 tabular-nums">
                  {completedLessonsCount} / {LESSONS.length}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Full lessons mastered (5 stars each)
                </p>
              </div>
            </section>

            {/* Kids & Beginners Quick-Start + Math Games Arcade Entry */}
            <section
              aria-label="Beginner Tutorial and Math Games"
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
            >
              <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                <div className="aspect-[16/9] w-full overflow-hidden border-b border-slate-200">
                  <ResilientImage
                    src={ASSET_IMAGES.beginnerGuide}
                    alt="Sunlit classroom math table with colorful wooden blocks, sliced Shabbat challah, and 7-by-7 pegboard"
                    fallbackTitle="Kids & Beginners Interactive Guide"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Start From Zero · Ages 4–10 · {beginnerDone ? 'Completed' : '5 Interactive Steps'}
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      Total Beginner Interactive Tutorial
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Never learned math before? Count 1 to 10 on the Two Tablets, take away Seder Matzah, add blocks for the 12 Tribes, share Shabbat challah, and count Omer weeks at your own pace.
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={openBeginnerGuide}
                      className="text-sm font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>
                        {beginnerDone ? 'Replay Beginner Tutorial' : 'Start Total Beginner Tutorial'}
                      </span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>

              <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                <div className="aspect-[16/9] w-full overflow-hidden border-b border-slate-200">
                  <ResilientImage
                    src={ASSET_IMAGES.mathGames}
                    alt="Wooden play table with Gematria memory cards, Noah's Ark animal pairs, golden Manna baskets, and brass balance scale"
                    fallbackTitle="Torah, Gemara & Shulchan Aruch Math Games"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Math Games Arcade · 6 Replayable Games · Beginner &amp; Explorer Levels
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                      Play Manna, Ark Pairs, Memory, Scales, Pushka &amp; Shabbat Clock
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Practice adding to 10 with golden Manna, counting Noah’s Ark pairs, matching Gematria tiles, balancing Beit Din coins, dropping 10% Tzedakah coins, and setting the 18-minute Shabbat clock.
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => openGames(null)}
                      className="text-sm font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Open Math Games Arcade</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            </section>

            {/* Interactive Curriculum Section */}
            <section id="curriculum" className="space-y-6 scroll-mt-24">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">
                    Interactive Math Curriculum · 3 Sacred Tracks
                  </p>
                  <h2 className="text-2xl lg:text-3xl font-bold text-slate-900">
                    Choose a Story to Explore
                  </h2>
                </div>

                {/* Functional Segmented Filter Control */}
                <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start">
                  {(
                    [
                      { key: 'all', label: `All Lessons (${LESSONS.length})` },
                      {
                        key: 'torah',
                        label: `Torah (${LESSONS.filter((l) => l.track === 'torah').length})`,
                      },
                      {
                        key: 'gemara',
                        label: `Gemara (${LESSONS.filter((l) => l.track === 'gemara').length})`,
                      },
                      {
                        key: 'shulchan-aruch',
                        label: `Shulchan Aruch (${LESSONS.filter((l) => l.track === 'shulchan-aruch').length})`,
                      },
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => setTrackFilter(tab.key)}
                      className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                        trackFilter === tab.key
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLessons.map((lesson) => {
                  const solvedInLesson = lesson.challenges.filter((c) =>
                    solvedIds.includes(c.id)
                  ).length;
                  const isComplete = solvedInLesson === lesson.challenges.length;

                  return (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => openLesson(lesson.id)}
                      className="group text-left bg-white border border-slate-200 rounded-xl p-6 hover:border-blue-600 transition-all flex flex-col justify-between gap-5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                    >
                      <div className="space-y-4">
                        {/* Unboxed clean metadata line (Zero-Pill Discipline) */}
                        <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                          <span className="truncate">
                            0{lesson.order} · {formatTrackLabel(lesson.track)} · {lesson.sourceRef}
                          </span>
                          <span className="font-mono shrink-0 tabular-nums text-slate-400">
                            {lesson.ageRange}
                          </span>
                        </div>

                        {/* Interactive Diagram Preview */}
                        <LessonPreviewArt lessonId={lesson.id} />

                        <div>
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                              {lesson.title}
                            </h3>
                            <span
                              dir="rtl"
                              className="text-sm font-semibold text-slate-500 shrink-0"
                            >
                              {lesson.hebrewTitle}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-blue-800 mb-2">
                            {lesson.mathTopic}
                          </p>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {lesson.summary}
                          </p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 space-y-2.5">
                        <p className="font-mono text-xs text-slate-500 truncate tabular-nums">
                          {lesson.formulaPreview}
                        </p>
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="flex items-center gap-1.5 font-mono tabular-nums text-slate-600">
                            {isComplete ? (
                              <>
                                <CheckCircle2
                                  className="w-4 h-4 text-emerald-700"
                                  aria-hidden="true"
                                />
                                <span className="text-emerald-700">
                                  Mastered ({lesson.challenges.length}/{lesson.challenges.length})
                                </span>
                              </>
                            ) : (
                              <>
                                <Star
                                  className="w-3.5 h-3.5 text-amber-500"
                                  aria-hidden="true"
                                />
                                <span>
                                  {solvedInLesson}/{lesson.challenges.length} solved
                                </span>
                              </>
                            )}
                          </span>
                          <span className="text-blue-700 group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                            Open Sandbox
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Three-Column Track Spotlights (Torah, Gemara & Shulchan Aruch) */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
              <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-200">
                  <ResilientImage
                    src={ASSET_IMAGES.torahTrack}
                    alt="Illustrated cutaway blueprint of Noah's Ark beside a glowing brass Chanukah menorah and wooden counting blocks"
                    fallbackTitle="Torah Foundations Track"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Track 1 · Addition, Place Value &amp; 3D Volume
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Torah Blueprints &amp; Number Patterns
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Count all 44 Chanukah candles with pairing shortcuts, compute the 450,000-cubic-amah volume of Noah’s Ark, and build sums with Hebrew Gematria tiles.
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => openLesson('noahs-ark')}
                      className="text-sm font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore Noah’s Ark Volume</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>

              <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-200">
                  <ResilientImage
                    src={ASSET_IMAGES.gemaraTrack}
                    alt="Folded blue-striped tallit with silver zuz coins, brass compass drawing a circle around a wooden sukkah, and a copper pot"
                    fallbackTitle="Gemara Logic & Fractions Track"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Track 2 · Fractions, Circles &amp; Proportions
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Gemara Puzzles &amp; Everyday Geometry
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Split a disputed Tallit into exact quarters in Bava Metzia, unroll circles in Eruvin to test π, and balance 1-to-60 soup proportions in Chullin.
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => openLesson('tallit-fractions')}
                      className="text-sm font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Solve Two Holding a Tallit</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>

              <article className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
                <div className="aspect-[4/3] w-full overflow-hidden border-b border-slate-200">
                  <ResilientImage
                    src={ASSET_IMAGES.shulchanAruchTrack}
                    alt="Sunlit study table with a blue-and-brass tzedakah box, silver coins, Shabbat candlesticks, an analog clock, a silver mezuzah case, and a wooden ruler"
                    fallbackTitle="Shulchan Aruch Daily Math Track"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">
                      Track 3 · Time, Percentages &amp; Measurement
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Shulchan Aruch &amp; Daily Mitzvah Math
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Divide sunlight into 12 Halachic Hours (Orach Chaim), compute 10% Maaser and 20% Chomesh (Yoreh Deah), and measure the kosher top third for a Mezuzah!
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => openLesson('shaot-zmaniyot')}
                      className="text-sm font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Explore Shulchan Aruch Math</span>
                      <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </article>
            </section>

            {/* Reward Badges Trophy Shelf, Kid Name & Offline App Install */}
            <BadgesShowcase
              progress={progress}
              onUpdateName={handleUpdateStudentName}
            />

            {/* Weekly Progress Bar Chart (Recharts) at Bottom of Explore Screen */}
            <WeeklyProgressChart
              solvedLog={solvedLog}
              onStartPractice={openPractice}
            />
          </div>
        )}

        {view === 'lesson' && (
          <div className="space-y-8">
            {/* Top Lesson Breadcrumb & Quick Switcher */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
              <button
                type="button"
                onClick={() => openExploreWithFilter('all', false)}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors self-start whitespace-nowrap shrink-0 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>All Lessons</span>
              </button>

              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg overflow-x-auto max-w-full">
                {LESSONS.map((l) => {
                  const isActive = l.id === activeLesson.id;
                  const done = l.challenges.every((c) => solvedIds.includes(c.id));
                  return (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => openLesson(l.id)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer ${
                        isActive
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <span className="font-mono text-[11px] text-slate-400">
                        0{l.order}
                      </span>
                      <span>{l.title.split(' ').slice(0, 2).join(' ')}</span>
                      {done && (
                        <CheckCircle2
                          className="w-3.5 h-3.5 text-emerald-700"
                          aria-label="Mastered"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lesson Title, Story Hook & Printable PDF Worksheet Trigger */}
            <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div className="max-w-3xl space-y-3">
                <p className="text-xs font-medium text-slate-500">
                  Lesson 0{activeLesson.order} ·{' '}
                  {formatTrackLabel(activeLesson.track)} ·{' '}
                  {activeLesson.sourceRef} · {activeLesson.mathTopic} ·{' '}
                  {activeLesson.ageRange}
                </p>
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 leading-tight">
                    {activeLesson.title}
                  </h1>
                  <span
                    dir="rtl"
                    className="text-xl lg:text-2xl font-semibold text-blue-800"
                  >
                    {activeLesson.hebrewTitle}
                  </span>
                </div>
                <p className="text-base text-slate-600 leading-relaxed">
                  {activeLesson.storyHook}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => setWorksheetLessonId(activeLesson.id)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-700" aria-hidden="true" />
                  <span>Printable PDF Worksheet</span>
                </button>
              </div>
            </header>

            {/* Two-Zone Interactive Sandbox */}
            {renderSandbox(activeLesson.id)}

            {/* Embedded 3-Question Lesson Challenge */}
            <LessonChallengePanel
              key={activeLesson.id}
              lessonTitle={activeLesson.title}
              challenges={activeLesson.challenges}
              solvedIds={solvedIds}
              onSolveQuestion={handleSolveQuestion}
              onNextLesson={
                nextLesson ? () => openLesson(nextLesson.id) : openPractice
              }
              nextLessonTitle={
                nextLesson ? nextLesson.title : 'Practice Quiz Arena'
              }
            />

            {/* Offline Practice PDF Worksheet Strip */}
            <section
              aria-label="Offline Printable Worksheet"
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="space-y-1 max-w-2xl">
                <p className="text-xs font-medium text-slate-500">
                  Offline Study Sheet · US Letter PDF · Includes Optional Answer Key
                </p>
                <h2 className="text-lg font-bold text-slate-900">
                  Take “{activeLesson.title}” Offline
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Print or download a clean PDF worksheet with this lesson’s main math concept, key formula, a step-by-step worked example, and 5 paper-and-pencil practice problems with workspace boxes.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setWorksheetLessonId(activeLesson.id)}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-700" aria-hidden="true" />
                  <span>Preview &amp; Customize</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    downloadLessonWorksheetPdf(activeLesson, {
                      includeAnswerKey: true,
                      includeHints: true,
                      studentName,
                    });
                    handleWorksheetDownloaded();
                  }}
                  className="px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>Download PDF</span>
                </button>
              </div>
            </section>
          </div>
        )}

        {view === 'beginner' && (
          <BeginnerTutorial
            completed={beginnerDone}
            initialStep={beginnerStep}
            onStepChange={handleBeginnerStepChange}
            onComplete={handleBeginnerComplete}
            onOpenGames={() => openGames(null)}
            onOpenLesson={openLesson}
          />
        )}

        {view === 'games' && (
          <MathGamesHub
            gameStats={gameStats}
            onRecordGameWin={handleRecordGameWin}
            initialGameId={initialGameId}
          />
        )}

        {view === 'practice' && (
          <PracticeArena
            solvedIds={solvedIds}
            onSolveQuestion={handleSolveQuestion}
            onOpenLesson={openLesson}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer
        className={`border-t border-slate-200 bg-white mt-12 ${
          worksheetLessonId ? 'print:hidden' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            Cheshbon — Offline-Ready Torah, Gemara &amp; Shulchan Aruch Math Studio for Kids · Progress autosaved locally
          </p>
          <div className="flex flex-wrap items-center gap-5">
            <PWAInstallButton />
            <button
              type="button"
              onClick={openBeginnerGuide}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Beginner Guide
            </button>
            <button
              type="button"
              onClick={() => openGames(null)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Math Games
            </button>
            <button
              type="button"
              onClick={() => openExploreWithFilter('all', false)}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Curriculum
            </button>
            <button
              type="button"
              onClick={openPractice}
              className="hover:text-slate-900 transition-colors cursor-pointer"
            >
              Practice Quiz
            </button>
            {(Object.keys(solvedLog).length > 0 ||
              beginnerDone ||
              totalGameWins > 0 ||
              progress.worksheetsDownloaded > 0 ||
              Boolean(studentName)) && (
              <button
                type="button"
                onClick={() => {
                  clearLocalProgress();
                  setProgress({ ...DEFAULT_PROGRESS });
                  setView('explore');
                }}
                className="text-rose-700 hover:text-rose-800 transition-colors cursor-pointer"
              >
                Reset Progress
              </button>
            )}
          </div>
        </div>
      </footer>

      {worksheetLessonId && (
        <WorksheetModal
          lesson={getLessonById(worksheetLessonId)}
          studentName={studentName}
          onPdfDownloaded={handleWorksheetDownloaded}
          onClose={() => setWorksheetLessonId(null)}
        />
      )}

      <OfflineIndicator />
      <BadgeUnlockToast badge={toastBadge} onDismiss={dismissToast} />
    </div>
  );
}
