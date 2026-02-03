"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bell, 
  Search, 
  Menu, 
  Settings, 
  FileText, 
  LogOut, 
  ChevronDown,
  User as UserIcon,
  Newspaper,
  Tag,
  Clock,
  ArrowRight,
  Command,
  Flame,
  ChevronRight,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useArticles, Article } from "@/context/ArticleContext";
import { useLanguage, Language } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  viewMode?: "public" | "dashboard";
  onOpenSidebar: () => void;
  onNavigate: (tab: any) => void;
}

export function Header({ viewMode = "dashboard", onOpenSidebar, onNavigate }: HeaderProps) {
  const { articles, globalSearchQuery, setGlobalSearchQuery } = useArticles();
  const { t, language, setLanguage, dir } = useLanguage();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const publishedArticles = articles.filter(a => a.status === "published");
  const searchResults = publishedArticles.filter(a => 
    a.title.includes(globalSearchQuery) || a.category.includes(globalSearchQuery)
  ).slice(0, 5);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        const searchInput = document.getElementById("global-search");
        searchInput?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-20 border-b border-border flex items-center justify-between px-6 lg:px-10 sticky top-0 bg-white z-30 shadow-sm transition-all duration-300">
      {/* Right Side: Logo Section (for RTL) */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-4">
          {viewMode === "dashboard" && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden text-royal-blue hover:bg-royal-blue/5 rounded-xl" 
              onClick={onOpenSidebar}
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
          
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onNavigate("news-portal")}>
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-royal-blue text-white shadow-lg shadow-royal-blue/20 group-hover:scale-110 transition-transform">
              <Newspaper className="h-6 w-6" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-royal-blue tracking-tight font-inter">Sada</span>
              <span className="text-2xl font-bold text-dark-slate font-readex">صدى</span>
            </div>
          </div>
        </div>

        {/* Public Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Button 
            variant="ghost" 
            className={cn(
              "h-11 px-4 rounded-xl font-bold transition-all gap-2",
              viewMode === "public" ? "text-royal-blue bg-royal-blue/5" : "text-slate-500 hover:text-royal-blue hover:bg-royal-blue/5"
            )}
            onClick={() => onNavigate("news-portal")}
          >
            <Newspaper className="h-4 w-4" />
            {t("nav.news-portal")}
          </Button>
          <Button 
            variant="ghost" 
            className="h-11 px-4 rounded-xl font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all gap-2"
            onClick={() => onNavigate("news-portal")}
          >
            <Tv className="h-4 w-4" />
            {t("nav.live")}
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </Button>
          <Button 
            variant="ghost" 
            className="h-11 px-4 rounded-xl font-bold text-slate-500 hover:text-royal-blue hover:bg-royal-blue/5 transition-all gap-2"
            onClick={() => onNavigate("news-portal")}
          >
            <Radio className="h-4 w-4" />
            {t("nav.radio")}
          </Button>
        </nav>
      </div>

      {/* Center Search */}
      <div className="hidden xl:flex relative max-w-xl w-full mx-8" ref={searchRef}>
        <div className={cn(
          "relative w-full transition-all duration-500",
          isSearchFocused ? "scale-[1.02]" : "scale-100"
        )}>
          <Search className={cn(
            "absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 z-10",
            isSearchFocused ? "text-royal-blue" : "text-slate-400"
          )} />
            <Input 
              id="global-search"
              placeholder={`${t("search.placeholder")} ${t("search.quick-hint")}`} 
              className="pr-14 pl-16 h-12 w-full bg-slate-50 border-slate-200 text-dark-slate focus:ring-royal-blue/20 focus:border-royal-blue rounded-2xl font-bold placeholder:text-slate-400 transition-all border-2"
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
            />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-slate-200 text-[10px] font-black text-slate-400">
            <Command className="h-2.5 w-2.5" />
            <span>/</span>
          </div>
        </div>

        {/* Instant Search Dropdown */}
        <AnimatePresence>
          {isSearchFocused && globalSearchQuery.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-2xl border border-border overflow-hidden z-50 p-2"
            >
              <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">نتائج البحث المباشرة</span>
                <Badge variant="secondary" className="bg-royal-blue/10 text-royal-blue border-none font-bold">
                  {searchResults.length} نتائج
                </Badge>
              </div>

              <div className="max-h-[400px] overflow-y-auto no-scrollbar">
                {searchResults.length > 0 ? (
                  <div className="p-2 space-y-1">
                    {searchResults.map((article) => (
                      <button
                        key={article.id}
                        className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all text-right group"
                          onClick={() => {
                            setGlobalSearchQuery(article.title);
                            setIsSearchFocused(false);
                            onNavigate("news-portal");
                          }}
                      >
                        <div className="h-14 w-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border">
                          <img 
                            src={article.image || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=200"} 
                            alt="" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-dark-slate truncate group-hover:text-royal-blue transition-colors">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[11px] font-bold text-royal-blue flex items-center gap-1">
                              <Tag className="h-3 w-3" />
                              {article.category}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-royal-blue -rotate-45 transition-all" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center space-y-3">
                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto">
                      <Search className="h-6 w-6 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-400">لم يتم العثور على مقالات تطابق بحثك</p>
                  </div>
                )}
              </div>

              <button 
                className="w-full p-4 bg-slate-50 hover:bg-royal-blue hover:text-white transition-all text-sm font-black flex items-center justify-center gap-2"
                onClick={() => {
                  setIsSearchFocused(false);
                  onNavigate("news-portal");
                }}
              >
                عرض كافة النتائج في بوابة الأخبار
                <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Left Side: User Profile / Login Section */}
      <div className="flex items-center gap-4 lg:gap-6">
        {viewMode === "public" ? (
          <Button 
            className="bg-royal-blue hover:bg-royal-blue/90 text-white px-8 h-12 rounded-xl font-black shadow-lg shadow-royal-blue/20 transition-all flex items-center gap-2"
            onClick={() => onNavigate("dashboard")}
          >
            <UserIcon className="h-5 w-5" />
            {t("nav.journalist-login")}
          </Button>
        ) : (
          <>
            <Button 
              variant="ghost" 
              className="hidden lg:flex items-center gap-2 h-11 px-6 rounded-xl text-royal-blue font-black bg-royal-blue/5 hover:bg-royal-blue/10 transition-all"
              onClick={() => onNavigate("news-portal")}
            >
              <Newspaper className="h-5 w-5" />
              {t("nav.news-portal")}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-xl text-[#6B7280] hover:text-royal-blue hover:bg-royal-blue/5 h-11 w-11 transition-colors group">
                  <Globe className="h-5 w-5 transition-transform group-hover:rotate-12" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 mt-2 p-2 rounded-2xl border-[#E5E7EB] shadow-xl bg-white overflow-hidden" dir={dir}>
                <DropdownMenuItem 
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors outline-none font-bold text-xs",
                    language === "ar" ? "bg-royal-blue/10 text-royal-blue" : "hover:bg-royal-blue/5 text-dark-slate"
                  )}
                  onClick={() => setLanguage("ar")}
                >
                  <span>العربية</span>
                  <span className="text-[10px] opacity-50">AR</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                   className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors outline-none font-bold text-xs",
                    language === "fr" ? "bg-royal-blue/10 text-royal-blue" : "hover:bg-royal-blue/5 text-dark-slate"
                  )}
                  onClick={() => setLanguage("fr")}
                >
                  <span>Français</span>
                  <span className="text-[10px] opacity-50">FR</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                   className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors outline-none font-bold text-xs",
                    language === "en" ? "bg-royal-blue/10 text-royal-blue" : "hover:bg-royal-blue/5 text-dark-slate"
                  )}
                  onClick={() => setLanguage("en")}
                >
                  <span>English</span>
                  <span className="text-[10px] opacity-50">EN</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="relative rounded-xl text-[#6B7280] hover:text-[#1A56DB] hover:bg-[#F0F7FF] h-11 w-11 transition-colors group">
              <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
              <span className="absolute top-3 right-3 h-2 w-2 bg-[#EF4444] rounded-full ring-2 ring-white" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 p-1 rounded-xl hover:bg-[#F9FAFB] transition-all group outline-none border border-transparent hover:border-[#E5E7EB]">
                  <div className="flex flex-col items-start text-right hidden sm:flex">
                    <span className="text-sm font-bold text-[#111827] leading-none mb-1 font-inter">Ahmed Mansour</span>
                    <span className="text-[11px] text-[#6B7280] leading-none font-inter tracking-tight">ahmed@sada.ai</span>
                  </div>
                  <div className="relative">
                    <div className="h-10 w-10 rounded-full border-2 border-[#1A56DB]/20 p-0.5 group-hover:border-[#1A56DB] transition-all duration-300 overflow-hidden shadow-sm">
                      <div className="h-full w-full rounded-full bg-[#F0F7FF] flex items-center justify-center overflow-hidden">
                        <img 
                          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" 
                          alt="User Avatar" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-[#10B981] border-2 border-white" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#111827] transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60 mt-2 p-2 rounded-2xl border-[#E5E7EB] shadow-xl shadow-[#111827]/5 bg-white overflow-hidden" dir="rtl">
                <div className="px-3 py-3 mb-2 sm:hidden bg-[#F9FAFB] rounded-xl">
                  <p className="text-sm font-bold text-[#111827]">أحمد منصور</p>
                  <p className="text-[11px] text-[#6B7280]">ahmed@sada.ai</p>
                </div>
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[#F0F7FF] hover:text-[#1A56DB] focus:bg-[#F0F7FF] focus:text-[#1A56DB] transition-colors group outline-none">
                  <Settings className="h-4 w-4 text-[#6B7280] group-hover:text-[#1A56DB]" />
                  <span className="font-semibold text-sm">الإعدادات</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-[#F0F7FF] hover:text-[#1A56DB] focus:bg-[#F0F7FF] focus:text-[#1A56DB] transition-colors group outline-none"
                  onClick={() => onNavigate("articles")}
                >
                  <FileText className="h-4 w-4 text-[#6B7280] group-hover:text-[#1A56DB]" />
                  <span className="font-semibold text-sm">مقالاتي</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2 bg-[#E5E7EB]" />
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-50 text-[#EF4444] focus:bg-red-50 focus:text-[#EF4444] transition-colors group outline-none">
                  <LogOut className="h-4 w-4" />
                  <span className="font-semibold text-sm">تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  );
}
