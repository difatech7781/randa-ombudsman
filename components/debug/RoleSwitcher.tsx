// components/debug/RoleSwitcher.tsx
"use client";

import { useMockRole, UserRole } from "@/contexts/MockRoleContext";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  UserCog, 
  Users, 
  FileSearch, 
  BarChart3,
  X,
  Settings2
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function RoleSwitcher() {
  const { currentRole, setRole } = useMockRole();
  const [isOpen, setIsOpen] = useState(false);

  const roles: { id: UserRole; label: string; icon: any; color: string }[] = [
    { id: 'SUPERADMIN', label: 'Super Admin', icon: Shield, color: 'bg-slate-900' },
    { id: 'KEPALA_PERWAKILAN', label: 'Kepala Perwakilan', icon: UserCog, color: 'bg-indigo-600' },
    { id: 'ASISTEN_PVL', label: 'Asisten PVL (Input)', icon: Users, color: 'bg-amber-500' },
    { id: 'ASISTEN_PL', label: 'Asisten PL (Riksa)', icon: FileSearch, color: 'bg-rose-500' },
    { id: 'ASISTEN_PC', label: 'Asisten PC (Cegah)', icon: BarChart3, color: 'bg-emerald-500' },
  ];

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 bg-slate-900 text-white shadow-xl hover:bg-slate-800 border-2 border-slate-700"
        >
          <Settings2 className="w-6 h-6 animate-spin-slow" />
        </Button>
        <Badge className="absolute -top-2 -right-2 bg-red-500 text-[9px]">DEV</Badge>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 w-[280px] animate-in slide-in-from-bottom-5">
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500">Role Simulator</h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setIsOpen(false)}>
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="space-y-2">
        {roles.map((role) => (
          <button
            key={role.id}
            onClick={() => setRole(role.id)}
            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-all ${
              currentRole === role.id 
                ? 'bg-slate-100 ring-2 ring-indigo-500 ring-offset-1' 
                : 'hover:bg-slate-50'
            }`}
          >
            <div className={`p-1.5 rounded-md text-white ${role.color}`}>
              <role.icon className="w-3.5 h-3.5" />
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-wide ${
              currentRole === role.id ? 'text-slate-900' : 'text-slate-500'
            }`}>
              {role.label}
            </span>
            {currentRole === role.id && (
              <div className="ml-auto w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 pt-2 border-t border-slate-100 text-[9px] text-slate-400 text-center italic">
        *Mode Simulasi aktif. Data tidak disimpan.
      </div>
    </div>
  );
}