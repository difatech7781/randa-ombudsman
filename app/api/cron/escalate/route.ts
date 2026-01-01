// app/api/cron/escalate/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendWHAMessage } from "@/lib/whatsapp";

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();

    // === SOLUSI CLEAN CODE ===
    // Kita definisikan kriteria pencarian di luar prisma query.
    // Kita beri tipe 'any' agar TypeScript tidak rewel soal field 'isEscalated'
    // yang mungkin belum ter-generate di Vercel environment.
    const whereQuery: any = {
      deadlineFormil: { lt: now },
      status: { 
        notIn: ["SELESAI_LHP", "SELESAI_NON_LHP", "DITUTUP"] 
      },
      isEscalated: false 
    };

    // 1. Cari Tiket yang Overdue
    const overdueTickets = await prisma.tiketAduan.findMany({
      where: whereQuery, // TypeScript tidak akan melakukan "Excess Property Check" di sini
      include: { pelapor: true }
    });

    if (overdueTickets.length === 0) {
      return NextResponse.json({ message: "No overdue tickets found." });
    }

    const kaper = await prisma.user.findFirst({
      where: { role: "KEPALA_PERWAKILAN" }
    });

    // 3. Eksekusi Eskalasi
    const results = await Promise.all(overdueTickets.map(async (ticket) => {
      
      // Sama seperti di atas, kita ekstrak data update ke variabel any
      const updateData: any = {
        status: "KRITIS_OVERDUE",
        isEscalated: true
      };

      await prisma.tiketAduan.update({
        where: { id: ticket.id },
        data: updateData
      });

      if (kaper?.noWhatsapp) {
        const dateStr = ticket.deadlineFormil 
          ? new Date(ticket.deadlineFormil).toLocaleDateString('id-ID')
          : "-";

        const alertMsg = `⚠️ *ESKALASI OTOMATIS: DEADLINE BREACH*\n\n` +
          `Laporan berikut telah melewati batas 14 hari kerja (SLA) tanpa penyelesaian formil.\n\n` +
          `📍 ID Tiket: #${ticket.id}\n` +
          `👤 Pelapor: ${ticket.pelapor?.namaLengkap || "Anonim"}\n` +
          `📅 Batas Awal: ${dateStr}\n\n` +
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