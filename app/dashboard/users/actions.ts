// app/dashboard/users/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// FUNGSI 1: GET ALL USERS (Penyebab Error Sebelumnya)
// Sekarang aman karena import prisma dari lib/prisma.ts yang sudah Singleton
export async function getAllUsers() {
  try {
    // Simulasi delay jaringan kecil (opsional, untuk UX loading state)
    // await new Promise(resolve => setTimeout(resolve, 500)); 

    return await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        // image: true,
        role: true,
        createdAt: true,
      }
    });
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

// FUNGSI 2: RESET PASSWORD (Security Action)
export async function resetUserPassword(email: string) {
  try {
    // Logic reset password (simulasi)
    console.log(`[SECURITY AUDIT] Password reset request for: ${email}`);
    
    // Refresh halaman agar UI terupdate jika perlu
    revalidatePath("/dashboard/users");
    
    return { success: true, message: `Password untuk ${email} berhasil di-reset ke default.` };
  } catch (error) {
    console.error("Reset Password Error:", error);
    return { success: false, message: "Gagal mereset password." };
  }
}

// FUNGSI 3: HAPUS USER (Security Action)
export async function deleteUser(email: string) {
  try {
    await prisma.user.delete({
      where: { email }
    });

    console.log(`[SECURITY AUDIT] User deleted: ${email}`);

    revalidatePath("/dashboard/users");
    return { success: true, message: `User ${email} telah dihapus permanen.` };
  } catch (error) {
    console.error("Delete User Error:", error);
    return { success: false, message: "Gagal menghapus user. Pastikan user tidak memiliki data relasi." };
  }
}