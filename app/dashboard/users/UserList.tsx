// app/dashboard/users/UserList.tsx
"use client";

import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ShieldCheck, Mail, Trash2, Key, Loader2, AlertTriangle 
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { deleteUser, resetUserPassword } from "./actions"; // Pastikan file actions.ts ada

interface UserListProps {
  users: any[];
  currentUserRole: string;
}

export default function UserList({ users, currentUserRole }: UserListProps) {
  return (
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
            <UserRow key={user.id} user={user} canManage={currentUserRole === "SUPERADMIN"} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// KOMPONEN BARIS (ROW) TERPISAH UNTUK STATE ISOLATED
function UserRow({ user, canManage }: { user: any; canManage: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleReset = async () => {
    startTransition(async () => {
      const res = await resetUserPassword(user.email);
      setIsResetOpen(false);
      alert(res.message); // Bisa diganti Toast
    });
  };

  const handleDelete = async () => {
    startTransition(async () => {
      const res = await deleteUser(user.email);
      setIsDeleteOpen(false);
      alert(res.message);
    });
  };

  return (
    <TableRow className="group hover:bg-slate-50/50 transition-colors border-slate-50">
      <TableCell className="pl-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-10 w-10 border border-slate-200">
            <AvatarImage src={user.image} />
            <AvatarFallback className="bg-indigo-50 text-indigo-600 font-black text-xs">
              {(user.name || "U").substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="text-xs font-black text-slate-800 uppercase italic tracking-tighter leading-none">
              {user.name || "User"}
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
          
          {/* TOMBOL RESET PASSWORD */}
          <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!canManage || isPending} className="h-9 w-9 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50">
                <Key className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-indigo-600" /> Reset Password?
                </DialogTitle>
                <DialogDescription>
                  Password untuk <span className="font-bold">{user.email}</span> akan di-reset ke default.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsResetOpen(false)}>Batal</Button>
                <Button onClick={handleReset} disabled={isPending} className="bg-indigo-600 text-white">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Sekarang"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* TOMBOL HAPUS USER */}
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!canManage || isPending} className="h-9 w-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl border-l-4 border-rose-500">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-rose-600">
                  <AlertTriangle className="w-5 h-5" /> Hapus User Permanen?
                </DialogTitle>
                <DialogDescription>
                  Aksi ini tidak bisa dibatalkan. User <span className="font-bold">{user.email}</span> akan dihapus dari database.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Batal</Button>
                <Button onClick={handleDelete} disabled={isPending} variant="destructive" className="bg-rose-600">
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Hapus User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </TableCell>
    </TableRow>
  );
}