// app/dashboard/actions/handover.ts
"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Sesuaikan path authOptions
import { sendWHAMessage } from "@/lib/whatsapp";

/**
 * Logic Handover Strategis: PVL ke PL
 * Mencatat bukti otentik verifikasi dan keputusan pleno ke Audit Trail.
 */
export async function executeHandoverPVLtoPL(
  tiketId: string, 
  catatanVerifikasi: string,
  alasanPleno: string
) {
  const session = await getServerSession(authOptions);
  
  // Security Gate: Hanya PVL atau Superadmin yang memiliki otoritas handover formil [cite: 3]
  if (!session || !["ASISTEN_PVL", "SUPERADMIN"].includes(session.user.role)) {
    throw new Error("Akses ditolak: Anda tidak memiliki otoritas handover.");
  }

  try {
    return await prisma.$transaction(async (tx) => {
      // 1. Validasi keberadaan tiket dan ambil status terakhir [cite: 10]
      const tiket = await tx.tiketAduan.findUnique({
        where: { id: tiketId },
        include: { pelapor: true }
      });

      if (!tiket) throw new Error("Tiket tidak ditemukan.");

      // 2. Update Status ke PEMERIKSAAN (SOP SK 244/2020) [cite: 27]
      const updatedTicket = await tx.tiketAduan.update({
        where: { id: tiketId },
        data: {
          status: "PEMERIKSAAN",
          updatedAt: new Date(),
        }
      });

      // 3. ENFORCE ACCOUNTABILITY: Simpan Audit Trail ke RiwayatStatus [cite: 22]
      await tx.riwayatStatus.create({
        data: {
          ticketId: tiketId, // Nama field sesuai schema.prisma terbaru [cite: 22]
          statusLama: tiket.status,
          statusBaru: "PEMERIKSAAN",
          updatedBy: session.user.id, // Menyimpan ID actor penanggung jawab [cite: 2]
          keterangan: `[HANDOVER] Verifikasi: ${catatanVerifikasi} | Pleno: ${alasanPleno}`, // Bukti keputusan 
        }
      });

      // 4. Notifikasi WhatsApp ke Tim PL (Investigator) [cite: 3]
      const asistenPL = await tx.user.findMany({
        where: { role: "ASISTEN_PL" }
      });

      const message = `🔔 *ESKALASI PIPELINE RANDA*\n\n` +
                      `Tiket #${tiketId.substring(0, 8)} telah diserahkan ke Pemeriksaan.\n` +
                      `👤 Pelapor: ${tiket.pelapor?.namaLengkap}\n` +
                      `📝 Hasil Pleno: ${alasanPleno}\n\n` +
                      `SLA 30 Hari Kerja untuk pemeriksaan substansi dimulai sekarang.`;

      for (const pl of asistenPL) {
        if (pl.noWhatsapp) {
          await sendWHAMessage(pl.noWhatsapp, message);
        }
      }

      return { success: true, message: "Handover selesai dan akuntabilitas tercatat." };
    });
  } catch (error: any) {
    console.error("Handover Error:", error);
    return { success: false, error: error.message || "Gagal memproses handover." };
  }
}