// app/dashboard/laporan/[id]/page.tsx

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  ChevronLeft, 
  MessageSquare, 
  ShieldCheck, 
  History,
  Timer,
  FileText,
  Eye,
  Download,
  AlertCircle, 
  BrainCircuit,
  Fingerprint,
  UserCheck,
  AlertTriangle
} from "lucide-react";
import TimelineAudit from "@/components/TimelineAudit"; 
import StatusUpdateAction from "@/components/StatusUpdateAction"; 
import { Badge } from "@/components/ui/badge";
import SLACountdown from "@/components/SLACountdown";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function DetailLaporanPage(props: PageProps) {
  const params = await props.params;
  const ticketId = params.id;

  // STEP 1: Fetch data lengkap termasuk field OCR hasil Vision AP
  const ticket = await prisma.tiketAduan.findUnique({
    where: { id: ticketId },
    include: { 
      pelapor: {
        include: {
          _count: {
            select: { tikets: true }
          }
        }
      },
      riwayatChat: { orderBy: { createdAt: 'asc' } },
      riwayatStatus: { orderBy: { createdAt: 'desc' } },
      lampiran: true, 

      nikTerdeteksi: true,
      namaKtpTerdeteksi: true,
      isIdentityMatch: true,
    },
  });

  if (!ticket) return notFound();

  // MESIN ANALITIK LOKAL: Hitung durasi verifikasi
  const durasiVerifikasi = ticket.riwayatStatus.length > 1 
    ? Math.floor((new Date().getTime() - new Date(ticket.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen font-sans">
      
      {/* ACTION BAR: NAVIGASI & STATUS CHANGE */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="space-y-1">
          <Link href="/dashboard/inbox" className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1 uppercase tracking-widest transition-colors">
            <ChevronLeft className="w-4 h-4" /> Kembali ke Inbox
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter italic">TIKET #{ticket.id}</h1>
            <Badge className="bg-indigo-50 text-indigo-700 border-indigo-100 font-bold uppercase text-[10px] px-3 py-1">
              {ticket.status.replace("_", " ")}
            </Badge>
          </div>
        </div>
        <StatusUpdateAction ticketId={ticket.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* KOLOM KIRI: SUBSTANSI & LAMPIRAN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* SUNTIKAN STRATEGIS: VERIFICATION SHIELD UI (AI vs HUMAN DATA) DIGITAL INTEGRITY CHECK*/}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tighter flex items-center gap-2">
                <Fingerprint className="w-4 h-4 text-indigo-600" /> Auto-Verification Shield (AI)
              </h2>
              <div className="flex gap-2">
                {/* SUNTIKAN: AI ENHANCEMENT INDICATOR */}
                {/* @ts-ignore */}
                {ticket.isEnhanced && (
                  <Badge className="bg-indigo-50 text-indigo-700 border-indigo-200 text-[9px] font-black uppercase">
                    <BrainCircuit className="w-3 h-3 mr-1" /> AI Enhanced
                  </Badge>
                )}

                {/* Indikator Manipulasi Digital */}
                {/* @ts-ignore */}
                {ticket.isEdited && (
                  <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-[9px] font-black uppercase">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Edited Metadata Detected
                  </Badge>
                )}
                {/* @ts-ignore - ticket.isIdentityMatch dari schema terbaru */}
                {ticket.isIdentityMatch ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[9px] font-black uppercase">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Identity Match
                  </Badge>
                ) : (
                  <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[9px] font-black uppercase animate-pulse">
                    <ShieldAlert className="w-3 h-3 mr-1" /> Data Mismatch
                  </Badge>
                )}
              </div>
            </div>
            
              {/* ALERTA TAMBAHAN UNTUK MANIPULASI */}
              {/* @ts-ignore */}
              {ticket.isEdited && (
                <div className="mt-4 p-3 bg-orange-50 border border-orange-100 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-[11px] font-bold text-orange-800 uppercase">Peringatan Integritas Dokumen</p>
                    <p className="text-[10px] text-orange-700">
                      Metadata foto menunjukkan jejak penggunaan software: <span className="font-black italic">{ticket.softwareUsed}</span>. 
                      Harap verifikasi keaslian dokumen fisik KTP.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* HASIL EKSTRAKSI GOOGLE VISION */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative">
                <div className="absolute top-2 right-2 opacity-10">
                  <BrainCircuit className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Mata RANDA (OCR)</p>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">NIK Terdeteksi</p>
                  <p className="font-mono text-xs font-bold text-slate-700">
                    {/* @ts-ignore */}
                    {ticket.nikTerdeteksi || "--- Gagal Membaca NIK ---"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Nama Terdeteksi</p>
                  <p className="font-bold text-xs text-slate-900 uppercase">
                    {/* @ts-ignore */}
                    {ticket.namaKtpTerdeteksi || "--- Gagal Membaca Nama ---"}
                  </p>
                </div>
              </div>

              {/* DATA REGISTRASI PELAPOR */}
              <div className="p-4 bg-indigo-50/30 rounded-xl border border-indigo-100 space-y-3">
                <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">Input Pelapor</p>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">NIK Terdaftar</p>
                  <p className="font-mono text-xs font-bold text-slate-700 italic">
                    {ticket.pelapor.nik || "N/A (Cek Manual)"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Nama Terdaftar</p>
                  <p className="font-bold text-xs text-slate-900 uppercase">
                    {ticket.pelapor.namaLengkap}
                  </p>
                </div>
              </div>
            </div>

            {/* STATUS ACTION BOX */}
            {/* @ts-ignore */}
            <div className={`mt-4 p-3 rounded-lg border flex items-start gap-3 ${ticket.isIdentityMatch ? 'bg-emerald-50/50 border-emerald-100' : 'bg-amber-50/50 border-amber-100'}`}>
              {/* @ts-ignore */}
              {ticket.isIdentityMatch ? <UserCheck className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
              <div className="space-y-1">
                <p className="text-[11px] font-bold text-slate-800">
                  {/* @ts-ignore */}
                  {ticket.isIdentityMatch ? "Identitas Terverifikasi AI." : "Peringatan: Potensi Ketidakcocokan Identitas."}
                </p>
                <p className="text-[9px] text-slate-500 leading-tight">
                  {/* @ts-ignore */}
                  {ticket.isIdentityMatch ? "Kesesuaian data KTP dan database mencapai ambang batas aman. Lanjutkan ke Pemeriksaan Materiil." : "Ditemukan perbedaan antara dokumen fisik dan profil WhatsApp. Harap hubungi pelapor untuk klarifikasi NIK/Nama."}
                </p>
              </div>
            </div>
          </div>

          {/* CARD IDENTITAS ASLI PELAPOR (Verbatim) */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Profil Pelapor</h2>
                {ticket.pelapor._count.tikets > 1 && (
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Pelapor Berulang ({ticket.pelapor._count.tikets} Laporan)
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</p>
                <p className="text-base font-bold text-slate-900">{ticket.pelapor.namaLengkap}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor WhatsApp</p>
                <p className="text-base font-bold text-indigo-600 underline decoration-indigo-200 underline-offset-4">
                  {ticket.pelapor.noWhatsapp}
                </p>
              </div>
            </div>
          </div>

          {/* ANALYTICS CARD: SPEEDOMETER MIKRO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* SUNTIKAN: SLA REAL-TIME COUNTDOWN */}
            <SLACountdown deadline={ticket.deadlineFormil} />
            
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-lg">
                <Timer className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Durasi Berjalan</p>
                <p className="text-lg font-bold text-slate-900">{durasiVerifikasi} Hari <span className="text-xs font-medium text-slate-500">/ 14 Hari SLA</span></p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
              <div className="p-3 bg-indigo-50 rounded-lg">
                <ShieldCheck className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase">Tingkat Kepatuhan</p>
                <p className="text-lg font-bold text-slate-900">{durasiVerifikasi > 14 ? "OVERDUE" : "ON TRACK"}</p>
              </div>
            </div>
          </div>

          {/* SUNTIKAN STRATEGIS: SECTION ANALISA AI RANDA (TRIAGE ENGINE v2.0) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100 relative overflow-hidden">
            {/* Dekorasi Background AI */}
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <BrainCircuit className="w-20 h-20 text-indigo-600" />
            </div>

            <h2 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2 tracking-tight italic">
              🤖 Analisa AI RANDA <Badge variant="outline" className="text-[9px] border-indigo-200 text-indigo-500 font-black">AI TRIAGE ACTIVE</Badge>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Klasifikasi Otomatis Maladministrasi */}
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <p className="text-[10px] text-indigo-500 uppercase font-black tracking-widest flex items-center gap-1">
                  Dugaan Maladmin (AI Detection)
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {/* @ts-ignore - Mengasumsikan dugaanMaladmin ada di schema */}
                  {ticket.dugaanMaladmin && ticket.dugaanMaladmin.length > 0 ? (
                    ticket.dugaanMaladmin.map((m: string) => (
                      <Badge key={m} className="bg-white text-indigo-700 border-indigo-100 text-[9px] font-bold shadow-sm">
                        {m.replace("_", " ")}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400 italic">Menganalisa teks...</span>
                  )}
                </div>
              </div>

              {/* 2. Deteksi Instansi/Objek Terlapor */}
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                <p className="text-[10px] text-indigo-500 uppercase font-black tracking-widest flex items-center gap-1">
                  Objek Terlapor (AI Inference)
                </p>
                <p className="font-bold text-indigo-900 mt-1 capitalize text-sm">
                  {/* @ts-ignore */}
                  {ticket.instansiTerdeteksi || "Mengekstrak entitas..."}
                </p>
              </div>
            </div>

            {/* Note untuk Staf: Human-in-the-loop */}
            <div className="mt-4 p-3 bg-amber-50/50 rounded-lg border border-amber-100 flex gap-2 items-start">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-700 italic leading-relaxed">
                Hasil triage otomatis ini hanya merupakan **Saran Klasifikasi**. Staf PVL wajib memverifikasi kesesuaian dengan substansi laporan sebelum dibawa ke Rapat Pleno.
              </p>
            </div>
          </div>

          {/* SUNTIKAN: SECTION DOKUMEN LAMPIRAN (VERIFIKASI FORMIL) */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 tracking-tight">
              <FileText className="w-5 h-5 text-indigo-600" /> Dokumen Lampiran (Syarat Formil)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ticket.lampiran && ticket.lampiran.length > 0 ? (
                ticket.lampiran.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 group hover:border-indigo-300 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <FileText className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">{file.nama}</p>
                        <p className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter">{file.tipe}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-indigo-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </a>
                      <a href={file.fileUrl} download className="p-2 hover:bg-white rounded-full text-slate-400 hover:text-emerald-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-2 py-10 text-center border-2 border-dashed border-slate-100 rounded-2xl text-slate-400 italic text-sm">
                  Belum ada dokumen yang diunggah.
                </div>
              )}
            </div>
          </div>

          {/* KRONOLOGI LAPORAN */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4 tracking-tight italic uppercase">📝 Kronologi Laporan</h2>
            <div className="p-6 bg-slate-50 rounded-xl text-slate-700 italic border-l-4 border-indigo-500 leading-relaxed text-sm">
              "{ticket.kronologi}"
            </div>
          </div>

          {/* TIMELINE AUDIT */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 tracking-tight">
              <History className="w-5 h-5 text-indigo-600" /> Timeline Audit Laporan
            </h2>
            <TimelineAudit riwayat={ticket.riwayatStatus} />
          </div>
        </div>

        {/* KOLOM KANAN: IDENTITAS & KOMUNIKASI */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 tracking-tight">👤 Identitas Pelapor</h2>
              {ticket.pelapor._count.tikets > 1 && (
                <div className="bg-rose-50 text-rose-600 border border-rose-100 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <History className="w-3 h-3" /> Pelapor Berulang
                </div>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nama Lengkap</p>
                <p className="text-base font-bold text-slate-900">{ticket.pelapor.namaLengkap}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nomor WhatsApp</p>
                <p className="text-base font-bold text-indigo-600 underline decoration-indigo-200 underline-offset-4 cursor-pointer">
                  {ticket.pelapor.noWhatsapp}
                </p>
              </div>
            </div>
          </div>

          {/* KOMUNIKASI LAPORAN (CHAT) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[600px] overflow-hidden sticky top-8">
            <div className="p-6 border-b border-slate-100 bg-white z-10">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 tracking-tight">
                <MessageSquare className="w-5 h-5 text-indigo-500" /> Komunikasi Laporan
              </h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {/* Pesan history akan di-map di sini */}
              <div className="py-20 text-center text-slate-400 italic text-xs">
                Integrasi WAHA RANDA Sedang Aktif...
              </div>
            </div>
          </div>
        </div>
      </div>
    
  );
}