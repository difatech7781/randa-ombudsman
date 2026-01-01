// app/api/auth/[...nextauth]/route.ts

import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Menggunakan konfigurasi terpusat

/**
 * Route Handler untuk NextAuth
 * Hanya mengekspor metode GET dan POST sesuai standar Turbopack
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };