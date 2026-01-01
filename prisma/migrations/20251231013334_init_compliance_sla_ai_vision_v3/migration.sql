-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPERADMIN', 'ADMIN_PERWAKILAN', 'KEPALA_PERWAKILAN', 'STAF');

-- CreateEnum
CREATE TYPE "StatusTiket" AS ENUM ('DRAFT', 'VERIFIKASI_FORMIL', 'VERIFIKASI_MATERIIL', 'MENUNGGU_PLENO', 'PEMERIKSAAN', 'DALAM_MEDIASI', 'SELESAI_LHP', 'SELESAI_NON_LHP', 'DITUTUP_RESIKO_KEAMANAN', 'DITUTUP_SYARAT_KURANG');

-- CreateEnum
CREATE TYPE "Maladministrasi" AS ENUM ('PENUNDAAN_BERLARUT', 'TIDAK_MEMBERIKAN_PELAYANAN', 'PENYIMPANGAN_PROSEDUR', 'PENYALAHGUNAAN_WEWENANG', 'TIDAK_KOMPETEN', 'PERMINTAAN_IMBALAN', 'TIDAK_PATUT', 'BERPIHAK', 'DISKRIMINASI', 'KONFLIK_KEPENTINGAN');

-- CreateEnum
CREATE TYPE "JenisAduan" AS ENUM ('LAPORAN', 'KONSULTASI');

-- CreateEnum
CREATE TYPE "KategoriInstansi" AS ENUM ('PEMERINTAH_DAERAH', 'KEMENTERIAN', 'LEMBAGA_NEGARA', 'KEPOLISIAN', 'TNI', 'KEJAKSAAN', 'PENGADILAN', 'BPN_AGRARIA', 'BUMN_BUMD', 'SEKOLAH_NEGERI', 'RSUD', 'SWASTA_BERJARING', 'LAINNYA');

-- CreateEnum
CREATE TYPE "KategoriPelapor" AS ENUM ('MASYARAKAT', 'KUASA_HUKUM', 'LSM', 'KORBAN_LANGSUNG', 'INSTANSI_PEMERINTAH');

-- CreateEnum
CREATE TYPE "SumberAduan" AS ENUM ('WHATSAPP_RANDA', 'INSTAGRAM_DM', 'FACEBOOK', 'OTS_JEMPUT_BOLA', 'SURAT', 'DATANG_LANGSUNG', 'SP4N_LAPOR', 'TELEPON');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "noWhatsapp" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'STAF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pelapor" (
    "id" TEXT NOT NULL,
    "namaLengkap" TEXT NOT NULL,
    "nik" TEXT,
    "noWhatsapp" TEXT NOT NULL,
    "alamat" TEXT,
    "pekerjaan" TEXT,
    "statusPernikahan" TEXT,
    "jenisKelamin" TEXT,
    "kategori" "KategoriPelapor" NOT NULL DEFAULT 'MASYARAKAT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pelapor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Terlapor" (
    "id" TEXT NOT NULL,
    "namaInstansi" TEXT NOT NULL,
    "kategori" "KategoriInstansi" NOT NULL,
    "wilayah" TEXT NOT NULL,

    CONSTRAINT "Terlapor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TiketAduan" (
    "id" TEXT NOT NULL,
    "noAgendaResmi" TEXT,
    "pelaporId" TEXT NOT NULL,
    "terlaporId" TEXT,
    "sumberAduan" "SumberAduan" NOT NULL DEFAULT 'WHATSAPP_RANDA',
    "dugaanMaladmin" TEXT[],
    "kronologi" TEXT NOT NULL,
    "tanggalKejadian" TIMESTAMP(3),
    "harapanPelapor" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "isRCO" BOOLEAN NOT NULL DEFAULT false,
    "rahasiakanIdentitas" BOOLEAN NOT NULL DEFAULT false,
    "sudahLaporAtasan" BOOLEAN NOT NULL DEFAULT false,
    "status" "StatusTiket" NOT NULL DEFAULT 'VERIFIKASI_FORMIL',
    "deadlineFormil" TIMESTAMP(3),
    "deadlineMateriil" TIMESTAMP(3),
    "instansiTerdeteksi" TEXT,
    "ringkasanAI" TEXT,
    "urgensi" TEXT DEFAULT 'SEDANG',
    "nikTerdeteksi" TEXT,
    "namaKtpTerdeteksi" TEXT,
    "ocrConfidence" DOUBLE PRECISION DEFAULT 0.0,
    "isIdentityMatch" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TiketAduan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiwayatStatus" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "statusLama" "StatusTiket",
    "statusBaru" "StatusTiket" NOT NULL,
    "keterangan" TEXT,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiwayatStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lampiran" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tipe" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lampiran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KegiatanOTS" (
    "id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "kelurahan" TEXT NOT NULL,
    "rt" TEXT NOT NULL,
    "timBertugas" TEXT[],
    "jmlKonsultasi" INTEGER NOT NULL DEFAULT 0,
    "jmlLaporan" INTEGER NOT NULL DEFAULT 0,
    "catatanLapangan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KegiatanOTS_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PesanHistory" (
    "id" TEXT NOT NULL,
    "tiketId" TEXT NOT NULL,
    "pengirim" TEXT NOT NULL,
    "pesan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PesanHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_noWhatsapp_key" ON "User"("noWhatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "Pelapor_noWhatsapp_key" ON "Pelapor"("noWhatsapp");

-- CreateIndex
CREATE UNIQUE INDEX "TiketAduan_noAgendaResmi_key" ON "TiketAduan"("noAgendaResmi");

-- AddForeignKey
ALTER TABLE "TiketAduan" ADD CONSTRAINT "TiketAduan_pelaporId_fkey" FOREIGN KEY ("pelaporId") REFERENCES "Pelapor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiketAduan" ADD CONSTRAINT "TiketAduan_terlaporId_fkey" FOREIGN KEY ("terlaporId") REFERENCES "Terlapor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiwayatStatus" ADD CONSTRAINT "RiwayatStatus_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "TiketAduan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lampiran" ADD CONSTRAINT "Lampiran_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "TiketAduan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesanHistory" ADD CONSTRAINT "PesanHistory_tiketId_fkey" FOREIGN KEY ("tiketId") REFERENCES "TiketAduan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
