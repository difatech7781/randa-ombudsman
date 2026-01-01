"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportInstansiPDF({ data }: { data: any[] }) {
  const exportPDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('id-ID');

    // Header Laporan Resmi Ombudsman
    doc.setFontSize(16);
    doc.text("LAPORAN TOP 5 INSTANSI TERLAPOR", 14, 20);
    doc.setFontSize(10);
    doc.text("Sistem RANDA - Ombudsman RI Perwakilan Kaltara", 14, 28);
    doc.text(`Tanggal Cetak: ${date}`, 14, 34);
    doc.line(14, 38, 196, 38); // Garis pemisah

    // Generate Tabel
    autoTable(doc, {
      startY: 45,
      head: [['Peringkat', 'Nama Instansi', 'Jumlah Laporan']],
      body: data.map((item, index) => [
        index + 1,
        item.name,
        `${item.count} Laporan`
      ]),
      headStyles: { fillColor: [79, 70, 229] }, // Warna indigo-600
      theme: 'striped'
    });

    // Footer
    doc.setFontSize(8);
    doc.text("Dokumen ini dihasilkan secara otomatis oleh Sistem RANDA v.3.0", 14, doc.internal.pageSize.height - 10);

    doc.save(`Laporan_Top_Instansi_${date}.pdf`);
  };

  return (
    <Button 
      onClick={exportPDF} 
      variant="ghost" 
      size="sm" 
      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 h-7"
    >
      <FileDown className="w-3 h-3 mr-1" /> Export ke PDF
    </Button>
  );
}