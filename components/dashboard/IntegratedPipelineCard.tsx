// components/dashboard/IntegratedPipelineCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GitCommit, 
  ArrowRight, 
  Inbox, 
  Search, 
  Scale, 
  AlertCircle 
} from "lucide-react";

export default function IntegratedPipelineCard() {
  return (
    <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-4 border-b border-slate-50">
        <div className="flex justify-between items-center">
          <CardTitle className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-indigo-600" /> Integrated Workflow Health
          </CardTitle>
          <Badge variant="secondary" className="bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase">
            System Flow
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
          
          {/* Garis Konektor Background (Desktop Only) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2"></div>

          {/* STAGE 1: PVL (INPUT) */}
          <div className="flex flex-col items-center gap-3 w-full md:w-1/3 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 transition-all group cursor-pointer relative z-10">
             <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
               <Inbox className="w-6 h-6" />
             </div>
             <div className="text-center">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Tahap 1: PVL</h4>
               <p className="text-2xl font-black text-slate-900">142</p>
               <Badge className="bg-amber-100 text-amber-700 mt-2 text-[9px] font-bold">12 Menunggu Verifikasi</Badge>
             </div>
             {/* Indikator Status */}
             <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
          </div>

          <ArrowRight className="md:hidden text-slate-300 rotate-90 md:rotate-0" />

          {/* STAGE 2: PL (PROCESS) */}
          <div className="flex flex-col items-center gap-3 w-full md:w-1/3 p-4 rounded-2xl bg-white border border-slate-100 hover:border-rose-200 transition-all group cursor-pointer relative z-10">
             <div className="p-3 bg-rose-50 text-rose-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
               <Search className="w-6 h-6" />
             </div>
             <div className="text-center">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Tahap 2: RIKSA (PL)</h4>
               <p className="text-2xl font-black text-slate-900">48</p>
               <Badge className="bg-rose-100 text-rose-700 mt-2 text-[9px] font-bold">5 Lewat SLA (Maladmin)</Badge>
             </div>
             {/* Indikator Status */}
             <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
          </div>

          <ArrowRight className="md:hidden text-slate-300 rotate-90 md:rotate-0" />

          {/* STAGE 3: PC (IMPACT/SCORING) */}
          <div className="flex flex-col items-center gap-3 w-full md:w-1/3 p-4 rounded-2xl bg-white border border-slate-100 hover:border-emerald-200 transition-all group cursor-pointer relative z-10">
             <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
               <Scale className="w-6 h-6" />
             </div>
             <div className="text-center">
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Tahap 3: PENCEGAHAN</h4>
               <p className="text-2xl font-black text-slate-900">3</p>
               <Badge className="bg-emerald-100 text-emerald-700 mt-2 text-[9px] font-bold">Instansi Turun Opini</Badge>
             </div>
             {/* Keterangan Integrasi */}
             <div className="absolute -bottom-3 text-[8px] font-bold text-slate-400 bg-white px-2">
                *Data PL mempengaruhi Skor PC
             </div>
          </div>

        </div>

        {/* System Insight Message */}
        <div className="mt-6 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
           <AlertCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
           <p className="text-[10px] text-slate-500 leading-relaxed">
             <strong className="text-slate-900">Integrasi Insight:</strong> Terdapat <span className="text-rose-600 font-bold">5 Laporan PL</span> yang terbukti Maladministrasi namun belum mempengaruhi skor di dashboard PC. Sistem menyarankan sinkronisasi data manual atau otomatisasi via menu <span className="underline decoration-indigo-300 cursor-pointer">Admin Settings</span>.
           </p>
        </div>
      </CardContent>
    </Card>
  );
}