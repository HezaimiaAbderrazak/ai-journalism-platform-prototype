"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Globe, 
  Flag, 
  Newspaper, 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Facebook, 
  Music2, 
  Share2, 
  Zap, 
  Briefcase, 
  Trophy, 
  Palette, 
  Gavel, 
  Search,
  AlertTriangle,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ViewMode = "national" | "global";
type Category = "politics" | "culture" | "sports" | "industry" | "crisis";

interface TrendData {
  id: string;
  category: Category;
  title: string;
  intensity: number;
  truthScore: number;
  summary: string;
  aiVerdict: string;
  outlets: {
    name: string;
    logo: string;
    summary: string;
    tone: string;
  }[];
  social: {
    facebook: { shares: string; reaction: string };
    tiktok: { hashtag: string; views: string };
  };
}

const CATEGORIES: { id: Category; label: string; icon: any }[] = [
  { id: "politics", label: "سياسة", icon: Gavel },
  { id: "industry", label: "صناعة واقتصاد", icon: Briefcase },
  { id: "sports", label: "رياضة", icon: Trophy },
  { id: "culture", label: "ثقافة وفن", icon: Palette },
  { id: "crisis", label: "أزمات وتنبيهات", icon: AlertTriangle },
];

const NATIONAL_TRENDS: TrendData[] = [
  {
    id: "nat-1",
    category: "politics",
    title: "توسعة مترو الجزائر: ربط مطار هواري بومدين بوسط المدينة",
    intensity: 92,
    truthScore: 98,
    summary: "وزارة النقل تعلن عن تقدم الأشغال بنسبة 85% في نفق المطار، مما سيغير وجه التنقل في العاصمة.",
    aiVerdict: "هذا الخبر يمثل أولوية وطنية قصوى، ونسبة التفاعل في الجزائر العاصمة تتجاوز المعدلات الطبيعية.",
    outlets: [
      { name: "الشروق", logo: "ECH", summary: "تركيز على التخفيف من زحمة السير والأثر المباشر على حياة المواطنين.", tone: "تفاؤلي / خدماتي" },
      { name: "النهار", logo: "ENH", summary: "تفاصيل تقنية حول محطات المترو الجديدة والتواريخ المتوقعة للتدشين.", tone: "واقعي / إخباري" },
      { name: "الجزيرة", logo: "AJZ", summary: "تحليل للاستثمارات البنيوية في الجزائر وأثرها على النمو الحضري.", tone: "تحليلي / تنموي" },
    ],
    social: {
      facebook: { shares: "25K", reaction: "❤️" },
      tiktok: { hashtag: "#مترو_الجزائر", views: "3.2M" }
    }
  },
  {
    id: "nat-2",
    category: "industry",
    title: "منظومة الشركات الناشئة: الجزائر تقترب من 1500 شركة حاصلة على العلامة",
    intensity: 75,
    truthScore: 96,
    summary: "تسارع كبير في وتيرة منح علامة 'لابيل' للشركات المبتكرة في مجالات التكنولوجيا المالية والزراعة الذكية.",
    aiVerdict: "الخطاب السائد يركز على الابتكار التقني المحلي، هناك اهتمام متزايد من فئة الشباب.",
    outlets: [
      { name: "الشروق", logo: "ECH", summary: "قصص نجاح لشباب جزائريين في تطوير تطبيقات محلية.", tone: "حماسي / ملهم" },
      { name: "النهار", logo: "ENH", summary: "شرح للإجراءات البنكية الجديدة لتمويل أصحاب المشاريع.", tone: "توضيحي / إرشادي" },
      { name: "الجزيرة", logo: "AJZ", summary: "الجزائر تراهن على اقتصاد المعرفة لتقليل التبعية للمحروقات.", tone: "اقتصادي / كلي" },
    ],
    social: {
      facebook: { shares: "12K", reaction: "👍" },
      tiktok: { hashtag: "#StartupsDZ", views: "1.8M" }
    }
  },
  {
    id: "nat-3",
    category: "crisis",
    title: "تنبيه جوي: أمطار رعدية مرتقبة في 15 ولاية شمالية",
    intensity: 88,
    truthScore: 100,
    summary: "الديوان الوطني للأرصاد الجوية يضع عدة ولايات في مستوى اليقظة البرتقالي بسبب اضطراب جوي نشط.",
    aiVerdict: "المحتوى رسمي وعاجل. نوصي بتحديث شريط الأخبار العاجلة لضمان وصول التنبيهات للمواطنين.",
    outlets: [
      { name: "الشروق", logo: "ECH", summary: "قائمة الولايات المعنية والنصائح الأمنية لتفادي الفيضانات.", tone: "تحذيري / عاجل" },
      { name: "النهار", logo: "ENH", summary: "فيديوهات حية للاستعدادات الميدانية لمصالح الحماية المدنية.", tone: "ميداني / لحظي" },
      { name: "الجزيرة", logo: "AJZ", summary: "التغيرات المناخية في حوض المتوسط وأثرها على وتيرة التساقط في المنطقة.", tone: "علمي / بيئي" },
    ],
    social: {
      facebook: { shares: "45K", reaction: "😮" },
      tiktok: { hashtag: "#حالة_الطقس_الجزائر", views: "5.5M" }
    }
  },
  {
    id: "nat-4",
    category: "sports",
    title: "الرابطة المحترفة الأولى: مولودية الجزائر تقبض على الصدارة",
    intensity: 82,
    truthScore: 99,
    summary: "فوز مستحق في القمة العاصمية يعزز طموحات العميد في التتويج بلقب البطولة الوطنية.",
    aiVerdict: "التفاعل الرياضي يشهد ذروة عالية، خاصة في الأوساط الشعبية.",
    outlets: [
      { name: "الشروق", logo: "ECH", summary: "تحليل فني للمباراة وأبرز نقاط قوة تشكيلة باتريس بوميل.", tone: "فني / رياضي" },
      { name: "النهار", logo: "ENH", summary: "كواليس غرف الملابس وتصريحات اللاعبين بعد صافرة النهاية.", tone: "حصري / انفعالي" },
      { name: "الجزيرة", logo: "AJZ", summary: "عودة الروح للملاعب الجزائرية وتطور البنية التحتية الرياضية.", tone: "اجتماعي / رياضي" },
    ],
    social: {
      facebook: { shares: "33K", reaction: "❤️" },
      tiktok: { hashtag: "#مولودية_الجزائر", views: "4.1M" }
    }
  }
];

const GLOBAL_TRENDS: TrendData[] = [
  {
    id: "glo-1",
    category: "industry",
    title: "ثورة الذكاء الاصطناعي: إطلاق نماذج الجيل القادم القادرة على التفكير المنطقي",
    intensity: 96,
    truthScore: 94,
    summary: "كبرى شركات التقنية تعلن عن وكلاء ذكاء اصطناعي يمكنهم حل مشكلات معقدة بشكل مستقل تماماً.",
    aiVerdict: "هذا التوجه يهيمن على قطاع التكنولوجيا العالمي، مع نقاشات حادة حول أخلاقيات الاستخدام.",
    outlets: [
      { name: "The Verge", logo: "VRG", summary: "تحليل شامل للقدرات التقنية الجديدة وكيف ستغير سوق العمل.", tone: "تقني / مستقبلي" },
      { name: "BBC", logo: "BBC", summary: "مخاوف من فقدان الوظائف وتزايد الفجوة الرقمية بين الدول.", tone: "انتقادي / اجتماعي" },
      { name: "الجزيرة", logo: "AJZ", summary: "السباق العالمي نحو السيادة الرقمية وأين العرب من هذا التطور؟", tone: "استراتيجي" },
    ],
    social: {
      facebook: { shares: "120K", reaction: "😮" },
      tiktok: { hashtag: "#AIGeneration", views: "45M" }
    }
  },
  {
    id: "glo-2",
    category: "politics",
    title: "قمة الأمم المتحدة للمناخ: ضغوط لتمويل 'صندوق الخسائر والأضرار'",
    intensity: 89,
    truthScore: 92,
    summary: "الدول النامية تطالب بالتزامات مالية ملزمة لمواجهة الكوارث الناتجة عن الانبعاثات الكربونية.",
    aiVerdict: "هناك انقسام واضح في الآراء بين الشمال والجنوب العالمي، التوجه يتسم بالجدية.",
    outlets: [
      { name: "رويترز", logo: "RTR", summary: "تغطية مفصلة للمفاوضات الشاقة والبنود المالية المقترحة.", tone: "محايد / إحصائي" },
      { name: "Guardian", logo: "GRD", summary: "صرخات الدول الجزرية المهددة بالاختفاء تتصدر واجهة القمة.", tone: "إنساني / عاجل" },
      { name: "الجزيرة", logo: "AJZ", summary: "العدالة المناخية ودور الدول النفطية في صياغة الحلول العالمية.", tone: "تحليلي / حقوقي" },
    ],
    social: {
      facebook: { shares: "85K", reaction: "😢" },
      tiktok: { hashtag: "#COP2025", views: "28M" }
    }
  },
  {
    id: "glo-3",
    category: "crisis",
    title: "تحولات الاقتصاد العالمي: مخاوف من ركود تضخمي مع ارتفاع أسعار الطاقة",
    intensity: 91,
    truthScore: 90,
    summary: "البنوك المركزية تواجه تحدي الموازنة بين خفض التضخم وتفادي انكماش اقتصادي واسع.",
    aiVerdict: "التوقعات الاقتصادية غير مستقرة، هناك قلق واسع النطاق في الأسواق المالية العالمية.",
    outlets: [
      { name: "Bloomberg", logo: "BLM", summary: "بيانات الأسواق وتوقعات الفائدة خلال الربع القادم.", tone: "احترافي / مالي" },
      { name: "CNN", logo: "CNN", summary: "كيف يتأثر المستهلك العادي بارتفاع تكاليف المعيشة عالمياً؟", tone: "واقعي / استهلاكي" },
      { name: "الجزيرة", logo: "AJZ", summary: "إعادة تشكل سلاسل التوريد العالمية والبحث عن بدائل طاقوية مستدامة.", tone: "جيوسياسي" },
    ],
    social: {
      facebook: { shares: "66K", reaction: "😡" },
      tiktok: { hashtag: "#GlobalEconomy", views: "19M" }
    }
  },
  {
    id: "glo-4",
    category: "sports",
    title: "دوري أبطال أوروبا: نتائج قرعة دور الثمانية تصدم الكبار",
    intensity: 95,
    truthScore: 100,
    summary: "مواجهات نارية تجمع ريال مدريد بمانشستر سيتي، وبايرن ميونخ يصطدم بليفربول.",
    aiVerdict: "الحدث الرياضي الأكثر متابعة عالمياً حالياً، التفاعل يتجاوز كل الحدود الجغرافية.",
    outlets: [
      { name: "L'Equipe", logo: "LEQ", summary: "تحليلات عميقة لفرص كل فريق وتاريخ المواجهات المباشرة.", tone: "تخصصي / معمق" },
      { name: "Sky Sports", logo: "SKY", summary: "مقابلات حصرية مع المدربين وردود فعل الجماهير حول العالم.", tone: "حيوي / إخباري" },
      { name: "الجزيرة", logo: "AJZ", summary: "المال والكرة: القوة الاقتصادية للأندية الأوروبية الكبرى.", tone: "اقتصادي / رياضي" },
    ],
    social: {
      facebook: { shares: "450K", reaction: "🔥" },
      tiktok: { hashtag: "#UCLDraw", views: "120M" }
    }
  }
];

export function AIIntelligenceHub() {
  const [viewMode, setViewMode] = useState<ViewMode>("national");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  
  const currentTrends = useMemo(() => {
    return viewMode === "national" ? NATIONAL_TRENDS : GLOBAL_TRENDS;
  }, [viewMode]);

  const [activeTrendId, setActiveTrendId] = useState<string>(currentTrends[0].id);

    // Sync activeTrendId when viewMode changes
    useEffect(() => {
      setActiveTrendId(currentTrends[0].id);
    }, [viewMode, currentTrends]);

  const activeTrend = currentTrends.find(t => t.id === activeTrendId) || currentTrends[0];

  const aiSummaryContext = useMemo(() => {
    if (viewMode === "national") {
      return "نظام الرصد الذكي يركز حالياً على الشأن الجزائري المحلي، مع تحليل دقيق للصحافة الوطنية وتفاعلات المواطنين عبر المنصات الاجتماعية.";
    }
    return "نظام الرصد الذكي يقوم حالياً بمسح شامل للصحافة العالمية والمنصات الدولية، لتحليل التوجهات العابرة للحدود وأثرها الجيوسياسي.";
  }, [viewMode]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700" dir="rtl">
      {/* Top Navigation & Controls */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white border border-slate-200 p-6 rounded-[2.5rem] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-royal-blue/10 rounded-2xl">
            <TrendingUp className="h-6 w-6 text-royal-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-royal-blue">مركز الاستخبارات <span className="text-electric-blue">AI Hub</span></h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Global & National Cross-Media Analysis</p>
          </div>
        </div>

        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
          <button 
            onClick={() => setViewMode("national")}
            className={cn(
              "px-8 py-2.5 rounded-xl text-sm font-black transition-all gap-2 flex items-center",
              viewMode === "national" ? "bg-royal-blue text-white shadow-lg shadow-royal-blue/20" : "text-slate-400 hover:text-royal-blue"
            )}
          >
            <Flag className="h-4 w-4" /> الجزائر
          </button>
          <button 
            onClick={() => setViewMode("global")}
            className={cn(
              "px-8 py-2.5 rounded-xl text-sm font-black transition-all gap-2 flex items-center",
              viewMode === "global" ? "bg-royal-blue text-white shadow-lg shadow-royal-blue/20" : "text-slate-400 hover:text-royal-blue"
            )}
          >
            <Globe className="h-4 w-4" /> عالمي
          </button>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-3">
        <Button 
          variant={selectedCategory === "all" ? "default" : "outline"}
          onClick={() => setSelectedCategory("all")}
          className={cn("rounded-full px-6 font-bold text-xs h-10 shadow-sm", selectedCategory === "all" ? "bg-royal-blue" : "border-slate-200 text-slate-500 bg-white")}
        >
          الكل
        </Button>
        {CATEGORIES.map(cat => (
          <Button 
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "rounded-full px-6 font-bold text-xs h-10 gap-2 shadow-sm", 
              selectedCategory === cat.id ? "bg-royal-blue" : "border-slate-200 text-slate-500 bg-white"
            )}
          >
            <cat.icon className="h-3.5 w-3.5" /> {cat.label}
          </Button>
        ))}
      </div>

      {/* Main Intelligence Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Trend List (4 cols) */}
        <div className="xl:col-span-4 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">التوجهات النشطة الآن</h3>
            <Badge variant="outline" className="border-emerald-200 text-emerald-600 bg-emerald-50 px-3">مباشر • {viewMode === "national" ? "الجزائر" : "عالمياً"}</Badge>
          </div>
          
          <div className="relative overflow-hidden rounded-[1.5rem] bg-white border border-slate-200 p-4 mb-4 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="text-[10px] font-black text-royal-blue uppercase tracking-wider">AI Insight</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-bold">
              {aiSummaryContext}
            </p>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {currentTrends
                .filter(t => selectedCategory === "all" || t.category === selectedCategory)
                .map(trend => (
                <motion.div
                  key={trend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => setActiveTrendId(trend.id)}
                  className={cn(
                    "p-5 rounded-[1.5rem] border transition-all cursor-pointer relative overflow-hidden group shadow-sm",
                    activeTrendId === trend.id 
                      ? "bg-white border-royal-blue ring-1 ring-royal-blue/20" 
                      : "bg-white border-slate-200 hover:border-royal-blue/30"
                  )}
                >
                  {activeTrendId === trend.id && (
                    <motion.div 
                      layoutId="active-indicator"
                      className="absolute right-0 top-0 bottom-0 w-1 bg-royal-blue"
                    />
                  )}
                  <div className="flex items-center justify-between mb-3">
                    <Badge className="bg-slate-50 text-slate-500 border-slate-200 font-black text-[9px] uppercase">
                      {CATEGORIES.find(c => c.id === trend.category)?.label}
                    </Badge>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <Activity className="h-3 w-3 text-royal-blue" /> {trend.intensity}% كثافة
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-dark-slate leading-relaxed mb-2 group-hover:text-royal-blue transition-colors">
                    {trend.title}
                  </h4>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex -space-x-2 space-x-reverse">
                      {trend.outlets.map((o, i) => (
                        <div key={i} className="h-6 w-6 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center text-[8px] font-black text-royal-blue shadow-sm">
                          {o.logo[0]}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">+ تغطية واسعة</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Middle & Right Column: Detailed Analysis (8 cols) */}
        <div className="xl:col-span-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTrend.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden flex flex-col min-h-[800px] shadow-sm"
            >
              {/* Trend Header */}
              <div className="p-8 lg:p-12 border-b border-slate-100 bg-gradient-to-b from-royal-blue/[0.02] to-transparent">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-royal-blue animate-pulse" />
                      <span className="text-xs font-black text-royal-blue uppercase tracking-[0.2em]">
                        {viewMode === "national" ? "تحليل وطني مباشر" : "تحليل عالمي مباشر"}
                      </span>
                    </div>
                    <h2 className="text-3xl lg:text-4xl font-black text-royal-blue leading-tight">
                      {activeTrend.title}
                    </h2>
                    <p className="text-slate-500 font-bold leading-relaxed">
                      {activeTrend.summary}
                    </p>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center min-w-[100px] shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Truth Score</p>
                      <span className="text-2xl font-black text-emerald-600">{activeTrend.truthScore}%</span>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center min-w-[100px] shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Intensity</p>
                      <span className="text-2xl font-black text-amber-500">{activeTrend.intensity}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Split Content: Media vs Social */}
              <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
                
                {/* Media Perspective */}
                <div className="p-8 lg:p-12 border-l border-slate-100 space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Newspaper className="h-5 w-5 text-royal-blue" />
                    <h3 className="text-sm font-black text-dark-slate uppercase tracking-widest">ماذا قالت الصحافة؟ / Media Coverage</h3>
                  </div>

                  <div className="space-y-6">
                    {activeTrend.outlets.map((outlet, idx) => (
                      <div key={idx} className="relative pr-6 before:absolute before:right-0 before:top-0 before:bottom-0 before:w-1 before:bg-royal-blue/10 hover:before:bg-royal-blue transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-royal-blue bg-royal-blue/5 px-3 py-1 rounded-lg">{outlet.name}</span>
                          <span className="text-[10px] font-bold text-slate-400 italic">{outlet.tone}</span>
                        </div>
                        <p className="text-sm text-slate-500 font-bold leading-relaxed">
                          "{outlet.summary}"
                        </p>
                      </div>
                    ))}
                  </div>

                  <Button className="w-full h-12 rounded-xl bg-white border border-slate-200 hover:border-royal-blue hover:text-royal-blue font-black text-xs gap-2 mt-4 shadow-sm transition-all">
                    <Search className="h-4 w-4" /> تتبع المصادر الكاملة
                  </Button>
                </div>

                {/* Social Media Viral Integration */}
                <div className="p-8 lg:p-12 bg-slate-50 space-y-8">
                  <div className="flex items-center gap-3 mb-2">
                    <Share2 className="h-5 w-5 text-electric-blue" />
                    <h3 className="text-sm font-black text-dark-slate uppercase tracking-widest">نبض التواصل / Social Pulse</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    {/* Facebook Card */}
                    <div className="p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-4 hover:border-royal-blue/30 transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-royal-blue rounded-lg shadow-md shadow-royal-blue/20">
                            <Facebook className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-black text-dark-slate">Facebook Activity</span>
                        </div>
                        <Badge className="bg-royal-blue/10 text-royal-blue border-none font-black text-[9px]">HIGH REACH</Badge>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Shares / مشاركة</p>
                          <span className="text-2xl font-black text-royal-blue">{activeTrend.social.facebook.shares}</span>
                        </div>
                        <div className="text-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Reaction</p>
                          <span className="text-xl">{activeTrend.social.facebook.reaction}</span>
                        </div>
                      </div>
                    </div>

                    {/* TikTok Card */}
                    <div className="p-6 rounded-[2rem] bg-white border border-slate-200 shadow-sm space-y-4 hover:border-royal-blue/30 transition-all group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-dark-slate rounded-lg">
                            <Music2 className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs font-black text-dark-slate">TikTok Trending</span>
                        </div>
                        <Badge className="bg-electric-blue/10 text-electric-blue border-none font-black text-[9px]">VIRAL</Badge>
                      </div>
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Hashtag</p>
                          <span className="text-lg font-black text-electric-blue dir-ltr inline-block">{activeTrend.social.tiktok.hashtag}</span>
                        </div>
                        <div className="space-y-1 text-left">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Total Views</p>
                          <span className="text-2xl font-black text-dark-slate">{activeTrend.social.tiktok.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verdict Card */}
                  <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span className="text-[10px] font-black text-royal-blue uppercase tracking-widest">AI Verdict / تقييم المحتوى</span>
                    </div>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed mb-4">
                      {activeTrend.aiVerdict}
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-black">
                        <span className="text-slate-400">موثوقية المحتوى</span>
                        <span className="text-emerald-600">{activeTrend.truthScore}%</span>
                      </div>
                      <Progress value={activeTrend.truthScore} className="h-1.5 bg-slate-100" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Bar */}
              <div className="p-6 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase">العمليات المقترحة:</span>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-royal-blue hover:bg-royal-blue/90 text-[10px] font-black rounded-lg gap-2 shadow-md shadow-royal-blue/10 h-9">
                      <Zap className="h-3 w-3" /> توليد تقرير استقصائي
                    </Button>
                    <Button size="sm" variant="outline" className="border-slate-200 bg-white text-slate-600 hover:text-royal-blue text-[10px] font-black rounded-lg gap-2 h-9">
                      <Activity className="h-3 w-3" /> تتبع المسار الزمني
                    </Button>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-slate-400 italic">
                  آخر تحديث لحظي: {new Date().toLocaleTimeString('ar-EG')}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
