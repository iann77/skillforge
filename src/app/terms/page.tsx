import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { FileText, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Ketentuan Penggunaan — SkillForge",
  description: "Syarat dan ketentuan penggunaan platform edukasi SkillForge",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 py-16">
        <Container size="sm">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-8 gap-2 text-slate-600">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Ketentuan Penggunaan</h1>
              <p className="text-sm text-slate-500">Terakhir diperbarui: Oktober 2026</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Ketentuan Umum</h2>
              <p>
                Dengan mengakses atau menggunakan platform SkillForge, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Platform ini didedikasikan untuk mendukung pembelajaran, pengajaran, dan riset teknologi informasi di bidang pendidikan.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Akun Mahasiswa dan Pengguna</h2>
              <p>
                Pengguna bertanggung jawab menjaga kerahasiaan kredensial akun mereka. Dilarang keras membagikan kredensial login atau melakukan kecurangan otomatisasi pada pengerjaan kuis dan evaluasi server-side.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Hak Cipta Materi</h2>
              <p>
                Seluruh materi modul, silabus, dan instrumen penilaian pembelajaran yang disediakan di platform SkillForge dilindungi oleh undang-undang hak cipta dan diperuntukkan bagi tujuan edukasi non-komersial sivitas akademika.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
