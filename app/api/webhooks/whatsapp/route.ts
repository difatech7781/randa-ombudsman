// app/api/webhooks/whatsapp/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { runAITriage } from "@/lib/ai/triage-engine";
import { getFormilDeadline, getMateriilDeadline } from "@/lib/compliance";
import { sendWHAMessage } from "@/lib/whatsapp";
import { extractKTPData } from "@/lib/ai/vision-engine"; 

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sender, message, name, mediaUrl, type } = body; 

    if (!sender || !message) {
      return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });
    }

    // 1. Jalankan Analisa AI
    const aiAnalysis = await runAITriage(message);
    const now = new Date();

    // 2. Transaksi Database
    const result = await prisma.$transaction(async (tx) => {
      const pelapor = await tx.pelapor.upsert({
        where: { noWhatsapp: sender },
        update: { namaLengkap: name || "Pelapor RANDA" },
        create: {
          noWhatsapp: sender,
          namaLengkap: name || "Pelapor RANDA",
        },
      });

      const tiket = await tx.tiketAduan.create({
        data: {
          pelaporId: pelapor.id,
          kronologi: message,
          status: "VERIFIKASI_FORMIL",
          
          // === FIX DISINI ===
          // Gunakan .instansiTerlapor (sesuai output triage-engine.ts)
          // Pastikan nama kolom di kiri (harapanPelapor/instansiTerdeteksi) sesuai schema.prisma kamu
          dugaanMaladmin: aiAnalysis.dugaanMaladmin,
          instansiTerdeteksi: aiAnalysis.instansiTerlapor, // FIXED: Property name correction
          urgensi: aiAnalysis.urgensi,
          
          deadlineFormil: getFormilDeadline(now),
          deadlineMateriil: getMateriilDeadline(now),
        },
      });

      return { tiket, pelapor };
    });

    // --- SUNTIKAN: VISION OCR & INTERNAL ALERT LOGIC ---
    
    let ocrResult = null;
    if (type === "image" && mediaUrl) {
      ocrResult = await extractKTPData(mediaUrl);
      
      if (ocrResult) {
        await prisma.tiketAduan.update({
          where: { id: result.tiket.id },
          data: {
            nikTerdeteksi: ocrResult.nik,
            namaKtpTerdeteksi: ocrResult.nama,
            isIdentityMatch: ocrResult.nama.toUpperCase() === result.pelapor.namaLengkap.toUpperCase()
          }
        });
      }
    }

    // LOGIKAL ESCALATION: Pungli (Permintaan Imbalan) ATAU Urgensi Tinggi + Mismatch
    // Kita casting ke string[] karena Enum kadang rewel saat di-check dengan .includes
    const listMaladmin = aiAnalysis.dugaanMaladmin.map(m => m.toString());
    const isPungli = listMaladmin.includes("PERMINTAAN_IMBALAN");
    
    const isHighUrgency = aiAnalysis.urgensi === "TINGGI";
    const isMismatch = ocrResult && (ocrResult.nama.toUpperCase() !== result.pelapor.namaLengkap.toUpperCase());

    if ((isPungli || isHighUrgency) && isMismatch) {
      // Cari Asisten PVL (Admin Perwakilan) untuk diberi notifikasi
      const asistenPVL = await prisma.user.findFirst({
        where: { role: "ASISTEN_PVL" }
      });

      if (asistenPVL?.noWhatsapp) {
        const alertMsg = `圷 *INTERNAL ALERT: RISIKO TINGGI*\n\n` +
          `Laporan terdeteksi sebagai *${isPungli ? 'PUNGLI' : 'URGENSI TINGGI'}* namun ID Pelapor *TIDAK COCOK* (Mismatch).\n\n` +
          `桃 ID Tiket: #${result.tiket.id}\n` +
          `側 Input: ${result.pelapor.namaLengkap}\n` +
          `､KTP: ${ocrResult?.nama || "Tidak Terbaca"}\n\n` +
          `Segera cek Dashboard RANDA untuk tindak lanjut manual.`;
        
        await sendWHAMessage(asistenPVL.noWhatsapp, alertMsg);
      }
    }
    // --- END OF SUNTIKAN ---

    // Auto-response Pelapor
    const deadlineFormatted = new Date(result.tiket.deadlineFormil!).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });

    const replyMessage = `Halo Pak/Bu ${name || 'Pelapor'}, Laporan Anda diterima dengan *ID Tiket: #${result.tiket.id}*. Tahap verifikasi selesai paling lambat *${deadlineFormatted}*. 噫`;
    await sendWHAMessage(sender, replyMessage);

    return NextResponse.json({ success: true, ticketId: result.tiket.id });

  } catch (error) {
    console.error("[RANDA ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}