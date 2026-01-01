import { GoogleGenerativeAI } from "@google/generative-ai";

// Pastikan API Key ada
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ GEMINI_API_KEY belum dipasang di .env!");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function analyzeComplaint(text: string) {
  // KITA GUNAKAN MODEL YANG TERSEDIA DI AKUN ANDA:
  // "models/gemini-2.5-flash" -> Kita ambil nama belakangnya saja
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash" 
  });

  const prompt = `
    Kamu adalah RANDA, AI Ombudsman. Analisa laporan warga ini.
    
    PESAN: "${text}"

    Instruksi Output:
    Hanya berikan output JSON murni tanpa markdown (jangan pakai \`\`\`json).
    Format JSON:
    {
      "ringkasan": "Ringkasan 1 kalimat",
      "kategori_instansi": "Pilih satu: [PEMERINTAH_DAERAH, KEMENTERIAN, KEPOLISIAN, BPN_AGRARIA, BUMN_BUMD, LAINNYA]",
      "dugaan_maladmin": ["List dugaan maladmin, contoh: Penundaan Berlarut"],
      "is_rco": false,
      "nama_instansi": "Nama instansi terlapor atau '-'",
      "sentiment": "Negatif/Netral"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResult = response.text();

    // PEMBERSIHAN FORMAT
    textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();

    return JSON.parse(textResult);
  } catch (error) {
    console.error("⚠️ Error Gemini:", error);
    // Fallback Data
    return {
      ringkasan: "Gagal analisa AI",
      dugaan_maladmin: ["Perlu Cek Manual"],
      nama_instansi: "-",
      is_rco: false
    };
  }
}