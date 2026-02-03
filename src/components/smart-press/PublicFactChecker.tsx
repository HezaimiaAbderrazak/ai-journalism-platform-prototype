"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Share2, 
  ExternalLink,
  AlertCircle,
  Scan
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function PublicFactChecker() {
  const [input, setInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    verdict: string;
    confidence: string;
    details: string;
    correction: string;
    ethics_check: string;
  } | null>(null);

  const handleVerify = async () => {
    if (!input.trim()) return;
    setIsVerifying(true);
    setResult(null);

    try {
      const response = await fetch("/api/fact-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ headline: input }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          verdict: data.verdict,
          confidence: data.confidence,
          details: data.details,
          correction: data.correction,
          ethics_check: data.ethics_check,
        });
      } else {
        throw new Error(data.error || "فشل التحقق");
      }
    } catch (error) {
      console.error("Fact-check error:", error);
      // Fallback result on error
      setResult({
        verdict: "فشل الاتصال ⚠️",
        confidence: "0%",
        details: "تعذر الاتصال بمحرك الذكاء الاصطناعي. يرجى المحاولة مرة أخرى لاحقاً.",
        correction: "تأكد من اتصالك بالإنترنت أو تحقق من حالة الخادم.",
        ethics_check: "غير معروف"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <section className="space-y-12 py-20 px-8 rounded-[4rem] bg-gradient-to-br from-royal-blue/5 via-white to-royal-blue/5 border border-royal-blue/10 relative overflow-hidden shadow-sm">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-royal-blue/5 rounded-full blur-[100px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-electric-blue/5 rounded-full blur-[100px] -ml-48 -mb-48" />
        <ShieldCheck className="absolute -bottom-10 -right-10 h-64 w-64 text-royal-blue/5 -rotate-12" />

        <div className="max-w-4xl mx-auto space-y-10 relative z-10">
            <div className="text-center space-y-6">
                <div className="inline-flex items-center gap-3 px-6 py-2 bg-white shadow-xl shadow-royal-blue/5 rounded-2xl border border-royal-blue/10">
                    <div className="h-2 w-2 rounded-full bg-royal-blue animate-pulse" />
                    <span className="text-royal-blue font-black text-xs uppercase tracking-widest">خدمة صدى العامة للجمهور</span>
                </div>
                <h2 className="text-5xl font-black text-dark-slate leading-tight">
                    محرك <span className="text-royal-blue">التحقق الذكي</span>
                </h2>
                <p className="text-slate-500 font-medium text-xl max-w-2xl mx-auto">
                    نظام صدى المتطور لفحص الأخبار ومكافحة التضليل الرقمي باستخدام تقنيات الذكاء الاصطناعي السيادي.
                </p>
            </div>

            <Card className="bg-white/80 backdrop-blur-xl border-white border-2 shadow-2xl rounded-[3rem] overflow-hidden p-3 group transition-all hover:shadow-royal-blue/10">
                <CardContent className="p-8 space-y-6">
                    <div className="relative">
                        <Textarea 
                            placeholder="ألصق عنوان الخبر، الادعاء المشبوه، أو النص المراد التحقق منه هنا..."
                            className="min-h-[180px] text-xl font-medium p-8 rounded-[2.5rem] bg-slate-50/50 border-slate-100 focus:border-royal-blue/30 focus:ring-royal-blue/10 resize-none transition-all placeholder:text-slate-300"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <div className="absolute bottom-6 left-6">
                            <Button 
                                onClick={handleVerify}
                                disabled={isVerifying || !input.trim()}
                                className="h-16 px-12 bg-royal-blue hover:bg-royal-blue/90 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-royal-blue/20 flex items-center gap-4 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {isVerifying ? (
                                    <>
                                        <Scan className="h-6 w-6 animate-spin" />
                                        جاري المسح...
                                    </>
                                ) : (
                                    <>
                                        <ShieldCheck className="h-6 w-6" />
                                        تحقق الآن
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 px-4">
                        <div className="flex -space-x-2 rtl:space-x-reverse">
                            {[1,2,3].map(i => (
                                <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                                    AI
                                </div>
                            ))}
                        </div>
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                            <span className="h-1 w-1 rounded-full bg-royal-blue" />
                            يتم الفحص عبر 12 قاعدة بيانات دولية ومحلية
                        </p>
                    </div>
                </CardContent>
            </Card>

            <AnimatePresence mode="wait">
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className="space-y-6"
                    >
                        <Card className={cn(
                            "border-none shadow-2xl rounded-[3.5rem] overflow-hidden transition-all duration-700 relative",
                            result.verdict.includes("✅") ? "bg-emerald-50/40" : "bg-red-50/40"
                        )}>
                            {/* Result Backdrop Glow */}
                            <div className={cn(
                                "absolute inset-0 opacity-10 blur-[100px]",
                                result.verdict.includes("✅") ? "bg-emerald-500" : "bg-red-500"
                            )} />

                            <CardContent className="p-12 space-y-10 relative z-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <Badge className={cn(
                                        "px-8 py-3.5 rounded-2xl font-black text-2xl border-none shadow-2xl",
                                        result.verdict.includes("✅") ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
                                    )}>
                                        {result.verdict}
                                    </Badge>
                                    <div className="flex gap-4">
                                        <Badge variant="outline" className="bg-white/50 border-royal-blue/20 text-royal-blue px-4 py-2 rounded-xl font-black">
                                            نسبة التأكد: {result.confidence}
                                        </Badge>
                                        <Badge variant="outline" className="bg-white/50 border-royal-blue/20 text-royal-blue px-4 py-2 rounded-xl font-black">
                                            الأخلاقيات: {result.ethics_check}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid gap-10">
                                    <div className="space-y-4">
                                        <h4 className="text-2xl font-black text-dark-slate flex items-center gap-4">
                                            {result.verdict.includes("✅") ? (
                                                <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                                    <XCircle className="h-6 w-6 text-red-500" />
                                                </div>
                                            )}
                                            {result.verdict.includes("✅") ? "تحليل المصداقية" : "التصحيح المعتمد"}
                                        </h4>
                                        <p className={cn(
                                            "text-2xl leading-relaxed font-bold",
                                            result.verdict.includes("✅") ? "text-emerald-900" : "text-red-900"
                                        )}>
                                            {result.verdict.includes("✅") ? result.details : result.correction}
                                        </p>
                                    </div>

                                    {!result.verdict.includes("✅") && (
                                        <div className="p-8 bg-white/60 backdrop-blur-md rounded-[2.5rem] border border-red-100 shadow-inner">
                                            <h5 className="font-black text-red-600 mb-3 flex items-center gap-2 text-lg">
                                                <AlertCircle className="h-5 w-5" />
                                                توضيح سياق الخبر
                                            </h5>
                                            <p className="text-slate-600 text-lg font-medium leading-relaxed">
                                                {result.details}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6 p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-royal-blue/10 shadow-inner">
                                        <div className="h-14 w-14 rounded-2xl bg-royal-blue flex items-center justify-center text-white shadow-lg shadow-royal-blue/20">
                                            <ShieldCheck className="h-7 w-7" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-1">المصدر والتحليل</p>
                                            <p className="font-black text-dark-slate text-xl">تحليل ذكاء صدى السيادي (Gemini Engine)</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    </section>
  );
}
