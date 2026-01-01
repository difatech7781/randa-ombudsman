/*
  Warnings:

  - The values [DITUTUP_RESIKO_KEAMANAN] on the enum `StatusTiket` will be removed. If these variants are still used in the database, this will fail.
  - The values [ADMIN_PERWAKILAN,STAF] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `noWhatsapp` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusTiket_new" AS ENUM ('DRAFT', 'VERIFIKASI_FORMIL', 'VERIFIKASI_MATERIIL', 'MENUNGGU_PLENO', 'PEMERIKSAAN', 'DALAM_MEDIASI', 'SELESAI_LHP', 'SELESAI_NON_LHP', 'DITUTUP_NON_WEWENANG', 'DITUTUP_SYARAT_KURANG');
ALTER TABLE "TiketAduan" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "TiketAduan" ALTER COLUMN "status" TYPE "StatusTiket_new" USING ("status"::text::"StatusTiket_new");
ALTER TABLE "RiwayatStatus" ALTER COLUMN "statusLama" TYPE "StatusTiket_new" USING ("statusLama"::text::"StatusTiket_new");
ALTER TABLE "RiwayatStatus" ALTER COLUMN "statusBaru" TYPE "StatusTiket_new" USING ("statusBaru"::text::"StatusTiket_new");
ALTER TYPE "StatusTiket" RENAME TO "StatusTiket_old";
ALTER TYPE "StatusTiket_new" RENAME TO "StatusTiket";
DROP TYPE "StatusTiket_old";
ALTER TABLE "TiketAduan" ALTER COLUMN "status" SET DEFAULT 'VERIFIKASI_FORMIL';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SUPERADMIN', 'KEPALA_PERWAKILAN', 'ASISTEN_PVL', 'ASISTEN_PL', 'ASISTEN_PC', 'ADMIN_ADMINISTRASI');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'ASISTEN_PVL';
COMMIT;

-- DropIndex
DROP INDEX "User_noWhatsapp_key";

-- AlterTable
ALTER TABLE "TiketAduan" ADD COLUMN     "pembuatId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "noWhatsapp",
ALTER COLUMN "role" SET DEFAULT 'ASISTEN_PVL';

-- CreateTable
CREATE TABLE "TimPemeriksa" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tiketId" TEXT NOT NULL,
    "peran" TEXT NOT NULL DEFAULT 'ANGGOTA',
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimPemeriksa_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimPemeriksa_tiketId_idx" ON "TimPemeriksa"("tiketId");

-- CreateIndex
CREATE INDEX "TimPemeriksa_userId_idx" ON "TimPemeriksa"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TimPemeriksa_userId_tiketId_key" ON "TimPemeriksa"("userId", "tiketId");

-- AddForeignKey
ALTER TABLE "TimPemeriksa" ADD CONSTRAINT "TimPemeriksa_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimPemeriksa" ADD CONSTRAINT "TimPemeriksa_tiketId_fkey" FOREIGN KEY ("tiketId") REFERENCES "TiketAduan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TiketAduan" ADD CONSTRAINT "TiketAduan_pembuatId_fkey" FOREIGN KEY ("pembuatId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
