// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Pastikan path ini benar
import { 
  ShieldCheck, 
  Zap, 
  MessageSquare, 
  Search, 
  Lock, 
  Fingerprint, 
  BarChart3, 
  Lightbulb, // Mengganti Zap lama dengan Lightbulb untuk AI Triage
  CheckCircle2,
  Phone, // Untuk tombol WHATSAPP
  User, // Untuk Internal Staff
  Key // Untuk Internal Staff
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 1. NAVIGASI BAR: Clean & Professional */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-100 bg-white/90 backdrop-blur-xl z-50">
        <div className="flex items-center gap-2">
          {/* Logo RANDA */}
          <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-100">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tighter italic text-slate-900 leading-none block">RANDA</span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Ombudsman Kaltara</span>
          </div>
        </div>
        {/* Internal Staff Login */}
        <Link href="/login">
          <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-indigo-600 flex items-center gap-2">
            <Lock className="w-3 h-3" /> Internal Staff Only
          </Button>
        </Link>
      </nav>

      <main className="flex-1">
        {/* 2. HERO SECTION: Powerful & Informative */}
        <section className="relative overflow-hidden pt-16 pb-20 md:pb-32 lg:pb-40 bg-gradient-to-br from-indigo-800 to-slate-900 text-white">
          {/* Background Grid Pattern - Sesuai Gambar */}
          <div className="absolute inset-0 z-0 opacity-10">
            <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="32" height="32" x="0" y="0" patternUnits="userSpaceOnUse">
                  <path d="M0 16L16 0H32L16 32z M16 0L0 16H16L32 0z" strokeWidth="0.5" stroke="#4a4d61" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-800/10 via-transparent to-indigo-800/10 z-0"></div>


          <div className="max-w-7xl mx-auto px-8 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50/20 border border-indigo-400 text-indigo-200">
                <Zap className="w-3 h-3 fill-indigo-200" />
                <span className="text-[9px] font-black uppercase tracking-widest">AI-POWERED PUBLIC SERVICE</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-tight italic">
                AWASI PELAYANAN PUBLIK DI<br/>
                <span className="text-indigo-400">KALIMANTAN UTARA DENGAN RANDA AI.</span>
              </h1>
              <p className="text-sm md:text-base text-indigo-200 max-w-md mx-auto lg:mx-0 leading-relaxed font-medium">
                Serempak kampanye, dering ninot, benasanaii renotlgrilang neng bubitri alsihpan dendam tisikan asigitan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="https://wa.me/6281234567890?text=Halo%20Ombudsman%20Kaltara%2C%20saya%20ingin%20melaporkan%20dugaan%20maladministrasi..." target="_blank" className="w-full sm:w-auto">
                  <Button className="w-full h-14 px-8 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/30 text-base transition-all active:scale-95 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> LAPOR VIA WHATSAPP
                  </Button>
                </a>
                <div className="relative w-full sm:w-auto">
                  <input 
                    type="text" 
                    placeholder="ID Tiket Anda" 
                    className="w-full h-14 pl-4 pr-12 rounded-xl border border-indigo-400/50 bg-indigo-700/50 text-white placeholder-indigo-300 focus:ring-2 focus:ring-indigo-400 outline-none transition-all font-mono text-sm font-bold"
                  />
                  <button className="absolute right-2 top-2 h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white hover:bg-indigo-700">
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Image/Mockup - Sesuai Gambar */}
            <div className="relative mt-12 lg:mt-0 flex justify-center lg:justify-end animate-in fade-in zoom-in delay-300 duration-700">
              <img 
                src="https://via.placeholder.com/600x400/1e293b/a5b4fc?text=RANDA+Dashboard+Overview" 
                alt="RANDA Dashboard Overview" 
                className="w-full max-w-lg lg:max-w-none h-auto rounded-xl shadow-2xl border border-slate-700 transform hover:scale-105 transition-transform duration-300" 
              />
            </div>
          </div>
        </section>

        {/* 3. FEATURE CARDS: AI Tech & Transparency */}
        <section className="bg-slate-50 py-20 px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
              <div className="bg-emerald-500 p-4 rounded-full mb-4 shadow-md">
                <Fingerprint className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">VERIFIKASI IDENTITAS AI</h3>
              <p className="text-sm text-slate-600">Scan KTP otomatis, cegah laporan fiktif.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
              <div className="bg-blue-500 p-4 rounded-full mb-4 shadow-md">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">GEO-ANALYTICS & SLA MONITORING</h3>
              <p className="text-sm text-slate-600">Pantau sebaran maladministrasi dan laporan fiktif.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
              <div className="bg-amber-500 p-4 rounded-full mb-4 shadow-md">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">AI TRIAGE & ENHANCEMENT</h3>
              <p className="text-sm text-slate-600">Klasifikasi otomatis, perbaikan kualitas foto KTP.</p>
            </div>
          </div>
        </section>

        {/* 4. SECURITY & CREDIBILITY SECTION */}
        <section className="bg-indigo-700 py-20 px-8 text-white">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center md:text-left">
              <h2 className="text-4xl font-black tracking-tighter italic leading-tight">
                DATA ANDA AMAN. <br/> DIAWASI OLEH NEGARA.
              </h2>
              <p className="text-indigo-200 text-sm max-w-md mx-auto md:mx-0">
                Peliharakan sisa tegau.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2">
                  <Lock className="w-4 h-4" /> ENKRIPSI END-END
                </Button>
                <Button variant="outline" className="border-indigo-400 text-indigo-100 hover:bg-indigo-600 hover:text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> SERVER LOKAL
                </Button>
              </div>
            </div>

            {/* Right Stats */}
            <div className="grid grid-cols-2 gap-8 text-center md:text-right">
              <div>
                <p className="text-5xl font-black italic text-indigo-300">98.5%</p>
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Enkripsi Data</p>
              </div>
              <div>
                <p className="text-5xl font-black italic text-indigo-300">2,543+</p>
                <p className="text-sm font-bold uppercase tracking-widest text-indigo-200">Laporan Terproses</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="px-8 py-10 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-2 opacity-70">
            <ShieldCheck className="w-4 h-4 text-slate-900" />
            <span className="text-sm font-black tracking-tighter italic text-slate-900">RANDA</span>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
            &copy; 2025 Ombudsman RI Perwakilan Kalimantan Utara. Developed by <a href="https://difatech.com" target="_blank" className="text-indigo-600 hover:underline">DifaTech</a>
          </p>
          {/* Footer Links */}
          <div className="flex gap-8">
            <Link href="/privacy" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600">Kebijakan Privasi</Link>
            <Link href="/terms" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600">Panduan SOP</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}