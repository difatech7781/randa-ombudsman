// app/api/cron/sla-warning/route.ts [cite: 1, 4]

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  // Proteksi sederhana agar tidak diakses publik (Gunakan CRON_SECRET di .env)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const now = new Date();
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(now.getDate() + 2);

    // Ambil tiket yang belum selesai verifikasi dan deadline < 2 hari 
    const urgentTickets = await prisma.tiketAduan.findMany({
      where: {
        status: "VERIFIKASI_FORMIL",
        deadlineFormil: {
          lte: twoDaysFromNow,
          gte: now
        }
      },
      include: { pelapor: true }
    });

    if (urgentTickets.length === 0) {
      return NextResponse.json({ message: "No urgent tickets found today." });
    }

    // Format Pesan WhatsApp Segera Verifikasi 
    const ticketList = urgentTickets.map(t => 
      `- ID: ${t.id} (Pelapor: ${t.pelapor.namaLengkap})`
    ).join("\n");

    const waMessage = `⚠️ *SLA WARNING SYSTEM* ⚠️\n\nAda ${urgentTickets.length} laporan mendekati batas 14 hari kerja (SOP SK 244/2020):\n\n${ticketList}\n\nSegera lakukan verifikasi formil agar tidak melampaui batas waktu!`;

    // Logika Pengiriman ke WhatsApp Admin [cite: 1]
    console.log(`[CRON SLA] Mengirim ke Admin: \n${waMessage}`);
    
    // Implementasi fetch ke WA Gateway Anda di sini [cite: 1]
    /*
    await fetch('https://api.gateway.com/send', {
      method: 'POST',
      body: JSON.stringify({ to: process.env.ADMIN_WA_NUMBER, msg: waMessage })
    });
    */

    return NextResponse.json({ 
      success: true, 
      ticketsProcessed: urgentTickets.length 
    });

  } catch (error) {
    console.error("CRON Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}