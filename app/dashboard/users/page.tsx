// app/dashboard/users/page.tsx
import { getAllUsers } from "./actions";
import { Users, ShieldCheck } from "lucide-react";
import CreateUserModal from "@/components/CreateUserModal";
import UserList from "./UserList"; // INTEGRASI KOMPONEN BARU

export default async function UserManagementPage() {
  const users = await getAllUsers();
  const currentRole = "SUPERADMIN"; // Nanti ganti dengan session asli

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen selection:bg-indigo-100">
      
      {/* HEADER: Administrative Authority */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Identity Provider</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            User Management
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Access Control & Staff Directory
          </p>
        </div>
        
        <CreateUserModal />
      </div>

      {/* USER DIRECTORY TABLE (INTERACTIVE) */}
      <UserList users={users} currentUserRole={currentRole} />

      {/* AUDIT LOG FOOTER */}
      <div className="p-6 bg-slate-900 rounded-[32px] text-white flex justify-between items-center overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldCheck className="w-24 h-24" />
        </div>
        <div className="space-y-1 relative z-10">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Security Compliance</p>
          <p className="text-xs font-medium text-slate-300">Seluruh penambahan staf baru akan tercatat dalam System Audit Log DifaTech.</p>
        </div>
      </div>
    </div>
  );
}