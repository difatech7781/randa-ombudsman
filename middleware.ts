// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // 1. Ambil Token & Path Tujuan
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    const role = token?.role as string;

    console.log(`[MIDDLEWARE] User: ${token?.email} | Role: ${role} | Path: ${path}`);

    // === RBAC MATRIX: ATURAN HAK AKSES DISINI ===

    // A. PROTEKSI HALAMAN SETTINGS (Hanya SUPERADMIN)
    if (path.startsWith("/dashboard/settings")) {
      if (role !== "SUPERADMIN") {
        // Kalau bukan Superadmin, tendang balik ke Dashboard utama
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // B. PROTEKSI HALAMAN USERS (Hanya SUPERADMIN & KEPALA)
    if (path.startsWith("/dashboard/users")) {
      const allowedRoles = ["SUPERADMIN", "KEPALA_PERWAKILAN"];
      if (!allowedRoles.includes(role)) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // C. PROTEKSI HALAMAN ANALYTICS (Semua Asisten Boleh)
    // (Contoh logic: jika Anda mau membatasi fitur tertentu di masa depan)

    return NextResponse.next();
  },
  {
    callbacks: {
      // Fungsi ini menentukan: "Apakah user BOLEH lanjut?"
      // Return true = Lanjut, Return false = Redirect ke /login
      authorized: ({ token }) => !!token, 
    },
    pages: {
      signIn: "/login", // Halaman login custom Anda
    },
  }
);

// Tentukan Route mana saja yang dijaga oleh Satpam ini
export const config = { 
  matcher: [
    // Lindungi semua route di bawah /dashboard
    "/dashboard/:path*",
    
    // Opsional: Lindungi route API sensitif kalau perlu
    // "/api/admin/:path*" 
  ] 
};