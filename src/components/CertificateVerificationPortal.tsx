import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Calendar,
  MapPin,
  Music,
  ExternalLink,
  Printer,
  Copy,
  Check,
  Share2,
  Sparkles,
  QrCode,
  FileText,
  UserCheck
} from 'lucide-react';

export interface VerificationData {
  certId: string;
  name: string;
  score: number;
  song: string;
  date: string;
  country: string;
  hash: string;
}

interface CertificateVerificationPortalProps {
  isOpen: boolean;
  onClose: () => void;
  data: VerificationData;
  onOpenFullCertificate: () => void;
}

export const CertificateVerificationPortal: React.FC<CertificateVerificationPortalProps> = ({
  isOpen,
  onClose,
  data,
  onOpenFullCertificate
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(data.certId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl my-auto bg-gradient-to-b from-[#111728] via-[#0c1220] to-[#080d18] border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-7 shadow-2xl text-right space-y-5 animate-in zoom-in-95 duration-200">
        
        {/* Verification Status Banner */}
        <div className="flex items-start justify-between border-b border-emerald-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/20 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                  سجل التوثيق الأكاديمي الرقمي 
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  VERIFIED ACCREDITATION
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-1">
                شهادة أداء صوتي معتمدة ورسمية 
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer transition-all"
            title="إغلاق"
          >
            
          </button>
        </div>

        {/* Verification Guarantee Message */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong>تم التحقق بنجاح من صحة الوثيقة:</strong> تم فحص هذا الكود الرقمي ومطابقته بالسجل العام لأكاديمية فنون الأداء الصوتي وسبيستون (منصة YONA SONGS). هذه الشهادة أصلية ومعتمدة ومصادق عليها من المشرف العام ومجلس التحكيم، وصالحة للاستخدام الأكاديمي والمهني.
          </p>
        </div>

        {/* Official Credential Information Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-black/50 border border-white/10 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Recipient Full Name */}
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 font-bold block flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>اسم الحائز على الشهادة (المتسابق):</span>
              </span>
              <div className="text-base sm:text-lg font-black text-amber-300">
                {data.name || 'مشارك متميز'}
              </div>
            </div>

            {/* Country / City */}
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 font-bold block flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>الدولة والاعتماد الإقليمي:</span>
              </span>
              <div className="text-sm sm:text-base font-bold text-white">
                {data.country || 'الوطن العربي '}
              </div>
            </div>

            {/* Performed Work */}
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 font-bold block flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                <span>العمل الصوتي المعتمد:</span>
              </span>
              <div className="text-sm sm:text-base font-bold text-amber-200">
                {data.song || 'أداء صوتي حر'}
              </div>
            </div>

            {/* Performance Score */}
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 font-bold block flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>التقييم والدرجة الصوتية:</span>
              </span>
              <div className="text-base sm:text-lg font-black font-mono text-emerald-400 flex items-center gap-2">
                <span>{data.score}%</span>
                <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300">
                  {data.score >= 95 ? ' مرتبة الشرف والامتياز' : ' تقدير فائق'}
                </span>
              </div>
            </div>

            {/* Date of Issue */}
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 font-bold block flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>تاريخ الأداء والمنح الرسمي:</span>
              </span>
              <div className="text-sm sm:text-base font-mono font-bold text-white">
                {data.date || '28 سبتمبر 2026'}
              </div>
            </div>

            {/* Signatory / Issuer */}
            <div className="space-y-1">
              <span className="text-[11px] text-gray-400 font-bold block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>جهة الإصدار والاعتماد:</span>
              </span>
              <div className="text-xs sm:text-sm font-bold text-gray-200">
                أكاديمية الأصوات والغناء • بإشراف: يونا طلاس
              </div>
            </div>

          </div>

          {/* Certificate Identification & Hash */}
          <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="space-y-1 w-full sm:w-auto">
              <span className="text-[10px] text-gray-400 block font-mono">رقم الوثيقة المعتمد (Certificate ID):</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-amber-300 text-sm bg-black/60 px-3 py-1 rounded-lg border border-amber-400/30">
                  {data.certId}
                </span>
                <button
                  onClick={handleCopyId}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer transition-all"
                  title="نسخ الرقم"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="text-left w-full sm:w-auto font-mono text-[10px] text-gray-500">
              <span>HASH: {data.hash || '0x8A9BF2E9A1'}</span>
              <span className="block text-gray-400">ACADEMIC LEVEL • VOCAL MASTER</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          
          <button
            onClick={onOpenFullCertificate}
            className="flex-1 min-w-[200px] px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-amber-400/25 transition-all hover:scale-105"
          >
            <Printer className="w-4 h-4 text-black" />
            <span>استعراض وطباعة الشهادة الكاملة (PDF / PNG) </span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all border border-white/10"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
            <span>{copiedLink ? 'تم نسخ الرابط! ' : 'نسخ رابط التحقق '}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium text-xs cursor-pointer transition-all"
          >
            إغلاق
          </button>

        </div>

      </div>
    </div>
  );
};
