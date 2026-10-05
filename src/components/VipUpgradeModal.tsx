import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  Zap,
  Check,
  CreditCard,
  Coffee,
  X,
  ShieldCheck,
  Flame,
  KeyRound,
  ExternalLink,
  Award,
  Music,
  Download,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import {
  getVipStatusInfo,
  redeemVipCode,
  grantVipMembership,
  addExtraCredits,
  VipStatusInfo,
  FREE_ISOLATION_LIMIT
} from '../lib/vipMembership';

interface VipUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onShowToast?: (msg: string) => void;
}

export const VipUpgradeModal: React.FC<VipUpgradeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onShowToast
}) => {
  const [status, setStatus] = useState<VipStatusInfo>(() => getVipStatusInfo());
  const [selectedPlan, setSelectedPlan] = useState<'tier5' | 'tier10'>('tier10');
  const [voucherCode, setVoucherCode] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [codeMessage, setCodeMessage] = useState<{ text: string; isError: boolean } | null>(null);

  if (!isOpen) return null;

  const refreshStatus = () => {
    setStatus(getVipStatusInfo());
  };

  const paypalHandle = typeof window !== 'undefined'
    ? localStorage.getItem('yona_support_paypal_handle') || 'shaimaaessah236'
    : 'shaimaaessah236';

  const kofiHandle = typeof window !== 'undefined'
    ? localStorage.getItem('yona_support_kofi_handle') || 'yonasongs'
    : 'yonasongs';

  const handlePayViaPayPal = (amount: number) => {
    const url = `https://paypal.me/${paypalHandle}/${amount}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    if (onShowToast) {
      onShowToast(` تم توجيهك لصفحة PayPal (${paypalHandle}) لإتمام الدفع ($${amount}). بعد الإتمام أدخل رقم المعاملة أو الكود لتفعيل حسابك فوراً!`);
    }
  };

  const handlePayViaKoFi = (amount: number) => {
    const url = `https://ko-fi.com/${kofiHandle}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    if (onShowToast) {
      onShowToast(` تم فتح صفحة Ko-fi لدفع ($${amount}). بعد إتمام الدفع يمكنك تفعيل الباقة فوراً!`);
    }
  };

  const handleRedeemCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voucherCode.trim()) return;

    const res = redeemVipCode(voucherCode);
    if (res.success) {
      setCodeMessage({ text: res.message, isError: false });
      refreshStatus();
      if (onShowToast) onShowToast(res.message);
      if (onSuccess) onSuccess();
      setVoucherCode('');
    } else {
      setCodeMessage({ text: res.message, isError: true });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#181d2e] via-[#101524] to-[#090c14] border border-amber-500/40 shadow-2xl p-6 sm:p-8 text-right space-y-6 my-8">
        
        {/* Ambient Halo Glow */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge & Title */}
        <div className="flex items-center gap-3.5 pr-1">
          <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-black flex-shrink-0 shadow-xl shadow-amber-500/30">
            <Crown className="w-7 h-7 fill-black" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-black">
              <Sparkles className="w-3.5 h-3.5" />
              <span>استوديو عزل الصوت الاحترافي الفائق</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black font-tajawal text-white mt-1">
              ترقية باقات عزل الصوت وعضوية VIP 
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              الدفع يمكنك من مواصلة عزل وفصل الصوت بدون حدود وبأعلى جودة استوديو نقية!
            </p>
          </div>
        </div>

        {/* Current Usage Status Banner */}
        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-gray-300">حالة رصيد عزل الصوت لجهازك:</span>
            {status.isOwner ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                <span>حساب المالك (غير محدود )</span>
              </span>
            ) : status.isVip ? (
              <span className="px-2.5 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 font-extrabold flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                <span>عضوية VIP غير محدودة </span>
              </span>
            ) : (
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                status.remaining <= 0
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                  : status.remaining <= 3
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              }`}>
                {status.remaining} من أصل {status.totalAvailable} عملية متبقية
              </span>
            )}
          </div>

          {/* Progress bar */}
          {!status.isOwner && !status.isVip && (
            <div className="space-y-1">
              <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    status.remaining <= 0 
                      ? 'bg-rose-500' 
                      : status.remaining <= 3 
                      ? 'bg-amber-500' 
                      : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, (status.remaining / status.totalAvailable) * 100))}%`
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-gray-400 font-bold">
                <span>استهلكت: {status.used} / {status.totalAvailable} عملية</span>
                <span>{status.remaining <= 0 ? ' انتهى الرصيد المجاني' : `متبقي: ${status.remaining} عملية`}</span>
              </div>
            </div>
          )}
        </div>

        {/* Plan Selection Cards ($5 vs $10) */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-300">
            اختر الباقة المناسبة لاحتياجاتك:
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Plan 1: 50 Extra Stems ($5) */}
            <div
              onClick={() => setSelectedPlan('tier5')}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'tier5'
                  ? 'bg-gradient-to-b from-blue-900/30 to-blue-950/50 border-blue-400 text-white shadow-lg shadow-blue-900/30 ring-1 ring-blue-400'
                  : 'bg-white/[0.02] border-white/10 hover:border-blue-500/40 text-gray-300 hover:bg-white/[0.04]'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-blue-400 font-mono">$5 <span className="text-xs font-normal text-gray-400">/ دفعة واحدة</span></span>
                  {selectedPlan === 'tier5' && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">باقة 50 عملية عزل إضافية </h4>
                  <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                    مثالية للهواة؛ تمنحك 50 عملية عزل وفصل صوت إضافية بالكامل.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>عزل فوري للمسارات (Vocals & Beats)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span>تحميل كاريوكي وACAPELLA</span>
                </div>
              </div>
            </div>

            {/* Plan 2: Lifetime VIP ($10) - RECOMMENDED */}
            <div
              onClick={() => setSelectedPlan('tier10')}
              className={`relative p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedPlan === 'tier10'
                  ? 'bg-gradient-to-b from-amber-500/20 via-yellow-500/10 to-amber-950/40 border-amber-400 text-white shadow-xl shadow-amber-500/20 ring-2 ring-amber-400'
                  : 'bg-white/[0.02] border-white/10 hover:border-amber-400/50 text-gray-300 hover:bg-white/[0.04]'
              }`}
            >
              {/* Best Value Badge */}
              <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-[10px] shadow-md">
                الأكثر طلباً وتوفيراً 
              </div>

              <div className="space-y-2 mt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black text-amber-300 font-mono">$10 <span className="text-xs font-normal text-amber-200/70">/ مدى الحياة</span></span>
                  {selectedPlan === 'tier10' && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white flex items-center gap-1">
                    <span>عضوية VIP غير المحدودة</span>
                    <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </h4>
                  <p className="text-[11px] text-gray-200 mt-1 leading-relaxed">
                    عزل صوت غير محدود مدى الحياة + شارة VIP الذهبية في المسابقات.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-amber-400/20 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-200 font-bold">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>عزل صوت غير محدود  مدى الحياة</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>تحميل ملفات WAV استوديو نقية (Lossless)</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>شارة VIP في لوحة المسابقات والتسجيلات </span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Check className="w-3.5 h-3.5 text-amber-400" />
                  <span>إشعار فوري مبكر لمنتجات البراند الجديد + خصم 25% </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* VIP BRAND LAUNCH EARLY ACCESS NOTIFICATION BANNER */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-amber-950/20 border border-amber-400/30 text-right space-y-2">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-extrabold">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>خدمات VIP: كن أول من يعلم عند توفر منتجات البراند الجديد</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            سجل بريدك الإلكتروني لضمان وصول إشعار فوري وكود خصم خاص (BRAND-VIP-25) فور إطلاق المنتجات الحصرية على المتجر.
          </p>
        </div>

        {/* Action Buttons & Payment Gateways */}
        <div className="space-y-2.5 pt-1">
          {/* Guarantee Note */}
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] text-center font-bold flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>جميع المدفوعات آمنة ومضمونة 100% وتحول مباشرة للحساب الرسمي (shaimaaessah236)</span>
          </div>

          {/* PayPal Payment */}
          <button
            onClick={() => handlePayViaPayPal(selectedPlan === 'tier5' ? 5 : 10)}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Crown className="w-4 h-4 fill-black" />
            <span>
              {selectedPlan === 'tier5'
                ? 'الدفع عبر PayPal ($5) - شحن 50 عملية عزل'
                : 'الدفع عبر PayPal ($10) - تفعيل VIP غير محدود مدى الحياة'}
            </span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </button>

          {/* Credit Card / Visa / Mastercard / Ko-fi */}
          <button
            onClick={() => handlePayViaKoFi(selectedPlan === 'tier5' ? 5 : 10)}
            className="w-full py-3 px-4 rounded-2xl bg-[#FF5E5B]/20 hover:bg-[#FF5E5B]/30 border border-[#FF5E5B]/40 text-[#FF5E5B] hover:text-white font-extrabold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4 text-[#FF5E5B]" />
            <span>الدفع بالبطاقة البنكية (Visa / Mastercard / Apple Pay)</span>
          </button>
        </div>

        {/* Voucher Code Activation Option */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => setShowCodeInput(!showCodeInput)}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>هل تملك كود تفعيل أو قمت بالدفع مسبقاً؟ اضغط هنا</span>
            </button>
            <span className="text-[10px] text-gray-500">تفعيل فوري</span>
          </div>

          {showCodeInput && (
            <form onSubmit={handleRedeemCode} className="space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="أدخل كود التفعيل الخاص بك هنا (مثال: VIP-XXXX-XXXX)"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder:text-gray-500 focus:outline-none focus:border-amber-400 uppercase font-mono text-left"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-colors cursor-pointer"
                >
                  تفعيل الكود 
                </button>
              </div>

              {codeMessage && (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                    codeMessage.isError
                      ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                      : 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {codeMessage.isError ? (
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{codeMessage.text}</span>
                </div>
              )}
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
