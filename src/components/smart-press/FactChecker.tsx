"use client";

import React, { useState } from "react";
import { 
  Search, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  ShieldCheck, 
  Zap, 
  Activity, 
  Globe, 
  Database,
  Radar,
  FileText,
  ExternalLink,
  ShieldAlert
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function FactChecker() {
  const [input, setInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<{
    verdict: string;
    confidence: string;
    details: string;
    correction: string;
    ethics_check: string;
  } | null>(null);

    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
      if (!input.trim()) return;
      setIsVerifying(true);
      setResult(null);
      setError(null);

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
            ethics_check: data.ethics_check || "آمن",
          });
        } else {
          setError(data.details || "تعذر الاتصال بالمحرك، حاول مجدداً");
        }
      } catch (error) {
        console.error("Fact Check Error:", error);
        setError("تعذر الاتصال بالمحرك، حاول مجدداً");
      } finally {
        setIsVerifying(false);
      }
    };

  const getVerdictStyles = (verdict: string) => {
    if (verdict.includes("صحيح")) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (verdict.includes("زائف") || verdict.includes("غير مهني")) return "bg-rose-50 text-rose-700 border-rose-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  const getVerdictIcon = (verdict: string) => {
    if (verdict.includes("صحيح")) return <CheckCircle2 className="h-12 w-12" />;
    if (verdict.includes("زائف")) return <ShieldAlert className="h-12 w-12" />;
    return <AlertTriangle className="h-12 w-12" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20 font-readex" dir="rtl">
      {/* Header & Search */}
      <section className="text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-royal-blue/5 border border-royal-blue/10 rounded-full text-royal-blue text-xs font-black uppercase tracking-widest">
            <ShieldCheck className="h-4 w-4" />
            نظام حماية الحقيقة السيادي
          </div>
          <h1 className="text-5xl font-black text-dark-slate leading-tight">
            محرك التحقق <span className="text-royal-blue">الذكي</span>
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto font-medium">
            نظام صدى المتطور لفحص الأخبار ومكافحة التضليل الرقمي باستخدام تقنيات الذكاء الاصطناعي.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto bento-card p-2 overflow-hidden bg-white/80 backdrop-blur-xl border-royal-blue/10 shadow-2xl">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-6 w-6 text-royal-blue/40" />
                <Input 
                  placeholder="أدخل عنوان الخبر أو النص المراد التحقق منه..." 
                  className="pr-14 h-20 text-xl rounded-2xl bg-white border-royal-blue/10 focus:ring-royal-blue/20 focus:border-royal-blue shadow-inner"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
              </div>
                <Button 
                  size="lg" 
                  onClick={handleVerify} 
                  disabled={isVerifying || !input}
                  className="h-20 px-12 bg-royal-blue hover:bg-dark-slate text-white rounded-2xl font-black text-xl shadow-lg shadow-royal-blue/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-7 w-7 animate-spin" />
                      <span>Loading...</span>
                    </div>
                  ) : (
                    "تحقق الآن"
                  )}
                </Button>
              </div>
              {error && (
                <div className="mt-4 p-4 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 font-bold text-center animate-shake">
                  {error}
                </div>
              )}
            </CardContent>
        </Card>
      </section>

      {/* States Animation */}
      <AnimatePresence mode="wait">
        {isVerifying && (
          <motion.div 
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-8"
          >
            <div className="relative">
              <div className="h-56 w-56 rounded-full border-4 border-royal-blue/5 animate-pulse" />
              <div className="absolute inset-0 h-56 w-56 rounded-full border-t-4 border-royal-blue animate-spin" />
              <Radar className="absolute inset-0 m-auto h-24 w-24 text-royal-blue animate-pulse" />
            </div>
            <div className="text-center space-y-3">
              <h3 className="text-3xl font-black text-dark-slate">جاري تحليل البيانات عبر محرك صدى...</h3>
              <p className="text-muted-foreground text-lg font-medium italic">يتم فحص المصادر، السياق، والمصداقية التاريخية للخبر.</p>
            </div>
          </motion.div>
        )}

        {result && !isVerifying && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Verdict Badge */}
            <Card className="lg:col-span-1 border-none shadow-2xl bg-white overflow-hidden rounded-[2.5rem]">
              <div className={`p-10 border-b-8 flex flex-col items-center text-center gap-8 ${getVerdictStyles(result.verdict).split(' ').pop().replace('text-', 'border-')}`}>
                <div className={`h-32 w-32 rounded-full flex items-center justify-center shadow-2xl ${getVerdictStyles(result.verdict)}`}>
                  {getVerdictIcon(result.verdict)}
                </div>
                <div>
                  <h2 className="text-4xl font-black mb-3">{result.verdict}</h2>
                  <div className="inline-flex items-center gap-3 px-6 py-2.5 bg-dark-slate/5 rounded-full text-base font-black">
                    <Activity className="h-5 w-5 text-royal-blue" />
                    مستوى الثقة: {result.confidence}
                  </div>
                </div>
              </div>
              <div className="p-10 space-y-6">
                <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-500 text-lg">الحالة الأخلاقية:</span>
                  <span className={`font-black text-lg ${result.ethics_check === "آمن" ? "text-emerald-600" : "text-rose-600"}`}>
                    {result.ethics_check}
                  </span>
                </div>
                <Button variant="outline" className="w-full h-16 rounded-2xl border-2 border-royal-blue text-royal-blue font-black text-lg hover:bg-royal-blue/5">
                  <ExternalLink className="ml-2 h-6 w-6" />
                  تحميل تقرير التقصي (PDF)
                </Button>
              </div>
            </Card>

            {/* Right Column: Details & Correction */}
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-xl bg-white p-10 rounded-[2.5rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                  <FileText className="h-48 w-48" />
                </div>
                <h3 className="text-2xl font-black mb-8 flex items-center gap-4">
                  <Zap className="h-8 w-8 text-royal-blue" />
                  التحليل الذكي للمحتوى
                </h3>
                <div className="bg-royal-blue/5 p-8 rounded-3xl border-r-8 border-royal-blue">
                  <p className="text-2xl leading-relaxed text-dark-slate font-medium italic">
                    "{result.details}"
                  </p>
                </div>
              </Card>

              {result.correction && (
                <Card className="border-none shadow-2xl bg-emerald-50/50 p-10 rounded-[2.5rem] border-2 border-emerald-100 relative overflow-hidden">
                  <div className="absolute top-0 left-0 p-6 opacity-[0.05]">
                    <CheckCircle2 className="h-32 w-32 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-black mb-8 text-emerald-800 flex items-center gap-4">
                    <ShieldCheck className="h-8 w-8" />
                    تصحيح صدى المعتمد
                  </h3>
                  <div className="bg-white/80 p-8 rounded-3xl shadow-sm border border-emerald-100">
                    <p className="text-2xl leading-relaxed text-emerald-900 font-bold">
                      {result.correction}
                    </p>
                  </div>
                  <div className="mt-10 flex flex-wrap gap-4">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-black h-16 px-10 rounded-2xl text-lg shadow-xl shadow-emerald-600/20">
                      اعتماده كخبر صحيح
                    </Button>
                    <Button variant="ghost" className="h-16 px-8 rounded-2xl text-emerald-700 font-black text-lg hover:bg-emerald-100/50">
                      طلب مراجعة بشرية
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fact-Checking Badges Description */}
      {!result && !isVerifying && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
           {[
             { title: "تقاطع البيانات", desc: "مطابقة الخبر مع وكالات الأنباء العالمية والمحلية.", icon: Globe },
             { title: "تحليل المشاعر", desc: "كشف اللغة التحريضية أو غير المهنية تلقائياً.", icon: Activity },
             { title: "أرشفة صدى", desc: "التحقق من السجل التاريخي للناشر والمصدر.", icon: Database },
           ].map((item, i) => (
             <div key={i} className="p-6 rounded-3xl bg-white/40 border border-royal-blue/5 flex flex-col items-center text-center gap-4">
               <item.icon className="h-8 w-8 text-royal-blue" />
               <h4 className="font-black text-dark-slate">{item.title}</h4>
               <p className="text-sm font-medium">{item.desc}</p>
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
