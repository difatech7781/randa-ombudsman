// lib/ai/triage-engine.ts
import { Maladministrasi } from "@prisma/client";
import { RANDA_TRIAGE_PROMPT } from "./prompts";
import { openai } from "@ai-sdk/openai"; // atau provider lain
import { generateObject } from "ai";
import { z } from "zod";

export async function runAITriage(kronologi: string) {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"), // Gunakan model terbaru untuk akurasi yurisprudensi
      schema: z.object({
        dugaanMaladmin: z.array(z.nativeEnum(Maladministrasi)),
        instansiTerdeteksi: z.string(),
        ringkasan: z.string(),
        urgensi: z.enum(["TINGGI", "SEDANG", "RENDAH"]),
        reasoning: z.string(),
      }),
      system: RANDA_TRIAGE_PROMPT,
      prompt: `Berikut adalah kronologi laporan: "${kronologi}"`,
    });

    return object;
  } catch (error) {
    console.error("AI Triage Error:", error);
    // Return default object jika AI gagal agar sistem tidak crash
    return {
      dugaanMaladmin: [],
      instansiTerdeteksi: "Gagal mendeteksi",
      ringkasan: "Gagal memproses kronologi",
      urgensi: "SEDANG",
      reasoning: "System error"
    };
  }
}