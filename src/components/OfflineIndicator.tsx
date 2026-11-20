import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-950 shadow-md print:hidden"
    >
      <WifiOff className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
      <span>Offline Mode · All lessons, games &amp; local progress work without Wi-Fi</span>
    </div>
  );
}
