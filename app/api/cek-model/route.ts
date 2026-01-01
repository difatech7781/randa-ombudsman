import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "API Key tidak ditemukan di .env" });
  }

  try {
    // Kita tanya langsung ke Google: "List Models"
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { method: "GET" }
    );

    const data = await response.json();
    
    // Filter hanya ambil nama modelnya saja biar gampang dibaca
    const availableModels = data.models?.map((m: any) => m.name) || data;

    return NextResponse.json({ 
      status: "Check Selesai",
      your_models: availableModels 
    });

  } catch (error) {
    return NextResponse.json({ error: "Gagal connect ke Google", details: error });
  }
}