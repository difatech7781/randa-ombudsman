// app/api/cron/escalate/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWHAMessage } from "@/lib/whatsapp";

export async function GET(req: Request) {
  // Proteksi: Hanya bisa dijalankan oleh CRON (Verifikasi API Key)
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // 1. Cari Tiket yang Overdue (Melewati deadlineFormil dan belum Selesai)
    const overdueTickets = await prisma.tiketAduan.findMany({
      where: {
        deadlineFormil: { lt: now },
        status: { 
          notIn: ["SELESAI_LHP", "SELESAI_NON_LHP", "DITUTUP"] as any 
        },
        isEscalated: false // Flag agar tidak dikirim berulang kali
      },
      include: { pelapor: true }
    });

    if (overdueTickets.length === 0) {
      return NextResponse.json({ message: "No overdue tickets found." });
    }

    // 2. Ambil data Kepala Perwakilan untuk Notifikasi
    const kaper = await prisma.user.findFirst({
      where: { role: "KEPALA_PERWAKILAN" }
    });

    // 3. Eksekusi Eskalasi & Kirim Alert
    const results = await Promise.all(overdueTickets.map(async (ticket) => {
      // Update status menjadi KRITIS di database
      await prisma.tiketAduan.update({
        where: { id: ticket.id },
        data: { 
          status: "KRITIS_OVERDUE" as any, 
          isEscalated: true 
        }
      });

      // Kirim Notifikasi WhatsApp ke Kepala Perwakilan
      if (kaper?.noWhatsapp) {
        const alertMsg = `⚠️ *ESKALASI OTOMATIS: DEADLINE BREACH*\n\n` +
          `Laporan berikut telah melewati batas 14 hari kerja (SLA) tanpa penyelesaian formil.\n\n` +
          `📍 ID Tiket: #${ticket.id}\n` +
          `👤 Pelapor: ${ticket.pelapor.namaLengkap}\n` +
          `📅 Batas Awal: ${ticket.deadlineFormil?.toLocaleDateString('id-ID')}\n\n` +
          `Sistem telah memindahkan tiket ini ke kategori *KRITIS*. Mohon arahan pimpinan.`;
        
        await sendWHAMessage(kaper.noWhatsapp, alertMsg);
      }
      
      return ticket.id;
    }));

    return NextResponse.json({ 
      success: true, 
      escalatedCount: results.length 
    });

  } catch (error) {
    console.error("Escalation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}