import * as React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { toggleLessonProgressAction } from "@/app/courses/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
  Award,
  Sparkles,
  Menu,
} from "lucide-react";

interface Props {
  params: Promise<{
    slug: string;
    lessonSlug: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug, lessonSlug } = await params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("title")
    .eq("slug", lessonSlug)
    .single();

  if (!lesson) return { title: "Ruang Belajar — SkillForge" };
  return {
    title: `${lesson.title} — Ruang Belajar SkillForge`,
  };
}

export default async function LearnLessonPage({ params }: Props) {
  const { slug, lessonSlug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/courses/${slug}/learn/${lessonSlug}`);
  }

  // Ambil data kursus
  const { data: course } = await supabase
    .from("courses")
    .select("*, categories(*)")
    .eq("slug", slug)
    .single();

  if (!course) {
    return notFound();
  }

  // Cek apakah mahasiswa sudah enroll
  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .maybeSingle();

  if (!enrollment) {
    // Daftarkan otomatis jika belum
    await supabase.from("course_enrollments").insert({
      user_id: user.id,
      course_id: course.id,
      progress_percentage: 0,
    });
  }

  // Ambil semua pelajaran dalam kursus ini
  const { data: allLessons } = await supabase
    .from("lessons")
    .select("*")
    .eq("course_id", course.id)
    .eq("status", "published")
    .order("sort_order", { ascending: true });

  if (!allLessons || allLessons.length === 0) {
    return notFound();
  }

  // Ambil pelajaran yang sedang dibuka
  const currentLessonIndex = allLessons.findIndex((l) => l.slug === lessonSlug);
  if (currentLessonIndex === -1) {
    return notFound();
  }

  const currentLesson = allLessons[currentLessonIndex];
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  // Ambil riwayat penyelesaian pelajaran user
  const { data: completedProgress } = await supabase
    .from("lesson_progress")
    .select("lesson_id, is_completed")
    .eq("user_id", user.id)
    .eq("is_completed", true);

  const completedSet = new Set<string>();
  completedProgress?.forEach((p) => completedSet.add(p.lesson_id));

  const isCurrentCompleted = completedSet.has(currentLesson.id);

  // Hitung persentase progres kursus
  const completedCount = allLessons.filter((l) => completedSet.has(l.id)).length;
  const progressPercentage = Math.round((completedCount / allLessons.length) * 100);

  const learningObjectives =
    typeof currentLesson.learning_objectives === "string"
      ? JSON.parse(currentLesson.learning_objectives)
      : currentLesson.learning_objectives || [];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar Silabus Pelajaran */}
      <aside className="w-80 border-r border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex flex-col shrink-0 hidden md:flex sticky top-0 h-screen overflow-y-auto">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke Detail Kursus
          </Link>
          <h2 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 leading-snug">
            {course.title}
          </h2>

          {/* Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Progres Kursus</span>
              <span className="font-semibold text-indigo-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="flex-1 p-3 space-y-1">
          <span className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
            Daftar Modul ({allLessons.length})
          </span>

          {allLessons.map((lesson, idx) => {
            const isCompleted = completedSet.has(lesson.id);
            const isActive = lesson.slug === currentLesson.slug;

            return (
              <Link
                key={lesson.id}
                href={`/courses/${course.slug}/learn/${lesson.slug}`}
                className={`flex items-start gap-3 p-3 rounded-xl text-xs transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-900 font-semibold border border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-200 dark:border-indigo-800"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] shrink-0 mt-0.5 ${
                    isCompleted
                      ? "bg-emerald-500 text-white"
                      : isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate leading-tight">{lesson.title}</p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {lesson.estimated_minutes} mnt
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Link href="/dashboard" className="w-full block">
            <Button variant="outline" size="sm" className="w-full text-xs">
              Ke Dashboard Mahasiswa
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Floating Bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/courses/${course.slug}`}
              className="text-xs text-slate-500 hover:text-indigo-600 md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <span className="text-xs font-semibold text-slate-500">
              Modul {currentLessonIndex + 1} dari {allLessons.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
              {currentLesson.estimated_minutes} Menit
            </span>
          </div>
        </header>

        {/* Lesson Body */}
        <div className="flex-1 max-w-4xl w-full mx-auto p-6 md:p-10 space-y-8">
          {/* Header Pelajaran */}
          <div className="space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                {course.categories?.name || "Informatika"}
              </Badge>
              {isCurrentCompleted && (
                <Badge variant="success" className="text-xs gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Selesai
                </Badge>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {currentLesson.title}
            </h1>
          </div>

          {/* Capaian Pembelajaran Modul */}
          {learningObjectives.length > 0 && (
            <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 space-y-2 dark:bg-indigo-950/40 dark:border-indigo-900 dark:text-indigo-200">
              <span className="font-semibold block flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Tujuan Pembelajaran Modul Ini:
              </span>
              <ul className="list-disc list-inside space-y-1 pl-1">
                {learningObjectives.map((obj: string, i: number) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Render Isi Materi */}
          <article className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-slate-800 dark:text-slate-200 leading-relaxed text-sm sm:text-base">
            <div className="whitespace-pre-wrap font-sans bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm leading-relaxed">
              {currentLesson.content}
            </div>
          </article>

          {/* Navigasi & Aksi Selesai Materi */}
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              {prevLesson ? (
                <Link href={`/courses/${course.slug}/learn/${prevLesson.slug}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <ChevronLeft className="h-4 w-4" />
                    Materi Sebelumnya
                  </Button>
                </Link>
              ) : (
                <span />
              )}
            </div>

            <div className="flex items-center gap-3">
              <form
                action={async () => {
                  "use server";
                  await toggleLessonProgressAction(
                    currentLesson.id,
                    course.id,
                    course.slug,
                    nextLesson ? nextLesson.slug : null
                  );
                }}
              >
                <Button
                  type="submit"
                  variant={isCurrentCompleted ? "outline" : "default"}
                  className="gap-2 text-xs font-semibold shadow-sm"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isCurrentCompleted
                    ? nextLesson
                      ? "Selesai (Lanjut Berikutnya)"
                      : "Tandai Belum Selesai"
                    : nextLesson
                    ? "Tandai Selesai & Lanjut"
                    : "Selesaikan Modul Terakhir"}
                </Button>
              </form>

              {nextLesson && (
                <Link href={`/courses/${course.slug}/learn/${nextLesson.slug}`}>
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    Berikutnya
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
