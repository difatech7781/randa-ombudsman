"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getFormilDeadline, getMateriilDeadline } from "@/lib/compliance";
import { analyzeChronology } from "@/lib/ai-triage";
import { Prisma } from "@prisma/client"; 

// ==========================================
// 1. ADVANCED TYPING ARCHITECTURE
// ==========================================

// Kita definisikan "Bentuk Query" di sini supaya TypeScript paham struktur data yang complex.
// Ini solusi untuk error: Property '_count' does not exist...
const ticketWithDetailsQuery = Prisma.validator<Prisma.TiketAduanDefaultArgs>()({
  include: {
    pelapor: {
      include: {
        _count: {
          select: { tikets: true } // <-- INI DIA FIX-NYA (Ambil jumlah tiket pelapor)
        }
      }
    },
    riwayatStatus: {
      orderBy: { createdAt: 'desc' }
    },
    lampiran: true,
    pesanHistory: {
      orderBy: { createdAt: 'asc' }
    }
  }
});

// Export Type "Sakti" ini untuk dipakai di Page.tsx
// Type ini otomatis sadar kalau ada field 'softwareUsed' (jika sudah di-push ke DB) dan '_count'
export type TicketWithDetails = Prisma.TiketAduanGetPayload<typeof ticketWithDetailsQuery>;


// ==========================================
// 2. DATA FETCHER (READ)
// ==========================================

// Function baru untuk mengambil data detail tiket dengan Tipe yang benar
export async function getTicketById(id: string): Promise<TicketWithDetails | null> {
  const ticket = await prisma.tiketAduan.findUnique({
    where: { id },
    include: ticketWithDetailsQuery.include // <-- PENTING: Harus match dengan validator di atas
  });

  return ticket;
}


// ==========================================
// 3. SERVER ACTIONS (WRITE/MUTATIONS)
// ==========================================

export async function createTicketFromWA(data: any) {
  // === INI BAGIAN YANG HILANG (STEP 0) ===
  // Kita harus define dulu variabelnya sebelum dipakai di bawah
  const now = new Date();
  const deadlineFormil = getFormilDeadline(now);   // Hitung SLA 14 hari
  const deadlineMateriil = getMateriilDeadline(now); // Hitung SLA 30 hari
  // ========================================

  // 1. Jalankan AI Triage Engine
  const analysis = await analyzeChronology(data.kronologi);

  // 2. Simpan ke database dengan tagging AI
  const ticket = await prisma.tiketAduan.create({
    data: {
      pelaporId: data.pelaporId,
      kronologi: data.kronologi,
      sumberAduan: "WHATSAPP_RANDA",
      dugaanMaladmin: analysis.dugaanMaladmin,
      harapanPelapor: analysis.instansiTerlapor, 
      status: "VERIFIKASI_FORMIL",
      
      // Sekarang variabel ini sudah ada isinya (Valid!)
      deadlineFormil,   
      deadlineMateriil, 
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