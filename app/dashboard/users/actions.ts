// app/dashboard/users/actions.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' }
  });
}