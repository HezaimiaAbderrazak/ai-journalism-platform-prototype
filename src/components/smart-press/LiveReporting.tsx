"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Radio, 
  StopCircle, 
  MapPin, 
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Camera,
  Play,
  Phone,
  Maximize2,
  Minimize2,
  Share2,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useArticles } from "@/context/ArticleContext";
import { cn } from "@/lib/utils";

export function LiveReporting() {
  const { addLiveReport, liveReports, updateLiveReport } = useArticles();
  const [isStreaming, setIsStreaming] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    location: ""
  });
  
  const videoRef = useRef<HTMLVideoElement>(null);
    const [elapsedTime, setElapsedTime] = useState("00:00");
    const [isExpanded, setIsExpanded] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleShare = async () => {
      const shareData = {
        title: 'بث مباشر صدى',
        text: `شاهد البث المباشر للمراسل ${formData.name || 'مجهول'} من ${formData.location || 'موقع مجهول'}`,
        url: window.location.href,
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else {
          await navigator.clipboard.writeText(window.location.href);
          alert("تم نسخ الرابط للمشاركة!");
        }
      } catch (err) {
        console.error("Error sharing:", err);
      }
    };

  // Find the current request status
  const currentRequest = liveReports.find(r => r.id === requestId);
  const status = currentRequest?.status || "idle";

  useEffect(() => {
    if (status === "live" && !timerRef.current) {
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        setElapsedTime(`${mins}:${secs}`);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const requestPermissions = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setPermissionGranted(true);
    } catch (err) {
      console.error("Error accessing media devices:", err);
      alert("يرجى تفعيل صلاحيات الكاميرا والميكروفون للمتابعة.");
    }
  };

  const startRequest = async () => {
    if (!formData.name || !formData.location) return;
    
    const id = Math.random().toString(36).substr(2, 9);
    setRequestId(id);
    setIsStreaming(true);

    // Add to global context as pending
    addLiveReport({
      id: id,
      reporterName: formData.name,
      location: formData.location,
      timestamp: "الآن",
      status: "pending",
      streamUrl: "#",
      thumbnail: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400"
    });

    // Notify backend
    try {
      await fetch('/api/live-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', requestId: id })
      });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsStreaming(false);
    setPermissionGranted(false);
    setStream(null);
    setRequestId(null);
    setFormData({ name: "", location: "" });
    setElapsedTime("00:00");
    if (timerRef.current) clearInterval(timerRef.current);
  };

  return (
    <Card className="bg-white border-none rounded-[3.5rem] shadow-2xl overflow-hidden font-readex" dir="rtl">
      <div className="grid lg:grid-cols-2">
          {/* Left: Camera Feed / Preview */}
            <div className={cn(
              "bg-slate-900 aspect-video lg:aspect-auto relative flex items-center justify-center overflow-hidden transition-all duration-700 ease-in-out",
              isExpanded ? "fixed inset-0 z-[100] bg-black" : "relative rounded-r-[3.5rem]"
            )}>
              {isExpanded && (
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1/4 bg-gradient-to-b from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/90 to-transparent" />
                  {/* Studio Scanning Lines */}
                  <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                </div>
              )}
              
              {isExpanded && (
                <div className="absolute top-10 left-10 z-[110] flex items-center gap-6">
                  <Button 
                    onClick={() => setIsExpanded(false)}
                    className="h-16 w-16 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-2xl text-white border border-white/20 shadow-2xl transition-all hover:scale-110 active:scale-95"
                  >
                    <X className="h-8 w-8" />
                  </Button>
                  <div className="flex flex-col">
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Sada Intelligence</span>
                    <span className="text-white text-2xl font-black italic tracking-tighter flex items-center gap-3">
                      LIVE STUDIO
                      <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_#dc2626]" />
                    </span>
                  </div>
                </div>
              )}
            <AnimatePresence mode="wait">
              {!permissionGranted ? (
                <motion.div 
                  key="permission"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-6 p-10"
                >
                  <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center mx-auto border-2 border-dashed border-white/20">
                    <Camera className="h-10 w-10 text-white/40" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-xl font-black text-white">مطلوب إذن الكاميرا</h4>
                    <p className="text-white/40 text-sm font-medium">نحتاج للوصول إلى الكاميرا والميكروفون لبدء البث المباشر.</p>
                    <Button 
                      onClick={requestPermissions}
                      className="bg-royal-blue hover:bg-royal-blue/80 text-white rounded-full px-8 py-6 font-black gap-2"
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      منح الصلاحيات
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="preview"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0"
                >
                  <video 
                    ref={videoRef}
                    autoPlay 
                    playsInline 
                    muted 
                    className={cn(
                      "w-full h-full object-cover",
                      status === "pending" && "opacity-40 grayscale"
                    )}
                  />
                  
                  {/* Overlay UI */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-8 right-8 z-20 flex flex-col gap-3 items-end">
                    <div className="flex gap-3">
                      <Button 
                        size="lg"
                        onClick={handleShare}
                        className="h-14 rounded-2xl bg-royal-blue text-white shadow-2xl shadow-royal-blue/30 border-none px-6 font-black gap-3 transition-all hover:scale-105 active:scale-95 group"
                      >
                        <Share2 className="h-6 w-6 transition-transform group-hover:rotate-12" />
                        مشاركة البث المباشر
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="h-14 w-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl border border-white/20"
                      >
                        {isExpanded ? <Minimize2 className="h-6 w-6" /> : <Maximize2 className="h-6 w-6" />}
                      </Button>
                    </div>
                    
                    <div className="flex flex-col gap-2 items-end">
                      {status === "live" && (
                        <div className="flex items-center gap-3">
                          <div className="flex -space-x-2 rtl:space-x-reverse items-center mr-2">
                            {[1,2,3].map(i => (
                              <div key={i} className="h-8 w-8 rounded-full border-2 border-slate-900 overflow-hidden bg-slate-800">
                                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="" />
                              </div>
                            ))}
                            <div className="h-8 w-8 rounded-full border-2 border-slate-900 bg-royal-blue flex items-center justify-center text-[10px] font-black text-white">
                              +24
                            </div>
                          </div>
                          <Badge className="bg-red-600 animate-pulse border-none px-6 py-2 rounded-full font-black flex items-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                            <div className="h-2 w-2 rounded-full bg-white" />
                            مباشر الآن
                          </Badge>
                          <Badge className="bg-black/40 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full font-black text-white tabular-nums">
                            {elapsedTime}
                          </Badge>
                        </div>
                      )}
                      
                      {status === "pending" && (
                        <Badge className="bg-royal-blue text-white border-none px-6 py-2 rounded-full font-black flex items-center gap-2 shadow-xl animate-pulse">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          يتم التدقيق في غرفة الأخبار...
                        </Badge>
                      )}
                    </div>
                  </div>

                {/* Sada Live Logo Overlay */}
                <div className="absolute top-8 left-8 z-20">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <span className="text-white font-black italic tracking-tighter">SADA</span>
                    <div className="w-[1px] h-4 bg-white/20" />
                    <span className="text-white/80 font-bold text-[10px] uppercase">Live Report</span>
                  </div>
                </div>

                <div className="absolute bottom-8 right-8 left-8 flex items-center justify-between z-20">
                  <div className="flex items-center gap-3 text-white">
                    <div className="h-12 w-12 rounded-full bg-royal-blue flex items-center justify-center shadow-lg">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">المراسل المواطن</p>
                      <p className="text-lg font-black">{formData.name || "مراسل مجهول"}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10">
                      <Mic className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10">
                      <Video className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Controls & Info */}
        <div className="p-10 lg:p-14 flex flex-col justify-center space-y-10 bg-white">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-12 bg-royal-blue rounded-full" />
              <Badge className="bg-royal-blue/10 text-royal-blue border-none px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest">
                خدمة صدى للمراسل المواطن
              </Badge>
            </div>
            <h3 className="text-4xl font-black text-dark-slate leading-tight">أنقل الحدث <span className="text-royal-blue italic">مباشرة</span></h3>
            <p className="text-slate-500 font-medium leading-relaxed text-lg">كن جزءاً من الحقيقة. سيتم إرسال بثك المباشر إلى <strong>غرفة الأخبار</strong> ليراجعه الصحفيون. لن يظهر البث للعامة إلا بعد <strong>موافقة رسمية</strong> من قبل الصحفي المناوب.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 px-2 uppercase tracking-widest flex items-center gap-2">
                  <User className="h-3 w-3" />
                  اسم المراسل
                </label>
                <Input 
                  disabled={isStreaming}
                  placeholder="أدخل اسمك الكامل"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="h-16 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:border-royal-blue/30 focus:ring-0 font-bold text-lg px-6 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 px-2 uppercase tracking-widest flex items-center gap-2">
                  <MapPin className="h-3 w-3" />
                  الموقع الميداني
                </label>
                <Input 
                  disabled={isStreaming}
                  placeholder="أين تتواجد الآن؟"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="h-16 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white focus:border-royal-blue/30 focus:ring-0 font-bold text-lg px-6 transition-all"
                />
              </div>
            </div>

            <div className="pt-4">
              {!isStreaming ? (
                <Button 
                  onClick={startRequest}
                  disabled={!formData.name || !formData.location || !permissionGranted}
                  className="w-full h-20 rounded-[2rem] bg-royal-blue hover:bg-royal-blue/90 text-white font-black shadow-2xl shadow-royal-blue/20 hover:scale-[1.02] active:scale-[0.98] transition-all gap-4 text-xl group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:animate-shimmer" />
                  <Radio className="h-8 w-8 animate-pulse" />
                  أنقل الحدث الآن
                </Button>
              ) : (
                <div className="flex flex-col gap-4">
                   {status === "approved" && (
                    <Button 
                      onClick={() => updateLiveReport(requestId!, { status: "live" })}
                      className="w-full h-20 rounded-[2rem] bg-red-600 hover:bg-red-700 text-white font-black shadow-2xl shadow-red-600/20 hover:scale-[1.02] transition-all gap-4 text-xl"
                    >
                      <Play className="h-8 w-8 fill-white" />
                      ابدأ البث المعتمد
                    </Button>
                  )}
                  <Button 
                    onClick={stopStream}
                    className="w-full h-20 rounded-[2rem] bg-slate-900 hover:bg-black text-white font-black shadow-xl hover:scale-[1.02] transition-all gap-4 text-xl"
                  >
                    <StopCircle className="h-8 w-8" />
                    إنهاء العملية
                  </Button>
                </div>
              )}
            </div>

              <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-3xl border border-slate-100">
                <div className="h-10 w-10 rounded-full bg-royal-blue/10 flex items-center justify-center shrink-0">
                  <AlertCircle className="h-6 w-6 text-royal-blue" />
                </div>
                <p className="text-xs font-bold text-slate-500 leading-relaxed">
                  بضغطك على "أنقل الحدث"، أنت تؤكد دقة المعلومات وتوافق على شروط الخدمة. سيتم تزويد الصحفيين ببيانات موقعك التقريبية لتوثيق الخبر.
                </p>
              </div>

              <div className="flex items-center gap-4 p-6 bg-royal-blue/5 rounded-3xl border border-royal-blue/10">
                <div className="h-10 w-10 rounded-full bg-royal-blue flex items-center justify-center shrink-0 shadow-lg shadow-royal-blue/20">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-black text-royal-blue uppercase tracking-widest">الدعم الفني - شركة صدى</p>
                  <p className="text-xl font-black text-dark-slate tabular-nums">0794828320</p>
                </div>
              </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
