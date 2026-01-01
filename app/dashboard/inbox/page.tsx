// app/dashboard/inbox/page.tsx
import { getInboxTickets } from "./actions";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Inbox, 
  Filter, 
  Search, 
  ArrowRight, 
  Clock, 
  AlertTriangle,
  FileText,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";

export default async function InboxPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const currentFilter = params.filter || "Semua";
  const tickets = await getInboxTickets(currentFilter);

  const filters = [
    "Semua",
    "Mendekati Deadline",
    "VERIFIKASI_FORMIL",
    "VERIFIKASI_MATERIIL",
    "MENUNGGU_PLENO",
    "PEMERIKSAAN"
  ];

  return (
    <div className="p-8 space-y-8 bg-white min-h-screen selection:bg-indigo-100">
      
      {/* 1. HEADER SECTION: Tactical Command */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Inbox className="w-5 h-5 text-white" />
            </div>
            <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Operational Inbox</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
            Case Management
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
            Queue Management & SLA Compliance Monitoring
          </p>
        </div>

        {/* Filter Toolbar: Modern & Segmented */}
        <div className="bg-slate-50 p-1.5 rounded-[20px] border border-slate-100 flex flex-wrap gap-1">
          {filters.map((f) => (
            <Link key={f} href={`/dashboard/inbox?filter=${f}`}>
              <Button 
                variant={currentFilter === f ? "default" : "ghost"}
                size="sm"
                className={`text-[9px] font-black uppercase tracking-widest rounded-xl transition-all h-9 px-4 ${
                  f === "Mendekati Deadline" && currentFilter !== f 
                    ? "text-rose-600 bg-rose-50 hover:bg-rose-100" 
                    : ""
                } ${
                  currentFilter === f 
                    ? "bg-indigo-600 shadow-lg shadow-indigo-100 text-white" 
                    : "text-slate-500 hover:text-indigo-600"
                }`}
              >
                {f.replace("_", " ")}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {/* 2. DATA TABLE: Polished Enterprise Grade */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-slate-50">
              <TableHead className="text-[10px] font-black uppercase pl-8 h-14">Ticket ID</TableHead>
              <TableHead className="text-[10px] font-black uppercase h-14">Subject / Pelapor</TableHead>
              <TableHead className="text-[10px] font-black uppercase h-14">Current Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase h-14">SLA Deadline (Formil)</TableHead>
              <TableHead className="text-right text-[10px] font-black uppercase pr-8 h-14">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-32 space-y-4">
                  <div className="flex justify-center">
                    <ShieldCheck className="w-12 h-12 text-slate-100" />
                  </div>
                  <p className="text-slate-400 italic text-xs font-bold uppercase tracking-widest">
                    All queues are clear. System nominal.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((t) => {
                // SLA Risk Detection: < 48 Jam (2 Hari)
                const isUrgent = currentFilter === "Mendekati Deadline" || 
                                (t.deadlineFormil && new Date(t.deadlineFormil).getTime() - new Date().getTime() < 172800000);
                
                return (
                  <TableRow key={t.id} className={`group border-slate-50 transition-colors ${isUrgent ? "bg-rose-50/30 hover:bg-rose-50/60" : "hover:bg-slate-50/50"}`}>
                    <TableCell className="pl-8">
                      <div className="font-mono text-[11px] font-black text-indigo-600">#{t.id}</div>
                      <div className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">{new Date(t.createdAt).toLocaleDateString('id-ID')}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-black text-slate-800 uppercase italic tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">
                        {t.pelapor.namaLengkap}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                        <FileText className="w-3 h-3" /> Digital Record Verified
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[8px] font-black uppercase border-slate-200 shadow-sm ${isUrgent ? 'bg-white text-rose-600' : 'bg-white text-slate-500'}`}>
                        {t.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={`flex items-start gap-2 ${isUrgent ? "text-rose-600" : "text-slate-600"}`}>
                        <Clock className={`w-3.5 h-3.5 mt-0.5 ${isUrgent ? "animate-pulse" : ""}`} />
                        <div>
                          <div className="text-[11px] font-black uppercase tracking-tighter leading-none">
                            {new Date(t.deadlineFormil).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                          {isUrgent && (
                            <span className="inline-block bg-rose-600 text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded-sm mt-1.5 animate-pulse">
                              Immediate Verification
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <Link href={`/dashboard/laporan/${t.id}`}>
                        <Button variant="ghost" className="h-10 px-4 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 rounded-xl group/btn">
                          Open Case <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer Insight: Quick Audit */}
      <div className="flex justify-between items-center pt-4">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] italic leading-none">
          Queue Security Level: High Integrity Audit Active
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SLA Breach Warning</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Nominal</span>
          </div>
        </div>
      </div>
    </div>
  );
}