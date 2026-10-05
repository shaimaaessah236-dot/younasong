import { ContestEntry } from '../types';
import {
  saveAudioToIndexedDB,
  getAudioFromIndexedDB,
  deleteAudioFromIndexedDB,
  getCachedAudioUrl,
  safeSetLocalStorage
} from './audioDb';

export const INITIAL_CONTEST_ENTRIES: ContestEntry[] = [
  {
    id: 'entry-alice',
    singerName: 'alice',
    countryOrCity: 'سوريا ',
    songTitle: 'إيروكا (رسمت بيتاً صغيراً أسميته الأحلام)',
    songId: 'eruka-rasamtu',
    audioUrl: typeof window !== 'undefined' ? (getCachedAudioUrl('alice_recorded_voice') || localStorage.getItem('alice_recorded_voice') || '') : '',
    score: 99.2,
    voiceType: 'أنثى (Female) - أكابيلا بشرية صريحة',
    pitchTier: 'ميزو سوبرانو (Mezzo) - صوت بشري خالص بدون موسيقى ',
    votes: 742,
    date: 'الآن',
    badge: ' المتصدر بالمركز الأول (صوت بشري نقي 100% )',
    comment: 'أداء غنائي بشري نقي وصافٍ بدون أي آلات أو ألحان مرافقة للجميلة يونا ',
    isSelectedBest: true,
    bestRank: 'first',
    selectedAt: 'الأسبوع الحالي',
    juryNotes: 'أداء صوتي حقيقي ونقي جداً لشارة إيروكا بدون آلات أو ألحان خلفية، صوت بشري خالص بنبرة ميزو سوبرانو دافئة وثبات استثنائي في العرب الصوتية.',
    isUserRecording: false,
    hasVoted: false
  },
  {
    id: 'entry-1',
    singerName: 'سارة الزهراني',
    countryOrCity: 'السعودية ',
    songTitle: 'شارة أنا وأخي (شوق يدفعني لأراها)',
    songId: 'ana-wa-akhi',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    score: 97.5,
    voiceType: 'أنثى (Female)',
    pitchTier: 'ميزو سوبرانو (Mezzo) نقي',
    votes: 524,
    date: 'منذ يومين',
    badge: ' المركز الثاني (أداء تجريبي للاسترشاد)',
    comment: 'أداء وجداني نقي جداً استطاع محاكاة إحساس رشا رزق بدقة مذهلة ودفء صوتي عالي!',
    isSelectedBest: true,
    bestRank: 'second',
    selectedAt: 'الأسبوع الحالي',
    juryNotes: 'أداء نقي وإحساس مؤثر جداً مع مخارج حروف سليمة وطبقة سوبرانو دافئة'
  },
  {
    id: 'entry-2',
    singerName: 'محمد العمراني',
    countryOrCity: 'المغرب ',
    songTitle: 'شارة القناص (قد لمعت عيناه)',
    songId: 'hunter-x-hunter',
    audioUrl: 'https://actions.google.com/sounds/v1/cinematic/epic_heroic_swashbuckler.ogg',
    score: 96.2,
    voiceType: 'ذكر (Male)',
    pitchTier: 'تينور (Tenor) حماسي',
    votes: 468,
    date: 'منذ 3 أيام',
    badge: ' المركز الثالث (أداء تجريبي للاسترشاد)',
    comment: 'طبقات صوتية حماسية وثبات عالي في طبقة الجواب وقوة النفس أثناء القفلات.',
    isSelectedBest: true,
    bestRank: 'third',
    selectedAt: 'الأسبوع الحالي',
    juryNotes: 'طاقة صوتية متميزة ونبرة بطولية توافق شارة القناص وقوة تحكم في النفس'
  },
  {
    id: 'entry-3',
    singerName: 'نور الهدى قاسم',
    countryOrCity: 'مصر ',
    songTitle: 'البؤساء (ما من أغصان تبقى عارية)',
    songId: 'les-miserables',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    score: 95.8,
    voiceType: 'أنثى (Female)',
    pitchTier: 'سوبرانو (Soprano) أوبرا',
    votes: 395,
    date: 'منذ 4 أيام',
    comment: 'تحكم رائع بالعرب الصوتية وثبات في التردد الصوتي على المقامات الشجية.'
  },
  {
    id: 'entry-4',
    singerName: 'خالد المنصوري',
    countryOrCity: 'الإمارات ',
    songTitle: 'شارة عهد الأصدقاء (حلمنا نهار)',
    songId: 'ahd-al-asdiqa',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/piano_medley.ogg',
    score: 94.5,
    voiceType: 'ذكر (Male)',
    pitchTier: 'باريتون دافئ (Baritone)',
    votes: 312,
    date: 'منذ 5 أيام',
    comment: 'إحساس صادق ومخارج حروف واضحة جداً متناسقة مع إيقاع الأغنية.'
  },
  {
    id: 'entry-5',
    singerName: 'ياسمين الشامي',
    countryOrCity: 'سوريا ',
    songTitle: 'إيروكا (رسمت بيتاً صغيراً سميته الأحلام)',
    songId: 'eruka-rasamtu',
    audioUrl: 'https://actions.google.com/sounds/v1/ambiences/warm_acoustic_guitar.ogg',
    score: 93.8,
    voiceType: 'أنثى (Female)',
    pitchTier: 'ألتو رقيق (Alto)',
    votes: 289,
    date: 'منذ 6 أيام',
    comment: 'صوت مريح للأعصاب وعذوبة في النطق تلامس القلب.'
  }
];

const STORAGE_KEY = 'yona_weekly_contest_entries_v3';
const OWNED_ENTRIES_KEY = 'yona_my_owned_entry_ids';
const DELETED_ENTRIES_KEY = 'yona_contest_deleted_entry_ids';

// استرجاع معرفات المشاركات المحذوفة نهائياً
export function getDeletedEntryIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(DELETED_ENTRIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading deleted entry IDs:', e);
  }
  return [];
}

// وسم مشاركة بأنها محذوفة نهائياً لمنع أي استعادة تلقائية
export function markEntryAsDeleted(entryId: string): void {
  if (typeof window === 'undefined' || !entryId) return;
  try {
    const current = getDeletedEntryIds();
    if (!current.includes(entryId)) {
      localStorage.setItem(DELETED_ENTRIES_KEY, JSON.stringify([...current, entryId]));
    }
  } catch (e) {
    console.error('Error marking entry as deleted:', e);
  }
}

// تنسيق تواريخ أداء الغناء بدقة باللغتين العربية والإنجليزية
export function formatSingingDates(timestamp?: number): {
  dateAr: string;
  dateEn: string;
  displayDate: string;
  timeAr: string;
} {
  const d = timestamp ? new Date(timestamp) : new Date();
  const dateAr = d.toLocaleDateString('ar-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const dateEn = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const timeAr = d.toLocaleTimeString('ar-EG', {
    hour: '2-digit',
    minute: '2-digit'
  });
  return {
    dateAr,
    dateEn,
    displayDate: dateAr,
    timeAr
  };
}

// استرجاع معرفات التسجيلات التي يمتلكها المستخدم الحالي على هذا المتصفح
export function getMyOwnedEntryIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(OWNED_ENTRIES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading owned entry IDs:', e);
  }
  return [];
}

// تسجيل ملكية مشاركة للمستخدم الحالي
export function markEntryAsOwned(entryId: string): void {
  if (typeof window === 'undefined' || !entryId) return;
  try {
    const current = getMyOwnedEntryIds();
    if (!current.includes(entryId)) {
      const updated = [...current, entryId];
      localStorage.setItem(OWNED_ENTRIES_KEY, JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Error marking entry as owned:', e);
  }
}

// التحقق هل المشاركة سجلها المستخدم الحالي شخصياً على هذا المتصفح/الجهاز
export function isUserPersonalRecording(entryOrId: ContestEntry | string): boolean {
  if (typeof window === 'undefined') return false;
  const entryId = typeof entryOrId === 'string' ? entryOrId : entryOrId.id;
  const ownedIds = getMyOwnedEntryIds();
  if (ownedIds.includes(entryId)) return true;

  if (typeof entryOrId !== 'string') {
    if (entryOrId.isUserRecording) return true;
  }
  if (entryId.startsWith('entry-user-')) return true;

  return false;
}

// التحقق هل المشاركة مملوكة للمستخدم الحالي أو قابلة للإدارة من المشرف
export function isEntryOwnedByUser(entryOrId: ContestEntry | string): boolean {
  if (typeof window === 'undefined') return false;
  if (isPlatformOwner()) return true;
  return isUserPersonalRecording(entryOrId);
}

// التحقق هل المستخدم الحالي هو مالك المنصة (Admin / Owner)
export function isPlatformOwner(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return (
      localStorage.getItem('yona_cert_owner_auth') === 'true' ||
      localStorage.getItem('yona_admin_authenticated') === 'true'
    );
  } catch {
    return false;
  }
}

// تحديث اسم وبلد وتاريخ المشارك المطبوع على الشهادة مع خصوصية النشر العام
export function updateEntryCertificateName(
  entryId: string,
  customNameAr: string,
  customNameEn?: string,
  customCountry?: string,
  customDateAr?: string,
  customDateEn?: string,
  namePrivacyMode: 'private_cert_only' | 'public_everywhere' = 'private_cert_only',
  customPublicName?: string
): ContestEntry[] {
  const current = getContestEntries();
  const trimmedAr = customNameAr.trim();
  const trimmedEn = customNameEn ? customNameEn.trim() : undefined;
  const trimmedCountry = customCountry ? customCountry.trim() : undefined;
  const trimmedDateAr = customDateAr ? customDateAr.trim() : undefined;
  const trimmedDateEn = customDateEn ? customDateEn.trim() : undefined;
  const trimmedPublic = customPublicName ? customPublicName.trim() : undefined;

  const updated = current.map((entry) => {
    if (entry.id === entryId) {
      const origPublic = entry.originalPublicName || entry.singerName;
      // إذا اختار النشر العام للجميع، نحدث singerName؛ وإذا اختار خصوصية الشهادة، نحتفظ بالاسم المستعار للعامة
      const newPublicName = namePrivacyMode === 'public_everywhere'
        ? (trimmedPublic || trimmedAr || entry.singerName)
        : (trimmedPublic || entry.originalPublicName || entry.singerName);

      return {
        ...entry,
        singerName: newPublicName,
        originalPublicName: origPublic,
        publicDisplayName: newPublicName,
        customCertificateName: trimmedAr || undefined,
        customCertificateNameEn: trimmedEn || undefined,
        namePrivacyMode,
        countryOrCity: trimmedCountry || entry.countryOrCity,
        formattedDateAr: trimmedDateAr || entry.formattedDateAr,
        formattedDateEn: trimmedDateEn || entry.formattedDateEn
      };
    }
    return entry;
  });

  saveContestEntries(updated);
  return updated;
}

// تحويل ملف الصوت Blob إلى Data URL مشفر لضمان حفظه بشكل دائم بدون انتهاء صلاحية الرابط
export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert blob to data URL'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// استرجاع وإعادة مشاركة Alice (بطلة الأسبوع) إذا حذفت بالخطأ
export function restoreAliceEntry(): ContestEntry[] {
  if (typeof window === 'undefined') return INITIAL_CONTEST_ENTRIES;
  try {
    const deleted = getDeletedEntryIds().filter((id) => id !== 'entry-alice');
    localStorage.setItem(DELETED_ENTRIES_KEY, JSON.stringify(deleted));
    markEntryAsOwned('entry-alice');

    const current = getContestEntries();
    if (!current.some((e) => e.id === 'entry-alice')) {
      const aliceEntry = INITIAL_CONTEST_ENTRIES[0];
      const updated = [aliceEntry, ...current];
      saveContestEntries(updated);
      window.dispatchEvent(new CustomEvent('yona_contest_updated', { detail: updated }));
      return updated;
    }
  } catch (e) {
    console.error('Error restoring Alice entry:', e);
  }
  return getContestEntries();
}

// قراءة المشاركات من التخزين المحلي مع استبعاد المحذوفة نهائياً
export function getContestEntries(): ContestEntry[] {
  if (typeof window === 'undefined') return INITIAL_CONTEST_ENTRIES;
  try {
    const deletedIds = new Set(getDeletedEntryIds());
    const saved = localStorage.getItem(STORAGE_KEY);
    let parsed: ContestEntry[];

    if (saved) {
      try {
        const rawList = JSON.parse(saved);
        parsed = Array.isArray(rawList) ? rawList : [...INITIAL_CONTEST_ENTRIES];
      } catch {
        parsed = [...INITIAL_CONTEST_ENTRIES];
      }
    } else {
      parsed = [...INITIAL_CONTEST_ENTRIES];
      safeSetLocalStorage(STORAGE_KEY, JSON.stringify(parsed));
    }

    // استبعاد أي مشاركة محذوفة نهائياً بواسطة المستخدم أو الإدارة
    parsed = parsed.filter((e) => !deletedIds.has(e.id));

    // فحص واستعادة أي ملف صوتي محفوظ في IndexedDB للمشاركات
    parsed = parsed.map((entry) => {
      if (entry.audioUrl && entry.audioUrl.startsWith('idb:')) {
        const key = entry.audioUrl.replace('idb:', '');
        const cached = getCachedAudioUrl(key);
        if (cached) {
          return { ...entry, audioUrl: cached };
        } else {
          getAudioFromIndexedDB(key).then((loaded) => {
            if (loaded) {
              entry.audioUrl = loaded;
              window.dispatchEvent(new CustomEvent('yona_contest_updated'));
            }
          }).catch(() => {});
        }
      }
      return entry;
    });

    return parsed;
  } catch (e) {
    console.error('Error reading contest entries from storage:', e);
  }
  return INITIAL_CONTEST_ENTRIES.filter((e) => !getDeletedEntryIds().includes(e.id));
}

// حفظ وتحديث المشاركات مع تفريغ الصوتيات الكبيرة إلى IndexedDB لمنع تجاوز سعة localStorage
export function saveContestEntries(entries: ContestEntry[]): void {
  if (typeof window === 'undefined') return;

  try {
    const deletedIds = new Set(getDeletedEntryIds());
    const filtered = entries.filter((e) => !deletedIds.has(e.id));

    // معالجة الصوتيات الضخمة: تخزينها في IndexedDB وحفظ مرجع خفيف في localStorage
    const sanitizedEntries = filtered.map((entry) => {
      if (entry.audioUrl && (entry.audioUrl.startsWith('data:') || entry.audioUrl.startsWith('blob:'))) {
        const audioKey = `contest_audio_${entry.id}`;
        saveAudioToIndexedDB(audioKey, entry.audioUrl).catch((err) => {
          console.warn('Could not offload audio to IndexedDB:', err);
        });

        if (entry.id === 'entry-alice') {
          saveAudioToIndexedDB('alice_recorded_voice', entry.audioUrl).catch(() => {});
        }

        // إذا كان رابط base64 كبيراً، نحفظ مؤشراً صغيراً في localStorage
        if (entry.audioUrl.length > 50000) {
          return {
            ...entry,
            audioUrl: `idb:${audioKey}`
          };
        }
      }
      return entry;
    });

    safeSetLocalStorage(STORAGE_KEY, JSON.stringify(sanitizedEntries));
    window.dispatchEvent(new CustomEvent('yona_contest_updated', { detail: filtered }));
  } catch (e) {
    console.error('Error saving contest entries to storage:', e);
  }
}

// إضافة مشاركة جديدة
export function addContestEntry(entry: ContestEntry): ContestEntry[] {
  const current = getContestEntries();
  const nowTimestamp = entry.exactTimestamp || Date.now();
  const dateInfo = formatSingingDates(nowTimestamp);

  const finalPublicName = entry.originalPublicName || entry.singerName;
  const participantToken = entry.participantToken || `token-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const certNumber = entry.certificateNumber || `YS-CERT-${(entry.singerName || 'VOCAL')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 4) || 'GOLD'}-${Math.floor(entry.score * 100)}-2026`;

  const preparedEntry: ContestEntry = {
    ...entry,
    originalPublicName: finalPublicName,
    exactTimestamp: nowTimestamp,
    formattedDateAr: entry.formattedDateAr || dateInfo.dateAr,
    formattedDateEn: entry.formattedDateEn || dateInfo.dateEn,
    certificateNumber: certNumber,
    participantToken,
    isUserRecording: true
  };

  markEntryAsOwned(preparedEntry.id);

  // إزالة المعرف من قائمة المحذوفات إن وجد سابقاً
  if (typeof window !== 'undefined') {
    try {
      const deleted = getDeletedEntryIds().filter((id) => id !== preparedEntry.id);
      localStorage.setItem(DELETED_ENTRIES_KEY, JSON.stringify(deleted));
    } catch {}
  }

  const updated = [preparedEntry, ...current.filter((e) => e.id !== preparedEntry.id)];
  saveContestEntries(updated);
  return updated;
}

// التصويت لمشارك
export function voteForContestEntry(entryId: string): ContestEntry[] {
  const current = getContestEntries();
  const updated = current.map((item) => {
    if (item.id === entryId) {
      const alreadyVoted = item.hasVoted;
      return {
        ...item,
        votes: alreadyVoted ? Math.max(0, item.votes - 1) : item.votes + 1,
        hasVoted: !alreadyVoted
      };
    }
    return item;
  });
  saveContestEntries(updated);
  return updated;
}

// اختيار الأداء وتتويجه كأفضل صوت / فائز
export function toggleSelectBestContestEntry(
  entryId: string,
  rank: 'first' | 'second' | 'third' | 'jury_pick' = 'first',
  notes?: string
): ContestEntry[] {
  const current = getContestEntries();
  const updated = current.map((item) => {
    if (item.id === entryId) {
      const isCurrentlySelected = item.isSelectedBest && item.bestRank === rank;
      if (isCurrentlySelected) {
        return {
          ...item,
          isSelectedBest: false,
          bestRank: null,
          badge: undefined,
          juryNotes: undefined
        };
      } else {
        const badgeText =
          rank === 'first'
            ? ' المركز الأول (اختيار لجنة التحكيم)'
            : rank === 'second'
            ? ' المركز الثاني (المتسابق المتميز)'
            : rank === 'third'
            ? ' المركز الثالث (الأداء المبدع)'
            : ' اختيار الجمهور ولجنة التحكيم';
        return {
          ...item,
          isSelectedBest: true,
          bestRank: rank,
          selectedAt: new Date().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
          badge: badgeText,
          juryNotes: notes || item.juryNotes || 'أداء استثنائي تم اختياره ضمن نخبة أصوات الأسبوع!'
        };
      }
    }
    return item;
  });
  saveContestEntries(updated);
  return updated;
}

// حذف مشاركة نهائياً (للمتسابق أو الإدارة)
export function deleteContestEntry(entryId: string): ContestEntry[] {
  if (!entryId) return getContestEntries();

  // 1. وسم المعرف كمحذوف نهائياً لمنع أي استعادة تلقائية
  markEntryAsDeleted(entryId);

  // 2. حذف المعرف من قائمة ملكية المستخدم
  if (typeof window !== 'undefined') {
    try {
      const owned = getMyOwnedEntryIds().filter((id) => id !== entryId);
      localStorage.setItem(OWNED_ENTRIES_KEY, JSON.stringify(owned));
    } catch (e) {
      console.error('Error updating owned entries:', e);
    }
  }

  // 3. تنظيف الصوتيات من IndexedDB و localStorage
  if (typeof window !== 'undefined') {
    try {
      deleteAudioFromIndexedDB(`contest_audio_${entryId}`).catch(() => {});
      if (entryId === 'entry-alice') {
        localStorage.removeItem('alice_recorded_voice');
        deleteAudioFromIndexedDB('alice_recorded_voice').catch(() => {});
      }
    } catch (e) {
      console.error('Error cleaning audio on delete:', e);
    }
  }

  // 4. تصفية القائمة وحفظها وتوزيع الحدث لجميع المكونات
  const current = getContestEntries();
  const updated = current.filter((e) => e.id !== entryId);
  saveContestEntries(updated);

  window.dispatchEvent(new CustomEvent('yona_contest_updated', { detail: updated }));
  return updated;
}

// تعديل يدوي شامل لمشاركة متسابق بواسطة المشرف / المالك (Score, Song Title, Notes, etc.)
export function updateContestEntryManual(
  entryId: string,
  updates: Partial<ContestEntry>
): ContestEntry[] {
  const current = getContestEntries();
  const updated = current.map((item) => {
    if (item.id === entryId) {
      const nextScore = typeof updates.score === 'number' ? updates.score : item.score;
      let nextRankTitle = item.rankTitle;
      if (typeof updates.score === 'number') {
        if (nextScore >= 95) nextRankTitle = '🌟 أداء استثنائي فائق النقاء';
        else if (nextScore >= 85) nextRankTitle = '✨ موهبة غنائية بارعة';
        else if (nextScore >= 70) nextRankTitle = '🎵 أداء واعد ومتميز';
        else if (nextScore >= 45) nextRankTitle = '🎙️ محاولة صوتية حرة';
        else nextRankTitle = '⚠️ أداء تجريبي / لم تكتمل الكلمات';
      }

      return {
        ...item,
        ...updates,
        score: nextScore,
        rankTitle: updates.rankTitle || nextRankTitle
      };
    }
    return item;
  });

  saveContestEntries(updated);
  window.dispatchEvent(new CustomEvent('yona_contest_updated', { detail: updated }));
  return updated;
}
