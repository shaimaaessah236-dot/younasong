import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import {
  Download,
  Printer,
  Share2,
  X,
  Sparkles,
  Check,
  Edit3,
  Trophy,
  ShieldCheck,
  FileText,
  Crown,
  Sun,
  Moon,
  Palette
} from 'lucide-react';
import { QuizScoreReport } from '../lib/quizData';

// Authentic SVG Spacetoon Logo Component with Relaxing Emerald Orbit
export const SpacetoonOfficialLogo: React.FC<{ className?: string; width?: number; height?: number }> = ({
  className = '',
  width = 220,
  height = 100
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 240 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="st-globe" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#064E3B" />
        <stop offset="50%" stopColor="#022C22" />
        <stop offset="100%" stopColor="#011812" />
      </linearGradient>
      <linearGradient id="st-emerald" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#A7F3D0" />
        <stop offset="35%" stopColor="#34D399" />
        <stop offset="70%" stopColor="#10B981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
      <linearGradient id="st-ring-teal" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#14B8A6" />
        <stop offset="100%" stopColor="#06B6D4" />
      </linearGradient>
      <linearGradient id="st-ring-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#34D399" />
        <stop offset="100%" stopColor="#10B981" />
      </linearGradient>
      <filter id="st-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    {/* Outer Orbital Glow Ring (Teal & Cyan) */}
    <ellipse cx="120" cy="50" rx="102" ry="30" stroke="url(#st-ring-teal)" strokeWidth="3" opacity="0.9" transform="rotate(-10 120 50)" />
    {/* Middle Orbital Ring (Emerald Green) */}
    <ellipse cx="120" cy="50" rx="95" ry="24" stroke="url(#st-ring-emerald)" strokeWidth="2.5" opacity="0.95" transform="rotate(-10 120 50)" />
    {/* Inner Orbital Ring (Mint Green) */}
    <ellipse cx="120" cy="50" rx="88" ry="18" stroke="#6EE7B7" strokeWidth="2" opacity="0.85" transform="rotate(-10 120 50)" />

    {/* Central Space Planet Globe */}
    <circle cx="120" cy="50" r="30" fill="url(#st-globe)" stroke="#10B981" strokeWidth="2.5" />
    <circle cx="112" cy="40" r="3" fill="#6EE7B7" opacity="0.9" />
    <circle cx="132" cy="58" r="2.5" fill="#34D399" opacity="0.9" />
    <circle cx="106" cy="58" r="1.8" fill="#A7F3D0" opacity="0.85" />

    {/* Star on Globe */}
    <path d="M128 38 L130 42 L134 43 L131 46 L132 50 L128 47 L124 50 L125 46 L122 43 L126 42 Z" fill="#A7F3D0" />

    {/* Arabic Typography: سبيس تون */}
    <text
      x="120"
      y="57"
      textAnchor="middle"
      fill="url(#st-emerald)"
      fontSize="24"
      fontWeight="900"
      fontFamily="Tajawal, sans-serif"
      filter="url(#st-glow)"
    >
      سبيس تون
    </text>

    {/* Slogan Banner: قناة شباب المستقبل */}
    <rect x="46" y="80" width="148" height="20" rx="10" fill="#022C22" stroke="#10B981" strokeWidth="1.5" />
    <text
      x="120"
      y="94"
      textAnchor="middle"
      fill="#A7F3D0"
      fontSize="11"
      fontWeight="800"
      fontFamily="Tajawal, sans-serif"
    >
      قناة شباب المستقبل
    </text>

    {/* English Subtext: SPACETOON */}
    <text
      x="120"
      y="107"
      textAnchor="middle"
      fill="#94A3B8"
      fontSize="7.5"
      fontWeight="900"
      fontFamily="sans-serif"
      letterSpacing="3"
    >
      SPACETOON
    </text>
  </svg>
);

export type CertPalette = 'emerald' | 'turquoise' | 'lavender' | 'rose';

interface SpacetoonQuizCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  report?: QuizScoreReport | null;
  defaultParticipantName?: string;
}

export const SpacetoonQuizCertificateModal: React.FC<SpacetoonQuizCertificateModalProps> = ({
  isOpen,
  onClose,
  report,
  defaultParticipantName = 'بطل سبيستون'
}) => {
  const [recipientName, setRecipientName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('yona_quiz_cert_name') || defaultParticipantName;
    }
    return defaultParticipantName;
  });

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(recipientName);
  const [palette, setPalette] = useState<CertPalette>('emerald'); // Default: Emerald Green (Relaxing & Eye-Friendly)
  const [nameColorTheme, setNameColorTheme] = useState<'emerald' | 'mint' | 'pink' | 'cyan' | 'black'>('emerald');
  const [certTheme, setCertTheme] = useState<'light' | 'dark'>('light');
  const [copiedShare, setCopiedShare] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Safe Non-Zero Percentage & Metrics (Ensures it never displays 0%)
  const safePercentage = report && typeof report.percentage === 'number' && report.percentage > 0
    ? report.percentage
    : 100;
  const safeScore = report && typeof report.score === 'number' && report.score > 0
    ? report.score
    : 3000;
  const safeCorrect = report && typeof report.correctCount === 'number' && report.correctCount > 0
    ? report.correctCount
    : 30;
  const safeTotal = report && typeof report.totalCount === 'number' && report.totalCount > 0
    ? report.totalCount
    : 30;

  const todayStr = '28 سبتمبر 2026';

  const handleSaveName = () => {
    const trimmed = tempName.trim() || 'بطل كوينز سبيستون';
    setRecipientName(trimmed);
    setIsEditingName(false);
    try {
      localStorage.setItem('yona_quiz_cert_name', trimmed);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = ` حصلت رسمياً على شهادة فوز وتفوق بمسابقة كوينز سبيستون بنسبة ${safePercentage}% (المرحلة الثالثة والأخيرة) في منصة YONA SONGS!  هل تستطيع خوض التحدي ونيل الشهادة؟`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 3000);
    }
  };

  // Palette color definitions
  const paletteConfig = {
    emerald: {
      primary: '#059669', // Emerald 600
      primaryLight: '#10B981', // Emerald 500
      primaryDark: '#064E3B', // Emerald 900
      borderHex: '#059669',
      borderRingHex: 'rgba(5, 150, 105, 0.25)',
      badgeBg: 'bg-emerald-50 dark:bg-emerald-950/40',
      badgeBorder: 'border-emerald-300 dark:border-emerald-600/50',
      badgeText: 'text-emerald-900 dark:text-emerald-300',
      titleText: 'text-emerald-950 dark:text-emerald-200',
      subtitleText: 'text-emerald-700 dark:text-emerald-400',
      bannerBg: 'bg-emerald-100/80 dark:bg-emerald-900/30',
      bannerBorder: 'border-emerald-400 dark:border-emerald-500/40',
      bannerText: 'text-emerald-950 dark:text-emerald-200',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      sealGrad0: '#A7F3D0',
      sealGrad1: '#10B981',
      sealGrad2: '#047857',
    },
    turquoise: {
      primary: '#0D9488', // Teal 600
      primaryLight: '#14B8A6', // Teal 500
      primaryDark: '#134E4A', // Teal 900
      borderHex: '#0D9488',
      borderRingHex: 'rgba(13, 148, 136, 0.25)',
      badgeBg: 'bg-teal-50 dark:bg-teal-950/40',
      badgeBorder: 'border-teal-300 dark:border-teal-600/50',
      badgeText: 'text-teal-900 dark:text-teal-300',
      titleText: 'text-teal-950 dark:text-teal-200',
      subtitleText: 'text-teal-700 dark:text-teal-400',
      bannerBg: 'bg-teal-100/80 dark:bg-teal-900/30',
      bannerBorder: 'border-teal-400 dark:border-teal-500/40',
      bannerText: 'text-teal-950 dark:text-teal-200',
      iconColor: 'text-teal-600 dark:text-teal-400',
      sealGrad0: '#99F6E4',
      sealGrad1: '#14B8A6',
      sealGrad2: '#0F766E',
    },
    lavender: {
      primary: '#7C3AED', // Violet 600
      primaryLight: '#8B5CF6',
      primaryDark: '#4C1D95',
      borderHex: '#7C3AED',
      borderRingHex: 'rgba(124, 58, 237, 0.25)',
      badgeBg: 'bg-violet-50 dark:bg-violet-950/40',
      badgeBorder: 'border-violet-300 dark:border-violet-600/50',
      badgeText: 'text-violet-900 dark:text-violet-300',
      titleText: 'text-violet-950 dark:text-violet-200',
      subtitleText: 'text-violet-700 dark:text-violet-400',
      bannerBg: 'bg-violet-100/80 dark:bg-violet-900/30',
      bannerBorder: 'border-violet-400 dark:border-violet-500/40',
      bannerText: 'text-violet-950 dark:text-violet-200',
      iconColor: 'text-violet-600 dark:text-violet-400',
      sealGrad0: '#DDD6FE',
      sealGrad1: '#8B5CF6',
      sealGrad2: '#6D28D9',
    },
    rose: {
      primary: '#E11D48', // Rose 600
      primaryLight: '#F43F5E',
      primaryDark: '#881337',
      borderHex: '#E11D48',
      borderRingHex: 'rgba(225, 29, 72, 0.25)',
      badgeBg: 'bg-rose-50 dark:bg-rose-950/40',
      badgeBorder: 'border-rose-300 dark:border-rose-600/50',
      badgeText: 'text-rose-900 dark:text-rose-300',
      titleText: 'text-rose-950 dark:text-rose-200',
      subtitleText: 'text-rose-700 dark:text-rose-400',
      bannerBg: 'bg-rose-100/80 dark:bg-rose-900/30',
      bannerBorder: 'border-rose-400 dark:border-rose-500/40',
      bannerText: 'text-rose-950 dark:text-rose-200',
      iconColor: 'text-rose-600 dark:text-rose-400',
      sealGrad0: '#FECDD3',
      sealGrad1: '#F43F5E',
      sealGrad2: '#BE123C',
    }
  };

  const currentPal = paletteConfig[palette];

  // Helper: Build high resolution canvas for PDF / PNG download
  const buildCertificateCanvas = (): HTMLCanvasElement | null => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1130;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const isLight = certTheme === 'light';

    // 1. Background (Radiant Soft Pearl White or Calming Midnight Emerald)
    if (isLight) {
      const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1130);
      bgGrad.addColorStop(0, '#FFFFFF');
      bgGrad.addColorStop(0.5, '#F8FAF9');
      bgGrad.addColorStop(1, '#F0FDF4');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1600, 1130);
    } else {
      const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1130);
      bgGrad.addColorStop(0, '#041F18');
      bgGrad.addColorStop(0.5, '#021510');
      bgGrad.addColorStop(1, '#062B22');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1600, 1130);
    }

    // Gentle decorative background dots (Soft Mint/Emerald)
    for (let i = 0; i < 60; i++) {
      const sx = (i * 137) % 1560 + 20;
      const sy = (i * 97) % 1090 + 20;
      const sr = (i % 2) + 1;
      ctx.fillStyle = isLight ? 'rgba(16, 185, 129, 0.15)' : 'rgba(52, 211, 153, 0.25)';
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Outer Precision Borders (Relaxing Emerald Green & Teal)
    ctx.strokeStyle = currentPal.primary;
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1540, 1070);

    ctx.strokeStyle = isLight ? 'rgba(5, 150, 105, 0.45)' : 'rgba(52, 211, 153, 0.45)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(45, 45, 1510, 1040);

    ctx.strokeStyle = isLight ? 'rgba(5, 150, 105, 0.2)' : 'rgba(52, 211, 153, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(55, 55, 1490, 1020);

    // Corner Ornaments (Emerald)
    ctx.font = '24px serif';
    ctx.fillStyle = currentPal.primary;
    ctx.textAlign = 'left';
    ctx.fillText('╔═══════', 65, 85);
    ctx.fillText('╚═══════', 65, 1055);
    ctx.textAlign = 'right';
    ctx.fillText('═══════╗', 1535, 85);
    ctx.fillText('═══════╝', 1535, 1055);

    // 3. Header Titles
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';

    ctx.font = 'bold 22px Tajawal, Cairo, sans-serif';
    ctx.fillStyle = isLight ? currentPal.primaryDark : currentPal.primaryLight;
    ctx.fillText(' فائز بمسابقة كوينز سبيستون • منصة يونا سونغ (YONA SONGS)', 800, 120);

    ctx.font = '900 46px Tajawal, Cairo, sans-serif';
    ctx.fillStyle = isLight ? '#064E3B' : '#A7F3D0';
    ctx.fillText('شهادة فوز وتفوق بمسابقة كوينز سبيستون', 800, 185);

    ctx.direction = 'ltr';
    ctx.font = 'italic bold 17px serif';
    ctx.fillStyle = isLight ? currentPal.primary : '#6EE7B7';
    ctx.fillText('SPACETOON QUEENS VOCAL CONTEST • OFFICIAL WINNER DIPLOMA', 800, 220);

    // Planetary Belt Banner
    ctx.direction = 'rtl';
    ctx.font = 'bold 16px Tajawal, Cairo, sans-serif';
    ctx.fillStyle = isLight ? '#334155' : '#D1FAE5';
    ctx.fillText('كوكب زمردة • أكشن • مغامرات • رياضة • كوميديا • علوم • بون بون • تاريخ • أفلام • أبجد', 800, 255);

    // Divider
    ctx.strokeStyle = currentPal.primaryLight;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 275);
    ctx.lineTo(1250, 275);
    ctx.stroke();

    // 4. Awarding Statement
    ctx.font = 'normal 20px Cairo, Tajawal, sans-serif';
    ctx.fillStyle = isLight ? '#334155' : '#CBD5E1';
    ctx.fillText('تُشهد إدارة مسابقة كوينز سبيستون ومنصة YONA SONGS بأن البطل(ة) المتألق(ة):', 800, 325);

    // 5. Participant Singer / Recipient Name (Vibrant chosen color)
    let nameFill = isLight ? '#047857' : '#34D399'; // default emerald/mint
    if (nameColorTheme === 'emerald') {
      nameFill = isLight ? '#047857' : '#34D399';
    } else if (nameColorTheme === 'mint') {
      nameFill = isLight ? '#059669' : '#6EE7B7';
    } else if (nameColorTheme === 'pink') {
      nameFill = isLight ? '#BE185D' : '#FB7185';
    } else if (nameColorTheme === 'cyan') {
      nameFill = isLight ? '#0284C7' : '#38BDF8';
    } else if (nameColorTheme === 'black') {
      nameFill = isLight ? '#0F172A' : '#FFFFFF';
    }

    ctx.font = '900 60px Tajawal, Cairo, sans-serif';
    ctx.fillStyle = nameFill;
    ctx.shadowColor = isLight ? 'rgba(5, 150, 105, 0.15)' : 'rgba(52, 211, 153, 0.5)';
    ctx.shadowBlur = isLight ? 3 : 15;
    ctx.fillText(recipientName, 800, 415);
    ctx.shadowBlur = 0;

    // 6. Achievement Statement
    ctx.font = 'bold 22px Cairo, Tajawal, sans-serif';
    ctx.fillStyle = isLight ? '#1E293B' : '#E2E8F0';
    ctx.fillText(
      `قد اجتاز(ت) بنجاح واقتدار فائق كافة مراحل مسابقة «كوينز سبيستون» الثلاث بعد تجاوز المرحلة النهائية`,
      800,
      480
    );
    ctx.fillText(
      `وحقق(ت) في امتحان القمة الذهبي نسبة تفوق استثنائية بلغت ${safePercentage}% (${safeCorrect} من ${safeTotal} إجابات صحيحة)،`,
      800,
      525
    );
    ctx.font = 'bold 24px Tajawal, Cairo, sans-serif';
    ctx.fillStyle = isLight ? currentPal.primaryDark : currentPal.primaryLight;
    ctx.fillText(
      `ليُتوّج رسمياً وحصرياً بلقب: «أسطورة شارات سبيستون والعصر الذهبي» `,
      800,
      575
    );

    // 7. Performance Badges Box
    ctx.fillStyle = isLight ? '#FFFFFF' : 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = isLight ? '#A7F3D0' : 'rgba(52, 211, 153, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(360, 620, 880, 140, 20);
    } else {
      ctx.rect(360, 620, 880, 140);
    }
    ctx.fill();
    ctx.stroke();

    ctx.font = 'bold 18px Tajawal, sans-serif';
    ctx.fillStyle = isLight ? '#475569' : '#94A3B8';
    ctx.fillText('النسبة المحققة (شرط ≥ 93%)', 500, 665);
    ctx.fillText('مجموع النقاط المحرزة', 800, 665);
    ctx.fillText('المرحلة والتحدي', 1100, 665);

    ctx.font = 'bold 36px monospace';
    ctx.fillStyle = '#059669';
    ctx.fillText(`${safePercentage}%`, 500, 725);

    ctx.fillStyle = isLight ? '#065F46' : '#34D399';
    ctx.fillText(`${safeScore} نقطة`, 800, 725);

    ctx.font = 'bold 22px Tajawal, sans-serif';
    ctx.fillStyle = isLight ? currentPal.primary : currentPal.primaryLight;
    ctx.fillText('المرحلة الثالثة (النهائية) ', 1100, 720);

    // 8. Accreditation Notice
    ctx.font = 'bold 15px Cairo, sans-serif';
    ctx.fillStyle = isLight ? '#047857' : '#A7F3D0';
    ctx.fillText('وثيقة فوز معتمدة ومسجلة رسمياً بالسجل العام لمنصة YONA SONGS • صالحة للاعتراف والتوثيق', 800, 805);

    // 9. Signatures & Credentials Row
    ctx.textAlign = 'right';
    ctx.font = 'bold 16px Tajawal, sans-serif';
    ctx.fillStyle = isLight ? '#334155' : '#CBD5E1';
    ctx.fillText(`تاريخ الإصدار: ${todayStr}`, 1260, 870);
    ctx.font = 'bold 14px monospace';
    ctx.fillStyle = isLight ? '#64748B' : '#94A3B8';
    ctx.fillText(`ID: SP-QUEENS-${safeScore}-${safePercentage}-2026`, 1260, 902);

    ctx.textAlign = 'left';
    ctx.font = 'bold 16px Tajawal, sans-serif';
    ctx.fillStyle = isLight ? '#334155' : '#CBD5E1';
    ctx.fillText('المشرف العام ومجلس التحكيم:', 340, 870);
    ctx.font = 'bold 22px Tajawal, sans-serif';
    ctx.fillStyle = isLight ? '#064E3B' : '#34D399';
    ctx.fillText('يونا طلاس • YONA TLASS ', 340, 910);

    // 10. Emerald Royal Seal Stamp (Center)
    ctx.beginPath();
    ctx.arc(800, 890, 50, 0, Math.PI * 2);
    const sealGrad = ctx.createRadialGradient(800, 890, 10, 800, 890, 50);
    sealGrad.addColorStop(0, currentPal.sealGrad0);
    sealGrad.addColorStop(0.5, currentPal.sealGrad1);
    sealGrad.addColorStop(1, currentPal.sealGrad2);
    ctx.fillStyle = sealGrad;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 12px Cairo, sans-serif';
    ctx.fillStyle = '#022C22';
    ctx.fillText('ختم كوينز سبيستون', 800, 882);
    ctx.font = '900 11px monospace';
    ctx.fillText('QUEENS 2026', 800, 898);
    ctx.fillText('YONA SONGS', 800, 912);

    // Footer
    ctx.font = '13px monospace';
    ctx.fillStyle = isLight ? '#94A3B8' : '#64748B';
    ctx.fillText('SPACETOON QUEENS OFFICIAL REPOSITORY • YONA SONGS PLATFORM 2026', 800, 1060);

    return canvas;
  };

  // Direct PDF Download (A4 Landscape)
  const handleDownloadPdf = () => {
    setIsDownloading(true);
    try {
      const canvas = buildCertificateCanvas();
      if (!canvas) {
        setIsDownloading(false);
        window.print();
        return;
      }

      const cleanName = (recipientName || 'winner').replace(/[\s/\\?%*:|"<>]+/g, '_');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
      pdf.save(`شهادة_كوينز_سبيستون_${cleanName}_2026.pdf`);

      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error(err);
      setIsDownloading(false);
      window.print();
    }
  };

  // Direct PNG Download
  const handleDownloadPng = () => {
    setIsDownloading(true);
    try {
      const canvas = buildCertificateCanvas();
      if (!canvas) {
        setIsDownloading(false);
        return;
      }

      const cleanName = (recipientName || 'winner').replace(/[\s/\\?%*:|"<>]+/g, '_');
      const link = document.createElement('a');
      link.download = `شهادة_كوينز_سبيستون_${cleanName}_2026.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error(err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#081512] border-2 border-emerald-500/40 rounded-3xl shadow-[0_0_60px_rgba(16,185,129,0.25)] overflow-hidden my-auto">
        
        {/* Top Control Bar with Quick Actions */}
        <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-[#071713] to-teal-500/10 gap-2">
          
          <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs sm:text-sm">
            <Crown className="w-4 h-4 text-emerald-400" />
            <span className="font-tajawal">شهادة فوز مسابقة كوينز سبيستون • YONA SONGS </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            
            {/* Color Palette Switcher (Emerald, Turquoise, Lavender, Rose) */}
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-emerald-500/20">
              <Palette className="w-3.5 h-3.5 text-emerald-400 mr-1" />
              <button
                onClick={() => setPalette('emerald')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  palette === 'emerald'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="أخضر زمردي مريح للعين"
              >
                 أخضر
              </button>
              <button
                onClick={() => setPalette('turquoise')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  palette === 'turquoise'
                    ? 'bg-teal-600 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="فيروزي هادئ"
              >
                 فيروزي
              </button>
              <button
                onClick={() => setPalette('lavender')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  palette === 'lavender'
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="بنفسجي ملكي"
              >
                 بنفسجي
              </button>
              <button
                onClick={() => setPalette('rose')}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  palette === 'rose'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white'
                }`}
                title="وردي لطيف"
              >
                 وردي
              </button>
            </div>

            {/* Theme Toggle (Light / Dark) */}
            <button
              onClick={() => setCertTheme(certTheme === 'light' ? 'dark' : 'light')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                certTheme === 'light'
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-300 shadow-sm'
                  : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'
              }`}
              title="التبديل بين النمط المشرق الأنيق والنمط الليلي"
            >
              {certTheme === 'light' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">نمط مشرق</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">نمط ليلي</span>
                </>
              )}
            </button>

            {/* Edit Name Button */}
            <button
              onClick={() => setIsEditingName(!isEditingName)}
              className="px-3 py-1.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-200 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="تعديل اسمك ولون الخط"
            >
              <Edit3 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline font-tajawal">تعديل الاسم واللون </span>
            </button>

            {/* PDF Download Button (Emerald Green Gradient) */}
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 hover:from-emerald-400 text-white font-black text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer font-tajawal shadow-emerald-900/40"
              title="تحميل الشهادة بصيغة PDF مباشرة"
            >
              <FileText className="w-3.5 h-3.5 text-white" />
              <span>{isDownloading ? 'جاري التحضير...' : 'تحميل (PDF) '}</span>
            </button>

            {/* PNG Download Button */}
            <button
              onClick={handleDownloadPng}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 transition-all border border-white/10 cursor-pointer font-tajawal"
              title="تحميل الشهادة كصورة PNG عالية الدقة"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">تحميل PNG </span>
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer border border-white/10"
              title="طباعة الشهادة"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-rose-600/80 text-gray-400 hover:text-white transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Inline Name & Color Customizer Drawer */}
        {isEditingName && (
          <div className="p-4 bg-[#0a1f18] border-b border-emerald-500/30 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-300 block font-tajawal">
                 اكتب اسمك واختر لون الخط كما تريده أن يظهر على الشهادة:
              </label>
              <button
                onClick={() => setIsEditingName(false)}
                className="text-gray-400 hover:text-white text-xs px-2 py-0.5 rounded bg-white/5 cursor-pointer"
              >
                
              </button>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="اسمك الكامل أو اللقب الفني..."
                className="flex-1 w-full bg-black/60 border border-emerald-400/40 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-400 font-tajawal"
              />
              <button
                onClick={handleSaveName}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 font-tajawal shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>حفظ واعتماد</span>
              </button>
            </div>

            {/* Name Color Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-gray-300 font-bold"> اختر لون الاسم:</span>
              
              <button
                type="button"
                onClick={() => setNameColorTheme('emerald')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  nameColorTheme === 'emerald'
                    ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 ring-2 ring-emerald-400/50'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                 أخضر زمردي فاخر
              </button>

              <button
                type="button"
                onClick={() => setNameColorTheme('mint')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  nameColorTheme === 'mint'
                    ? 'bg-teal-500/30 text-teal-300 border-teal-400 ring-2 ring-teal-400/50'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                 نعناعي بارد (Cool Mint)
              </button>

              <button
                type="button"
                onClick={() => setNameColorTheme('pink')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  nameColorTheme === 'pink'
                    ? 'bg-pink-500/30 text-pink-300 border-pink-400 ring-2 ring-pink-400/50'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                 وردي متألق (Radiant Pink)
              </button>

              <button
                type="button"
                onClick={() => setNameColorTheme('cyan')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  nameColorTheme === 'cyan'
                    ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 ring-2 ring-cyan-400/50'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                 أزرق سماوي (Sky Cyan)
              </button>

              <button
                type="button"
                onClick={() => setNameColorTheme('black')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  nameColorTheme === 'black'
                    ? 'bg-white/20 text-white border-white ring-2 ring-white/50'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
              >
                 أسود فاحم فاخر
              </button>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* PRINTABLE SPACETOON QUEENS CERTIFICATE CANVAS CONTAINER           */}
        {/* ================================================================ */}
        <div className="p-3 sm:p-7 flex justify-center items-center bg-[#05110d]">
          <div
            ref={certRef}
            id="spacetoon-quiz-certificate-print"
            style={{
              borderColor: currentPal.borderHex,
            }}
            className={`relative w-full max-w-3xl aspect-[1.414/1] rounded-3xl p-5 sm:p-8 text-center flex flex-col justify-between shadow-2xl overflow-hidden border-4 select-none transition-all duration-300 ${
              certTheme === 'light'
                ? 'bg-[#FFFFFF] text-slate-900 shadow-xl'
                : 'bg-gradient-to-br from-[#061e17] via-[#03130e] to-[#07241b] text-white ring-8 ring-emerald-500/20 ring-offset-4 ring-offset-black'
            }`}
          >
            {/* Subtle Guilloche & Luxury Vignette */}
            <div className="absolute -top-28 -right-28 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Classical Emerald Corners */}
            <div className={`absolute top-2 right-3 pointer-events-none text-xl sm:text-2xl font-serif ${certTheme === 'light' ? 'text-emerald-700' : 'text-emerald-400/80'}`}>
              ╔═══════
            </div>
            <div className={`absolute top-2 left-3 pointer-events-none text-xl sm:text-2xl font-serif ${certTheme === 'light' ? 'text-emerald-700' : 'text-emerald-400/80'}`}>
              ═══════╗
            </div>
            <div className={`absolute bottom-2 right-3 pointer-events-none text-xl sm:text-2xl font-serif ${certTheme === 'light' ? 'text-emerald-700' : 'text-emerald-400/80'}`}>
              ╚═══════
            </div>
            <div className={`absolute bottom-2 left-3 pointer-events-none text-xl sm:text-2xl font-serif ${certTheme === 'light' ? 'text-emerald-700' : 'text-emerald-400/80'}`}>
              ═══════╝
            </div>

            {/* 1. Header with Uploaded YONA Anime Logo */}
            <div className={`space-y-1 pt-1 border-b-2 pb-2.5 ${certTheme === 'light' ? 'border-emerald-200' : 'border-emerald-500/30'}`}>
              <div className="flex items-center justify-center gap-3">
                <img
                  src="/images/yona_queens_logo.jpg"
                  alt="YONA Queens Logo"
                  className="h-14 sm:h-18 w-auto object-contain rounded-2xl shadow-md border-2 border-emerald-400/50 bg-white/10 p-0.5"
                />
                <div className="text-center sm:text-right">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide ${
                    certTheme === 'light'
                      ? 'bg-emerald-50 border border-emerald-400 text-emerald-950 shadow-sm'
                      : 'bg-emerald-500/15 border border-emerald-400/50 text-emerald-300'
                  }`}>
                    <Crown className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>فائز بمسابقة كوينز سبيستون • منصة يونا سونغ (YONA SONGS)</span>
                  </div>
                  <h2 className={`text-lg sm:text-2xl font-black font-tajawal tracking-wide mt-0.5 ${
                    certTheme === 'light'
                      ? 'text-emerald-950 font-black'
                      : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-emerald-400 to-teal-300'
                  }`}>
                    شهادة فوز وتفوق بمسابقة كوينز سبيستون
                  </h2>
                  <p className={`text-[9px] sm:text-[10px] font-serif italic tracking-widest uppercase font-bold ${
                    certTheme === 'light' ? 'text-emerald-800' : 'text-emerald-300/90'
                  }`} dir="ltr">
                    SPACETOON QUEENS VOCAL CONTEST • OFFICIAL WINNER DIPLOMA
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Recipient Section */}
            <div className="space-y-2 my-auto py-1">
              <p className={`text-xs sm:text-sm font-tajawal font-medium ${certTheme === 'light' ? 'text-slate-700' : 'text-gray-300'}`}>
                تُشهد إدارة مسابقة كوينز سبيستون ومنصة YONA SONGS بأن البطل(ة) المتألق(ة):
              </p>

              {/* Participant Name in Custom Color */}
              <div className="relative inline-block py-0.5">
                <span className={`text-2xl sm:text-4xl font-black font-tajawal tracking-wider px-6 py-1 rounded-2xl inline-block ${
                  nameColorTheme === 'emerald'
                    ? certTheme === 'light'
                      ? 'text-emerald-800 font-black drop-shadow-[0_1px_2px_rgba(4,120,87,0.25)]'
                      : 'text-emerald-400 drop-shadow-[0_2px_15px_rgba(52,211,153,0.5)]'
                    : nameColorTheme === 'mint'
                    ? certTheme === 'light'
                      ? 'text-teal-700 font-black drop-shadow-[0_1px_2px_rgba(13,148,136,0.25)]'
                      : 'text-teal-300 drop-shadow-[0_2px_15px_rgba(45,212,191,0.5)]'
                    : nameColorTheme === 'pink'
                    ? certTheme === 'light'
                      ? 'text-pink-700 font-black drop-shadow-[0_1px_2px_rgba(190,24,93,0.25)]'
                      : 'text-pink-400 drop-shadow-[0_2px_15px_rgba(244,63,94,0.5)]'
                    : nameColorTheme === 'cyan'
                    ? certTheme === 'light'
                      ? 'text-cyan-700 font-black drop-shadow-[0_1px_2px_rgba(2,132,199,0.25)]'
                      : 'text-cyan-400 drop-shadow-[0_2px_15px_rgba(56,189,248,0.5)]'
                    : certTheme === 'light'
                    ? 'text-slate-950 font-black'
                    : 'text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.4)]'
                }`}>
                  {recipientName}
                </span>
                <Sparkles className="w-5 h-5 text-emerald-500 absolute -top-2 -right-5 animate-pulse" />
              </div>

              <p className={`text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-tajawal ${certTheme === 'light' ? 'text-slate-800' : 'text-gray-200'}`}>
                قد أتم(ت) بنجاح واقتدار فائق كافة مراحل مسابقة «كوينز سبيستون» الثلاث بعد اجتياز المرحلة النهائية، وحقق(ت) في
                امتحان القمة نسبة تفوق استثنائية بلغت{' '}
                <span className="text-emerald-600 dark:text-emerald-400 font-black font-mono text-base sm:text-lg">
                  {safePercentage}%
                </span>{' '}
                تجاوزت بها شرط الـ 93% بجدارة، ليتوّج رسمياً وحصرياً بلقب:
              </p>

              {/* Title Banner (Relaxing Green) */}
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-400/60 text-emerald-950 dark:text-emerald-200 font-black text-xs sm:text-sm font-tajawal shadow-sm">
                <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span> أسطورة شارات سبيستون والعصر الذهبي</span>
              </div>
            </div>

            {/* 3. Performance Summary Badges */}
            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto py-1">
              <div className={`p-2 rounded-xl text-center border ${
                certTheme === 'light' ? 'bg-[#F4FBF7] border-emerald-200 shadow-sm' : 'bg-white/5 border-emerald-500/20'
              }`}>
                <span className={`text-[10px] block font-tajawal font-bold ${certTheme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>النسبة النهائية</span>
                <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {safePercentage}%
                </span>
              </div>
              <div className={`p-2 rounded-xl text-center border ${
                certTheme === 'light' ? 'bg-[#F4FBF7] border-emerald-200 shadow-sm' : 'bg-white/5 border-emerald-500/20'
              }`}>
                <span className={`text-[10px] block font-tajawal font-bold ${certTheme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>النقاط المحرزة</span>
                <span className={`text-sm sm:text-base font-black font-mono ${certTheme === 'light' ? 'text-emerald-900 font-black' : 'text-emerald-300'}`}>
                  {safeScore}
                </span>
              </div>
              <div className={`p-2 rounded-xl text-center border ${
                certTheme === 'light' ? 'bg-[#F4FBF7] border-emerald-200 shadow-sm' : 'bg-white/5 border-emerald-500/20'
              }`}>
                <span className={`text-[10px] block font-tajawal font-bold ${certTheme === 'light' ? 'text-slate-600' : 'text-gray-400'}`}>المرحلة المنجزة</span>
                <span className={`text-xs sm:text-sm font-black font-tajawal ${certTheme === 'light' ? 'text-teal-900 font-black' : 'text-teal-300'}`}>
                  المرحلة 3 (النهائية) 
                </span>
              </div>
            </div>

            {/* 4. Footer Credentials & Signature */}
            <div className={`flex items-center justify-between text-right border-t pt-2 text-[10px] sm:text-xs px-2 ${
              certTheme === 'light' ? 'border-emerald-200 text-slate-600' : 'border-emerald-500/20 text-gray-400'
            }`}>
              <div>
                <span className={`block font-bold font-tajawal ${certTheme === 'light' ? 'text-slate-800' : 'text-gray-300'}`}>
                  تاريخ الإنجاز: {todayStr}
                </span>
                <span className="block text-[9px] font-mono text-gray-500">
                  ID: SP-QUEENS-{safeScore}-{safePercentage}-2026
                </span>
              </div>

              {/* Official Seal Badge */}
              <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-black text-[11px] font-tajawal">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>معتمد رسمياً • منصة يونا سونغ YONA SONGS </span>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Action Footer */}
        <div className="flex items-center justify-between p-4 bg-white/5 border-t border-emerald-500/20 flex-wrap gap-2">
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer font-tajawal"
          >
            <Share2 className="w-4 h-4 text-emerald-400" />
            <span>{copiedShare ? 'تم نسخ الرابط والمعلومات! ' : 'مشاركة إنجاز شهادة كوينز سبيستون '}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black text-xs transition-colors cursor-pointer font-tajawal shadow-md shadow-emerald-900/30"
          >
            العودة للمنصة والمسابقة
          </button>
        </div>

      </div>
    </div>
  );
};
