"use client";

import React from "react";
import { 
  Users, 
  ShieldCheck, 
  Globe,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Activity,
  BarChart3,
  Search,
  Timer,
  Layout
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { LiveQueue } from "./LiveQueue";

const data = [
  { name: "الاثنين", engagement: 4000, trust: 85, reach: 2400 },
  { name: "الثلاثاء", engagement: 3000, trust: 88, reach: 1398 },
  { name: "الأربعاء", engagement: 2000, trust: 82, reach: 9800 },
  { name: "الخميس", engagement: 2780, trust: 90, reach: 3908 },
  { name: "الجمعة", engagement: 1890, trust: 87, reach: 4800 },
  { name: "السبت", engagement: 2390, trust: 92, reach: 3800 },
  { name: "الأحد", engagement: 3490, trust: 95, reach: 4300 },
];

export function Dashboard() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      className="space-y-10 pb-10 font-readex" 
      dir="rtl"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-royal-blue/10 border border-royal-blue/10">
            <Layout className="h-6 w-6 text-royal-blue" />
          </div>
          <h2 className="text-4xl font-black text-dark-slate tracking-tight leading-tight">مركز القيادة <span className="text-royal-blue">المؤتمت</span></h2>
        </div>
        <p className="text-muted-foreground text-lg font-medium pr-1">تحليلات الأداء والموثوقية الإعلامية لنظام Smart Press.</p>
      </header>

      {/* Stats Bento Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "إجمالي التفاعل", value: "128,430", change: "+12.5%", icon: Users, color: "text-royal-blue", bg: "bg-cloud-blue" },
          { title: "مؤشر الثقة Neural", value: "92.4%", change: "+2.1%", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "الوصول العالمي", value: "2.4M", change: "-0.4%", icon: Globe, color: "text-royal-blue", bg: "bg-cloud-blue" }
        ].map((stat, i) => (
          <motion.div key={i} variants={itemVariants}>
            <Card className="bento-card p-6 h-full flex flex-col justify-between overflow-hidden relative group">
              <div className="flex flex-row items-center justify-between mb-4">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.title}</span>
                <div className={`p-2 ${stat.bg} rounded-lg`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-black text-dark-slate tracking-tighter">{stat.value}</div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={`${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} border-none text-[10px] font-black`}>
                    {stat.change}
                  </Badge>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">نمو الفترة</span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-12 items-stretch">
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <Card className="bento-card p-8 h-full bg-white relative overflow-hidden group">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
               <div>
                  <h3 className="text-xl font-black text-dark-slate flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-royal-blue" /> توجهات التفاعل العصبي
                  </h3>
                  <p className="text-xs font-medium text-muted-foreground mt-1">تفاعل الجمهور الحي عبر القنوات الرقمية.</p>
               </div>
               <div className="flex bg-cloud-blue/50 p-1 rounded-xl border border-border">
                  {['يومي', 'أسبوعي', 'شهري'].map((t) => (
                    <button key={t} className={`px-5 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${t === 'أسبوعي' ? 'bg-white text-royal-blue shadow-sm' : 'text-muted-foreground hover:text-dark-slate'}`}>{t}</button>
                  ))}
               </div>
            </div>
            
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="dashboardAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A56DB" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#1A56DB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94A3B8" 
                    fontSize={11} 
                    fontWeight="700"
                    tickLine={false} 
                    axisLine={false} 
                    dy={10}
                  />
                  <YAxis 
                    orientation="right"
                    stroke="#94A3B8" 
                    fontSize={11} 
                    fontWeight="700"
                    tickLine={false} 
                    axisLine={false} 
                    dx={10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#fff", 
                      border: "1px solid #E5E7EB",
                      borderRadius: "16px",
                      boxShadow: "0 10px 30px rgba(26, 86, 219, 0.08)",
                      textAlign: "right",
                      fontSize: "12px",
                      fontWeight: "bold"
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#1A56DB" 
                    strokeWidth={4}
                    fillOpacity={1} 
                    fill="url(#dashboardAreaGradient)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="lg:col-span-4">
          <Card className="bento-card p-8 h-full bg-white relative overflow-hidden flex flex-col">
             <div className="mb-8">
                <h3 className="text-xl font-black text-dark-slate flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" /> تقييم الموثوقية
                </h3>
                <p className="text-xs font-medium text-muted-foreground mt-1">مؤشر الثقة المعتمد من AI Guardian.</p>
             </div>
             
             <div className="flex-1 min-h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" hide />
                      <YAxis domain={[70, 100]} hide />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', shadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                      <Line 
                        type="step" 
                        dataKey="trust" 
                        stroke="#10B981" 
                        strokeWidth={3} 
                        dot={{ r: 4, fill: "#10B981", strokeWidth: 0 }}
                        animationDuration={2500}
                      />
                   </LineChart>
                </ResponsiveContainer>
             </div>
             
             <div className="mt-8 space-y-4">
                <div className="flex items-center justify-between p-5 bg-emerald-50 border border-emerald-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                      <Zap className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                    </div>
                    <span className="text-xs font-black text-emerald-700 uppercase">نظام التحقق نشط</span>
                  </div>
                  <span className="text-[10px] font-black text-emerald-600">99.9%</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-cloud-blue border border-royal-blue/10 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                      <Timer className="h-4 w-4 text-royal-blue" />
                    </div>
                    <span className="text-xs font-black text-royal-blue uppercase">زمن الاستجابة</span>
                  </div>
                  <span className="text-[10px] font-black text-royal-blue">140ms</span>
                </div>
             </div>
          </Card>
        </motion.div>
      </div>

      {/* Live Queue Section */}
      <motion.div variants={itemVariants}>
         <LiveQueue />
      </motion.div>

      {/* Intelligence Feed Banner */}
      <motion.div variants={itemVariants}>
        <Card className="bento-card p-10 bg-royal-blue text-white shadow-xl shadow-royal-blue/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest">
                <Activity className="h-3 w-3" />
                تنبيه ذكي
              </div>
              <h3 className="text-2xl font-black">تحليل الاتجاهات الميدانية الأخيرة</h3>
              <p className="text-white/80 font-medium max-w-2xl leading-relaxed">يرصد النظام طفرة في اهتمام الجمهور بالتقارير الاستقصائية المتعلقة بـ "الأمن السيبراني المحلي" بنسبة زيادة 35% في منطقة الشرق الأوسط وشمال أفريقيا.</p>
            </div>
            <button className="whitespace-nowrap bg-white text-royal-blue font-black px-10 py-5 rounded-2xl shadow-xl hover:scale-105 transition-all text-sm uppercase tracking-wider">
              استكشاف التقرير
            </button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
