// components/DashboardBreadcrumb.tsx
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export default function DashboardBreadcrumb() {
  const pathname = usePathname();
  
  // 1. MAPPING LOGIC: Menerjemahkan URL ke Konteks Operasional
  const routeMapping: { [key: string]: string } = {
    dashboard: "Command Center",
    inbox: "Case Management",
    users: "User Management",
    settings: "Profile & Security",
    laporan: "Detail Laporan",
    analytics: "Strategic Analytics",
    baru: "Input Manual"
  };

  // Memecah URL menjadi segmen array dan menghapus string kosong
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <nav aria-label="Breadcrumb" className="mb-4 hidden md:block animate-in fade-in slide-in-from-left-4 duration-500">
      <ol className="flex items-center gap-2">
        
        {/* HOME ICON */}
        <li>
          <Link 
            href="/dashboard" 
            className="p-1.5 bg-white text-slate-400 rounded-lg hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-slate-100 shadow-sm block"
          >
            <Home className="w-3 h-3" />
          </Link>
        </li>

        {/* DYNAMIC SEGMENTS */}
        {pathSegments.map((segment, index) => {
          // Lewati segmen 'dashboard' pertama karena sudah diwakili icon Home
          if (segment === "dashboard" && index === 0) return null;

          // Membangun URL untuk link breadcrumb
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          
          // Cek apakah segmen adalah ID (biasanya panjang & acak/angka)
          const isId = segment.length > 20 || !isNaN(Number(segment));
          
          // Nama Tampilan: Gunakan mapping atau format ID jika tidak ada di map
          const displayName = routeMapping[segment] || (isId ? `#${segment.substring(0, 8)}...` : segment);

          // Cek apakah ini segmen terakhir (Halaman Aktif)
          const isLast = index === pathSegments.length - 1;

          return (
            <li key={href} className="flex items-center gap-2">
              <ChevronRight className="w-3 h-3 text-slate-300" />
              {isLast ? (
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                  {displayName}
                </span>
              ) : (
                <Link 
                  href={href}
                  className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-800 transition-colors"
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}