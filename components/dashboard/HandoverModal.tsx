// components/dashboard/HandoverModal.tsx
"use client";

import { useState } from "react";
import { executeHandoverPVLtoPL } from "@/app/dashboard/actions/handover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCcw, Send } from "lucide-react";

export function HandoverModal({ tiketId }: { tiketId: string }) {
  const [catatan, setCatatan] = useState("");
  const [pleno, setPleno] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    if (!catatan || !pleno) return alert("Semua catatan wajib diisi untuk akuntabilitas!");
    
    setLoading(true);
    const res = await executeHandoverPVLtoPL(tiketId, catatan, pleno);
    setLoading(false);

    if (res.success) {
      alert("Handover Berhasil! Tiket kini di tangan Asisten PL.");
      window.location.reload();
    }
  };

  return (
    <div className="p-6 bg-white border-2 border-indigo-100 rounded-[24px] space-y-4 shadow-xl">
      <h3 className="text-[11px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
        <RefreshCcw className="w-4 h-4" /> Form Handover ke Pemeriksaan (PL)
      </h3>
      
      <div className="space-y-2">
        <label className="text-[9px] font-bold uppercase text-slate-500">Catatan Verifikasi Formil</label>
        <Textarea 
          placeholder="Contoh: Dokumen KTP & Uraian sudah lengkap..." 
          className="text-xs rounded-xl border-slate-100"
          onChange={(e) => setCatatan(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-[9px] font-bold uppercase text-slate-500">Hasil Keputusan Pleno</label>
        <Textarea 
          placeholder="Contoh: Disetujui naik ke tahap pemeriksaan materiil..." 
          className="text-xs rounded-xl border-slate-100"
          onChange={(e) => setPleno(e.target.value)}
        />
      </div>

      <Button 
        onClick={handleAction} 
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black uppercase text-[10px] tracking-widest h-12"
      >
        {loading ? "Memproses..." : "Kirim ke Pemeriksaan (PL)"} <Send className="ml-2 w-4 h-4" />
      </Button>
    </div>
  );
}