import { CheckCircle2, Clock, User } from "lucide-react";

export default function TimelineAudit({ riwayat }: { riwayat: any[] }) {
  if (!riwayat || riwayat.length === 0) {
    return (
      <div className="p-8 text-center border-2 border-dashed rounded-2xl text-slate-400">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
        <p className="text-sm italic">Belum ada pergerakan status pada laporan ini.</p>
      </div>
    );
  }

  // Fungsi formatter bawaan JS
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500 before:via-slate-200 before:to-transparent">
      {riwayat.map((item, index) => (
        <div key={item.id} className="relative flex items-start gap-6 group">
          <div className="sticky left-0 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 border-indigo-500 shadow-sm transition-transform group-hover:scale-110">
            {index === 0 ? (
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            ) : (
              <Clock className="w-5 h-5 text-slate-400" />
            )}
          </div>

          <div className="flex-1 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 gap-1">
              <span className="text-sm font-black text-slate-900 uppercase tracking-tight">
                {item.statusBaru.replace('_', ' ')}
              </span>
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(item.createdAt)} WITA
              </span>
            </div>
            
            {item.keterangan && (
              <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border-l-2 border-indigo-200 mb-3 italic">
                "{item.keterangan}"
              </p>
            )}

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <div className="bg-indigo-50 p-1 rounded-full">
                <User className="w-3 h-3 text-indigo-600" />
              </div>
              <span className="text-[10px] font-bold text-indigo-600">
                Oleh: {item.updatedBy}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}