// app/dashboard/settings/page.tsx
"use client";

import { 
  ShieldCheck, 
  KeyRound, 
  User, 
  Fingerprint, 
  Mail, 
  ChevronRight,
  Lock,
  EyeOff
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12 bg-white min-h-screen selection:bg-indigo-100">
      
      {/* 1. HERO HEADER: Identity & Security */}
      <div className="text-center space-y-4 pt-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-50 rounded-[32px] border border-indigo-100 shadow-inner group transition-all duration-500 hover:rotate-6">
          <User className="w-10 h-10 text-indigo-600" />
        </div>
        <div className="space-y-1">
          <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Profile & Security
          </h2>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">
            Account Governance & Credentials Management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. SIDE INFO: Account Status */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Fingerprint className="w-4 h-4 text-slate-400" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">System ID</p>
                  <p className="text-xs font-black text-slate-900 font-mono mt-1">#USR-2025-001</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Security Status</p>
                  <Badge className="mt-1 bg-emerald-50 text-emerald-600 border-none text-[8px] font-black uppercase">Verified Staf</Badge>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/50">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed italic">
                Terakhir diperbarui:<br/>
                12 Desember 2025
              </p>
            </div>
          </div>
        </div>

        {/* 3. MAIN ACTION: Password Update */}
        <div className="lg:col-span-2">
          <div className="p-10 bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 space-y-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
              <KeyRound className="w-32 h-32 text-indigo-900 rotate-12" />
            </div>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Update Credentials</h3>
            </div>

            <form className="space-y-6">
              <div className="grid gap-5">
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 group-focus-within:text-indigo-600 transition-colors">
                    Password Saat Ini
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-5 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      type="password" 
                      placeholder="••••••••" 
                      className="w-full p-5 pl-14 bg-slate-50 border border-slate-100 rounded-[24px] text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 group-focus-within:text-indigo-600 transition-colors">
                      Password Baru
                    </label>
                    <div className="relative">
                      <KeyRound className="absolute left-5 top-5 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full p-5 pl-14 bg-slate-50 border border-slate-100 rounded-[24px] text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 group-focus-within:text-indigo-600 transition-colors">
                      Konfirmasi
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-5 top-5 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        className="w-full p-5 pl-14 bg-slate-50 border border-slate-100 rounded-[24px] text-sm outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-mono" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full h-16 bg-slate-900 hover:bg-indigo-600 text-white font-black rounded-[24px] text-[11px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 active:scale-[0.98] group">
                  Update Security Credentials
                  <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-8 p-6 bg-amber-50/50 rounded-[32px] border border-amber-100/50 flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h4 className="text-[10px] font-black text-amber-900 uppercase tracking-widest italic">Keamanan Adalah Tanggung Jawab Bersama</h4>
              <p className="text-[10px] text-amber-800/70 font-medium leading-relaxed mt-1">
                Gunakan minimal 12 karakter dengan kombinasi simbol dan angka. Hindari penggunaan password yang sama dengan aplikasi pribadi Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}