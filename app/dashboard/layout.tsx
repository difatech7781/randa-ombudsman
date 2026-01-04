// app/dashboard/layout.tsx
import TopNavbar from "@/components/TopNavbar";
import { prisma } from "@/lib/prisma";
import DashboardBreadcrumb from "@/components/DashboardBreadcrumb";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. HITUNG TIKET YANG BUTUH VERIFIKASI
  let pvlCount = 0;
  try {
    pvlCount = await prisma.tiketAduan.count({
      where: {
        // Hanya hitung yang statusnya VERIFIKASI_FORMIL (Inbox Asisten PVL)
        status: {
          in: ['VERIFIKASI_FORMIL'] 
        }
      }
    });
  } catch (e) {
    console.error("Gagal fetch badge count:", e);
  }

  return (
    <div className="min-h-screen bg-[#fcfcfd]">
      
      {/* 2. OPER DATA KE TOPNAVBAR */}
      {/* Badge merah akan muncul jika pvlCount > 0 */}
      <TopNavbar pvlCount={pvlCount} />
      
      {/* 3. CONTENT AREA */}
      <main className="pt-20 pb-8 px-8 max-w-[1600px] w-full mx-auto">
        <DashboardBreadcrumb />
        <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
          {children}
        </div>
      </main>
    </div>
  );
}