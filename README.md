# 🎶 YONA SONGS - Official Platform & Audio Engine

المنصة العربية المتكاملة لشارات سبيستون وأغاني الأنمي الكلاسيكية بتسجيلات صوتية حصرية نقية بدون موسيقى (Vocals Only)، مع استوديو تأليف الأغاني بالذكاء الاصطناعي (Studio Youna)، تلفزيون كرتون سبيستون، مختبر هندسة وعزل الصوت، ومسابقات التحدي الغنائي.

---

## 🌟 مميزات المشروع (Key Features)

1. **مكتبة الشارات الموسيقية (Tracks Archive & 2-Row Carousel):**
   - استعراض الشارات مع كلمات حية، تحليلات النغمات الموسيقية (BPM & Musical Key)، وفيديو يوتيوب مدمج.
   - مصفوفة تصفح متطورة (سطرين × 3 أعمدة = 6 عناصر) مع دعم كامل للاتجاهين (RTL / LTR) وإخفاء أشرطة التمرير.

2. **استوديو يونا للتأليف والغناء (Studio Youna):**
   - تأليف الكلمات العربية الفصحى على بحور الشعر مع ضبط القوافي.
   - محرك غناء تفاعلي (Singing Voice Engine) بأصوات متعددة (صوت نسائي نقي، صوت رجالي، كورال، وأكابيلا).
   - مزامنة كاريوكي حية للكلمات مع إمكانية تنزيل الصوت بصيغة WAV/MP3.

3. **تلفزيون سبيستون الكلاسيكي (Spacetoon CRT TV Hub):**
   - قنوات كواكب سبيستون (أكشن، زمردة، مغامرات، رياضة، كوميديا، علوم...).
   - ميكروفون الدوبلاژ ومعلق سبيستون مع فلاتر صوتية حية.

4. **مختبر معالجة وعزل الصوت (Audio Engineering Lab):**
   - عزل الصوت البشري عن الموسيقى (AI Stem Separation).
   - حاسبة الإيقاع (Tap BPM Counter)، وكاشف السلم والمقام الموسيقي.

5. **المسابقات ومجتمع الجمهور (Contests & Community):**
   - لوحة الشرف وأصوات الفائزين مع حماية نزاهة التصويت (Anti-Fraud Device Token).
   - شهادات التقدير الرسمية والستوري كارد للنشر على منصات التواصل.

6. **متجر المنتجات والكتب الرسمية (Official Store):**
   - ربط مباشر بمتجر Amazon لشراء الكتب والمطبوعات المعتمدة.

---

## 🛠️ التقنيات المستخدمة (Tech Stack)

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Web Audio API, Canvas.
- **Backend:** Node.js, Express, tsx.
- **AI Engine:** Google Gen AI SDK (`@google/genai`).
- **Database & Auth:** Firebase Firestore & Firebase Authentication.
- **Build Tool:** Vite.

---

## 🚀 كيفية تشغيل المشروع محلياً (Local Setup)

### 1. تثبيت الحزم (Install Dependencies)
```bash
npm install
```

### 2. إعداد المتغيرات البيئية (Environment Variables)
انسخ ملف `.env.example` إلى `.env`:
```bash
cp .env.example .env
```
أضف مفتاح Gemini API في ملف `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. تشغيل الخادم التجريبي (Run Development Server)
```bash
npm run dev
```
افتح المتصفح على: `http://localhost:3000`

### 4. بناء المشروع للإنتاج (Production Build)
```bash
npm run build
npm start
```

---

## 📦 رفع المشروع إلى GitHub (Pushing to GitHub)

1. فك ضغط ملف الـ ZIP على جهازك.
2. افتح مجلد المشروع في الـ Terminal أو Git Bash.
3. قم بتنفيذ الأوامر التالية:

```bash
git init
git add .
git commit -m "Initial commit - YONA SONGS Platform"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/yona-songs.git
git push -u origin main
```

---

## 📄 الترخيص (License)
جميع الحقوق محفوظة لمنصة **YONA SONGS © 2026**.
