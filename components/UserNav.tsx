// components/UserNav.tsx
"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import { User, LogOut, Settings, ShieldAlert } from "lucide-react";
import { useMockRole } from "@/contexts/MockRoleContext";
import Link from "next/link"; // IMPORT WAJIB UNTUK NAVIGASI

export function UserNav() {
  const { data: session } = useSession();
  const { currentRole, isSimulated } = useMockRole(); 
  
  const user = session?.user;

  // Mendapatkan Inisial Nama User
  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2)
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-indigo-500 transition-all focus-visible:ring-indigo-500 outline-none">
          <Avatar className="h-10 w-10 border border-slate-200 shadow-sm">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback className={`${isSimulated ? 'bg-amber-600 animate-pulse' : 'bg-indigo-600'} text-white font-bold transition-all`}>
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 rounded-[20px] shadow-2xl border-slate-100" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-black leading-none text-slate-900 uppercase tracking-tighter italic">
              {user?.name || "User RANDA"}
            </p>
            <p className="text-[10px] leading-none text-slate-400 font-medium tracking-tight">
              {user?.email}
            </p>
            
            {/* Badge Status Role Dinamis */}
            <div className={`mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${
              isSimulated 
                ? 'bg-amber-50 text-amber-700 border-amber-100 animate-in fade-in zoom-in' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-100'
            }`}>
              {isSimulated && <ShieldAlert className="w-3 h-3 animate-pulse" />}
              {isSimulated ? `SIMULATED: ${currentRole.replace('_', ' ')}` : currentRole.replace('_', ' ')}
            </div>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-slate-50 mx-1" />
        
        {/* FIX: MENGAITKAN TOMBOL KE HALAMAN NYATA MENGGUNAKAN LINK */}
        <DropdownMenuGroup className="p-1">
          <DropdownMenuItem asChild>
            <Link 
              href="/dashboard/profile" 
              className="flex items-center w-full rounded-xl focus:bg-slate-50 cursor-pointer text-xs font-bold text-slate-600 p-3 transition-colors outline-none"
            >
              <User className="mr-3 h-4 w-4 text-slate-400" />
              <span>Profile Saya</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link 
              href="/dashboard/settings" 
              className="flex items-center w-full rounded-xl focus:bg-slate-50 cursor-pointer text-xs font-bold text-slate-600 p-3 transition-colors outline-none"
            >
              <Settings className="mr-3 h-4 w-4 text-slate-400" />
              <span>Pengaturan</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="bg-slate-50 mx-1" />
        
        <div className="p-1">
          <DropdownMenuItem 
            className="rounded-xl text-red-600 focus:text-white focus:bg-red-600 cursor-pointer font-black text-[10px] uppercase tracking-widest p-3 transition-all outline-none"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Keluar Sistem</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}