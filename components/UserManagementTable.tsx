// components/UserManagementTable.tsx

"use client"; // Opsional: Tambahkan ini kalau ada interaksi (onClick dll) nanti

// 1. IMPORT KOMPONEN UI DARI SHADCN (Wajib ada)
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// 2. IMPORT ICON & UTILS (Opsional, buat jaga-jaga kalau mau dipoles)
import { MoreHorizontal, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserManagementTable({ users }: { users: any[] }) {
  return (
    <div className="rounded-md border border-slate-200">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama/Email</TableHead>
            <TableHead>Role / Keasistenan</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="font-bold text-slate-900">{user.name || "No Name"}</div>
                <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
              </TableCell>
              <TableCell>
                {/* Logic Warna Badge Sederhana */}
                <Badge 
                  variant={user.role === 'SUPERADMIN' ? 'default' : 'outline'}
                  className="text-[10px] uppercase font-bold"
                >
                  {user.role ? user.role.replace('_', ' ') : 'USER'}
                </Badge>
              </TableCell>
              <TableCell className="text-xs font-mono text-slate-600">
                {user.noWhatsapp || '-'}
              </TableCell>
              <TableCell className="text-right">
                 {/* Placeholder Action Button */}
                 <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4 text-slate-500" />
                 </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}