import React, { useState } from 'react';
import {
  ShoppingBag,
  BookOpen,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Globe2,
  Award,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Mail,
  Layers,
  Palette,
  Music,
  Bookmark,
  ZoomIn,
  X
} from 'lucide-react';
import shomiSmithBookCoverImg from '../assets/images/shomi_smith_book_cover_1790874579246.jpg';
import { useLanguage } from '../context/LanguageContext';

interface OfficialProductsStoreProps {
  onNavigateToDirectory?: () => void;
  onNavigateToStudio?: () => void;
}

const AMAZON_BOOK_URL =
  'https://www.amazon.com/World-Day-Culture-Development-Enthusiasts/dp/B0F9F8BF96/ref=sr_1_1?crid=PX08IZ8966N9&dib=eyJ2IjoiMSJ9.S6u7RYs5o09FZfWZW7e1vg.do4kVPyMo9C_2o07aK91v8ipQwD0l2J6JUmjEOmKplo&dib_tag=se&keywords=shomi+smith&qid=1790873180&s=books&sprefix=shomi+smith%2Cstripbooks-intl-ship%2C452&sr=1-1';

export const OfficialProductsStore: React.FC<OfficialProductsStoreProps> = ({
  onNavigateToDirectory,
}) => {
  const { language, isRtl, t } = useLanguage();
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribedData, setSubscribedData] = useState<{ email: string; code: string } | null>(null);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'books' | 'brand_upcoming'>('all');
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscriptionError(null);
    const cleanEmail = emailInput.trim().toLowerCase();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setSubscriptionError(
        language === 'ar'
          ? 'يرجى إدخال بريد إلكتروني صحيح للتوصل بالإشعار الفوري والخصم.'
          : 'Please enter a valid email address to receive priority alert and voucher.'
      );
      return;
    }

    try {
      const waitlist = JSON.parse(localStorage.getItem('yona_store_waitlist') || '[]');
      if (!waitlist.includes(cleanEmail)) {
        waitlist.push(cleanEmail);
        localStorage.setItem('yona_store_waitlist', JSON.stringify(waitlist));
      }

      const vipSubscribers = JSON.parse(localStorage.getItem('yona_vip_brand_subscribers') || '[]');
      if (!vipSubscribers.includes(cleanEmail)) {
        vipSubscribers.push(cleanEmail);
        localStorage.setItem('yona_vip_brand_subscribers', JSON.stringify(vipSubscribers));
      }
    } catch (err) {
      console.error('Storage error:', err);
    }

    const discountCode = 'BRAND-VIP-25';
    setSubscribedData({ email: cleanEmail, code: discountCode });
    setIsSubscribed(true);
    setEmailInput('');
  };

  const handleCopyCoupon = () => {
    if (subscribedData) {
      navigator.clipboard.writeText(subscribedData.code);
      setCopiedCoupon(true);
      setTimeout(() => setCopiedCoupon(false), 2500);
    }
  };

  const upcomingProducts = [
    {
      id: 'journal-1',
      title: language === 'ar' ? 'دفتر مذكرات ونوتات سبيستون الفاخر' : 'Luxury Spacetoon Notes & Journal',
      category: language === 'ar' ? 'مقتنيات ورقية' : 'Stationery',
      description: language === 'ar'
        ? 'دفتر فاخر مخصص لتدوين الكلمات، النوتات الموسيقية، والأفكار الإبداعية مع رسومات حصرية لأبطال الكواكب.'
        : 'Premium notebook designed for lyrics, musical notes, and creative ideas with exclusive illustrations.',
      tag: language === 'ar' ? 'قريباً' : 'Coming Soon',
      icon: BookOpen
    },
    {
      id: 'apparel-1',
      title: language === 'ar' ? 'هودي وتيشيرت شارات الزمن الجميل' : 'Vintage Theme Hoodie & Apparel',
      category: language === 'ar' ? 'أزياء وملابس' : 'Apparel',
      description: language === 'ar'
        ? 'أزياء مريحة عالية الجودة بتطريز أنيق يعبّر عن ذكريات الطفولة وشارات الأنمي الأسطورية.'
        : 'High quality comfortable cotton apparel with elegant embroidery celebrating classic anime memories.',
      tag: language === 'ar' ? 'قيد التصميم' : 'In Design',
      icon: Palette
    },
    {
      id: 'art-cards-1',
      title: language === 'ar' ? 'مجموعة بطاقات كواكب سبيستون الذهبية' : 'Golden Planetary Collector Cards',
      category: language === 'ar' ? 'مجموعات تذكارية' : 'Collectibles',
      description: language === 'ar'
        ? 'بطاقات فنية ملونة ومطلية بلمسات ذهبية تمثل كواكب المغامرات، الزمردة، رياضة، وأكشن.'
        : 'Art cards with metallic gold foil finish representing classic adventure, emerald, and action planets.',
      tag: language === 'ar' ? 'إصدار محدود' : 'Limited Edition',
      icon: Award
    },
    {
      id: 'studio-mug-1',
      title: language === 'ar' ? 'كوب الاستوديو الفني Yona Official' : 'Official Yona Studio Ceramic Mug',
      category: language === 'ar' ? 'إكسسوارات الاستوديو' : 'Accessories',
      description: language === 'ar'
        ? 'كوب سيراميك حراري يحافظ على دفء مشروبك أثناء جلسات الغناء والتدريب الصوتي.'
        : 'Thermal ceramic mug keeping your drink warm during vocal training and recording sessions.',
      tag: language === 'ar' ? 'قريباً' : 'Coming Soon',
      icon: Music
    }
  ];

  return (
    <div className={`space-y-10 animate-in fade-in duration-300 pb-12 ${isRtl ? 'dir-rtl text-right' : 'dir-ltr text-left'}`}>
      {/* Header Banner */}
      <div className="relative rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/30 bg-gradient-to-b from-[#131a2b] via-[#0f1422] to-[#0a0d16] shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-950/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'متجر المنتجات والمطبوعات الرسمية' : t('storeHeaderTitle', 'Official Store & Books')}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {language === 'ar'
              ? 'لشراء منتوجاتنا وكتبنا الرسمية عبر Amazon'
              : 'Official Store & Books Available on Amazon'}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            {t('storeHeaderSubtitle', language === 'ar' ? 'استكشف واطلب الكتب والمطبوعات الرسمية المعتمدة لمنصة YONA مباشرة من متجر Amazon بشحن دولي آمن وسريع.' : 'Explore and order official YONA books directly from Amazon.')}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={AMAZON_BOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-400/25 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 fill-black" />
              <span>{language === 'ar' ? 'تصفح المتجر على Amazon' : t('storeBuyOnAmazon', 'Shop Now on Amazon')}</span>
              <ExternalLink className="w-3.5 h-3.5 mx-1" />
            </a>

            {onNavigateToDirectory && (
              <button
                type="button"
                onClick={onNavigateToDirectory}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-sm font-bold transition-all cursor-pointer flex items-center gap-2"
              >
                <span>{language === 'ar' ? 'العودة للقناة الرسمية' : t('storeReturnToDir', 'Return to Main Channel')}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 flex-wrap">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t('storeAllProducts', language === 'ar' ? 'جميع المنتجات' : 'All Products')}
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('books')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === 'books'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t('storeBooksOnly', language === 'ar' ? 'الكتب والمطبوعات الرسمية' : 'Official Books')}
        </button>
        <button
          type="button"
          onClick={() => setSelectedCategory('brand_upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            selectedCategory === 'brand_upcoming'
              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-sm'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          {t('storeUpcomingBrand', language === 'ar' ? 'منتجات البراند القادمة' : 'Upcoming Merch')}
        </button>
      </div>

      {/* Featured Main Book Section (Amazon Live Book) */}
      {(selectedCategory === 'all' || selectedCategory === 'books') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <span>{language === 'ar' ? 'الكتاب المطبوع المتاح الآن على Amazon' : t('storeAmazonLiveBook', 'Official Printed Book Live on Amazon')}</span>
            </h2>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'متوفر للطلب المباشر' : t('storeInStockReady', 'In Stock & Ready')}</span>
            </span>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0e1422] p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-xl">
            {/* Book Visual Mockup / Cover Representation */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div
                onClick={() => setIsZoomOpen(true)}
                className="relative group w-full max-w-[280px] rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-2xl shadow-black/80 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-amber-400/80 bg-black/60"
              >
                <img
                  src={shomiSmithBookCoverImg}
                  alt="World Day for Cultural Diversity by Shomi Smith - Amazon Official Book"
                  className="w-full h-auto object-cover rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-102"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                  <span className="px-3.5 py-1.5 rounded-xl bg-black/80 text-amber-300 text-xs font-bold border border-amber-400/40 flex items-center gap-1.5 shadow-lg backdrop-blur-sm">
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'انقر لتكبير صورة الغلاف' : 'Click to Zoom Cover'}</span>
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 pt-2 flex items-center gap-1 font-mono">
                <span>ASIN: B0F9F8BF96</span>
                <span>•</span>
                <span>Paperback</span>
              </p>
            </div>

            {/* Book Details & Buy Section */}
            <div className={`lg:col-span-8 space-y-6 ${isRtl ? 'text-right' : 'text-left'}`}>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30 text-xs font-bold">
                    {language === 'ar' ? 'كتاب رسمي معتمد' : 'Official Verified Book'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-gray-300 text-xs">
                    Shomi Smith
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-sky-500/10 text-sky-300 border border-sky-500/20 text-xs font-mono">
                    Paperback Edition
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  World Day for Cultural Diversity for Dialogue and Development: Creative Workbook and Enthusiasts Guide
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  {language === 'ar' ? 'بقلم الكاتب:' : 'By Author:'}{' '}
                  <span className="text-amber-300 font-semibold">Shomi Smith</span>
                </p>
              </div>

              <p className="text-sm text-gray-300 leading-relaxed">
                {language === 'ar'
                  ? 'دليل ومصنف إبداعي وتفاعلي ملهم، يجمع بين الأنشطة الثقافية، الحوار، وتنمية المهارات الإبداعية. مصمم خصيصاً للمتحمسين والشغوفين بالثقافة المتنوعة، الفنون، والتطوير الذاتي. يعد إضافة استثنائية لمكتبتك الإبداعية والشخصية.'
                  : 'An inspiring creative workbook and interactive guide combining cultural dialogue, diversity, and artistic skill development. Designed for cultural enthusiasts, music lovers, and self-developers.'}
              </p>

              {/* Highlights & Guarantees */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold">
                    <Globe2 className="w-4 h-4" />
                    <span>{language === 'ar' ? 'شحن وتوصيل عالمي' : 'Global Delivery'}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {language === 'ar'
                      ? 'متاح للشحن الدولي المباشر من مستودعات أمازون الرسمية.'
                      : 'Available for direct worldwide shipping from Amazon fulfillment centers.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>{language === 'ar' ? 'شراء آمن 100%' : '100% Secure Checkout'}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {language === 'ar'
                      ? 'معاملات دفع محمية مع خدمة عملاء أمازون الموثوقة.'
                      : 'Encrypted payments backed by trusted Amazon buyer protection.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.07] space-y-1">
                  <div className="flex items-center gap-1.5 text-teal-300 text-xs font-bold">
                    <Layers className="w-4 h-4" />
                    <span>{language === 'ar' ? 'طباعة ورقية فاخرة' : 'Premium Print Quality'}</span>
                  </div>
                  <p className="text-[11px] text-gray-400">
                    {language === 'ar'
                      ? 'جودة طباعة عالية وأوراق مناسبة للكتابة والتدوين.'
                      : 'High-grade paper ideal for writing, journaling and daily study.'}
                  </p>
                </div>
              </div>

              {/* CTA Buy Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={AMAZON_BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold text-sm flex items-center gap-2 shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 fill-black" />
                  <span>{language === 'ar' ? 'اطلب نسختك الآن من Amazon' : 'Order Your Copy on Amazon'}</span>
                  <ExternalLink className="w-4 h-4 mx-1" />
                </a>

                <a
                  href={AMAZON_BOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
                >
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <span>{language === 'ar' ? 'معاينة تفاصيل المنتج على أمازون' : 'View Product Details on Amazon'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upcoming Official Brand Section */}
      {(selectedCategory === 'all' || selectedCategory === 'brand_upcoming') && (
        <div className="space-y-6 pt-6 border-t border-white/10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'البراند الحصري لـ Yona Songs' : 'Yona Songs Official Exclusive Brand'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {language === 'ar' ? 'تشكيلة المنتجات والمقتنيات القادمة' : 'Upcoming Brand Products & Collectibles'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              {language === 'ar'
                ? 'نعمل حالياً على تجهيز خط إنتاج مخصص لعشاق المنصة ومحبي شارات الأنمي الكلاسيكية والإبداع الموسيقي.'
                : 'We are curating a custom line of collectibles for pure vocal lovers and anime nostalgia fans.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingProducts.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl bg-[#0f1422] border border-white/[0.08] hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between gap-4 ${
                    isRtl ? 'text-right' : 'text-left'
                  } group shadow-lg`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-amber-300">
                        {item.tag}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-gray-400 font-medium block">
                        {item.category}
                      </span>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                        {item.title}
                      </h4>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-gray-400">
                    <span>{language === 'ar' ? 'الحالة: قيد الإعداد' : 'Status: Preparing'}</span>
                    <span className="text-amber-400 font-bold">Yona Brand</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Waitlist / VIP Priority Box */}
          <div className={`p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#121829] via-[#0d1320] to-[#121829] border-2 border-amber-400/40 shadow-2xl space-y-4 ${
            isRtl ? 'text-right' : 'text-left'
          } relative overflow-hidden`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div className="space-y-1.5 max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-bold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>VIP Early Access</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-amber-400" />
                  <span>{language === 'ar' ? 'احصل على أولوية الطلب وإشعار الإطلاق كعضو VIP' : t('storeVipWaitlistTitle', 'Get VIP Priority Alert & Discount')}</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {language === 'ar' ? 'سجل بريدك الإلكتروني لتصلك دعوة الإطلاق الفورية وحجز أول دفعة محدودة مع كود خصم 25%.' : t('storeVipWaitlistSubtitle', 'Enter your email for instant launch invites, 25% discount, and priority access.')}
                </p>
              </div>

              <form onSubmit={handleSubscribe} className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2 relative z-10">
                <input
                  type="email"
                  required
                  placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني هنا...' : t('storeEmailPlaceholder', 'Enter your email address...')}
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full sm:w-64 px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-amber-400 font-mono"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-black font-extrabold text-xs shadow-lg shadow-amber-400/25 cursor-pointer transition-all whitespace-nowrap active:scale-95"
                >
                  {language === 'ar' ? 'تأكيد التسجيل وتفعيل الخصم' : t('storeSubscribeBtn', 'Subscribe & Get VIP Pass')}
                </button>
              </form>
            </div>

            {subscriptionError && (
              <p className="text-xs text-rose-400 font-medium text-center pt-1 bg-rose-950/30 p-2 rounded-xl border border-rose-500/20">
                {subscriptionError}
              </p>
            )}

            {isSubscribed && (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2 pt-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'تم تأكيد تسجيل بريدك بنجاح وضمان وصول الإشعار الفوري مع كود الخصم!'
                    : 'Your email has been registered for VIP priority notification with 25% discount!'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIP BRAND LAUNCH CONFIRMATION MODAL */}
      {subscribedData && (
        <div
          onClick={() => setSubscribedData(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative max-w-md w-full bg-[#121622] border-2 border-amber-400/50 rounded-3xl p-6 shadow-2xl space-y-5 ${
              isRtl ? 'text-right' : 'text-left'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5 text-amber-400">
                <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {language === 'ar' ? 'تأكيد عضوية VIP وإشعار الإطلاق' : 'VIP Priority Membership Confirmation'}
                  </h3>
                  <p className="text-xs text-amber-300 font-mono">Yona Brand Official VIP Launch Pass</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubscribedData(null)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-400/30 space-y-1">
                <span className="text-[11px] text-gray-400 block">
                  {language === 'ar' ? 'البريد الإلكتروني المسجل للإشعار:' : 'Registered Priority Email:'}
                </span>
                <span className="text-xs font-bold text-amber-200 font-mono dir-ltr block text-left">
                  {subscribedData.email}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-950/30 border border-amber-400/50 space-y-2 text-center">
                <span className="text-[11px] text-amber-300 font-bold block">
                  {language === 'ar'
                    ? 'كود الخصم الحصري للإطلاق (خصم 25% فوري):'
                    : 'Exclusive 25% Instant Launch Voucher:'}
                </span>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg font-black text-amber-300 font-mono tracking-wider bg-black/60 px-4 py-1.5 rounded-xl border border-amber-400/40 shadow-inner">
                    {subscribedData.code}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyCoupon}
                    className="px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer"
                  >
                    {copiedCoupon
                      ? (language === 'ar' ? 'تم نسخ كود الخصم!' : t('storeCopied', 'Code Copied!'))
                      : (language === 'ar' ? 'نسخ كود الخصم' : t('storeCopyCoupon', 'Copy Voucher Code'))}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {language === 'ar'
                      ? 'تأكيد وصول الإشعار: مفعل ومضمون لبريدك فور الطرح.'
                      : 'Priority Alert: Activated for instant notification on release day.'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {language === 'ar'
                      ? 'خدمات VIP: أولوية الطلب قبل نفاد الكمية المحدودة.'
                      : 'VIP Advantage: First access before limited supply sells out.'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSubscribedData(null)}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs shadow-lg shadow-amber-400/20 transition-all cursor-pointer"
              >
                {language === 'ar' ? 'إغلاق' : t('close', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOOK COVER FULL ZOOM MODAL */}
      {isZoomOpen && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-[#121622] border border-amber-400/40 rounded-3xl p-4 sm:p-6 shadow-2xl space-y-4 text-center"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className={isRtl ? 'text-right' : 'text-left'}>
                <h4 className="text-sm font-bold text-white">
                  {language === 'ar' ? 'غلاف الكتاب الرسمي' : 'Official Book Cover'}
                </h4>
                <p className="text-[11px] text-amber-300">Shomi Smith • Amazon Edition</p>
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[3/4] w-full max-h-[70vh] rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={shomiSmithBookCoverImg}
                alt="World Day for Cultural Diversity by Shomi Smith"
                className="w-full h-full object-contain bg-black/40"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-gray-300 text-xs font-bold transition-all cursor-pointer"
              >
                {language === 'ar' ? 'إغلاق' : t('close', 'Close')}
              </button>
              <a
                href={AMAZON_BOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-400/30 transition-all cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5 fill-black" />
                <span>{language === 'ar' ? 'تصفح المتجر على Amazon' : t('storeBuyOnAmazon', 'Shop Now on Amazon')}</span>
                <ExternalLink className="w-3.5 h-3.5 mx-1" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
