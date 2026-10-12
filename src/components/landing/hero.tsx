import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  GraduationCap,
  Sparkles,
  Terminal,
  Code2,
} from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Background subtle mesh or glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-400/10 blur-[100px] -z-10 pointer-events-none rounded-full" />

      <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-4">
        {/* Badge header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold mb-6 shadow-sm dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Platform Pembelajaran Digital Pendidikan Informatika</span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          Learn Informatics. <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-900 bg-clip-text text-transparent dark:from-indigo-400 dark:to-indigo-200">
            Build Your Future.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
          Kuasai fondasi algoritma, rekayasa perangkat lunak, sistem komputer, hingga perancangan media pembelajaran digital interaktif dalam satu ekosistem terpadu.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link href="/auth/register" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto gap-2 px-7 shadow-lg shadow-indigo-600/20">
              Mulai Belajar Sekarang
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/courses" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 px-7">
              <BookOpen className="h-4 w-4 text-slate-500" />
              Jelajahi Katalog Kursus
            </Button>
          </Link>
        </div>

        {/* Platform Core Highlights (Fakta riil kurikulum, bukan angka palsu) */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full pt-8 border-t border-slate-200/70 dark:border-slate-800">
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">10</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Bidang Studi PTI</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">5+</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Kursus Terstruktur</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">100%</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Penilaian Server-Side</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-white/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60">
            <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Gratis</span>
            <span className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Akses Mahasiswa</span>
          </div>
        </div>

        {/* Realistic code & interactive learning mockup preview */}
        <div className="mt-14 w-full rounded-2xl border border-slate-300/80 bg-slate-950 p-2 sm:p-4 text-left shadow-2xl shadow-indigo-950/20 text-slate-200">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="h-3 w-3 rounded-full bg-emerald-500" />
              <span className="ml-2 font-mono text-xs text-slate-400">
                skillforge://lab/algoritma-dasar/binary-search.ts
              </span>
            </div>
            <span className="text-xs text-indigo-400 font-mono bg-indigo-950/80 px-2.5 py-0.5 rounded border border-indigo-800/60">
              Interactive Lab
            </span>
          </div>
          <div className="p-4 font-mono text-xs sm:text-sm text-slate-300 space-y-1.5 overflow-x-auto">
            <p className="text-slate-500">// SkillForge: Lab Pemrograman Informatika</p>
            <p>
              <span className="text-indigo-400">function</span>{" "}
              <span className="text-emerald-400">binarySearch</span>
              (arr: <span className="text-amber-300">number[]</span>, target:{" "}
              <span className="text-amber-300">number</span>):{" "}
              <span className="text-amber-300">number</span> &#123;
            </p>
            <p className="pl-4">
              <span className="text-indigo-400">let</span> left = 0, right = arr.length - 1;
            </p>
            <p className="pl-4">
              <span className="text-indigo-400">while</span> (left &lt;= right) &#123;
            </p>
            <p className="pl-8">
              <span className="text-indigo-400">const</span> mid = Math.floor((left + right) / 2);
            </p>
            <p className="pl-8 text-emerald-300">
              <span className="text-indigo-400">if</span> (arr[mid] === target) <span className="text-indigo-400">return</span> mid;
            </p>
            <p className="pl-8">
              <span className="text-indigo-400">if</span> (arr[mid] &lt; target) left = mid + 1;{" "}
              <span className="text-indigo-400">else</span> right = mid - 1;
            </p>
            <p className="pl-4">&#125;</p>
            <p className="pl-4">
              <span className="text-indigo-400">return</span> -1;
            </p>
            <p>&#125;</p>
          </div>
        </div>
      </div>
    </section>
  );
}
