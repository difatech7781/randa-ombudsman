// components/Sidebar.tsx
import Link from "next/link";
import { 
  LayoutDashboard, FileSearch, BarChart4, Users, Shield 
} from "lucide-react";

export default function Sidebar({ userRole }: { userRole: string }) {
  const menuItems = [
    { 
      title: "Command Center", 
      icon: <LayoutDashboard />, 
      path: "/dashboard", 
      roles: ["SUPERADMIN", "KEPALA_PERWAKILAN", "ADMIN_PERWAKILAN", "STAFF"] 
    },
    { 
      title: "Case Management", 
      icon: <FileSearch />, 
      path: "/dashboard/inbox", 
      roles: ["SUPERADMIN", "ADMIN_PERWAKILAN", "STAFF"] 
    },
    { 
      title: "Strategic Analytics", 
      icon: <BarChart4 />, 
      path: "/dashboard/analytics", 
      roles: ["SUPERADMIN", "KEPALA_PERWAKILAN", "ADMIN_PERWAKILAN"] 
    },
    { 
      title: "User Management", 
      icon: <Users />, 
      path: "/dashboard/users", 
      roles: ["SUPERADMIN", "ADMIN_PERWAKILAN"] 
    },
  ];

  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-slate-900 h-screen p-6 text-white fixed left-0 top-0">
      <div className="mb-10 px-2">
        <h2 className="text-xl font-black italic tracking-tighter uppercase">RANDA ADMIN</h2>
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Internal Control System</p>
      </div>
      <nav className="space-y-2">
        {filteredMenu.map((item) => (
          <Link href={item.path} key={item.title}>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-600 transition-all group cursor-pointer">
              <span className="text-slate-400 group-hover:text-white">{item.icon}</span>
              <span className="text-sm font-bold uppercase tracking-tighter">{item.title}</span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}