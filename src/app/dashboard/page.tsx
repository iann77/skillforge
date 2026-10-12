import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/auth/actions";
import {
  BookOpen,
  GraduationCap,
  Award,
  Flame,
  ArrowRight,
  LogOut,
  User,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Dashboard Mahasiswa — SkillForge",
  description: "Dashboard pembelajaran mahasiswa Pendidikan Informatika",
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Ambil profil pengguna dari tabel profiles
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Ambil data kursus yang diikuti pengguna
  const { data: enrollments } = await supabase
    .from("course_enrollments")
    .select("*, courses(*)")
    .eq("user_id", user.id);

  // Ambil statistik progres pelajaran
  const { count: completedLessonsCount } = await supabase
    .from("lesson_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_completed", true);

  // Ambil hasil kuis
  const { data: quizAttempts } = await supabase
    .from("quiz_attempts")
    .select("score, is_passed")
    .eq("user_id", user.id);

  const averageScore =
    quizAttempts && quizAttempts.length > 0
      ? (
          quizAttempts.reduce((acc, curr) => acc + Number(curr.score), 0) /
          quizAttempts.length
        ).toFixed(1)
      : 0;

  const fullName = profile?.full_name || user.email?.split("@")[0] || "Mahasiswa";
  const userRole = profile?.role || "student";
  const institution = profile?.institution || "Pendidikan Informatika";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Top Header Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
        <Container size="default">
          <div className="flex h-16 items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  Skill<span className="text-indigo-600">Forge</span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 -mt-1">
                  Portal Pembelajaran
                </span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/courses">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs">
                  Katalog Modul
                </Button>
              </Link>

              {userRole === "admin" && (
                <Link href="/admin">
                  <Badge variant="warning" className="cursor-pointer">
                    Admin Panel
                  </Badge>
                </Link>
              )}

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {fullName}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">{userRole}</span>
                </div>

                <form action={logoutAction}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Keluar</span>
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <Container size="default">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 sm:p-8 text-white shadow-xl mb-8">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-700 text-xs font-medium text-indigo-200 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                <span>{institution}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Selamat Datang, {fullName}! 👋
              </h1>
              <p className="mt-2 text-sm sm:text-base text-indigo-200 leading-relaxed">
                Lanjutkan perjalanan belajar Anda. Pantau capaian kompetensi informatika dan tingkatkan pemahaman melalui lab dan evaluasi terpadu.
              </p>
            </div>
          </div>

          {/* Real Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="border-slate-200/80">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <span className="text-xs font-semibold text-slate-500">Kursus Diikuti</span>
                <BookOpen className="h-4 w-4 text-indigo-600" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{enrollments?.length || 0}</div>
                <p className="text-[11px] text-slate-500 mt-1">Modul aktif di semester ini</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <span className="text-xs font-semibold text-slate-500">Materi Selesai</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{completedLessonsCount || 0}</div>
                <p className="text-[11px] text-slate-500 mt-1">Pelajaran terverifikasi</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <span className="text-xs font-semibold text-slate-500">Rata-Rata Kuis</span>
                <Award className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{averageScore} / 100</div>
                <p className="text-[11px] text-slate-500 mt-1">Evaluasi pemahaman konsep</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200/80">
              <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                <span className="text-xs font-semibold text-slate-500">Streak Belajar</span>
                <Flame className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">1 Hari</div>
                <p className="text-[11px] text-slate-500 mt-1">Konsistensi belajar harian</p>
              </CardContent>
            </Card>
          </div>

          {/* Course Enrolled Section / Informative Empty State */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Kursus Aktif Anda
                </h2>
                <p className="text-xs text-slate-500">
                  Daftar modul pembelajaran yang sedang Anda ikuti
                </p>
              </div>
              <Link href="/courses">
                <Button size="sm" variant="outline" className="gap-1 text-xs">
                  Jelajahi Semua Modul
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            {(!enrollments || enrollments.length === 0) ? (
              <Card className="p-8 text-center border-dashed border-2 border-slate-300 dark:border-slate-800">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 dark:bg-indigo-950 dark:text-indigo-400">
                  <BookOpen className="h-7 w-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Belum Ada Kursus yang Diikuti
                </h3>
                <p className="text-sm text-slate-500 max-w-md mx-auto mt-1 mb-6">
                  Pilih salah satu dari 10 bidang kurikulum Pendidikan Informatika untuk mulai belajar dan mencatat riwayat kemajuan akademik Anda.
                </p>
                <Link href="/courses">
                  <Button className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Pilih Modul Pembelajaran Pertama
                  </Button>
                </Link>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((item) => {
                  const course = item.courses;
                  if (!course) return null;
                  const progress = Number(item.progress_percentage || 0);

                  return (
                    <Card
                      key={item.id}
                      className="flex flex-col justify-between overflow-hidden border-slate-200/90 hover:border-indigo-400 transition-all hover:shadow-md dark:border-slate-800"
                    >
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <Badge variant={progress === 100 ? "success" : "default"}>
                            {progress === 100 ? "Selesai" : "Sedang Berjalan"}
                          </Badge>
                          <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                            {progress}%
                          </span>
                        </div>

                        <h3 className="font-bold text-base line-clamp-2 text-slate-900 dark:text-white">
                          {course.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2">
                          {course.description}
                        </p>

                        {/* Progress Bar */}
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                          <div
                            className="bg-indigo-600 h-full rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 mt-2 flex items-center justify-between">
                        <span className="text-xs text-slate-400">
                          {progress === 100 ? "100% Selesai" : "Lanjutkan modul"}
                        </span>
                        <Link href={`/courses/${course.slug}`}>
                          <Button size="sm" className="gap-1.5 text-xs">
                            <BookOpen className="h-3.5 w-3.5" />
                            Lanjutkan Belajar
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        </Container>
      </main>
    </div>
  );
}
