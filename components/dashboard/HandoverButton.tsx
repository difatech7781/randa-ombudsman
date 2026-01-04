// components/dashboard/HandoverButton.tsx
"use client";

import { useState } from "react";
import { executeHandoverPVLtoPL } from "@/app/dashboard/actions/handover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { ArrowRightLeft, Loader2, Send } from "lucide-react";

export function HandoverButton({ tiketId }: { tiketId: string }) {
  const [loading, setLoading] = useState(false);
  const [verifikasi, setVerifikasi] = useState("");
  const [pleno, setPleno] = useState("");

  const handleAction = async () => {
    if (!verifikasi || !pleno) {
      alert("Catatan verifikasi dan alasan pleno wajib diisi untuk akuntabilitas sistem.");
      return;
    }
    
    setLoading(true);
    const result = await executeHandoverPVLtoPL(tiketId, verifikasi, pleno);
    setLoading(false);

    if (result.success) {
      alert("Handover Berhasil! Tiket kini dalam tanggung jawab tim Pemeriksaan (PL).");
      window.location.reload();
    } else {
      alert(result.error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100">
          <ArrowRightLeft className="w-4 h-4 mr-2" /> Selesaikan & Handover
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] rounded-[32px] border-indigo-100">
        <DialogHeader>
          <DialogTitle className="text-sm font-black uppercase tracking-widest text-indigo-600">
            Form Akuntabilitas Handover
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Hasil Verifikasi Formil</label>
            <Textarea 
              placeholder="Sebutkan kelengkapan dokumen..." 
              className="text-xs rounded-xl focus:ring-indigo-500"
              onChange={(e) => setVerifikasi(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400">Hasil Keputusan Pleno</label>
            <Textarea 
              placeholder="Alasan kenaikan status ke Pemeriksaan..." 
              className="text-xs rounded-xl focus:ring-indigo-500"
              onChange={(e) => setPleno(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleAction} 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-[10px] tracking-widest h-12"
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Kirim ke Pemeriksaan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}