"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Article {
  id: string;
  title: string;
  content: string;
  lastEdited: string;
  category: string;
  status: "draft" | "processing" | "ready" | "published";
  isStarred: boolean;
  author: string;
  image?: string;
  views?: number;
}

export interface DailyEdition {
  id: string;
  date: string;
  title: string;
  coverImage: string;
  pdfUrl?: string;
}

export interface AudioBroadcast {
  id: string;
  title: string;
  url: string;
  duration: string;
  timestamp: string;
}

export interface LiveReport {
  id: string;
  reporterName: string;
  location: string;
  timestamp: string;
  status: "pending" | "approved" | "rejected" | "live";
  streamUrl: string;
  thumbnail?: string;
}

export interface LiveTVStatus {
  isLive: boolean;
  title: string;
  category: string;
  viewers: string;
}

interface ArticleContextType {
  articles: Article[];
  addArticle: (article: Article) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  publishArticle: (id: string) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  // Multi-Media Hub State
  dailyEditions: DailyEdition[];
  addDailyEdition: (edition: DailyEdition) => void;
  broadcasts: AudioBroadcast[];
  addBroadcast: (broadcast: AudioBroadcast) => void;
  liveTVStatus: LiveTVStatus;
  setLiveTVStatus: (status: LiveTVStatus) => void;
  // Live Reporting
  liveReports: LiveReport[];
  addLiveReport: (report: LiveReport) => void;
  updateLiveReport: (id: string, updates: Partial<LiveReport>) => void;
  deleteLiveReport: (id: string) => void;
}

const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

const initialArticles: Article[] = [
    {
      id: "1",
      title: "عاجل: الجزائر تعزز مكانتها كمركز إقليمي للذكاء الاصطناعي",
      content: "تشهد الساحة التكنولوجية في الجزائر تحولاً جذرياً مع تبني تقنيات الذكاء الاصطناعي في مختلف القطاعات، مما يفتح آفاقاً جديدة للشباب المبتكر...",
      lastEdited: "2024-03-20",
      category: "وطني",
      status: "published",
      isStarred: true,
      author: "أحمد منصور",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800",
      views: 1240
    },
    {
      id: "ex1",
      title: "حصري: صدى تكشف عن الجيل القادم من الصحافة الرقمية",
      content: "في سبق صحفي عالمي، منصة صدى تطلق مجموعة أدوات ثورية تعتمد على المعالجة العصبية للبيانات الصحفية الحية والموثقة...",
      lastEdited: "2024-03-20",
      category: "عالمي",
      status: "published",
      isStarred: true,
      author: "غرفة الأخبار",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
      views: 3500
    },
    {
      id: "2",
      title: "مستقبل الصحافة في عصر الويب 3.0",
      content: "كيف ستغير تقنيات اللامركزية والويب 3.0 طريقة استهلاكنا للأخبار وحماية حقوق الملكية الفكرية للصحفيين؟",
      lastEdited: "2024-03-19",
      category: "صحافة",
      status: "published",
      isStarred: false,
      author: "ليلى خالد",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800"
    },
  {
    id: "3",
    title: "تحقيق: أثر التغير المناخي على السواحل المغاربية",
    content: "دراسة استقصائية حول التحديات البيئية التي تواجه المناطق الساحلية في دول المغرب العربي وكيفية مواجهتها.",
    lastEdited: "2024-03-18",
    category: "بيئة",
    status: "draft",
    isStarred: true,
    author: "أحمد منصور",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=800"
  }
];

const initialEditions: DailyEdition[] = [
  {
    id: "e1",
    date: "2024-03-20",
    title: "صدى: الطبعة الصباحية",
    coverImage: "https://images.unsplash.com/photo-1585829365234-781f8c429478?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "e2",
    date: "2024-03-19",
    title: "صدى: ملخص التكنولوجيا",
    coverImage: "https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=800",
  }
];

const initialBroadcasts: AudioBroadcast[] = [
  {
    id: "b1",
    title: "موجز الأخبار الصباحي - الذكاء الاصطناعي",
    url: "#",
    duration: "05:20",
    timestamp: "منذ ساعتين"
  },
  {
    id: "b2",
    title: "تحليل السوق التقني الأسبوعي",
    url: "#",
    duration: "12:45",
    timestamp: "منذ 5 ساعات"
  }
];

export function ArticleProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [dailyEditions, setDailyEditions] = useState<DailyEdition[]>(initialEditions);
  const [broadcasts, setBroadcasts] = useState<AudioBroadcast[]>(initialBroadcasts);
  const [liveTVStatus, setLiveTVStatus] = useState<LiveTVStatus>({
    isLive: true,
    title: "صدى مباشر: قناتكم الإخبارية على مدار الساعة",
    category: "نشرة الظهيرة",
    viewers: "2.4K"
  });
  const [liveReports, setLiveReports] = useState<LiveReport[]>([
    {
      id: "lr1",
      reporterName: "كريم بن سالم",
      location: "وسط العاصمة",
      timestamp: "منذ 5 دقائق",
      status: "pending",
      streamUrl: "#",
      thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400"
    }
  ]);

  const addArticle = (article: Article) => {
    setArticles(prev => [article, ...prev]);
  };

  const updateArticle = (id: string, updates: Partial<Article>) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const publishArticle = (id: string) => {
    setArticles(prev => prev.map(a => 
      a.id === id ? { ...a, status: "published", lastEdited: new Date().toISOString().split('T')[0] } : a
    ));
  };

  const addDailyEdition = (edition: DailyEdition) => {
    setDailyEditions(prev => [edition, ...prev]);
  };

  const addBroadcast = (broadcast: AudioBroadcast) => {
    setBroadcasts(prev => [broadcast, ...prev]);
  };

  const addLiveReport = (report: LiveReport) => {
    setLiveReports(prev => [report, ...prev]);
  };

  const updateLiveReport = (id: string, updates: Partial<LiveReport>) => {
    setLiveReports(prev => prev.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const deleteLiveReport = (id: string) => {
    setLiveReports(prev => prev.filter(r => r.id !== id));
  };

  return (
    <ArticleContext.Provider value={{ 
      articles, 
      addArticle, 
      updateArticle, 
      deleteArticle, 
      publishArticle,
      globalSearchQuery,
      setGlobalSearchQuery,
      dailyEditions,
      addDailyEdition,
      broadcasts,
      addBroadcast,
      liveTVStatus,
      setLiveTVStatus,
      liveReports,
      addLiveReport,
      updateLiveReport,
      deleteLiveReport
    }}>
      {children}
    </ArticleContext.Provider>
  );
}

export function useArticles() {
  const context = useContext(ArticleContext);
  if (context === undefined) {
    throw new Error("useArticles must be used within an ArticleProvider");
  }
  return context;
}
