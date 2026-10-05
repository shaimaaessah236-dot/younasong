import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Translations, songTitleTranslations, animeTitleTranslations } from '../locales/translations';

export type Language = 'ar' | 'en';

export interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  translateSong: (arTitle?: string) => string;
  translateAnime: (arAnime?: string) => string;
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'ar',
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (key: string, fallback?: string) => fallback || key,
  translateSong: (title) => title || '',
  translateAnime: (anime) => anime || '',
  isRtl: true,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'ar';
    try {
      const saved = localStorage.getItem('yona_app_language');
      if (saved === 'en' || saved === 'ar') return saved;
    } catch {
      // ignore
    }
    return 'ar';
  });

  const isRtl = language === 'ar';

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('yona_app_language', language);
    } catch {
      // ignore
    }

    // Update document attributes for accessibility & layout
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = language;

    if (isRtl) {
      document.body.classList.remove('font-sans', 'dir-ltr');
      document.body.classList.add('font-cairo', 'dir-rtl');
    } else {
      document.body.classList.remove('font-cairo', 'dir-rtl');
      document.body.classList.add('font-sans', 'dir-ltr');
    }
  }, [language, isRtl]);

  const toggleLanguage = () => {
    setLanguageState((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string, fallback?: string): string => {
    const entry = translations[key];
    if (entry && entry[language]) {
      return entry[language];
    }
    return fallback !== undefined ? fallback : key;
  };

  const translateSong = (arTitle?: string): string => {
    if (!arTitle) return '';
    if (language === 'ar') return arTitle;
    
    // Direct match
    if (songTitleTranslations[arTitle]) return songTitleTranslations[arTitle];

    // Cleaned match
    const trimmed = arTitle.trim();
    if (songTitleTranslations[trimmed]) return songTitleTranslations[trimmed];

    // Substring lookup
    for (const [key, val] of Object.entries(songTitleTranslations)) {
      if (arTitle.includes(key)) {
        return arTitle.replace(key, val).replace(/بدون موسيقى/g, 'Vocals Only').replace(/أغنية/g, 'Song').replace(/شارة/g, 'Theme');
      }
    }

    // Common term substitutions
    let converted = arTitle
      .replace(/بدون موسيقى/g, '(Vocals Only)')
      .replace(/شارة/g, 'Theme')
      .replace(/أغنية/g, 'Song')
      .replace(/سبيستون/g, 'Spacetoon')
      .replace(/كاملة/g, 'Full')
      .replace(/حصريا/g, 'Exclusive')
      .replace(/إيقاع/g, 'Beat');

    for (const [animeKey, animeVal] of Object.entries(animeTitleTranslations)) {
      if (converted.includes(animeKey)) {
        converted = converted.replace(animeKey, animeVal);
      }
    }

    return converted;
  };

  const translateAnime = (arAnime?: string): string => {
    if (!arAnime) return '';
    if (language === 'ar') return arAnime;
    if (animeTitleTranslations[arAnime]) return animeTitleTranslations[arAnime];

    const trimmed = arAnime.trim();
    if (animeTitleTranslations[trimmed]) return animeTitleTranslations[trimmed];

    for (const [key, val] of Object.entries(animeTitleTranslations)) {
      if (arAnime.includes(key)) {
        return arAnime.replace(key, val);
      }
    }
    return arAnime;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        toggleLanguage,
        setLanguage,
        t,
        translateSong,
        translateAnime,
        isRtl,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
