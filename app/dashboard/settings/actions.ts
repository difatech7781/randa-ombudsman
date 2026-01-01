"use server";
import { prisma } from "@/lib/prisma";
import { hash, compare } from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function updatePassword(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  const user = await prisma.user.findUnique({ where: { email: session.user.email! } });
  if (!user) throw new Error("User not found");

  const isPasswordValid = await compare(currentPassword, user.password);
  if (!isPasswordValid) return { error: "Password lama salah" };

  const hashedPassword = await hash(newPassword, 12);
  await prisma.user.update({
    where: { email: session.user.email! },
    data: { password: hashedPassword }
  });

  return { success: "Password berhasil diperbarui" };
}