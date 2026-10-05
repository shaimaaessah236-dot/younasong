import React, { useState, useEffect } from 'react';
import {
  X,
  LogIn,
  User,
  ShieldCheck,
  Lock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Mail,
  Send,
  BellRing,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AuthModal: React.FC = () => {
  const {
    user,
    isAuthenticated,
    isAuthModalOpen,
    authModalOptions,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signInWithCustomName,
    signInAsGuest,
    signOut
  } = useAuth();
  const { language, isRtl } = useLanguage();

  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [customName, setCustomName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🎧');
  const [selectedPlanet, setSelectedPlanet] = useState('adventure');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [emailNotificationSent, setEmailNotificationSent] = useState<any | null>(null);

  // Automatically sign out and clear old mock session if user had member@gmail.com
  useEffect(() => {
    if (user && (user.email === 'member@gmail.com' || user.displayName === 'عضو Google سبيستون')) {
      signOut();
    }
  }, [user, signOut]);

  // Synchronize active tab based on how the modal was opened
  useEffect(() => {
    if (isAuthModalOpen) {
      if (authModalOptions?.defaultTab === 'admin') {
        setActiveTab('admin');
      } else {
        setActiveTab('user');
      }
      setErrorMsg(null);
      setSuccessMsg(null);
      setEmailNotificationSent(null);
      setAdminPasscode('');
    }
  }, [isAuthModalOpen, authModalOptions]);

  if (!isAuthModalOpen) return null;

  const avatarOptions = [
    { icon: '🎧', nameAr: 'السماعات', nameEn: 'Headphones' },
    { icon: '🎙️', nameAr: 'ميكرو', nameEn: 'Mic' },
    { icon: '🎤', nameAr: 'المطرب', nameEn: 'Singer' },
    { icon: '🎵', nameAr: 'نغمة الغناء', nameEn: 'Singing Note' },
    { icon: '🎶', nameAr: 'الألحان', nameEn: 'Melodies' },
    { icon: '📻', nameAr: 'المستمع', nameEn: 'Listener' },
    { icon: '⭐', nameAr: 'النجم', nameEn: 'Star' },
    { icon: '🎹', nameAr: 'البيانو', nameEn: 'Piano' }
  ];

  // 1. Google Auth (side-by-side with user registration)
  const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const signedIn = await signInWithGoogle();
      setSuccessMsg(
        language === 'ar'
          ? `تم تسجيل الدخول بحساب Google بنجاح باسم (${signedIn.displayName})`
          : `Signed in with Google successfully as (${signedIn.displayName})`
      );
      setTimeout(() => {
        closeAuthModal();
        if (authModalOptions?.onSuccess) authModalOptions.onSuccess();
      }, 1000);
    } catch (err: any) {
      console.warn('Google sign-in notice:', err);
      setErrorMsg(
        language === 'ar'
          ? 'تعذر إتمام الدخول بـ Google. يمكنك كتابة اسمك أو بريدك والمتابعة مباشرة.'
          : 'Google sign-in was closed or blocked. You can enter your name or email directly.'
      );
    } finally {
      setLoading(false);
    }
  };

  // 2. Unified User Auth: Name + Email Registration in One Flow
  const handleUnifiedUserAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailAddress.trim().toLowerCase();
    let cleanName = customName.trim();

    // If user provided email but left name empty, automatically use email username (e.g. ALsaudadam@gmail.com -> ALsaudadam)
    if (!cleanName && cleanEmail && cleanEmail.includes('@')) {
      cleanName = cleanEmail.split('@')[0];
    }

    if (!cleanName && !cleanEmail) {
      setErrorMsg(language === 'ar' ? 'الرجاء إدخال اسمك أو بريدك الإلكتروني للمتابعة' : 'Please enter your name or email to continue');
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      if (cleanEmail) {
        if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
          setErrorMsg(language === 'ar' ? 'الرجاء إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address');
          setLoading(false);
          return;
        }

        const signedInUser = await signInWithEmail(
          cleanEmail,
          cleanName,
          selectedAvatar,
          selectedPlanet
        );

        const notifInfo = {
          email: cleanEmail,
          name: signedInUser.displayName || cleanName,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          id: `YONA-${Date.now().toString(36).toUpperCase()}`
        };
        setEmailNotificationSent(notifInfo);

        setSuccessMsg(
          language === 'ar'
            ? `مرحباً بك! تم تسجيل دخولك بنجاح باسم (${signedInUser.displayName}) وإرسال إشعار ترحيبي إلى: ${cleanEmail}`
            : `Welcome! Signed in as (${signedInUser.displayName}) and notification sent to: ${cleanEmail}`
        );
      } else {
        await signInWithCustomName(cleanName, selectedAvatar, selectedPlanet);
        setSuccessMsg(
          language === 'ar'
            ? `مرحباً بك يا ${cleanName} في Yona Songs!`
            : `Welcome ${cleanName} to Yona Songs!`
        );
      }

      setTimeout(() => {
        closeAuthModal();
        if (authModalOptions?.onSuccess) authModalOptions.onSuccess();
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || (language === 'ar' ? 'فشل تسجيل الدخول' : 'Sign in failed'));
    } finally {
      setLoading(false);
    }
  };

  // 3. Quick Guest Auth
  const handleGuestAuth = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await signInAsGuest();
      setSuccessMsg(language === 'ar' ? 'تم الدخول كزائر للمنصة' : 'Entered as guest');
      setTimeout(() => {
        closeAuthModal();
        if (authModalOptions?.onSuccess) authModalOptions.onSuccess();
      }, 900);
    } catch (err: any) {
      setErrorMsg(language === 'ar' ? 'فشل الدخول كزائر' : 'Guest sign in failed');
    } finally {
      setLoading(false);
    }
  };

  // 4. Secure Owner Access (No password reveal or example code, no crown emojis)
  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = adminPasscode.trim().toLowerCase();
    if (clean === '8890' || clean === 'mssmith' || clean === 'ms smith' || clean === 'kool04') {
      try {
        localStorage.setItem('yona_cert_owner_auth', 'true');
        localStorage.setItem('yona_admin_authenticated', 'true');
      } catch {}
      signInWithCustomName('المالك والمشرف العام', '🎙️', 'adventure');
      setSuccessMsg(language === 'ar' ? 'تم التحقق من رمز المالك وتفعيل الصلاحيات' : 'Admin passcode verified! Full access unlocked');
      setTimeout(() => {
        closeAuthModal();
        if (authModalOptions?.onSuccess) authModalOptions.onSuccess();
        window.location.reload();
      }, 1000);
    } else {
      setErrorMsg(language === 'ar' ? 'رمز المرور غير صحيح. يرجى إدخال رمز المالك المعتمد.' : 'Incorrect secret passcode. Please enter the authorized code.');
    }
  };

  return (
    <div
      onClick={closeAuthModal}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#0e1626] via-[#0b111e] to-[#070b14] border-2 ${
          activeTab === 'admin' ? 'border-amber-400/40 shadow-amber-500/10' : 'border-teal-400/40 shadow-teal-500/10'
        } shadow-2xl p-5 sm:p-7 space-y-5 relative text-white ${
          isRtl ? 'text-right' : 'text-left'
        } max-h-[92vh] overflow-y-auto`}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className={`absolute top-4 ${isRtl ? 'left-4' : 'right-4'} p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer`}
          title="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
            activeTab === 'admin'
              ? 'bg-amber-500/20 border border-amber-400/50 text-amber-300 shadow-amber-950/50'
              : 'bg-teal-500/20 border border-teal-400/50 text-teal-300 shadow-teal-950/50'
          }`}>
            {activeTab === 'admin' ? <ShieldCheck className="w-6 h-6 text-amber-400" /> : <User className="w-6 h-6 text-teal-300" />}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black font-tajawal text-white">
              {authModalOptions?.title ||
                (activeTab === 'admin'
                  ? (language === 'ar' ? 'دخول مالك المنصة والمشرف العام' : 'Owner & Admin Access')
                  : (language === 'ar' ? 'تسجيل دخول الأعضاء والزوار' : 'Member Sign-In'))}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              {authModalOptions?.description ||
                (activeTab === 'admin'
                  ? (language === 'ar'
                    ? 'تسجيل الدخول بصلاحيات الإدارة والتحكم الشامل بالمنصة'
                    : 'Sign in with administrative privileges')
                  : (language === 'ar'
                    ? 'سجل باسمك أو بريدك، أو عبر Google لحفظ مشاركاتك والحصول على الشهادات المعتمدة'
                    : 'Sign in with name, email, or Google to save takes and certified diplomas'))}
            </p>
          </div>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-400/60 text-emerald-200 text-xs font-bold space-y-2 animate-in fade-in shadow-lg shadow-emerald-950/50">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-extrabold">{successMsg}</span>
            </div>
            {emailNotificationSent && (
              <div className="pt-2 border-t border-emerald-500/30 text-[11px] text-emerald-300/90 flex items-center justify-between flex-wrap gap-2">
                <span className="flex items-center gap-1">
                  <BellRing className="w-3.5 h-3.5 text-teal-300" />
                  <span>تم إرسال إشعار رسمي إلى: {emailNotificationSent.email}</span>
                </span>
                <span className="font-mono text-slate-300">#{emailNotificationSent.id}</span>
              </div>
            )}
          </div>
        )}

        {/* If Already Logged In */}
        {isAuthenticated && user ? (
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-teal-500/30 space-y-4 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-teal-500/20 border-2 border-teal-400 flex items-center justify-center text-2xl shadow-lg">
              {user.avatarIcon || '👤'}
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-white text-base">{user.displayName}</h4>
              <p className="text-xs text-teal-300 font-mono">
                {user.email || (language === 'ar' ? 'عضو مسجل' : 'Registered Member')}
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={closeAuthModal}
                className="px-5 py-2.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                {language === 'ar' ? 'متابعة التصفح' : 'Continue'}
              </button>
              <button
                type="button"
                onClick={signOut}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-rose-300 font-bold text-xs transition-all cursor-pointer border border-white/10"
              >
                {language === 'ar' ? 'تسجيل الخروج' : 'Sign Out'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Exactly 2 Clean Tabs: 1. User Sign In (Name + Email + Google) | 2. Owner Access */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-black/60 border border-white/10 text-xs font-bold">
              {/* TAB 1: USER (NAME + EMAIL + GOOGLE) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('user');
                  setErrorMsg(null);
                }}
                className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'user'
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-400 text-slate-950 shadow-md font-black'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span className="truncate">{language === 'ar' ? 'تسجيل دخول الأعضاء' : 'Member Sign-In'}</span>
              </button>

              {/* TAB 2: OWNER ACCESS (Clean Shield Icon - No Crown) */}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('admin');
                  setErrorMsg(null);
                }}
                className={`py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'admin'
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 shadow-md font-black'
                    : 'text-amber-300 hover:text-amber-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="truncate">{language === 'ar' ? 'دخول المالك' : 'Owner Access'}</span>
              </button>
            </div>

            {/* ============================================================== */}
            {/* TAB 1: ALL-IN-ONE USER LOGIN: NAME + EMAIL + GOOGLE TOGETHER */}
            {/* ============================================================== */}
            {activeTab === 'user' && (
              <form onSubmit={handleUnifiedUserAuth} className="space-y-4 animate-in fade-in duration-200">
                
                {/* 1. Name Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 block">
                    {language === 'ar' ? 'الاسم أو اللقب الفني:' : 'Name or Nickname:'}
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={language === 'ar' ? 'اكتب اسمك هنا (مثال: نايف، شيخة، صوت الأمل...)' : 'E.g., Nayef, Sheikha, Spacetoon Hero...'}
                    className="w-full px-4 py-2.5 rounded-2xl bg-black/60 border border-teal-500/30 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>

                {/* 2. Email Input (Directly Under Name) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-200 block">
                      {language === 'ar' ? 'التسجيل بالبريد الإلكتروني:' : 'Email Registration:'}
                    </label>
                    <span className="text-[11px] text-teal-300 font-semibold flex items-center gap-1">
                      <Mail className="w-3 h-3 text-teal-400" />
                      <span>{language === 'ar' ? 'لإرسال إشعار فوري والشهادات' : 'For instant alert & diplomas'}</span>
                    </span>
                  </div>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder={language === 'ar' ? 'name@gmail.com (اختياري لتفعيل إشعار البريد)' : 'name@gmail.com (optional for email alerts)'}
                    className="w-full px-4 py-2.5 rounded-2xl bg-black/60 border border-teal-500/30 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20"
                  />
                </div>

                {/* 3. Avatar Icon Selection */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-bold text-slate-300 block">
                    {language === 'ar' ? 'اختر أيقونة وشعار حسابك:' : 'Choose your avatar icon:'}
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                    {avatarOptions.map((av, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedAvatar(av.icon)}
                        className={`p-2 rounded-2xl border text-xl flex items-center justify-center transition-all cursor-pointer ${
                          selectedAvatar === av.icon
                            ? 'bg-teal-500/30 border-teal-400 scale-110 shadow-lg shadow-teal-500/20'
                            : 'bg-black/40 border-white/10 hover:border-teal-400/40 opacity-70 hover:opacity-100'
                        }`}
                        title={language === 'ar' ? av.nameAr : av.nameEn}
                      >
                        <span>{av.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Action Buttons: Submit and Google Side-by-Side in One Place */}
                <div className="pt-2 space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Direct Sign-In (By Name or Email) - NO EMOJI */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="py-3 px-4 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-400 hover:from-teal-400 hover:to-emerald-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-50"
                    >
                      {loading ? <RefreshCw className="w-4 h-4 animate-spin text-slate-950" /> : <LogIn className="w-4 h-4 text-slate-950" />}
                      <span>{language === 'ar' ? 'تسجيل الدخول فوراً' : 'Sign In Instantly'}</span>
                    </button>

                    {/* Google Sign-In (Right Next To It) */}
                    <button
                      type="button"
                      onClick={handleGoogleAuth}
                      disabled={loading}
                      className="py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all hover:scale-[1.02] cursor-pointer border border-white/20 disabled:opacity-50"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>{language === 'ar' ? 'دخول بحساب Google' : 'Sign in with Google'}</span>
                    </button>
                  </div>

                  {/* One-click Guest Entry */}
                  <button
                    type="button"
                    onClick={handleGuestAuth}
                    disabled={loading}
                    className="w-full py-2.5 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>{language === 'ar' ? 'المتابعة كـ زائر مؤقت بضغطة واحدة' : 'Continue as Guest with One Click'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* ============================================================== */}
            {/* TAB 2: OWNER ACCESS (CLEAN SHIELD ICON - NO CROWN EMOJIS)     */}
            {/* ============================================================== */}
            {activeTab === 'admin' && (
              <form onSubmit={handleAdminAuth} className="space-y-4 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 text-amber-200 text-xs font-bold flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{language === 'ar' ? 'خاص بمالك المنصة والمشرف العام فقط' : 'Authorized Platform Owner Access Only'}</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-200 block">
                    {language === 'ar' ? 'رمز المرور السري للمالك:' : 'Owner Secret Passcode:'}
                  </label>
                  <div className="relative">
                    <input
                      type={showAdminPassword ? 'text' : 'password'}
                      required
                      autoFocus
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-2xl bg-black/60 border border-amber-400/40 text-amber-300 font-mono text-sm placeholder-slate-600 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 text-center tracking-widest text-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-300 p-1 cursor-pointer transition-colors`}
                      title={showAdminPassword ? (language === 'ar' ? 'إخفاء الرمز' : 'Hide') : (language === 'ar' ? 'إظهار الرمز' : 'Show')}
                    >
                      {showAdminPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {language === 'ar'
                      ? 'يرجى إدخال رمز التحقق الخاص بالإدارة لتفعيل الصلاحيات الكاملة.'
                      : 'Enter your authorized admin secret passcode to unlock management.'}
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-950" />
                  <span>{language === 'ar' ? 'تأكيد الدخول كمالك للمنصة' : 'Unlock Owner Permissions'}</span>
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
