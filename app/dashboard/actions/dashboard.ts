// app/dashboard/actions/dashboard.ts
"use server";

import { prisma } from "@/lib/prisma";

/**
 * LOGIC NORMALISASI WILAYAH
 * Memastikan data wilayah dari berbagai sumber (WA/Web) seragam untuk agregasi.
 */
const normalizeRegion = (name: string | null) => {
  if (!name) return "WILAYAH_LUAR_KALTARA";
  return name.toUpperCase()
    .replace("KABUPATEN ", "")
    .replace("KAB. ", "")
    .trim();
};

export async function getDashboardStats() {
  try {
    const totalLaporan = await prisma.tiketAduan.count();
    
    // HAPUS artifact [cite] di sini
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

/**
 * STRATEGIC ANALYTICS: GEOSPATIAL & ANOMALY DETECTION
 */
export async function getRegionAnalytics() {
  try {
    // Ambil data tiket dengan relasi terlapor untuk identifikasi wilayah
    const tickets = await prisma.tiketAduan.findMany({
      include: { 
        terlapor: {
          select: { wilayah: true, namaInstansi: true }
        } 
      }
    });

    // Aggregasi Manual (Group By Region)
    const statsMap: Record<string, { 
      count: number; 
      maladminStats: Record<string, number> 
    }> = {};

    tickets.forEach(t => {
      // Logic Kunci: Jika terlapor kosong, masukkan ke 'BELUM_TERDATA'
      const region = normalizeRegion(t.terlapor?.wilayah || "BELUM_TERDATA");
      
      if (!statsMap[region]) {
        statsMap[region] = { count: 0, maladminStats: {} };
      }
      
      statsMap[region].count += 1;
      
      // Hitung statistik Maladmin per wilayah untuk mencari isu dominan
      if (t.dugaanMaladmin && Array.isArray(t.dugaanMaladmin)) {
        t.dugaanMaladmin.forEach((m: string) => {
          statsMap[region].maladminStats[m] = (statsMap[region].maladminStats[m] || 0) + 1;
        });
      }
    });

    // Transformasi ke format Ranking Array
    const result = Object.entries(statsMap).map(([name, data]) => {
      // Cari Maladmin dominan (Mode)
      const topMaladminEntry = Object.entries(data.maladminStats)
        .sort((a, b) => b[1] - a[1])[0];

      return {
        name,
        count: data.count,
        isAnomaly: data.count > 10, // Threshold strategis
        topMaladmin: topMaladminEntry ? topMaladminEntry[0] : "PENDATAAN",
      };
    });

    // Urutkan: Wilayah dengan masalah terbanyak di atas
    return result.sort((a, b) => b.count - a.count);

  } catch (error) {
    console.error("Strategic Analytics Error:", error);
    return [];
  }
}

export async function getRecentTickets() {
  try {
    return await prisma.tiketAduan.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { pelapor: { select: { namaLengkap: true } } }, 
    });
  } catch (error) {
    return [];
  }
}

export async function getSLARiskData() {
  try {
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
  } catch (error) {
    return [];
  }
}

export async function getTopInstansi() {
  try {
    // Analisis Top 5 Instansi Terlapor
    const result = await prisma.terlapor.findMany({
      take: 5,
      orderBy: { tikets: { _count: 'desc' } },
      include: { _count: { select: { tikets: true } } }
    });

    return result.map(r => ({
      name: r.namaInstansi,
      count: r._count.tikets
    }));
  } catch (error) {
    return [];
  }
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

export async function getPipelineStats() {
  try {
    const tickets = await prisma.tiketAduan.findMany({
      select: { status: true }
    });

    const stats = {
      pvl: tickets.filter(t => 
        ["VERIFIKASI_FORMIL", "VERIFIKASI_MATERIIL"].includes(t.status as any)
      ).length,
      pl: tickets.filter(t => 
        ["MENUNGGU_PLENO", "PEMERIKSAAN", "DALAM_MEDIASI"].includes(t.status as any)
      ).length,
      pc: tickets.filter(t => 
        ["SELESAI_LHP", "SELESAI_NON_LHP"].includes(t.status as any)
      ).length,
    };

    return stats;
  } catch (error) {
    return { pvl: 0, pl: 0, pc: 0 };
  }
}