// app/dashboard/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  FileText, Plus, Activity, Users, BookOpen, 
  TrendingUp, Building2, Map as MapIcon, 
  ShieldCheck, Clock, Bell, AlertCircle, Lightbulb, Search, Scale, BarChart3
} from "lucide-react"; 
import { 
  getDashboardStats, getRecentTickets, getTopInstansi, 
  getAverageVerificationSpeed, getSLARiskData, getRegionAnalytics,
  getPipelineStats 
} from "./actions/dashboard"; 
import Link from "next/link"; 
import DashboardMapSection from "@/components/DashboardMapSection";
import { prisma } from "@/lib/prisma";
import IntegratedPipelineCard from "@/components/dashboard/IntegratedPipelineCard";
import DashboardAIBrief from "@/components/dashboard/DashboardAIBrief";

export default async function DashboardPage() {
  const [
    stats, 
    pipelineStats, 
    recentTickets, 
    topInstansi, 
    avgSpeed, 
    slaRiskTickets, 
    regionAnalytics
  ] = await Promise.all([
    getDashboardStats(), 
    getPipelineStats(), 
    getRecentTickets(), 
    getTopInstansi(),
    getAverageVerificationSpeed(), 
    getSLARiskData(), 
    getRegionAnalytics()
  ]);

  const anomalies = regionAnalytics.filter((reg: any) => reg.isAnomaly);
  const allTicketsWithLoc = await prisma.tiketAduan.findMany({
    where: { NOT: { latitude: null } as any },
    include: { pelapor: true },
    orderBy: { createdAt: 'desc' },
  });

  const topRegionData = regionAnalytics.length > 0 ? regionAnalytics[0] : undefined;
  const dominantIssue = topRegionData?.topMaladmin || "ADMINISTRASI";

  return (
    <div className="space-y-8 p-6 pb-20 bg-[#fcfcfd] min-h-screen text-slate-900 max-w-[1600px] mx-auto font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 sticky top-0 bg-[#fcfcfd]/90 backdrop-blur-md z-[40] pt-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tightest uppercase italic leading-none flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-600" /> Dashboard Operasional
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-11">
            Strategic Monitoring & Regional Intelligence
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Link href="/dashboard/laporan/baru">
              <Button className="h-10 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase text-[10px] tracking-widest rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 hover:-translate-y-0.5">
                <Plus className="w-4 h-4 mr-2" /> Input Laporan
              </Button>
           </Link>
        </div>
      </div>

      {/* AI EXECUTIVE BRIEF */}
      <DashboardAIBrief 
        stats={{
          total: stats.totalLaporan,
          verifikasi: stats.verifikasi,
          selesai: stats.selesai
        }}
        topRegion={topRegionData}
        dominantIssue={dominantIssue}
      />

      {/* KPI CARDS */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Aduan", val: stats.totalLaporan, sub: "All Sources", color: "text-slate-900", bg: "bg-white", icon: <FileText className="h-4 w-4 text-slate-400" /> },
          { label: "Verifikasi", val: stats.verifikasi, sub: "Action Needed", color: "text-amber-600", bg: "bg-amber-50/30", icon: <Activity className="h-4 w-4 text-amber-500" /> },
          { label: "Risk Pleno", val: stats.waitingPleno, sub: "High Priority", color: "text-rose-600", bg: "bg-rose-50/30", icon: <Users className="h-4 w-4 text-rose-500" /> },
          { label: "Selesai", val: stats.selesai, sub: "Closed Cases", color: "text-emerald-600", bg: "bg-emerald-50/30", icon: <BookOpen className="h-4 w-4 text-emerald-500" /> },
          { label: "Kecepatan", val: avgSpeed, sub: "Avg Days", color: "text-indigo-600", bg: "bg-white", icon: <Clock className="h-4 w-4 text-indigo-400" />, unit: " HARI" }
        ].map((item, i) => (
          <Card key={i} className={`rounded-2xl border-slate-100 shadow-sm ${item.bg} group hover:shadow-md transition-all hover:-translate-y-1`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-5 pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">{item.label}</CardTitle>
              {item.icon}
            </CardHeader>
            <CardContent className="p-5 pt-0">
              <div className={`text-4xl font-black italic tracking-tighter ${item.color}`}>
                {item.val}<span className="text-[10px] font-bold text-slate-400 ml-1 not-italic">{item.unit || ""}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* PIPELINE & RECOMMENDATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <IntegratedPipelineCard stats={pipelineStats} />
        </div>
        <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-6 pb-2 border-b border-slate-50">
            <CardTitle className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Strategic Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {topRegionData && topRegionData.count > 1 ? (
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Fokus: {topRegionData.name}</p>
                  <p className="text-xs font-bold text-slate-900">
                    Wilayah dengan intensitas laporan tertinggi ({topRegionData.count} kasus).
                  </p>
                  <p className="text-[10px] text-slate-600 leading-relaxed mt-2 italic font-medium">
                    Saran: Koordinasi pencegahan dengan Inspektorat {topRegionData.name}.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mb-2" />
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Kondisi Stabil</p>
                <p className="text-[9px] font-medium text-slate-400">Sebaran kasus merata, tidak ada anomali wilayah.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* STRATEGIC REGION ANALYTICS BOARD */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start"> 
        <div className="xl:col-span-2 bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm flex flex-col h-[500px]">
          <div className="px-6 py-5 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white z-10 relative">
             <div>
               <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                 <MapIcon className="w-4 h-4 text-indigo-600" /> Geospasial Maladministrasi
               </h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 ml-6">Live Tracking v2.1</p>
             </div>
          </div>
          <div className="flex-1 w-full bg-slate-50 relative z-0">
            <DashboardMapSection initialPoints={allTicketsWithLoc} />
          </div>
        </div>

        {/* REGION RANKING CARD (UPDATED STRATEGIC VISUAL) */}
        <Card className="p-6 rounded-[32px] border-slate-100 shadow-sm bg-white flex flex-col h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" /> Analisis Wilayah
            </h3>
            <Badge variant="outline" className="text-[8px] uppercase font-bold border-indigo-100 text-indigo-600 bg-indigo-50">By Terlapor</Badge>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {regionAnalytics.length > 0 ? (
              regionAnalytics.map((reg: any, i: number) => {
                // Logic Visual Bar Chart
                const intensityColor = i === 0 ? "bg-rose-500" : i === 1 ? "bg-amber-500" : "bg-indigo-500";
                const totalTickets = stats.totalLaporan || 1;
                const barWidth = Math.max((reg.count / totalTickets) * 100, 5); // Minimal 5% agar terlihat
                
                return (
                  <div key={reg.name} className="group p-3 rounded-2xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50/50 transition-all">
                    <div className="flex justify-between items-end mb-2">
                       <div className="flex items-center gap-3">
                         <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-sm ${i < 3 ? 'bg-slate-900' : 'bg-slate-300'}`}>
                           {i + 1}
                         </div>
                         <div>
                           <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{reg.name}</p>
                           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wider">
                             Dominan: <span className="text-rose-500 font-bold">{reg.topMaladmin.replace(/_/g, " ")}</span>
                           </p>
                         </div>
                       </div>
                       <div className="text-right">
                         <span className="text-sm font-black text-slate-900">{reg.count}</span>
                         <span className="text-[9px] font-bold text-slate-400 ml-1">Kasus</span>
                       </div>
                    </div>
                    
                    {/* Visual Bar Chart */}
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${intensityColor}`} 
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-40 italic">
                <p className="text-[10px] font-bold uppercase tracking-widest">Memuat Data Wilayah...</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-50">
            <Button variant="ghost" className="w-full text-[9px] font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50">
              Download Laporan PDF <FileText className="w-3 h-3 ml-2" />
            </Button>
          </div>
        </Card>
      </div>

      {/* BOTTOM ANALYTICS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white p-6 h-[400px]">
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
             <Building2 className="w-4 h-4 text-indigo-600" /> Top Instansi Terlapor
          </h3>
          <div className="space-y-6">
            {topInstansi.length > 0 ? (
              topInstansi.map((ins: any, i: number) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-tighter">
                    <span className="text-slate-600 truncate w-40">{ins.name}</span>
                    <span className="text-indigo-600">{ins.count} Kasus</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${(ins.count / (stats.totalLaporan || 1)) * 100}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center h-full opacity-30">
                  <p className="text-[9px] font-black uppercase tracking-widest italic text-slate-300">Belum Ada Data</p>
               </div>
            )}
          </div>
        </Card>

        <Card className="xl:col-span-2 rounded-[32px] border-slate-100 shadow-sm bg-white h-[400px] flex flex-col overflow-hidden">
           <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                 <Activity className="w-4 h-4 text-indigo-600" /> Recent Activity Feed
              </h3>
              <Badge className="bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase">Real-time</Badge>
           </div>
           <div className="flex-1 overflow-auto custom-scrollbar">
             <Table>
                <TableBody>
                  {recentTickets.map((t: any) => (
                    <TableRow key={t.id} className="hover:bg-slate-50 transition-colors border-slate-50">
                      <TableCell className="font-mono text-[10px] font-black text-indigo-600 pl-6">#{t.id.substring(0,8)}</TableCell>
                      <TableCell className="text-[10px] font-black uppercase text-slate-900">{t.pelapor?.namaLengkap || "Anonim"}</TableCell>
                      <TableCell><Badge variant="outline" className="text-[8px] font-bold border-slate-200 uppercase">{t.status.replace("_", " ")}</Badge></TableCell>
                      <TableCell className="text-[9px] font-bold text-slate-400">{new Date(t.createdAt).toLocaleDateString("id-ID")}</TableCell>
                      <TableCell className="text-right pr-6">
                        <Link href={`/dashboard/inbox/${t.id}`}>
                           <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase hover:text-indigo-600">Periksa</Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {recentTickets.length === 0 && (
                    <TableRow><TableCell colSpan={5} className="h-48 text-center text-slate-300 text-[10px] uppercase font-bold">Tidak ada aktivitas</TableCell></TableRow>
                  )}
                </TableBody>
             </Table>
           </div>
           <div className="p-4 bg-slate-50/50 border-t border-slate-100 text-right">
              <Button variant="outline" className="text-[9px] font-black uppercase tracking-widest border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-full h-8 px-4">
                Hubungi IT Support (WA)
              </Button>
           </div>
        </Card>
      </div>
    </div>
  );
}