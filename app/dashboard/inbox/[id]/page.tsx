// app/dashboard/inbox/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Jalur authOptions Anda
import TimelineAudit from "@/components/TimelineAudit"; 
import { HandoverButton } from "@/components/dashboard/HandoverButton";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User, FileText, Shield, MapPin } from "lucide-react";

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);

  // 1. FETCH DATA: Sinkronisasi Tiket, Pelapor, Terlapor, dan Audit Trail
  const tiket = await prisma.tiketAduan.findUnique({
    where: { id: params.id },
    include: {
      pelapor: true, [cite: 11]
      terlapor: true, [cite: 12]
      // Sinkronisasi: riwayatStatus (huruf kecil sesuai schema.prisma)
      riwayatStatus: { 
        orderBy: { createdAt: 'desc' }, 
        // Catatan:updatedBy menyimpan ID User, kita bisa melakukan mapping di UI
      }
    }
  });

  if (!tiket) notFound();

  // Logic Gate: Cek apakah user memiliki otoritas handover
  const canHandover = ["SUPERADMIN", "ASISTEN_PVL"].includes(session?.user?.role || ""); 

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-[#fcfcfd] min-h-screen">
      
      {/* 1. HEADER & ACTION SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tighter uppercase text-slate-900 italic">
              Tiket #{tiket.id.substring(0, 8)}
            </h1>
            <Badge className="bg-indigo-600 text-white font-black uppercase text-[10px] px-3 py-1">
              {tiket.status.replace('_', ' ')} [cite: 27]
            </Badge>
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Clock className="w-3 h-3" /> Ingested: {new Date(tiket.createdAt).toLocaleString('id-ID')} WITA
          </p>
        </div>
        
        {/* ACTION: Handover Button (Hanya untuk PVL/Admin di tahap awal) */}
        {canHandover && (tiket.status === "VERIFIKASI_FORMIL" || tiket.status === "DRAFT") && ( [cite: 3, 27]
          <HandoverButton tiketId={tiket.id} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: KRONOLOGI & TIMELINE */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Uraian Laporan */}
          <Card className="p-8 rounded-[32px] border-slate-100 shadow-sm bg-white">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" /> Kronologi Kejadian [cite: 13]
            </h3>
            <div className="text-sm text-slate-700 leading-relaxed font-medium">
              {tiket.kronologi} [cite: 13]
            </div>
            {tiket.harapanPelapor && ( [cite: 14]
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border-l-4 border-indigo-500">
                <p className="text-[10px] font-black uppercase text-indigo-600 mb-1">Harapan Pelapor</p>
                <p className="text-xs italic text-slate-600">"{tiket.harapanPelapor}"</p> [cite: 14]
              </div>
            )}
          </Card>

          {/* RIWAYAT / TIMELINE SECTION */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Jejak Akuntabilitas (Audit Trail)</h3>
              <div className="h-px flex-1 bg-slate-100"></div>
            </div>
            {/* Mengirim riwayatStatus yang sudah sinkron ke komponen UI */}
            <TimelineAudit riwayat={tiket.riwayatStatus} /> 
          </div>
        </div>

        {/* RIGHT COLUMN: METADATA PELAPOR & TERLAPOR */}
        <div className="space-y-6">
          
          {/* Profil Pelapor */}
          <Card className="p-6 rounded-[32px] border-slate-100 shadow-sm bg-white">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" /> Profil Pelapor [cite: 11]
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Nama Lengkap</p>
                <p className="text-xs font-black text-slate-900 uppercase">{tiket.pelapor?.namaLengkap || 'Anonim'}</p> [cite: 5]
              </div>
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">NIK Terdeteksi (AI)</p>
                <p className="text-xs font-mono font-bold text-indigo-600">{tiket.nikTerdeteksi || '-'}</p> [cite: 10]
              </div>
              <Badge variant="secondary" className="text-[8px] font-black uppercase tracking-widest bg-slate-50">
                {tiket.pelapor?.kategori || 'MASYARAKAT'} [cite: 7]
              </Badge>
            </div>
          </Card>

          {/* Profil Terlapor */}
          <Card className="p-6 rounded-[32px] border-slate-100 shadow-sm bg-white">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-500" /> Entitas Terlapor [cite: 12]
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Instansi</p>
                <p className="text-xs font-black text-slate-900 uppercase">{tiket.terlapor?.namaInstansi || 'Dalam Identifikasi'}</p> 
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin className="w-3 h-3" />
                <span className="text-[10px] font-bold uppercase">{tiket.terlapor?.wilayah || 'KALIMANTAN UTARA'}</span> 
              </div>
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}