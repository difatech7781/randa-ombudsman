// app/dashboard/laporan/actions.ts Verbatim Update

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getFormilDeadline, getMateriilDeadline } from "@/lib/compliance"; // Import Logika SLA
import { analyzeChronology } from "@/lib/ai-triage";


export async function createTicketFromWA(data: any) {
  // 1. Jalankan AI Triage Engine
  const analysis = await analyzeChronology(data.kronologi);

  // 2. Simpan ke database dengan tagging AI
  const ticket = await prisma.tiketAduan.create({
    data: {
      pelaporId: data.pelaporId,
      kronologi: data.kronologi,
      sumberAduan: "WHATSAPP_RANDA",
      dugaanMaladmin: analysis.dugaanMaladmin, // Hasil deteksi otomatis
      harapanPelapor: analysis.instansiTerlapor, // Deteksi instansi
      status: "VERIFIKASI_FORMIL",
      // ... SLA logic yang sudah ada
    }
  });

  return ticket;
}

export async function updateStatusTiket(formData: FormData) {
  const ticketId = formData.get("ticketId") as string;
  const newStatus = formData.get("status") as any;
  const catatan = formData.get("catatan") as string;
  const adminName = "Admin RANDA";

  // 1. Ambil data Pelapor untuk keperluan Notifikasi WA
  const ticket = await prisma.tiketAduan.findUnique({
    where: { id: ticketId },
    include: { pelapor: true }
  });

  if (!ticket) throw new Error("Tiket tidak ditemukan");

  // 2. Transaksi Database: Update Status & Log Riwayat
  await prisma.$transaction([
    prisma.tiketAduan.update({
      where: { id: ticketId },
      data: { status: newStatus }
    }),
    prisma.riwayatStatus.create({
      data: {
        ticketId: ticketId,
        statusLama: ticket.status,
        statusBaru: newStatus,
        keterangan: catatan,
        updatedBy: adminName
      }
    })
  ]);

  // 3. INTEGRASI WHATSAPP: Kirim notifikasi otomatis
  if (newStatus === "MENUNGGU_PLENO") {
    try {
      const waMessage = `Halo Pak/Bu ${ticket.pelapor.namaLengkap}, laporan Anda dengan ID #${ticket.id} saat ini telah diteruskan ke tahap Rapat Pleno Pimpinan. Catatan: ${catatan || 'Sedang dalam proses evaluasi'}. Terima kasih - Ombudsman RI Kaltara.`;
      
      console.log(`[WA NOTIF] Mengirim ke ${ticket.pelapor.noWhatsapp}: ${waMessage}`);
    } catch (error) {
      console.error("Gagal mengirim notifikasi WA:", error);
    }
  }

  revalidatePath(`/dashboard/laporan/${ticketId}`);
}

// FUNGSI BARU: Create Ticket dengan SLA Compliance SK 244/2020
export async function createTicketWithSLA(formData: FormData) {
  const now = new Date();
  
  // Hitung deadline otomatis berdasarkan hari kerja (SOP Ombudsman)
  const deadlineFormil = getFormilDeadline(now); 
  const deadlineMateriil = getMateriilDeadline(now);

  const pelaporId = formData.get("pelaporId") as string;
  const kronologi = formData.get("kronologi") as string;
  const sumberAduan = formData.get("sumberAduan") as any;

  const ticket = await prisma.tiketAduan.create({
    data: {
      pelaporId,
      kronologi,
      sumberAduan,
      status: "VERIFIKASI_FORMIL",
      deadlineFormil,   // Locked 14 Hari Kerja
      deadlineMateriil, // Locked 30 Hari Kerja
    }
  });

  revalidatePath("/dashboard");
  return ticket;
}

export async function kirimBalasan(formData: FormData) {
  const tiketId = formData.get("tiketId") as string;
  const pesan = formData.get("pesan") as string;

  await prisma.pesanHistory.create({
    data: {
      tiketId,
      pesan,
      pengirim: "ADMIN",
    },
  });

  revalidatePath(`/dashboard/laporan/${tiketId}`);
}