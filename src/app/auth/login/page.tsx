import * as React from "react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code2, ArrowLeft, LogIn } from "lucide-react";

export const metadata = {
  title: "Masuk — SkillForge",
  description: "Masuk ke platform pembelajaran SkillForge",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 dark:bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Beranda
        </Link>

        <Card className="border-slate-200/90 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md mb-2">
              <Code2 className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Masuk ke SkillForge</CardTitle>
            <CardDescription>
              Akses modul pembelajaran, progres kuis, dan portfolio Anda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Alamat Email Mahasiswa
              </label>
              <input
                type="email"
                placeholder="nama@mahasiswa.ac.id"
                disabled
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Kata Sandi
                </label>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                disabled
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-lg text-xs text-amber-800 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300 leading-relaxed">
              <strong>Fase 1 Berjalan:</strong> Form login aktif akan terhubung dengan Supabase Auth pada <strong>Fase 2 (Autentikasi & Database)</strong> setelah kredensial Supabase dikonfigurasi.
            </div>

            <Button disabled className="w-full gap-2">
              <LogIn className="h-4 w-4" />
              Masuk (Segera di Fase 2)
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center border-t border-slate-100 dark:border-slate-800 pt-4 text-xs text-slate-500">
            <span>Belum memiliki akun? </span>
            <Link href="/auth/register" className="ml-1 font-semibold text-indigo-600 hover:underline">
              Daftar sekarang
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
