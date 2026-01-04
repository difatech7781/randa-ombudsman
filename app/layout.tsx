// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MockRoleProvider } from "@/contexts/MockRoleContext";
import RoleSwitcher from "@/components/debug/RoleSwitcher";
import AuthProvider from "@/components/providers/SessionProvider";

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
        {/* FIX: AuthProvider paling luar, MockRoleProvider di dalam agar session tersedia bagi simulator */}
        <AuthProvider>
          <MockRoleProvider>
            {children}
            {/* Widget switcher muncul di semua halaman untuk memudahkan QA */}
            <RoleSwitcher /> 
          </MockRoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}