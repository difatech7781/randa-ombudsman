// app/dashboard/profile/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useMockRole } from "@/contexts/MockRoleContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Mail, User, ShieldAlert, Key, Lock, Fingerprint, Activity } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { currentRole, isSimulated, setRole } = useMockRole();
  const user = session?.user;

  // Generate inisial
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().substring(0, 2)
    : "U";

  // Mapping permission berdasarkan role (Visualisasi Matrix)
  const getPermissions = (role: string) => {
    switch (role) {
      case 'SUPERADMIN': return ['Full Access', 'User Management', 'System Config', 'Audit Logs'];
      case 'KEPALA_PERWAKILAN': return ['View Dashboard', 'Approve LHP', 'Strategic Analytics', 'Staff Monitoring'];
      case 'ASISTEN_PVL': return ['Input Laporan', 'Verifikasi Formil', 'Cetak Tanda Terima'];
      case 'ASISTEN_PL': return ['Pemeriksaan Lapangan', 'BAP Digital', 'Draft LHP', 'Mediasi'];
      case 'ASISTEN_PC': return ['Analisa Pencegahan', 'Scoring Instansi', 'Generate Opini'];
      default: return ['No Access'];
    }
  };

  return (
    <div className="space-y-8 p-8 bg-[#fcfcfd] min-h-screen max-w-5xl mx-auto">
      
      {/* 1. HEADER */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tightest uppercase italic">
            User Profile
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-1">
            Identity & Security Context
          </p>
        </div>
        {isSimulated && (
          <Badge variant="destructive" className="bg-amber-100 text-amber-700 border-amber-200 animate-pulse px-4 py-2">
            <ShieldAlert className="w-4 h-4 mr-2" />
            MODE SIMULASI AKTIF
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. PROFILE CARD (KIRI) */}
        <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white overflow-hidden h-fit">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
             <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                  <AvatarImage src={user?.image || ""} />
                  <AvatarFallback className={`${isSimulated ? 'bg-amber-500' : 'bg-indigo-600'} text-white text-2xl font-black`}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
             </div>
          </div>
          <CardContent className="pt-14 pb-8 text-center px-6">
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{user?.name || "User RANDA"}</h2>
             <div className="flex items-center justify-center gap-2 mt-1 text-slate-500 text-xs font-medium">
                <Mail className="w-3 h-3" /> {user?.email}
             </div>

             <div className="mt-6 flex justify-center">
               <Badge className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest ${
                 isSimulated 
                   ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                   : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
               }`}>
                 {isSimulated ? `Simulated Role: ${currentRole.replace('_', ' ')}` : currentRole.replace('_', ' ')}
               </Badge>
             </div>

             {isSimulated && (
               <div className="mt-6">
                 <Button 
                   onClick={() => setRole(session?.user?.role as any || 'SUPERADMIN')} 
                   variant="outline" 
                   className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold uppercase tracking-widest"
                 >
                   <LogOutIcon className="w-3 h-3 mr-2" /> Reset ke Role Asli
                 </Button>
               </div>
             )}
          </CardContent>
        </Card>

        {/* 3. SECURITY CONTEXT (KANAN) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Permission Matrix */}
          <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-900">
                <Key className="w-4 h-4 text-indigo-600" /> Matriks Kewenangan (RBAC)
              </CardTitle>
              <CardDescription className="text-xs">
                Hak akses fitur berdasarkan role yang sedang aktif.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getPermissions(currentRole).map((perm, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Lock className="w-3 h-3 text-emerald-500" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{perm}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Audit Trail Preview */}
          <Card className="rounded-[32px] border-slate-100 shadow-sm bg-white">
             <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-slate-900">
                <Activity className="w-4 h-4 text-indigo-600" /> Aktivitas Sesi Ini
              </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                 <div className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Login Berhasil</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{new Date().toLocaleDateString()} - via Credentials</p>
                    </div>
                 </div>
                 {isSimulated && (
                   <div className="flex items-start gap-4 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                      <div className="mt-1">
                        <div className="w-2 h-2 rounded-full bg-amber-500 ring-4 ring-amber-100"></div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">Simulasi Role Diaktifkan</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Switch to: <span className="font-bold text-amber-600">{currentRole}</span></p>
                      </div>
                   </div>
                 )}
               </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}

function LogOutIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" x2="9" y1="12" y2="12"/>
    </svg>
  )
}