"use server";

import { prisma } from "@/lib/prisma";
import { analyzeComplaint } from "@/lib/gemini";
import { revalidatePath } from "next/cache";
import { PrismaClient, SumberAduan } from "@prisma/client";

export async function submitManualReport(formData: FormData) {
  const nama = formData.get("nama") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const kronologi = formData.get("kronologi") as string;
  const sumber = formData.get("sumber") as string; // 'DATANG_LANGSUNG' atau 'TELEPON'

  // 1. Jalankan AI Brain untuk standarisasi data
  const aiResult = await analyzeComplaint(kronologi);
  const ticketId = `MNL-${Date.now().toString().slice(-6)}`;

  try {
    const newTicket = await prisma.tiketAduan.create({
      data: {
        id: ticketId,
        pelapor: {
          connectOrCreate: {
            where: { noWhatsapp: whatsapp },
            create: { 
              namaLengkap: nama, 
              noWhatsapp: whatsapp,
              kategori: "MASYARAKAT"
            }
          }
        },
        sumberAduan: sumber as SumberAduan,
        kronologi: kronologi,
        dugaanMaladmin: aiResult?.dugaan_maladmin || [],
        harapanPelapor: `Terlapor: ${aiResult?.nama_instansi || '-'}`,
        status: "VERIFIKASI_FORMIL"
      }
    });

    revalidatePath("/dashboard");
    return { success: true, ticketId: newTicket.id };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}