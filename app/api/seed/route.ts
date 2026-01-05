// app/api/seed/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("🚀 Memulai Master Seeding (Auth + Strategic Data)...");

    // 1. BERSIHKAN DATA LAMA
    // Urutan delete penting karena foreign key constraints
    await prisma.timPemeriksa.deleteMany({});
    await prisma.lampiran.deleteMany({});
    await prisma.pesanHistory.deleteMany({});
    await prisma.riwayatStatus.deleteMany({});
    await prisma.tiketAduan.deleteMany({});
    await prisma.terlapor.deleteMany({});
    await prisma.user.deleteMany({}); // Reset User agar password terupdate
    
    // 2. BUAT USER DENGAN HASHED PASSWORD (Wajib untuk Login)
    // Hash ini valid untuk password: "password123"
    const PASSWORD_HASH = "$2y$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa";

    await prisma.user.createMany({
      data: [
        { 
          name: "Super Admin", 
          email: "admin@randa.id", 
          role: "SUPERADMIN", 
          password: PASSWORD_HASH, // <-- PENTING: Password sudah di-hash
          noWhatsapp: "08111111111"
        },
        { 
          name: "Andi Saputra", 
          email: "pvl@randa.id", 
          role: "ASISTEN_PVL", 
          password: PASSWORD_HASH, 
          noWhatsapp: "08222222222"
        },
        { 
          name: "Budi Santoso", 
          email: "riksa@randa.id", 
          role: "ASISTEN_PL", 
          password: PASSWORD_HASH, 
          noWhatsapp: "08333333333"
        },
      ],
      skipDuplicates: true,
    });

    // 3. BUAT DATA INSTANSI (TERLAPOR) - Untuk Grafik Dashboard
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

    // 4. BUAT PELAPOR
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

    // 5. BUAT TIKET ADUAN (Terhubung ke Terlapor & Pelapor)
    console.log("Seeding Tiket Aduan...");
    await prisma.tiketAduan.createMany({
      data: [
        // KASUS 1: PUNGLI DI SEKOLAH (NUNUKAN)
        { 
          pelaporId: pelapor.id,
          terlaporId: dinasPendidikan.id, 
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
          status: "VERIFIKASI_FORMIL",
          dugaanMaladmin: ["PENUNDAAN_BERLARUT"],
          latitude: 3.55, longitude: 117.25, 
          createdAt: new Date(Date.now() - 200000),
        },
      ]
    });

    return NextResponse.json({ 
      success: true, 
      message: "✅ MASTER SEEDING SUKSES! (User Login Fixed + Dashboard Data Fixed)" 
    });

  } catch (error: any) {
    console.error("SEEDING GAGAL:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}