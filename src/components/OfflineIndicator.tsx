import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2.5 text-xs font-bold text-white shadow-2xl border border-amber-400/40 backdrop-blur-md animate-pulse"
      dir="rtl"
    >
      <WifiOff className="w-4 h-4 text-white" />
      <span>أنت تتصفح في وضع عدم الاتصال (Offline) — البيانات الصوتية المحفوظة متاحة.</span>
    </div>
  );
};
