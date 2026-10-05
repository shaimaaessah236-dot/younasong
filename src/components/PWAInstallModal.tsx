import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  CheckCircle2,
  X,
  Share,
  PlusSquare,
  Sparkles,
  Zap,
  Mic,
  Music,
  ArrowLeft,
  ExternalLink,
  Copy,
  Check,
  Monitor,
  Flame,
  FileCode2
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import yonaAppIcon from '../assets/images/yona_app_icon_1791070105858.jpg';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isInIframe, install } = usePWAInstall();

  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'pc'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'android'
  );

  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [downloadStage, setDownloadStage] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  // Trigger app launcher download file
  const downloadLauncherFile = () => {
    try {
      const appUrl = window.location.href.split('?')[0];
      const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>YONA SONGS - أغاني متنوعة ومختلفة . استوديو الغناء . وخدمات أخرى</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#0a0d14">
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <link rel="icon" href="${window.location.origin}/icon.svg">
  <link rel="apple-touch-icon" href="${window.location.origin}/apple-touch-icon.png">
  <meta http-equiv="refresh" content="0; url=${appUrl}">
  <style>
    body { background-color: #0a0d14; color: #E5C07B; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; text-align: center; }
    .btn { background: linear-gradient(135deg, #FFE082, #D4AF37); color: #0a0d14; padding: 14px 28px; border-radius: 16px; font-weight: 900; text-decoration: none; margin-top: 20px; display: inline-block; box-shadow: 0 4px 20px rgba(212,175,55,0.4); }
  </style>
</head>
<body>
  <h1> تطبيق YONA SONGS</h1>
  <p>جاري تحويلك إلى استوديو الأغاني والخدمات الصوتية...</p>
  <a class="btn" href="${appUrl}">فتح التطبيق مباشرة </a>
</body>
</html>`;

      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'YONA_SONGS_App.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to trigger file download:', e);
    }
  };

  const handleStartDownloadAndInstall = async () => {
    // 1. Show interactive progress
    setDownloadProgress(15);
    setDownloadStage('جاري تجهيز حزمة التطبيق والأيقونات الذهبية...');

    // 2. Try native prompt immediately if available
    install();

    setTimeout(() => {
      setDownloadProgress(45);
      setDownloadStage('تهيئة قاعدة بيانات الصوتيات ووضع الأوفلاين...');
    }, 450);

    setTimeout(() => {
      setDownloadProgress(80);
      setDownloadStage('تحميل ملف تشغيل التطبيق السريع على جهازك...');
      downloadLauncherFile();
    }, 900);

    setTimeout(() => {
      setDownloadProgress(100);
      setDownloadStage('اكتمل التجهيز بنجاح! التطبيق جاهز للتثبيت ');
    }, 1400);
  };

  const handleCopyAppUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleOpenDirectWindow = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div
      id="pwa-install-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md transition-opacity"
      onClick={onClose}
      dir="rtl"
    >
      <div
        id="pwa-install-modal-content"
        className="relative w-full max-w-lg bg-[#0e1424] border-2 border-[#D4AF37]/50 rounded-3xl p-5 sm:p-7 shadow-2xl text-right overflow-hidden space-y-5 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow and Decorative Background */}
        <div className="absolute -top-24 -left-24 w-56 h-56 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Close */}
        <div className="flex items-center justify-between relative z-10 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Smartphone className="w-5 h-5 text-amber-400" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black text-white">
                تثبيت تطبيق YONA SONGS 
              </h2>
              <p className="text-[11px] text-amber-300/80">بدون متجر • خفيف وسريع • ملء الشاشة</p>
            </div>
          </div>

          <button
            id="close-pwa-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* App Presentation Card */}
        <div className="relative z-10 flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#090d16] border border-[#D4AF37]/30 shadow-inner">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-lg border border-[#D4AF37]/50 flex-shrink-0 bg-[#0a0d16]">
            <img
              src={yonaAppIcon}
              alt="YONA SONGS App Icon"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-tajawal font-black text-lg text-white">YONA SONGS</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-500/20 text-red-300 border border-red-500/40">
                Vocals Only
              </span>
            </div>
            <p className="text-xs text-amber-300 font-medium">أغاني متنوعة ومختلفة . استوديو الغناء . وخدمات أخرى</p>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 pt-0.5 flex-wrap">
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3 h-3" /> متاح للتثبيت الفوري
              </span>
              <span>•</span>
              <span className="text-amber-400 font-mono text-[10px]">PWA 1.0</span>
            </div>
          </div>
        </div>

        {/* Already Installed Notification */}
        {isInstalled && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-2.5 text-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>التطبيق مثبت بالفعل على جهازك! يمكنك فتحه من شاشتك الرئيسية في أي وقت.</span>
          </div>
        )}

        {/* Main One-Click Download & Install Action Button */}
        <div className="space-y-3 relative z-10">
          <button
            id="pwa-start-download-button"
            onClick={handleStartDownloadAndInstall}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-sm sm:text-base flex items-center justify-center gap-3 shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Download className="w-5 h-5 fill-black" />
            <span>تحميل وتثبيت التطبيق على الهاتف الآن </span>
          </button>

          {/* Download & Installation Progress Bar (shown when clicked) */}
          {downloadProgress !== null && (
            <div className="p-3.5 rounded-2xl bg-[#090d16] border border-[#D4AF37]/40 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-300 font-bold flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
                  {downloadStage}
                </span>
                <span className="font-mono font-bold text-white">{downloadProgress}%</span>
              </div>
              <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400 rounded-full transition-all duration-300"
                  style={{ width: `${downloadProgress}%` }}
                />
              </div>
              {downloadProgress === 100 && (
                <div className="pt-1 text-[11px] text-emerald-300 flex items-center gap-1.5 font-bold">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>تم حفظ حزمة التطبيق. اتبع الخطوات السريعة أدناه لتثبيته في ثوانٍ:</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Device Selection Tabs for Clear Visual Instructions */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-300">اختر نوع جهازك لرؤية الطريقة:</span>
            {isInIframe && (
              <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                وضع المعاينة
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab('android')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                activeTab === 'android'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white border-white/5'
              }`}
            >
              <span> أندرويد</span>
            </button>

            <button
              onClick={() => setActiveTab('ios')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                activeTab === 'ios'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white border-white/5'
              }`}
            >
              <span> آيفون وآيباد</span>
            </button>

            <button
              onClick={() => setActiveTab('pc')}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border cursor-pointer ${
                activeTab === 'pc'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-sm'
                  : 'bg-white/5 text-gray-400 hover:text-white border-white/5'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>الكمبيوتر</span>
            </button>
          </div>

          {/* Tab 1: Android Instructions */}
          {activeTab === 'android' && (
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <span>خطوات التثبيت على هواتف الأندرويد (Chrome / Samsung):</span>
              </div>
              <ol className="space-y-1.5 text-gray-300 pr-2">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <span>اضغط على زر <strong>القائمة (⋮)</strong> في أعلى أو أسفل متصفح Chrome.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <span>اختر <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«الإضافة إلى الشاشة الرئيسية»</strong>.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <span>اضغط <strong>«تثبيت»</strong> وستظهر أيقونة التطبيق الذهبية على شاشة هاتفك فوراً!</span>
                </li>
              </ol>
            </div>
          )}

          {/* Tab 2: iOS Instructions */}
          {activeTab === 'ios' && (
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Share className="w-4 h-4 text-amber-400" />
                <span>خطوات التثبيت على الآيفون والآيباد (متصفح Safari):</span>
              </div>
              <ol className="space-y-1.5 text-gray-300 pr-2">
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <span>اضغط على زر <strong>المشاركة (Share ⬆)</strong> في شريط Safari السفلي.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <span>مرر للأسفل واختر <strong>«إضافة إلى الشاشة الرئيسية»</strong> <PlusSquare className="inline w-3 h-3 text-amber-400 mx-0.5" />.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <span>اضغط على <strong>«إضافة (Add)»</strong> لتصبح أيقونة YONA SONGS على شاشتك.</span>
                </li>
              </ol>
            </div>
          )}

          {/* Tab 3: PC Instructions */}
          {activeTab === 'pc' && (
            <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Monitor className="w-4 h-4 text-amber-400" />
                <span>التثبيت على الكمبيوتر (Windows / Mac عبر Chrome أو Edge):</span>
              </div>
              <p className="text-gray-300 leading-relaxed">
                اضغط على أيقونة التثبيت <strong>(⊕ أو الشاشة مع السهم)</strong> الموجودة مباشرة في نهاية شريط الروابط العلوي بالمتصفح، ثم اختر <strong>«تثبيت»</strong> ليعمل التطبيق في نافذة مستقلة كبرنامج رسمي على سطح المكتب.
              </p>
            </div>
          )}
        </div>

        {/* Direct Link & Share Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
          <button
            onClick={handleOpenDirectWindow}
            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold"
            title="فتح الموقع في نافذة جديدة للتثبيت المباشر"
          >
            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
            <span>فتح نافذة التثبيت </span>
          </button>

          <button
            onClick={handleCopyAppUrl}
            className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white border border-white/10 flex items-center justify-center gap-1.5 transition-all cursor-pointer font-bold"
            title="نسخ رابط التطبيق لمشاركته"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">تم النسخ!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>نسخ رابط التطبيق </span>
              </>
            )}
          </button>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/10 text-center">
          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-white">ملء الشاشة</p>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
            <Mic className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-white">استوديو سريع</p>
          </div>

          <div className="p-2 rounded-xl bg-white/[0.02] border border-white/5">
            <Music className="w-3.5 h-3.5 text-sky-400 mx-auto mb-1" />
            <p className="text-[10px] font-bold text-white">بدون موسيقى</p>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-2 border-t border-white/5">
          <span>YONA SONGS Standalone Web App</span>
          <button
            onClick={onClose}
            className="text-amber-300 hover:text-white font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>إغلاق ومتابعة</span>
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
