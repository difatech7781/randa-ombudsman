// components/SLACountdown.tsx
"use client";

import { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SLACountdownProps {
  deadline: Date | null;
}

export default function SLACountdown({ deadline }: SLACountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    isOverdue: boolean;
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
    const interval = setInterval(calculateTime, 60000); // Update setiap 1 menit

    return () => clearInterval(interval);
  }, [deadline]);

  if (!timeLeft) return null;

  // COLOR LOGIC: Hijau -> Amber (3 hari) -> Merah (1 hari/mismatch)
  const isCritical = !timeLeft.isOverdue && timeLeft.days < 3;
  const isDanger = !timeLeft.isOverdue && timeLeft.days < 1;

  let themeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
  if (timeLeft.isOverdue) themeClass = "bg-slate-900 text-white border-slate-900";
  else if (isDanger) themeClass = "bg-rose-50 text-rose-700 border-rose-200 animate-pulse";
  else if (isCritical) themeClass = "bg-amber-50 text-amber-700 border-amber-200";

  return (
    <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all duration-700 ${themeClass}`}>
      <div className={`p-3 rounded-lg ${timeLeft.isOverdue ? 'bg-rose-500' : 'bg-white/50'}`}>
        {timeLeft.isOverdue ? <AlertTriangle className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-80">
          {timeLeft.isOverdue ? "SLA EXPIRED (Keterlambatan)" : "Sisa Waktu Verifikasi Formil (SLA)"}
        </p>
        <div className="flex items-baseline gap-1">
          {timeLeft.isOverdue ? (
            <span className="text-lg font-black italic">DILUAR BATAS WAKTU (OVERDUE)</span>
          ) : (
            <>
              <span className="text-2xl font-black tracking-tighter">{timeLeft.days}</span>
              <span className="text-[10px] font-bold uppercase mr-1">Hari</span>
              <span className="text-2xl font-black tracking-tighter">{timeLeft.hours}</span>
              <span className="text-[10px] font-bold uppercase mr-1">Jam</span>
              <span className="text-2xl font-black tracking-tighter">{timeLeft.minutes}</span>
              <span className="text-[10px] font-bold uppercase">Menit</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}