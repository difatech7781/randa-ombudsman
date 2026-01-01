// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Ganti ke Inter
import "./globals.css";
import { MockRoleProvider } from "@/contexts/MockRoleContext";
import RoleSwitcher from "@/components/debug/RoleSwitcher";


// Inisialisasi Inter dengan variabel CSS agar bisa dibaca Tailwind
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "RANDA - Ombudsman Kaltara",
  description: "Real-time Monitoring & Ingest Data Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Bungkus Children dengan Provider Mock */}
        <MockRoleProvider>
          {children}
          {/* Pasang Widget Role Switcher agar muncul di semua halaman */}
          <RoleSwitcher /> 
        </MockRoleProvider>
      </body>
    </html>
  );
}