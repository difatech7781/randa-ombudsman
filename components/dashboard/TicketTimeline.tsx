// components/dashboard/TicketTimeline.tsx
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { 
  CheckCircle2, 
  Clock, 
  ArrowRightCircle, 
  User as UserIcon,
  MessageSquare
} from "lucide-react";

interface TimelineItem {
  id: string;
  statusLama: string | null;
  statusBaru: string;
  keterangan: string | null;
  createdAt: Date;
  actor: {
    name: string | null;
    role: string;
  };
}

export default function TicketTimeline({ data }: { data: TimelineItem[] }) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
        <p className="text-[10px] font-black uppercase text-slate-300 tracking-widest italic">Belum ada riwayat aktivitas</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-slate-200 before:to-slate-100">
      {data.map((item, index) => (
        <div key={item.id} className="relative flex items-start gap-6 group">
          {/* Icon Indicator */}
          <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow-sm shrink-0 transition-transform group-hover:scale-110 ${
            index === 0 ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
          }`}>
            {index === 0 ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
          </div>

          {/* Content Card */}
          <div className="flex-1 bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[9px] font-black uppercase tracking-tighter rounded-lg border border-indigo-100">
                  {item.statusBaru.replace("_", " ")}
                </span>
                {item.statusLama && (
                  <>
                    <ArrowRightCircle className="w-3 h-3 text-slate-300" />
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{item.statusLama.replace("_", " ")}</span>
                  </>
                )}
              </div>
              <time className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {format(new Date(item.createdAt), "dd MMM yyyy • HH:mm", { locale: id })} WITA
              </time>
            </div>

            {item.keterangan && (
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-3 h-3 text-indigo-400 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{item.keterangan}"
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
              <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
                <UserIcon className="w-3 h-3 text-slate-500" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-900 uppercase leading-none">{item.actor.name || "Sistem"}</p>
                <p className="text-[8px] font-bold text-indigo-500 uppercase tracking-widest">{item.actor.role}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}