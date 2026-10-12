import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FEATURED_COURSES } from "@/data/curriculum";
import { formatDuration } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  User,
  CheckCircle2,
  Lock,
  PlayCircle,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return FEATURED_COURSES.map((course) => ({
    slug: course.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = FEATURED_COURSES.find((c) => c.slug === slug);
  if (!course) return { title: "Kursus Tidak Ditemukan — SkillForge" };
  return {
    title: `${course.title} — SkillForge`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = FEATURED_COURSES.find((c) => c.slug === slug);

  if (!course) {
    return notFound();
  }

  const difficultyLabel =
    course.difficulty === "beginner"
      ? "Pemula"
      : course.difficulty === "intermediate"
      ? "Menengah"
      : "Lanjutan";

  const difficultyVariant =
    course.difficulty === "beginner"
      ? "success"
      : course.difficulty === "intermediate"
      ? "warning"
      : "danger";

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 py-12">
        <Container size="default">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-indigo-600 mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Katalog Kursus
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default">{course.category?.name}</Badge>
                  <Badge variant={difficultyVariant}>{difficultyLabel}</Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  {course.title}
                </h1>
                <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Learning Objectives */}
              <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/70 dark:bg-slate-900 dark:border-slate-800">
                <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
                  Capaian Pembelajaran (Learning Objectives)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.learning_objectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-1 shrink-0" />
                      <span>{obj}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Syllabus Preview */}
              <div>
                <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                  Silabus & Daftar Pelajaran ({course.total_lessons} Modul)
                </h3>
                <div className="space-y-3">
                  {Array.from({ length: course.total_lessons || 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold font-mono dark:bg-indigo-950 dark:text-indigo-300">
                          {i + 1}
                        </span>
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                            Modul {i + 1}: Konsep & Praktik Terpadu Bagian {i + 1}
                          </h4>
                          <span className="text-xs text-slate-500">Estimasi waktu: 30 menit</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Fase 3: Ruang Belajar</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Card */}
            <div>
              <Card className="sticky top-24 border-slate-200/90 shadow-md">
                <div className="h-3 bg-gradient-to-r from-indigo-500 to-indigo-700" />
                <CardHeader className="p-6 pb-4">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Informasi Modul
                  </span>
                  <CardTitle className="text-xl mt-1">Siap Memulai Belajar?</CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 border-y border-slate-100 dark:border-slate-800 py-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Clock className="h-4 w-4" /> Durasi Total
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatDuration(course.estimated_duration_minutes)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-500">
                        <BookOpen className="h-4 w-4" /> Jumlah Pelajaran
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {course.total_lessons} Materi
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-500">
                        <User className="h-4 w-4" /> Pengampu
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[150px]">
                        {course.instructor_name}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-indigo-50/80 rounded-lg border border-indigo-100 text-xs text-indigo-900 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-200">
                    Modul ini gratis untuk seluruh mahasiswa. Progres belajar & kuis akan disimpan setelah login.
                  </div>

                  <Link href="/auth/register" className="block w-full">
                    <Button className="w-full gap-2 font-semibold">
                      <PlayCircle className="h-4 w-4" />
                      Daftar & Mulai Belajar
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
