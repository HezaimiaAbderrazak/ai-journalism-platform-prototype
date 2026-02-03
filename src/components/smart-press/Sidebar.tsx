"use client";

import React from "react";
import { 
  LayoutDashboard, 
  SearchCheck, 
  PenTool, 
  BarChart3, 
  TrendingUp,
  Video,
  Settings, 
  Menu, 
  X,
  Type
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export type NavItem = "dashboard" | "fact-checker" | "generator" | "data-journalism" | "ai-studio" | "articles" | "intelligence-hub";

interface SidebarProps {
  activeItem: NavItem;
  onNavigate: (item: NavItem) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ activeItem, onNavigate, isOpen, setIsOpen }: SidebarProps) {
    const items = [
      { id: "dashboard", label: "الرئيسية", labelEn: "Home", icon: LayoutDashboard },
      { id: "intelligence-hub", label: "مركز الاستخبارات AI", labelEn: "Intelligence Hub", icon: TrendingUp },
      { id: "ai-studio", label: "استوديو الذكاء الاصطناعي", labelEn: "AI Studio", icon: Video },
      { id: "fact-checker", label: "التحقق من الأخبار", labelEn: "Fact-Checker", icon: SearchCheck },
      { id: "generator", label: "توليد المحتوى", labelEn: "Content Gen", icon: PenTool },
      { id: "data-journalism", label: "صحافة البيانات", labelEn: "Data Journalism", icon: BarChart3 },
      { id: "articles", label: "مقالاتي", labelEn: "My Articles", icon: PenTool },
    ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 right-0 z-50 w-64 transform bg-royal-blue transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 shadow-2xl",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 px-6 py-8 border-b border-white/10">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden bg-white p-1">
                <img src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/photo_5931313281769344046_x-1766473627837.jpg?width=8000&height=8000&resize=contain" alt="Sada Logo" className="h-full w-full object-contain" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white tracking-tight font-inter">Sada</span>
                  <span className="text-xl font-bold text-white font-readex opacity-90">صدى</span>
                </div>
                <span className="text-[9px] font-bold text-electric-blue uppercase tracking-[0.1em] leading-none">Smart Press Platform</span>
              </div>
            </div>

          <nav className="flex-1 space-y-1.5 px-3 py-6">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id as NavItem);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all duration-300 group relative",
                    isActive 
                      ? "bg-gradient-to-r from-electric-blue/20 to-transparent text-white border-r-4 border-electric-blue shadow-lg shadow-black/10" 
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-electric-blue" : "text-white/60 group-hover:text-white")} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4 space-y-2">
            <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-[10px] font-bold text-electric-blue uppercase mb-1">النسخة الاحترافية</p>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-electric-blue rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-all">
              <Settings className="h-5 w-5 text-white/60" />
              الإعدادات
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
