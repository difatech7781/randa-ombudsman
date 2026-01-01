// lib/ai-triage.ts
import { Maladministrasi } from "@prisma/client";

export interface AIAnalysisResult {
  dugaanMaladmin: Maladministrasi[];
  instansiTerlapor: string;
  ringkasanKronologi: string;
  urgensi: "TINGGI" | "SEDANG" | "RENDAH";
}

export async function analyzeChronology(text: string): Promise<AIAnalysisResult> {
  // Logic: Mengirim prompt ke LLM (OpenAI/Anthropic)
  // Prompt harus menyertakan definisi 10 Maladministrasi sesuai SK 244/2020
  
  const prompt = `
    Analisa teks laporan masyarakat berikut berdasarkan UU 37/2008:
    Teks: "${text}"
    
    Klasifikasikan ke dalam 10 jenis Maladministrasi:
    ${Object.values(Maladministrasi).join(", ")}
    
    Berikan output dalam format JSON:
    { "dugaan": [], "instansi": "", "ringkasan": "", "urgensi": "" }
  `;

  // Implementasi API Call ke AI Provider pilihan Anda (Vercel AI SDK)
  // Untuk saat ini kita return mock-up logic yang akan dihubungkan ke API
  return {
    dugaanMaladmin: ["PENUNDAAN_BERLARUT"], // Contoh hasil deteksi
    instansiTerlapor: "Dinas Kependudukan",
    ringkasanKronologi: "Pelapor mengeluhkan KTP yang tidak selesai selama 6 bulan.",
    urgensi: "TINGGI"
  };
}