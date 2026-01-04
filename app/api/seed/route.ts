// app/api/seed/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🚀 Memulai Seeding Data Strategis...");

    // 1. BERSIHKAN DATA LAMA (Agar grafik akurat)
    // Hapus tiket dulu baru terlapor (karena referential integrity)
    await prisma.tiketAduan.deleteMany({});
    await prisma.terlapor.deleteMany({});
    
    // 2. BUAT DATA INSTANSI (TERLAPOR)
    // Ini yang membuat grafik "Top Instansi" dan "Analisis Wilayah" hidup
    const dinasPendidikan = await prisma.terlapor.create({
      data: {
        namaInstansi: "Dinas Pendidikan Kab. Nunukan",
        kategori: "PEMERINTAH_DAERAH",
        wilayah: "KABUPATEN NUNUKAN"
      }
    });

    const rsudTarakan = await prisma.terlapor.create({
      data: {
        namaInstansi: "RSUD dr. H. Jusuf SK",
        kategori: "RSUD",
        wilayah: "KOTA TARAKAN"
      }
    });

    const pdamBulungan = await prisma.terlapor.create({
      data: {
        namaInstansi: "PDAM Danum Benuanta",
        kategori: "BUMN_BUMD",
        wilayah: "KABUPATEN BULUNGAN"
      }
    });

    const pertanahanKTT = await prisma.terlapor.create({
      data: {
        namaInstansi: "Kantor Pertanahan KTT",
        kategori: "BPN_AGRARIA",
        wilayah: "KABUPATEN TANA TIDUNG"
      }
    });

    // 3. AMBIL/BUAT PELAPOR (Wajib ada)
    const pelapor = await prisma.pelapor.upsert({
      where: { noWhatsapp: "081234567890" },
      update: {},
      create: {
        namaLengkap: "Budi Warga",
        noWhatsapp: "081234567890",
        alamat: "Jl. Yos Sudarso, Tarakan",
        jenisKelamin: "LAKI_LAKI",
        kategori: "MASYARAKAT"
      }
    });

    // 4. BUAT TIKET YANG TERHUBUNG KE TERLAPOR
    console.log("Seeding Tiket Aduan...");
    await prisma.tiketAduan.createMany({
      data: [
        // KASUS 1: PUNGLI DI SEKOLAH (NUNUKAN)
        { 
          pelaporId: pelapor.id,
          terlaporId: dinasPendidikan.id, 
          // judul: "...", <--- HAPUS INI
          kronologi: "[JUDUL: Pungutan Liar PPDB] Wali murid dimintai uang bangku sebesar 2 juta rupiah.",
          noAgendaResmi: "TKT-2026-001",
          status: "VERIFIKASI_FORMIL", 
          dugaanMaladmin: ["PUNGLI", "PENYALAHGUNAAN_WEWENANG"],
          latitude: 4.13, longitude: 117.65, 
          createdAt: new Date(),
        },

        // KASUS 2: PELAYANAN RSUD (TARAKAN)
        { 
          pelaporId: pelapor.id,
          terlaporId: rsudTarakan.id,
          kronologi: "[JUDUL: Antrian Obat Lama] Pasien menunggu obat racikan selama 6 jam tanpa kepastian.",
          noAgendaResmi: "TKT-2026-002",
          status: "VERIFIKASI_MATERIIL", 
          dugaanMaladmin: ["PENUNDAAN_BERLARUT", "TIDAK_MEMBERIKAN_PELAYANAN"],
          latitude: 3.31, longitude: 117.59, 
          createdAt: new Date(Date.now() - 86400000), 
        },

        // KASUS 3: AIR MATI (BULUNGAN)
        { 
          pelaporId: pelapor.id,
          terlaporId: pdamBulungan.id,
          kronologi: "[JUDUL: Air Mati Total] Sudah 3 hari air tidak mengalir di Tanjung Selor Hilir.",
          noAgendaResmi: "TKT-2026-003",
          status: "PEMERIKSAAN", 
          dugaanMaladmin: ["TIDAK_MEMBERIKAN_PELAYANAN"],
          latitude: 2.84, longitude: 117.36, 
          createdAt: new Date(Date.now() - 172800000), 
        },

         // KASUS 4: SERTIFIKAT TANAH (TANA TIDUNG)
         { 
          pelaporId: pelapor.id,
          terlaporId: pertanahanKTT.id,
          kronologi: "[JUDUL: Sertifikat Tak Kunjung Terbit] Pengurusan PTSL sudah 2 tahun tidak ada kabar.",
          noAgendaResmi: "TKT-2026-004",
          status: "VERIFIKASI_FORMIL", // FIX: Ubah dari "BARU" ke status valid
          dugaanMaladmin: ["PENUNDAAN_BERLARUT"],
          latitude: 3.55, longitude: 117.25, 
          createdAt: new Date(Date.now() - 200000),
        },
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: "✅ Data Strategis Berhasil Di-Seed! (Instansi & Wilayah Terhubung)" 
    });

  } catch (error: any) {
    console.error("SEEDING GAGAL:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}