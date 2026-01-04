// components/debug/RoleSwitcher.tsx
"use client";

import { useMockRole, UserRole } from "@/contexts/MockRoleContext";
import { 
  Shield, 
  CheckCircle2, 
  User, 
  Search, 
  TrendingDown, 
  X, 
  Plus,
  Lock,
  AlertTriangle,
  KeyRound
} from "lucide-react";
import { useState, useEffect } from "react";

export default function RoleSwitcher() {
  const { currentRole, setRole } = useMockRole();
  const [isOpen, setIsOpen] = useState(false); // Default closed biar ga ganggu
  
  // STATE UNTUK KEAMANAN
  const [isMounted, setIsMounted] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  // KUNCI RAHASIA TIM PENGEMBANG (Bisa ditaruh di .env)
  const DEV_PIN = "1234"; 

  // 1. PRODUCTION GUARD: Cek Environment
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Jika kode berjalan di PRODUCTION, return null (Hilang Total)
  if (!isMounted) return null;
  if (process.env.NODE_ENV === "production") return null;

  // ROLE CONFIGURATION
  const roles: { id: UserRole; label: string; icon: any; color: string; protected: boolean }[] = [
    { id: 'SUPERADMIN', label: 'SUPER ADMIN', icon: <Shield className="w-4 h-4" />, color: 'bg-slate-900', protected: true },
    { id: 'KEPALA_PERWAKILAN', label: 'KEPALA PERWAKILAN', icon: <User className="w-4 h-4" />, color: 'bg-indigo-600', protected: true },
    { id: 'ASISTEN_PVL', label: 'ASISTEN PVL (INPUT)', icon: <Plus className="w-4 h-4" />, color: 'bg-amber-500', protected: false },
    { id: 'ASISTEN_PL', label: 'ASISTEN PL (RIKSA)', icon: <Search className="w-4 h-4" />, color: 'bg-rose-500', protected: false },
    { id: 'ASISTEN_PC', label: 'ASISTEN PC (CEGAH)', icon: <TrendingDown className="w-4 h-4" />, color: 'bg-emerald-500', protected: false },
  ];

  // 2. AUTO-LOCK LOGIC
  const handleRoleClick = (role: typeof roles[0]) => {
    // Jika role diproteksi, minta PIN dulu
    if (role.protected) {
      setPendingRole(role.id);
      setShowAuth(true);
      setError("");
      setPin("");
    } else {
      // Jika role rendah, langsung switch
      setRole(role.id);
    }
  };

  const verifyPin = () => {
    if (pin === DEV_PIN) {
      if (pendingRole) setRole(pendingRole);
      setShowAuth(false);
      setPendingRole(null);
    } else {
      setError("PIN Invalid! Akses Ditolak.");
    }
  };

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="fixed bottom-4 right-4 bg-slate-900 text-white p-3 rounded-full shadow-2xl z-[100] hover:scale-110 transition-transform border-2 border-slate-700"
      title="Open Developer Simulator"
    >
      <Shield className="w-5 h-5" />
    </button>
  );

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 z-[100] overflow-hidden animate-in slide-in-from-bottom-4 duration-300 font-sans">
      
      {/* HEADER SIMULATOR */}
      <div className="p-4 bg-slate-900 text-white border-b border-slate-800 flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-[10px] font-black uppercase tracking-widest leading-none flex items-center gap-2">
            <Shield className="w-3 h-3 text-emerald-400" /> RANDA DevTools
          </h3>
          <p className="text-[9px] text-slate-400 mt-1 font-medium">Environment: {process.env.NODE_ENV}</p>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors relative z-10">
          <X className="w-4 h-4" />
        </button>
        {/* Background Pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-3 bg-slate-50 relative min-h-[300px]">
        
        {/* MODAL PIN (OVERLAY) */}
        {showAuth && (
          <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-200">
            <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-rose-600" />
            </div>
            <h4 className="text-sm font-black text-slate-900 uppercase">Restricted Access</h4>
            <p className="text-[10px] text-slate-500 mb-4 px-2">
              Role ini memiliki akses data sensitif. Masukkan PIN Developer.
            </p>
            
            <div className="w-full space-y-3">
              <div className="relative">
                <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input 
                  type="password" 
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN (1234)"
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl py-2 pl-9 pr-4 text-xs font-bold text-center focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && verifyPin()}
                />
              </div>
              
              {error && <p className="text-[9px] font-bold text-rose-500 animate-pulse">{error}</p>}
              
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setShowAuth(false)}
                  className="py-2 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-slate-100"
                >
                  BATAL
                </button>
                <button 
                  onClick={verifyPin}
                  className="py-2 rounded-lg bg-rose-600 text-white text-[10px] font-bold hover:bg-rose-700 shadow-lg shadow-rose-200"
                >
                  UNLOCK
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LIST ROLE */}
        <div className="space-y-2">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-2">Switch Identity To:</p>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleClick(role)}
              className={`w-full flex items-center justify-between p-2 rounded-xl transition-all group border ${
                currentRole === role.id 
                  ? "bg-white border-indigo-200 shadow-md shadow-indigo-100" 
                  : "bg-white border-transparent hover:border-slate-200 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg text-white ${role.color} shadow-sm group-hover:scale-105 transition-transform`}>
                  {role.icon}
                </div>
                <div className="text-left">
                  <span className={`block text-[10px] font-black uppercase tracking-tight ${
                    currentRole === role.id ? "text-indigo-600" : "text-slate-600"
                  }`}>
                    {role.label}
                  </span>
                  {role.protected && (
                    <span className="flex items-center gap-1 text-[8px] font-bold text-rose-500 mt-0.5">
                      <Lock className="w-2 h-2" /> High Privilege
                    </span>
                  )}
                </div>
              </div>
              {currentRole === role.id && (
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              )}
            </button>
          ))}
        </div>

        {/* FOOTER WARNING */}
        <div className="mt-4 pt-3 border-t border-slate-200 flex items-start gap-2">
          <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-[9px] text-slate-400 leading-tight">
            <span className="font-bold text-amber-600">Perhatian:</span> Perubahan role hanya simulasi UI/UX. Tidak mengubah data sesi autentikasi asli di database.
          </p>
        </div>
      </div>
    </div>
  );
}