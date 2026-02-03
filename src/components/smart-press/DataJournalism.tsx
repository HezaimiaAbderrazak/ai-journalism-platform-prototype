"use client";

import React, { useState, useCallback, useEffect } from "react";
import { Upload, FileUp, Database, Table as TableIcon, BarChart2, PieChart as PieChartIcon, FileSpreadsheet, CloudUpload, Info, Zap, LineChart as LineChartIcon, CheckCircle2, AlertCircle, Link as LinkIcon, Type, Mic, FileAudio, FileText, Globe } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  PieChart,
  Pie
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisResult {
  summary: string;
  insights: string[];
  chartData: { category: string; value: number }[];
  chartType: 'bar' | 'line' | 'pie';
  suggestedTitle: string;
  humanImpact?: string;
  investigativeQuestion?: string;
}

const COLORS = ["#1A56DB", "#3F83F8", "#60A5FA", "#93C5FD", "#BFDBFE"];

const analysisSteps = [
  "جاري فك تشفير البيانات والوسائط...",
  "جاري استخراج الأنماط والارتباطات العميقة...",
  "جاري تحليل الأثر البشري والسياق الاجتماعي...",
  "جاري صياغة السرد البصري الذكي...",
  "جاري إعداد التقرير النهائي..."
];

export function DataJournalism() {
  const [file, setFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<"file" | "url" | "text">("file");
  const [url, setUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Step animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setStepIndex((prev) => (prev + 1) % analysisSteps.length);
      }, 2000);
    } else {
      setStepIndex(0);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    setFile(uploadedFile);
    setAnalysis(null);
    setError(null);
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (inputType === "file" && !file) return;
    if (inputType === "url" && !url) return;
    if (inputType === "text" && !textContent) return;

    setIsProcessing(true);
    setError(null);

    try {
      let body: any = { inputType };

      if (inputType === "file" && file) {
        // Check if it's a text-based file or binary
        const isTextFile = ['text/csv', 'application/json', 'text/plain'].includes(file.type);
        
        if (isTextFile) {
          body.dataContent = await file.text();
        } else {
          body.fileData = await fileToBase64(file);
          body.mimeType = file.type;
        }
        body.fileName = file.name;
        body.fileType = file.type;
      } else if (inputType === "url") {
        body.url = url;
      } else if (inputType === "text") {
        body.dataContent = textContent;
      }
      
      const response = await fetch('/api/ai/analyze-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل تحليل البيانات. يرجى المحاولة مرة أخرى.');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'audio/*': ['.mp3', '.wav', '.m4a', '.aac'],
      'image/*': ['.jpg', '.jpeg', '.png', '.webp']
    },
    multiple: false
  });

  const renderChart = () => {
    if (!analysis) return null;

    const { chartData, chartType } = analysis;

    switch (chartType) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="category" stroke="#94A3B8" fontSize={11} fontWeight="700" tickLine={false} axisLine={false} />
            <YAxis orientation="right" stroke="#94A3B8" fontSize={11} fontWeight="700" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "right" }} />
            <Line type="monotone" dataKey="value" stroke="#1A56DB" strokeWidth={3} dot={{ r: 6, fill: "#1A56DB", strokeWidth: 2, stroke: "#fff" }} />
          </LineChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              nameKey="category"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "right" }} />
          </PieChart>
        );
      default:
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis dataKey="category" stroke="#94A3B8" fontSize={11} fontWeight="700" tickLine={false} axisLine={false} />
            <YAxis orientation="right" stroke="#94A3B8" fontSize={11} fontWeight="700" tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ borderRadius: "16px", border: "none", boxShadow: "0 10px 30px rgba(0,0,0,0.05)", textAlign: "right" }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        );
    }
  };

  return (
    <div className="space-y-10 font-readex pb-20" dir="rtl">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="h-2 w-2 rounded-full bg-royal-blue animate-pulse" />
          <span className="text-[10px] font-black text-royal-blue uppercase tracking-widest">المختبر الرقمي الشامل</span>
        </div>
        <h2 className="text-4xl font-black text-dark-slate tracking-tight leading-tight">مركز صحافة <span className="text-royal-blue">البيانات والوسائط</span></h2>
        <p className="text-muted-foreground text-lg max-w-2xl font-medium mt-1">حلل الملفات، المقالات، الروابط، والمقاطع الصوتية لتحويلها إلى قصص صحفية ملهمة.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="bento-card bg-white p-2">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black text-dark-slate flex items-center gap-3">
               <Database className="h-5 w-5 text-royal-blue" /> مكاملة البيانات والوسائط
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground">اختر نوع المصدر الذي تريد تحليله بواسطة Gemini 1.5 Flash.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <Tabs defaultValue="file" className="w-full" onValueChange={(v) => setInputType(v as any)}>
              <TabsList className="grid grid-cols-3 mb-6 bg-cloud-blue/30 rounded-2xl p-1">
                <TabsTrigger value="file" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <FileUp className="h-4 w-4 ml-2" /> ملفات
                </TabsTrigger>
                <TabsTrigger value="url" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Globe className="h-4 w-4 ml-2" /> رابط
                </TabsTrigger>
                <TabsTrigger value="text" className="rounded-xl font-bold data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Type className="h-4 w-4 ml-2" /> مقال نصي
                </TabsTrigger>
              </TabsList>

              <TabsContent value="file" className="mt-0">
                <div 
                  {...getRootProps()} 
                  className={`
                    border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300
                    ${isDragActive ? "border-royal-blue bg-cloud-blue/50" : "border-border hover:border-royal-blue/30 bg-cloud-blue/20"}
                    ${file ? "border-emerald-500/30 bg-emerald-50" : ""}
                  `}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-white shadow-soft">
                      {file?.type.startsWith('audio/') ? (
                        <Mic className="h-8 w-8 text-royal-blue" />
                      ) : file?.type.includes('pdf') ? (
                        <FileText className="h-8 w-8 text-royal-blue" />
                      ) : (
                        <CloudUpload className={`h-8 w-8 ${file ? "text-emerald-500" : "text-royal-blue"}`} />
                      )}
                    </div>
                    {file ? (
                      <div className="space-y-1">
                        <p className="font-black text-emerald-600 text-lg">{file.name}</p>
                        <p className="text-[10px] font-black text-muted-foreground uppercase">{(file.size / 1024).toFixed(2)} KB • جاهز للتحليل</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="font-black text-dark-slate text-xl tracking-tight">ارفع ملفات، صوتيات، أو مستندات</p>
                        <p className="text-xs text-muted-foreground font-medium">CSV, JSON, PDF, MP3, JPG (بحد أقصى 20 ميجابايت)</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="url" className="mt-0 space-y-4">
                <div className="p-6 rounded-3xl bg-cloud-blue/20 border-2 border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-royal-blue/10">
                        <LinkIcon className="h-5 w-5 text-royal-blue" />
                      </div>
                      <label className="font-black text-dark-slate">أدخل رابط المحتوى</label>
                    </div>
                  <Input 
                    placeholder="https://example.com/article-or-data" 
                    className="h-14 rounded-2xl bg-white border-border focus-visible:ring-royal-blue font-medium"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground mt-3 font-bold">ملاحظة: سيقوم Gemini بتحليل محتوى الرابط مباشرة.</p>
                </div>
              </TabsContent>

              <TabsContent value="text" className="mt-0 space-y-4">
                <div className="p-6 rounded-3xl bg-cloud-blue/20 border-2 border-border/50">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-lg bg-royal-blue/10">
                        <Type className="h-5 w-5 text-royal-blue" />
                      </div>
                      <label className="font-black text-dark-slate">أدخل المقال أو البيانات النصية</label>
                    </div>
                  <Textarea 
                    placeholder="قم بلصق محتوى المقال أو البيانات هنا لتمثيلها بصرياً..." 
                    className="min-h-[160px] rounded-2xl bg-white border-border focus-visible:ring-royal-blue font-medium resize-none"
                    value={textContent}
                    onChange={(e) => setTextContent(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>

            {error && (
              <div className="mt-4 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-bold flex items-center gap-2 border border-red-100">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <Button 
                variant="outline" 
                className="flex-1 h-14 rounded-2xl border-border hover:bg-cloud-blue font-bold text-dark-slate" 
                onClick={() => { setFile(null); setAnalysis(null); setUrl(""); setTextContent(""); }} 
                disabled={isProcessing}
              >
                مسح البيانات
              </Button>
              <Button 
                className="flex-1 h-14 rounded-2xl bg-royal-blue hover:bg-royal-blue/90 text-white font-black shadow-lg shadow-royal-blue/20 relative overflow-hidden" 
                disabled={isProcessing} 
                onClick={handleAnalyze}
              >
                {isProcessing ? (
                  <div className="flex flex-col items-center">
                    <span className="text-[10px] opacity-70 animate-pulse">{analysisSteps[stepIndex]}</span>
                    <span className="mt-1">جاري التحليل الذكي...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 fill-white" />
                    تحليل شامل بواسطة Gemini
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bento-card bg-white p-2">
          <CardHeader className="p-8">
            <CardTitle className="text-xl font-black text-dark-slate flex items-center gap-3">
               <BarChart2 className="h-5 w-5 text-royal-blue" /> السرد البصري الذكي
            </CardTitle>
            <CardDescription className="font-medium text-muted-foreground">
              {analysis ? analysis.suggestedTitle : "مقترحات بصرية ذكية بنظام AI-Viz للبيانات والوسائط."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            {isProcessing ? (
              <div className="flex h-[350px] flex-col items-center justify-center space-y-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full border-4 border-royal-blue/10 border-t-royal-blue animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Database className="h-8 w-8 text-royal-blue animate-pulse" />
                  </div>
                </div>
                <div className="text-center space-y-2">
                  <p className="font-black text-dark-slate text-xl">جاري المعالجة العصبية</p>
                  <p className="text-sm font-bold text-royal-blue/60">{analysisSteps[stepIndex]}</p>
                </div>
              </div>
            ) : analysis ? (
              <div className="space-y-10 animate-in fade-in zoom-in-95 duration-700">
                <div className="h-[280px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {renderChart() || <div>Error rendering chart</div>}
                  </ResponsiveContainer>
                </div>
                
                <div className="flex bg-cloud-blue/50 p-1.5 rounded-2xl border border-border justify-center gap-2">
                  <Badge variant="outline" className={`gap-2 font-black text-[10px] bg-white shadow-sm rounded-xl py-2 px-4 transition-all ${analysis.chartType === 'bar' ? 'text-royal-blue border-royal-blue scale-105' : 'opacity-40'}`}>أعمدة</Badge>
                  <Badge variant="outline" className={`gap-2 font-black text-[10px] bg-white shadow-sm rounded-xl py-2 px-4 transition-all ${analysis.chartType === 'line' ? 'text-royal-blue border-royal-blue scale-105' : 'opacity-40'}`}>خطي</Badge>
                  <Badge variant="outline" className={`gap-2 font-black text-[10px] bg-white shadow-sm rounded-xl py-2 px-4 transition-all ${analysis.chartType === 'pie' ? 'text-royal-blue border-royal-blue scale-105' : 'opacity-40'}`}>دائري</Badge>
                </div>
              </div>
            ) : (
              <div className="flex h-[350px] flex-col items-center justify-center text-center text-muted-foreground border-2 border-dashed border-border rounded-3xl bg-cloud-blue/5 opacity-50">
                <BarChart2 className="h-12 w-12 mb-4 text-royal-blue" />
                <p className="text-xl font-black text-dark-slate">في انتظار البيانات</p>
                <p className="text-sm font-medium">ارفع ملفاً أو أدخل رابطاً لبدء التحليل البصري.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {analysis && (
        <div className="grid gap-6 lg:grid-cols-3 animate-in slide-in-from-bottom-5 duration-700">
          <Card className="lg:col-span-2 bento-card border-none bg-gradient-to-br from-royal-blue to-electric-blue text-white p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Zap className="h-32 w-32" />
            </div>
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4 flex items-center gap-3">
                <Zap className="h-6 w-6 text-yellow-400 fill-yellow-400" /> ملخص التحليل الاستراتيجي
              </h3>
              <p className="text-white/90 text-xl leading-relaxed font-bold italic mb-8">
                "{analysis.summary}"
              </p>
              
              {analysis.humanImpact && (
                <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2 text-white/60">الأثر البشري المكتشف</p>
                  <p className="text-lg font-black text-white">{analysis.humanImpact}</p>
                </div>
              )}
            </div>
          </Card>
          
          <div className="space-y-6">
            <Card className="bento-card p-8">
              <h3 className="text-xl font-black text-dark-slate mb-6 flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" /> رؤى استقصائية
              </h3>
              <div className="space-y-4">
                {analysis.insights.map((insight, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="h-6 w-6 rounded-full bg-royal-blue text-white flex items-center justify-center text-[10px] font-black shrink-0 shadow-lg shadow-royal-blue/20">
                      {idx + 1}
                    </div>
                    <p className="text-sm font-bold text-dark-slate leading-snug">{insight}</p>
                  </div>
                ))}
              </div>
            </Card>

            {analysis.investigativeQuestion && (
              <Card className="bento-card p-6 bg-slate-900 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-royal-blue/20">
                    <Info className="h-4 w-4 text-royal-blue" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-royal-blue">سؤال للمتابعة</span>
                </div>
                <p className="text-sm font-bold italic opacity-90">"{analysis.investigativeQuestion}"</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Grid Features */}
      {!analysis && (
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { title: "تحليل الوسائط المتعددة", desc: "دعم الصوت، الصور، والملفات النصية.", icon: Mic, color: "text-royal-blue", bg: "bg-cloud-blue" },
            { title: "تحليل الروابط الحية", desc: "استخراج البيانات مباشرة من الويب.", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
            { title: "الذكاء الاصطناعي الفائق", desc: "مدعوم بنظام Gemini 1.5 Flash للمولتمودال.", icon: Zap, color: "text-blue-500", bg: "bg-blue-50" }
          ].map((feat, i) => (
            <div key={i} className="bento-card p-6 flex items-center gap-5 group">
              <div className={`h-14 w-14 rounded-2xl ${feat.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <feat.icon className={`h-6 w-6 ${feat.color}`} />
              </div>
              <div>
                <p className="text-sm font-black text-dark-slate">{feat.title}</p>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
