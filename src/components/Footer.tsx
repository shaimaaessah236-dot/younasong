import React, { useState } from 'react';
import { Send, Mail, Heart, Check, ExternalLink, User, LogIn, LogOut, ShieldCheck, BellRing, Sparkles, CheckCircle2, Eye, Smartphone } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import yonaHorizontalLogo from '../assets/images/yona_horizontal_logo_1791070093629.jpg';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { EmailNotificationViewerModal } from './EmailNotificationViewerModal';

interface FooterProps {
  onOpenSqlSchema?: () => void;
  activeTab?: string;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSqlSchema, activeTab = 'directory' }) => {
  const { isDarkMode } = useTheme();
  const { language, isRtl, t } = useLanguage();
  const { user, openAuthModal, signOut, isAuthenticated, signInWithEmail } = useAuth();

  // Newsletter state
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  // Direct Footer Email Sign-In state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [emailLoginFeedback, setEmailLoginFeedback] = useState<string | null>(null);
  const [lastNotificationPayload, setLastNotificationPayload] = useState<any | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  const handleDirectEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = loginEmail.trim().toLowerCase();

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setEmailLoginFeedback(
        language === 'ar'
          ? 'الرجاء إدخال بريد إلكتروني صحيح'
          : 'Please enter a valid email'
      );
      return;
    }

    setIsSubmittingLogin(true);
    setEmailLoginFeedback(null);

    try {
      await signInWithEmail(cleanEmail, loginName.trim() || undefined);

      // Load saved notification payload from localStorage
      try {
        const savedNotif = localStorage.getItem('yona_last_email_notification');
        if (savedNotif) {
          setLastNotificationPayload(JSON.parse(savedNotif));
        }
      } catch {}

      setEmailLoginFeedback(
        language === 'ar'
          ? `تم تسجيل دخولك بنجاح وإرسال إشعار ترحيبي إلى: ${cleanEmail} 📩`
          : `Signed in successfully! Welcome notification sent to: ${cleanEmail} 📩`
      );

      setLoginEmail('');
      setLoginName('');
      setShowNotificationModal(true);
    } catch (err: any) {
      setEmailLoginFeedback(
        err.message ||
          (language === 'ar'
            ? 'فشل تسجيل الدخول'
            : 'Sign in failed')
      );
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  return (
    <footer
      className={`w-full ${
        isDarkMode
          ? 'bg-[#0a0d14] text-slate-300 border-white/[0.06]'
          : 'bg-[#FFFFFF] text-slate-700 border-slate-200'
      } py-12 mt-16 border-t transition-colors duration-300 ${
        isRtl ? 'dir-rtl text-right' : 'dir-ltr text-left'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Col 1: About Yona Songs */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-24 rounded-lg overflow-hidden shrink-0 border border-amber-400/30 bg-[#090d16] shadow-sm">
                <img
                  src={yonaHorizontalLogo}
                  alt="Yona Songs"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h3 className="text-xl font-black font-tajawal gold-text-satin tracking-wider">
                YONA SONGS
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {t('footerAboutText')}
            </p>

            <div className="pt-2 flex items-center gap-1.5 text-xs text-rose-300 font-bold">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{t('footerLoveText')}</span>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
              {t('footerNavTitle')}
            </h4>

            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <a href="#latest" className="hover:text-white transition-colors">
                  {language === 'ar'
                    ? 'أحدث الفيديوهات والتسجيلات'
                    : 'Latest Tracks & Takes'}
                </a>
              </li>

              <li>
                <a href="#artists" className="hover:text-white transition-colors">
                  {language === 'ar'
                    ? 'الفنانون والأصوات المتميزة'
                    : 'Vocalists & Featured Artists'}
                </a>
              </li>

              <li>
                <a href="#anime" className="hover:text-white transition-colors">
                  {language === 'ar'
                    ? 'شارات وأغاني الأنمي'
                    : 'Anime Soundtracks'}
                </a>
              </li>

              <li>
                <a href="#tools" className="hover:text-white transition-colors">
                  {language === 'ar'
                    ? 'أدوات الصوت ومعالجة الـ BPM'
                    : 'Audio Tools & BPM Detection'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Terms */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
              {t('footerLegalTitle')}
            </h4>

            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {language === 'ar'
                    ? 'سياسة الخصوصية (Privacy Policy)'
                    : 'Privacy Policy'}
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {language === 'ar'
                    ? 'شروط الاستخدام (Terms of Service)'
                    : 'Terms of Service'}
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {language === 'ar'
                    ? 'حقوق الملكية الفكرية و YouTube Embeds'
                    : 'Intellectual Property & YouTube'}
                </a>
              </li>

              <li>
                <a href="#" className="hover:text-white transition-colors">
                  {language === 'ar'
                    ? 'اتصل بنا (Contact & Support)'
                    : 'Contact & Support'}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Social */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-widest">
              {t('footerNewsletterTitle')}
            </h4>

            <p className="text-xs text-slate-400">
              {t('footerNewsletterDesc')}
            </p>

            {subscribed ? (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{t('footerSubscribedSuccess')}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    language === 'ar'
                      ? 'بريدك الإلكتروني...'
                      : 'Your email address...'
                  }
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[#0e1422] border border-white/[0.08] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400/50"
                />

                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-sky-300 hover:from-teal-300 hover:to-sky-200 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center cursor-pointer shadow-sm shadow-teal-400/20"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* Footer Social Links Section */}
            <div className="pt-2 flex items-center gap-4 flex-wrap">

              <a
                href="https://www.youtube.com/@yona_songs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-teal-300 transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-current text-red-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>YouTube</span>
              </a>

              <a
                href="https://www.instagram.com/younasongs/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-pink-400 transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-current text-pink-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.644-.07-1.689-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618-6.98-6.98-.059-1.28-.073-1.689-.073-4.948 0-3.259.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
                <span>Instagram</span>
              </a>

              <a
                href="https://www.tiktok.com/@yona.songs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-4 h-4 fill-current text-white"
                  viewBox="0 0 24 24"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 0 0 1 2.89-2.89c.3 0 .59.05.86.13v-3.5a6.37 6.37 0 0 0-.86-.06A6.34 6.34 0 0 0 3.15 15.7 6.34 6.34 0 0 0 9.49 22a6.34 6.34 0 0 0 6.34-6.34V9.05a8.3 8.3 0 0 0 4.88 1.56V7.17a4.83 4.83 0 0 1-1.12-.48z" />
                </svg>
                <span>TikTok</span>
              </a>

              <a
                href="https://t.me/yona_songs"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-300 transition-colors"
              >
                <Send className="w-4 h-4 text-sky-400 -rotate-12" />
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>

        {/* User Account & Bottom Email Sign-In + App Download Section - ONLY AT BOTTOM OF LIBRARY */}
        {activeTab === 'directory' && (
          <div className="space-y-3 pt-2">

            {/* User Account & Bottom Email Sign-In Section */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b from-[#0c1424] via-[#090f1a] to-[#070b14] border border-sky-400/25 shadow-lg space-y-3">

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-500/20 to-teal-500/10 border border-sky-400/35 flex items-center justify-center shrink-0 shadow-sm">
                    {isAuthenticated && user?.avatarIcon ? (
                      <span className="text-base">{user.avatarIcon}</span>
                    ) : (
                      <Mail className="w-4 h-4 text-sky-300" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm sm:text-base text-white font-tajawal">
                        {isAuthenticated && user
                          ? (user.displayName ||
                            user.email ||
                            (language === 'ar'
                              ? 'عضو يونا سونجز'
                              : 'Yona Member'))
                          : (language === 'ar'
                            ? 'تسجيل الدخول بالبريد الإلكتروني وإشعار الحساب'
                            : 'Email Sign In & Account Notification')}
                      </h4>

                      {isAuthenticated ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-200 font-bold text-[10px] border border-emerald-500/30 flex items-center gap-1 shadow-xs">
                          <ShieldCheck className="w-3 h-3 text-emerald-300" />
                          <span>
                            {language === 'ar'
                              ? 'حسابك مفعل وموثق'
                              : 'Active & Verified'}
                          </span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-200 font-bold text-[10px] border border-sky-400/25 flex items-center gap-1">
                          <BellRing className="w-3 h-3 text-sky-300" />
                          <span>
                            {language === 'ar'
                              ? 'يصلك إشعار بالبريد'
                              : 'Instant Email Alert'}
                          </span>
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] text-slate-300 mt-0.5">
                      {isAuthenticated
                        ? (language === 'ar'
                          ? `مسجل بالبريد: ${user?.email || 'عضو مميز'} • إشعارات الدخول وحفظ المفضلات والشهادات نشطة الآن`
                          : `Registered email: ${user?.email || 'Active member'} • Takes & certificates active`)
                        : (language === 'ar'
                          ? 'سجل ببريدك الإلكتروني ليصلك إشعار فوري في بريدك بأنه تم تسجيل دخولك بنجاح في صفحة يونا، وتفعيل حفظ الشهادات والأصوات.'
                          : 'Sign in with your email to receive an instant confirmation alert in your inbox and unlock all platform features.')}
                    </p>
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">

                    <button
                      type="button"
                      onClick={() => setShowNotificationModal(true)}
                      className="px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-sky-200 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-300" />
                      <span>
                        {language === 'ar' ? 'معاينة الرسالة' : 'View Email'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => openAuthModal({ defaultTab: 'email' })}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-sky-300" />
                      <span>
                        {language === 'ar' ? 'تفاصيل حسابي' : 'My Account'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={signOut}
                      className="px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-rose-300 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-300" />
                      <span>
                        {language === 'ar' ? 'خروج' : 'Sign Out'}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              {emailLoginFeedback && (
                <div className="p-2.5 rounded-xl bg-sky-950/90 border border-sky-400/50 text-sky-200 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span>{emailLoginFeedback}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNotificationModal(true)}
                    className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs flex items-center gap-1 transition-all cursor-pointer shrink-0"
                  >
                    <Eye className="w-3 h-3" />
                    <span>
                      {language === 'ar' ? 'فتح البريد' : 'Open Inbox'}
                    </span>
                  </button>
                </div>
              )}

              {!isAuthenticated && (
                <form
                  onSubmit={handleDirectEmailLogin}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-0.5"
                >
                  <div className="sm:col-span-5">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder={
                        language === 'ar'
                          ? 'اكتب بريدك الإلكتروني (مثال: nayef@gmail.com)...'
                          : 'Enter your email (e.g. nayef@gmail.com)...'
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-sky-400/35 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-sky-300 focus:ring-1 focus:ring-sky-300/20"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <input
                      type="text"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder={
                        language === 'ar'
                          ? 'اسمك أو لقبك الفني (مثال: نايف / شيخة)...'
                          : 'Your name (e.g. Nayef, Sheikha)...'
                      }
                      className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-white text-xs placeholder-slate-400 focus:outline-none focus:border-sky-300"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <button
                      type="submit"
                      disabled={isSubmittingLogin}
                      className="w-full h-full py-2 px-3 rounded-xl bg-gradient-to-r from-teal-400 to-sky-300 hover:from-teal-300 hover:to-sky-200 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                    >
                      <LogIn className="w-3.5 h-3.5 text-slate-950" />
                      <span>
                        {language === 'ar' ? 'دخول' : 'Sign In'}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* PWA App Download Card */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#0b1322] via-[#0e182b] to-[#0b1322] border border-sky-400/20 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0 shadow-sm">
                  <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-sky-300" />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm sm:text-base text-white font-tajawal">
                      {language === 'ar'
                        ? 'تحميل تطبيق YONA SONGS المعتمد'
                        : 'Download YONA SONGS App'}
                    </h4>

                    <span className="px-2 py-0.5 rounded-full bg-sky-400/15 text-sky-200 font-bold text-[10px] border border-sky-400/25">
                      {language === 'ar'
                        ? 'تطبيق مجاني'
                        : 'Free App'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {language === 'ar'
                      ? 'ثبّت التطبيق الآن على هاتفك الذكي أو حاسوبك لتجربة استماع سريعة وتصفح الشارات بدون إعلانات وبدون حاجة لفتح المتصفح في كل مرة.'
                      : 'Install the app on your smartphone or PC for fast access without browser tabs.'}
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto flex justify-end">
                <PWAInstallButton variant="hero" />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">

          <div>
            © {new Date().getFullYear()}{' '}
            <span className="text-slate-200 font-bold">
              YONA SONGS
            </span>
            . {t('footerCopyright')}.
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-400 flex-wrap justify-center">
            <span>v1.0.0</span>
            <span>•</span>

            <PWAInstallButton variant="compact" />

            <span>•</span>

            <a
              href="https://www.youtube.com/@yona_songs"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E5C07B] flex items-center gap-1"
            >
              <span>
                {language === 'ar'
                  ? 'القناة الرسمية'
                  : 'Official Channel'}
              </span>

              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Email Notification Viewer Modal */}
      <EmailNotificationViewerModal
        isOpen={showNotificationModal}
        onClose={() => setShowNotificationModal(false)}
        notificationData={lastNotificationPayload}
      />
    </footer>
  );
};