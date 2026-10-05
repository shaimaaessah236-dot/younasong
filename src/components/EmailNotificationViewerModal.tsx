import React, { useState } from 'react';
import { Mail, CheckCircle2, Copy, RefreshCw, X, ShieldCheck, ExternalLink, Eye, Code2, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface EmailNotificationViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  notificationData?: {
    notificationId?: string;
    recipient?: string;
    recipientName?: string;
    subject?: string;
    html?: string;
    text?: string;
    deliveredAt?: string;
  } | null;
}

export const EmailNotificationViewerModal: React.FC<EmailNotificationViewerModalProps> = ({
  isOpen,
  onClose,
  notificationData
}) => {
  const { user, signInWithEmail } = useAuth();
  const { language, isRtl } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code' | 'text'>('preview');
  const [isResending, setIsResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const recipientEmail = notificationData?.recipient || user?.email || 'nayef@gmail.com';
  const recipientName = notificationData?.recipientName || user?.displayName || 'عضو سبيستون';
  const notifId = notificationData?.notificationId || 'YONA-NOTIF-LIVE';
  const subject = notificationData?.subject || `🎵 إشعار تسجيل الدخول إلى منصة Yona Songs الرسمية (${recipientName})`;
  const htmlContent = notificationData?.html;

  const handleCopyId = () => {
    navigator.clipboard.writeText(notifId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResendNotification = async () => {
    if (!recipientEmail) return;
    setIsResending(true);
    setResendStatus(null);
    try {
      await signInWithEmail(recipientEmail, recipientName);
      setResendStatus(language === 'ar' ? 'تم إعادة إرسال الإشعار بنجاح! 📩' : 'Notification resent successfully! 📩');
    } catch (err: any) {
      setResendStatus(language === 'ar' ? 'تعذر إعادة الإرسال' : 'Resend failed');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#0d1527] via-[#090e1a] to-[#050812] border-2 border-sky-500/40 shadow-2xl p-5 sm:p-6 space-y-4 relative text-white ${
          isRtl ? 'text-right' : 'text-left'
        } max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-300 shrink-0 shadow-md">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black font-tajawal text-white flex items-center gap-2">
                <span>{language === 'ar' ? 'معاينة إشعار البريد الإلكتروني الترحيبي' : 'Welcome Email Notification Inbox'}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] border border-emerald-500/30">
                  {language === 'ar' ? 'مرسل ومؤكد' : 'Delivered'}
                </span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 font-mono">
                {recipientEmail} • #{notifId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Bar & Actions */}
        <div className="p-3 rounded-2xl bg-sky-950/70 border border-sky-400/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shrink-0">
          <div className="flex items-center gap-2 text-sky-200">
            <ShieldCheck className="w-4 h-4 text-sky-400 shrink-0" />
            <span>{language === 'ar' ? `المستلم: ${recipientName} (${recipientEmail})` : `Recipient: ${recipientName}`}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyId}
              className="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-[11px] flex items-center gap-1 transition-all cursor-pointer"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied') : (language === 'ar' ? 'نسخ رقم الإشعار' : 'Copy ID')}</span>
            </button>

            <button
              type="button"
              onClick={handleResendNotification}
              disabled={isResending}
              className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-extrabold text-[11px] flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
            >
              {isResending ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5 -rotate-12" />}
              <span>{language === 'ar' ? 'إعادة الإرسال 📩' : 'Resend Email'}</span>
            </button>
          </div>
        </div>

        {resendStatus && (
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-400/50 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{resendStatus}</span>
          </div>
        )}

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs font-bold shrink-0">
          <span className="text-slate-300 truncate max-w-[300px]">{subject}</span>
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-[11px]">
            <button
              type="button"
              onClick={() => setViewMode('preview')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'preview' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3 inline ml-1" />
              <span>{language === 'ar' ? 'عرض الرسالة' : 'Visual Email'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('code')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                viewMode === 'code' ? 'bg-sky-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3 h-3 inline ml-1" />
              <span>HTML</span>
            </button>
          </div>
        </div>

        {/* Email Body Viewer */}
        <div className="flex-1 overflow-y-auto min-h-[300px] rounded-2xl border border-white/10 bg-[#070a12] p-2">
          {viewMode === 'preview' && htmlContent ? (
            <iframe
              title="Email Preview"
              srcDoc={htmlContent}
              className="w-full h-full min-h-[360px] rounded-xl bg-[#070a12] border-0"
            />
          ) : viewMode === 'code' && htmlContent ? (
            <pre className="p-4 text-[11px] font-mono text-sky-300 leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
              {htmlContent}
            </pre>
          ) : (
            <div className="p-6 space-y-3 text-slate-200 text-xs leading-relaxed">
              <h4 className="font-bold text-sky-300 text-sm">{subject}</h4>
              <p>مرحباً بك يا {recipientName}!</p>
              <p>تم تسجيل دخولك بنجاح في منصة YONA SONGS.</p>
              <p className="font-mono text-slate-400">البريد الإلكتروني: {recipientEmail}</p>
              <p className="font-mono text-amber-300">رقم الإشعار: {notifId}</p>
              <p>نتمنى لك تجربة ممتعة معنا في عالم سبيستون والأنمي!</p>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-2 text-center text-[11px] text-slate-400 shrink-0">
          <span>{language === 'ar' ? 'تم توليد هذا البريد بواسطة خدمة إشعارات YONA SONGS الرسمية' : 'Generated by YONA SONGS Email Notification Service'}</span>
        </div>
      </div>
    </div>
  );
};
