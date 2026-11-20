import { useState, useRef, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Star,
  ArrowLeft,
  Eye,
  CheckCircle2,
} from 'lucide-react';
import { playTap, playSuccess, playTryAgain, playFanfare } from '../../utils/soundFx';

interface GematriaMemoryGameProps {
  onBack: () => void;
  onCompleteRound: (score: number) => void;
}

type GameState = 'TITLE_MENU' | 'PLAYING' | 'ROUND_SUMMARY';
type Difficulty = 'beginner' | 'explorer';

interface MemoryCard {
  uid: string;
  pairId: string;
  display: string;
  sublabel: string;
  kind: 'hebrew' | 'number';
}

const BEGINNER_PAIRS = [
  { pairId: '1', hebrew: 'א', name: 'Alef', number: '1' },
  { pairId: '2', hebrew: 'ב', name: 'Bet', number: '2' },
  { pairId: '3', hebrew: 'ג', name: 'Gimel', number: '3' },
  { pairId: '5', hebrew: 'ה', name: 'Hei', number: '5' },
  { pairId: '8', hebrew: 'ח', name: 'Chet', number: '8' },
  { pairId: '10', hebrew: 'י', name: 'Yud', number: '10' },
];

const EXPLORER_PAIRS = [
  { pairId: '4', hebrew: 'ד', name: 'Dalet', number: '4' },
  { pairId: '10', hebrew: 'י', name: 'Yud', number: '10' },
  { pairId: '13', hebrew: 'אחד', name: 'Echad', number: '13' },
  { pairId: '18', hebrew: 'חי', name: 'Chai', number: '18' },
  { pairId: '20', hebrew: 'כ', name: 'Kaf', number: '20' },
  { pairId: '30', hebrew: 'ל', name: 'Lamed', number: '30' },
  { pairId: '40', hebrew: 'מ', name: 'Mem', number: '40' },
  { pairId: '100', hebrew: 'ק', name: 'Kuf', number: '100' },
];

function createDeck(difficulty: Difficulty): MemoryCard[] {
  const source = difficulty === 'beginner' ? BEGINNER_PAIRS : EXPLORER_PAIRS;
  const deck: MemoryCard[] = [];
  for (const p of source) {
    deck.push({
      uid: `${p.pairId}-h`,
      pairId: p.pairId,
      display: p.hebrew,
      sublabel: p.name,
      kind: 'hebrew',
    });
    deck.push({
      uid: `${p.pairId}-n`,
      pairId: p.pairId,
      display: p.number,
      sublabel: 'Value',
      kind: 'number',
    });
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function GematriaMemoryGame({
  onBack,
  onCompleteRound,
}: GematriaMemoryGameProps) {
  const [gameState, setGameState] = useState<GameState>('TITLE_MENU');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [cards, setCards] = useState<MemoryCard[]>(() => createDeck('beginner'));
  const [flippedUids, setFlippedUids] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [peeking, setPeeking] = useState(false);

  const flipTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (flipTimerRef.current !== null) window.clearTimeout(flipTimerRef.current);
    };
  }, []);

  const totalPairs = cards.length / 2;

  function startGame(selectedDifficulty = difficulty) {
    if (flipTimerRef.current !== null) window.clearTimeout(flipTimerRef.current);
    playTap();
    setDifficulty(selectedDifficulty);
    setCards(createDeck(selectedDifficulty));
    setFlippedUids([]);
    setMatchedPairIds([]);
    setMoves(0);
    setPeeking(false);
    setGameState('PLAYING');
  }

  function handlePeekAll() {
    if (peeking || flippedUids.length > 0) return;
    playTap();
    setPeeking(true);
    flipTimerRef.current = window.setTimeout(() => {
      setPeeking(false);
    }, 1500);
  }

  function handleCardClick(card: MemoryCard) {
    if (peeking) return;
    if (matchedPairIds.includes(card.pairId)) return;
    if (flippedUids.includes(card.uid)) return;
    if (flippedUids.length >= 2) return;

    playTap();
    const nextFlipped = [...flippedUids, card.uid];
    setFlippedUids(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstUid, secondUid] = nextFlipped;
      const firstCard = cards.find((c) => c.uid === firstUid);
      const secondCard = cards.find((c) => c.uid === secondUid);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        playSuccess();
        const nextMatched = [...matchedPairIds, firstCard.pairId];
        setMatchedPairIds(nextMatched);
        setFlippedUids([]);

        if (nextMatched.length === totalPairs) {
          const finalScore = Math.max(40, 120 - moves * 4);
          flipTimerRef.current = window.setTimeout(() => {
            playFanfare();
            setGameState('ROUND_SUMMARY');
            onCompleteRound(finalScore);
          }, 550);
        }
      } else {
        playTryAgain();
        flipTimerRef.current = window.setTimeout(() => {
          setFlippedUids([]);
        }, 850);
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 whitespace-nowrap shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          <span>All Math Games</span>
        </button>

        {gameState === 'PLAYING' && (
          <div className="flex items-center gap-5 text-xs font-mono font-semibold text-slate-700 tabular-nums">
            <span className="text-emerald-700">
              Matched: {matchedPairIds.length}/{totalPairs}
            </span>
            <span>Moves: {moves}</span>
          </div>
        )}
      </div>

      {/* TITLE MENU */}
      {gameState === 'TITLE_MENU' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 lg:p-10 max-w-2xl mx-auto text-center space-y-6">
          <p className="text-xs font-medium text-slate-500">
            Torah Math Game · Hebrew Alef-Bet Gematria · Memory &amp; Numbers
          </p>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-slate-900">
              Gematria Memory Match
            </h2>
            <p className="text-sm lg:text-base text-slate-600 leading-relaxed">
              Flip two cards at a time to pair each Hebrew letter (or Torah word) with its matching Gematria number! Need help? Tap <strong>Quick Peek</strong> anytime.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-700">
              Choose Board Size
            </p>
            <div className="inline-flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                onClick={() => setDifficulty('beginner')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  difficulty === 'beginner'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Beginner (12 Cards · 1–10)
              </button>
              <button
                type="button"
                onClick={() => setDifficulty('explorer')}
                className={`px-4 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  difficulty === 'explorer'
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Explorer (16 Cards · 4–100)
              </button>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => startGame(difficulty)}
              className="px-7 py-3 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4" aria-hidden="true" />
              <span>Start Game</span>
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE PLAY */}
      {gameState === 'PLAYING' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-700">
              Match each Hebrew letter card with its Gematria number card!
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePeekAll}
                disabled={peeking}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100 disabled:opacity-50 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Quick Peek</span>
              </button>
              <button
                type="button"
                onClick={() => startGame(difficulty)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Shuffle</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            {cards.map((card) => {
              const isMatched = matchedPairIds.includes(card.pairId);
              const isRevealed =
                peeking || isMatched || flippedUids.includes(card.uid);

              return (
                <button
                  key={card.uid}
                  type="button"
                  onClick={() => handleCardClick(card)}
                  aria-label={
                    isRevealed
                      ? `${card.display} (${card.sublabel})`
                      : 'Hidden memory card'
                  }
                  className={`h-24 sm:h-28 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                    isMatched
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-950'
                      : isRevealed
                      ? card.kind === 'hebrew'
                        ? 'border-blue-600 bg-blue-50 text-blue-950'
                        : 'border-amber-500 bg-amber-50 text-amber-950'
                      : 'border-slate-200 bg-slate-800 hover:bg-slate-700 text-slate-300'
                  }`}
                >
                  {isRevealed ? (
                    <>
                      <span
                        dir={card.kind === 'hebrew' ? 'rtl' : 'ltr'}
                        className={`font-bold leading-none ${
                          card.kind === 'hebrew'
                            ? 'text-3xl'
                            : 'font-mono text-2xl tabular-nums'
                        }`}
                      >
                        {card.display}
                      </span>
                      <span className="text-[11px] font-medium opacity-75 mt-1.5 flex items-center gap-1">
                        {isMatched && (
                          <CheckCircle2
                            className="w-3 h-3 text-emerald-700"
                            aria-hidden="true"
                          />
                        )}
                        {card.sublabel}
                      </span>
                    </>
                  ) : (
                    <span className="font-display text-xl font-bold text-slate-400">
                      ?
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ROUND SUMMARY */}
      {gameState === 'ROUND_SUMMARY' && (
        <div className="bg-white border border-slate-200 rounded-xl p-8 max-w-xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
            <Star className="w-8 h-8 text-amber-500 fill-amber-500" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-emerald-700">
              All {totalPairs} Pairs Matched!
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Sharp Memory!
            </h2>
            <p className="text-sm text-slate-600">
              You matched every Hebrew letter with its Gematria number in{' '}
              <strong className="font-mono text-slate-900">{moves}</strong> moves!
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => startGame(difficulty)}
              className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 inline-flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Play Again</span>
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Back to Games
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
