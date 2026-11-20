import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { BadgeDefinition } from '../data/badges';
import { BadgeMedalArt } from './BadgesShowcase';

interface BadgeUnlockToastProps {
  badge: BadgeDefinition | null;
  onDismiss: () => void;
}

export function BadgeUnlockToast({ badge, onDismiss }: BadgeUnlockToastProps) {
  useEffect(() => {
    if (!badge) return;
    const timer = window.setTimeout(onDismiss, 5500);
    return () => window.clearTimeout(timer);
  }, [badge, onDismiss]);

  if (!badge) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm w-[calc(100vw-2.5rem)] bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-xl flex items-center gap-3.5 print:hidden"
    >
      <BadgeMedalArt
        iconType={badge.iconType}
        accent={badge.accent}
        earned
        size={56}
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
          New Badge Unlocked!
        </p>
        <p className="text-base font-bold text-slate-900 leading-tight">
          {badge.title}
        </p>
        <p className="text-xs text-slate-600 mt-0.5 leading-snug">
          <span dir="rtl" className="font-semibold text-blue-800 mr-1.5">
            {badge.hebrewTitle}
          </span>
          · {badge.description}
        </p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss badge notification"
        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 self-start cursor-pointer"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
