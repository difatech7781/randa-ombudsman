"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card } from "@/components/ui/card";

// Fix icon leaflet yang sering hilang di Next.js
const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapDashboard({ points }: { points: any[] }) {
  // Koordinat pusat Kaltara (Tanjung Selor)
  const center: [number, number] = [2.841, 117.365];

  return (
    <Card className="p-2 overflow-hidden rounded-2xl border-slate-200 shadow-lg">
      <div className="h-[400px] w-full rounded-xl overflow-hidden">
        <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {points.map((p) => (
            p.latitude && p.longitude && (
              <Marker key={p.id} position={[p.latitude, p.longitude]} icon={customIcon}>
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold text-indigo-600">Tiket #{p.id}</p>
                    <p className="font-medium text-slate-800">{p.pelapor?.namaLengkap}</p>
                    <p className="italic text-slate-500 mt-1">"{p.kronologi.substring(0, 50)}..."</p>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </div>
    </Card>
  );
}