// app/dashboard/analytics/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  Zap, 
  BrainCircuit, 
  ArrowUpRight, 
  ArrowDownRight,
  Filter,
  Download,
  Share2
} from "lucide-react";
import OpinionPredictionCard from "@/components/dashboard/OpinionPredictionCard";

export default function AnalyticsPage() {
  return (
    <div className="space-y-8 p-6 pb-20 bg-[#fcfcfd] min-h-screen text-slate-900 max-w-[1600px] mx-auto font-sans">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-100 mt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-1">
             <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest">
               Strategic Intelligence Unit
             </Badge>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tightest uppercase italic leading-none flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-indigo-600" /> Strategic Analytics
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] ml-11">
            Deep-dive Data & Policy Forecasting
          </p>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="outline" className="h-10 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-500">
             <Filter className="w-3.5 h-3.5 mr-2" /> Filter Periode
           </Button>
           <Button variant="outline" className="h-10 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-500">
             <Download className="w-3.5 h-3.5 mr-2" /> Export PDF
           </Button>
           <Button className="h-10 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
             <Share2 className="w-3.5 h-3.5 mr-2" /> Share Report
           </Button>
        </div>
      </div>

      {/* 2. EXECUTIVE SUMMARY & PREDICTION GRID (Re-structured) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: AI EXECUTIVE SUMMARY (The "Brain") */}
        <Card className="lg:col-span-2 rounded-[32px] border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <BrainCircuit className="w-64 h-64 text-indigo-600" />
          </div>
          <CardContent className="p-8 relative z-10">
             <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200">
                 <Zap className="w-5 h-5 text-white" />
               </div>
               <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">AI Policy Insight (BETA)</h3>
             </div>
             
             <div className="grid md:grid-cols-3 gap-8">
               <div className="col-span-2 space-y-4">
                 <p className="text-xl font-bold text-slate-800 leading-relaxed">
                   "Terdeteksi lonjakan <span className="bg-rose-100 text-rose-600 px-1 rounded">24%</span> aduan terkait <span className="underline decoration-indigo-300 decoration-2 underline-offset-4">Infrastruktur Desa</span> di wilayah Bulungan dalam 30 hari terakhir."
                 </p>
                 <p className="text-sm text-slate-500 leading-relaxed">
                   Analisis sentimen menunjukkan frustrasi publik mencapai level kritis. Disarankan untuk menjadwalkan <strong>Investigasi Inisiatif Sendiri</strong> atau koordinasi preventif dengan Dinas PU setempat sebelum eskalasi media terjadi.
                 </p>
                 <div className="pt-4 flex gap-3">
                   <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-widest rounded-lg">
                     Buat Laporan Kajian
                   </Button>
                   <Button variant="ghost" size="sm" className="text-indigo-600 font-bold text-[10px] uppercase tracking-widest">
                     Lihat Detail Data &rarr;
                   </Button>
                 </div>
               </div>
               
               {/* Key Metrics Mini */}
               <div className="grid grid-cols-1 gap-4 border-l border-indigo-100 pl-8">
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Prediction Score</p>
                     <div className="flex items-end gap-2">
                       <span className="text-3xl font-black text-slate-900">88.5</span>
                       <Badge className="bg-emerald-100 text-emerald-700 mb-1">+2.4</Badge>
                     </div>
                  </div>
                  <div>
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Est. Dampak Publik</p>
                     <div className="flex items-end gap-2">
                       <span className="text-3xl font-black text-rose-600">HIGH</span>
                     </div>
                  </div>
               </div>
             </div>
          </CardContent>
        </Card>

        {/* Kolom Kanan: WIDGET PREDIKSI OPINI (INTEGRATED) */}
        <div className="lg:col-span-1 h-full">
           <OpinionPredictionCard />
        </div>

      </div>

      {/* 3. VISUAL ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* CHART 1: Tren Bulanan (CSS Bar Chart Mockup) */}
        <Card className="lg:col-span-2 rounded-[32px] border-slate-100 shadow-sm bg-white p-6">
           <div className="flex justify-between items-center mb-8">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" /> Tren Volume Aduan (2025)
              </h3>
              <div className="flex gap-2">
                 <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Masuk</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Selesai</span>
                 </div>
              </div>
           </div>
           
           {/* Visualisasi Batang CSS Murni */}
           <div className="h-[250px] flex items-end justify-between gap-2 sm:gap-4 px-2">
              {[45, 60, 35, 70, 85, 65, 55, 90, 80, 45, 30, 75].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end gap-1 group cursor-pointer relative">
                   <div className="w-full bg-slate-100 rounded-t-sm hover:bg-slate-200 transition-all relative group-hover:opacity-80" style={{ height: `${h * 0.6}%` }}></div>
                   <div className="w-full bg-indigo-600 rounded-t-md hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-200" style={{ height: `${h}%` }}>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {h} Laporan
                      </div>
                   </div>
                   <span className="text-[9px] font-bold text-slate-400 text-center uppercase mt-2">
                     {['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][i]}
                   </span>
                </div>
              ))}
           </div>
        </Card>

        {/* CHART 2: Kategori Maladministrasi (List Bars) */}
        <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white p-6">
           <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <Target className="w-4 h-4 text-rose-600" /> Top Isu Maladministrasi
           </h3>
           <div className="space-y-6">
              {[
                { label: "Penundaan Berlarut", val: 88, color: "bg-rose-500" },
                { label: "Penyimpangan Prosedur", val: 64, color: "bg-amber-500" },
                { label: "Tidak Memberikan Pelayanan", val: 45, color: "bg-indigo-500" },
                { label: "Permintaan Imbalan", val: 22, color: "bg-slate-800" },
                { label: "Diskriminasi", val: 10, color: "bg-slate-400" },
              ].map((item, i) => (
                <div key={i} className="group">
                   <div className="flex justify-between items-end mb-1.5">
                      <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                        {item.label}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{item.val}%</span>
                   </div>
                   <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                   </div>
                </div>
              ))}
           </div>
           <Button variant="ghost" className="w-full mt-6 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600">
             Lihat Semua Kategori
           </Button>
        </Card>
      </div>

      {/* 4. PERFORMANCE MATRIX TABLE */}
      <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white overflow-hidden">
         <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
               <TrendingUp className="w-4 h-4 text-emerald-600" /> Performa Instansi (Response Time)
            </h3>
            <div className="flex gap-2">
               <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100">Top Performers</Badge>
               <Badge variant="outline" className="text-slate-400 border-slate-200">Bottom Performers</Badge>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-slate-50/50 border-b border-slate-50">
                  <tr>
                     <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Nama Instansi</th>
                     <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Aduan</th>
                     <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Avg. Respon</th>
                     <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Penyelesaian</th>
                     <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Trend</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {[
                    { name: "Dinas Kependudukan & Catatan Sipil", total: 142, speed: "2.4 Hari", rate: "98%", trend: "up" },
                    { name: "Badan Pertanahan Nasional (BPN)", total: 89, speed: "14.2 Hari", rate: "45%", trend: "down" },
                    { name: "Dinas Pendidikan", total: 65, speed: "5.1 Hari", rate: "82%", trend: "up" },
                    { name: "RSUD Tarakan", total: 44, speed: "1.2 Hari", rate: "95%", trend: "up" },
                    { name: "Kepolisian Daerah (Polda)", total: 38, speed: "8.5 Hari", rate: "60%", trend: "flat" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                       <td className="px-6 py-4">
                          <p className="text-[10px] font-black text-slate-700 uppercase">{row.name}</p>
                       </td>
                       <td className="px-6 py-4 text-[10px] font-bold text-slate-600">{row.total}</td>
                       <td className="px-6 py-4">
                          <span className={`text-[10px] font-black px-2 py-1 rounded ${
                             parseFloat(row.speed) > 10 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                          }`}>
                            {row.speed}
                          </span>
                       </td>
                       <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                             <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-indigo-600 rounded-full" style={{ width: row.rate }}></div>
                             </div>
                             <span className="text-[9px] font-bold text-slate-500">{row.rate}</span>
                          </div>
                       </td>
                       <td className="px-6 py-4 text-right">
                          {row.trend === 'up' && <ArrowUpRight className="w-4 h-4 text-emerald-500 ml-auto" />}
                          {row.trend === 'down' && <ArrowDownRight className="w-4 h-4 text-rose-500 ml-auto" />}
                          {row.trend === 'flat' && <span className="text-slate-300 font-bold text-lg leading-none">-</span>}
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </Card>

    </div>
  );
}