// app/dashboard/inbox/actions.ts
"use server";

import { prisma } from "@/lib/prisma";

/**
 * Mengambil data laporan untuk Inbox Verifikasi Formil
 * @param filter Kriteria filter (Semua, Mendekati Deadline, dsb)
 */
export async function getInboxTickets(filter?: string) {
  const now = new Date();
  const twoDaysFromNow = new Date();
  twoDaysFromNow.setDate(now.getDate() + 2);

  let whereClause: any = {
    // Default: Hanya tampilkan yang dalam tahap Verifikasi Formil
    status: "VERIFIKASI_FORMIL" 
  };

  // 1. STRATEGIC FILTERING: Deteksi Risiko SLA
  if (filter === "Mendekati Deadline") {
    whereClause = {
      ...whereClause,
      deadlineFormil: {
        lte: twoDaysFromNow,
        gte: now,
      },
    };
  } else if (filter && filter !== "Semua") {
    // Memungkinkan filter status spesifik lainnya jika diperlukan
    whereClause.status = filter;
  }

  // 2. ENHANCED DATA FETCHING: Kelengkapan Berkas
  return await prisma.tiketAduan.findMany({
    where: whereClause,
    include: {
      pelapor: { 
        select: { 
          namaLengkap: true,
          noWhatsapp: true // Tambahan untuk mempermudah kontak cepat
        } 
      },
      // Menghitung jumlah file/lampiran untuk indikator UI
      _count: {
        select: { lampiran: true }
      }
    },
    orderBy: [
      // Prioritaskan yang paling mendekati deadline (SLA First)
      { deadlineFormil: 'asc' },
      { createdAt: 'desc' }
    ],
  });
}