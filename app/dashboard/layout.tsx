// app/dashboard/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import TopNavbar from "@/components/TopNavbar"; // Komponen navigasi baru
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";
import { Bell, Search, UserCircle, ShieldCheck } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col">
      {/* HEADER UTAMA DENGAN NAVIGASI */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-8 h-20 flex items-center justify-between gap-8">
          
          {/* 1. BRANDING */}
          <div className="flex items-center gap-3 min-w-fit">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-100">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">RANDA</h1>
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 text-center">OMBUDSMAN</p>
            </div>
          </div>

          {/* 2. TOP MENU NAVIGATION (Pengganti Sidebar) */}
          <TopNavbar userRole={session.user?.role || "STAFF"} />

          {/* 3. SEARCH & PROFILE */}
          <div className="flex items-center gap-6 ml-auto">
            <div className="hidden lg:flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari ID Tiket..." 
                className="bg-transparent border-none outline-none text-xs font-bold text-slate-600 placeholder:text-slate-400 w-40"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                <UserCircle className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT: Menghapus pl-64 agar konten mengisi penuh */}
      <main className="flex-1 p-8 max-w-[1600px] w-full mx-auto">
        <DashboardBreadcrumb />
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}