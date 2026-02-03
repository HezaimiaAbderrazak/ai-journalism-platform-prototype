"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "ar" | "fr" | "en";

interface Translations {
  [key: string]: {
    [key in Language]: string;
  };
}

export const translations: Translations = {
  // Navigation
  "nav.news-portal": {
    ar: "بوابة الأخبار",
    fr: "Portail d'Actualités",
    en: "News Portal"
  },
  "nav.dashboard": {
    ar: "لوحة التحكم",
    fr: "Tableau de Bord",
    en: "Dashboard"
  },
  "nav.live": {
    ar: "مباشر",
    fr: "En Direct",
    en: "Live"
  },
  "nav.radio": {
    ar: "إذاعة",
    fr: "Radio",
    en: "Radio"
  },
  "nav.journalist-login": {
    ar: "دخول الصحفي",
    fr: "Connexion Journaliste",
    en: "Journalist Login"
  },
  // Search
  "search.placeholder": {
    ar: "ابحث في الأخبار المنشورة...",
    fr: "Rechercher des actualités...",
    en: "Search news..."
  },
  "search.quick-hint": {
    ar: "(اضغط / للبحث السريع)",
    fr: "(Appuyez sur / pour recherche rapide)",
    en: "(Press / for quick search)"
  },
  // News Portal
  "portal.breaking-news": {
    ar: "عاجل حصري",
    fr: "Exclusivité Flash",
    en: "Breaking Exclusive"
  },
  "portal.latest-reports": {
    ar: "أحدث التقارير",
    fr: "Derniers Rapports",
    en: "Latest Reports"
  },
  "portal.national": {
    ar: "وطني",
    fr: "National",
    en: "National"
  },
  "portal.international": {
    ar: "عالمي",
    fr: "International",
    en: "International"
  },
  "portal.all": {
    ar: "الكل",
    fr: "Tout",
    en: "All"
  },
  "portal.exclusive": {
    ar: "حصري",
    fr: "Exclusif",
    en: "Exclusive"
  },
  // Media Hub
  "hub.tv-title": {
    ar: "شبكة صدى الإخبارية",
    fr: "Réseau Sada News",
    en: "Sada News Network"
  },
  "hub.viewers": {
    ar: "مشاهد",
    fr: "spectateurs",
    en: "viewers"
  },
  "hub.radio-title": {
    ar: "إذاعة صدى الذكية",
    fr: "Radio Inteligente Sada",
    en: "Sada AI Radio"
  },
  "hub.radio-subtitle": {
    ar: "استمع لنشرات الأخبار الآلية",
    fr: "Écoutez les bulletins automatisés",
    en: "Listen to automated bulletins"
  },
  // Sections
  "section.field-reports": {
    ar: "بث مباشر من الميدان",
    fr: "Direct du Terrain",
    en: "Live from the Field"
  },
  "section.fact-checker": {
    ar: "مدقق الحقائق الذكي",
    fr: "Vérificateur de Faits AI",
    en: "AI Fact-Checker"
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar");

  useEffect(() => {
    const savedLang = localStorage.getItem("sada-language") as Language;
    if (savedLang) setLanguage(savedLang);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("sada-language", lang);
  };

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, dir }}>
      <div dir={dir} className={language === "ar" ? "font-readex" : "font-inter"}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
