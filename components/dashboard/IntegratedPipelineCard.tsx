// components/dashboard/IntegratedPipelineCard.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Inbox, Search, Scale, AlertCircle } from "lucide-react";
import SLACountdown from "./SLACountdown"; // IMPORT WIDGET YANG SUDAH ANDA BUAT

interface PipelineProps {
  stats: {
    pvl: number;
    pl: number; // Mapped from 'riksa'
    pc: number; // Mapped from 'cegah'
  };
}

// SIMULASI DATA RATA-RATA HARI (Untuk Memmicu Alert Merah)
// Skenario: Tahap Riksa (PL) lambat (16 hari) -> Harusnya Merah
const AVG_DAYS_MOCK = {
  pvl: 3,     // Aman (3 Hari)
  pl: 16,     // BAHAYA (>14 Hari) -> Akan Merah
  pc: 12,     // Warning (12 Hari) -> Akan Kuning
};

export default function IntegratedPipelineCard({ stats }: PipelineProps) {
  
  // Kita mapping props 'stats' ke struktur array agar lebih rapi & bisa diloop
  const stages = [
    { 
      id: "pvl", 
      label: "Tahap 1: PVL", 
      count: stats.pvl, 
      icon: <Inbox className="w-5 h-5" />,
      desc: "Menunggu Verifikasi",
      avgDays: AVG_DAYS_MOCK.pvl 
    },
    { 
      id: "pl", 
      label: "Tahap 2: Riksa (PL)", 
      count: stats.pl, 
      icon: <Search className="w-5 h-5" />,
      desc: "Proses Investigasi",
      avgDays: AVG_DAYS_MOCK.pl 
    },
    { 
      id: "pc", 
      label: "Tahap 3: Pencegahan", 
      count: stats.pc, 
      icon: <Scale className="w-5 h-5" />,
      desc: "Monitoring Opini",
      avgDays: AVG_DAYS_MOCK.pc 
    }
  ];

  return (
    <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white overflow-hidden">
      <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Workflow Health Monitor
        </h3>
        <div className="flex items-center gap-2">
           <span className="text-[9px] font-bold text-slate-400">SLA LIMIT: 14 HARI</span>
        </div>
      </div>
      
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Connector Line (Garis Background) */}
          <div className="hidden md:block absolute top-[35%] left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0"></div>

          {stages.map((stage, i) => {
            // LOGIC UTAMA: MERAH JIKA MELEBIHI 14 HARI
            const isBreach = stage.avgDays > 14;

            return (
              <div key={stage.id} className="relative z-10 group">
                <div className={`
                  relative bg-white border-2 rounded-3xl p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                  ${isBreach 
                    ? "border-rose-100 shadow-lg shadow-rose-100/50 ring-4 ring-rose-50" // MERAH MENYALA
                    : "border-slate-100 shadow-sm hover:border-indigo-200"
                  }
                `}>
                  
                  {/* STEP NUMBER */}
                  <div className={`
                    absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-4 border-white
                    ${isBreach ? "bg-rose-500 text-white animate-pulse" : "bg-slate-100 text-slate-400"}
                  `}>
                    {i + 1}
                  </div>

                  {/* ICON */}
                  <div className={`mb-3 mt-2 inline-flex p-3 rounded-2xl ${
                    isBreach ? "bg-rose-50 text-rose-600" : "bg-indigo-50 text-indigo-600"
                  }`}>
                    {stage.icon}
                  </div>
                  
                  {/* STATS UTAMA */}
                  <div className="space-y-1 mb-6">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${isBreach ? "text-rose-600" : "text-slate-400"}`}>
                      {stage.label}
                    </p>
                    <h4 className={`text-3xl font-black tracking-tighter ${isBreach ? "text-rose-600" : "text-slate-900"}`}>
                      {stage.count}
                    </h4>
                    <p className="text-[10px] font-bold text-slate-400 bg-slate-50 inline-block px-2 py-1 rounded-lg">
                      {stage.desc}
                    </p>
                  </div>

                  {/* WIDGET SLA COUNTDOWN (INILAH YANG HILANG SEBELUMNYA) */}
                  <div className="pt-4 border-t border-slate-50 flex justify-center w-full">
                    {/* Menggunakan Mode Pipeline Stats (Static) */}
                    <SLACountdown avgDays={stage.avgDays} limit={14} />
                  </div>

                </div>

                {/* Arrow Connector */}
                {i < stages.length - 1 && (
                  <div className="hidden md:flex absolute top-[35%] -right-5 -translate-y-1/2 z-20 bg-white p-1 rounded-full border border-slate-100 text-slate-300">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

        </div>

        {/* System Insight Message */}
        <div className="mt-8 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
           <AlertCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
           <p className="text-[10px] text-slate-500 leading-relaxed">
             <strong className="text-slate-900">Integrasi Insight:</strong> Simulasi SLA menunjukkan Tahap Riksa sedang <span className="text-rose-600 font-bold">BREACH (+2 Hari)</span>. Data ini disinkronkan untuk menjaga akurasi SLA SK 244/2020.
           </p>
        </div>
      </CardContent>
    </Card>
  );
}