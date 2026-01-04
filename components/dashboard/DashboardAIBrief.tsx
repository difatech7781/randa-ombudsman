// components/dashboard/DashboardAIBrief.tsx
"use client";

import { Sparkles, Megaphone, AlertTriangle, TrendingUp } from "lucide-react";

interface AIBriefProps {
  stats: {
    total: number;
    verifikasi: number;
    selesai: number;
  };
  topRegion?: {
    name: string;
    count: number;
  };
  dominantIssue?: string; // e.g., "PUNGLI"
}

export default function DashboardAIBrief({ stats, topRegion, dominantIssue = "PENUNDAAN_BERLARUT" }: AIBriefProps) {
  
  // ---------------------------------------------------------
  // 1. LOGIC PEMBUAT KALIMAT (Simulasi AI Generator)
  // ---------------------------------------------------------
  const generateSummary = () => {
    // Skenario 1: Data Kosong/Sedikit
    if (stats.total === 0) {
      return {
        highlight: "Sistem dalam kondisi stabil (Idle).",
        detail: "Belum ada laporan masuk hari ini. Tim stand-by memonitor kanal pengaduan.",
        sentiment: "neutral"
      };
    }

    // Skenario 2: Ada Lonjakan di Wilayah Tertentu
    if (topRegion && topRegion.count > 1) {
      return {
        highlight: `Perhatian: Lonjakan aktivitas di ${topRegion.name}.`,
        detail: `Terdeteksi ${topRegion.count} laporan baru yang mayoritas terkait ${dominantIssue.replace("_", " ")}. Disarankan koordinasi dengan PVL ${topRegion.name}.`,
        sentiment: "alert"
      };
    }

    // Skenario 3: Bottleneck di Verifikasi
    if (stats.verifikasi > 5) {
      return {
        highlight: "Bottleneck terdeteksi di Tahap Verifikasi Formil.",
        detail: `Terdapat ${stats.verifikasi} tiket mengantre melebihi SLA rata-rata. Segera tugaskan Asisten tambahan.`,
        sentiment: "warning"
      };
    }

    // Skenario Default
    return {
      highlight: "Tren pengaduan harian terpantau normal.",
      detail: `${stats.total} laporan aktif sedang diproses sesuai SOP. Tidak ada anomali signifikan yang memerlukan atensi khusus Kaper.`,
      sentiment: "positive"
    };
  };

  const summary = generateSummary();

  // ---------------------------------------------------------
  // 2. VISUAL RENDER
  // ---------------------------------------------------------
  return (
    <div className="mb-6 relative group">
      {/* Background Gradient "AI Feel" */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-10 group-hover:opacity-15 transition-opacity"></div>
      
      <div className="relative bg-white/60 backdrop-blur-sm border border-indigo-100 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-sm">
        
        {/* AI Avatar / Icon */}
        <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-200 shrink-0">
          <Sparkles className="w-6 h-6 text-white animate-pulse" />
        </div>

        <div className="flex-1 space-y-1">
          {/* Label Kecil */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
              <Megaphone className="w-3 h-3" /> AI Executive Brief
            </span>
            <span className="text-[9px] text-slate-400 font-medium">Generated at {new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}</span>
          </div>

          {/* Kalimat Utama (Highlight) */}
          <h3 className="text-lg font-black text-slate-800 tracking-tight leading-tight">
            {summary.highlight}
          </h3>

          {/* Kalimat Penjelas (Detail) */}
          <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-3xl">
            {summary.detail}
          </p>
        </div>

        {/* Action Button (Opsional) */}
        <div className="hidden md:block pl-6 border-l border-indigo-100">
           {summary.sentiment === 'alert' && (
             <div className="flex flex-col items-center gap-1 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase">High Risk</span>
             </div>
           )}
           {summary.sentiment === 'positive' && (
             <div className="flex flex-col items-center gap-1 text-emerald-600">
                <TrendingUp className="w-5 h-5" />
                <span className="text-[9px] font-black uppercase">On Track</span>
             </div>
           )}
        </div>

      </div>
    </div>
  );
}