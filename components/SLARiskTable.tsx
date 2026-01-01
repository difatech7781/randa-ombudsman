"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock } from "lucide-react";

export default function SLARiskTable({ tickets }: { tickets: any[] }) {
  const [now, setNow] = useState(new Date());

  // Update countdown setiap menit 
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getRemainingTime = (deadline: Date) => {
    const diff = new Date(deadline).getTime() - now.getTime();
    if (diff <= 0) return { text: "OVERDUE", color: "text-rose-600 font-black", urgent: true };
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { 
      text: `${days}h ${hours}j lagi`, 
      color: days < 3 ? "text-rose-500 font-bold" : "text-slate-600",
      urgent: days < 3 
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h2 className="text-sm font-bold flex items-center gap-2 text-slate-800">
          <AlertCircle className="w-4 h-4 text-rose-500" /> SLA Risk Monitoring (SK 244/2020)
        </h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="text-[10px] font-black uppercase">ID Tiket</TableHead>
            <TableHead className="text-[10px] font-black uppercase">Status</TableHead>
            <TableHead className="text-[10px] font-black uppercase">Deadline Formil</TableHead>
            <TableHead className="text-[10px] font-black uppercase text-right">Sisa Waktu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((t) => {
            const countdown = getRemainingTime(t.deadlineFormil);
            return (
              <TableRow key={t.id} className={countdown.urgent ? "bg-rose-50/30" : ""}>
                <TableCell className="font-mono text-xs font-bold text-indigo-600">{t.id}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-[9px] font-bold uppercase">
                    {t.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-[10px] text-slate-500 font-medium">
                  {new Date(t.deadlineFormil).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                </TableCell>
                <TableCell className={`text-right text-xs ${countdown.color}`}>
                  <div className="flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {countdown.text}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}