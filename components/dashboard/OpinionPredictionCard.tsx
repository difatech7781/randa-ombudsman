// components/dashboard/OpinionPredictionCard.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  Siren,
  ChevronRight,
  FileWarning,
  Printer
} from "lucide-react";
import { useMockRole } from "@/contexts/MockRoleContext";

// Mock Data berdasarkan Logika Juknis Penilaian 2025
const regionsData = [
  {
    id: 1,
    name: "Pemerintah Kota Tarakan",
    baseScore: 92.5, // Seharusnya Zona Hijau (Tertinggi)
    maladminCount: 0,
    recommendationIgnored: false,
    predictedZone: "green",
    predictedLabel: "Kualitas Tertinggi",
    trend: "stable"
  },
  {
    id: 2,
    name: "Pemerintah Kab. Bulungan",
    baseScore: 84.0, // Zona Hijau (Tinggi)
    maladminCount: 3, // Ada temuan Maladministrasi
    recommendationIgnored: false,
    predictedZone: "yellow", // TURUN KELAS karena Maladministrasi
    predictedLabel: "Kualitas Sedang (Potensi Maladmin)", 
    trend: "down",
    warning: "3 Laporan Terbukti Maladministrasi belum selesai."
  },
  {
    id: 3,
    name: "Pemerintah Kab. Nunukan",
    baseScore: 79.5, // Zona Kuning
    maladminCount: 5,
    recommendationIgnored: true, // FATAL: Mengabaikan Rekomendasi
    predictedZone: "red", // JATUH ke Zona Merah/Hitam
    predictedLabel: "Kualitas Terendah (Danger)",
    trend: "critical",
    warning: "Mengabaikan Rekomendasi Ombudsman (Blacklist Opini)."
  }
];

export default function OpinionPredictionCard() {
  const { canAccess, currentRole } = useMockRole();

  return (
    <Card className="rounded-[32px] border-slate-100 shadow-lg bg-white overflow-hidden relative group">
      {/* Decorative Warning Flash */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Siren className="w-32 h-32 text-rose-600" />
      </div>

      <CardHeader className="pb-2 border-b border-slate-50 bg-slate-50/30">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-[12px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Prediksi Opini Tahunan (Early Warning)
            </CardTitle>
            <p className="text-[9px] font-bold text-slate-400 mt-1">Simulasi Algoritma Perkamen 7/2025</p>
          </div>
          <Badge variant="outline" className="bg-white text-[9px] font-black uppercase text-indigo-600 border-indigo-100">
             Live Projection
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-slate-50">
          {regionsData.map((region) => (
            <div key={region.id} className="p-5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4">
              
              {/* Info Wilayah */}
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[11px] font-black text-slate-800 uppercase tracking-tight">
                    {region.name}
                  </h4>
                  {region.trend === 'critical' && (
                     <Badge className="bg-rose-600 text-white text-[8px] font-black px-1.5 py-0 rounded">CRITICAL</Badge>
                  )}
                </div>
                
                {/* ACTION AREA: Logika Akses Role */}
                {region.predictedZone === 'red' && (
                  <div className="pt-2 border-t border-rose-100 flex flex-col gap-2">
                      <span className="text-[8px] font-bold text-rose-400 uppercase tracking-widest italic">
                          *Tindakan Korektif Diperlukan
                      </span>
                      
                      {/* HANYA TAMPIL JIKA PUNYA AKSES */}
                      {canAccess('generate_surat') ? (
                        <Button 
                            size="sm" 
                            onClick={() => handleGenerateLetter(region.name)}
                            className="..."
                        >
                            <FileWarning className="w-3 h-3 shrink-0" /> Buat Surat Peringatan
                        </Button>
                      ) : (
                        // Jika tidak punya akses (misal PVL/PL), tampilkan pesan terkunci
                        <div className="p-2 bg-slate-100 rounded border border-slate-200 text-center opacity-70 cursor-not-allowed">
                          <p className="text-[9px] font-bold text-slate-400 uppercase flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3" /> Akses Terbatas: PC Only
                          </p>
                        </div>
                      )}
                  </div>
                )}

                {/* Peringatan Kontekstual */}
                {region.warning ? (
                  <p className="text-[9px] font-bold text-rose-500 flex items-center gap-1.5 bg-rose-50 w-fit px-2 py-1 rounded-md">
                    <TrendingDown className="w-3 h-3" /> {region.warning}
                  </p>
                ) : (
                  <p className="text-[9px] font-bold text-emerald-500 flex items-center gap-1.5">
                    <TrendingUp className="w-3 h-3" /> Performa stabil, pertahankan.
                  </p>
                )}
              </div>

              {/* Score & Opini */}
              <div className="text-right min-w-[120px]">
                <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full mb-1 ${
                    region.predictedZone === 'green' ? 'bg-emerald-100 text-emerald-700' :
                    region.predictedZone === 'yellow' ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {region.predictedLabel}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Proj. Score:</span>
                    <span className={`text-xl font-black ${
                       region.predictedZone === 'red' ? 'text-rose-600' : 'text-slate-900'
                    }`}>
                      {region.baseScore}
                    </span>
                  </div>
                </div>

                {/* ACTION AREA: Tombol Muncul HANYA Jika Zona Merah */}
                {region.predictedZone === 'red' && (
                  <div className="pt-2 border-t border-rose-100 flex items-center justify-between">
                      <span className="text-[8px] font-bold text-rose-400 uppercase tracking-widest italic">
                          *Tindakan Korektif Diperlukan
                      </span>
                      <Button 
                          size="sm" 
                          onClick={() => handleGenerateLetter(region.name)}
                          className="h-7 bg-rose-600 hover:bg-rose-700 text-white border border-rose-700 shadow-sm shadow-rose-200 text-[9px] font-black uppercase tracking-widest transition-all active:scale-95"
                      >
                          <FileWarning className="w-3 h-3 shrink-0" /> Buat SP
                      </Button>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
        
        {/* Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
           <Button variant="ghost" size="sm" className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 w-full">
             Lihat Detail Rapor Lengkap <ChevronRight className="w-3 h-3 ml-1" />
           </Button>
        </div>
      </CardContent>
    </Card>
  );
}