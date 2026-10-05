import React, { useState, useEffect } from 'react';
import {
  Coffee,
  Heart,
  DollarSign,
  Youtube,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Check,
  CreditCard,
  Settings,
  HelpCircle,
  X,
  ChevronLeft,
  Gift
} from 'lucide-react';

interface SupportChannelWidgetProps {
  onShowToast?: (msg: string) => void;
}

export const SupportChannelWidget: React.FC<SupportChannelWidgetProps> = ({ onShowToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(1);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showConfig, setShowConfig] = useState(false);

  // Stored Payment Handles (Default to demo/placeholders, easily customized by page owner)
  const [paypalUsername, setPaypalUsername] = useState<string>(() => {
    try {
      return localStorage.getItem('yona_support_paypal_handle') || 'yona_songs';
    } catch {
      return 'yona_songs';
    }
  });

  const [kofiUsername, setKofiUsername] = useState<string>(() => {
    try {
      return localStorage.getItem('yona_support_kofi_handle') || 'yonasongs';
    } catch {
      return 'yonasongs';
    }
  });

  const [ytChannelUrl, setYtChannelUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('yona_support_yt_url') || 'https://youtube.com/@yona_songs?sub_confirmation=1';
    } catch {
      return 'https://youtube.com/@yona_songs?sub_confirmation=1';
    }
  });

  const [copiedLink, setCopiedLink] = useState(false);

  const handleSaveConfig = () => {
    try {
      localStorage.setItem('yona_support_paypal_handle', paypalUsername.trim());
      localStorage.setItem('yona_support_kofi_handle', kofiUsername.trim());
      localStorage.setItem('yona_support_yt_url', ytChannelUrl.trim());
      setShowConfig(false);
      if (onShowToast) {
        onShowToast(' تم حفظ إعدادات حسابات الدعم وقناة اليوتيوب بنجاح!');
      }
    } catch (e) {}
  };

  const finalAmount = customAmount ? parseFloat(customAmount) || 1 : selectedAmount;

  const handlePayViaPayPal = () => {
    const handle = paypalUsername.trim() || 'yona_songs';
    const url = `https://paypal.me/${handle}/${finalAmount}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    if (onShowToast) {
      onShowToast(` شكراً جزيلاً لدعمك النبيل لقناة ومنصة يونا ($${finalAmount})!`);
    }
  };

  const handlePayViaKoFi = () => {
    const handle = kofiUsername.trim() || 'yonasongs';
    const url = `https://ko-fi.com/${handle}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    if (onShowToast) {
      onShowToast(` شكراً جزيلاً لدعمك لقناة ومنصة يونا!`);
    }
  };

  const tiers = [
    { amount: 1, label: 'كوب قهوة دافئ ', desc: 'دعم رمزي لتشجيع تسجيل شارات جديدة' },
    { amount: 3, label: 'ميكروفون ذهبي ', desc: 'دعم صيانة السيرفر ومعدات الصوت' },
    { amount: 5, label: 'إنتاج شارة كاملة ', desc: 'رعاية تسجيل شارة كرتون بصوت بشري نقي' },
    { amount: 10, label: 'راعي الشرف الذهبي ', desc: 'وسام تقديري واحتفاء خاص في لوحة الشرف' },
  ];

  return (
    <>
      {/* Small, Compact Floating Side Support Button on the Right */}
      <div className="fixed top-1/2 -translate-y-1/2 right-2.5 z-40 hidden sm:block">
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[#0d1522]/95 hover:bg-[#121c2e] backdrop-blur-md border border-teal-400/40 hover:border-teal-300 text-teal-200 hover:text-white text-[11px] font-bold shadow-lg shadow-black/40 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          title="دعم القناة والمنصة (بدءاً من 1$)"
          aria-label="دعم القناة بدءاً من 1$"
        >
          <span className="w-5 h-5 rounded-full bg-teal-400/20 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform">
            <Coffee className="w-3 h-3" />
          </span>
          <span className="font-tajawal font-bold text-xs tracking-wide">دعم 1$</span>
          
          {/* Subtle glowing indicator dot */}
          <span className="w-1.5 h-1.5 rounded-full bg-teal-300 shadow-sm shadow-teal-400/80 animate-pulse"></span>
        </button>
      </div>

      {/* Tiny Mobile Support Button on the Right */}
      <div className="fixed bottom-24 right-3 z-30 sm:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#0d1522]/95 backdrop-blur-md border border-teal-400/40 text-teal-200 text-[10px] font-bold shadow-md shadow-black/50 active:scale-95 transition-transform cursor-pointer"
          aria-label="دعم القناة 1$"
        >
          <Coffee className="w-3 h-3 text-teal-300" />
          <span>دعم 1$</span>
        </button>
      </div>

      {/* Support & Monetization Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#161a29] via-[#0f1422] to-[#0a0d16] border border-amber-500/30 shadow-2xl p-6 sm:p-7 text-right space-y-6 my-8">
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -left-12 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-start justify-between">
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3">
                <div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[11px] font-black">
                    <Heart className="w-3 h-3 fill-amber-400" />
                    <span>مساهمة مجتمعية مستدامة</span>
                  </div>
                  <h3 className="text-xl font-black font-tajawal text-white mt-1">
                     دعم القناة والمنصة
                  </h3>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg shadow-amber-500/20">
                  <Coffee className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Explanation of where money goes (Clarification requested by user) */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <HelpCircle className="w-4 h-4 flex-shrink-0" />
                <span>كيف تصلك أموال الداعمين؟ (شرح مباشر وشفاف)</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                الأموال <strong className="text-white">لا تبقى في الموقع</strong>، بل يتم تحويلها مباشرة عبر بوابة الدفع الآمنة (مثل <strong>PayPal</strong> أو <strong>Ko-fi</strong>) فوراً إلى حسابك الشخصي، ومنه يمكنك سحبها إلى <strong>حسابك البنكي المحلي</strong> في أي وقت!
              </p>
            </div>

            {/* Amount Selection Grid */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-300">
                اختر مبلغ الدعم (يبدأ من 1$ فقط):
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {tiers.map((tier) => {
                  const isSelected = selectedAmount === tier.amount && !customAmount;
                  return (
                    <button
                      key={tier.amount}
                      onClick={() => {
                        setSelectedAmount(tier.amount);
                        setCustomAmount('');
                      }}
                      className={`p-3 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-md shadow-amber-500/20 ring-1 ring-amber-400'
                          : 'bg-white/[0.02] border-white/10 hover:border-amber-500/40 text-gray-300 hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-base font-black text-amber-400">${tier.amount}</span>
                        {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div className="mt-1">
                        <span className="block text-xs font-bold">{tier.label}</span>
                        <span className="block text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                          {tier.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="أو اكتب مبلغاً آخر مخصصاً ($)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-amber-400 text-right"
                />
                <span className="text-xs font-bold text-amber-400 font-mono px-2">$ USD</span>
              </div>
            </div>

            {/* Payment Actions */}
            <div className="space-y-2.5">
              <button
                onClick={handlePayViaPayPal}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#0070BA] hover:bg-[#005ea6] text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>إرسال الدعم عبر PayPal (${finalAmount})</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>

              <button
                onClick={handlePayViaKoFi}
                className="w-full py-3 px-4 rounded-2xl bg-[#FF5E5B] hover:bg-[#e04f4c] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-[0.98] transition-all cursor-pointer"
              >
                <Coffee className="w-4 h-4" />
                <span>الدعم عبر صفحة Ko-fi (بطاقة بنكية / Apple Pay)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </button>
            </div>

            {/* Direct YouTube Channel Link & Subscriptions */}
            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href={ytChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600/15 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Youtube className="w-4 h-4" />
                <span>الاشتراك بقناة اليوتيوب الرسمية</span>
              </a>

              <button
                onClick={() => setShowConfig(!showConfig)}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-amber-400 border border-white/10 transition-colors cursor-pointer"
                title="تخصيص روابط حسابات الدعم الخاصة بك"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            {/* Configuration Drawer (For Owner to put their own PayPal / Ko-Fi / YouTube links) */}
            {showConfig && (
              <div className="p-4 rounded-2xl bg-black/60 border border-amber-500/30 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs font-bold text-amber-300">
                  <span className="flex items-center gap-1.5">
                    <Settings className="w-3.5 h-3.5" />
                    <span>تخصيص حسابات استلام الأموال وقناة يوتيوب</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">إعدادات صاحب الصفحة</span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-gray-400 mb-1 text-[11px]">
                      اسم مستخدم PayPal (مثال: paypal.me/<strong>username</strong>):
                    </label>
                    <input
                      type="text"
                      value={paypalUsername}
                      onChange={(e) => setPaypalUsername(e.target.value)}
                      placeholder="اسم حسابك في paypal.me"
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 text-[11px]">
                      اسم مستخدم Ko-fi (مثال: ko-fi.com/<strong>username</strong>):
                    </label>
                    <input
                      type="text"
                      value={kofiUsername}
                      onChange={(e) => setKofiUsername(e.target.value)}
                      placeholder="اسم حسابك في ko-fi"
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 mb-1 text-[11px]">
                      رابط قناة اليوتيوب:
                    </label>
                    <input
                      type="text"
                      value={ytChannelUrl}
                      onChange={(e) => setYtChannelUrl(e.target.value)}
                      placeholder="https://youtube.com/@channel"
                      className="w-full px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs text-left font-mono"
                    />
                  </div>

                  <button
                    onClick={handleSaveConfig}
                    className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors cursor-pointer mt-2"
                  >
                    حفظ وتحديث روابط الاستلام 
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
};
