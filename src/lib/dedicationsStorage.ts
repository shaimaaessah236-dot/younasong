export interface FanDedicationOrRequest {
  id: string;
  type: 'song_request' | 'dedication';
  senderName: string;
  recipientName?: string;
  songTitle: string;
  animeOrSpacetoon: string;
  message: string;
  upvotes: number;
  date: string;
  status: 'pending' | 'in_production' | 'completed';
  upvotedByMe?: boolean;
}

const STORAGE_KEY = 'yona_fan_dedications_v1';

export const INITIAL_DEDICATIONS: FanDedicationOrRequest[] = [
  {
    id: 'ded-1',
    type: 'dedication',
    senderName: 'يوسف العراقي',
    recipientName: 'إلى صديق الطفولة حمزة',
    songTitle: 'شارة عهد الأصدقاء',
    animeOrSpacetoon: 'سبيستون كلاسيك',
    message: 'إلى رفيق دربي حمزة.. مهما تفرقت بنا الدروب والسنوات، يبقى "عهد الأصدقاء" أوفى وعد جمعنا على البراءة والوفاء ',
    upvotes: 48,
    date: 'منذ 3 ساعات',
    status: 'completed',
    upvotedByMe: false
  },
  {
    id: 'req-1',
    type: 'song_request',
    senderName: 'سارة من المغرب',
    songTitle: 'شارة ريمي (أمي كم أهواها)',
    animeOrSpacetoon: 'دروب ريمي',
    message: 'نرجوكِ يا يونا تسجلي شارة ريمي بنقاء الأكابيلا الكامل بدون أي آلات.. صوتك يحمل دفء الأمومة وحنين البراءة ',
    upvotes: 112,
    date: 'أمس',
    status: 'in_production',
    upvotedByMe: true
  },
  {
    id: 'ded-2',
    type: 'dedication',
    senderName: 'مريم الزهراني',
    recipientName: 'إلى أختي شهد بمناسبة تخرجها',
    songTitle: 'شارة سندريلا',
    animeOrSpacetoon: 'سبيستون زمن الطيبين',
    message: 'لأحلى أخت وسندريلا في الدنيا، تخرجك كان حلم وأصبح حقيقة جميلة مثل حكايات سبيستون ',
    upvotes: 35,
    date: 'منذ يومين',
    status: 'completed',
    upvotedByMe: false
  },
  {
    id: 'req-2',
    type: 'song_request',
    senderName: 'عمر القحطاني',
    songTitle: 'شارة هزيم الرعد',
    animeOrSpacetoon: 'كوكب مغامرات',
    message: 'نريد ملحمة هزيم الرعد بطبقات صوتية وتناغم بشري حماسي يزلزل الذكريات!',
    upvotes: 89,
    date: 'منذ 4 أيام',
    status: 'pending',
    upvotedByMe: false
  },
  {
    id: 'req-3',
    type: 'song_request',
    senderName: 'ليلى الشامي',
    songTitle: 'شارة أنا وأخي (شوق يدفعني لأراها)',
    animeOrSpacetoon: 'سبيستون كوكب زمردة',
    message: 'هذه الشارة تبكينا جميعاً.. تسجيلها بصوت بشري دافئ نقي سيكون تحفة خالدة في هذا الأرشيف ',
    upvotes: 94,
    date: 'منذ 5 أيام',
    status: 'in_production',
    upvotedByMe: false
  }
];

export function getDedications(): FanDedicationOrRequest[] {
  if (typeof window === 'undefined') return INITIAL_DEDICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEDICATIONS));
      return INITIAL_DEDICATIONS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load dedications', e);
    return INITIAL_DEDICATIONS;
  }
}

export function saveDedications(items: FanDedicationOrRequest[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save dedications', e);
  }
}

export function addDedication(item: Omit<FanDedicationOrRequest, 'id' | 'upvotes' | 'date' | 'status' | 'upvotedByMe'>): FanDedicationOrRequest {
  const all = getDedications();
  const newItem: FanDedicationOrRequest = {
    ...item,
    id: `item-${Date.now()}`,
    upvotes: 1,
    upvotedByMe: true,
    date: 'الآن',
    status: 'pending'
  };
  const updated = [newItem, ...all];
  saveDedications(updated);
  return newItem;
}

export function toggleUpvoteDedication(id: string): FanDedicationOrRequest[] {
  const all = getDedications();
  const updated = all.map(item => {
    if (item.id === id) {
      const isUpvoted = !!item.upvotedByMe;
      return {
        ...item,
        upvotedByMe: !isUpvoted,
        upvotes: isUpvoted ? Math.max(0, item.upvotes - 1) : item.upvotes + 1
      };
    }
    return item;
  });
  saveDedications(updated);
  return updated;
}
