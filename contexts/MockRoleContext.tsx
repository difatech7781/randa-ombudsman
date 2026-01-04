// contexts/MockRoleContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from "next-auth/react";

// 1. DEFINISI ROLE (Sesuai Struktur Organisasi Ombudsman) [cite: 2]
export type UserRole = 
  | 'SUPERADMIN'          // Dewa (Akses Semua)
  | 'KEPALA_PERWAKILAN'   // Pimpinan (View & Approve)
  | 'ASISTEN_PVL'         // Resepsionis (Input & Verifikasi)
  | 'ASISTEN_PL'          // Investigator (Periksa & BAP)
  | 'ASISTEN_PC';         // Analis (Cegah & Nilai)

// 2. DEFINISI FUNGSI PERMISSIONS (Matriks Kewenangan)
interface MockRoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  canAccess: (feature: string) => boolean; 
  isSimulated: boolean; // Flag untuk indikator UI
}

const MockRoleContext = createContext<MockRoleContextType | undefined>(undefined);

// 3. PROVIDER COMPONENT (Pembungkus Aplikasi)
export function MockRoleProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPERADMIN');
  const [isSimulated, setIsSimulated] = useState(false);

  // LOGIKA SINKRONISASI:
  // Jika user login, otomatis gunakan role asli dari DB kecuali simulator diaktifkan
  useEffect(() => {
    if (session?.user?.role && !isSimulated) {
      setCurrentRole(session.user.role as UserRole);
    }
  }, [session, isSimulated]);

  const setRole = (role: UserRole) => {
    setCurrentRole(role);
    setIsSimulated(true); // Tandai bahwa user sedang melakukan simulasi manual
  };

  const canAccess = (feature: string): boolean => {
    // Superadmin & Kepala Perwakilan biasanya bisa melihat segalanya [cite: 2]
    if (currentRole === 'SUPERADMIN' || currentRole === 'KEPALA_PERWAKILAN') return true;

    switch (feature) {
      // --- FITUR PVL (SK-244) ---
      case 'input_laporan':      
      case 'verifikasi_formil':  
        return currentRole === 'ASISTEN_PVL';

      // --- FITUR PL (PO-58) ---
      case 'upload_bap':         
      case 'draft_lhp':          
      case 'case_management':    
        return currentRole === 'ASISTEN_PL';

      // --- FITUR PC (Perkamen 7/2025) ---
      case 'analisa_opini':      
      case 'generate_surat':     
      case 'strategic_analytics': 
        return currentRole === 'ASISTEN_PC';

      default:
        return false; 
    }
  };

  return (
    <MockRoleContext.Provider value={{ currentRole, setRole, canAccess, isSimulated }}>
      {children}
    </MockRoleContext.Provider>
  );
}

// 4. CUSTOM HOOK
export function useMockRole() {
  const context = useContext(MockRoleContext);
  if (context === undefined) {
    throw new Error('useMockRole must be used within a MockRoleProvider');
  }
  return context;
}