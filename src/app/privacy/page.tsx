import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Kebijakan Privasi — SkillForge",
  description: "Kebijakan privasi data pengguna dan mahasiswa platform SkillForge",
};

export default function PrivacyPage() {
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
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Kebijakan Privasi</h1>
              <p className="text-sm text-slate-500">Terakhir diperbarui: Oktober 2026</p>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Pendahuluan</h2>
              <p>
                Platform SkillForge berkomitmen melindungi privasi data setiap pengguna, khususnya mahasiswa dan pengajar di lingkungan Pendidikan Informatika. Dokumen ini menjelaskan pengumpulan, penggunaan, dan perlindungan informasi pribadi Anda.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Data yang Dikumpulkan</h2>
              <p>
                Kami mengumpulkan data akun dasar saat Anda mendaftar melalui Supabase Auth, seperti alamat email, nama lengkap, dan peran akun (student, instructor, admin). Selain itu, kami mencatat riwayat progres belajar, hasil kuis, dan aktivitas belajar harian untuk keperluan analitik pembelajaran Anda.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Keamanan Data</h2>
              <p>
                Data Anda dilindungi dengan standar PostgreSQL Row Level Security (RLS) di Supabase. Kata sandi dienkripsi sepenuhnya melalui modul autentikasi terisolasi dan tidak pernah disimpan dalam bentuk plaintext.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. Penggunaan Data Pembelajaran</h2>
              <p>
                Data performa kuis dan penyelesaian modul semata-mata digunakan untuk menampilkan progres Anda, memberikan rekomendasi materi, dan keperluan portfolio akademik mahasiswa Pendidikan Informatika.
              </p>
            </section>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
