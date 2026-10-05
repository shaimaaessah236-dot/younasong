import React, { useState, useEffect } from 'react';
import { Youtube, CheckCircle2, Lock, Sparkles, ExternalLink, ShieldCheck, Heart, AlertCircle, RefreshCw } from 'lucide-react';

interface YouTubeSubscriptionGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

const STORAGE_KEY = 'yona_youtube_subscribed';
const YOUTUBE_CHANNEL_URL = 'https://youtube.com/@yona_songs?sub_confirmation=1';

export const isUserSubscribedToYouTube = (): boolean => {
  return true;
};

export const setUserSubscribedToYouTube = (_val: boolean = true) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, 'true');
};

export const YouTubeSubscriptionGateModal: React.FC<YouTubeSubscriptionGateProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'قناة Yona Songs الرسمية ',
  description = 'استمتع بمشاهدة الأفلام والأنمي وقنوات تيليجرام المعتمدة بدون قيود. لدعم استمرار المنصة ومتابعة أحدث الشارات الحصرية، يمكنك زيارة قناتنا على اليوتيوب:'
}) => {
  if (!isOpen) return null;

  const handleSubscribeClick = () => {
    window.open(YOUTUBE_CHANNEL_URL, '_blank', 'noopener,noreferrer');
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#121624] via-[#0d121e] to-[#080b12] border border-red-500/40 shadow-2xl text-right space-y-6">
        
        {/* Glow halo */}
        <div className="absolute -top-16 -left-16 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Title */}
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 flex-shrink-0 shadow-lg shadow-red-600/20">
            <Youtube className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-black">
              <CheckCircle2 className="w-3 h-3" />
              <span>المشاهدة والتحميل متاحان مجاناً</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black font-tajawal text-white mt-1">
              {title}
            </h3>
          </div>
        </div>

        {/* Explanation Message */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-200 text-xs sm:text-sm leading-relaxed space-y-2">
          <p className="text-gray-300">
            {description}
          </p>
        </div>

        {/* Channel Details Card */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-sm flex-shrink-0 shadow-md">
              <Youtube className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate">قناة Yona Songs الرسمية</h4>
              <p className="text-xs text-gray-400 font-mono">@yona_songs</p>
            </div>
          </div>

          <button
            onClick={handleSubscribeClick}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs shadow-lg shadow-red-600/30 transition-all flex items-center gap-1.5 hover:scale-105 flex-shrink-0 cursor-pointer"
          >
            <Youtube className="w-4 h-4" />
            <span>زيارة القناة </span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={() => {
              onSuccess();
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            <span>متابعة المشاهدة الآن </span>
          </button>

          <div className="flex items-center justify-between text-xs text-gray-400 px-1">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>مشاهدة وتحميل مباشر لجميع القنوات</span>
            </span>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-300 transition-colors cursor-pointer text-[11px]"
            >
              إغلاق النافذة
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export const YouTubeSubscriptionBanner: React.FC<{
  onUnlocked?: () => void;
}> = ({ onUnlocked }) => {
  return (
    <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-right flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-xs sm:text-sm font-bold text-emerald-200 flex items-center gap-2">
            <span>سيرفرات المشاهدة وقنوات تيليجرام معتمدة ونشطة </span>
          </h4>
          <p className="text-[11px] text-gray-300">
            جميع الحلقات والأفلام وسيرفرات التحميل تعمل بدقة Full HD. تابع كل جديد عبر قناة Yona Songs الرسمية!
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white border border-red-500/40 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-105"
        >
          <Youtube className="w-4 h-4" />
          <span>قناة اليوتيوب الرسمية</span>
        </a>
      </div>
    </div>
  );
};
