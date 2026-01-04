// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, FileSearch, BarChart4, Users, LogOut, User, ShieldAlert 
} from "lucide-react";

export default function Sidebar() {
  const { currentRole: userRole } = useMockRole();
  // CONFIGURATION: Menu Items
  const menuItems = [
    { 
      title: "Command Center", 
      icon: <LayoutDashboard />, 
      path: "/dashboard", 
      // Hanya Kaper & Superadmin
      roles: ["SUPERADMIN", "KEPALA_PERWAKILAN"] 
    },
    { 
      title: "Dashboard Ops", 
      icon: <LayoutDashboard />, 
      path: "/dashboard", 
      // Asisten masuk sini
      roles: ["ASISTEN_PVL", "ASISTEN_PL", "ASISTEN_PC"] 
    },
    { 
      title: "Tiket Aduan", 
      icon: <FileSearch />, 
      // FIX 404: Arahkan ke folder 'inbox' yang sudah ada
      path: "/dashboard/inbox", 
      // Semua Asisten + Superadmin butuh akses ini
      roles: ["SUPERADMIN", "ASISTEN_PVL", "ASISTEN_PL", "ASISTEN_PC"] 
    },
    { 
      title: "Strategic Analytics", 
      icon: <BarChart4 />, 
      path: "/dashboard/analytics", 
      roles: ["SUPERADMIN", "KEPALA_PERWAKILAN"] 
    },
    { 
      title: "User Management", 
      icon: <Users />, 
      path: "/dashboard/users", 
      roles: ["SUPERADMIN"] 
    },
  ];

  // Filter menu berdasarkan Role
  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-slate-900 h-screen flex flex-col fixed left-0 top-0 border-r border-slate-800 z-50 shadow-2xl">
      
      {/* HEADER: Branding */}
      <div className="p-6 mb-2 bg-slate-900 z-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-black italic tracking-tighter uppercase text-white">RANDA</h2>
        </div>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] pl-1">Internal Control System</p>
      </div>

      {/* NAVIGATION MENU */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4 scrollbar-hide">
        {filteredMenu.map((item) => (
          <Link href={item.path} key={item.title}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-900/20 transition-all group cursor-pointer mb-1 border border-transparent hover:border-indigo-400/30">
              <span className="text-slate-400 group-hover:text-white transition-colors">{item.icon}</span>
              <span className="text-xs font-bold uppercase tracking-tight text-slate-300 group-hover:text-white transition-colors">{item.title}</span>
            </div>
          </Link>
        ))}
      </nav>

      {/* FOOTER: User Profile & Logout (FIX MISSING BUTTON) */}
      <div className="p-4 border-t border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3 mb-4 px-2 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-inner">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Logged in as</p>
            <p className="text-xs font-bold text-white truncate font-mono">{userRole}</p>
          </div>
        </div>
        
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center justify-center gap-2 p-3 bg-rose-900/20 hover:bg-rose-600 border border-rose-900/50 hover:border-rose-500 rounded-xl text-rose-200 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest group shadow-lg"
        >
          <LogOut className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> 
          Keluar Sistem
        </button>
      </div>
    </aside>
  );
}