import React, { useState } from 'react';
import { Lock, LogIn, User, X, ShieldCheck, Mail, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface RequireAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  onSuccess?: () => void;
}

export const RequireAuthModal: React.FC<RequireAuthModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onSuccess,
}) => {
  const { openAuthModal, signInWithCustomName, signInAsGuest } = useAuth();
  const { language, isRtl } = useLanguage();
  const [quickNameInput, setQuickNameInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleQuickNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNameInput.trim()) return;
    setLoading(true);
    try {
      await signInWithCustomName(quickNameInput.trim(), '👑', 'adventure');
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEmailAuth = () => {
    onClose();
    openAuthModal({
      defaultTab: 'email',
      title: language === 'ar' ? 'تسجيل الدخول بالبريد الإلكتروني' : 'Email Sign In',
      onSuccess
    });
  };

  const handleGuestLogin = async () => {
    try {
      await signInAsGuest();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Guest Sign-In Error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className={`w-full max-w-md p-6 rounded-3xl bg-[#0F172A] border border-emerald-500/40 shadow-2xl space-y-5 relative text-white ${isRtl ? 'text-right' : 'text-left'}`}>
        <button
          onClick={onClose}
          className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">
              {title || (language === 'ar' ? 'تسجيل الدخول مطلوب للمتابعة' : 'Sign In Required')}
            </h3>
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'حماية الحساب والتسجيلات' : 'Account & Audio Protection'}</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-2xl border border-slate-700/50">
          {description || (language === 'ar'
            ? 'لحفظ أداءك وتسجيلاتك الصوتية وإصدار شهادات الكويز المعتمدة، يكفي كتابة اسمك للدخول الفوري أو الدخول ببريدك الإلكتروني لتلقي إشعارات الحساب.'
            : 'To save your audio takes and quiz diplomas, just enter your name for instant access or sign in with email.')}
        </p>

        {/* Quick Name Form */}
        <form onSubmit={handleQuickNameSubmit} className="space-y-2">
          <label className="text-xs font-bold text-slate-300 block">
            {language === 'ar' ? 'اكتب اسمك للمتابعة فوراً:' : 'Enter your nickname:'}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              required
              value={quickNameInput}
              onChange={(e) => setQuickNameInput(e.target.value)}
              placeholder={language === 'ar' ? 'مثال: نايف، شيخة، بطل الأنمي...' : 'Your name (e.g. Nayef, Sheikha)...'}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/60 border border-emerald-500/40 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
            <button
              type="submit"
              disabled={loading || !quickNameInput.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'دخول فوري' : 'Enter'}</span>
            </button>
          </div>
        </form>

        <div className="space-y-2 pt-1">
          <button
            onClick={handleOpenEmailAuth}
            className="w-full py-2.5 px-4 rounded-xl bg-sky-950/80 hover:bg-sky-900/80 border border-sky-400/40 text-sky-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5 text-sky-400" />
            <span>{language === 'ar' ? 'تسجيل الدخول بالبريد الإلكتروني (مع إشعار)' : 'Sign In with Email (With Notification)'}</span>
          </button>

          <button
            onClick={handleGuestLogin}
            className="w-full py-2 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-400 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>{language === 'ar' ? 'المتابعة كـ زائر مؤقت' : 'Continue as Guest'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
