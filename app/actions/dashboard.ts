'use server'

import { prisma } from "@/lib/prisma"

export async function getDashboardStats() {
  // 1. Hitung Total Laporan Masuk
  const totalLaporan = await prisma.tiketAduan.count();

  // 2. Hitung yang Sedang Verifikasi (Formil + Materiil)
  const verifikasi = await prisma.tiketAduan.count({
    where: {
      status: {
        in: ['VERIFIKASI_FORMIL', 'VERIFIKASI_MATERIIL']
      }
    }
  });

  // 3. Hitung yang Menunggu Pleno (Gatekeeper)
  const waitingPleno = await prisma.tiketAduan.count({
    where: {
      status: 'MENUNGGU_PLENO'
    }
  });

  // 4. Hitung yang Selesai (LHP + Tutup)
  const selesai = await prisma.tiketAduan.count({
    where: {
      status: {
        in: ['SELESAI_LHP', 'SELESAI_NON_LHP', 'DITUTUP_NON_WEWENANG', 'DITUTUP_SYARAT_KURANG']
      }
    }
  });

  return {
    totalLaporan,
    verifikasi,
    waitingPleno,
    selesai
  };
}

export async function getRecentTickets() {
  const tickets = await prisma.tiketAduan.findMany({
    take: 5, // Ambil 5 terakhir saja buat widget dashboard
    orderBy: {
      createdAt: 'desc' // Yang paling baru di atas
    },
    include: {
      pelapor: true, // Joins ke tabel Pelapor biar kita tau namanya
      terlapor: true // Joins ke tabel Terlapor
    }
  });

  return tickets;
}