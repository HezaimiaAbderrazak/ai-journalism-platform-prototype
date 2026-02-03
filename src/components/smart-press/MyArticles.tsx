"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Plus, 
  Search, 
  Edit3, 
  Eye, 
  Trash2, 
  Star, 
  Cloud, 
  MoreVertical,
  Calendar,
  Tag,
  Loader2,
  FolderOpen,
  Bookmark,
  X,
  Smartphone,
  Monitor,
  Bold,
  Italic,
  List as ListIcon,
  Link as LinkIcon,
  Sparkles,
  ChevronRight,
  Send,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useArticles, Article } from "@/context/ArticleContext";
import confetti from "canvas-confetti";
import { toast } from "sonner";

export function MyArticles() {
  const { articles, publishArticle, deleteArticle, updateArticle, addArticle } = useArticles();
  const [viewMode, setViewMode] = useState<"list" | "preview" | "edit">("list");
  const [selectedProject, setSelectedProject] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [editorContent, setEditorContent] = useState("");
  const [aiAnalysis, setAiAnalysis] = useState({
    engagement: 85,
    sentiment: "إيجابي",
    suggestions: [
      "حاول استخدام جمل أقصر لزيادة الوضوح.",
      "أضف المزيد من الأرقام لتعزيز المصداقية.",
      "العنوان جذاب ولكن يمكن أن يكون أكثر تحديداً."
    ]
  });

  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewMode === "edit" && selectedProject) {
      setEditorContent(selectedProject.content);
    }
  }, [viewMode, selectedProject]);

  const handleEdit = (project: Article) => {
    setSelectedProject(project);
    setViewMode("edit");
  };

  const handlePreview = (project: Article) => {
    setSelectedProject(project);
    setViewMode("preview");
  };

  const handleSave = () => {
    setSaveStatus("saving");
    setTimeout(() => {
      if (selectedProject) {
        updateArticle(selectedProject.id, { 
          content: editorContent, 
          lastEdited: new Date().toISOString().split('T')[0] 
        });
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1500);
  };

  const handlePublish = () => {
    if (selectedProject) {
      publishArticle(selectedProject.id);
      
      // Confetti celebration
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#1A56DB", "#3F83F8", "#10B981"]
      });

      toast.success("تم نشر المقال بنجاح في صدى نيوز!", {
        description: "المقال الآن متاح للجمهور في بوابة الأخبار.",
        duration: 5000,
      });

      setViewMode("list");
    }
  };

  const handleAiRefine = (type: "shorten" | "professionalize" | "translate") => {
    setSaveStatus("saving");
    setTimeout(() => {
      let refined = editorContent;
      if (type === "shorten") refined = editorContent.substring(0, 100) + "... (تم الاختصار ذكياً)";
      if (type === "professionalize") refined = "بناءً على المعطيات المهنية: " + editorContent;
      if (type === "translate") refined = "Translation: " + editorContent;
      
      setEditorContent(refined);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  const handleNewProject = () => {
    const newId = (articles.length + 1).toString();
    const newArticle: Article = {
      id: newId,
      title: "مشروع جديد " + newId,
      content: "",
      lastEdited: new Date().toISOString().split('T')[0],
      category: "أخبار",
      status: "draft",
      isStarred: false,
      author: "أحمد منصور"
    };
    addArticle(newArticle);
    setSelectedProject(newArticle);
    setViewMode("edit");
  };

  const filteredProjects = articles.filter(p => 
    (p.title.includes(searchQuery) || p.category.includes(searchQuery)) && 
    p.status !== "published"
  );

  const publishedArticles = articles.filter(p => 
    (p.title.includes(searchQuery) || p.category.includes(searchQuery)) && 
    p.status === "published"
  );

  const getStatusBadge = (status: Article["status"]) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold">مسودة</Badge>;
      case "processing":
        return (
          <Badge variant="secondary" className="bg-amber-50 text-amber-600 border-none font-bold flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            معالجة ذكية
          </Badge>
        );
      case "ready":
        return <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 border-none font-bold">جاهز للنشر</Badge>;
      case "published":
        return <Badge variant="secondary" className="bg-emerald-500 text-white border-none font-black shadow-lg shadow-emerald-500/20">مباشر (Live)</Badge>;
    }
  };

  // List View Rendering
  if (viewMode === "list") {
    return (
      <motion.div 
        className="space-y-10 pb-10 font-readex" 
        dir="rtl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-royal-blue/10 border border-royal-blue/10">
                <FolderOpen className="h-6 w-6 text-royal-blue" />
              </div>
              <h2 className="text-4xl font-black text-dark-slate tracking-tight">مشاريعي <span className="text-royal-blue">المحفوظة</span></h2>
            </div>
            <p className="text-muted-foreground text-lg font-medium pr-1">إدارة وتحرير مشاريعك الصحفية والمسودات الذكية.</p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={handleNewProject} className="bg-royal-blue hover:bg-royal-blue/90 text-white h-14 px-8 rounded-2xl font-black shadow-lg shadow-royal-blue/20 transition-all flex items-center gap-3">
              <Plus className="h-5 w-5" />
              مشروع جديد
            </Button>
          </div>
        </header>

        <div className="relative">
          <Search className="absolute right-6 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="ابحث في مشاريعك..." 
            className="h-16 pr-14 pl-6 rounded-2xl bg-white border-border shadow-sm text-lg focus:ring-royal-blue/20 focus:border-royal-blue transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div 
                key={project.id} 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="group bento-card h-full flex flex-col justify-between overflow-hidden hover:border-royal-blue/30 transition-all duration-300">
                  <CardHeader className="p-6 pb-0 relative">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-2">
                        {getStatusBadge(project.status)}
                      </div>
                      <button 
                        onClick={() => {
                          updateArticle(project.id, { isStarred: !project.isStarred });
                        }}
                        className={cn(
                          "p-2 rounded-lg transition-all",
                          project.isStarred ? "bg-amber-50 text-amber-500" : "bg-slate-50 text-slate-300 hover:text-amber-400"
                        )}
                      >
                        <Bookmark className={cn("h-4 w-4", project.isStarred && "fill-amber-500")} />
                      </button>
                    </div>
                    <CardTitle className="text-xl font-black text-dark-slate group-hover:text-royal-blue transition-colors leading-tight mb-2">
                      {project.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Calendar className="h-4 w-4 text-royal-blue/60" />
                        <span>آخر تعديل: {project.lastEdited}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Tag className="h-4 w-4 text-royal-blue/60" />
                        <span>الفئة: {project.category}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-border/50 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-cloud-blue hover:text-royal-blue transition-all" 
                          onClick={() => handleEdit(project)}
                          title="تعديل"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl hover:bg-cloud-blue hover:text-royal-blue transition-all" 
                          onClick={() => handlePreview(project)}
                          title="معاينة"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteArticle(project.id)}
                        className="h-10 w-10 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all" 
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }

  // Preview Mode
  if (viewMode === "preview" && selectedProject) {
    return (
      <motion.div 
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 lg:p-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-white w-full max-w-6xl h-full rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
          {/* Header Controls */}
          <div className="h-20 border-b flex items-center justify-between px-8 bg-slate-50/50">
            <div className="flex items-center gap-6">
              <Button variant="ghost" className="rounded-xl font-bold gap-2 text-dark-slate" onClick={() => setViewMode("list")}>
                <ChevronRight className="h-5 w-5" />
                العودة للمشاريع
              </Button>
              <Separator orientation="vertical" className="h-8" />
              <div className="flex bg-white border p-1 rounded-xl shadow-sm">
                <Button 
                  variant={deviceMode === "desktop" ? "secondary" : "ghost"} 
                  size="sm" 
                  className={cn("rounded-lg gap-2", deviceMode === "desktop" && "bg-royal-blue text-white hover:bg-royal-blue")}
                  onClick={() => setDeviceMode("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                  حاسوب
                </Button>
                <Button 
                  variant={deviceMode === "mobile" ? "secondary" : "ghost"} 
                  size="sm" 
                  className={cn("rounded-lg gap-2", deviceMode === "mobile" && "bg-royal-blue text-white hover:bg-royal-blue")}
                  onClick={() => setDeviceMode("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                  جوال
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" className="rounded-xl font-bold gap-2" onClick={() => handleEdit(selectedProject)}>
                <Edit3 className="h-4 w-4" />
                تعديل سريع
              </Button>
              <Button className="bg-royal-blue hover:bg-royal-blue/90 text-white rounded-xl font-black px-6 shadow-lg shadow-royal-blue/20" onClick={handlePublish}>
                نشر الآن
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setViewMode("list")}>
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Preview Content */}
          <div className="flex-1 overflow-y-auto bg-slate-100/30 p-8 flex justify-center">
            <div className={cn(
              "bg-white shadow-xl transition-all duration-500 overflow-hidden",
              deviceMode === "desktop" ? "w-full max-w-4xl rounded-2xl" : "w-[375px] rounded-[3rem] border-[8px] border-dark-slate"
            )}>
              <div className="p-8 lg:p-12 space-y-8" dir="rtl">
                <Badge className="bg-royal-blue text-white border-none px-4 py-1">{selectedProject.category}</Badge>
                <h1 className="text-4xl lg:text-5xl font-black text-royal-blue leading-tight">
                  {selectedProject.title}
                </h1>
                
                <div className="flex items-center gap-4 text-muted-foreground border-y py-4">
                  <div className="h-10 w-10 rounded-full bg-slate-200" />
                  <div>
                    <p className="font-bold text-dark-slate">فريق التحرير</p>
                    <p className="text-sm">{selectedProject.lastEdited}</p>
                  </div>
                </div>

                <div className="aspect-video bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden border">
                  {selectedProject.image ? (
                    <img src={selectedProject.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Eye className="h-12 w-12 text-slate-300" />
                  )}
                </div>

                <div className="space-y-6 text-xl leading-relaxed text-slate-700 font-medium whitespace-pre-wrap">
                  {selectedProject.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Edit Mode
  if (viewMode === "edit" && selectedProject) {
    return (
      <motion.div 
        className="fixed inset-0 z-50 bg-white flex flex-col font-readex"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        dir="rtl"
      >
        {/* Editor Header */}
        <header className="h-20 border-b flex items-center justify-between px-8 bg-white z-10">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setViewMode("list")}>
              <ChevronRight className="h-6 w-6" />
            </Button>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">تحرير المسودة</span>
              <h3 className="font-black text-xl text-dark-slate truncate max-w-md">{selectedProject.title}</h3>
            </div>
            <Separator orientation="vertical" className="h-8 mx-2" />
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-bold">
              {saveStatus === "saving" ? (
                <span className="flex items-center gap-2 text-amber-500 animate-pulse">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  جاري الحفظ...
                </span>
              ) : saveStatus === "saved" ? (
                <span className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="h-4 w-4" />
                  تم الحفظ
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  تمت المزامنة
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="rounded-xl font-bold gap-2 border-royal-blue/20 text-royal-blue hover:bg-royal-blue/5" onClick={() => handlePreview(selectedProject)}>
              <Eye className="h-4 w-4" />
              معاينة حية
            </Button>
            <Button className="bg-royal-blue hover:bg-royal-blue/90 text-white rounded-xl font-black px-8 shadow-lg shadow-royal-blue/20" onClick={handlePublish}>
              نشر المشروع
            </Button>
          </div>
        </header>

        {/* Main Editor Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Rich Text Editor */}
          <div className="flex-1 flex flex-col bg-slate-50/30">
            {/* Toolbar */}
            <div className="p-4 bg-white border-b flex items-center gap-2 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white hover:shadow-sm transition-all" title="عريض">
                  <Bold className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white hover:shadow-sm transition-all" title="مائل">
                  <Italic className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white hover:shadow-sm transition-all" title="قائمة">
                  <ListIcon className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-white hover:shadow-sm transition-all" title="رابط">
                  <LinkIcon className="h-4 w-4" />
                </Button>
              </div>
              <Separator orientation="vertical" className="h-6 mx-2" />
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-white border-royal-blue/10 text-royal-blue flex items-center gap-2 h-9 px-4 rounded-xl cursor-pointer hover:bg-royal-blue/5 transition-all" onClick={() => handleAiRefine("shorten")}>
                  <Sparkles className="h-3 w-3" />
                  اختصار ذكي
                </Badge>
                <Badge variant="outline" className="bg-white border-royal-blue/10 text-royal-blue flex items-center gap-2 h-9 px-4 rounded-xl cursor-pointer hover:bg-royal-blue/5 transition-all" onClick={() => handleAiRefine("professionalize")}>
                  <Sparkles className="h-3 w-3" />
                  تحسين مهني
                </Badge>
                <Badge variant="outline" className="bg-white border-royal-blue/10 text-royal-blue flex items-center gap-2 h-9 px-4 rounded-xl cursor-pointer hover:bg-royal-blue/5 transition-all" onClick={() => handleAiRefine("translate")}>
                  <Sparkles className="h-3 w-3" />
                  ترجمة فورية
                </Badge>
              </div>
            </div>

            {/* Editable Area */}
            <ScrollArea className="flex-1 p-12 lg:p-20">
              <div className="max-w-4xl mx-auto">
                <textarea
                  className="w-full min-h-[600px] bg-transparent border-none focus:ring-0 text-xl lg:text-2xl leading-relaxed text-slate-800 placeholder:text-slate-300 font-medium resize-none outline-none"
                  placeholder="ابدأ بالكتابة هنا..."
                  value={editorContent}
                  onChange={(e) => {
                    setEditorContent(e.target.value);
                    if (saveStatus !== "saving") {
                      setSaveStatus("saving");
                      setTimeout(() => {
                        handleSave();
                      }, 1000);
                    }
                  }}
                />
              </div>
            </ScrollArea>
          </div>

          {/* Right: AI Panel */}
          <div className="w-[400px] border-r bg-white flex flex-col overflow-hidden">
            <div className="p-6 border-b bg-slate-50/50">
              <h4 className="flex items-center gap-2 font-black text-dark-slate">
                <Sparkles className="h-5 w-5 text-royal-blue" />
                مساعد صدى الذكي
              </h4>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-6 space-y-8">
                {/* Engagement Score */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-muted-foreground">توقع التفاعل</span>
                    <span className="font-black text-royal-blue">{aiAnalysis.engagement}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-l from-royal-blue to-electric-blue"
                      initial={{ width: 0 }}
                      animate={{ width: `${aiAnalysis.engagement}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-royal-blue/5 border border-royal-blue/10 space-y-2">
                  <div className="flex items-center gap-2 text-royal-blue font-bold text-sm">
                    <AlertCircle className="h-4 w-4" />
                    تحليل المشاعر
                  </div>
                  <p className="text-dark-slate font-medium">النبرة الغالبة هي <span className="text-royal-blue font-black underline underline-offset-4">{aiAnalysis.sentiment}</span>. هذا يساعد في بناء الثقة مع جمهورك.</p>
                </div>

                  {/* AI Suggestions */}
                  <div className="space-y-4">
                    <h5 className="font-bold text-sm text-muted-foreground uppercase tracking-wider">مقترحات التحسين</h5>
                    <div className="space-y-3">
                      {aiAnalysis.suggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex gap-3 p-4 rounded-2xl border border-border bg-white hover:border-royal-blue/20 transition-all group">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-royal-blue group-hover:text-white transition-all">
                            {idx + 1}
                          </div>
                          <p className="flex-1 text-sm font-medium text-slate-600 leading-relaxed">{suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>

            {/* AI Input Area */}
            <div className="p-6 border-t bg-slate-50/50">
              <div className="relative">
                <Input 
                  placeholder="اسأل الذكاء الاصطناعي..." 
                  className="pr-4 pl-12 h-12 rounded-xl bg-white border-border shadow-sm text-sm"
                />
                <Button variant="ghost" size="icon" className="absolute left-1 top-1/2 -translate-y-1/2 h-10 w-10 text-royal-blue">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return null;
}
