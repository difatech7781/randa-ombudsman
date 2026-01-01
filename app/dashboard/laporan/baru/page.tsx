"use client"; // Diperlukan untuk state management dan geolocation API

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitManualReport } from "../../actions/manual-input";
import { 
  Phone, 
  UserCircle, 
  FileText, 
  Send, 
  History, 
  Loader2, 
  MapPin, 
  Check, 
  ShieldCheck 
} from "lucide-react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Komponen Tombol Internal untuk menangani state Loading AI
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="bg-indigo-600 hover:bg-indigo-700 px-8 min-w-[200px] shadow-md shadow-indigo-100 transition-all active:scale-95 rounded-xl"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          AI Sedang Menganalisa...
        </>
      ) : (
        <>
          <Send className="w-4 h-4 mr-2" /> Simpan & Analisa AI
        </>
      )}
    </Button>
  );
}

export default function InputManualPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  // State untuk menyimpan koordinat Geo-Tagging
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isGettingLoc, setIsGettingLoc] = useState(false);

  // Fungsi untuk mengambil lokasi GPS dari browser
  const getGeoLocation = () => {
    setIsGettingLoc(true);
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung Geolocation");
      setIsGettingLoc(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsGettingLoc(false);
      },
      () => {
        alert("Gagal mengambil lokasi. Pastikan izin GPS aktif.");
        setIsGettingLoc(false);
      }
    );
  };

  async function handleFormAction(formData: FormData) {
    // Sisipkan data lokasi ke dalam formData sebelum dikirim ke server
    if (location) {
      formData.append("latitude", location.lat.toString());
      formData.append("longitude", location.lng.toString());
    }
    
    setError(null);
    const result = await submitManualReport(formData);
    
    if (result.success && result.ticketId) {
      // Redirect ke halaman detail tiket yang baru dibuat
      router.push(`/dashboard/laporan/${result.ticketId}`);
    } else {
      setError("Gagal memproses laporan. Pastikan koneksi API AI aktif.");
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Header Tahap Masterplan */}
      <div className="flex items-center gap-2 text-slate-500 mb-4">
        <History className="w-4 h-4" />
        <span className="text-sm font-medium uppercase tracking-wider">Tahap 3.1: Intake Manual + GeoTag</span>
      </div>

      <Card className="border-t-4 border-t-indigo-600 shadow-xl overflow-hidden">
        <CardHeader className="bg-white">
          <CardTitle className="text-2xl font-bold flex items-center gap-2 text-slate-900">
            <FileText className="text-indigo-600 w-6 h-6" /> Input Laporan Baru
          </CardTitle>
          <p className="text-slate-500 text-sm">
            Digitalisasi laporan dari telepon, surat, atau tamu datang langsung.
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={handleFormAction} className="space-y-6">
            
            {/* DATA PELAPOR */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-indigo-500" /> Nama Pelapor
                </label>
                <input 
                  name="nama" 
                  required 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900" 
                  placeholder="Contoh: Budi Santoso" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-indigo-500" /> Nomor WhatsApp
                </label>
                <input 
                  name="whatsapp" 
                  required 
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900" 
                  placeholder="628123456789" 
                />
              </div>
            </div>

            {/* SEKSI GEO-TAGGING */}
            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Lokasi Kejadian (Geo-Tagging)
                </label>
                <Button 
                  type="button" 
                  variant={location ? "secondary" : "default"}
                  size="sm"
                  onClick={getGeoLocation}
                  disabled={isGettingLoc}
                  className="rounded-lg text-xs"
                >
                  {isGettingLoc ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : null}
                  {location ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold">
                      <Check className="w-3 h-3" /> Lokasi Terkunci
                    </span>
                  ) : "Ambil Lokasi Sekarang"}
                </Button>
              </div>
              {location && (
                <div className="text-[10px] font-mono text-indigo-600 bg-white p-2 rounded-lg border border-indigo-100 inline-block">
                  Latitude: {location.lat.toFixed(6)}, Longitude: {location.lng.toFixed(6)}
                </div>
              )}
              <p className="text-[10px] text-slate-500 italic">
                Sangat disarankan saat melakukan On The Spot (OTS) agar pemetaan hotspot maladmin akurat.
              </p>
            </div>

            {/* SUMBER ADUAN */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Sumber Aduan</label>
              <select 
                name="sumber" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900"
              >
                <option value="DATANG_LANGSUNG">Datang Langsung (Front Office)</option>
                <option value="TELEPON">Telepon / Hotline</option>
                <option value="SURAT">Surat Resmi</option>
                <option value="OTS">Jemput Bola (On The Spot)</option>
              </select>
            </div>

            {/* KRONOLOGI */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Kronologi Laporan (Hasil Wawancara)</label>
              <textarea 
                name="kronologi" 
                rows={5} 
                required 
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all text-slate-900"
                placeholder="AI RANDA akan otomatis menganalisa Maladministrasi dan Instansi."
              />
            </div>

            {error && (
              <p className="text-sm text-rose-600 font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">
                ⚠️ {error}
              </p>
            )}

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => router.back()}
                className="rounded-xl px-6"
              >
                Batal
              </Button>
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>

      {/* COACH INSIGHT SECTION */}
      <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-2xl flex gap-4 shadow-sm">
        <div className="bg-white p-2 rounded-full h-fit shadow-sm">
          <ShieldCheck className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-indigo-900 mb-1">Coach Insight: Data Spasial</h4>
          <p className="text-xs text-indigo-700 leading-relaxed italic">
            Penambahan Geo-Tagging mempermudah pemetaan lokasi rawan pungli di Kaltara secara real-time.
          </p>
        </div>
      </div>
    </div>
  );
}