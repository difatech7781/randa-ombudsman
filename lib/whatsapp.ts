// lib/whatsapp.ts

export async function sendWHAMessage(to: string, message: string) {
  try {
    // Contoh implementasi menggunakan Fetch ke Gateway (Sesuaikan Endpoint & Token Anda)
    console.log(`[WA-OUTGOING] Mengirim ke ${to}: ${message}`);

    /* const response = await fetch("https://api.whatsapp-gateway.com/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer TOKEN" },
      body: JSON.stringify({ target: to, message: message })
    });
    return response.ok;
    */
    
    return true; 
  } catch (error) {
    console.error("Gagal mengirim pesan WA:", error);
    return false;
  }
}