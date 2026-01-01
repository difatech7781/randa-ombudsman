// contexts/MockRoleContext.tsx
"use client";

import React, { createContext, useContext, useState } from 'react';

// 1. DEFINISI ROLE (Sesuai Struktur Organisasi Ombudsman)
// Kita gunakan tipe data Union String agar TypeScript bisa membantu autocompletion
export type UserRole = 
  | 'SUPERADMIN'          // Dewa (Akses Semua)
  | 'KEPALA_PERWAKILAN'   // Pimpinan (View & Approve)
  | 'ASISTEN_PVL'         // Resepsionis (Input & Verifikasi)
  | 'ASISTEN_PL'          // Investigator (Periksa & BAP)
  | 'ASISTEN_PC';         // Analis (Cegah & Nilai)

// 2. DEFINISI FUNGSI PERMISSIONS (Matriks Kewenangan)
// Ini adalah "Logic Gate" yang menentukan tombol mana yang aktif/mati
interface MockRoleContextType {
  currentRole: UserRole;
  setRole: (role: UserRole) => void;
  canAccess: (feature: string) => boolean; // Fungsi sakti untuk cek izin
}

// Context Container
const MockRoleContext = createContext<MockRoleContextType | undefined>(undefined);

// 3. PROVIDER COMPONENT (Pembungkus Aplikasi)
export function MockRoleProvider({ children }: { children: React.ReactNode }) {
  // Default saat aplikasi dibuka pertama kali: SUPERADMIN (agar mudah dev)
  const [currentRole, setCurrentRole] = useState<UserRole>('SUPERADMIN');

  // LOGIKA IZIN AKSES (Permission Matrix)
  // Di sinilah regulasi PO-58, SK-244, dan Perkamen 7/2025 diterjemahkan jadi kode.
  const canAccess = (feature: string): boolean => {
    
    // Superadmin & Kepala Perwakilan biasanya bisa melihat segalanya (View All)
    if (currentRole === 'SUPERADMIN' || currentRole === 'KEPALA_PERWAKILAN') return true;

    switch (feature) {
      // --- FITUR PVL (SK-244) ---
      case 'input_laporan':      // Input Laporan Baru
      case 'verifikasi_formil':  // Cek Syarat Formil
        return currentRole === 'ASISTEN_PVL';

      // --- FITUR PL (PO-58) ---
      case 'upload_bap':         // Upload Berita Acara
      case 'draft_lhp':          // Susun LHP
      case 'case_management':    // Akses Menu Case Management
        return currentRole === 'ASISTEN_PL';

      // --- FITUR PC (Perkamen 7/2025) ---
      case 'analisa_opini':      // Edit Skor Opini
      case 'generate_surat':     // Buat Surat Peringatan Dini
      case 'strategic_analytics': // Akses Menu Analytics
        return currentRole === 'ASISTEN_PC';

      default:
        return false; // Default: Tolak akses jika tidak terdaftar
    }
  };

  return (
    <MockRoleContext.Provider value={{ currentRole, setRole: setCurrentRole, canAccess }}>
      {children}
    </MockRoleContext.Provider>
  );
}

// 4. CUSTOM HOOK (Cara Pakai di Komponen Lain)
// Agar kita tidak perlu tulis useContext(MockRoleContext) terus-menerus
export function useMockRole() {
  const context = useContext(MockRoleContext);
  if (context === undefined) {
    throw new Error('useMockRole must be used within a MockRoleProvider');
  }
  return context;
}