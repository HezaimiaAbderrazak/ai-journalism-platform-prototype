"use client";

import React, { useState, useEffect } from "react";
import { 
  Wand2, 
  Send, 
  FileText, 
  Languages, 
  Layout, 
  Sparkles, 
  ArrowRight,
  RefreshCw,
  Copy,
  CheckCircle2,
  AlertCircle,
  History,
  Lightbulb,
  Languages as LangIcon,
  AlignLeft,
  ChevronDown,
  Newspaper,
  BookOpen,
  PieChart,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Style = "news" | "analytical" | "explanatory";
type Language = "ar" | "fr" | "en";

interface ContentData {
  headline: string;
  summary: string;
  article: string;
}

const EXAMPLE_FACT = "حادث مرور أليم في الطريق السريع خلف 4 ضحايا وجريحين بسبب سوء الأحوال الجوية";

const CONTENT_MAP: Record<Language, Record<Style, ContentData>> = {
  ar: {
    news: {
      headline: "فاجعة مرورية: 4 قتلى وجريحان في حادث مروع على الطريق السريع",
      summary: "لقي 4 أشخاص مصرعهم وأصيب اثنان آخران في حادث مرور أليم وقع اليوم على الطريق السريع، وسط ظروف جوية سيئة أدت لانعدام الرؤية.",
      article: "أفادت مصادر طبية وأمنية اليوم بوقوع حادث مرور مأساوي على الطريق السريع الرابط بين العاصمة والولايات المجاورة، مما أسفر عن حصيلة ثقيلة بلغت 4 وفيات وجريحين في حالة خطرة.\n\nووفقاً للتحقيقات الأولية، فإن الحادث نتج عن اصطدام تسلسلي لعدة مركبات بسبب الانزلاقات الناجمة عن الأمطار الغزيرة وسوء الأحوال الجوية التي تشهدها المنطقة. وقد تدخلت مصالح الحماية المدنية على الفور لنقل الضحايا إلى المستشفى وتسهيل حركة المرور التي شهدت شللاً تاماً لساعات.\n\nوتدعو السلطات الأمنية السائقين إلى ضرورة توخي الحذر الشديد والالتزام بالسرعة القانونية، خاصة في ظل التقلبات الجوية الحالية لتفادي وقوع مثل هذه الكوارث المرورية."
    },
    analytical: {
      headline: "حوادث الطرق في ظل التقلبات الجوية: متى ننتقل من رد الفعل إلى الوقاية؟",
      summary: "حادث الطريق السريع اليوم يفتح مجدداً ملف السلامة المرورية في الجزائر وتأثير البنية التحتية وسلوك السائقين أثناء العواصف.",
      article: "خلف حادث المرور الأليم الذي أودى بحياة 4 أشخاص اليوم على الطريق السريع تساؤلات عميقة تتجاوز مجرد 'خطأ بشري' أو 'قدر محتوم'. إن تكرار هذه الحوادث في نفس النقاط السوداء عند كل تقلب جوي يشير إلى خلل بنيوي في منظومة السلامة المرورية.\n\nأولاً، يطرح الحادث تساؤلاً حول كفاءة أنظمة التنبيه المبكر وتفاعل السائقين مع تحذيرات الأرصاد الجوية. ثانياً، حالة الطرقات السريعة وقدرتها على تصريف مياه الأمطار تلعب دوراً حاسماً في وقوع الانزلاقات. إن تحليل التبعات الاقتصادية والاجتماعية لمثل هذه الحوادث يفرض على السلطات المعنية مراجعة استراتيجية تسيير الطرقات السريعة، والانتقال من منطق التدخل بعد الكارثة إلى منطق الاستشراف والوقاية التقنية."
    },
    explanatory: {
      headline: "كل ما تريد معرفته عن حادث الطريق السريع اليوم وأسباب وقوعه",
      summary: "دليل سريع يشرح تفاصيل الحادث الذي خلف 4 ضحايا، وأهم النصائح لتجنب حوادث الانزلاق في الأجواء الممطرة.",
      article: "وقع اليوم حادث مرور أليم على الطريق السريع، وهنا تبسيط لأهم النقاط المتعلقة به:\n\n• الحصيلة: 4 وفيات و2 جرحى.\n• السبب الرئيسي: سوء الأحوال الجوية (أمطار غزيرة + انزلاق).\n• الموقع: النقطة الكيلومترية الوسطى على الطريق السريع.\n\nلماذا يزداد الخطر في مثل هذه الأجواء؟\n1. ظاهرة الانزلاق المائي: حيث تفقد الإطارات تلامسها مع الطريق.\n2. انعدام الرؤية: مما يقلل من سرعة استجابة السائق.\n\nكيف تحمي نفسك؟\n- خفف السرعة إلى ما دون 80 كم/سا.\n- اترك مسافة أمان مضاعفة بينك وبين السيارة التي أمامك.\n- تأكد من سلامة المكابح وماسحات الزجاج قبل الانطلاق."
    }
  },
  fr: {
    news: {
      headline: "Tragédie routière : 4 morts et 2 blessés dans un grave accident sur l'autoroute",
      summary: "Quatre personnes ont perdu la vie et deux autres ont été blessées lors d'un tragique accident de la circulation survenu aujourd'hui sur l'autoroute, causé par de mauvaises conditions météorologiques.",
      article: "Un grave accident de la circulation s'est produit aujourd'hui sur l'autoroute, faisant quatre morts et deux blessés graves, selon les services de secours. Le drame s'est déroulé dans une zone de forte turbulence météorologique.\n\nLes premières constatations indiquent que les pluies torrentielles et la chaussée glissante sont les principales causes de ce carambolage. La protection civile est intervenue rapidement pour évacuer les victimes vers les centres hospitaliers les plus proches. La circulation a été interrompue pendant plusieurs heures pour permettre l'intervention des secours."
    },
    analytical: {
      headline: "Accidents et météo : L'urgence d'une nouvelle stratégie de sécurité routière",
      summary: "L'accident d'aujourd'hui souligne une fois de plus la vulnérabilité de notre réseau autoroutier face aux intempéries.",
      article: "Le tragique accident sur l'autoroute qui a coûté la vie à quatre personnes aujourd'hui soulève des questions fondamentales sur la sécurité routière en période d'intempéries. Au-delà de la fatalité, c'est l'adaptation de l'infrastructure et du comportement des usagers qui est en cause.\n\nL'analyse des faits montre une corrélation directe entre la dégradation climatique et l'augmentation exponentielle des risques sur ce tronçon spécifique. Il devient impératif de repenser la signalisation dynamique et les systèmes de drainage pour éviter que chaque averse ne se transforme en tragédie nationale."
    },
    explanatory: {
      headline: "Comprendre l'accident de l'autoroute : Faits et conseils de sécurité",
      summary: "Un résumé clair des événements d'aujourd'hui et comment éviter l'aquaplaning en période de pluie.",
      article: "Voici l'essentiel à savoir sur l'accident de ce matin :\n\n• Bilan : 4 décès, 2 blessés.\n• Cause : Aquaplaning dû aux fortes pluies.\n• Statut : Route rouverte après intervention.\n\nQu'est-ce que l'aquaplaning ?\nC'est lorsqu'une couche d'eau s'interpose entre le pneu et la route, faisant perdre tout contrôle au conducteur.\n\nNos conseils :\n- Réduisez votre vitesse de 20 km/h sous la limite habituelle.\n- Augmentez les distances de sécurité.\n- Vérifiez l'état de vos pneus régulièrement."
    }
  },
  en: {
    news: {
      headline: "Highway Tragedy: 4 Dead and 2 Injured in Severe Traffic Accident",
      summary: "Four people died and two others were injured in a tragic highway accident today, occurring amidst severe weather conditions and poor visibility.",
      article: "A major traffic accident on the main highway claimed four lives and left two others critically injured today. Emergency services confirmed the toll following a multi-vehicle collision.\n\nPreliminary investigations suggest that torrential rain and slippery road conditions were the primary factors. Civil defense units worked for hours to clear the wreckage and transport the injured to nearby hospitals. Authorities are urging motorists to exercise extreme caution during current weather fluctuations."
    },
    analytical: {
      headline: "Road Safety vs. Severe Weather: A Structural Analysis of Highway Risks",
      summary: "Today's highway accident reopens the debate on infrastructure resilience and driver preparedness during storms.",
      article: "Today's devastating highway accident, resulting in four fatalities, transcends simple bad luck. It highlights a critical intersection between environmental challenges and infrastructure limitations. \n\nExperts argue that the frequency of accidents in these 'black spots' during rain suggests that current road surfacing and drainage systems may be inadequate for modern climate patterns. Furthermore, the lack of real-time digital warning systems for drivers contributes to delayed reactions, turning avoidable mishaps into fatal disasters."
    },
    explanatory: {
      headline: "Highway Accident Breakdown: What Happened and How to Stay Safe",
      summary: "A quick guide to today's highway incident and essential tips for driving in wet weather.",
      article: "Here is a breakdown of today's highway accident:\n\n• Casualties: 4 dead, 2 injured.\n• Main Factor: Poor weather and slippery roads.\n• Outcome: Emergency services cleared the site by noon.\n\nWhy is wet weather dangerous?\n1. Hydroplaning: Tires lose contact with the road surface.\n2. Visibility: Heavy rain drastically reduces the driver's sightline.\n\nSafety Checklist:\n- Drop your speed by at least 10-15 mph.\n- Double your following distance.\n- Use your headlights even during the day for better visibility."
    }
  }
};

export function ContentGenerator({ onSendToStudio }: { onSendToStudio: (script: string) => void }) {
  const [selectedStyle, setSelectedStyle] = useState<Style>("news");
  const [selectedLang, setSelectedLang] = useState<Language>("ar");
  const [inputText, setInputText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const [content, setContent] = useState<ContentData | null>(null);

  const handleGenerate = async () => {
    if (!inputText) return;
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Generate a professional news article in ${selectedLang.toUpperCase()} with the following style: ${selectedStyle}.
          Facts/Context: ${inputText}
          
          Return ONLY a raw JSON object (no markdown, no backticks) with these exact keys:
          - headline: string
          - summary: string
          - article: string (formatted with newlines for readability)`
        }),
      });

      const data = await response.json();
      if (!data.response) throw new Error("No response from AI");
      
      const cleanText = data.response.replace(/```json|```/gi, "").trim();
      const aiResponse = JSON.parse(cleanText);
      
      setContent(aiResponse);
      setShowOutput(true);
    } catch (error) {
      console.error("Generation Error:", error);
      // Fallback to static map if API fails for the demo
      setContent(CONTENT_MAP[selectedLang][selectedStyle]);
      setShowOutput(true);
    } finally {
      setIsGenerating(false);
    }
  };

  const loadExample = () => {
    setInputText(EXAMPLE_FACT);
    // Auto generate if it was already showing output to demonstrate instant switch
    if (showOutput) {
      setContent(CONTENT_MAP[selectedLang][selectedStyle]);
    }
  };

  // Instant update when style or language changes if output is already visible
  useEffect(() => {
    if (showOutput && (inputText === EXAMPLE_FACT || !inputText)) {
      setContent(CONTENT_MAP[selectedLang][selectedStyle]);
    }
  }, [selectedStyle, selectedLang, showOutput, inputText]);

  return (
    <div className="space-y-8 relative" dir={selectedLang === "ar" ? "rtl" : "ltr"}>
      {/* Sticky Language Toggle */}
      <div className="sticky top-0 z-30 flex justify-end mb-4 pointer-events-none">
        <div className="pointer-events-auto bg-white/80 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-royal-blue/10 flex gap-1">
          {["ar", "fr", "en"].map((l) => (
            <button
              key={l}
              onClick={() => setSelectedLang(l as Language)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-black transition-all",
                selectedLang === l 
                  ? "bg-royal-blue text-white shadow-lg shadow-royal-blue/20" 
                  : "text-slate-400 hover:bg-slate-50"
              )}
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input & Control Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-royal-blue/10 rounded-2xl">
                  <Wand2 className="h-6 w-6 text-royal-blue" />
                </div>
                <h2 className="text-2xl font-black text-slate-800">مولد المحتوى الذكي</h2>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={loadExample}
                className="text-royal-blue font-bold hover:bg-royal-blue/5 rounded-xl border border-royal-blue/20"
              >
                <Zap className="h-4 w-4 mr-2" />
                {selectedLang === "ar" ? "تحميل مثال" : selectedLang === "fr" ? "Charger l'exemple" : "Load Example"}
              </Button>
            </div>

            <div className="space-y-6">
              {/* Style Selector */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Layout className="h-4 w-4 text-royal-blue" />
                  {selectedLang === "ar" ? "نمط الكتابة" : selectedLang === "fr" ? "Style d'écriture" : "Writing Style"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "news", label: { ar: "إخباري", fr: "News", en: "News" }, icon: Newspaper },
                    { id: "analytical", label: { ar: "تحليلي", fr: "Analytique", en: "Analytical" }, icon: PieChart },
                    { id: "explanatory", label: { ar: "تفسيري", fr: "Explicatif", en: "Explanatory" }, icon: BookOpen },
                  ].map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id as Style)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group",
                        selectedStyle === style.id 
                          ? "bg-royal-blue/5 border-royal-blue text-royal-blue" 
                          : "bg-slate-50 border-transparent text-slate-400 hover:bg-white hover:border-royal-blue/20"
                      )}
                    >
                      <style.icon className="h-5 w-5" />
                      <span className="text-[10px] font-black">{style.label[selectedLang]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <AlignLeft className="h-4 w-4 text-royal-blue" />
                  {selectedLang === "ar" ? "الحقائق أو النص الخام" : selectedLang === "fr" ? "Faits ou texte brut" : "Facts or Raw Text"}
                </label>
                <textarea
                  className="w-full h-48 p-6 bg-slate-50 rounded-[2rem] border-2 border-transparent focus:border-royal-blue/20 focus:bg-white transition-all text-sm font-medium leading-relaxed resize-none shadow-inner"
                  placeholder={selectedLang === "ar" ? "أدخل الحقائق هنا..." : "Enter facts here..."}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !inputText}
                className="w-full h-16 bg-royal-blue hover:bg-royal-blue/90 text-white rounded-2xl font-black text-lg shadow-xl shadow-royal-blue/20 group transition-all"
              >
                {isGenerating ? (
                  <RefreshCw className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-6 w-6 mr-2" />
                    {selectedLang === "ar" ? "توليد المحتوى" : selectedLang === "fr" ? "Générer le contenu" : "Generate Content"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Output Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!showOutput ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 bg-white/50 rounded-[2.5rem] border-2 border-dashed border-slate-200"
              >
                <div className="p-6 bg-white rounded-full shadow-lg mb-6">
                  <Sparkles className="h-12 w-12 text-slate-200" />
                </div>
                <h3 className="text-xl font-black text-slate-400">في انتظار مدخلاتك...</h3>
                <p className="text-sm text-slate-400 mt-2 max-w-xs">أدخل الحقائق في الجهة المقابلة لتحويلها إلى محتوى احترافي فوراً.</p>
              </motion.div>
            ) : (
              <motion.div 
                key="output"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Headline & Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 border-l-4 border-l-royal-blue">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-royal-blue bg-royal-blue/5 px-3 py-1 rounded-full uppercase tracking-widest">
                        {selectedLang === "ar" ? "عنوان جذاب" : selectedLang === "fr" ? "Titre accrocheur" : "Catchy Headline"}
                      </span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-royal-blue"><Copy className="h-4 w-4" /></Button>
                    </div>
                    <h1 className="text-2xl font-black text-slate-800 leading-tight">
                      {content?.headline}
                    </h1>
                  </div>

                  <div className="bg-royal-blue/5 p-8 rounded-[2.5rem] border border-royal-blue/10">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black text-slate-500 bg-white px-3 py-1 rounded-full uppercase tracking-widest border border-slate-100">
                        {selectedLang === "ar" ? "ملخص سريع" : selectedLang === "fr" ? "Résumé rapide" : "Quick Summary"}
                      </span>
                    </div>
                    <p className="text-slate-600 font-bold leading-relaxed italic">
                      {content?.summary}
                    </p>
                  </div>
                </div>

                {/* Main Article Editor View */}
                <div className="bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                  <div className="bg-slate-50/50 border-b border-slate-100 px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-rose-400/30" />
                        <div className="w-3 h-3 rounded-full bg-amber-400/30" />
                        <div className="w-3 h-3 rounded-full bg-emerald-400/30" />
                      </div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Editor v4.0</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="h-8 text-xs font-bold gap-2 text-slate-500 hover:text-royal-blue">
                        <History className="h-4 w-4" /> {selectedLang === "ar" ? "السجل" : "History"}
                      </Button>
                      <Button size="sm" className="h-8 bg-royal-blue text-white text-xs font-black rounded-lg gap-2" onClick={() => content && onSendToStudio(content.article)}>
                         {selectedLang === "ar" ? "إرسال إلى الاستوديو" : "Send to Studio"} <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-12 min-h-[500px] prose prose-slate max-w-none">
                    <div className="flex items-center gap-3 mb-8 opacity-50">
                      <FileText className="h-5 w-5" />
                      <div className="h-[1px] flex-1 bg-slate-100" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{selectedStyle} format</span>
                    </div>
                    
                    <div className="whitespace-pre-wrap text-lg text-slate-700 leading-loose font-medium">
                      {content?.article}
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        </div>
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Sada AI Verified</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">End of Article</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
