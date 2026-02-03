"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  MessageSquare, 
  Upload, 
  Send, 
  CheckCircle2, 
  FileText, 
  ShieldCheck,
  AlertCircle,
  Link as LinkIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const RECENT_CORRECTIONS = [
  {
    id: 1,
    claim: "إغلاق مطار العاصمة بسبب عاصفة رملية",
    status: "verified",
    correction: "المطار يعمل بشكل طبيعي، العاصفة أثرت على الرؤية فقط دون تعليق الرحلات.",
    timestamp: "منذ ساعتين"
  },
  {
    id: 2,
    claim: "زيادة مفاجئة في أسعار الوقود بنسبة 20%",
    status: "fake",
    correction: "لم تصدر أي قرارات رسمية بهذا الخصوص، والأسعار الحالية مستقرة.",
    timestamp: "منذ 5 ساعات"
  },
  {
    id: 3,
    claim: "افتتاح أكبر حديقة ذكية في المنطقة غداً",
    status: "verified",
    correction: "تم تأكيد الموعد من قبل أمانة العاصمة وسيكون الافتتاح في تمام الـ 4 عصراً.",
    timestamp: "منذ 8 ساعات"
  }
];

export function CommunityContribution() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isRatingSubmitted, setIsRatingSubmitted] = useState(false);
  
  const [reportForm, setReportForm] = useState({
    headline: "",
    description: "",
    category: "عام"
  });
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);

  const handleRatingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setIsRatingSubmitted(true);
    setTimeout(() => setIsRatingSubmitted(false), 5000);
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.headline || !reportForm.description) return;
    setIsReportSubmitted(true);
    setTimeout(() => {
      setIsReportSubmitted(false);
      setReportForm({ headline: "", description: "", category: "عام" });
    }, 5000);
  };

  return (
    <section className="space-y-16 py-20 border-t border-slate-100 font-readex" dir="rtl">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge className="bg-royal-blue/10 text-royal-blue border-none px-4 py-1 rounded-full font-black text-xs uppercase tracking-widest">المجتمع والمساهمة</Badge>
        <h2 className="text-4xl font-black text-dark-slate">كن جزءاً من <span className="text-royal-blue">الحقيقة</span></h2>
        <p className="text-slate-500 font-medium text-lg">نحن نؤمن بقوة المجتمع في مكافحة التضليل وصناعة الخبر الصادق.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* 1. User Feedback & Rating */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="bg-white border-none rounded-[3.5rem] shadow-2xl p-10 flex flex-col h-full relative overflow-hidden">
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-royal-blue/10 flex items-center justify-center text-royal-blue">
                  <Star className="h-6 w-6 fill-current" />
                </div>
                <h3 className="text-2xl font-black text-dark-slate">تقييم المنصة</h3>
              </div>

              <AnimatePresence mode="wait">
                {!isRatingSubmitted ? (
                  <motion.form 
                    key="rating-form"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleRatingSubmit} 
                    className="space-y-6"
                  >
                    <div className="space-y-3">
                      <p className="text-sm font-bold text-slate-400 text-center">ما مدى رضاك عن أداء صدى؟</p>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setRating(star)}
                            className="focus:outline-none transition-transform hover:scale-125"
                          >
                            <Star 
                              className={cn(
                                "h-10 w-10 transition-colors",
                                (hoverRating || rating) >= star 
                                  ? "fill-amber-400 text-amber-400" 
                                  : "text-slate-200"
                              )} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Textarea 
                        placeholder="اترك ملاحظاتك هنا..." 
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="min-h-[120px] rounded-[1.5rem] border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-royal-blue/20 transition-all p-5 font-medium resize-none"
                      />
                      <Button 
                        type="submit" 
                        disabled={rating === 0}
                        className="w-full h-14 rounded-2xl bg-royal-blue text-white font-black shadow-xl shadow-royal-blue/20 hover:scale-[1.02] transition-all gap-3"
                      >
                        <Send className="h-5 w-5" />
                        إرسال التقييم
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="rating-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-6"
                  >
                    <div className="h-20 w-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="h-12 w-12" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-black text-dark-slate">شكراً لتقييمك!</h4>
                      <p className="text-slate-500 font-medium">نحن نقدر وقتك وملاحظاتك لتطوير صدى.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Background Decorative Circles */}
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-royal-blue/5 blur-3xl" />
          </Card>
        </div>

        {/* 2. 'Report a News' Form */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="bg-white border-none rounded-[3.5rem] shadow-2xl p-10 flex flex-col h-full border-t-8 border-emerald-500">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-black text-dark-slate">ساهم في الخبر</h3>
              </div>

              <AnimatePresence mode="wait">
                {!isReportSubmitted ? (
                  <motion.form 
                    key="report-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleReportSubmit} 
                    className="space-y-5"
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1 space-y-2">
                          <label className="text-xs font-black text-slate-400 px-2 uppercase tracking-widest">عنوان الخبر</label>
                          <Input 
                            placeholder="ماذا حدث؟" 
                            value={reportForm.headline}
                            onChange={(e) => setReportForm({...reportForm, headline: e.target.value})}
                            className="h-14 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white font-bold"
                          />
                        </div>
                        <div className="col-span-2 md:col-span-1 space-y-2">
                          <label className="text-xs font-black text-slate-400 px-2 uppercase tracking-widest">التصنيف</label>
                          <select 
                            value={reportForm.category}
                            onChange={(e) => setReportForm({...reportForm, category: e.target.value})}
                            className="w-full h-14 rounded-2xl border border-slate-100 bg-slate-50/50 px-4 font-bold text-dark-slate focus:bg-white outline-none focus:ring-2 focus:ring-emerald-500/20"
                          >
                            <option>عام</option>
                            <option>سياسة</option>
                            <option>اقتصاد</option>
                            <option>تكنولوجيا</option>
                            <option>رياضة</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 px-2 uppercase tracking-widest">تفاصيل الخبر</label>
                        <Textarea 
                          placeholder="اشرح لنا القصة بمزيد من التفاصيل..." 
                          value={reportForm.description}
                          onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                          className="min-h-[140px] rounded-[1.5rem] border-slate-100 bg-slate-50/50 focus:bg-white font-medium resize-none p-5"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="flex-1 h-14 rounded-2xl border-dashed border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-600 transition-all font-black gap-3"
                        >
                          <Upload className="h-5 w-5" />
                          ارفاق دليل (صور/PDF)
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="h-14 w-14 rounded-2xl border-dashed border-2 border-slate-200 hover:border-royal-blue hover:bg-royal-blue/5 hover:text-royal-blue transition-all"
                        >
                          <LinkIcon className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full h-16 rounded-[1.5rem] bg-emerald-500 text-white font-black shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all gap-3"
                    >
                      <CheckCircle2 className="h-6 w-6" />
                      إرسال للمراجعة
                    </Button>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="report-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 text-center space-y-6"
                  >
                    <div className="h-24 w-24 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="h-14 w-14" />
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-2xl font-black text-dark-slate">تم الاستلام بنجاح!</h4>
                      <p className="text-slate-500 font-medium text-lg">شكراً لك! يقوم خبراؤنا والذكاء الاصطناعي الآن بالتحقق من صحة بلاغك.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>

        {/* 3. Latest Verified News Feed */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                أحدث التصحيحات
              </h4>
              <Badge variant="outline" className="rounded-lg text-[10px] font-black border-slate-200">مباشر</Badge>
            </div>

            <div className="space-y-4">
              {RECENT_CORRECTIONS.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className="bg-white border-none rounded-3xl shadow-lg hover:shadow-xl transition-all overflow-hidden group">
                    <CardContent className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={cn(
                          "rounded-lg px-2 py-0.5 text-[10px] font-black border-none",
                          item.status === "verified" ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                        )}>
                          {item.status === "verified" ? "مؤكد" : "مضلل"}
                        </Badge>
                        <span className="text-[10px] font-bold text-slate-400">{item.timestamp}</span>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs font-black text-dark-slate line-clamp-1 group-hover:text-royal-blue transition-colors">
                          {item.claim}
                        </p>
                        <p className="text-[10px] font-medium text-slate-500 line-clamp-2 leading-relaxed bg-slate-50 rounded-xl p-2.5 border border-slate-100">
                          {item.correction}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <Button variant="ghost" className="w-full rounded-2xl font-black text-royal-blue hover:bg-royal-blue/5 transition-all gap-2 text-sm">
              عرض سجل التحقق الكامل
              <FileText className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
