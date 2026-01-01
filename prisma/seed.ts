// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('--- STARTING SYSTEM SEEDING: RANDA ORI KALTARA ---');

  // 1. CLEANUP
  try {
    await prisma.timPemeriksa.deleteMany();
    await prisma.riwayatChat.deleteMany();
    await prisma.riwayatStatus.deleteMany();
    await prisma.lampiran.deleteMany();
    await prisma.tiketAduan.deleteMany();
    await prisma.pelapor.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Legacy data cleared.');
  } catch (e) {
    console.log('⚠️ First run cleanup skipped.');
  }

  // 2. CREATE SUPERADMIN (DifaTech)
  const superAdminPassword = await bcrypt.hash('DifaTechAdmin2025!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@difatech.id' },
    update: {},
    create: {
      name: 'DifaTech Vendor Admin',
      email: 'admin@difatech.id',
      password: superAdminPassword,
      role: UserRole.SUPERADMIN,
      noWhatsapp: '628114403196', // Nomor Anda/Vendor
    },
  });
  console.log('👤 Superadmin Created');

  // 3. CREATE KEPALA PERWAKILAN
  const kaperPassword = await bcrypt.hash('KaperKaltara2025', 10);
  await prisma.user.upsert({
    where: { email: 'kepala@ombudsman.go.id' },
    update: {},
    create: {
      name: 'Maria Ulfah (Kepala Perwakilan)',
      email: 'kepala@ombudsman.go.id',
      password: kaperPassword,
      role: UserRole.KEPALA_PERWAKILAN,
      noWhatsapp: '628120000001', // Dummy WA Kaper
    },
  });
  console.log('👤 Kepala Perwakilan Created');

  // 4. CREATE ASISTEN PVL
  const pvlPassword = await bcrypt.hash('AsistenPVL123', 10);
  await prisma.user.upsert({
    where: { email: 'pvl@ombudsman.go.id' },
    update: {},
    create: {
      name: 'Budi Santoso (Asisten PVL)',
      email: 'pvl@ombudsman.go.id',
      password: pvlPassword,
      role: UserRole.ASISTEN_PVL,
      noWhatsapp: '628130000002', // Dummy WA PVL
    },
  });
  console.log('👤 Asisten PVL Created');

  // 5. CREATE ASISTEN PL
  const plPassword = await bcrypt.hash('AsistenPL123', 10);
  await prisma.user.upsert({
    where: { email: 'pl@ombudsman.go.id' },
    update: {},
    create: {
      name: 'Siti Aminah (Asisten PL)',
      email: 'pl@ombudsman.go.id',
      password: plPassword,
      role: UserRole.ASISTEN_PL,
      noWhatsapp: '628140000003', // Dummy WA PL
    },
  });
  console.log('👤 Asisten PL Created');

    // 6. CREATE ASISTEN PC
  const pcPassword = await bcrypt.hash('AsistenPC123', 10);
  await prisma.user.upsert({
    where: { email: 'pc@ombudsman.go.id' },
    update: {},
    create: {
      name: 'Rahmat Hidayat (Asisten PC)',
      email: 'pc@ombudsman.go.id',
      password: pcPassword,
      role: UserRole.ASISTEN_PC,
      noWhatsapp: '628150000004', // Dummy WA PC
    },
  });
  console.log('👤 Asisten PC Created');

  console.log('--- SEEDING COMPLETED SUCCESSFULLY ---');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });