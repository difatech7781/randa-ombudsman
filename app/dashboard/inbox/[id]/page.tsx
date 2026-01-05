import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Clock, FileText, User, Building2, MapPin, Paperclip 
} from "lucide-react";
import Link from "next/link";

// Helper untuk format tanggal
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  }).format(date);
};

// Interface untuk Params (Next.js 15+)
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TicketDetailPage({ params }: PageProps) {
  // 1. AWAIT PARAMS (Wajib di Next.js terbaru)
  const { id } = await params;

  // 2. FETCH DATA TIKET (CLEAN QUERY - TANPA ARTIFACT)
  const tiket = await prisma.tiketAduan.findUnique({
    where: { id },
    include: {
      pelapor: true,     
      terlapor: true,    
      // Relasi history status (Timeline)
      riwayatStatus: {
        orderBy: { createdAt: "desc" }
      },
      // Relasi chat/pesan (Diskusi)
      pesanHistory: {
        orderBy: { createdAt: "asc" }
      },
      // Relasi lampiran
      lampiran: true
    }
  });

  if (!tiket) {
    return notFound();
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* HEADER & NAVIGASI */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/inbox">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Detail Tiket</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <span className="font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">#{tiket.noAgendaResmi || tiket.id.substring(0,8)}</span>
            <span>•</span>
            <span>{formatDate(tiket.createdAt)}</span>
          </div>
        </div>
        <div className="ml-auto">
          <Badge className="text-sm px-4 py-1 uppercase tracking-widest font-black bg-indigo-600 hover:bg-indigo-700">
            {tiket.status.replace(/_/g, " ")}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI: INFO UTAMA */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* KRONOLOGI */}
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Kronologi Aduan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-slate-800 leading-relaxed whitespace-pre-wrap text-sm">
                {tiket.kronologi}
              </p>
              
              {/* Harapan Pelapor */}
              {tiket.harapanPelapor && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Harapan Pelapor</h4>
                  <p className="text-emerald-800 text-sm font-medium">{tiket.harapanPelapor}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* RIWAYAT STATUS (TIMELINE) */}
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Riwayat Proses
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:h-full before:w-0.5 before:bg-slate-100">
                {tiket.riwayatStatus.map((log, i) => (
                  <div key={log.id} className="relative pl-8">
                    <div className={`absolute left-0 top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${i === 0 ? 'bg-indigo-600 ring-2 ring-indigo-100' : 'bg-slate-300'}`}></div>
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs font-black uppercase text-slate-900 mb-1">
                        {log.statusBaru.replace(/_/g, " ")}
                      </p>
                      {log.keterangan && (
                        <p className="text-xs text-slate-600 mb-2">{log.keterangan}</p>
                      )}
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDate(log.createdAt)} • oleh {log.updatedBy}
                      </p>
                    </div>
                  </div>
                ))}
                {tiket.riwayatStatus.length === 0 && (
                   <p className="pl-8 text-xs text-slate-400 italic">Belum ada riwayat proses.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KOLOM KANAN: META DATA */}
        <div className="space-y-6">
          
          {/* IDENTITAS PELAPOR */}
          <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
            <div className="bg-indigo-600 p-4">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4" /> Identitas Pelapor
              </h3>
            </div>
            <CardContent className="p-5 space-y-4">
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Nama Lengkap</label>
                <p className="text-sm font-bold text-slate-900">{tiket.pelapor.namaLengkap}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Kontak (WA)</label>
                <p className="text-sm font-mono font-medium text-slate-600">{tiket.pelapor.noWhatsapp}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400">Domisili</label>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin className="w-3 h-3 text-slate-400 mt-0.5" />
                  <p className="text-xs text-slate-600">{tiket.pelapor.alamat || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* TERLAPOR */}
          <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2 border-b border-slate-50">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Pihak Terlapor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-3">
              {tiket.terlapor ? (
                <>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{tiket.terlapor.namaInstansi}</p>
                    <Badge variant="outline" className="mt-1 text-[9px] border-slate-200 text-slate-500">
                      {tiket.terlapor.kategori.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                    <MapPin className="w-3 h-3" />
                    {tiket.terlapor.wilayah}
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-slate-400 italic">Belum ada data terlapor</p>
                  <Button variant="link" className="text-indigo-600 text-xs h-auto p-0 mt-1">
                    + Input Terlapor
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

           {/* LAMPIRAN */}
           <Card className="rounded-2xl border-slate-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <Paperclip className="w-4 h-4" /> Lampiran ({tiket.lampiran.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
               {tiket.lampiran.length > 0 ? (
                 <ul className="space-y-2 mt-2">
                   {tiket.lampiran.map((file) => (
                     <li key={file.id} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-200 transition-colors cursor-pointer group">
                       <div className="p-1.5 bg-white rounded shadow-sm group-hover:bg-indigo-50">
                         <FileText className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                       </div>
                       <div className="flex-1 overflow-hidden">
                         <p className="text-xs font-bold text-slate-700 truncate">{file.nama}</p>
                         <p className="text-[9px] text-slate-400 uppercase">{file.tipe}</p>
                       </div>
                     </li>
                   ))}
                 </ul>
               ) : (
                 <p className="text-xs text-slate-400 italic py-2">Tidak ada lampiran dokumen.</p>
               )}
            </CardContent>
           </Card>

        </div>
      </div>
    </div>
  );
}