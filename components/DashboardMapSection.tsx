// components/DashboardMapSection.tsx

"use client"; 

import { useState } from "react";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";
import { Map as MapIcon, Filter, Info } from "lucide-react";

// Load Peta dengan ssr: false untuk kompatibilitas Next.js
const MapDashboard = dynamic(() => import("@/components/MapDashboard"), { 
  ssr: false,
  loading: () => <div className="h-[400px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 font-bold uppercase tracking-tighter">Inisialisasi Peta Geospasial...</div>
});

export default function DashboardMapSection({ initialPoints }: { initialPoints: any[] }) {
  const [filter, setFilter] = useState<string>("SEMUA");

  // LOGIC MARKER ENHANCED: Filter berdasarkan Maladministrasi sesuai SK 244/2020
  const filteredPoints = filter === "SEMUA" 
    ? initialPoints 
    : initialPoints.filter(p => p.dugaanMaladmin.includes(filter));

  // Definisi Kategori sesuai Enum Prisma
  const categories = [
    { label: "Semua", value: "SEMUA" },
    { label: "Kritis (Overdue)", value: "KRITIS_OVERDUE" },
    { label: "Pungli", value: "PERMINTAAN_IMBALAN" },
    { label: "Penundaan Berlarut", value: "PENUNDAAN_BERLARUT" },
    { label: "Penyimpangan Prosedur", value: "PENYIMPANGAN_PROSEDUR" },
    { label: "Tidak Kompeten", value: "TIDAK_KOMPETEN" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <MapIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="absolute top-0 left-0 right-0 p-6 z-[40] pointer-events-none">
            <div className="bg-white/90 backdrop-blur-sm border border-slate-100 p-4 rounded-2xl shadow-sm inline-block pointer-events-auto">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest leading-none">
                Peta Sebaran Maladministrasi
              </h3>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                Kaltara Geospatial Intelligence v2.0
              </p>
            </div>
          </div>
        </div>
        
        {/* FILTER KATEGORI: Reaktif terhadap deteksi AI */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <div className="flex items-center gap-1 text-[10px] font-black text-slate-400 mr-2 uppercase tracking-tighter">
            <Filter className="w-3 h-3" /> Filter AI:
          </div>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilter(cat.value)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-bold transition-all whitespace-nowrap border ${
                filter === cat.value 
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-100' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER PETA UTAMA */}
      <div className="relative group">
        <MapDashboard points={filteredPoints} />
        
        {/* Legend Overlay: Panduan Visual Pimpinan */}
        <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl hidden md:block">
          <p className="text-[10px] font-black uppercase text-slate-500 mb-3 flex items-center gap-2">
            <Info className="w-3 h-3" /> Legenda Risiko (AI)
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-200" /> Kritikal (Pungli/Imbalan)
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-200" /> Tinggi (Penundaan Berlarut)
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-700">
              <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-200" /> Standar (Prosedur/Lainnya)
            </div>
          </div>
        </div>
      </div>

      {/* Insight Bar */}
      <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-500 hover:bg-indigo-500 text-[9px] font-black">INFO</Badge>
          <p className="text-[10px] font-medium opacity-80 italic">
            Menampilkan {filteredPoints.length} titik sebaran maladministrasi di wilayah Kalimantan Utara.
          </p>
        </div>
        <button className="text-[9px] font-black uppercase tracking-widest hover:text-indigo-400 transition-colors">
          Lihat Analisa Wilayah &rarr;
        </button>
      </div>
    </div>
  );
}