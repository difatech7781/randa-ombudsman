// components/TopNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileSearch, 
  BarChart4, 
  Users, 
  Search, 
  Bell 
} from "lucide-react";
import { useMockRole } from "@/contexts/MockRoleContext"; 
import { UserNav } from "@/components/UserNav"; 
import { Button } from "@/components/ui/button";

// 1. DEFINISI INTERFACE (PENTING)
interface TopNavbarProps {
  pvlCount?: number; // Tanda tanya (?) artinya opsional, biar ga error kalau undefined
}

// 2. TANGKAP PROPS DI SINI (JANGAN KOSONG!)
export default function TopNavbar({ pvlCount = 0 }: TopNavbarProps) {
  const { currentRole: userRole } = useMockRole(); 
  const pathname = usePathname();
  
  const menuItems = [
    { 
      title: "Command Center", 
      icon: <LayoutDashboard className="w-4 h-4" />, 
      path: "/dashboard", 
      roles: ["SUPERADMIN", "KEPALA_PERWAKILAN"] 
    },
    { 
      title: "Ops Dashboard", 
      icon: <LayoutDashboard className="w-4 h-4" />, 
      path: "/dashboard", 
      roles: ["ASISTEN_PVL", "ASISTEN_PL", "ASISTEN_PC"] 
    },
    { 
      title: "Tiket Aduan", 
      icon: <FileSearch className="w-4 h-4" />, 
      path: "/dashboard/inbox", 
      roles: ["SUPERADMIN", "ASISTEN_PVL", "ASISTEN_PL", "ASISTEN_PC"],
      hasBadge: true 
    },
    { 
      title: "Analytics", 
      icon: <BarChart4 className="w-4 h-4" />, 
      path: "/dashboard/analytics", 
      roles: ["SUPERADMIN", "KEPALA_PERWAKILAN"] 
    },
    { 
      title: "Users", 
      icon: <Users className="w-4 h-4" />, 
      path: "/dashboard/users", 
      roles: ["SUPERADMIN"] 
    },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
            <span className="text-white font-black text-xs italic">R</span>
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic hidden sm:block">Randa</span>
        </div>

        <nav className="flex items-center gap-1">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== "/dashboard");
            
            return (
              <Link key={item.title} href={item.path}>
                {/* CLASS 'relative' DI SINI PENTING AGAR BADGE MENEMPEL DI MENU INI */}
                <div className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all group ${
                  isActive 
                    ? "bg-indigo-50 text-indigo-600 shadow-sm ring-1 ring-indigo-100" 
                    : "text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                }`}>
                  <span className={`${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}>
                    {item.icon}
                  </span>
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                    isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-900"
                  }`}>
                    {item.title}
                  </span>

                  {/* 3. LOGIC RENDER BADGE */}
                  {item.hasBadge && pvlCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in">
                      {pvlCount > 99 ? '99+' : pvlCount}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex relative items-center">
          <Search className="absolute left-3 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Cari ID Tiket..." 
            className="bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs font-bold text-slate-600 w-48 focus:w-64 transition-all outline-none focus:ring-2 focus:ring-indigo-100" 
          />
        </div>

        <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
          <Bell className="w-5 h-5" />
          {/* Badge Lonceng juga hidup kalau ada tiket */}
          {pvlCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
          )}
        </Button>

        <div className="pl-4 border-l border-slate-200">
          <UserNav />
        </div>
      </div>
    </header>
  );
}