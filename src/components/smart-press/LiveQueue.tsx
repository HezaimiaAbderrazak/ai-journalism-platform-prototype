"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  ExternalLink, 
  MapPin, 
  Clock, 
  User,
  Radio,
  Tv
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useArticles, LiveReport } from "@/context/ArticleContext";
import { cn } from "@/lib/utils";

export function LiveQueue() {
  const { liveReports, updateLiveReport, setLiveTVStatus } = useArticles();

  const handleApprove = async (report: LiveReport) => {
    updateLiveReport(report.id, { status: "approved" });
    try {
      await fetch('/api/live-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'accept', requestId: report.id })
      });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleReject = async (id: string) => {
    updateLiveReport(id, { status: "rejected" });
    try {
      await fetch('/api/live-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject', requestId: id })
      });
    } catch (error) {
      console.error("API error:", error);
    }
  };

  const handleGoLive = (report: LiveReport) => {
    updateLiveReport(report.id, { status: "live" });
    setLiveTVStatus({
      isLive: true,
      title: `تغطية مباشرة من ${report.location} برعاية ${report.reporterName}`,
      category: "تغطية ميدانية",
      viewers: "5.1K"
    });
  };

  const pendingReports = liveReports.filter(r => r.status === "pending");
  const approvedReports = liveReports.filter(r => r.status === "approved" || r.status === "live");

  return (
    <div className="space-y-8 font-readex" dir="rtl">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-2xl font-black text-dark-slate flex items-center gap-3">
            <Radio className="h-6 w-6 text-red-500" />
            طلبات البث <span className="text-royal-blue">الميداني</span>
          </h3>
          <p className="text-slate-500 font-medium">إدارة تقارير المراسلين المواطنين في الوقت الفعلي.</p>
        </div>
        <Badge className="bg-royal-blue/10 text-royal-blue border-none px-4 py-1.5 rounded-full font-black">
          {pendingReports.length} طلب معلق
        </Badge>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pending Reports */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">في انتظار المراجعة</h4>
          <AnimatePresence mode="popLayout">
            {pendingReports.map((report) => (
              <motion.div
                key={report.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <Card className="bg-white border-2 border-transparent hover:border-royal-blue/10 shadow-lg overflow-hidden transition-all group">
                  <div className="flex">
                    <div className="w-1/3 aspect-video relative overflow-hidden bg-slate-100">
                      <img 
                        src={report.thumbnail} 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        alt="Thumbnail"
                      />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                         <Button variant="ghost" size="icon" className="text-white">
                           <Play className="h-8 w-8 fill-white" />
                         </Button>
                      </div>
                    </div>
                    <CardContent className="flex-1 p-5 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-[10px] font-black text-slate-400">
                             <User className="h-3 w-3" />
                             {report.reporterName}
                           </div>
                           <span className="text-[10px] font-bold text-slate-400">{report.timestamp}</span>
                        </div>
                        <h5 className="font-black text-dark-slate flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-royal-blue" />
                          {report.location}
                        </h5>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4">
                        <Button 
                          onClick={() => handleApprove(report)}
                          className="flex-1 h-9 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black gap-2"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          قبول
                        </Button>
                        <Button 
                          onClick={() => handleReject(report.id)}
                          variant="ghost" 
                          className="h-9 w-9 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 p-0"
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          {pendingReports.length === 0 && (
            <div className="py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
              <p className="text-slate-400 font-bold text-sm">لا توجد طلبات معلقة حالياً</p>
            </div>
          )}
        </div>

        {/* Approved / Active Queue */}
        <div className="space-y-4">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">جاهز للبث / نشط</h4>
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {approvedReports.map((report) => (
                <motion.div
                  key={report.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card className={cn(
                    "bg-white border-2 overflow-hidden transition-all",
                    report.status === "live" ? "border-red-500 shadow-xl shadow-red-500/10" : "border-slate-100 shadow-lg"
                  )}>
                    <div className="p-5 flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="relative h-14 w-14 rounded-2xl overflow-hidden shadow-inner bg-slate-100">
                           <img src={report.thumbnail} className="w-full h-full object-cover" />
                           {report.status === "live" && (
                             <div className="absolute inset-0 bg-red-600/20 animate-pulse" />
                           )}
                        </div>
                        <div>
                          <h5 className="font-black text-dark-slate">{report.location}</h5>
                          <p className="text-xs font-bold text-slate-400">{report.reporterName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {report.status === "live" ? (
                          <Badge className="bg-red-600 text-white border-none px-4 py-1.5 rounded-full font-black animate-pulse flex items-center gap-2">
                            <Radio className="h-3.5 w-3.5" />
                            مباشر الآن
                          </Badge>
                        ) : (
                          <Button 
                            onClick={() => handleGoLive(report)}
                            className="h-11 px-6 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-xs font-black gap-2 shadow-lg shadow-red-600/20"
                          >
                            <Tv className="h-4 w-4" />
                            بث مباشر
                          </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-11 w-11 rounded-2xl bg-slate-50 text-slate-400 hover:text-royal-blue">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            {approvedReports.length === 0 && (
              <div className="py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                <p className="text-slate-400 font-bold text-sm">لا توجد تقارير معتمدة حالياً</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
