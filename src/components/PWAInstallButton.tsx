import React, { useState } from 'react';
import { Smartphone, Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'navbar' | 'compact' | 'hero' | 'floating';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'navbar',
  className = ''
}) => {
  const { isInstalled } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running as an installed PWA, hide the button or show badge
  if (isInstalled && variant !== 'navbar') {
    return null;
  }

  if (variant === 'hero') {
    return (
      <>
        <button
          id="hero-pwa-install-btn"
          onClick={() => setShowModal(true)}
          className={`px-4 py-2.5 rounded-2xl bg-sky-950/80 hover:bg-sky-900/90 border border-sky-400/40 text-sky-100 hover:text-white text-xs font-extrabold flex items-center gap-2 transition-all hover:scale-[1.02] shadow-md shadow-sky-950/50 cursor-pointer ${className}`}
          title="تثبيت تطبيق YONA SONGS على الهاتف"
        >
          <Smartphone className="w-4 h-4 text-sky-300" />
          <span>{isInstalled ? 'تطبيق الهاتف مثبت' : 'تثبيت كـ تطبيق على هاتفك'}</span>
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <button
          id="compact-pwa-install-btn"
          onClick={() => setShowModal(true)}
          className={`p-2 rounded-xl bg-sky-400/10 hover:bg-sky-400/20 border border-sky-300/30 text-sky-200 transition-all cursor-pointer ${className}`}
          title="تثبيت التطبيق على الهاتف"
        >
          <Download className="w-4 h-4 text-sky-300" />
        </button>

        <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </>
    );
  }

  // Default: navbar
  return (
    <>
      <button
        id="navbar-pwa-install-btn"
        onClick={() => setShowModal(true)}
        className={`px-2.5 py-1.5 rounded-lg bg-sky-400/10 hover:bg-sky-400/20 border border-sky-300/35 text-sky-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${className}`}
        title="تثبيت تطبيق YONA SONGS على هاتفك بنقرة واحدة"
      >
        <Smartphone className="w-3.5 h-3.5 text-sky-300" />
        <span className="hidden sm:inline">
          {isInstalled ? 'التطبيق مثبت' : 'حمّل التطبيق'}
        </span>
        <span className="sm:hidden">تطبيق</span>
      </button>

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
