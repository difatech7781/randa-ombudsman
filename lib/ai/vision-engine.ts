// lib/ai/vision-engine.ts

import vision from "@google-cloud/vision";
import ExifReader from "exifreader";
import sharp from "sharp"; // Engine Enhancement

// Inisialisasi client menggunakan kredensial dari ENV
const client = new vision.ImageAnnotatorClient();

/**
 * Memproses foto KTP: Enhancement -> Forensics -> OCR
 * @param buffer Buffer gambar mentah dari pelapor
 */
export async function extractKTPData(buffer: Buffer) {
  try {
    let isEdited = false;
    let softwareUsed = "None";

    // 1. DIGITAL FORENSICS: Metadata Check sebelum diolah Sharp
    try {
      const tags = ExifReader.load(buffer);
      if (tags['Software']) {
        isEdited = true;
        softwareUsed = tags['Software'].description || "Unknown Software";
      }
    } catch (exifError) {
      console.warn("[AI-VISION] Gagal membaca metadata Exif");
    }

    // 2. AI PHOTO ENHANCEMENT: Normalisasi Citra Buram/Gelap
    // Mengoptimalkan Buffer agar teks lebih kontras untuk Google Vision
    const enhancedBuffer = await sharp(buffer)
      .resize(1200) // Standarisasi resolusi untuk OCR optimal
      .grayscale()  // Meningkatkan kontras teks terhadap background
      .normalize()  // Memperbaiki eksposur (foto gelap jadi terang)
      .sharpen()    // Memperjelas tepi karakter teks
      .toBuffer();

    // 3. OCR EXECUTION: Kirim Enhanced Buffer ke Google Cloud Vision
    // FIX: Bungkus 'content' di dalam properti 'image' sesuai format API Google
    const [result] = await client.textDetection({ 
      image: { content: enhancedBuffer } 
    });
    
    const fullText = result.fullTextAnnotation?.text || "";

    if (!fullText) return null;

    // 4. LOGIC: Ekstraksi NIK (16 Digit)
    const nikMatch = fullText.match(/\d{16}/);
    
    // 5. LOGIC: Ekstraksi Nama (Mencari teks setelah keyword 'Nama')
    const lines = fullText.split('\n');
    let detectedName = "";
    const nameIndex = lines.findIndex(l => l.toUpperCase().includes("NAMA"));
    
    if (nameIndex !== -1 && lines[nameIndex + 1]) {
      detectedName = lines[nameIndex + 1]
        .replace(/[:|=]/g, "") // Bersihkan karakter sampah OCR
        .trim()
        .toUpperCase();
    }

    return {
      nik: nikMatch ? nikMatch[0] : null,
      nama: detectedName,
      isEdited,
      isEnhanced: true, // Indikator bahwa Enhancement berhasil
      softwareUsed,
      raw: fullText // Simpan untuk audit trail jika perlu
    };
  } catch (error) {
    console.error("AI Vision Engine Error:", error);
    return null;
  }
}