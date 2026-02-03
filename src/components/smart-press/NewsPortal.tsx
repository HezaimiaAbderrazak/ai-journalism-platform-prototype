"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Newspaper, 
  TrendingUp, 
  Clock, 
  Eye, 
  Share2, 
  Bookmark,
  ChevronLeft,
  Filter,
  Flame,
  Globe,
  ArrowRight,
  User as UserIcon,
  X,
  Tag,
  Mic2,
  Play,
  Pause,
  Volume2,
  Tv,
  BookOpen,
  Download,
  Calendar,
  Radio,
  Maximize2,
  MapPin
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useArticles, Article, AudioBroadcast } from "@/context/ArticleContext";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { PublicFactChecker } from "./PublicFactChecker";
import { CommunityContribution } from "./CommunityContribution";
import { LiveReporting } from "./LiveReporting";

export function NewsPortal() {
  const { articles, globalSearchQuery, setGlobalSearchQuery, dailyEditions, broadcasts, liveTVStatus, liveReports } = useArticles();
  const { t, dir } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>("portal.all");
  const [activeAudio, setActiveAudio] = useState<AudioBroadcast | null>(broadcasts[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(35);
  const [isTvFullscreen, setIsTvFullscreen] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'صدى مباشر',
          text: `شاهد البث المباشر: ${liveTVStatus.title}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("تم نسخ الرابط للمشاركة!");
    }
  };

  const publishedArticles = articles.filter(a => a.status === "published");
  
    const filteredArticles = publishedArticles.filter(a => {
      const matchesSearch = a.title.includes(globalSearchQuery) || a.content.includes(globalSearchQuery);
      const matchesCategory = selectedCategory === "portal.all" || 
                             (selectedCategory === "portal.national" && a.category === "وطني") ||
                             (selectedCategory === "portal.international" && a.category === "عالمي") ||
                             a.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    const categories = ["portal.all", "portal.national", "portal.international", ...Array.from(new Set(publishedArticles.map(a => a.category).filter(c => !["وطني", "عالمي"].includes(c))))];


    const breakingNews = [
      "عاجل: صدى تطلق تقنية البث المباشر المتقدمة للمراسلين المواطنين.",
      "تطورات ميدانية متسارعة في قلب العاصمة - تغطية حصرية.",
      "الاقتصاد العالمي يشهد تحولات جذرية في الربع الأول من عام 2025.",
      "صدى تحصل على جائزة أفضل منصة صحفية مدعومة بالذكاء الاصطناعي."
    ];

  const activeFieldReports = liveReports.filter(r => r.status === "live" || r.status === "approved");

  return (
    <motion.div 
      className="space-y-16 pb-20" 
      dir={dir}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* 0. Breaking News Marquee */}
      <div className="bg-royal-blue text-white overflow-hidden py-3 rounded-2xl shadow-xl shadow-royal-blue/20 flex items-center gap-6 px-6 border-b-4 border-royal-blue/30 relative group">
        <div className="flex items-center gap-2 shrink-0 z-10 bg-royal-blue px-4">
          <Flame className="h-5 w-5 text-electric-blue animate-bounce" />
          <span className="font-black text-sm uppercase tracking-widest whitespace-nowrap">{t("portal.breaking-news")}</span>
        </div>
        <div className="flex-1 overflow-hidden relative">
          <motion.div 
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-20 whitespace-nowrap"
          >
            {breakingNews.map((news, i) => (
              <span key={i} className="font-bold text-sm flex items-center gap-4">
                <div className="h-1.5 w-1.5 rounded-full bg-electric-blue" />
                {news}
              </span>
            ))}
          </motion.div>
        </div>
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-royal-blue to-transparent z-10 pointer-events-none" />
      </div>

      {/* 1. Sada Media Hub: Live TV & AI Radio */}
      <section className="grid lg:grid-cols-12 gap-10">
        {/* Main Section: Sada Live TV (القناة المباشرة) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
            <div 
              onClick={() => !isTvFullscreen && setIsTvFullscreen(true)}
              className={cn(
                "relative rounded-[3.5rem] overflow-hidden group shadow-2xl bg-black aspect-video border-4 border-white transition-all duration-500 cursor-pointer",
                isTvFullscreen ? "fixed inset-0 z-[100] rounded-none border-0" : "relative"
              )}
            >
            {/* LIVE Badge */}
            <AnimatePresence>
              {liveTVStatus.isLive && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="absolute top-8 right-8 z-20 flex gap-3"
                >
                  <Badge className="bg-red-600 hover:bg-red-700 text-white border-none px-5 py-2 rounded-full font-black flex items-center gap-2.5 shadow-2xl animate-pulse">
                    <div className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_white]" />
                    مباشر
                  </Badge>
                    <Badge className="bg-black/40 backdrop-blur-xl text-white border-white/10 px-4 py-2 rounded-xl font-black flex items-center gap-2">
                      <Eye className="h-4 w-4 text-royal-blue" />
                      {liveTVStatus.viewers} {t("hub.viewers")}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>


            {isTvFullscreen && (
              <Button 
                onClick={() => setIsTvFullscreen(false)}
                className="absolute top-8 left-8 z-[110] h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xl text-white border border-white/20"
              >
                <X className="h-8 w-8" />
              </Button>
            )}
            
            {/* Simulated Live Stream Player */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              {/* Animated Background Visualization / Studio Placeholder */}
              <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-royal-blue/20 to-black z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1600" 
                  className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                  alt="Studio Background"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <motion.div 
                     animate={{ 
                       scale: [1, 1.2, 1],
                       opacity: [0.3, 0.6, 0.3]
                     }}
                     transition={{ duration: 4, repeat: Infinity }}
                     className="h-[500px] w-[500px] rounded-full bg-royal-blue/20 blur-[100px]"
                   />
                </div>
              </div>

              <div className="relative z-10 text-center space-y-8">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="h-28 w-28 rounded-full bg-white/10 flex items-center justify-center mx-auto backdrop-blur-2xl border-2 border-white/20 shadow-2xl cursor-pointer group/play"
                >
                  <Play className="h-12 w-12 text-white fill-white transition-transform group-hover/play:scale-110 ml-1" />
                </motion.div>
                <div className="space-y-2">
                  <h3 className="text-white text-2xl font-black tracking-tight">شبكة صدى الإخبارية</h3>
                  <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-xs">Global News Network</p>
                </div>
              </div>
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-0 right-0 left-0 p-12 bg-gradient-to-t from-black via-black/60 to-transparent">
              <div className="flex items-end justify-between">
                <div className="space-y-3">
                  <Badge className="bg-royal-blue text-white border-none rounded-lg px-3 py-1 font-black text-[10px]">{liveTVStatus.category}</Badge>
                  <h2 className="text-4xl font-black text-white">{liveTVStatus.title}</h2>
                </div>
                <div className="flex gap-4">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsTvFullscreen(!isTvFullscreen)}
                    className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
                   >
                     <Maximize2 className="h-5 w-5" />
                   </Button>
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       onClick={(e) => {
                         e.stopPropagation();
                         handleShare();
                       }}
                       className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
                     >
                       <Share2 className="h-5 w-5" />
                     </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adjacent Section: Sada AI Radio (إذاعة صدى الذكية) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="bg-white border-none rounded-[3.5rem] shadow-2xl p-10 flex flex-col h-full border-t-8 border-royal-blue relative overflow-hidden">
             {/* Decorative Background Icon */}
             <Radio className="absolute -top-10 -left-10 h-40 w-40 text-royal-blue/5 -rotate-12" />

             <div className="relative z-10 flex flex-col h-full">
               <div className="mb-8">
                 <h3 className="text-2xl font-black text-dark-slate mb-1">إذاعة صدى الذكية</h3>
                 <p className="text-slate-400 font-bold text-sm">استمع لنشرات الأخبار الآلية</p>
               </div>

               {/* Modern Audio Player Interface */}
               <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-8 mb-8 border border-slate-100 shadow-inner">
                 <div className="flex items-center gap-6">
                   <div className="h-20 w-20 rounded-2xl bg-royal-blue flex items-center justify-center text-white shadow-xl shadow-royal-blue/20">
                     <Mic2 className="h-10 w-10" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <h4 className="font-black text-dark-slate text-lg truncate">{activeAudio?.title || "اختر نشرة للاستماع"}</h4>
                     <p className="text-royal-blue font-black text-xs uppercase tracking-widest mt-1">Sada AI Voice</p>
                   </div>
                 </div>

                 {/* Progress Bar */}
                 <div className="space-y-3">
                   <div className="relative h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                     <motion.div 
                       className="absolute inset-0 bg-royal-blue" 
                       initial={{ width: "0%" }}
                       animate={{ width: `${progress}%` }}
                     />
                   </div>
                   <div className="flex justify-between text-[10px] font-black text-slate-400">
                     <span>02:45</span>
                     <span>{activeAudio?.duration || "00:00"}</span>
                   </div>
                 </div>

                 {/* Controls */}
                 <div className="flex items-center justify-between">
                   <Button variant="ghost" size="icon" className="text-slate-400 hover:text-royal-blue">
                     <Volume2 className="h-5 w-5" />
                   </Button>
                   <div className="flex items-center gap-6">
                     <Button variant="ghost" size="icon" className="text-slate-300 h-10 w-10 rounded-full">
                       <ChevronLeft className="h-8 w-8 rotate-180" />
                     </Button>
                     <Button 
                       className="h-16 w-16 rounded-full bg-royal-blue text-white shadow-2xl shadow-royal-blue/40 hover:scale-105 transition-all"
                       onClick={() => setIsPlaying(!isPlaying)}
                     >
                       {isPlaying ? <Pause className="h-8 w-8 fill-white" /> : <Play className="h-8 w-8 fill-white ml-1" />}
                     </Button>
                     <Button variant="ghost" size="icon" className="text-slate-300 h-10 w-10 rounded-full">
                       <ChevronLeft className="h-8 w-8" />
                     </Button>
                   </div>
                   <div className="flex items-center gap-1">
                     {[1,2,3].map(i => (
                       <motion.div 
                         key={i}
                         className="w-1 bg-royal-blue/20 rounded-full"
                         animate={{ height: isPlaying ? [10, 20, 10] : 10 }}
                         transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                       />
                     ))}
                   </div>
                 </div>
               </div>

               {/* Recent AI Bulletins List */}
               <div className="flex-1 space-y-4">
                 <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">أحدث النشرات الآلية</h4>
                 <div className="space-y-2 max-h-[180px] overflow-y-auto no-scrollbar pr-1">
                   {broadcasts.map((broadcast) => (
                     <button
                       key={broadcast.id}
                       onClick={() => {
                         setActiveAudio(broadcast);
                         setIsPlaying(true);
                       }}
                       className={cn(
                         "w-full flex items-center justify-between p-4 rounded-2xl transition-all border group",
                         activeAudio?.id === broadcast.id 
                           ? "bg-royal-blue/5 border-royal-blue/20" 
                           : "bg-white border-slate-100 hover:border-royal-blue/20 hover:bg-slate-50"
                       )}
                     >
                       <div className="flex items-center gap-4 text-right">
                         <div className={cn(
                           "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                           activeAudio?.id === broadcast.id ? "bg-royal-blue text-white" : "bg-slate-100 text-slate-400 group-hover:bg-royal-blue/10 group-hover:text-royal-blue"
                         )}>
                           {activeAudio?.id === broadcast.id && isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                         </div>
                         <div className="min-w-0">
                           <h5 className={cn(
                             "font-bold text-sm truncate",
                             activeAudio?.id === broadcast.id ? "text-royal-blue" : "text-dark-slate"
                           )}>{broadcast.title}</h5>
                           <p className="text-[10px] font-medium text-slate-400">{broadcast.timestamp} • {broadcast.duration}</p>
                         </div>
                       </div>
                       {activeAudio?.id === broadcast.id && (
                         <div className="flex gap-0.5">
                           {[1,2,3].map(i => (
                             <motion.div 
                               key={i}
                               className="w-1 bg-royal-blue rounded-full"
                               animate={{ height: [4, 12, 4] }}
                               transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                             />
                           ))}
                         </div>
                       )}
                     </button>
                   ))}
                 </div>
               </div>
             </div>
          </Card>
          </div>
        </section>

        {/* 1.1 Field Live Reports (Visible only if there are approved/live reports) */}
        {activeFieldReports.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-dark-slate flex items-center gap-3">
                  <Radio className="h-6 w-6 text-red-500 animate-pulse" />
                  بث مباشر من <span className="text-royal-blue">الميدان</span>
                </h3>
                <p className="text-slate-500 font-medium">تغطية حية من مراسلينا المواطنين في مختلف المواقع.</p>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {activeFieldReports.map((report) => (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative"
                >
                  <Card className={cn(
                    "overflow-hidden border-2 rounded-[2rem] bg-white transition-all duration-500",
                    report.status === "live" ? "border-red-500 shadow-xl shadow-red-500/10" : "border-slate-100"
                  )}>
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={report.thumbnail || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=400"} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        alt={report.location}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button className="rounded-full h-12 w-12 bg-white text-royal-blue hover:bg-royal-blue hover:text-white transition-all">
                          <Play className="h-6 w-6 fill-current ml-1" />
                        </Button>
                      </div>
                      <Badge className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white border-none px-3 py-1 rounded-lg font-black text-[10px] flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-royal-blue" />
                        {report.location}
                      </Badge>
                      {report.status === "live" && (
                        <Badge className="absolute top-4 left-4 bg-red-600 text-white border-none px-3 py-1 rounded-lg font-black text-[10px] animate-pulse">
                          مباشر
                        </Badge>
                      )}
                    </div>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-slate-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-sm text-dark-slate truncate">{report.reporterName}</p>
                          <p className="text-[10px] font-bold text-slate-400">{report.timestamp}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* 2. Smart Fact-Checker (Public Service Tool) */}
        <PublicFactChecker />

        {/* 3. Main News Grid Section */}
        <section className="space-y-8 pt-12 border-t border-slate-100">

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-dark-slate flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-royal-blue" />
              أحدث <span className="text-royal-blue">التقارير</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg pr-1">استكشف العالم من منظور صدى الذكي.</p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "ghost"}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "rounded-xl font-black h-12 px-6 transition-all border-2",
                  selectedCategory === cat 
                    ? "bg-royal-blue border-royal-blue text-white shadow-lg shadow-royal-blue/20" 
                    : "bg-white border-transparent text-slate-500 hover:bg-slate-50 hover:text-royal-blue"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article, idx) => (
                <motion.div
                  key={article.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="group overflow-hidden border-2 border-transparent hover:border-royal-blue/10 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white rounded-[2.5rem] flex flex-col h-full relative">
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <img 
                          src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800"} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={article.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="absolute top-6 right-6 flex flex-col gap-2 items-end">
                          <Badge className="bg-white/90 backdrop-blur-md text-royal-blue border-none px-4 py-1.5 rounded-xl font-black shadow-lg">
                            {article.category === "وطني" && <MapPin className="h-3 w-3 ml-1.5 inline" />}
                            {article.category === "عالمي" && <Globe className="h-3 w-3 ml-1.5 inline" />}
                            {article.category}
                          </Badge>
                          {article.title.includes("حصري") && (
                            <Badge className="bg-red-600 text-white border-none px-4 py-1.5 rounded-xl font-black shadow-xl animate-pulse">
                              حصري
                            </Badge>
                          )}
                        </div>
                      </div>
                    
                    <CardContent className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-royal-blue/5 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-royal-blue" />
                          </div>
                          <span className="text-sm font-bold text-dark-slate">{article.author || "صدى نيوز"}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {article.lastEdited}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-black text-dark-slate mb-4 line-clamp-2 leading-tight group-hover:text-royal-blue transition-colors">
                        {article.title}
                      </h3>
                      
                      <p className="text-slate-500 font-medium line-clamp-3 mb-8 leading-relaxed">
                        {article.content}
                      </p>
                      
                      <div className="mt-auto pt-6 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <Eye className="h-4 w-4 text-royal-blue/40" />
                            {article.views || 0}
                          </span>
                          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                            <Share2 className="h-4 w-4 text-royal-blue/40" />
                            مشاركة
                          </span>
                        </div>
                        
                        <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-slate-50 hover:bg-royal-blue hover:text-white transition-all shadow-sm">
                          <ArrowRight className="h-6 w-6 -rotate-45" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="py-40 text-center space-y-8 bg-white rounded-[4rem] border-4 border-dashed border-slate-100">
            <div className="h-24 w-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-royal-blue/20">
              <Search className="h-12 w-12" />
            </div>
            <div className="space-y-3">
              <h3 className="text-3xl font-black text-dark-slate">لا تتوفر أخبار حالياً</h3>
              <p className="text-slate-400 font-medium max-w-sm mx-auto text-lg">لم يتم العثور على مقالات في هذه الفئة أو تطابق بحثك.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => { setGlobalSearchQuery(""); setSelectedCategory("الكل"); }} 
              className="rounded-2xl font-black h-14 px-10 border-2 hover:bg-royal-blue hover:text-white transition-all"
            >
              إعادة التعيين
            </Button>
          </div>
        )}
        </section>
  
          {/* 4. Live Citizen Reporting */}
          <section className="space-y-8 pt-12 border-t border-slate-100">
             <LiveReporting />
          </section>

          {/* 5. Community & Contribution Section */}
          <CommunityContribution />

  
        {/* 5. Global Search Results View (Conditional Overlay) */}

      <AnimatePresence>
        {globalSearchQuery && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] bg-white pt-24 px-10 overflow-y-auto font-readex"
          >
            <div className="max-w-[1600px] mx-auto space-y-12">
              <header className="flex items-center justify-between border-b pb-8">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black text-dark-slate">نتائج البحث عن: <span className="text-royal-blue">"{globalSearchQuery}"</span></h2>
                  <p className="text-lg text-slate-500 font-medium">تم العثور على {filteredArticles.length} مقالات منشورة.</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-14 w-14 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 transition-all"
                  onClick={() => setGlobalSearchQuery("")}
                >
                  <X className="h-8 w-8" />
                </Button>
              </header>

              <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 pb-20">
                {filteredArticles.map((article, idx) => (
                   <motion.div
                    key={article.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="group overflow-hidden border-2 border-transparent hover:border-royal-blue/10 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white rounded-[2.5rem] flex flex-col h-full relative">
                      <div className="aspect-[16/10] relative overflow-hidden">
                        <img 
                          src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800"} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          alt={article.title}
                        />
                        <Badge className="absolute top-6 right-6 bg-white/90 backdrop-blur-md text-royal-blue border-none px-4 py-1.5 rounded-xl font-black shadow-lg">
                          {article.category}
                        </Badge>
                      </div>
                      <CardContent className="p-8 flex-1 flex flex-col">
                         <h3 className="text-2xl font-black text-dark-slate mb-4 leading-tight group-hover:text-royal-blue transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-slate-500 font-medium line-clamp-2 mb-6">
                          {article.content}
                        </p>
                        <div className="mt-auto flex items-center justify-between border-t pt-4">
                           <span className="text-xs font-bold text-slate-400">{article.author}</span>
                           <Button variant="ghost" className="text-royal-blue font-black gap-2">
                             قراءة المزيد
                             <ArrowRight className="h-4 w-4" />
                           </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
