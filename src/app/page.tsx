"use client";

import React, { useState } from "react";
import { Sidebar, NavItem } from "@/components/smart-press/Sidebar";
import { Header } from "@/components/smart-press/Header";
import { Dashboard } from "@/components/smart-press/Dashboard";
import { FactChecker } from "@/components/smart-press/FactChecker";
import { ContentGenerator } from "@/components/smart-press/ContentGenerator";
import { DataJournalism } from "@/components/smart-press/DataJournalism";
import { AIStudio } from "@/components/smart-press/AIStudio";
import { AIIntelligenceHub } from "@/components/smart-press/AIIntelligenceHub";
import { MyArticles } from "@/components/smart-press/MyArticles";
import { NewsPortal } from "@/components/smart-press/NewsPortal";
import { ArticleProvider } from "@/context/ArticleContext";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeToggle } from "@/components/smart-press/ThemeToggle";
import { Menu, Search, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SmartPressPrototype() {
  const [viewMode, setViewMode] = useState<"public" | "dashboard">("public");
  const [activeTab, setActiveTab] = useState<NavItem>("intelligence-hub");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [studioScript, setStudioScript] = useState("");

  const handleSendToStudio = (script: string) => {
    setStudioScript(script);
    setActiveTab("ai-studio");
    setViewMode("dashboard");
  };

  const renderDashboardContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "fact-checker":
        return <FactChecker />;
      case "generator":
        return <ContentGenerator onSendToStudio={handleSendToStudio} />;
      case "ai-studio":
        return <AIStudio initialScript={studioScript} />;
      case "intelligence-hub":
        return <AIIntelligenceHub />;
      case "data-journalism":
        return <DataJournalism />;
      case "articles":
        return <MyArticles />;
      default:
        return <AIIntelligenceHub />;
    }
  };

  return (
    <LanguageProvider>
      <ArticleProvider>
        <div className="relative min-h-screen bg-page-bg text-dark-slate overflow-hidden" dir="rtl">
        {/* Light Professional Background */}
        <div className="absolute inset-0 z-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#E2E8F0_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-royal-blue/5 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-electric-blue/5 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 flex min-h-screen">
          {viewMode === "dashboard" && (
            <Sidebar 
              activeItem={activeTab} 
              onNavigate={(item) => setActiveTab(item)} 
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
            />
          )}

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <Header 
              viewMode={viewMode}
              onOpenSidebar={() => setIsSidebarOpen(true)} 
              onNavigate={(tab) => {
                if (tab === "news-portal") setViewMode("public");
                else {
                  setActiveTab(tab);
                  setViewMode("dashboard");
                }
              }} 
            />

            {/* Main Viewport */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-10">
              <div className="max-w-[1600px] mx-auto">
                {viewMode === "public" ? <NewsPortal /> : renderDashboardContent()}
              </div>
              
              {/* Professional Footer */}
              <footer className="mt-24 pt-12 border-t border-border text-center text-xs text-muted-foreground space-y-6 pb-12">
                <div className="flex justify-center items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
                  <span className="font-black tracking-[0.3em] text-2xl italic text-dark-slate uppercase">Sada | صدى</span>
                  <span className="font-black tracking-[0.3em] text-2xl italic text-dark-slate uppercase">AI GUARDIAN</span>
                  <span className="font-black tracking-[0.3em] text-2xl italic text-dark-slate uppercase">JOURNO OPS</span>
                </div>
                <div className="max-w-md mx-auto space-y-2">
                  <p className="font-bold text-dark-slate">© 2025 Sada Intelligence Platform</p>
                  <p className="font-medium">تم التطوير لتمكين الجيل القادم من الصحافة الاحترافية المعززة بالذكاء الاصطناعي.</p>
                </div>
                <div className="flex justify-center gap-8 font-black" dir="rtl">
                  <span className="text-royal-blue hover:underline cursor-pointer transition-all">اتفاقية الخدمة</span>
                  <span className="text-royal-blue hover:underline cursor-pointer transition-all">سياسة البيانات</span>
                  <span className="text-emerald-600 flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    تشفير عصبي نشط
                  </span>
                </div>
              </footer>
            </main>
          </div>
        </div>
      </div>
      </ArticleProvider>
    </LanguageProvider>
  );
}

