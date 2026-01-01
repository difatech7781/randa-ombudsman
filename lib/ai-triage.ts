// lib/ai/triage-engine.ts
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai"; 
// import { RANDA_TRIAGE_PROMPT } from "./prompts"; // Pastikan file ini ada, atau hardcode prompt di bawah

// === SOLUSI BYPASS: DEFINISI LOKAL (JANGAN IMPORT DARI PRISMA) ===
// Kita definisikan ulang Enum di sini agar TypeScript tidak rewel.
// Pastikan ejaan SAMA PERSIS dengan di schema.prisma
export enum Maladministrasi {
  PENUNDAAN_BERLARUT = "PENUNDAAN_BERLARUT",
  TIDAK_MEMBERIKAN_PELAYANAN = "TIDAK_MEMBERIKAN_PELAYANAN",
  TIDAK_KOMPETEN = "TIDAK_KOMPETEN",
  PENYALAHGUNAAN_WEWENANG = "PENYALAHGUNAAN_WEWENANG",
  PENYIMPANGAN_PROSEDUR = "PENYIMPANGAN_PROSEDUR",
  PERMINTAAN_IMBALAN = "PERMINTAAN_IMBALAN",
  TIDAK_PATUT = "TIDAK_PATUT",
  BERPIHAK = "BERPIHAK",
  DISKRIMINASI = "DISKRIMINASI",
  KONFLIK_KEPENTINGAN = "KONFLIK_KEPENTINGAN"
}

// Interface Output AI
export interface AIAnalysisResult {
  dugaanMaladmin: Maladministrasi[]; // Sekarang merujuk ke Enum lokal di atas (Aman!)
  instansiTerlapor: string;
  ringkasanKronologi: string;
  urgensi: "TINGGI" | "SEDANG" | "RENDAH";
  confidenceScore: number;
}

// --- FUNGSI UTAMA ---
export async function analyzeChronology(text: string): Promise<AIAnalysisResult> {
  
  // Kita bypass import prompt eksternal dulu biar simple
  const SYSTEM_PROMPT = `
    Kamu adalah RANDA (Reasoning & Analysis for Data Aduan), asisten ahli Ombudsman RI.
    Tugasmu menganalisa laporan masyarakat berdasarkan UU 37/2008.
    
    Daftar Maladministrasi Valid:
    ${Object.values(Maladministrasi).join(", ")}
  `;

  // Contoh implementasi dummy dulu supaya tidak error build
  // Nanti di-uncomment kalau mau connect ke API beneran
  /*
  const { object } = await generateObject({
    model: openai("gpt-4-turbo"),
    system: SYSTEM_PROMPT,
    prompt: text,
    schema: z.object({ ... }) // Perlu zod schema disini
  });
  return object;
  */

  // MOCK RETURN (Biar Error Hilang & UI Jalan Dulu)
  return {
    dugaanMaladmin: [Maladministrasi.PENUNDAAN_BERLARUT],
    instansiTerlapor: "Terlapor Terdeteksi AI",
    ringkasanKronologi: "Analisa AI: Pelapor mengeluhkan lambatnya pelayanan.",
    urgensi: "SEDANG",
    confidenceScore: 0.85
  };
}