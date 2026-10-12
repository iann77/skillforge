import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Code2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200/80 bg-slate-900 text-slate-300">
      <Container size="default">
        <div className="py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white">
                  Skill<span className="text-indigo-400">Forge</span>
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400 -mt-1">
                  Informatics Learning Platform
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Platform pembelajaran digital terintegrasi untuk mahasiswa Pendidikan
              Informatika. Memadukan keahlian rekayasa perangkat lunak dengan kompetensi
              pedagogi digital untuk melahirkan talenta teknologi unggul.
            </p>
            <div className="flex items-center gap-4 pt-2 text-slate-400">
              <span className="text-xs bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700 font-mono text-indigo-300">
                v1.0.0-phase1
              </span>
              <span className="text-xs text-slate-400">
                Next.js 16 • Supabase • Tailwind CSS
              </span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Navigasi Platform
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  Katalog Kursus
                </Link>
              </li>
              <li>
                <Link href="/#learning-path" className="hover:text-white transition-colors">
                  Alur Pembelajaran
                </Link>
              </li>
              <li>
                <Link href="/#advantages" className="hover:text-white transition-colors">
                  Keunggulan
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-white transition-colors">
                  Pertanyaan Umum (FAQ)
                </Link>
              </li>
            </ul>
          </div>

          {/* Curriculum branches */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Pilar Kurikulum
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/courses?category=algoritma-dan-pemrograman" className="hover:text-white transition-colors">
                  Algoritma & Pemrograman
                </Link>
              </li>
              <li>
                <Link href="/courses?category=pengembangan-web" className="hover:text-white transition-colors">
                  Pengembangan Web Modern
                </Link>
              </li>
              <li>
                <Link href="/courses?category=basis-data-dan-sql" className="hover:text-white transition-colors">
                  Basis Data & SQL
                </Link>
              </li>
              <li>
                <Link href="/courses?category=rekayasa-perangkat-lunak" className="hover:text-white transition-colors">
                  Rekayasa Perangkat Lunak
                </Link>
              </li>
              <li>
                <Link href="/courses?category=teknologi-pendidikan" className="hover:text-white transition-colors">
                  Teknologi & Media Pendidikan
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal and Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              Bantuan & Kebijakan
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Ketentuan Penggunaan
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:text-white transition-colors">
                  Masuk Mahasiswa
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-white transition-colors">
                  Pendaftaran Baru
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © 2026 SkillForge Platform. Dirancang untuk Program Studi Pendidikan Informatika.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-slate-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
