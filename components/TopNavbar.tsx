// components/TopNavbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileSearch, BarChart4, Users } from "lucide-react";

export default function TopNavbar({ userRole }: { userRole: string }) {
  const pathname = usePathname();
  
  const menuItems = [
    { title: "Command Center", icon: <LayoutDashboard className="w-4 h-4" />, path: "/dashboard", roles: ["SUPERADMIN", "KEPALA_PERWAKILAN", "ADMIN_PERWAKILAN", "STAFF"] },
    { title: "Case Management", icon: <FileSearch className="w-4 h-4" />, path: "/dashboard/inbox", roles: ["SUPERADMIN", "ADMIN_PERWAKILAN", "STAFF"] },
    { title: "Strategic Analytics", icon: <BarChart4 className="w-4 h-4" />, path: "/dashboard/analytics", roles: ["SUPERADMIN", "KEPALA_PERWAKILAN", "ADMIN_PERWAKILAN"] },
    { title: "User Management", icon: <Users className="w-4 h-4" />, path: "/dashboard/users", roles: ["SUPERADMIN", "ADMIN_PERWAKILAN"] },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <nav className="flex items-center gap-1">
      {filteredMenu.map((item) => {
        const isActive = pathname === item.path;
        return (
          <Link key={item.title} href={item.path}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all group ${
              isActive 
                ? "bg-indigo-50 text-indigo-600 shadow-sm" 
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
            </div>
          </Link>
        );
      })}
    </nav>
  );
}