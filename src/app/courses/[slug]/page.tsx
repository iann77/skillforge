import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { enrollCourseAction } from "@/app/courses/actions";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  User,
  CheckCircle2,
  PlayCircle,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Award,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("title, description")
    .eq("slug", slug)
    .single();

  if (!course) return { title: "Kursus Tidak Ditemukan — SkillForge" };
  return {
    title: `${course.title} — SkillForge`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  // Ambil data kursus beserta kategori dan instruktur
  const { data: course } = await supabase
    .from("courses")
    .select("*, categories(*), profiles:instructor_id(full_name)")
    .eq("slug", slug)
    .single();

  if (!course) {
    return notFound();
  }

  // Ambil pelajaran yang dipublikasikan
  const { data: lessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  // Cek apakah mahasiswa saat ini sudah enroll
  let isEnrolled = false;
  let progressPercentage = 0;
  let completedLessonIds = new Set<string>();

  if (user) {
    const { data: enrollment } = await supabase
      .from("course_enrollments")
      .select("*")
      .eq("user_id", user.id)
      .eq("course_id", course.id)
      .maybeSingle();

    if (enrollment) {
      isEnrolled = true;
      progressPercentage = enrollment.progress_percentage || 0;
    }

    // Ambil progres tiap pelajaran
    if (lessons && lessons.length > 0) {
      const { data: progressData } = await supabase
        .from("lesson_progress")
        .select("lesson_id")
        .eq("user_id", user.id)
        .eq("is_completed", true)
        .in(
          "lesson_id",
          lessons.map((l) => l.id)
        );

      progressData?.forEach((p) => completedLessonIds.add(p.lesson_id));
    }
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

  const objectives =
    typeof course.learning_objectives === "string"
      ? JSON.parse(course.learning_objectives)
      : course.learning_objectives || [];

  const firstLesson = lessons && lessons.length > 0 ? lessons[0] : null;

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar user={user} fullName={profile?.full_name} />
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
            {/* Main Content Info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default">{course.categories?.name || "Informatika"}</Badge>
                  <Badge variant={difficultyVariant}>{difficultyLabel}</Badge>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  {course.title}
                </h1>
                <p className="mt-4 text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {course.description}
                </p>
              </div>

              {/* Capaian Pembelajaran (Learning Objectives) */}
              {objectives.length > 0 && (
                <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50/70 dark:bg-slate-900 dark:border-slate-800">
                  <h3 className="text-lg font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                    Capaian Pembelajaran (Learning Objectives)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {objectives.map((obj: string, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-1 shrink-0" />
                        <span>{obj}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Silabus Pelajaran */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Silabus & Modul Pembelajaran ({lessons?.length || 0} Pelajaran)
                  </h3>
                  {isEnrolled && (
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      Progres: {progressPercentage}%
                    </span>
                  )}
                </div>

                {(!lessons || lessons.length === 0) ? (
                  <p className="text-sm text-slate-500 italic">
                    Belum ada materi pelajaran yang dipublikasikan untuk modul ini.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lessons.map((lesson, idx) => {
                      const isCompleted = completedLessonIds.has(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          className="p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between shadow-sm hover:border-indigo-300 transition-colors dark:border-slate-800 dark:bg-slate-900"
                        >
                          <div className="flex items-center gap-3.5">
                            <span
                              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold font-mono ${
                                isCompleted
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                  : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                              ) : (
                                idx + 1
                              )}
                            </span>
                            <div>
                              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                {lesson.title}
                              </h4>
                              <span className="text-xs text-slate-500">
                                Estimasi waktu: {lesson.estimated_minutes} menit
                              </span>
                            </div>
                          </div>

                          {isEnrolled ? (
                            <Link href={`/courses/${course.slug}/learn/${lesson.slug}`}>
                              <Button size="sm" variant="outline" className="gap-1 text-xs">
                                Pelajari
                                <ChevronRight className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          ) : (
                            <span className="text-xs text-slate-400">Daftar untuk akses</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Uji Kompetensi / Kuis Section */}
              <div className="p-6 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-purple-50/40 dark:from-indigo-950/30 dark:to-purple-950/20 dark:border-indigo-900/60 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="text-xs">
                        Evaluasi Akhir
                      </Badge>
                      <span className="text-xs text-indigo-700 dark:text-indigo-300 font-semibold">
                        Passing Score: 70%
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      Uji Kompetensi & Asesmen Terverifikasi
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xl">
                      Uji pemahaman teoritis dan praktis Anda melalui soal-soal pilihan ganda terstandar. Skor dinilai langsung oleh server dan tersimpan di transkrip belajar Anda.
                    </p>
                  </div>

                  <Link href={`/courses/${course.slug}/quiz`} className="shrink-0">
                    <Button className="gap-2 text-xs font-semibold shadow-md shadow-indigo-600/20">
                      <Award className="h-4 w-4" />
                      Mulai Kerjakan Kuis
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar Sticky Enrollment Card */}
            <div>
              <Card className="sticky top-24 border-slate-200/90 shadow-md">
                <div className="h-3 bg-gradient-to-r from-indigo-500 to-indigo-700" />
                <CardHeader className="p-6 pb-4">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                    Informasi Pembelajaran
                  </span>
                  <CardTitle className="text-xl mt-1">
                    {isEnrolled ? "Status: Sedang Belajar" : "Siap Memulai Belajar?"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 pt-0 space-y-4">
                  <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300 border-y border-slate-100 dark:border-slate-800 py-4">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-500">
                        <Clock className="h-4 w-4" /> Durasi Total
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatDuration(course.estimated_duration_minutes || 60)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-500">
                        <BookOpen className="h-4 w-4" /> Jumlah Pelajaran
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {lessons?.length || 0} Materi
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-slate-500">
                        <User className="h-4 w-4" /> Dosen Pengampu
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-right truncate max-w-[150px]">
                        {course.profiles?.full_name || "Dosen PTI"}
                      </span>
                    </div>
                  </div>

                  {isEnrolled ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                        <span>Anda sudah terdaftar di kursus ini. Lanjutkan pelajaran Anda.</span>
                      </div>
                      {firstLesson && (
                        <Link href={`/courses/${course.slug}/learn/${firstLesson.slug}`} className="block w-full">
                          <Button className="w-full gap-2 font-semibold">
                            <PlayCircle className="h-4 w-4" />
                            Buka Ruang Belajar
                          </Button>
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="p-3 bg-indigo-50/80 rounded-lg border border-indigo-100 text-xs text-indigo-900 dark:bg-indigo-950/60 dark:border-indigo-800 dark:text-indigo-200">
                        Modul ini 100% gratis untuk seluruh mahasiswa. Progres belajar & nilai kuis Anda akan tersimpan otomatis.
                      </div>
                      {user ? (
                        <form
                          action={async () => {
                            "use server";
                            await enrollCourseAction(course.id, course.slug);
                          }}
                        >
                          <Button type="submit" className="w-full gap-2 font-semibold">
                            <PlayCircle className="h-4 w-4" />
                            Daftar Kursus Ini Sekarang
                          </Button>
                        </form>
                      ) : (
                        <Link
                          href={`/auth/login?redirect=/courses/${course.slug}`}
                          className="block w-full"
                        >
                          <Button className="w-full gap-2 font-semibold">
                            <PlayCircle className="h-4 w-4" />
                            Masuk untuk Mulai Belajar
                          </Button>
                        </Link>
                      )}
                    </div>
                  )}
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
