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
  ShieldCheck, Clock
} from "lucide-react"; 
import { 
  getDashboardStats, getRecentTickets, getTopInstansi, 
  getAverageVerificationSpeed, getSLARiskData, getRegionAnalytics 
} from "./actions/dashboard"; 
import Link from "next/link"; 
import DashboardMapSection from "@/components/DashboardMapSection";
import { prisma } from "@/lib/prisma";
import IntegratedPipelineCard from "@/components/dashboard/IntegratedPipelineCard";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentTickets = await getRecentTickets(); 
  const topInstansi = await getTopInstansi();
  const avgSpeed = await getAverageVerificationSpeed();
  const slaRiskTickets = await getSLARiskData();
  const regionAnalytics = await getRegionAnalytics(); 

  const allTicketsWithLoc = await prisma.tiketAduan.findMany({
    where: { NOT: { latitude: null } as any },
    include: { pelapor: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 p-6 pb-20 bg-[#fcfcfd] min-h-screen text-slate-900 max-w-[1600px] mx-auto font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900 tracking-tightest uppercase italic leading-none flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-indigo-600" /> Dashboard Operasional
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-11">
            Real-time Monitoring & Ingest Data Intelligence
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="hidden lg:flex bg-white text-[10px] font-black uppercase tracking-tighter border-slate-200 py-1.5 px-4 shadow-sm">
            SLA Standard: SK 244/2020
          </Badge>
          <Link href="/dashboard/laporan/baru">
            <Button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold uppercase text-[11px] tracking-widest rounded-xl shadow-xl shadow-indigo-100 transition-all active:scale-95">
              <Plus className="w-4 h-4 mr-2" /> Input Laporan Manual
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Total Aduan", val: stats.totalLaporan, sub: "Ingest tracking active", color: "text-slate-900", bg: "bg-white", icon: <FileText className="h-4 w-4 text-slate-400" /> },
          { label: "Verifikasi", val: stats.verifikasi, sub: "SLA Countdown", color: "text-amber-600", bg: "bg-amber-50/30", icon: <Activity className="h-4 w-4 text-amber-500" /> },
          { label: "Risk Pleno", val: stats.waitingPleno, sub: "Critical Stage", color: "text-rose-600", bg: "bg-rose-50/30", icon: <Users className="h-4 w-4 text-rose-500" /> },
          { label: "Selesai", val: stats.selesai, sub: "LHP Generated", color: "text-emerald-600", bg: "bg-emerald-50/30", icon: <BookOpen className="h-4 w-4 text-emerald-500" /> },
          { label: "Kecepatan", val: avgSpeed, sub: "Berdasarkan Data", color: "text-indigo-600", bg: "bg-white", icon: <Clock className="h-4 w-4 text-indigo-400" />, unit: " HARI" }
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
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 group-hover:text-indigo-500 transition-colors">{item.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* --- INTEGRASI BARU: PIPELINE MONITOR --- */}
      <div className="mt-8 mb-8">
         <IntegratedPipelineCard />
      </div>
      
      {/* 3. SLA RISK MONITORING */}
      <Card className="rounded-3xl border-slate-100 shadow-sm overflow-hidden bg-white">
        <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
          <h3 className="text-[11px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4" /> SLA Risk Monitoring
          </h3>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase text-slate-400">Prev</Button>
             <span className="text-[9px] font-black text-slate-300 mx-2">Page 1 / 3</span>
             <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase text-slate-400">Next</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-white hover:bg-transparent border-slate-50">
              <TableHead className="h-12 text-[10px] font-black uppercase text-slate-400 pl-6">ID Tiket</TableHead>
              <TableHead className="h-12 text-[10px] font-black uppercase text-slate-400">Status</TableHead>
              <TableHead className="h-12 text-[10px] font-black uppercase text-slate-400">Deadline Formil</TableHead>
              <TableHead className="h-12 text-[10px] font-black uppercase text-slate-400 text-right pr-6">Estimasi Sisa Waktu</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slaRiskTickets.slice(0, 5).map((t) => {
              // --- LOGIC COUNTDOWN DINAMIS DIMULAI ---
              const now = new Date();
              const deadline = t.deadlineFormil ? new Date(t.deadlineFormil) : null;
              
              let statusWaktu = { text: "-", color: "text-slate-300" };

              if (deadline) {
                // Hitung selisih dalam milidetik -> konversi ke hari
                const diffTime = deadline.getTime() - now.getTime();
                const sisaHari = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // Tentukan Text & Warna berdasarkan urgensi
                if (sisaHari < 0) {
                  statusWaktu = { text: `TELAT ${Math.abs(sisaHari)} HARI`, color: "text-rose-600 font-black animate-pulse" };
                } else if (sisaHari === 0) {
                  statusWaktu = { text: "DEADLINE HARI INI", color: "text-amber-600 font-black" };
                } else if (sisaHari <= 3) {
                  statusWaktu = { text: `${sisaHari} HARI LAGI`, color: "text-amber-600 font-bold" };
                } else {
                  statusWaktu = { text: `${sisaHari} HARI LAGI`, color: "text-emerald-600 font-medium" };
                }
              }
              // --- LOGIC COUNTDOWN SELESAI ---

              return (
                <TableRow key={t.id} className="border-slate-50 group hover:bg-slate-50/50 transition-colors">
                  <TableCell className="py-3 font-mono text-[11px] font-black text-indigo-600 pl-6">#{t.id.substring(0,8)}</TableCell>
                  <TableCell className="py-3">
                    <Badge variant="secondary" className="bg-slate-100 text-[9px] font-black uppercase text-slate-500 rounded-md">{t.status.replace("_", " ")}</Badge>
                  </TableCell>
                  <TableCell className="py-3 text-[10px] font-bold text-slate-500">
                    {/* Format Tanggal Indonesia */}
                    {t.deadlineFormil ? new Date(t.deadlineFormil).toLocaleDateString("id-ID") : "-"}
                  </TableCell>
                  {/* Tampilan Dinamis Berwarna */}
                  <TableCell className={`py-3 text-right text-[10px] pr-6 ${statusWaktu.color}`}>
                    {statusWaktu.text}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* 4. MAP SECTION (FIXED: Z-INDEX & STRUCTURE) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-0"> 
        {/* NOTE: 'relative z-0' di sini SANGAT PENTING. 
            Ini membuat "Stacking Context" baru. Peta (z-400) akan terkurung di dalam div ini 
            dan tidak akan bisa menimpa Header Menu (z-50) yang ada di luar konteks ini. 
        */}
        
        <div className="xl:col-span-2 bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm flex flex-col">
          
          {/* HEADER MAP: Statis (Bukan Absolute) agar tidak tertimpa peta */}
          <div className="px-6 py-5 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white z-10 relative">
             <div>
               <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                 <MapIcon className="w-4 h-4 text-indigo-600" /> Peta Sebaran Maladministrasi
               </h3>
               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 ml-6">
                 Kaltara Geospatial Intelligence v2.0
               </p>
             </div>
             <div className="flex gap-2">
               <Badge variant="outline" className="text-[8px] font-bold uppercase border-slate-200 text-slate-400 cursor-pointer hover:bg-slate-50">Filter: Semua</Badge>
             </div>
          </div>
          
          {/* MAP CONTAINER: z-0 internal agar tetap di bawah header map */}
          <div className="h-[500px] w-full bg-slate-50 relative z-0">
            <DashboardMapSection initialPoints={allTicketsWithLoc} />
          </div>
        </div>

        {/* Region Ranking */}
        <Card className="rounded-[32px] border-slate-100 shadow-sm h-full min-h-[500px] flex flex-col bg-white">
          <CardHeader className="pb-2 border-b border-slate-50/50 p-6">
             <CardTitle className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-indigo-600" /> Region Ranking
             </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-6 opacity-60">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <TrendingUp className="w-6 h-6 text-slate-300" />
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menunggu Data Analisa Wilayah...</p>
          </CardContent>
        </Card>
      </div>

      {/* 5. BOTTOM SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1">
          <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white p-6 h-[320px] flex flex-col">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <Building2 className="w-4 h-4 text-indigo-600" /> Top 5 Terlapor
            </h3>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Belum Ada Data Instansi</p>
            </div>
          </Card>
        </div>

        <div className="xl:col-span-2">
           <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white h-[320px] flex flex-col overflow-hidden">
             <div className="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                   <Activity className="w-4 h-4 text-indigo-600" /> Recent Activity
                </h3>
                <Badge className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 text-[9px] font-black uppercase">LIVE FEED</Badge>
             </div>
             <div className="flex-1 overflow-auto">
               <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="h-32 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Tidak ada aktivitas baru
                      </TableCell>
                    </TableRow>
                  </TableBody>
               </Table>
             </div>
           </Card>
        </div>
      </div>
    </div>
  );
}