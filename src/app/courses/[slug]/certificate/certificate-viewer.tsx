"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Share2,
  ArrowLeft,
  Award,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  Code2,
  Copy,
  Check,
} from "lucide-react";

interface CertificateViewerProps {
  certificateId: string;
  studentName: string;
  institution: string;
  courseTitle: string;
  categoryName: string;
  instructorName: string;
  completionDate: string;
  courseSlug: string;
  quizScore: number;
}

export function CertificateViewer({
  certificateId,
  studentName,
  institution,
  courseTitle,
  categoryName,
  instructorName,
  completionDate,
  courseSlug,
  quizScore,
}: CertificateViewerProps) {
  const [copied, setCopied] = React.useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const formattedDate = new Date(completionDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Kembali ke Kursus
        </Link>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={handleCopyLink}
            variant="outline"
            size="sm"
            className="gap-1.5 text-xs h-9"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? "Tautan Tersalin!" : "Salin Tautan Verifikasi"}</span>
          </Button>

          <Button
            onClick={handlePrint}
            size="sm"
            className="gap-2 text-xs h-9 bg-indigo-600 hover:bg-indigo-700 shadow-md font-semibold"
          >
            <Printer className="h-4 w-4" />
            Cetak / Simpan PDF
          </Button>
        </div>
      </div>

      {/* CERTIFICATE CANVAS (Printable) */}
      <div className="relative bg-white text-slate-900 border-8 border-double border-indigo-950/20 p-8 sm:p-14 shadow-2xl rounded-2xl overflow-hidden print:border-4 print:shadow-none print:m-0 print:p-10 print:rounded-none">
        {/* Background Watermark Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
          <GraduationCap className="w-[500px] h-[500px]" />
        </div>

        {/* Outer Corner Ornaments */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-indigo-700 pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-indigo-700 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-indigo-700 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-indigo-700 pointer-events-none" />

        <div className="relative z-10 text-center space-y-6">
          {/* Header Brand */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-900 text-white shadow-md">
                <Code2 className="h-6 w-6" />
              </div>
              <span className="text-2xl font-black tracking-tight text-slate-900">
                SKILL<span className="text-indigo-600">FORGE</span>
              </span>
            </div>
            <p className="text-[11px] uppercase tracking-widest text-slate-500 font-semibold">
              Interactive Informatics Learning Platform • Verifikasi Akademik
            </p>
          </div>

          {/* Certificate Title */}
          <div className="pt-2 space-y-1">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-wide uppercase">
              Sertifikat Kelulusan Modul
            </h1>
            <p className="text-xs font-mono text-slate-400">
              No. Registrasi: {certificateId}
            </p>
          </div>

          {/* Certificate Statement */}
          <div className="py-2 space-y-4 max-w-2xl mx-auto">
            <p className="text-sm text-slate-600 italic font-serif">
              Dengan bangga menyatakan bahwa mahasiswa:
            </p>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-indigo-950 font-serif border-b-2 border-indigo-100 pb-2 inline-block px-8 tracking-normal">
              {studentName}
            </h2>

            <p className="text-xs font-medium text-slate-500">
              {institution}
            </p>

            <p className="text-sm text-slate-700 leading-relaxed font-serif pt-2">
              Telah berhasil menyelesaikan seluruh silabus materi pembelajaran dan lulus evaluasi asesmen terverifikasi pada mata kuliah:
            </p>

            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/80 inline-block px-8">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                {courseTitle}
              </h3>
              <span className="text-xs text-indigo-600 font-semibold block mt-0.5">
                Bidang: {categoryName} • Nilai Uji Kompetensi: {quizScore}/100
              </span>
            </div>
          </div>

          {/* Footer Signatures */}
          <div className="pt-8 grid grid-cols-2 gap-8 max-w-xl mx-auto border-t border-slate-200">
            {/* Signature 1 */}
            <div className="space-y-1 text-center">
              <div className="h-12 flex items-center justify-center">
                <span className="font-serif italic text-lg text-indigo-900 font-bold opacity-80">
                  {instructorName}
                </span>
              </div>
              <div className="w-36 h-[1px] bg-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-900">{instructorName}</p>
              <p className="text-[10px] text-slate-500">Dosen Pengampu Modul</p>
            </div>

            {/* Signature 2 */}
            <div className="space-y-1 text-center">
              <div className="h-12 flex items-center justify-center">
                <div className="flex items-center gap-1 text-emerald-700 font-serif font-bold text-sm">
                  <ShieldCheck className="h-5 w-5" />
                  <span>TERVERIFIKASI SISTEM</span>
                </div>
              </div>
              <div className="w-36 h-[1px] bg-slate-400 mx-auto" />
              <p className="text-xs font-bold text-slate-900">{formattedDate}</p>
              <p className="text-[10px] text-slate-500">Tanggal Terbit Kelulusan</p>
            </div>
          </div>

          {/* Validation Notice */}
          <div className="pt-4 text-[10px] text-slate-400">
            Dokumen digital ini diterbitkan secara otomatis oleh sistem evaluasi SkillForge dan sah sebagai bukti rekam capaian akademik pembelajaran komputasi.
          </div>
        </div>
      </div>
    </div>
  );
}
