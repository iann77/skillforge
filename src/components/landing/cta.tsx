import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)] pointer-events-none" />

      <Container size="default">
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/60 border border-indigo-700/60 text-xs font-medium text-indigo-200">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span>Mulai Langkah Pertama Anda Hari Ini</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Siap Menguasai Dunia Informatika & Pembelajaran Digital?
          </h2>

          <p className="text-base sm:text-lg text-indigo-200 leading-relaxed max-w-2xl mx-auto">
            Bergabunglah dengan sesama mahasiswa Pendidikan Informatika. Dapatkan akses ke seluruh kurikulum, simulasi kode, dan uji kompetensi terpadu.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-white text-indigo-900 hover:bg-slate-100 font-bold px-8 shadow-xl"
              >
                Daftar Akun Mahasiswa
                <ArrowRight className="h-4 w-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/courses" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto border-indigo-700 text-white hover:bg-indigo-900/50"
              >
                Eksplor Silabus Lengkap
              </Button>
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-indigo-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Tanpa Biaya Berlangganan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Sertifikasi & Progres Tersimpan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Kurikulum Berbasis KKNI & OBE</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
