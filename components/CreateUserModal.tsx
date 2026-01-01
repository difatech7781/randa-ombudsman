// components/CreateUserModal.tsx
"use client";

import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  UserPlus, 
  ShieldCheck, 
  Mail, 
  User, 
  Lock, 
  Loader2,
  ChevronRight
} from "lucide-react";

export default function CreateUserModal() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Logic: Integrasi dengan server action pendaftaran user
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
      alert("Staf Baru Berhasil Didaftarkan ke Sistem RANDA.");
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 font-black uppercase text-[10px] tracking-widest transition-all active:scale-95">
          <UserPlus className="w-4 h-4 mr-2" /> Daftarkan Staf Baru
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[480px] rounded-[40px] border-none p-10 shadow-2xl">
        <DialogHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="bg-indigo-50 p-4 rounded-3xl border border-indigo-100">
              <ShieldCheck className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            Registrasi Personel
          </DialogTitle>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em]">
            Penambahan Akses Internal Keasistenan
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div className="space-y-4">
            {/* Input Nama Lengkap */}
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 group-focus-within:text-indigo-600 transition-colors">Nama Lengkap</label>
              <div className="relative">
                <User className="absolute left-5 top-4 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Contoh: Andi Wijaya" 
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* Input Email Resmi */}
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 group-focus-within:text-indigo-600 transition-colors">Email @ombudsman.go.id</label>
              <div className="relative">
                <Mail className="absolute left-5 top-4 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="email" 
                  placeholder="andi@ombudsman.go.id" 
                  className="w-full p-4 pl-12 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium font-mono text-[11px]"
                  required
                />
              </div>
            </div>

            {/* Select Role Keasistenan */}
            <div className="space-y-1.5 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Hak Akses Keasistenan</label>
              <select className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer">
                <option value="STAFF">Asisten PVL</option>
                <option value="ADMIN_PERWAKILAN">Admin Perwakilan</option>
                <option value="KEPALA_PERWAKILAN">Kepala Perwakilan</option>
              </select>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 active:scale-[0.98] group"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Daftarkan Personel
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest text-center leading-relaxed italic">
              Password default akan digenerate otomatis dan dikirim melalui email sistem DifaTech.
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}