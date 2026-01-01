import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { analyzeComplaint } from "@/lib/gemini";

// --- FUNGSI KIRIM WA ---
async function sendWhatsApp(to: string, message: string) {
  try {
    const chatId = to.includes('@') ? to : `${to}@c.us`;
    const apiKey = "randa123"; 

    await fetch('http://127.0.0.1:3005/api/sendText', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey  
      },
      body: JSON.stringify({
        session: 'default',
        chatId: chatId,
        text: message
      })
    });
  } catch (err) {
    console.error("❌ Gagal connect ke WAHA:", err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (body.event === "message.any" && !body.payload.fromMe) {
      const payload = body.payload;
      const pengirim = payload.from.split('@')[0];
      const isiPesan = payload.body || "";
      const senderName = payload._data?.notifyName || "Warga";

      console.log(`📩 Pesan Masuk dari ${senderName} (${pengirim})`);

      // 1. Cek/Buat Pelapor
      let pelapor = await prisma.pelapor.findUnique({
        where: { noWhatsapp: pengirim }
      });

      if (!pelapor) {
        pelapor = await prisma.pelapor.create({
          data: { 
            namaLengkap: senderName, 
            noWhatsapp: pengirim, 
            kategori: "MASYARAKAT" 
          }
        });
      }

     // 2. LOGIKA TRACKING TIKET AKTIF (Bypass dengan Explicit Type Casting)
      const activeTickets: any[] = await prisma.$queryRaw`
        SELECT id FROM "TiketAduan" 
        WHERE "pelaporId" = ${pelapor.id} 
        AND "status"::text NOT IN ('SELESAI_LHP', 'DITUTUP')
        ORDER BY "createdAt" DESC
        LIMIT 1
      `;

      const tiketAktif = activeTickets[0];

      if (tiketAktif) {
        // Simpan pesan warga ke History
        await prisma.pesanHistory.create({
          data: {
            tiketId: tiketAktif.id,
            pengirim: "WARGA",
            pesan: isiPesan
          }
        });
        
        console.log(`✅ Pesan masuk ke history via Casted SQL: ${tiketAktif.id}`);
        return NextResponse.json({ status: "history_updated" });
      }

      // KONDISI B: Buat Tiket Baru
      const aiResult = await analyzeComplaint(isiPesan);
      const ticketId = `ORI-${Date.now().toString().slice(-6)}`;
      
      const newTicket = await prisma.tiketAduan.create({
        data: {
          id: ticketId,
          pelaporId: pelapor.id,
          sumberAduan: "WHATSAPP_RANDA",
          kronologi: isiPesan,
          dugaanMaladmin: aiResult?.dugaan_maladmin || [],
          isRCO: aiResult?.is_rco || false,
          harapanPelapor: `Terlapor: ${aiResult?.nama_instansi || '-'}`, 
          status: "VERIFIKASI_FORMIL" as any
        }
      });

      await prisma.pesanHistory.create({
        data: {
          tiketId: newTicket.id,
          pengirim: "WARGA",
          pesan: isiPesan
        }
      });

      const balasan = `
👋 Halo Kak *${senderName}*,

Laporan Anda telah kami terima.
🎫 No Tiket: *${ticketId}*

🤖 *Analisa Cepat AI:*
• Dugaan: ${aiResult?.dugaan_maladmin.join(", ") || "-"}
• Instansi: ${aiResult?.nama_instansi || "-"}

Tim kami sedang melakukan verifikasi data. Mohon ditunggu update selanjutnya.
_Salam, Ombudsman RI Kaltara_
      `.trim();

      await sendWhatsApp(pengirim, balasan);
      console.log(`🚀 Tiket Baru Berhasil Dibuat: ${ticketId}`);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}