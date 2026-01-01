// app/dashboard/users/page.tsx
import { getAllUsers } from "./actions";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, UserPlus, ShieldCheck, Mail, MoreVertical, 
  Trash2, Edit3, Key 
} from "lucide-react";
import CreateUserModal from "@/components/CreateUserModal";

export default async function UserManagementPage() {
  const users = await getAllUsers();

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

      {/* USER DIRECTORY TABLE */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-none">
              <TableHead className="text-[10px] font-black uppercase pl-8 h-14">Personal Identity</TableHead>
              <TableHead className="text-[10px] font-black uppercase h-14">Authorization Role</TableHead>
              <TableHead className="text-[10px] font-black uppercase h-14">Registered Date</TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase pr-8 h-14">Security Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="group hover:bg-slate-50/50 transition-colors border-slate-50">
                <TableCell className="pl-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-xs">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-800 uppercase italic tracking-tighter leading-none">
                        {user.nama}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-slate-400">
                        <Mail className="w-3 h-3" /> {user.email}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`text-[8px] font-black uppercase border-slate-200 shadow-sm px-3 py-1 bg-white ${
                    user.role === 'SUPERADMIN' ? 'text-rose-600 border-rose-100' : 
                    user.role === 'KEPALA_PERWAKILAN' ? 'text-amber-600' : 'text-indigo-600'
                  }`}>
                    <ShieldCheck className="w-3 h-3 mr-1.5" /> {user.role.replace('_', ' ')}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    {new Date(user.createdAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                </TableCell>
                <TableCell className="text-right pr-8">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                      <Key className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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