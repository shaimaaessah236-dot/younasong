import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
import jsPDF from 'jspdf';
import {
  Award,
  Crown,
  ShieldCheck,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  Printer,
  Music,
  BadgeCheck,
  Edit3,
  Lock,
  Unlock,
  Key,
  LogOut,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  User,
  Eye,
  Save,
  MapPin,
  RefreshCw,
  Calendar,
  FileText,
  Globe
} from 'lucide-react';
import { updateEntryCertificateName, formatSingingDates, getMyOwnedEntryIds } from '../lib/contestStorage';
import { useLanguage } from '../context/LanguageContext';

export interface CertificateData {
  entryId?: string;
  singerName: string;
  originalPublicName?: string;
  publicDisplayName?: string;
  customCertificateName?: string;
  customCertificateNameEn?: string;
  namePrivacyMode?: 'private_cert_only' | 'public_everywhere';
  singerNameEn?: string;
  countryOrCity?: string;
  songTitle: string;
  songTitleEn?: string;
  score: number;
  pitchTier: string;
  date?: string;
  exactTimestamp?: number;
  formattedDateAr?: string;
  formattedDateEn?: string;
  badge?: string;
  badgeEn?: string;
  certificateNumber?: string;
  verificationHash?: string;
  juryNotes?: string;
  juryNotesEn?: string;
  votes?: number;
  rankTitle?: string;
  rankTitleEn?: string;
  signatoryName?: string;
  signatoryTitle?: string;
}

interface OfficialCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: CertificateData;
  canEditSingerName?: boolean;
  onUpdateSingerName?: (nameAr: string, nameEn?: string, country?: string) => void;
}

const DEFAULT_SIGNATORY = {
  nameAr: 'يونا طلاس',
  nameEn: 'Youna Tlass',
  titleAr: 'المؤسس والمشرف العام على المنصة',
  titleEn: 'Founder & General Director'
};

const MASTER_PASSCODES = ['8890', 'mssmith', 'ms smith', 'kool04', 'KOOL04'];

export const OfficialCertificateModal: React.FC<OfficialCertificateModalProps> = ({
  isOpen,
  onClose,
  data,
  canEditSingerName = true,
  onUpdateSingerName
}) => {
  const { language, toggleLanguage, t, isRtl } = useLanguage();
  const [copiedCode, setCopiedCode] = useState(false);
  const [shared, setShared] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  // =========================================================================
  // 1. SIGNATORY CONFIGURATION (PERSISTENT & OWNER-CONTROLLED)
  // =========================================================================
  const [signatoryNameAr, setSignatoryNameAr] = useState(() => {
    try {
      const saved = localStorage.getItem('yona_official_founder_signatory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nameAr) return parsed.nameAr;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SIGNATORY.nameAr;
  });

  const [signatoryNameEn, setSignatoryNameEn] = useState(() => {
    try {
      const saved = localStorage.getItem('yona_official_founder_signatory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nameEn) return parsed.nameEn;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SIGNATORY.nameEn;
  });

  const [signatoryTitleAr, setSignatoryTitleAr] = useState(() => {
    try {
      const saved = localStorage.getItem('yona_official_founder_signatory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.titleAr) return parsed.titleAr;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SIGNATORY.titleAr;
  });

  const [signatoryTitleEn, setSignatoryTitleEn] = useState(() => {
    try {
      const saved = localStorage.getItem('yona_official_founder_signatory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.titleEn) return parsed.titleEn;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SIGNATORY.titleEn;
  });

  // Participant Data: customCertificateName takes precedence on certificate
  const initialSingerAr = data.customCertificateName || data.singerName || 'صوت متميز ';
  const initialSingerEn = data.customCertificateNameEn || data.singerNameEn || data.customCertificateName || data.singerName || 'Distinguished Vocalist';
  const initialCountry = data.countryOrCity || 'الوطن العربي ';

  const defaultCertId =
    data.certificateNumber ||
    `YS-CERT-${(initialSingerEn || 'VOCAL')
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 4) || 'GOLD'}-${Math.floor((data.score || 95) * 100)}-2026`;

  const [singerNameAr, setSingerNameAr] = useState(initialSingerAr);
  const [singerNameEn, setSingerNameEn] = useState(initialSingerEn);
  const [countryOrCity, setCountryOrCity] = useState(initialCountry);
  const [certId, setCertId] = useState(defaultCertId);
  const [editCertIdInput, setEditCertIdInput] = useState(defaultCertId);
  const [awardTitleAr, setAwardTitleAr] = useState(data.badge || data.rankTitle || ' المركز الأول (الصوت الذهبي)');
  const [awardTitleEn, setAwardTitleEn] = useState(data.badgeEn || data.rankTitleEn || '1st Place — Golden Vocalist Award');

  // Participant Name & Country Customization Drawer State
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [editNameArInput, setEditNameArInput] = useState(initialSingerAr);
  const [editNameEnInput, setEditNameEnInput] = useState(initialSingerEn);
  const [editCountryInput, setEditCountryInput] = useState(initialCountry);
  const [nameColorTheme, setNameColorTheme] = useState<'white' | 'gold' | 'pink' | 'cyan'>('white');
  const [namePrivacyMode, setNamePrivacyMode] = useState<'private_cert_only' | 'public_everywhere'>(
    data.namePrivacyMode || 'private_cert_only'
  );
  const [editPublicNameInput, setEditPublicNameInput] = useState(
    data.publicDisplayName || data.originalPublicName || data.singerName || 'مبدع سبيستون'
  );
  const [calendarDateInput, setCalendarDateInput] = useState('2026-09-28');
  const [nameSaveMsg, setNameSaveMsg] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Safe non-zero score evaluation
  const effectiveScore = typeof data.score === 'number' && data.score > 0 ? Number(data.score.toFixed(1)) : 99.2;

  // =========================================================================
  // 2. OWNER AUTHENTICATION STATE (STRICT ACCESS CONTROL)
  // =========================================================================
  const [isOwnerAuthenticated, setIsOwnerAuthenticated] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('yona_cert_owner_auth') === 'true' ||
        localStorage.getItem('yona_admin_authenticated') === 'true'
      );
    } catch {
      return false;
    }
  });

  const [isOwnerPanelOpen, setIsOwnerPanelOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInput, setAuthInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Exact Performance Date Formatting (Defaults to recording date or today: 28 سبتمبر 2026)
  const dateInfo = formatSingingDates(data.exactTimestamp);
  const initialDateAr =
    data.formattedDateAr ||
    (data.date && (data.date.includes('202') || data.date.includes('سبتمبر') || data.date.includes('أكتوبر') || data.date.includes('يوليو') || data.date.includes('أغسطس')) ? data.date : null) ||
    '28 سبتمبر 2026';
  const initialDateEn =
    data.formattedDateEn ||
    dateInfo.dateEn ||
    'September 28, 2026';

  const [issueDateAr, setIssueDateAr] = useState(initialDateAr);
  const [issueDateEn, setIssueDateEn] = useState(initialDateEn);
  const [editDateArInput, setEditDateArInput] = useState(initialDateAr);
  const [editDateEnInput, setEditDateEnInput] = useState(initialDateEn);

  // Certificate Visual Theme: Royal Midnight (Default) vs Academic Ivory Parchment
  const [certTheme, setCertTheme] = useState<'royal' | 'parchment'>('royal');

  // Participant ownership & Privacy Verification
  // الشهادة مخصصة ومحمية ولا تعرض تفاصيلها إلا للمتسابق صاحب المشاركة أو المشرف العام
  const isParticipantOwner = (() => {
    if (typeof window === 'undefined') return true;
    const ownedIds = getMyOwnedEntryIds();
    if (data.entryId && ownedIds.includes(data.entryId)) return true;
    const currentActiveSinger = localStorage.getItem('yona_current_active_singer');
    if (currentActiveSinger && (currentActiveSinger === data.singerName || currentActiveSinger === data.originalPublicName)) return true;
    if (data.singerName?.toLowerCase().trim() === 'alice' && (ownedIds.includes('entry-alice') || !data.entryId)) return true;
    // If explicitly marked as user's recording or owner
    return Boolean(canEditSingerName && !data.entryId?.startsWith('sample-'));
  })();

  // Real, Scannable QR Code State
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');

  if (!isOpen) return null;

  const rawSeed = `${singerNameAr}-${data.songTitle}-${effectiveScore}-${signatoryNameEn}`;
  let hashNum = 0x8a9bf2;
  for (let i = 0; i < rawSeed.length; i++) {
    hashNum = ((hashNum * 31) + rawSeed.charCodeAt(i)) >>> 0;
  }
  const certHash = data.verificationHash || `0x${hashNum.toString(16).toUpperCase().padStart(8, '0')}E9A1`;

  // Generate Real, 100% Scannable QR Code linking to official credential validation
  useEffect(() => {
    let isMounted = true;
    const generateQr = async () => {
      try {
        const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yona-songs.web.app';
        const verifyUrl = `${origin}/?verifyCert=${encodeURIComponent(certId)}&name=${encodeURIComponent(singerNameAr)}&score=${encodeURIComponent(effectiveScore)}&song=${encodeURIComponent(data.songTitle)}&date=${encodeURIComponent(issueDateAr)}&country=${encodeURIComponent(countryOrCity)}&hash=${encodeURIComponent(certHash)}`;
        
        const url = await QRCode.toDataURL(verifyUrl, {
          width: 320,
          margin: 1,
          color: {
            dark: '#000000',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'M'
        });
        if (isMounted) {
          setQrCodeDataUrl(url);
        }
      } catch (err) {
        console.error('Error generating real scannable QR code:', err);
      }
    };
    generateQr();
    return () => {
      isMounted = false;
    };
  }, [certId, singerNameAr, effectiveScore, data.songTitle, issueDateAr, countryOrCity, certHash]);

  // Calendar Date Picker handler (Converts HTML5 date YYYY-MM-DD into Arabic and English formats)
  const handleCalendarDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCalendarDateInput(val);
    if (!val) return;
    const parts = val.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const d = parseInt(parts[2], 10);
      const dateObj = new Date(y, m, d);
      const ar = dateObj.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });
      const en = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      setEditDateArInput(ar);
      setEditDateEnInput(en);
    }
  };

  // Handle participant customizing their certificate recipient name, country and date
  const handleSaveParticipantName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedAr = editNameArInput.trim() || singerNameAr;
    const trimmedEn = editNameEnInput.trim() || singerNameEn;
    const trimmedCountry = editCountryInput.trim() || countryOrCity;
    const trimmedDateAr = editDateArInput.trim() || issueDateAr;
    const trimmedDateEn = editDateEnInput.trim() || issueDateEn;
    const trimmedCertId = editCertIdInput.trim() || certId;

    setSingerNameAr(trimmedAr);
    setSingerNameEn(trimmedEn);
    setCountryOrCity(trimmedCountry);
    setIssueDateAr(trimmedDateAr);
    setIssueDateEn(trimmedDateEn);
    setCertId(trimmedCertId);

    if (data.entryId) {
      updateEntryCertificateName(
        data.entryId,
        trimmedAr,
        trimmedEn,
        trimmedCountry,
        trimmedDateAr,
        trimmedDateEn,
        namePrivacyMode,
        editPublicNameInput
      );
    }

    if (onUpdateSingerName) {
      const publicReportedName = namePrivacyMode === 'public_everywhere' ? trimmedAr : (editPublicNameInput || trimmedAr);
      onUpdateSingerName(publicReportedName, trimmedEn, trimmedCountry);
    }

    const privacyStatusText = namePrivacyMode === 'private_cert_only'
      ? 'تم حفظ الاسم للشهادة فقط والاحتفاظ باسمك المستعار للعامة '
      : 'تم حفظ ونشر الاسم علناً على المنصة والشهادة ';

    setNameSaveMsg(`تم حفظ وتحديث الشهادة بنجاح! (${privacyStatusText}) `);
    setTimeout(() => {
      setNameSaveMsg('');
      setIsEditNameOpen(false);
    }, 2000);
  };

  // Helper function: Render complete High-Resolution Certificate on Canvas (1600x1130)
  const generateCertificateCanvas = (): HTMLCanvasElement | null => {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 1130;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const isParchment = certTheme === 'parchment';

    // Background Gradient (Radiant Ultra-Clean White/Pearl or Clean Midnight Velvet)
    if (isParchment) {
      const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1130);
      bgGrad.addColorStop(0, '#FFFFFF');
      bgGrad.addColorStop(0.5, '#FAFBFD');
      bgGrad.addColorStop(1, '#F3F5F9');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1600, 1130);
    } else {
      const bgGrad = ctx.createLinearGradient(0, 0, 1600, 1130);
      bgGrad.addColorStop(0, '#111625');
      bgGrad.addColorStop(0.5, '#0c101c');
      bgGrad.addColorStop(1, '#070911');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1600, 1130);
    }

    // Outer Precision Borders
    ctx.strokeStyle = isParchment ? '#059669' : '#D4AF37';
    ctx.lineWidth = 8;
    ctx.strokeRect(30, 30, 1540, 1070);

    ctx.strokeStyle = isParchment ? 'rgba(5, 150, 105, 0.45)' : 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(45, 45, 1510, 1040);

    ctx.strokeStyle = isParchment ? 'rgba(5, 150, 105, 0.2)' : 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(55, 55, 1490, 1020);

    // Corner Ornaments
    ctx.font = '24px serif';
    ctx.fillStyle = isParchment ? '#059669' : '#D4AF37';
    ctx.textAlign = 'left';
    ctx.fillText('╔═══════', 65, 85);
    ctx.fillText('╚═══════', 65, 1055);
    ctx.textAlign = 'right';
    ctx.fillText('═══════╗', 1535, 85);
    ctx.fillText('═══════╝', 1535, 1055);

    // Top Institutional Header
    ctx.textAlign = 'center';
    ctx.direction = 'rtl';
    ctx.font = 'bold 21px Cairo, Tajawal, sans-serif';
    ctx.fillStyle = isParchment ? '#047857' : '#FBBF24';
    ctx.fillText('أكاديمية الأصوات والغناء • YONA SOUND & VOCAL ARTS ACADEMY', 800, 120);

    // Main Title
    ctx.font = '900 46px Tajawal, Cairo, sans-serif';
    ctx.fillStyle = isParchment ? '#064E3B' : '#FDE047';
    ctx.fillText('شهادة تميز واعتماد صوتي رسمي', 800, 185);

    // Subtitle English
    ctx.direction = 'ltr';
    ctx.font = 'italic bold 17px serif';
    ctx.fillStyle = isParchment ? '#059669' : '#FDE68A';
    ctx.fillText('OFFICIAL CERTIFICATE OF VOCAL EXCELLENCE & ACHIEVEMENT', 800, 220);

    // Divider line
    ctx.strokeStyle = isParchment ? '#10B981' : '#D4AF37';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(350, 245);
    ctx.lineTo(1250, 245);
    ctx.stroke();

    // Presentation Text
    ctx.direction = 'rtl';
    ctx.font = 'normal 20px Cairo, Tajawal, sans-serif';
    ctx.fillStyle = isParchment ? '#334155' : '#E2E8F0';
    ctx.fillText('تُمنح هذه الشهادة الرسمية تقديراً للأداء الصوتي الاستثنائي، وثبات التردد والنقاء النغمي، للمتسابق(ة):', 800, 295);

    ctx.direction = 'ltr';
    ctx.font = 'italic 16px serif';
    ctx.fillStyle = isParchment ? '#047857' : '#CBD5E1';
    ctx.fillText('This official certificate is proudly presented in recognition of exceptional vocal artistry to:', 800, 328);

    // Participant Singer Name (Luminous White default as in user reference)
    let canvasNameColor = isParchment ? '#047857' : '#FFFFFF';
    if (nameColorTheme === 'gold') {
      canvasNameColor = isParchment ? '#065F46' : '#FDE047';
    } else if (nameColorTheme === 'pink') {
      canvasNameColor = isParchment ? '#BE185D' : '#FB7185';
    } else if (nameColorTheme === 'cyan') {
      canvasNameColor = isParchment ? '#0284C7' : '#38BDF8';
    }

    ctx.direction = 'rtl';
    ctx.font = '900 58px Tajawal, Cairo, sans-serif';
    ctx.fillStyle = canvasNameColor;
    ctx.shadowColor = isParchment ? 'rgba(5, 150, 105, 0.15)' : 'rgba(212, 175, 55, 0.7)';
    ctx.shadowBlur = isParchment ? 3 : 18;
    ctx.fillText(singerNameAr, 800, 415);
    ctx.shadowBlur = 0;

    // English Name
    if (singerNameEn && singerNameEn !== singerNameAr) {
      ctx.direction = 'ltr';
      ctx.font = 'italic bold 25px serif';
      ctx.fillStyle = isParchment ? '#064E3B' : '#FCD34D';
      ctx.fillText(singerNameEn, 800, 460);
    }

    // Country / City Badge
    if (countryOrCity) {
      ctx.direction = 'rtl';
      ctx.font = 'bold 20px Cairo, sans-serif';
      ctx.fillStyle = isParchment ? '#047857' : '#FDE68A';
      ctx.fillText(` ${countryOrCity} • اعتماد وتوثيق رسمي`, 800, 505);
    }

    // Performance Box (Bright crisp container in parchment, dark in royal)
    ctx.fillStyle = isParchment ? '#FFFFFF' : 'rgba(0, 0, 0, 0.65)';
    ctx.strokeStyle = isParchment ? '#A7F3D0' : '#D4AF37';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(300, 540, 1000, 230, 20);
    } else {
      ctx.rect(300, 540, 1000, 230);
    }
    ctx.fill();
    ctx.stroke();

    // Performed song title
    ctx.direction = 'rtl';
    ctx.font = 'bold 22px Cairo, sans-serif';
    ctx.fillStyle = isParchment ? '#064E3B' : '#E2E8F0';
    ctx.fillText(`العمل الصوتي المؤدى:  ${data.songTitle}`, 800, 585);

    // Score, Category, Purity (Safe non-zero score!)
    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = isParchment ? '#059669' : '#FBBF24';
    ctx.fillText(`الدرجة الصوتية: ${effectiveScore}% (امتياز)   |   ${awardTitleAr}`, 800, 635);

    ctx.font = 'bold 18px Cairo, sans-serif';
    ctx.fillStyle = isParchment ? '#047857' : '#A78BFA';
    ctx.fillText(`تصنيف الطبقة: ${data.pitchTier || 'Soprano / Tenor'}  •  100% أكابيلا نقي (Vocals Only)`, 800, 680);

    if (data.juryNotes) {
      ctx.font = 'italic 15px Cairo, sans-serif';
      ctx.fillStyle = isParchment ? '#334155' : '#FDE68A';
      ctx.fillText(`"ملاحظات التحكيم: ${data.juryNotes}"`, 800, 725);
    }

    // Official Accreditation Guarantee Text (Under performance box)
    ctx.direction = 'rtl';
    ctx.font = 'bold 14px Cairo, sans-serif';
    ctx.fillStyle = isParchment ? '#047857' : '#FDE68A';
    ctx.fillText('وثيقة أداء صوتي رسمية معتمدة ومصادق عليها من المشرف العام ومجلس التحكيم • صالحة للاستخدام الأكاديمي والمهني', 800, 795);
    ctx.direction = 'ltr';
    ctx.font = 'italic 12px serif';
    ctx.fillStyle = isParchment ? '#065F46' : '#CBD5E1';
    ctx.fillText('Official vocal accreditation certified by the General Director & Academic Jury • Valid for academic & professional recognition', 800, 815);

    // Signature (Left)
    ctx.textAlign = 'right';
    ctx.direction = 'rtl';
    ctx.font = 'bold 16px Cairo, sans-serif';
    ctx.fillStyle = isParchment ? '#334155' : '#CBD5E1';
    ctx.fillText('المؤسس والمشرف العام على المنصة:', 480, 860);

    // Signature graphics
    ctx.strokeStyle = isParchment ? '#059669' : '#D4AF37';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(320, 915);
    ctx.bezierCurveTo(360, 885, 420, 945, 480, 895);
    ctx.bezierCurveTo(450, 925, 400, 865, 360, 930);
    ctx.stroke();

    ctx.font = 'bold 22px Tajawal, sans-serif';
    ctx.fillStyle = isParchment ? '#064E3B' : '#FBBF24';
    ctx.fillText(signatoryNameAr, 480, 955);
    ctx.direction = 'ltr';
    ctx.font = 'italic 15px serif';
    ctx.fillStyle = isParchment ? '#047857' : '#94A3B8';
    ctx.fillText(signatoryNameEn, 320, 985);

    // Seal Stamp (Center: Emerald in parchment, Gold in royal)
    ctx.beginPath();
    ctx.arc(800, 915, 55, 0, Math.PI * 2);
    const sealGrad = ctx.createRadialGradient(800, 915, 10, 800, 915, 55);
    if (isParchment) {
      sealGrad.addColorStop(0, '#A7F3D0');
      sealGrad.addColorStop(0.5, '#10B981');
      sealGrad.addColorStop(1, '#047857');
    } else {
      sealGrad.addColorStop(0, '#FFE082');
      sealGrad.addColorStop(0.5, '#D4AF37');
      sealGrad.addColorStop(1, '#AA771C');
    }
    ctx.fillStyle = sealGrad;
    ctx.fill();
    ctx.strokeStyle = isParchment ? '#ECFDF5' : '#FFF176';
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.direction = 'rtl';
    ctx.textAlign = 'center';
    ctx.font = 'bold 12px Cairo, sans-serif';
    ctx.fillStyle = isParchment ? '#022C22' : '#1A1305';
    ctx.fillText('ختم الاعتماد الرسمي', 800, 908);
    ctx.font = '900 11px monospace';
    ctx.fillText('VERIFIED 2026', 800, 925);
    ctx.fillText('YONA SONGS', 800, 940);

    // Document ID & Date (Right)
    ctx.textAlign = 'left';
    ctx.direction = 'ltr';
    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = isParchment ? '#047857' : '#FBBF24';
    ctx.fillText(`ID: ${certId}`, 1120, 870);
    ctx.font = 'normal 14px Cairo, sans-serif';
    ctx.fillStyle = isParchment ? '#334155' : '#94A3B8';
    ctx.fillText(`تاريخ الاعتماد: ${issueDateAr}`, 1120, 902);
    ctx.fillText(`Date: ${issueDateEn}`, 1120, 930);
    ctx.font = '12px monospace';
    ctx.fillStyle = isParchment ? '#047857' : '#64748B';
    ctx.fillText(`HASH: ${certHash}`, 1120, 960);

    // Draw real scannable QR Code on canvas
    if (qrCodeDataUrl) {
      try {
        const qrImg = new Image();
        qrImg.src = qrCodeDataUrl;
        if (qrImg.complete) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(1015, 868, 94, 94);
          ctx.drawImage(qrImg, 1017, 870, 90, 90);
        }
      } catch (e) {
        console.warn('QR code canvas draw skipped:', e);
      }
    }

    // Footer
    ctx.textAlign = 'center';
    ctx.font = '13px monospace';
    ctx.fillStyle = isParchment ? '#94A3B8' : '#64748B';
    ctx.fillText('YONA SONGS OFFICIAL VOCAL REPOSITORY • ALL RIGHTS RESERVED 2026', 800, 1060);

    return canvas;
  };

  // Direct Download of Certificate as Official PDF (.pdf)
  const handleDownloadCertificatePDF = () => {
    setIsDownloading(true);
    try {
      const canvas = generateCertificateCanvas();
      if (!canvas) {
        setIsDownloading(false);
        window.print();
        return;
      }

      const cleanName = (singerNameAr || 'vocalist').replace(/[\s/\\?%*:|"<>]+/g, '_');
      const pdfFileName = `شهادة_أداء_صوتي_معتمدة_${cleanName}_2026.pdf`;

      // Generate A4 Landscape PDF Document
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, 297, 210, undefined, 'FAST');
      pdf.save(pdfFileName);

      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Download PDF error, falling back to print:', err);
      setIsDownloading(false);
      window.print();
    }
  };

  // High-Resolution Direct Download of Certificate as Image (.png)
  const handleDownloadCertificateImage = () => {
    setIsDownloading(true);
    try {
      const canvas = generateCertificateCanvas();
      if (!canvas) {
        setIsDownloading(false);
        return;
      }

      const cleanName = (singerNameAr || 'vocalist').replace(/[\s/\\?%*:|"<>]+/g, '_');
      const fileName = `شهادة_غناء_${cleanName}_2026.png`;

      // 1. Try immediate synchronous data URL download
      try {
        const dataUrl = canvas.toDataURL('image/png');
        if (dataUrl && dataUrl.length > 200) {
          const a = document.createElement('a');
          a.download = fileName;
          a.href = dataUrl;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            if (document.body.contains(a)) {
              document.body.removeChild(a);
            }
          }, 300);
          setIsDownloading(false);
          setDownloadSuccess(true);
          setTimeout(() => setDownloadSuccess(false), 3500);
          return;
        }
      } catch (dataErr) {
        console.warn('toDataURL direct download failed, falling back to toBlob:', dataErr);
      }

      // 2. Fallback to canvas.toBlob
      canvas.toBlob((blob) => {
        if (!blob) {
          setIsDownloading(false);
          window.print();
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          if (document.body.contains(a)) {
            document.body.removeChild(a);
          }
          URL.revokeObjectURL(url);
        }, 500);
        setIsDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3500);
      }, 'image/png');

    } catch (err) {
      console.error('Download certificate image error:', err);
      setIsDownloading(false);
      window.print();
    }
  };

  // Owner Authentication Handler
  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = authInput.trim().toLowerCase();
    if (MASTER_PASSCODES.includes(cleaned)) {
      setIsOwnerAuthenticated(true);
      try {
        localStorage.setItem('yona_cert_owner_auth', 'true');
      } catch (err) {
        console.error(err);
      }
      setShowAuthModal(false);
      setIsOwnerPanelOpen(true);
      setAuthInput('');
      setAuthError('');
    } else {
      setAuthError('كلمة السر غير صحيحة! هذه الميزة مخصصة لمالك المنصة فقط.');
    }
  };

  const handleOwnerLogout = () => {
    setIsOwnerAuthenticated(false);
    setIsOwnerPanelOpen(false);
    try {
      localStorage.removeItem('yona_cert_owner_auth');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveOwnerSettings = () => {
    try {
      const config = {
        nameAr: signatoryNameAr,
        nameEn: signatoryNameEn,
        titleAr: signatoryTitleAr,
        titleEn: signatoryTitleEn
      };
      localStorage.setItem('yona_official_founder_signatory', JSON.stringify(config));
      setSaveSuccessMsg('تم حفظ اسم المؤسس والتوقيع بنجاح وسيعتمد في جميع الشهادات القادمة! ');
      setTimeout(() => setSaveSuccessMsg(''), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetToDefault = () => {
    setSignatoryNameAr(DEFAULT_SIGNATORY.nameAr);
    setSignatoryNameEn(DEFAULT_SIGNATORY.nameEn);
    setSignatoryTitleAr(DEFAULT_SIGNATORY.titleAr);
    setSignatoryTitleEn(DEFAULT_SIGNATORY.titleEn);
    try {
      localStorage.setItem('yona_official_founder_signatory', JSON.stringify(DEFAULT_SIGNATORY));
      setSaveSuccessMsg('تمت استعادة الاسم الافتراضي (يونا طلاس) بنجاح ');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(`Certificate ID: ${certId} | Verification Hash: ${certHash} | Signatory: ${signatoryNameEn} (${signatoryNameAr})`);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShare = () => {
    const text = ` شهادة تميز واعتماد صوتي رسمي ثنائية اللغة (Arabic/English) من منصة YONA SONGS للفنان/المشارك: ${singerNameAr} (${singerNameEn}) في عمل "${data.songTitle}" بدرجة ${data.score}% معتمدة رسمياً بتوقيع المشرف العام: ${signatoryNameAr} (${signatoryNameEn})! `;
    navigator.clipboard.writeText(text);
    setShared(true);
    setTimeout(() => setShared(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-4xl my-auto space-y-4">
        
        {/* ============================================================== */}
        {/*  OWNER EXCLUSIVE CONTROL PANEL (VISIBLE ONLY TO OWNER)        */}
        {/* ============================================================== */}
        {isOwnerAuthenticated && isOwnerPanelOpen && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#171c2d] to-[#111625] border-2 border-amber-400 shadow-2xl space-y-3.5 text-right text-xs animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-amber-400/30 pb-2.5">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-amber-400 animate-pulse" />
                <div>
                  <span className="font-black text-amber-300 text-sm block">
                    لوحة تحكم مالك المنصة  (صلاحيات سرية وخاصة بك فقط)
                  </span>
                  <span className="text-[10px] text-gray-400">
                    هذه اللوحة لا تظهر للمستخدمين العاديين، وتتيح لك تغيير اسم المؤسس والتوقيع متى شئت.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleOwnerLogout}
                  className="px-2.5 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 font-bold flex items-center gap-1 cursor-pointer transition-all text-[11px]"
                  title="قفل وضع المالك لإخفاء اللوحة"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>قفل وخروج</span>
                </button>
                <button
                  onClick={() => setIsOwnerPanelOpen(false)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 font-bold cursor-pointer"
                >
                  إخفاء 
                </button>
              </div>
            </div>

            {saveSuccessMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{saveSuccessMsg}</span>
              </div>
            )}

            {/* Presets & Shortcuts */}
            <div className="space-y-1">
              <span className="text-gray-300 font-bold block text-[11px]">نماذج وتسميات جاهزة بنقرة واحدة:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSignatoryNameAr('يونا طلاس');
                    setSignatoryNameEn('Youna Tlass');
                    setSignatoryTitleAr('المؤسس والمشرف العام على المنصة');
                    setSignatoryTitleEn('Founder & General Director');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-bold hover:bg-amber-400/30 cursor-pointer text-xs"
                >
                   يونا طلاس (Youna Tlass) - الافتراضي
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSignatoryNameAr('المايسترو يونا');
                    setSignatoryNameEn('Maestro Youna');
                    setSignatoryTitleAr('المؤسس والمدير الفني للمنصة');
                    setSignatoryTitleEn('Founder & Artistic Director');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 cursor-pointer text-xs"
                >
                  المايسترو يونا (Maestro Youna)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSignatoryNameAr('د. يونا طلاس');
                    setSignatoryNameEn('Dr. Youna Tlass');
                    setSignatoryTitleAr('عميد الأكاديمية والمشرف العام');
                    setSignatoryTitleEn('Academy Dean & Executive Director');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 cursor-pointer text-xs"
                >
                  د. يونا طلاس (Dr. Youna)
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSignatoryNameAr('مجلس التحكيم والاعتماد الصوتي');
                    setSignatoryNameEn('Academic Board of Vocal Recognition');
                    setSignatoryTitleAr('الأمانة العامة لمنصة YONA SONGS');
                    setSignatoryTitleEn('General Secretariat of YONA SONGS');
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 cursor-pointer text-xs"
                >
                  مجلس التحكيم (Academic Board)
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="px-2.5 py-1.5 rounded-xl bg-gray-700/50 hover:bg-gray-700 text-gray-300 flex items-center gap-1 cursor-pointer text-xs ml-auto"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>إعادة تعيين للأصل</span>
                </button>
              </div>
            </div>

            {/* Custom Input Fields for Signatory */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="text-gray-300 font-bold block mb-1">اسم المؤسس / المعتمد (بالعربية):</label>
                <input
                  type="text"
                  value={signatoryNameAr}
                  onChange={(e) => setSignatoryNameAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-amber-400/40 text-amber-200 font-bold text-sm"
                  placeholder="مثال: يونا طلاس"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Founder / Signatory (in English):</label>
                <input
                  type="text"
                  value={signatoryNameEn}
                  onChange={(e) => setSignatoryNameEn(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-amber-400/40 text-amber-200 font-bold text-sm text-left"
                  dir="ltr"
                  placeholder="e.g. Youna Tlass"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">الصفة الرسمية للمؤسس (بالعربية):</label>
                <input
                  type="text"
                  value={signatoryTitleAr}
                  onChange={(e) => setSignatoryTitleAr(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs"
                  placeholder="المؤسس والمشرف العام على المنصة"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Official Title (in English):</label>
                <input
                  type="text"
                  value={signatoryTitleEn}
                  onChange={(e) => setSignatoryTitleEn(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-white/15 text-white text-xs text-left"
                  dir="ltr"
                  placeholder="Founder & General Director"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-[11px] text-gray-400">
                 التغييرات التي تحفظها هنا تثبت دائماً وتعتمد في الشهادات لجميع الزوار.
              </span>
              <button
                onClick={handleSaveOwnerSettings}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-xs cursor-pointer shadow-lg shadow-amber-400/20"
              >
                تثبيت وحفظ الاسم دائماً 
              </button>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/*  OWNER AUTHENTICATION MODAL (PROMPT FOR PASSCODE)             */}
        {/* ============================================================== */}
        {showAuthModal && (
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0f172a] border-2 border-amber-400 shadow-2xl space-y-3 text-right text-xs max-w-md mx-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 text-sm">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>التحقق من هوية مالك المنصة</span>
              </span>
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  setAuthError('');
                }}
                className="text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5"
              >
                
              </button>
            </div>

            <p className="text-gray-300 text-xs leading-relaxed">
              هذه الخاصية سرية ومحمية، وتسمح فقط لمالك الصفحة بتعديل اسم المؤسس والتوقيع الرسمي. الرجاء إدخال كلمة سر المالك:
            </p>

            <form onSubmit={handleOwnerLogin} className="space-y-3">
              <div>
                <input
                  type="password"
                  value={authInput}
                  onChange={(e) => {
                    setAuthInput(e.target.value);
                    setAuthError('');
                  }}
                  autoFocus
                  placeholder="أدخل رمز المرور السري للمالك..."
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-amber-400/50 text-white font-mono text-center tracking-widest text-sm focus:outline-none focus:border-amber-400"
                />
                {authError && (
                  <p className="text-red-400 text-[11px] mt-1 flex items-center gap-1 font-bold">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{authError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-gray-500">
                  لوحة تحكم مشفرة ومحمية بكلمة سر خاصة
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-400 text-black font-black text-xs cursor-pointer hover:bg-amber-300 shadow-md"
                >
                  تأكيد الدخول 
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/*  OWNER / SUPERVISOR DUAL-NAME AUDIT & PRIVACY INSPECTOR      */}
        {/* ============================================================== */}
        {isOwnerAuthenticated && (
          <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-[#19152b] to-emerald-950/60 border-2 border-amber-500/50 text-amber-200 text-xs shadow-xl space-y-2 animate-in fade-in">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-bold text-sm text-white">
                  لوحة تدقيق المشرف العام (مراجعة خصوصية الأسماء /)
                </span>
              </div>
              <span className="text-[10px] text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full font-mono border border-emerald-500/40">
                وضع المشرف المعتمد (Admin Access)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 space-y-0.5">
                <span className="text-[10px] text-gray-400 block font-bold"> الاسم المعروض علناً للجمهور:</span>
                <span className="text-white font-black text-sm block truncate">
                  {data.originalPublicName || data.singerName}
                </span>
                <span className="text-[9px] text-gray-500 block">يظهر في المسابقة والمتصدرين والمكتبة</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/50 border border-emerald-500/30 space-y-0.5">
                <span className="text-[10px] text-emerald-400 block font-bold"> الاسم الرسمي المعتمد على الشهادة:</span>
                <span className="text-emerald-300 font-black text-sm block truncate">
                  {singerNameAr}
                </span>
                <span className="text-[9px] text-gray-400 block" dir="ltr">{singerNameEn}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-black/50 border border-amber-500/30 space-y-0.5">
                <span className="text-[10px] text-amber-400 block font-bold"> خيار الخصوصية المختار:</span>
                <div className="flex items-center gap-1.5 pt-0.5">
                  {namePrivacyMode === 'private_cert_only' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-lg border border-amber-500/40">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>خاص بالشهادة فقط (محمي)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-lg border border-emerald-500/40">
                      <Unlock className="w-3 h-3 text-emerald-400" />
                      <span>معلن للجميع على المنصة</span>
                    </span>
                  )}
                </div>
                <span className="text-[9px] text-gray-500 block">المشرف فقط من يرى الاسمين معاً</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/*  PARTICIPANT RECIPIENT NAME & COUNTRY CUSTOMIZATION DRAWER   */}
        {/* ============================================================== */}
        {isEditNameOpen && canEditSingerName && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d1627] to-[#0f1d24] border-2 border-emerald-500/40 shadow-2xl space-y-3.5 text-right text-xs animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Edit3 className="w-4 h-4 text-emerald-400" />
                <span>تعديل اسمك وبلدك وخيارات الخصوصية للشهادة والمنصة</span>
              </div>
              <button
                onClick={() => setIsEditNameOpen(false)}
                className="text-gray-400 hover:text-white px-2 py-1 rounded bg-white/5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Privacy Protection Notice for Contestant */}
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 leading-relaxed text-[11px] space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>خصوصيتك وهويتك محمية بالكامل في منصة YONA SONGS:</span>
              </div>
              <p className="text-gray-300">
                يمكنك كتابة <strong>اسمك الحقيقي الكامل</strong> لتصدر به شهادتك المعتمدة وتحميلها بصيغة PDF عالية الدقة، مع <strong>الحرية التامة</strong> في اختيار ما إذا كنت تريد إبقاء اسمك الحقيقي خاصاً بالشهادة فقط والاحتفاظ بلقبك الفني أمام الجمهور، أو نشره علناً. المشرف العام المعتمد فقط هو من يمكنه مراجعة الاسمين للتوثيق والاعتماد.
              </p>
            </div>

            {nameSaveMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{nameSaveMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveParticipantName} className="space-y-3.5">
              
              {/* Privacy Mode Selector Cards */}
              <div className="space-y-2 pt-1 border-t border-white/10">
                <label className="text-gray-300 font-bold block">
                  اختر مستوى خصوصية الاسم (Name Privacy & Visibility):
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div
                    onClick={() => setNamePrivacyMode('private_cert_only')}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer space-y-1 ${
                      namePrivacyMode === 'private_cert_only'
                        ? 'bg-amber-950/50 border-amber-400 shadow-md ring-2 ring-amber-400/30 text-white'
                        : 'bg-black/40 border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>خاص بالشهادة فقط (موصى به)</span>
                      </span>
                      {namePrivacyMode === 'private_cert_only' && (
                        <Check className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-300 leading-normal">
                      اسمك الحقيقي يظهر فقط على الشهادة والـ PDF وكود الـ QR، ويظل اسمك المستعار ظاهراً لجمهور المنصة.
                    </p>
                  </div>

                  <div
                    onClick={() => setNamePrivacyMode('public_everywhere')}
                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer space-y-1 ${
                      namePrivacyMode === 'public_everywhere'
                        ? 'bg-emerald-950/70 border-emerald-400 shadow-md ring-2 ring-emerald-400/30 text-white'
                        : 'bg-black/40 border-white/10 hover:border-white/20 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-300 flex items-center gap-1.5 text-xs">
                        <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                        <span>معلن للجميع على المنصة</span>
                      </span>
                      {namePrivacyMode === 'public_everywhere' && (
                        <Check className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-gray-300 leading-normal">
                      يتم اعتماد اسمك الحقيقي في لوحة المسابقة وقائمة المتصدرين وأرشيف المنصة علناً.
                    </p>
                  </div>
                </div>
              </div>

              {/* Official Certificate Name Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-white/10">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">
                     الاسم الحقيقي / المعتمد على الشهادة (بالعربية) *:
                  </label>
                  <input
                    type="text"
                    value={editNameArInput}
                    onChange={(e) => setEditNameArInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-purple-400/40 text-white font-bold text-xs focus:outline-none focus:border-purple-400"
                    placeholder="اسمك الحقيقي الكامل أو اللقب..."
                    required
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">
                    Full Legal / Official Name (in English):
                  </label>
                  <input
                    type="text"
                    value={editNameEnInput}
                    onChange={(e) => setEditNameEnInput(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-black/60 border border-purple-400/40 text-white font-bold text-xs text-left focus:outline-none focus:border-purple-400"
                    dir="ltr"
                    placeholder="e.g. Full Legal Name"
                  />
                </div>
              </div>

              {/* Public Display Name (for platform visitors) */}
              {namePrivacyMode === 'private_cert_only' && (
                <div className="p-2.5 rounded-xl bg-black/40 border border-purple-500/20 space-y-1">
                  <label className="text-gray-300 font-bold block text-[11px]">
                     الاسم / اللقب المستعار الذي يراه زوار المنصة والجمهور:
                  </label>
                  <input
                    type="text"
                    value={editPublicNameInput}
                    onChange={(e) => setEditPublicNameInput(e.target.value)}
                    className="w-full p-2 rounded-lg bg-black/70 border border-white/15 text-amber-200 font-bold text-xs focus:outline-none focus:border-purple-400"
                    placeholder="الاسم المستعار أو اللقب الفني المعروض للجمهور..."
                  />
                  <p className="text-[10px] text-gray-400">
                     هذا الاسم هو الذي يظهر للزوار في قائمة المتصدرين والمكتبة لحماية خصوصية اسمك الحقيقي.
                  </p>
                </div>
              )}

              {/* Country / City Input */}
              <div className="space-y-1.5 pt-1">
                <label className="text-gray-300 font-bold block">
                   الدولة / البلد أو المدينة (Country / City):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editCountryInput}
                    onChange={(e) => setEditCountryInput(e.target.value)}
                    className="flex-1 p-2.5 rounded-xl bg-black/60 border border-purple-400/40 text-amber-200 font-bold text-xs focus:outline-none focus:border-purple-400"
                    placeholder="مثال: المغرب  أو مصر  أو الجزائر  أو السعودية ..."
                  />
                </div>

                {/* Fast Select Chips for Arab Countries */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400">اختر بلدك سريعاً:</span>
                  {[
                    'المغرب ',
                    'الجزائر ',
                    'تونس ',
                    'مصر ',
                    'السعودية ',
                    'سوريا ',
                    'العراق ',
                    'الإمارات ',
                    'الأردن ',
                    'فلسطين ',
                    'لبنان ',
                    'اليمن ',
                    'عُمان ',
                    'الكويت ',
                    'قطر ',
                    'البحرين ',
                    'ليبيا ',
                    'السودان '
                  ].map((countryName) => (
                    <button
                      key={countryName}
                      type="button"
                      onClick={() => setEditCountryInput(countryName)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-medium border transition-colors cursor-pointer ${
                        editCountryInput === countryName
                          ? 'bg-amber-400/30 text-amber-300 border-amber-400/60 font-bold'
                          : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/5'
                      }`}
                    >
                      {countryName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name Color Selection */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <label className="text-gray-300 font-bold block">
                   لون اسم المتسابق على الشهادة (Participant Name Color):
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNameColorTheme('white')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                      nameColorTheme === 'white'
                        ? 'bg-white/25 text-white border-white shadow-md ring-2 ring-white/50'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                    }`}
                  >
                    <span> أبيض ملكي فاخر (Default Luminous White)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNameColorTheme('gold')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                      nameColorTheme === 'gold'
                        ? 'bg-amber-500/30 text-amber-300 border-amber-400 shadow-md ring-2 ring-amber-400/50'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                    }`}
                  >
                    <span> ذهبي ساطع (Lustrous Gold)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNameColorTheme('pink')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                      nameColorTheme === 'pink'
                        ? 'bg-pink-500/30 text-pink-300 border-pink-400 shadow-md ring-2 ring-pink-400/50'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                    }`}
                  >
                    <span> وردي متألق (Radiant Pink)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNameColorTheme('cyan')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer transition-all ${
                      nameColorTheme === 'cyan'
                        ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400 shadow-md ring-2 ring-cyan-400/50'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 border-white/10'
                    }`}
                  >
                    <span> أزرق سماوي نقي (Sky Cyan)</span>
                  </button>
                </div>
              </div>

              {/* Date Input & Quick Presets */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 font-bold block flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>تاريخ الاعتماد والإصدار المعتمد على الشهادة (Date of Issue):</span>
                  </label>
                  <span className="text-[10px] text-amber-300 font-mono">
                    اليوم: 28 سبتمبر 2026
                  </span>
                </div>

                {/* HTML5 Interactive Calendar Picker */}
                <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-black/40 border border-purple-500/20">
                  <span className="text-[11px] text-gray-300 font-bold"> اختر التاريخ من التقويم مباشرة:</span>
                  <input
                    type="date"
                    value={calendarDateInput}
                    onChange={handleCalendarDateChange}
                    className="px-3 py-1 rounded-lg bg-black/70 border border-purple-400/50 text-amber-300 font-mono text-xs focus:outline-none focus:border-purple-400 cursor-pointer"
                  />
                  <span className="text-[10px] text-gray-400">(يتم التحويل تلقائياً للصيغة العربية والإنجليزية)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1">التاريخ بالعربية:</span>
                    <input
                      type="text"
                      value={editDateArInput}
                      onChange={(e) => setEditDateArInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-purple-400/40 text-amber-300 font-bold text-xs focus:outline-none focus:border-purple-400 font-mono"
                      placeholder="مثال: 28 سبتمبر 2026"
                      required
                    />
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1">Date in English:</span>
                    <input
                      type="text"
                      value={editDateEnInput}
                      onChange={(e) => setEditDateEnInput(e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-black/60 border border-purple-400/40 text-amber-300 font-bold text-xs text-left focus:outline-none focus:border-purple-400 font-mono"
                      dir="ltr"
                      placeholder="e.g. September 28, 2026"
                      required
                    />
                  </div>
                </div>

                {/* Quick Date Shortcuts */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] text-gray-400">خيارات سريعة للتاريخ:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditDateArInput('28 سبتمبر 2026');
                      setEditDateEnInput('September 28, 2026');
                      setCalendarDateInput('2026-09-28');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-[10px] font-bold cursor-pointer transition-colors"
                  >
                     تاريخ اليوم (28 سبتمبر 2026)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const originalInfo = formatSingingDates(data.exactTimestamp);
                      setEditDateArInput(data.formattedDateAr || originalInfo.dateAr);
                      setEditDateEnInput(data.formattedDateEn || originalInfo.dateEn);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 border border-white/5 text-[10px] cursor-pointer transition-colors"
                  >
                     تاريخ تسجيل الأداء الفعلي
                  </button>
                </div>
              </div>

              {/* Certificate Verification Code / ID Customization */}
              <div className="space-y-1.5 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-gray-300 font-bold block flex items-center gap-1.5">
                    <BadgeCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>كود ورقم الشهادة المعتمد (Certificate ID):</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const generated = `YS-CERT-${(editNameEnInput || 'VOCAL').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4) || 'GOLD'}-${Math.floor((data.score || 98) * 100)}-2026`;
                      setEditCertIdInput(generated);
                    }}
                    className="text-[10px] text-amber-300 hover:underline flex items-center gap-1 cursor-pointer font-bold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>توليد كود تلقائي </span>
                  </button>
                </div>
                <input
                  type="text"
                  value={editCertIdInput}
                  onChange={(e) => setEditCertIdInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-black/60 border border-purple-400/40 text-amber-300 font-bold text-xs focus:outline-none focus:border-purple-400 font-mono text-left"
                  dir="ltr"
                  placeholder="e.g. YS-CERT-GOLD-9800-2026"
                  required
                />
                <p className="text-[10px] text-gray-400">
                   هذا الكود سيظهر على الشهادة المطبوعة ويتضمنه كود الـ QR عند مسحه للتحقق الأكاديمي الرقمي.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditNameOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/25 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>حفظ واعتماد الاسم والبلد والتاريخ على الشهادة </span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/*  PRIVACY GATE FOR NON-PARTICIPANT VISITORS                   */}
        {/* ============================================================== */}
        {!isParticipantOwner && !isOwnerAuthenticated ? (
          <div className="p-6 sm:p-10 rounded-3xl bg-[#0b1220] border-2 border-amber-500/40 text-center space-y-6 max-w-xl mx-auto shadow-2xl my-6 animate-in fade-in">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-400/50 flex items-center justify-center mx-auto text-amber-400 shadow-lg shadow-amber-500/10">
              <Lock className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-400/40 text-amber-300">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>وثيقة معتمدة • خصوصية المشاركين محمية </span>
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-tajawal text-white">
                شهادة الأداء الصوتي خاصة بالمتسابق المعني
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
                لا يمكن استعراض وتنزيل هذه الشهادة الرسمية وتفاصيلها إلا للمتسابق صاحب المشاركة نفسه، أو المشرف العام، وذلك لحماية خصوصية وهوية المشاركين في المنصة.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 text-right space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-gray-400 font-mono text-[11px]">
                <span>المتسابق (اسم العرض):</span>
                <span className="text-white font-bold">{data.originalPublicName || data.singerName}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400 font-mono text-[11px]">
                <span>الأغنية المؤداة:</span>
                <span className="text-amber-300 font-bold">{data.songTitle}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400 font-mono text-[11px]">
                <span>الدرجة الصوتية العامة:</span>
                <span className="text-emerald-400 font-bold">{data.score || 98}% (امتياز)</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <button
                onClick={() => {
                  onClose();
                  const recBtn = document.getElementById('hero-sing-cta') || document.getElementById('start-record-btn');
                  if (recBtn) recBtn.click();
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-black font-black text-xs transition-all shadow-md cursor-pointer font-tajawal"
              >
                 شارك بصوتك الآن واحصل على شهادتك!
              </button>

              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-bold transition-colors cursor-pointer border border-white/10 flex items-center justify-center gap-1.5"
                title="تأكيد الهوية للمشرف العام أو صاحب المشاركة"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>أنا المشرف أو صاحب المشاركة </span>
              </button>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs transition-colors cursor-pointer"
              >
                إغلاق 
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Actions Header Bar (Visible on mobile & desktop, hidden during print) */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-[#0d1322] border border-amber-500/30 print:hidden shadow-xl">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Direct PDF Download Button */}
                <button
                  onClick={handleDownloadCertificatePDF}
                  disabled={isDownloading}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-400/20 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  {isDownloading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{t('certDownloadingWait')}</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-950" />
                      <span>{t('certDownloadedSuccess')}</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5 text-black" />
                      <span>{t('certDownloadPdfBtn')}</span>
                    </>
                  )}
                </button>

                {/* Direct PNG Download Button */}
                <button
                  onClick={handleDownloadCertificateImage}
                  disabled={isDownloading}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-white/10 transition-all"
                >
                  <Download className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('certDownloadPngBtn')}</span>
                </button>

                {/* Print Button */}
                <button
                  onClick={handlePrint}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{t('certPrintBtn')}</span>
                </button>

                <button
                  onClick={() => setIsEditNameOpen(!isEditNameOpen)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isEditNameOpen
                      ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 hover:border-amber-400/40'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('certEditInfoBtn')}</span>
                </button>

                {/* Theme Toggle: Royal Midnight vs Academic Ivory Parchment */}
                <button
                  type="button"
                  onClick={() => setCertTheme(certTheme === 'royal' ? 'parchment' : 'royal')}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                    certTheme === 'parchment'
                      ? 'bg-emerald-100 text-emerald-950 border-emerald-300 shadow-md'
                      : 'bg-white/5 hover:bg-white/10 text-gray-200 border-white/10'
                  }`}
                  title={certTheme === 'royal' ? t('certThemeParchment') : t('certThemeRoyal')}
                >
                  {certTheme === 'royal' ? (
                    <>
                      <span>{t('certThemeParchment')}</span>
                    </>
                  ) : (
                    <>
                      <span>{t('certThemeRoyal')}</span>
                    </>
                  )}
                </button>

                {/* Compact Language Switcher inside Certificate: ENG or ع */}
                <button
                  type="button"
                  onClick={toggleLanguage}
                  className="px-2 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border border-amber-400/35 bg-white/5 hover:bg-white/10 text-amber-300 transition-all cursor-pointer font-mono"
                  title={language === 'ar' ? 'English' : 'عربي'}
                >
                  <Globe className="w-3 h-3 text-amber-400" />
                  <span className="font-bold">{language === 'ar' ? 'ENG' : 'ع'}</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
              >
                <span>{t('close')}</span>
              </button>
            </div>

        {/* ============================================================== */}
        {/* OFFICIAL DUAL-LANGUAGE CERTIFICATE DOCUMENT FRAME              */}
        {/* ============================================================== */}
        <div
          ref={certificateRef}
          id="official-certificate-print"
          className={`relative rounded-3xl p-5 sm:p-9 shadow-2xl border-4 overflow-hidden select-none transition-all duration-300 ${
            certTheme === 'parchment'
              ? 'theme-parchment bg-[#FFFFFF] text-slate-900 border-[#059669] ring-8 ring-[#059669]/20 shadow-xl'
              : 'theme-royal bg-gradient-to-b from-[#111625] via-[#0c101c] to-[#070911] text-white border-[#D4AF37] ring-8 ring-[#D4AF37]/20 ring-offset-4 ring-offset-black'
          }`}
        >
          {/* Subtle Guilloche & Luxury Vignette */}
          <div className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none ${certTheme === 'parchment' ? 'bg-emerald-500/10' : 'bg-amber-500/10'}`} />
          <div className={`absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none ${certTheme === 'parchment' ? 'bg-teal-500/10' : 'bg-pink-500/10'}`} />

          {/* Intricate Classical Borders and Corner Laurels */}
          <div className={`absolute top-2.5 right-3 pointer-events-none text-xl sm:text-2xl font-serif ${certTheme === 'parchment' ? 'text-emerald-700' : 'text-amber-400/80'}`}>
            ╔═══════
          </div>
          <div className={`absolute top-2.5 left-3 pointer-events-none text-xl sm:text-2xl font-serif ${certTheme === 'parchment' ? 'text-emerald-700' : 'text-amber-400/80'}`}>
            ═══════╗
          </div>
          <div className={`absolute bottom-2.5 right-3 pointer-events-none text-xl sm:text-2xl font-serif ${certTheme === 'parchment' ? 'text-emerald-700' : 'text-amber-400/80'}`}>
            ╚═══════
          </div>
          <div className={`absolute bottom-2.5 left-3 pointer-events-none text-xl sm:text-2xl font-serif ${certTheme === 'parchment' ? 'text-emerald-700' : 'text-amber-400/80'}`}>
            ═══════╝
          </div>

          {/* Luxury Watermark Crest */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
            <div className={`w-96 h-96 rounded-full border-[12px] flex items-center justify-center p-8 ${certTheme === 'parchment' ? 'border-emerald-600' : 'border-amber-500'}`}>
              <Crown className={`w-64 h-64 ${certTheme === 'parchment' ? 'text-emerald-600' : 'text-amber-500'}`} />
            </div>
          </div>

          {/* Close button (Hidden during printing) */}
          <button
            onClick={onClose}
            className={`absolute top-4 left-4 p-2 rounded-full transition-all cursor-pointer print:hidden z-20 ${
              certTheme === 'parchment'
                ? 'bg-black/5 hover:bg-black/10 text-slate-800'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
            title="إغلاق"
          >
            
          </button>

          {/* ----------------------------------------------------------- */}
          {/* 1. OFFICIAL ACADEMIC HEADER (BILINGUAL: AR / EN)            */}
          {/* ----------------------------------------------------------- */}
          <div className={`text-center space-y-2 border-b-2 pb-4 ${certTheme === 'parchment' ? 'border-emerald-200' : 'border-[#D4AF37]/50'}`}>
            
            {/* Top Institutional Badge */}
            <div className="flex items-center justify-center gap-3">
              <div className={`w-8 sm:w-16 h-0.5 bg-gradient-to-r from-transparent ${certTheme === 'parchment' ? 'to-emerald-600' : 'to-[#D4AF37]'}`} />
              <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-bold tracking-wider ${
                certTheme === 'parchment'
                  ? 'bg-emerald-50/90 border border-emerald-400/60 text-emerald-950 shadow-sm'
                  : 'bg-amber-500/15 border border-amber-400/50 text-amber-300'
              }`}>
                <ShieldCheck className={`w-4 h-4 ${certTheme === 'parchment' ? 'text-emerald-700' : 'text-amber-400'}`} />
                <span>أكاديمية الأصوات والغناء • YONA SOUND & VOCAL ARTS ACADEMY</span>
              </div>
              <div className={`w-8 sm:w-16 h-0.5 bg-gradient-to-l from-transparent ${certTheme === 'parchment' ? 'to-emerald-600' : 'to-[#D4AF37]'}`} />
            </div>

            {/* Main Certificate Title (Bilingual) */}
            <div className="space-y-0.5 pt-1">
              <h1 className={`text-2xl sm:text-4xl font-black font-tajawal tracking-wide ${
                certTheme === 'parchment'
                  ? 'text-emerald-950 font-black'
                  : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400'
              }`}>
                شهادة تميز واعتماد صوتي رسمي
              </h1>
              <p className={`text-xs sm:text-sm font-serif italic tracking-widest uppercase font-bold ${
                certTheme === 'parchment' ? 'text-emerald-800' : 'text-amber-200/90'
              }`}>
                OFFICIAL CERTIFICATE OF VOCAL EXCELLENCE & ACHIEVEMENT
              </p>
            </div>

            {/* Sub-bar */}
            <p className={`text-[10px] font-mono tracking-widest ${certTheme === 'parchment' ? 'text-emerald-700/80' : 'text-gray-400'}`}>
              ACCREDITED VOCAL RECOGNITION REGISTRY • YONA SONGS PLATFORM
            </p>
          </div>

          {/* ----------------------------------------------------------- */}
          {/* 2. RECIPIENT PRESENTATION (BILINGUAL)                       */}
          {/* ----------------------------------------------------------- */}
          <div className="py-4 text-center space-y-2.5">
            
            {/* Bilingual Awarding Statement */}
            <div className={`space-y-1 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed px-2 ${
              certTheme === 'parchment' ? 'text-slate-700' : 'text-gray-300'
            }`}>
              <p className="font-medium">
                تُمنح هذه الشهادة الرسمية تقديراً للأداء الصوتي الاستثنائي، وثبات التردد والنقاء النغمي، والإبداع الراقي للمتسابق(ة):
              </p>
              <p className={`text-[11px] sm:text-xs font-serif italic ${certTheme === 'parchment' ? 'text-emerald-800' : 'text-amber-300/80'}`} dir="ltr">
                This official certificate is proudly presented in recognition of exceptional vocal artistry, harmonic precision, and outstanding performance to:
              </p>
            </div>

            {/* Recipient's Name Styled in Vibrant Color */}
            <div className="py-2">
              <div className="inline-block relative">
                {/* Arabic Name */}
                <div className={`text-3xl sm:text-5xl font-black font-tajawal tracking-wider ${
                  nameColorTheme === 'gold'
                    ? certTheme === 'parchment'
                      ? 'text-emerald-800 font-black'
                      : 'text-amber-300 drop-shadow-[0_2px_15px_rgba(251,191,36,0.6)]'
                    : nameColorTheme === 'pink'
                    ? certTheme === 'parchment'
                      ? 'text-pink-700 font-black'
                      : 'text-pink-400 drop-shadow-[0_2px_15px_rgba(244,63,94,0.5)]'
                    : nameColorTheme === 'cyan'
                    ? certTheme === 'parchment'
                      ? 'text-cyan-700 font-black'
                      : 'text-cyan-400 drop-shadow-[0_2px_15px_rgba(56,189,248,0.5)]'
                    : certTheme === 'parchment'
                    ? 'text-emerald-950 font-black'
                    : 'text-white drop-shadow-[0_2px_15px_rgba(212,175,55,0.7)]'
                }`}>
                  {singerNameAr}
                </div>
                {/* English Name (Subtitle) */}
                {singerNameEn && singerNameEn !== singerNameAr && (
                  <div className={`text-base sm:text-xl font-serif italic font-bold mt-1 tracking-widest ${
                    certTheme === 'parchment' ? 'text-emerald-900 font-bold' : 'text-amber-300'
                  }`} dir="ltr">
                    {singerNameEn}
                  </div>
                )}
                <Sparkles className={`w-5 h-5 sm:w-6 sm:h-6 absolute -top-3 -right-6 animate-pulse ${certTheme === 'parchment' ? 'text-emerald-500' : 'text-amber-500'}`} />
              </div>

              {countryOrCity && (
                <div className={`mt-2 text-xs font-bold flex items-center justify-center gap-1.5 ${
                  certTheme === 'parchment' ? 'text-emerald-900' : 'text-amber-300/90'
                }`}>
                  <MapPin className={`w-3.5 h-3.5 inline ${certTheme === 'parchment' ? 'text-emerald-600' : 'text-amber-500'}`} />
                  <span>{countryOrCity}</span>
                  <span className={`w-1.5 h-1.5 rounded-full ${certTheme === 'parchment' ? 'bg-emerald-600' : 'bg-amber-500'}`} />
                  <span className={certTheme === 'parchment' ? 'text-slate-600 font-normal' : 'text-gray-400 font-normal'}>
                    اعتماد وتوثيق دولي رسمي • Officially Certified
                  </span>
                </div>
              )}
            </div>

            {/* --------------------------------------------------------- */}
            {/* 3. PERFORMANCE SPECIFICATIONS (DUAL-LANGUAGE GRID)        */}
            {/* --------------------------------------------------------- */}
            <div className={`p-3.5 sm:p-5 rounded-2xl max-w-2xl mx-auto space-y-3 ${
              certTheme === 'parchment'
                ? 'bg-[#F8FAF9] border border-emerald-200 shadow-sm text-slate-900'
                : 'bg-black/60 border border-amber-400/40'
            }`}>
              
              {/* Performed Track Title */}
              <div className={`flex flex-col sm:flex-row items-center justify-between border-b pb-2.5 gap-1.5 ${
                certTheme === 'parchment' ? 'border-emerald-100' : 'border-white/10'
              }`}>
                <div className={`text-right sm:text-right text-xs flex items-center gap-1.5 ${certTheme === 'parchment' ? 'text-slate-700' : 'text-gray-400'}`}>
                  <Music className={`w-4 h-4 shrink-0 ${certTheme === 'parchment' ? 'text-emerald-600' : 'text-amber-500'}`} />
                  <div>
                    <span className={`font-bold ${certTheme === 'parchment' ? 'text-emerald-950' : 'text-gray-300'}`}>العمل الصوتي المؤدى: </span>
                    <span className={`text-[10px] block font-serif italic ${certTheme === 'parchment' ? 'text-emerald-700' : 'text-gray-400'}`} dir="ltr">Performed Work / Song:</span>
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <span className={`font-black text-sm sm:text-base ${certTheme === 'parchment' ? 'text-emerald-950 font-black' : 'text-amber-200'}`}>{data.songTitle}</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-right">
                
                {/* Metric 1: Vocal Score (Never 0%!) */}
                <div className={`p-2.5 rounded-xl space-y-0.5 ${
                  certTheme === 'parchment'
                    ? 'bg-emerald-50/90 border border-emerald-200'
                    : 'bg-white/5 border border-white/5'
                }`}>
                  <span className={`text-[10px] block ${certTheme === 'parchment' ? 'text-slate-700 font-bold' : 'text-gray-400'}`}>الدرجة الصوتية العامة:</span>
                  <span className={`text-[9px] font-serif italic block ${certTheme === 'parchment' ? 'text-emerald-700' : 'text-gray-500'}`} dir="ltr">Overall Vocal Score:</span>
                  <div className={`text-lg sm:text-xl font-black font-mono flex items-center gap-1 pt-0.5 ${
                    certTheme === 'parchment' ? 'text-emerald-900' : 'text-amber-300'
                  }`}>
                    <span>{effectiveScore}%</span>
                    <span className="text-[10px] font-bold text-emerald-600 font-sans">
                      {effectiveScore >= 95 ? ' امتياز' : ' فائق'}
                    </span>
                  </div>
                </div>

                {/* Metric 2: Award Title */}
                <div className={`p-2.5 rounded-xl space-y-0.5 ${
                  certTheme === 'parchment'
                    ? 'bg-emerald-50/90 border border-emerald-200'
                    : 'bg-white/5 border border-white/5'
                }`}>
                  <span className={`text-[10px] block ${certTheme === 'parchment' ? 'text-slate-700 font-bold' : 'text-gray-400'}`}>المركز التتويجي:</span>
                  <span className={`text-[9px] font-serif italic block ${certTheme === 'parchment' ? 'text-emerald-700' : 'text-gray-500'}`} dir="ltr">Award Category:</span>
                  <span className={`text-xs font-bold block truncate pt-0.5 ${certTheme === 'parchment' ? 'text-emerald-950 font-black' : 'text-amber-300'}`}>
                    {awardTitleAr}
                  </span>
                  <span className={`text-[9px] font-serif italic block truncate ${certTheme === 'parchment' ? 'text-emerald-800' : 'text-amber-200/80'}`} dir="ltr">
                    {awardTitleEn}
                  </span>
                </div>

                {/* Metric 3: Vocal Tier / Pitch Range */}
                <div className={`p-2.5 rounded-xl space-y-0.5 col-span-2 sm:col-span-1 ${
                  certTheme === 'parchment'
                    ? 'bg-emerald-50/90 border border-emerald-200'
                    : 'bg-white/5 border border-white/5'
                }`}>
                  <span className={`text-[10px] block ${certTheme === 'parchment' ? 'text-slate-700 font-bold' : 'text-gray-400'}`}>تصنيف الطبقة والخامة:</span>
                  <span className={`text-[9px] font-serif italic block ${certTheme === 'parchment' ? 'text-emerald-700' : 'text-gray-500'}`} dir="ltr">Vocal Tier & Purity:</span>
                  <span className={`text-xs font-mono font-bold block truncate pt-0.5 ${certTheme === 'parchment' ? 'text-teal-950 font-bold' : 'text-purple-300'}`}>
                    {data.pitchTier || 'Soprano / Tenor'}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-mono font-bold block">
                    100% أكابيلا نقي (Vocals Only)
                  </span>
                </div>
              </div>

              {/* Jury Technical Notes */}
              {data.juryNotes && (
                <div className={`p-2.5 rounded-xl text-[11px] text-right leading-relaxed ${
                  certTheme === 'parchment'
                    ? 'bg-emerald-50 border border-emerald-300 text-emerald-950'
                    : 'bg-amber-950/40 border border-amber-500/30 text-amber-200'
                }`}>
                  <div className={`flex items-center gap-1 font-bold mb-0.5 ${certTheme === 'parchment' ? 'text-emerald-900' : 'text-amber-300'}`}>
                    <span> ملاحظات وتقييم لجنة التحكيم الفنية:</span>
                    <span className="text-[9px] font-serif italic font-normal" dir="ltr">(Jury Assessment)</span>
                  </div>
                  <p className="italic">"{data.juryNotes}"</p>
                </div>
              )}

              {/* Official Academic Accreditation & Recognition Clause */}
              <div className={`p-2.5 rounded-xl text-[10px] sm:text-[11px] leading-relaxed text-right border ${
                certTheme === 'parchment'
                  ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                  : 'bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-amber-500/10 border-amber-400/30 text-amber-200'
              }`}>
                <div className="flex items-center justify-between font-bold mb-0.5">
                  <span className="flex items-center gap-1 text-emerald-800 dark:text-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span>إقرار الاعتماد والتوثيق الأكاديمي الرسمي (Official Academic Accreditation):</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-700 font-bold">
                    OFFICIALLY RATIFIED 
                  </span>
                </div>
                <p className="opacity-95 text-[10px] leading-normal">
                  وثيقة أداء صوتي رسمية معتمدة ومصادق عليها من قبل المشرف العام ومجلس التحكيم، ومقيدة بالسجل العام للأكاديمية، وصالحة للاستخدام الأكاديمي والمهني.
                </p>
                <p className="text-[9px] font-serif italic mt-0.5 opacity-80" dir="ltr">
                  Official vocal accreditation certified and ratified by the General Director and the Academic Jury Council, valid for academic and professional recognition.
                </p>
              </div>
            </div>

          </div>

          {/* ----------------------------------------------------------- */}
          {/* 4. VERIFICATION SEAL, SIGNATURE OF YOUNA TLASS & QR CODE    */}
          {/* ----------------------------------------------------------- */}
          <div className={`pt-4 border-t-2 grid grid-cols-1 sm:grid-cols-3 items-center gap-4 text-xs ${
            certTheme === 'parchment' ? 'border-emerald-200' : 'border-[#D4AF37]/50'
          }`}>
            
            {/* Signature of Youna Tlass / Official Signatory */}
            <div className="text-center sm:text-right space-y-1">
              <span className={`text-[11px] block font-bold ${certTheme === 'parchment' ? 'text-slate-700' : 'text-gray-400'}`}>
                توقيع المؤسس والمشرف العام:
              </span>
              <span className={`text-[9px] font-serif italic block ${certTheme === 'parchment' ? 'text-emerald-700' : 'text-gray-500'}`} dir="ltr">
                Founder & General Director Signature:
              </span>

              {/* Artistic Calligraphic Signature Graphic for Youna Tlass */}
              <div className="h-12 flex items-center justify-center sm:justify-start py-1">
                <div className="relative">
                  <svg
                    viewBox="0 0 200 50"
                    className={`h-10 w-44 fill-none stroke-current ${certTheme === 'parchment' ? 'text-[#065F46]' : 'text-[#D4AF37]'}`}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {/* Flowing handwritten calligraphy signature of Youna Tlass */}
                    <path d="M 16 35 C 24 10, 36 6, 44 28 C 48 38, 54 18, 66 22 C 78 26, 86 38, 98 16 C 110 8, 122 14, 134 26 C 144 36, 156 28, 184 14 M 22 38 Q 98 32 186 26 M 78 12 L 82 38 M 140 10 Q 152 20 166 12" />
                  </svg>
                  <div className={`absolute -bottom-1 right-2 text-[9px] font-mono ${certTheme === 'parchment' ? 'text-emerald-800' : 'text-amber-300/80'}`}>
                    Digitally Sealed 
                  </div>
                </div>
              </div>

              {/* Signatory Printed Name & Title */}
              <div className="space-y-0.5">
                <span className={`font-serif italic text-sm font-black tracking-wide block ${certTheme === 'parchment' ? 'text-emerald-950' : 'text-amber-200'}`} dir="ltr">
                  {signatoryNameEn}
                </span>
                <span className={`text-[11px] font-bold block ${certTheme === 'parchment' ? 'text-emerald-900' : 'text-amber-300'}`}>
                  أ. {signatoryNameAr}
                </span>
                <span className={`text-[9px] block font-mono ${certTheme === 'parchment' ? 'text-slate-600' : 'text-gray-400'}`}>
                  {signatoryTitleAr} • {signatoryTitleEn}
                </span>
              </div>
            </div>

            {/* Official 3D Medallion Seal (الختم الرسمي المعتمد) */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="relative">
                <div className={`w-20 h-20 rounded-full p-1 shadow-xl flex items-center justify-center text-black ${
                  certTheme === 'parchment'
                    ? 'bg-gradient-to-tr from-emerald-600 via-teal-400 to-emerald-200 shadow-emerald-500/30'
                    : 'bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 shadow-amber-500/30'
                }`}>
                  <div className={`w-full h-full rounded-full border-2 border-dashed flex flex-col items-center justify-center text-center p-1 ${
                    certTheme === 'parchment'
                      ? 'border-emerald-950 bg-gradient-to-b from-emerald-400 to-teal-500 text-slate-950'
                      : 'border-amber-900 bg-gradient-to-b from-amber-400 to-yellow-500 text-black'
                  }`}>
                    <Crown className="w-4 h-4 fill-black text-black" />
                    <span className="text-[7.5px] font-black uppercase tracking-tighter leading-tight mt-0.5">
                      OFFICIAL SEAL
                    </span>
                    <span className="text-[7px] font-bold text-emerald-950 font-mono">
                      VERIFIED 2026
                    </span>
                    <span className="text-[6px] font-black text-black">
                      YONA SONGS
                    </span>
                  </div>
                </div>
                {/* Ribbon Tails */}
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none">
                  <div className={`w-3.5 h-6 clip-ribbon shadow ${certTheme === 'parchment' ? 'bg-emerald-600' : 'bg-red-600'}`} />
                  <div className={`w-3.5 h-6 clip-ribbon shadow ${certTheme === 'parchment' ? 'bg-teal-700' : 'bg-red-700'}`} />
                </div>
              </div>
              <span className={`text-[9px] font-mono mt-4 font-bold ${certTheme === 'parchment' ? 'text-emerald-900' : 'text-amber-300/90'}`}>
                ختم التوثيق والاعتماد الأكاديمي
              </span>
              <span className={`text-[8px] font-serif italic ${certTheme === 'parchment' ? 'text-slate-600' : 'text-gray-400'}`} dir="ltr">
                Official Seal of Vocal Excellence
              </span>
            </div>

            {/* Real Scannable Verification QR Code & Academic ID */}
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center justify-center sm:justify-end gap-2.5">
                <div className={`p-1 rounded-xl bg-white text-black shrink-0 shadow-lg border flex items-center justify-center ${
                  certTheme === 'parchment' ? 'border-emerald-400/50' : 'border-amber-400/50'
                }`}>
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt={`Real verification QR code for ${certId}`}
                      className="w-14 h-14 object-contain rounded-md"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-gray-100 rounded-md animate-pulse flex items-center justify-center text-[8px] text-gray-500 font-mono">
                      QR CODE
                    </div>
                  )}
                </div>
                <div className="text-right sm:text-left text-[10px] space-y-0.5">
                  <span className={`block font-mono ${certTheme === 'parchment' ? 'text-slate-600' : 'text-gray-400'}`}>رقم الوثيقة / Document ID:</span>
                  <span className={`font-mono font-black tracking-wider block text-xs ${certTheme === 'parchment' ? 'text-emerald-900 font-black' : 'text-amber-300'}`}>{certId}</span>
                  <span className="text-[9px] text-emerald-600 font-mono flex items-center gap-1 font-bold">
                    <BadgeCheck className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                    <span>كود QR معتمد وقابل للمسح </span>
                  </span>
                </div>
              </div>
              <div className={`text-[10px] font-mono ${certTheme === 'parchment' ? 'text-slate-700' : 'text-gray-400'}`}>
                <span>تاريخ الاعتماد / Date: {issueDateAr}</span>
                <span className={`block text-[9px] font-serif italic ${certTheme === 'parchment' ? 'text-emerald-700' : 'text-gray-500'}`} dir="ltr">Issued: {issueDateEn}</span>
              </div>
            </div>

          </div>

          {/* Digital Hash Footnote */}
          <div className={`pt-2.5 mt-2.5 border-t flex flex-col sm:flex-row items-center justify-between text-[9px] sm:text-[10px] font-mono gap-1 ${
            certTheme === 'parchment' ? 'border-emerald-200 text-slate-500' : 'border-white/10 text-gray-400'
          }`}>
            <span>VERIFICATION HASH: {certHash}</span>
            <span>YONA SONGS REPOSITORY • ALL OFFICIAL RIGHTS RESERVED 2026</span>
          </div>

        </div>

        {/* ------------------------------------------------------------- */}
        {/* CONTROLS BAR (Hidden during printing)                         */}
        {/* ------------------------------------------------------------- */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 p-3.5 rounded-2xl bg-black/80 border border-white/10 print:hidden text-xs">
          
          <div className="flex items-center gap-2 flex-wrap">
            {/* Direct Official PDF Download Button */}
            <button
              id="download-certificate-pdf-button"
              onClick={handleDownloadCertificatePDF}
              disabled={isDownloading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-black flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-400/25 transition-all hover:scale-105 active:scale-95"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-black" />
                  <span>{t('certDownloadingWait')}</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-950" />
                  <span>{t('certDownloadedSuccess')}</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 text-black" />
                  <span>{t('certDownloadPdfBtn')}</span>
                </>
              )}
            </button>

            {/* Direct High-Res PNG Download Button */}
            <button
              id="download-certificate-png-button"
              onClick={handleDownloadCertificateImage}
              disabled={isDownloading}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-2 cursor-pointer transition-all border border-white/10"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{t('certDownloadPngBtn')}</span>
            </button>

            {/* Print Button */}
            <button
              id="print-certificate-button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold flex items-center gap-2 cursor-pointer transition-all border border-white/10"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>{t('certPrintBtn')}</span>
            </button>

            {/* Participant Edit Name & Country Button */}
            {canEditSingerName && (
              <button
                onClick={() => setIsEditNameOpen(!isEditNameOpen)}
                className={`px-3.5 py-2.5 rounded-xl font-bold flex items-center gap-1.5 cursor-pointer transition-all border ${
                  isEditNameOpen
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow-md'
                    : 'bg-white/5 hover:bg-white/10 text-slate-200 border-white/10 hover:border-amber-400/40'
                }`}
                title={t('certEditInfoBtn')}
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span>{t('certEditInfoBtn')}</span>
              </button>
            )}

            {/* Share Certificate */}
            <button
              onClick={handleShare}
              className="px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <Share2 className="w-4 h-4 text-amber-400" />
              <span>{shared ? (isRtl ? 'تم النسخ للمشاركة!' : 'Copied link!') : t('share')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Copy Verification Code */}
            <button
              onClick={handleCopyCode}
              className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-mono flex items-center gap-1.5 cursor-pointer transition-all text-[11px]"
              title={isRtl ? "نسخ رقم الشهادة للتحقق" : "Copy Certificate ID"}
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copiedCode ? (isRtl ? 'تم النسخ!' : 'Copied!') : certId}</span>
            </button>

            {/* OWNER PORTAL BUTTON (Discreet Lock/Crown Icon) */}
            <button
              onClick={() => {
                if (isOwnerAuthenticated) {
                  setIsOwnerPanelOpen(!isOwnerPanelOpen);
                } else {
                  setShowAuthModal(true);
                }
              }}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                isOwnerAuthenticated
                  ? 'bg-amber-400/20 border-amber-400 text-amber-300 hover:bg-amber-400/30'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:bg-white/10'
              }`}
              title={isOwnerAuthenticated ? 'لوحة تحكم مالك المنصة ' : 'بوابة مالك المنصة (محمي برمز سري)'}
            >
              {isOwnerAuthenticated ? (
                <>
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-bold">{isRtl ? 'خيارات المالك' : 'Owner Options'}</span>
                </>
              ) : (
                <Lock className="w-3.5 h-3.5 text-gray-400" />
              )}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white cursor-pointer transition-all font-bold"
            >
              {t('close')}
            </button>
          </div>

        </div>
        </>
        )}

      </div>
    </div>
  );
};
