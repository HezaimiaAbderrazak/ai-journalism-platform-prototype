"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  X, 
  Send, 
  MessageSquare, 
  Bot, 
  Zap, 
  FileText, 
  Search, 
  Minus,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "ai" | "user";
  text: string;
  timestamp: Date;
}

const QUICK_ACTIONS = [
  { id: "script", label: "ساعدني في سكريبت", icon: FileText },
  { id: "verify", label: "تحقق من معلومة", icon: Search },
  { id: "summarize", label: "لخص لي مقال", icon: Zap },
];

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      text: "أهلاً بك في صدى! كيف يمكنني مساعدتك اليوم في مهامك الصحفية؟",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen, isTyping]);

  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim() || isTyping) return;

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      // Use the internal API route which handles the Gemini logic securely
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      
      const data = await response.json();
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text: data.reply || data.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        text: "عذراً، حدث خطأ في الاتصال بمساعد صدى. يرجى المحاولة لاحقاً.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[100] font-readex" dir="rtl">
      {/* Floating Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full bg-royal-blue text-white shadow-2xl flex items-center justify-center relative group overflow-hidden",
          !isOpen && "animate-pulse-slow"
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-royal-blue via-royal-blue to-electric-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-8 w-8 relative z-10" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="relative z-10"
            >
              <Sparkles className="h-8 w-8 fill-white/20" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(30,64,175,0.4)] pointer-events-none" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, transformOrigin: "bottom left" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 left-0 w-[380px] h-[550px] bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-royal-blue p-6 flex items-center justify-between text-white shadow-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                    <Bot className="h-6 w-6" />
                  </div>
                  <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-royal-blue shadow-sm" />
                </div>
                <div>
                  <h3 className="font-black text-sm">مساعد صدى الذكي</h3>
                  <div className="flex items-center gap-1.5 opacity-80">
                    <span className="text-[10px] font-bold uppercase tracking-widest">نشط الآن</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide"
            >
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: msg.type === "ai" ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      "flex flex-col max-w-[85%]",
                      msg.type === "user" ? "mr-auto items-end" : "ml-auto items-start"
                    )}
                  >
                    <div className={cn(
                      "px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-sm",
                      msg.type === "user" 
                        ? "bg-royal-blue text-white rounded-bl-none border border-royal-blue/10" 
                        : "bg-white text-slate-700 rounded-br-none border border-slate-100"
                    )}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 font-bold">
                      {msg.timestamp.toLocaleTimeString("ar-SA", { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col max-w-[85%] ml-auto items-start"
                  >
                    <div className="bg-white text-slate-700 px-4 py-3 rounded-2xl rounded-br-none shadow-sm border border-slate-100 flex items-center gap-2">
                      <div className="flex gap-1">
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }} className="w-1.5 h-1.5 bg-royal-blue rounded-full" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 bg-royal-blue rounded-full" />
                        <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 bg-royal-blue rounded-full" />
                      </div>
                      <span className="text-[10px] font-black text-royal-blue uppercase tracking-widest">الذكاء الاصطناعي يفكر...</span>
                    </div>
                  </motion.div>
                )}

              {/* Quick Actions */}
              <div className="pt-2 flex flex-wrap gap-2">
                {QUICK_ACTIONS.map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleSendMessage(action.label)}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-royal-blue/5 border border-slate-100 hover:border-royal-blue/20 rounded-full text-xs font-black text-slate-600 hover:text-royal-blue transition-all group"
                  >
                    <action.icon className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-slate-50/50 border-t border-slate-100">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="relative"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="اسأل مساعد صدى..."
                  className="w-full bg-white border border-slate-200 rounded-2xl py-4 pr-12 pl-14 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-royal-blue/20 transition-all placeholder:text-slate-400"
                />
                <div className="absolute inset-y-0 right-4 flex items-center text-slate-300">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute inset-y-2 left-2 w-10 bg-royal-blue hover:bg-royal-blue/90 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(30, 64, 175, 0.4); }
          50% { transform: scale(1.05); box-shadow: 0 0 20px 10px rgba(30, 64, 175, 0); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
