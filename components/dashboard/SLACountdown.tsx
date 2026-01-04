// components/dashboard/SLACountdown.tsx
"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle, Flame, CheckCircle2 } from "lucide-react";

interface SLACountdownProps {
  deadline?: Date | null;  // Mode 1: Tiket Satuan (Realtime Clock)
  avgDays?: number;        // Mode 2: Pipeline Stats (Static Number)
  limit?: number;          // Batas SLA (Default 14 Hari)
}

export default function SLACountdown({ deadline, avgDays, limit = 14 }: SLACountdownProps) {
  
  // ---------------------------------------------------------------------------
  // MODE 1: PIPELINE STATS (Static Average) - DIGUNAKAN DI DASHBOARD UTAMA
  // Menangani input 'avgDays' dari IntegratedPipelineCard
  // ---------------------------------------------------------------------------
  if (typeof avgDays === "number") {
    const remaining = limit - avgDays;
    const isBreach = remaining < 0; // Jika sisa hari minus, berarti telat
    const isWarning = remaining <= 3 && remaining >= 0; // Warning H-3

    // KONDISI 1: SLA BREACH (MERAH)
    if (isBreach) {
      return (
        <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-3 py-1.5 rounded-lg animate-pulse">
          <Flame className="w-4 h-4 text-rose-600 fill-rose-600" />
          <div className="flex flex-col leading-none">
            <span className="text-[8px] font-black uppercase tracking-widest">SLA BREACH</span>
            <span className="text-[10px] font-bold">Rata-rata telat +{Math.abs(remaining)} Hari</span>
          </div>
        </div>
      );
    }

    // KONDISI 2: WARNING (KUNING)
    if (isWarning) {
      return (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <div className="flex flex-col leading-none">
            <span className="text-[8px] font-black uppercase tracking-widest">HAMPIR LEWAT</span>
            <span className="text-[10px] font-bold">Sisa {remaining} Hari Aman</span>
          </div>
        </div>
      );
    }

    // KONDISI 3: AMAN (HIJAU)
    return (
      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg">
        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
        <div className="flex flex-col leading-none">
          <span className="text-[8px] font-black uppercase tracking-widest">ON TRACK</span>
          <span className="text-[10px] font-bold">{remaining} Hari Tersedia</span>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // MODE 2: REALTIME COUNTDOWN (Original Logic) - DIGUNAKAN DI LIST/DETAIL
  // Menangani input 'deadline' (Tanggal)
  // ---------------------------------------------------------------------------
  const [timeLeft, setTimeLeft] = useState<{
    days: number; hours: number; minutes: number; isOverdue: boolean;
  } | null>(null);

  useEffect(() => {
    if (!deadline) return;
    const calculateTime = () => {
      const now = new Date();
      const target = new Date(deadline);
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, isOverdue: true });
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        isOverdue: false,
      });
    };
    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (!timeLeft) return null;

  // Render UI Mode 2
  let themeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (timeLeft.isOverdue) themeClass = "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
  else if (timeLeft.days < 3) themeClass = "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all duration-700 ${themeClass}`}>
      {timeLeft.isOverdue ? <Flame className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
      <div className="flex-1">
        <p className="text-[8px] font-black uppercase tracking-widest opacity-80">
          {timeLeft.isOverdue ? "SLA EXPIRED" : "Sisa Waktu"}
        </p>
        <div className="flex items-baseline gap-1 text-sm font-black">
          {timeLeft.isOverdue ? (
            <span>OVERDUE</span>
          ) : (
            <>
              <span>{timeLeft.days}h</span>
              <span>{timeLeft.hours}j</span>
              <span>{timeLeft.minutes}m</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}