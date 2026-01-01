// app/dashboard/actions/dashboard.ts

"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
    const totalLaporan = await prisma.tiketAduan.count();
    const verifikasi = await prisma.tiketAduan.count({
      where: { status: "VERIFIKASI_FORMIL" as any }
    });
    const waitingPleno = await prisma.tiketAduan.count({
      where: { status: "MENUNGGU_PLENO" as any }
    });

    const allStatus = await prisma.tiketAduan.findMany({
      select: { status: true }
    });

    const selesai = allStatus.filter(t => 
      t.status === ("SELESAI_LHP" as any) || 
      t.status === ("SELESAI_NON_LHP" as any)
    ).length;

    return { totalLaporan, verifikasi, waitingPleno, selesai };
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return { totalLaporan: 0, verifikasi: 0, waitingPleno: 0, selesai: 0 };
  }
}

// SUNTIKAN STRATEGIS: GEOSPATIAL ANALYTICS & REGION RANKING
export async function getRegionAnalytics() {
  try {
    const tickets = await prisma.tiketAduan.findMany({
      select: {
        dugaanMaladmin: true,
        terlapor: {
          select: { wilayah: true }
        }
      }
    });

    // 1. Agregasi Data per Wilayah
    const regionMap = tickets.reduce((acc: any, t) => {
      const region = t.terlapor?.wilayah || "WILAYAH_LUAR_KALTARA";
      
      if (!acc[region]) {
        acc[region] = { count: 0, maladminStats: {} };
      }
      
      acc[region].count += 1;
      
      // 2. Hitung statistik Maladmin per wilayah (Data Feed dari AI Triage)
      t.dugaanMaladmin.forEach((m: string) => {
        acc[region].maladminStats[m] = (acc[region].maladminStats[m] || 0) + 1;
      });
      
      return acc;
    }, {});

    // 3. Transformasi ke format Ranking Array
    const result = Object.entries(regionMap).map(([name, data]: any) => {
      // Cari Maladmin dominan di wilayah tersebut
      const topMaladminEntry = Object.entries(data.maladminStats)
        .sort((a: any, b: any) => b[1] - a[1])[0];

      return {
        name,
        count: data.count,
        topMaladmin: topMaladminEntry ? topMaladminEntry[0] : "DATA_MINIM",
      };
    });

    // Urutkan berdasarkan Kabupaten Paling Bermasalah (Count terbanyak)
    return result.sort((a, b) => b.count - a.count);

  } catch (error) {
    console.error("Geospatial Analytics Error:", error);
    return [];
  }
}

// FUNGSI LAINNYA TETAP VERBATIM
export async function getRecentTickets() {
  return await prisma.tiketAduan.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { pelapor: { select: { namaLengkap: true } } },
  });
}

export async function getSLARiskData() {
  return await prisma.tiketAduan.findMany({
    where: {
      status: { in: ["VERIFIKASI_FORMIL", "VERIFIKASI_MATERIIL"] as any }
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      deadlineFormil: true,
      pelapor: { select: { namaLengkap: true } }
    },
    orderBy: { deadlineFormil: 'asc' }
  });
}

export async function getTopInstansi() {
  const result = await prisma.tiketAduan.groupBy({
    by: ['harapanPelapor'], // Kita asumsikan field ini menyimpan instansi terdeteksi sementara
    _count: { _all: true },
    orderBy: { _count: { harapanPelapor: 'desc' } },
    take: 5,
  });

  return result.map(r => ({
    name: r.harapanPelapor || "Lainnya",
    count: r._count._all
  }));
}

export async function getAverageVerificationSpeed() {
  try {
    const logs = await prisma.riwayatStatus.findMany({
      where: { statusBaru: "MENUNGGU_PLENO" as any },
      include: { tiket: { select: { createdAt: true } } }
    });
    if (logs.length === 0) return 0;
    const totalDurasi = logs.reduce((acc, log) => {
      const start = new Date(log.tiket.createdAt).getTime();
      const end = new Date(log.createdAt).getTime();
      return acc + (end - start);
    }, 0);
    const rataRataHari = totalDurasi / logs.length / (1000 * 60 * 60 * 24);
    return parseFloat(rataRataHari.toFixed(1));
  } catch (error) {
    return 0;
  }
}