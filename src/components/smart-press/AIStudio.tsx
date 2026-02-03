"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Video, 
  FileText, 
  ImagePlus, 
  Sparkles, 
  Monitor, 
  Smartphone,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  Play,
  CheckCircle2,
  User,
  Zap,
  Volume2,
  Mic2,
  ArrowRight,
  Settings2,
  Download,
  CheckCircle,
  Filter,
  Sun,
  Contrast,
  Droplets,
  Music,
  Mic,
  Activity,
  Waves,
  Scissors,
  Plus,
  Move,
  RotateCcw,
  Volume1,
  Maximize2,
  GripVertical,
  Trash2,
  Eye,
  Type,
  ShieldCheck,
  ShieldAlert,
  AlertCircle,
  Languages,
  LayoutTemplate,
  Loader2,
  Wand2,
  ImageIcon,
  Clapperboard
} from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface MediaItem {
  id: string;
  type: "image" | "video";
  url: string;
  duration: number;
  motionType: "none" | "zoom-in" | "zoom-out" | "pan-left" | "pan-right";
  title: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  { id: "1", type: "image", url: "https://images.unsplash.com/photo-1585829365294-bb7c63b3ec07", duration: 5, motionType: "zoom-in", title: "مشهد البداية" },
  { id: "2", type: "image", url: "https://images.unsplash.com/photo-1495020689067-958852a7765e", duration: 4, motionType: "pan-left", title: "تغطية ميدانية" },
  { id: "3", type: "image", url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c", duration: 6, motionType: "zoom-out", title: "لقاء صحفي" },
];

const FILTERS = [
  { id: "none", label: "بدون", class: "" },
  { id: "news", label: "مظهر إخباري", class: "saturate-150 contrast-110" },
  { id: "cinematic", label: "سينمائي", class: "sepia-[0.2] contrast-125 brightness-90" },
  { id: "dramatic", label: "درامي", class: "grayscale contrast-125 brightness-75" },
];

const VOICES = [
  { id: "anchor-1", name: "محمد (رسمي)", gender: "male" },
  { id: "anchor-2", name: "سارة (ديناميكية)", gender: "female" },
  { id: "anchor-3", name: "ياسين (هادئ)", gender: "male" },
];

const TONES = [
  { id: "formal", label: "جدي", icon: "👔" },
  { id: "excited", label: "حماسي", icon: "🔥" },
  { id: "calm", label: "هادئ", icon: "🌿" },
];

const LANGUAGES = [
  { id: "ar", label: "العربية", flag: "🇩🇿" },
  { id: "fr", label: "Français", flag: "🇫🇷" },
  { id: "en", label: "English", flag: "🇺🇸" },
];

const TEMPLATES = [
  { id: "breaking", label: "إخباري / عاجل (Standard)", desc: "يبدأ بالنتيجة المباشرة والخبر العاجل" },
  { id: "analytical", label: "تحليلي (Analytical)", desc: "يركز على الأسباب والتبعات العميقة" },
  { id: "explanatory", label: "تفسيري (Explanatory)", desc: "يبسط الخبر ويشرح السياق للجمهور" },
];

export function AIStudio({ initialScript = "" }: { initialScript?: string }) {
  const [currentStep, setCurrentStep] = useState(1); // 1: Launchpad, 2: Rendering, 3: Workshop
  const [script, setScript] = useState(initialScript || "أهلاً بكم في موجز الأخبار. كشفت مصادرنا اليوم عن تطورات هامة في القطاع التكنولوجي، حيث أطلقت الجزائر أول قمر صناعي محلي الصنع...");
  const [format, setFormat] = useState<"vertical" | "horizontal">("vertical");
  const [selectedVoice, setSelectedVoice] = useState("anchor-1");
  const [selectedTone, setSelectedTone] = useState("formal");
  const [selectedLang, setSelectedLang] = useState("ar");
  const [selectedTemplate, setSelectedTemplate] = useState("breaking");
  const [isRendering, setIsRendering] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Workshop State
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [selectedItemId, setSelectedItemId] = useState<string | null>("1");
  const [brightness, setBrightness] = useState([100]);
  const [contrast, setContrast] = useState([100]);
  const [saturation, setSaturation] = useState([100]);
  const [selectedFilter, setSelectedFilter] = useState("none");
  const [volume, setVolume] = useState([100]);
  const [bgMusic, setBgMusic] = useState([30]);
  const [isPurified, setIsPurified] = useState(false);
  const [isEthicalFilterActive, setIsEthicalFilterActive] = useState(true);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [showOriginalAudio, setShowOriginalAudio] = useState(false);

  const generateScriptWithAI = async (type: string = "script", lang: string = selectedLang) => {
    if (isGeneratingScript) return;
    setIsGeneratingScript(true);
    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: script, type, language: lang }),
      });

      const data = await response.json();
      if (data.response) {
        setScript(data.response);
      }
    } catch (error) {
      console.error("Error generating script:", error);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const generateImageWithAI = async () => {
    if (isGeneratingImage) return;
    setIsGeneratingImage(true);
    try {
      // Step 1: Extract a good prompt for image generation using Gemini
      const extractPrompt = `أعطني وصفاً دقيقاً بالإنجليزية لصورة فوتوغرافية احترافية تناسب هذا السكريبت: "${script.substring(0, 500)}". 
      اجعل الوصف تقنياً (مثلاً: professional photography, cinematic lighting, high resolution). 
      أريد الوصف بالإنجليزية فقط.`;
      
      const promptRes = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: extractPrompt }),
      });
      const promptData = await promptRes.json();
      const imageDescription = promptData.response || "Professional news photography, high resolution";

      // Step 2: Generate the image using Gemini Imagen
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imageDescription, type: "image" }),
      });

      const data = await response.json();
      
      if (data.response) {
        const newItem: MediaItem = {
          id: Date.now().toString(),
          type: "image",
          url: data.response,
          duration: 5,
          motionType: "zoom-in",
          title: "صورة مولدة بذكاء Gemini"
        };
        setMediaItems([...mediaItems, newItem]);
        setSelectedItemId(newItem.id);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const generateVideoWithAI = async () => {
    if (isGeneratingVideo) return;
    setIsGeneratingVideo(true);
    try {
      const extractPrompt = `أعطني وصفاً دقيقاً بالإنجليزية لمشهد فيديو احترافي (8 ثوانٍ) يناسب هذا السكريبت: "${script.substring(0, 500)}". 
      صف الحركة والكاميرا (مثلاً: drone shot, pan left, slow motion). 
      أريد الوصف بالإنجليزية فقط.`;
      
      const promptRes = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: extractPrompt }),
      });
      const promptData = await promptRes.json();
      const videoDescription = promptData.response || "Cinematic news footage, slow motion";

      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: videoDescription, type: "video" }),
      });
      
      const data = await res.json();
      
      if (data.response) {
        const newItem: MediaItem = {
          id: Date.now().toString(),
          type: "video",
          url: data.response, 
          duration: 8,
          motionType: "pan-left",
          title: "فيديو مولد بذكاء Gemini Veo"
        };
        setMediaItems([...mediaItems, newItem]);
        setSelectedItemId(newItem.id);
      }
    } catch (error) {
      console.error("Error generating video:", error);
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleStartRendering = () => {
    setCurrentStep(2);
    setIsRendering(true);
    setRenderProgress(0);
    const interval = setInterval(() => {
      setRenderProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRendering(false);
          setCurrentStep(3);
          return 100;
        }
        return prev + 2;
      });
    }, 40);
  };

  const handleTrySample = () => {
    let generatedScript = "";

    if (selectedLang === "ar") {
      if (selectedTemplate === "breaking") {
        generatedScript = `[مشهد 1: لقطات جوية لمكان الحادث بالطريق السريع]\n(صوت المذيع - بنبرة عاجلة): فاجعة مرورية تهز الطريق السريع اليوم.. لقي 4 أشخاص حتفهم وأصيب 2 آخرون في حادث سير مروع وقع قبل قليل نتيجة اصطدام تسلسلي.\n\n[مشهد 2: سيارات الإسعاف وفرق الحماية المدنية في الموقع]\n(صوت المذيع): فرق الإنقاذ لا تزال في الموقع لإجلاء الجرحى وتسهيل حركة المرور التي توقفت تماماً، وسط دعوات للسائقين بتوخي الحذر.`;
      } else if (selectedTemplate === "analytical") {
        generatedScript = `[مشهد 1: رسم بياني لمعدلات الحوادث في هذا المقطع]\n(صوت المذيع - بنبرة تحليلية): وراء الأرقام المفجعة لحادث اليوم، يبرز تساؤل عميق حول أمن الطرقات. وفاة 4 أشخاص اليوم ليست مجرد رقم، بل هي نتيجة لغياب إجراءات السلامة في هذا المنعرج.\n\n[مشهد 2: لقطة قريبة للطريق المتضرر]\n(صوت المذيع): المحللون يربطون بين تكرار هذه الحوادث وبين تهالك الطبقة الزفتية، مما يجعل هذا الطريق "نقطة سوداء" تستدعي تدخلاً جذرياً لا مجرد حلول ترقيعية.`;
      } else {
        generatedScript = `[مشهد 1: شرح تفصيلي لمكان الحادث عبر خريطة تفاعلية]\n(صوت المذيع - بنبرة تفسيرية): لتفهموا ما حدث اليوم في الطريق السريع.. الحادث وقع عند النقطة الكيلومترية 45، وهي منطقة تتميز بانحدار حاد وضبابية في الرؤية، مما خلف 4 ضحايا.\n\n[مشهد 2: نصائح مرورية مصورة]\n(صوت المذيع): الخبراء يوضحون أن الاصطدام نتج عن فقدان السيطرة على المكابح، وهو ما يفسر خطورة الحوادث في هذه النقطة بالتحديد.`;
      }
    } else if (selectedLang === "fr") {
      if (selectedTemplate === "breaking") {
        generatedScript = `[Scène 1: Vue aérienne du lieu de l'accident sur l'autoroute]\n(Voix-off - Ton urgent): Drame sur l'autoroute aujourd'hui. Un accident tragique a fait 4 morts et 2 blessés graves il y a quelques instants suite à une collision en chaîne.\n\n[Scène 2: Ambulances et secours sur place]\n(Voix-off): Les secours sont actuellement sur place pour dégager les voies et porter assistance aux victimes.`;
      } else {
        generatedScript = `[Scène 1: Infographie sur les causes de l'accident]\n(Voix-off): Analysons les causes de ce drame autoroutier qui a coûté la vie à 4 personnes. L'absence de signalisation semble être au cœur du problème.\n\n[Scène 2: Interview d'un expert sécurité]\n(Voix-off): Les autorités appellent à une révision urgente des protocoles de sécurité sur ce tronçon particulièrement dangereux.`;
      }
    } else {
      if (selectedTemplate === "breaking") {
        generatedScript = `[Scene 1: Aerial view of the highway accident site]\n(Voice-over - Urgent tone): Breaking news from the highway. A devastating traffic accident has claimed 4 lives and left 2 others injured in a major pile-up.\n\n[Scene 2: Emergency services at the scene]\n(Voice-over): First responders are on site managing the aftermath. Traffic remains at a standstill as investigations continue.`;
      } else {
        generatedScript = `[Scene 1: Data visualization of local traffic safety]\n(Voice-over): Analyzing today's highway tragedy. With 4 fatalities confirmed, experts are pointing toward speed limit violations as the primary cause.\n\n[Scene 2: Close-up of highway safety signs]\n(Voice-over): This incident highlights the urgent need for stricter enforcement of road safety regulations in high-risk zones.`;
      }
    }

    setScript(generatedScript);
  };

  const selectedItem = mediaItems.find(item => item.id === selectedItemId);

  const addMedia = () => {
    const newItem: MediaItem = {
      id: Date.now().toString(),
      type: "image",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa",
      duration: 3,
      motionType: "none",
      title: "لقطة جديدة"
    };
    setMediaItems([...mediaItems, newItem]);
    setSelectedItemId(newItem.id);
  };

  const removeMedia = (id: string) => {
    const filtered = mediaItems.filter(item => item.id !== id);
    setMediaItems(filtered);
    if (selectedItemId === id) setSelectedItemId(filtered[0]?.id || null);
  };

  return (
    <div className="space-y-8 pb-20" dir="rtl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight flex items-center gap-4">
            <div className="p-3 bg-royal-blue text-white rounded-[1.5rem] shadow-xl shadow-royal-blue/20">
              <Video className="h-8 w-8" />
            </div>
            استوديو Sada للإنتاج الاحترافي
          </h1>
          <p className="text-slate-500 font-medium mt-2">رحلة إبداعية من الفكرة الخام إلى المحتوى الاحترافي والآمن.</p>
        </div>

        <div className="flex items-center gap-4">
          {currentStep === 3 && (
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500",
              isEthicalFilterActive ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-slate-50 border-slate-200 text-slate-400"
            )}>
              {isEthicalFilterActive ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
              <span className="text-xs font-black uppercase tracking-widest">
                {isEthicalFilterActive ? "محتوى آمن نشط" : "الفلتر الأخلاقي متوقف"}
              </span>
            </div>
          )}
          <div className="flex bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100 items-center gap-1">
            <div className={cn(
              "px-6 py-2 rounded-2xl text-xs font-black transition-all",
              currentStep === 1 ? "bg-royal-blue text-white shadow-lg" : "text-slate-400"
            )}>منصة الإطلاق</div>
            <div className={cn(
              "px-6 py-2 rounded-2xl text-xs font-black transition-all",
              currentStep === 2 ? "bg-royal-blue text-white shadow-lg" : "text-slate-400"
            )}>الإنتاج المبدئي</div>
            <div className={cn(
              "px-6 py-2 rounded-2xl text-xs font-black transition-all",
              currentStep === 3 ? "bg-royal-blue text-white shadow-lg" : "text-slate-400"
            )}>الورشة الاحترافية</div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Stage 1: The Creator Launchpad */}
        {currentStep === 1 && (
          <motion.div
            key="launchpad"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Input Section */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-[3rem] p-10 shadow-sm border-2 border-slate-50 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-royal-blue/10 rounded-2xl">
                      <FileText className="h-6 w-6 text-royal-blue" />
                    </div>
                      <h2 className="text-2xl font-black text-slate-800">إعداد المحتوى والسكريبت</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button 
                        onClick={() => generateScriptWithAI("script")}
                        disabled={isGeneratingScript}
                        className="rounded-xl h-10 gap-2 font-black bg-royal-blue text-white hover:bg-royal-blue/90 shadow-lg shadow-royal-blue/20"
                      >
                        {isGeneratingScript ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        توليد سكريبت متكامل
                      </Button>
                      
                      <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                        <Button 
                          onClick={() => generateScriptWithAI("news-report")}
                          variant="ghost" 
                          size="sm"
                          className="rounded-lg h-8 gap-1 font-bold text-[10px] hover:bg-white"
                        >
                          تقرير إخباري
                        </Button>
                        <Button 
                          onClick={() => generateScriptWithAI("social-hook")}
                          variant="ghost" 
                          size="sm"
                          className="rounded-lg h-8 gap-1 font-bold text-[10px] hover:bg-white"
                        >
                          هوك سوشيال ميديا
                        </Button>
                        <Button 
                          onClick={() => generateScriptWithAI("interview")}
                          variant="ghost" 
                          size="sm"
                          className="rounded-lg h-8 gap-1 font-bold text-[10px] hover:bg-white"
                        >
                          أسئلة مقابلة
                        </Button>
                      </div>

                      <div className="flex bg-royal-blue/5 p-1 rounded-xl gap-1 border border-royal-blue/10">
                        <Button 
                          onClick={() => generateScriptWithAI("translate", "ar")}
                          variant="ghost" 
                          size="sm"
                          className="rounded-lg h-8 font-bold text-[10px] hover:bg-white"
                        >
                          AR
                        </Button>
                        <Button 
                          onClick={() => generateScriptWithAI("translate", "fr")}
                          variant="ghost" 
                          size="sm"
                          className="rounded-lg h-8 font-bold text-[10px] hover:bg-white"
                        >
                          FR
                        </Button>
                        <Button 
                          onClick={() => generateScriptWithAI("translate", "en")}
                          variant="ghost" 
                          size="sm"
                          className="rounded-lg h-8 font-bold text-[10px] hover:bg-white"
                        >
                          EN
                        </Button>
                      </div>
                    </div>
                  </div>


                {/* Professional Script Settings Toolbar */}
                <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Template Selection */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                        <LayoutTemplate className="h-4 w-4 text-royal-blue" /> قوالب الصياغة الاحترافية (Templates)
                      </label>
                      <div className="space-y-2">
                        {TEMPLATES.map(template => (
                          <button
                            key={template.id}
                            onClick={() => setSelectedTemplate(template.id)}
                            className={cn(
                              "w-full text-right p-3 rounded-xl border-2 transition-all flex flex-col gap-1",
                              selectedTemplate === template.id ? "bg-white border-royal-blue shadow-md" : "bg-transparent border-transparent hover:bg-white/50 text-slate-500"
                            )}
                          >
                            <span className="text-xs font-black">{template.label}</span>
                            <span className="text-[9px] opacity-60 font-medium">{template.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Language & Tone Selection */}
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                          <Languages className="h-4 w-4 text-royal-blue" /> لغة التقديم (Multilingual)
                        </label>
                        <div className="flex bg-white/50 p-1.5 rounded-2xl gap-1">
                          {LANGUAGES.map(lang => (
                            <button
                              key={lang.id}
                              onClick={() => setSelectedLang(lang.id)}
                              className={cn(
                                "flex-1 py-3 rounded-xl border-2 font-black text-xs transition-all flex items-center justify-center gap-2",
                                selectedLang === lang.id ? "bg-white border-royal-blue text-royal-blue shadow-sm" : "bg-transparent border-transparent text-slate-400"
                              )}
                            >
                              <span>{lang.flag}</span>
                              <span>{lang.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-2">
                          <Zap className="h-4 w-4 text-royal-blue" /> نبرة الصوت (Tone of Voice)
                        </label>
                        <div className="flex bg-white/50 p-1.5 rounded-2xl gap-1">
                          {TONES.map(tone => (
                            <button
                              key={tone.id}
                              onClick={() => setSelectedTone(tone.id)}
                              className={cn(
                                "flex-1 py-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2",
                                selectedTone === tone.id ? "bg-white border-royal-blue text-royal-blue shadow-sm" : "bg-transparent border-transparent text-slate-400"
                              )}
                            >
                              <span className="text-sm">{tone.icon}</span>
                              <span className="text-[10px] font-black">{tone.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Script Editor Area */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center px-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">محرر السكريبت المتقدم</label>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold text-royal-blue bg-royal-blue/5 px-2 py-1 rounded-lg border border-royal-blue/10">[المشهد]</span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">(صوت المذيع)</span>
                    </div>
                  </div>
                  <textarea 
                    className="w-full h-[450px] p-10 bg-slate-50 rounded-[3rem] border-2 border-transparent focus:border-royal-blue/20 focus:bg-white transition-all text-xl font-medium leading-relaxed resize-none shadow-inner font-mono text-slate-700"
                    placeholder="قم بلصق النص الخام هنا، أو استخدم 'جرب مثالاً' لرؤية القالب الاحترافي..."
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                  />
                  <div className="flex items-center justify-end px-4">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">تم التحسين بواسطة Sada AI v2.5</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block px-2">رفع الوسائط الإضافية</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-3 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer group">
                      <div className="p-4 bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform">
                        <UploadCloud className="h-8 w-8 text-royal-blue" />
                      </div>
                      <p className="text-sm font-bold text-slate-500">اسحب الصور أو الفيديوهات هنا</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest block px-2">أبعاد التصدير</label>
                    <div className="flex gap-4 h-[120px]">
                      <button 
                        onClick={() => setFormat("vertical")}
                        className={cn(
                          "flex-1 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center gap-2",
                          format === "vertical" ? "bg-royal-blue border-royal-blue text-white shadow-xl shadow-royal-blue/20" : "bg-white border-slate-100 text-slate-400 hover:border-royal-blue/20"
                        )}
                      >
                        <Smartphone className="h-6 w-6" />
                        <span className="text-xs font-black">Reels (9:16)</span>
                      </button>
                      <button 
                        onClick={() => setFormat("horizontal")}
                        className={cn(
                          "flex-1 rounded-[2rem] border-2 transition-all flex flex-col items-center justify-center gap-2",
                          format === "horizontal" ? "bg-royal-blue border-royal-blue text-white shadow-xl shadow-royal-blue/20" : "bg-white border-slate-100 text-slate-400 hover:border-royal-blue/20"
                        )}
                      >
                        <Monitor className="h-6 w-6" />
                        <span className="text-xs font-black">Reportage (16:9)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Engine Controls */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-[3rem] p-10 shadow-sm border-2 border-slate-50 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-royal-blue/10 rounded-2xl">
                    <Mic2 className="h-6 w-6 text-royal-blue" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800">محرك الصوت AI</h2>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black text-slate-400 uppercase tracking-widest block px-2">اختر المعلق المفضل</label>
                  <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                    <SelectTrigger className="w-full h-14 rounded-2xl bg-slate-50 border-none font-bold">
                      <SelectValue placeholder="اختر صوت المذيع" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-xl">
                      {VOICES.map(voice => (
                        <SelectItem key={voice.id} value={voice.id} className="font-bold py-3">
                          {voice.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-royal-blue/5 p-6 rounded-2xl border border-royal-blue/10 space-y-4">
                  <div className="flex items-center gap-3 text-royal-blue">
                    <Sparkles className="h-5 w-5" />
                    <span className="text-xs font-black uppercase tracking-widest">معاينة الصوت المختارة</span>
                  </div>
                  <div className="h-12 bg-white rounded-xl flex items-center px-4 gap-3 shadow-sm">
                    <Play className="h-4 w-4 text-royal-blue fill-current" />
                    <div className="flex-1 flex items-center gap-1">
                      {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="flex-1 h-4 bg-royal-blue/10 rounded-full" />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <Button 
                    onClick={handleStartRendering}
                    className="w-full h-20 bg-royal-blue hover:bg-royal-blue/90 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-royal-blue/30 flex items-center justify-center gap-3 group"
                  >
                    <span>ابدأ الإنتاج المبدئي</span>
                    <ArrowRight className="h-6 w-6 group-hover:translate-x-[-4px] transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage 2: Initial Draft Rendering */}
        {currentStep === 2 && (
          <motion.div
            key="rendering"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="bg-white rounded-[3rem] p-20 shadow-sm border-2 border-royal-blue/10 flex flex-col items-center justify-center text-center space-y-10"
          >
            <div className="relative">
              <div className="h-48 w-48 rounded-full border-8 border-royal-blue/10 border-t-royal-blue animate-spin" />
              <Sparkles className="h-16 w-16 text-royal-blue absolute inset-0 m-auto animate-pulse" />
            </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-800 tracking-tight">جاري إنتاج المحتوى السينمائي...</h2>
                <p className="text-slate-500 font-medium text-xl max-w-lg">نقوم الآن بتجميع المشاهد، مطابقة الصوت مع السكريبت، وتطبيق معايير Sada الاحترافية.</p>
              </div>

            <div className="w-full max-w-2xl space-y-4">
              <div className="flex justify-between text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                <span>تجميع المونتاج الأولي</span>
                <span>{Math.round(renderProgress)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden shadow-inner border-2 border-slate-50">
                <motion.div 
                  className="h-full bg-royal-blue" 
                  animate={{ width: `${renderProgress}%` }} 
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Stage 3: Professional Workshop */}
        {currentStep === 3 && (
          <motion.div
            key="workshop"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Main Workshop Area (Left/Center) */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* 1. Master Preview & Timeline Control */}
                <div className="bg-white rounded-[3rem] p-8 shadow-sm border-2 border-slate-50 overflow-hidden space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-royal-blue/10 rounded-2xl">
                        <Monitor className="h-6 w-6 text-royal-blue" />
                      </div>
                      <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight">معاينة الورشة</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button 
                        onClick={generateImageWithAI}
                        disabled={isGeneratingImage}
                        variant="outline" 
                        className="rounded-xl border-dashed border-2 h-10 gap-2 font-black text-xs hover:bg-slate-50 border-royal-blue/30 text-royal-blue"
                      >
                        {isGeneratingImage ? <Loader2 className="h-3 w-3 animate-spin" /> : <ImageIcon className="h-3 w-3" />}
                        توليد صورة بالذكاء
                      </Button>
                      <Button 
                        onClick={generateVideoWithAI}
                        disabled={isGeneratingVideo}
                        variant="outline" 
                        className="rounded-xl border-dashed border-2 h-10 gap-2 font-black text-xs hover:bg-slate-50 border-electric-blue/30 text-electric-blue"
                      >
                        {isGeneratingVideo ? <Loader2 className="h-3 w-3 animate-spin" /> : <Clapperboard className="h-3 w-3" />}
                        توليد فيديو بالذكاء
                      </Button>
                      <Button onClick={addMedia} variant="outline" className="rounded-xl border-dashed border-2 h-10 gap-2 font-black text-xs hover:bg-slate-50">
                        <Plus className="h-4 w-4" /> إضافة يدوية
                      </Button>
                      <div className="h-8 w-[1px] bg-slate-100" />
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                        <div className="w-2 h-2 bg-royal-blue rounded-full animate-pulse" />
                        <span className="text-[10px] font-black text-royal-blue uppercase tracking-widest">تحرير نشط</span>
                      </div>
                    </div>
                  </div>

                  <div className={cn(
                    "relative bg-slate-900 rounded-[2.5rem] overflow-hidden mx-auto shadow-2xl group transition-all duration-700",
                    format === "vertical" ? "aspect-[9/16] h-[550px]" : "aspect-video w-full"
                  )}>
                    {selectedItem && (
                      <motion.div
                        key={selectedItem.id + selectedItem.motionType}
                        initial={{ scale: selectedItem.motionType === "zoom-in" ? 1 : selectedItem.motionType === "zoom-out" ? 1.2 : 1.1 }}
                        animate={{ 
                          scale: selectedItem.motionType === "zoom-in" ? 1.2 : selectedItem.motionType === "zoom-out" ? 1 : 1.1,
                          x: selectedItem.motionType === "pan-left" ? -50 : selectedItem.motionType === "pan-right" ? 50 : 0
                        }}
                        transition={{ duration: selectedItem.duration, ease: "linear" }}
                        className="w-full h-full"
                      >
                        <img 
                          src={selectedItem.url} 
                          className={cn(
                            "w-full h-full object-cover transition-all duration-300",
                            FILTERS.find(f => f.id === selectedFilter)?.class
                          )}
                          style={{
                            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`
                          }}
                        />
                      </motion.div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                    <div className="absolute bottom-12 left-8 right-8 text-center">
                      <div className="bg-white/10 backdrop-blur-xl px-8 py-4 rounded-2xl border border-white/20 inline-block">
                        <p className="text-lg font-black text-white">{selectedItem?.title}</p>
                      </div>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-24 w-24 rounded-full bg-white/20 backdrop-blur-2xl border border-white/30 flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl">
                        <Play className="h-10 w-10 fill-current ml-2" />
                      </button>
                    </div>
                  </div>

                  {/* AI Motion Controls */}
                  <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-500 flex items-center gap-2 uppercase tracking-tighter">
                        <Zap className="h-4 w-4 text-amber-500" /> حركة الصورة الذكية (AI Motion):
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">تأثير Ken Burns الاحترافي</span>
                    </div>
                    <div className="flex gap-3">
                      {["none", "zoom-in", "zoom-out", "pan-left", "pan-right"].map(motion => (
                        <button
                          key={motion}
                          onClick={() => {
                            if (selectedItemId) {
                              setMediaItems(prev => prev.map(item => 
                                item.id === selectedItemId ? { ...item, motionType: motion as any } : item
                              ));
                            }
                          }}
                          className={cn(
                            "flex-1 py-3 rounded-xl text-[10px] font-black transition-all border-2",
                            selectedItem?.motionType === motion 
                              ? "bg-royal-blue border-royal-blue text-white shadow-lg" 
                              : "bg-white border-slate-100 text-slate-400 hover:border-royal-blue/30"
                          )}
                        >
                          {motion === "none" ? "ثابت" : motion === "zoom-in" ? "تكبير" : motion === "zoom-out" ? "تصغير" : motion === "pan-left" ? "يسار" : "يمين"}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. Advanced Visual Montage (Timeline) */}
                <div className="bg-white rounded-[3rem] p-8 shadow-sm border-2 border-slate-50 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-royal-blue/10 rounded-2xl">
                        <Move className="h-6 w-6 text-royal-blue" />
                      </div>
                      <h3 className="font-black text-xl text-slate-800 uppercase tracking-tight">المونتاج الذكي وترتيب المشاهد</h3>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400">
                      <Scissors className="h-4 w-4" /> أداة القص السريع نشطة
                    </div>
                  </div>

                  <Reorder.Group 
                    axis="x" 
                    values={mediaItems} 
                    onReorder={setMediaItems}
                    className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide pt-2 px-1"
                  >
                    {mediaItems.map((item) => (
                      <Reorder.Item
                        key={item.id}
                        value={item}
                        className={cn(
                          "relative flex-shrink-0 w-52 h-36 rounded-[2rem] overflow-hidden cursor-grab active:cursor-grabbing border-4 transition-all group",
                          selectedItemId === item.id ? "border-royal-blue shadow-xl scale-105" : "border-transparent opacity-80 hover:opacity-100"
                        )}
                        onClick={() => setSelectedItemId(item.id)}
                      >
                        <img src={item.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4">
                          <div className="flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); removeMedia(item.id); }} className="p-2 bg-rose-500 text-white rounded-xl hover:bg-rose-600 shadow-lg">
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <div className="bg-royal-blue p-2 rounded-xl shadow-lg">
                              <GripVertical className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <span className="text-[11px] font-black text-white text-center truncate bg-black/60 py-2 rounded-xl backdrop-blur-sm border border-white/10 uppercase tracking-tighter">
                            {item.title} ({item.duration}ث)
                          </span>
                        </div>
                        {selectedItemId === item.id && (
                          <div className="absolute -top-1 right-1/2 translate-x-1/2 w-5 h-5 bg-royal-blue rotate-45" />
                        )}
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>

                  <div className="mt-4 flex items-center gap-6 bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 shadow-inner">
                    <Scissors className="h-6 w-6 text-royal-blue" />
                    <div className="flex-1 h-4 bg-slate-200 rounded-full relative overflow-hidden group">
                      <div className="absolute left-[15%] right-[25%] h-full bg-royal-blue/20 border-x-[4px] border-royal-blue shadow-lg cursor-ew-resize" />
                      <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-white shadow-2xl z-10 -ml-1 border-x border-slate-200" />
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-800 uppercase">00:12:04</span>
                      <span className="text-[8px] font-black text-slate-400">الإجمالي</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Controls (Right) */}
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-royal-blue rounded-[3rem] p-10 text-white shadow-2xl shadow-royal-blue/30 space-y-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full" />
                  
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-xl border border-white/10">
                      <Mic className="h-8 w-8" />
                    </div>
                    <div>
                      <h3 className="font-black text-xl tracking-tight">المصفي الصوتي والأخلاقي</h3>
                      <p className="text-[10px] text-white/50 font-black uppercase tracking-[0.2em]">Sada AI Guardian</p>
                    </div>
                  </div>

                  <div className="space-y-6 relative z-10">
                    <div className="h-28 bg-black/30 rounded-[2.5rem] flex items-center justify-center gap-2 px-8 overflow-hidden relative border border-white/5 shadow-inner">
                      {[...Array(35)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            height: isPurified ? [
                              `${20 + Math.random() * 70}%`,
                              `${50 + Math.random() * 30}%`,
                              `${20 + Math.random() * 70}%`
                            ] : [
                              `${15 + Math.random() * 35}%`,
                              `${35 + Math.random() * 25}%`,
                              `${15 + Math.random() * 35}%`
                            ]
                          }}
                          transition={{ duration: 0.4 + Math.random() * 0.4, repeat: Infinity }}
                          className={cn(
                            "w-1.5 rounded-full transition-colors duration-700",
                            isPurified ? "bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.6)]" : "bg-white/30"
                          )}
                        />
                      ))}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
                        <span className="text-[8px] font-black text-white/60">أصلي</span>
                        <Switch checked={showOriginalAudio} onCheckedChange={setShowOriginalAudio} className="scale-50 data-[state=checked]:bg-royal-blue" />
                        <span className="text-[8px] font-black text-white/60">Sada AI</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-5 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={cn("p-2 rounded-xl transition-all", isPurified ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-white/30")}>
                            <Activity className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="block text-sm font-black">تصفية الصوت الذكية</span>
                            <span className="block text-[9px] text-white/40">إزالة الضجيج والرياح</span>
                          </div>
                        </div>
                        <Switch checked={isPurified} onCheckedChange={setIsPurified} />
                      </div>

                      <div className={cn(
                        "p-5 rounded-[2rem] border transition-all flex items-center justify-between group",
                        isEthicalFilterActive ? "bg-emerald-500/10 border-emerald-500/20" : "bg-white/5 border-white/10"
                      )}>
                        <div className="flex items-center gap-4">
                          <div className={cn("p-2 rounded-xl transition-all", isEthicalFilterActive ? "bg-emerald-400 text-royal-blue shadow-lg shadow-emerald-400/20" : "bg-white/5 text-white/30")}>
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="block text-sm font-black text-emerald-400">فلتر الحياء والذوق العام</span>
                            <span className="block text-[9px] text-white/40">اكتشاف وحجب المحتوى غير اللائق</span>
                          </div>
                        </div>
                        <Switch checked={isEthicalFilterActive} onCheckedChange={setIsEthicalFilterActive} />
                      </div>

                      <div className="p-5 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={cn("p-2 rounded-xl transition-all", isEnhanced ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/30")}>
                            <Waves className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="block text-sm font-black">تحسين جودة المذيع</span>
                            <span className="block text-[9px] text-white/40">نبرة استوديو احترافية</span>
                          </div>
                        </div>
                        <Switch checked={isEnhanced} onCheckedChange={setIsEnhanced} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[3rem] p-10 shadow-sm border-2 border-slate-50 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 shadow-inner">
                      <Filter className="h-8 w-8" />
                    </div>
                    <h3 className="font-black text-xl text-slate-800 tracking-tight">تعديلات الصورة واللون</h3>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-6">
                       {[
                         { label: "السطوع (Brightness)", icon: Sun, val: brightness, set: setBrightness },
                         { label: "التباين (Contrast)", icon: Contrast, val: contrast, set: setContrast },
                       ].map(slider => (
                         <div key={slider.label} className="space-y-3">
                           <div className="flex justify-between items-center px-2">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                               <slider.icon className="h-4 w-4 text-royal-blue" /> {slider.label}
                             </span>
                             <span className="text-xs font-bold text-royal-blue bg-royal-blue/5 px-2 py-0.5 rounded-md">{slider.val}%</span>
                           </div>
                           <Slider value={slider.val} onValueChange={slider.set} max={200} step={1} />
                         </div>
                       ))}
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block px-2">فلاتر إخبارية احترافية</label>
                      <div className="grid grid-cols-2 gap-3">
                        {FILTERS.map(f => (
                          <button
                            key={f.id}
                            onClick={() => setSelectedFilter(f.id)}
                            className={cn(
                              "px-4 py-4 rounded-2xl text-xs font-black border-2 transition-all shadow-sm",
                              selectedFilter === f.id 
                                ? "bg-royal-blue border-royal-blue text-white shadow-royal-blue/20 scale-105" 
                                : "bg-slate-50 border-transparent text-slate-400 hover:bg-slate-100"
                            )}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-royal-blue/20 blur-[80px] rounded-full animate-pulse" />
                  
                  <div className="relative z-10 space-y-8 text-center">
                    <div className="inline-flex p-5 bg-white/5 rounded-[2.5rem] backdrop-blur-xl border border-white/10 shadow-inner">
                      <Download className="h-10 w-10 text-royal-blue animate-bounce" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-black text-2xl tracking-tight">تصدير المحتوى الآمن</h3>
                      <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Sada Final Output</p>
                    </div>
                    
                    <div className="space-y-4">
                      <Button className="w-full h-20 bg-royal-blue hover:bg-royal-blue/90 text-white font-black rounded-[2rem] gap-4 shadow-xl shadow-royal-blue/30 text-lg hover:scale-[1.02] transition-all">
                        <Download className="h-7 w-7" />
                        تحميل الفيديو الكامل (MP4)
                      </Button>
                      <Button variant="ghost" className="w-full h-16 bg-white/5 hover:bg-white/10 text-white font-black rounded-[2rem] gap-3 border border-white/10 transition-all hover:border-emerald-500/30">
                        <Volume2 className="h-6 w-6 text-emerald-400" />
                        تحميل الصوت المصفى (WAV)
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="h-16 px-10 rounded-[2rem] font-black gap-3 border-2 hover:bg-slate-50 text-slate-600 transition-all active:scale-95 shadow-sm"
              >
                <ChevronRight className="h-6 w-6" /> السابق
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Navigation Controls for Step 1 */}
      {currentStep === 1 && (
        <div className="flex justify-end items-center pt-8 border-t border-slate-100">
          <Button
            onClick={handleStartRendering}
            className="h-16 px-12 bg-royal-blue text-white hover:bg-royal-blue/90 rounded-[2rem] font-black gap-3 shadow-xl shadow-royal-blue/20 text-lg transition-all active:scale-95"
          >
            بدأ الإنتاج المبدئي <ChevronLeft className="h-6 w-6" />
          </Button>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
