// components/SpeedometerCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Timer, Zap, AlertCircle } from "lucide-react";

export default function SpeedometerCard({ avgDays }: { avgDays: number }) {
  const isDelayed = avgDays > 14; // Standar SOP Ombudsman
  const isExcellent = avgDays <= 7 && avgDays > 0;

  return (
    <Card className={`border-l-4 ${isDelayed ? 'border-l-rose-500' : isExcellent ? 'border-l-emerald-500' : 'border-l-amber-500'} shadow-sm bg-white transition-all hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kecepatan Verifikasi</CardTitle>
        <Timer className={`h-4 w-4 ${isDelayed ? 'text-rose-500 animate-pulse' : 'text-indigo-500'}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-black text-slate-900">{avgDays || "0"}</div>
          <div className="text-sm font-bold text-slate-500 uppercase italic">Hari</div>
        </div>
        
        <div className="mt-4 space-y-3">
          {/* Visual Gauge Line */}
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
            <div 
              className={`h-full transition-all duration-1000 ${isExcellent ? 'bg-emerald-500' : isDelayed ? 'bg-rose-500' : 'bg-amber-500'}`} 
              style={{ width: `${Math.min((avgDays / 21) * 100, 100)}%` }}
            />
          </div>

          <div className="flex items-center gap-2">
            {isExcellent ? (
              <Zap className="w-3 h-3 text-emerald-500 fill-emerald-500" />
            ) : isDelayed ? (
              <AlertCircle className="w-3 h-3 text-rose-500" />
            ) : (
              <Timer className="w-3 h-3 text-amber-500" />
            )}
            <p className={`text-[9px] font-black uppercase tracking-tight ${isDelayed ? 'text-rose-600' : 'text-emerald-600'}`}>
              {avgDays === 0 ? "Belum Ada Data" : isExcellent ? "Performa Unggul" : isDelayed ? "Melebihi Batas SOP" : "Sesuai Standar"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}