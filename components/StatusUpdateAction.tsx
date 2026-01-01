"use client";

import { useState } from "react";
import { updateStatusTiket } from "@/app/dashboard/laporan/actions";
import { Button } from "@/components/ui/button";
import { ArrowRightCircle, Loader2 } from "lucide-react";

export default function StatusUpdateAction({ ticketId }: { ticketId: string }) {
  const [showNote, setShowNote] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!showNote) {
    return (
      <Button 
        onClick={() => setShowNote(true)}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-100 transition-all active:scale-95"
      >
        <ArrowRightCircle className="w-4 h-4" /> Teruskan ke Pleno
      </Button>
    );
  }

  return (
    <form action={async (formData) => {
      setLoading(true);
      try {
        await updateStatusTiket(formData);
        setShowNote(false);
      } catch (error) {
        console.error("Gagal update status:", error);
      } finally {
        setLoading(false);
      }
    }} className="flex flex-col gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-200 animate-in fade-in slide-in-from-top-2 w-full max-w-md">
      <input type="hidden" name="ticketId" value={ticketId} />
      <input type="hidden" name="status" value="MENUNGGU_PLENO" />
      
      <div className="space-y-1">
        <label className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
          Catatan Verifikasi / Alasan Pleno
        </label>
        <textarea 
          name="catatan" 
          required 
          placeholder="Tuliskan alasan mengapa laporan ini layak diteruskan ke Pleno (Sesuai UU 37/2008)..."
          className="w-full text-sm p-3 rounded-lg border border-indigo-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px] resize-none shadow-inner"
        />
      </div>
      
      <div className="flex gap-2">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1 font-bold shadow-sm"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Memproses...</>
          ) : (
            "Konfirmasi & Kirim"
          )}
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          onClick={() => setShowNote(false)}
          className="text-slate-500 font-bold hover:bg-slate-100"
        >
          Batal
        </Button>
      </div>
    </form>
  );
}