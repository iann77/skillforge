import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/auth/actions";
import { calculateGamification } from "@/lib/gamification";
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
  RotateCcw,
  Bookmark,
  Settings,
  Zap,
  Lock,
  Compass,
  Footprints,
  BookOpenCheck,
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
    .select("*, quizzes(*, courses(*))")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false });

  // Ambil materi tersimpan (Bookmarks)
  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, created_at, lessons(id, title, slug, estimated_minutes, courses(title, slug))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const averageScore =
    quizAttempts && quizAttempts.length > 0
      ? (
          quizAttempts.reduce((acc, curr) => acc + Number(curr.score), 0) /
          quizAttempts.length
        ).toFixed(1)
      : 0;

  const passedQuizzesCount = quizAttempts?.filter((q) => q.is_passed).length || 0;
  const perfectQuizzesCount = quizAttempts?.filter((q) => Number(q.score) === 100).length || 0;
  const completedCoursesCount =
    enrollments?.filter((e) => Number(e.progress_percentage) === 100).length || 0;
  const enrolledCoursesCount = enrollments?.length || 0;

  // Hitung gamifikasi (XP, Level, Badges)
  const gamification = calculateGamification({
    completedLessonsCount: completedLessonsCount || 0,
    passedQuizzesCount,
    perfectQuizzesCount,
    enrolledCoursesCount,
    completedCoursesCount,
  });

  const fullName = profile?.full_name || user.email?.split("@")[0] || "Mahasiswa";
  const userRole = profile?.role || "student";
  const institution = profile?.institution || "Pendidikan Informatika";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100">
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

            <div className="flex items-center gap-3">
              <Link href="/courses">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs">
                  Katalog Modul
                </Button>
              </Link>

              <Link href="/dashboard/profile">
                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                  <Settings className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Pengaturan Profil</span>
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
                <div className="flex flex-col text-right hidden sm:flex">
                  <span className="text-xs font-semibold text-slate-900 dark:text-white max-w-[120px] truncate">
                    {fullName}
                  </span>
                  <span className="text-[10px] text-slate-500 capitalize">{userRole}</span>
                </div>

                <form action={logoutAction}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2"
                    title="Keluar"
                  >
                    <LogOut className="h-4 w-4" />
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
          {/* Welcome & Gamification Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-950 p-6 sm:p-8 text-white shadow-xl mb-8">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-xl space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-800/80 border border-indigo-700 text-xs font-medium text-indigo-200">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
                  <span>{institution}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Selamat Datang, {fullName}! 👋
                </h1>
                <p className="text-sm text-indigo-200 leading-relaxed">
                  Lanjutkan modul belajar Anda, raih XP dari setiap latihan & kuis, dan bangun portfolio akademik informatika berstandar industri.
                </p>
                <div className="pt-2">
                  <Link href="/dashboard/profile">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-indigo-400/50 bg-indigo-900/40 text-indigo-100 hover:bg-indigo-800 text-xs gap-1.5"
                    >
                      <User className="h-3.5 w-3.5" />
                      Kelola Identitas Profil
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Gamification Level & XP Card */}
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 min-w-[280px] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-400 text-amber-950 font-black text-xs">
                      Lvl {gamification.level}
                    </div>
                    <div>
                      <span className="text-xs font-bold block">{gamification.levelTitle}</span>
                      <span className="text-[10px] text-indigo-200">Tier Akademik</span>
                    </div>
                  </div>
                  <Badge variant="warning" className="text-[11px] font-mono gap-1">
                    <Zap className="h-3 w-3 fill-amber-500" />
                    {gamification.totalXp} XP
                  </Badge>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-indigo-200">
                    <span>Progres Level</span>
                    <span>
                      {gamification.level === 5
                        ? "Maksimal"
                        : `${gamification.progressPercent}% menuju Lvl ${gamification.level + 1}`}
                    </span>
                  </div>
                  <div className="w-full bg-black/30 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-indigo-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${gamification.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>
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
                <span className="text-xs font-semibold text-slate-500">Total Pengalaman</span>
                <Flame className="h-4 w-4 text-rose-500" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{gamification.totalXp} XP</div>
                <p className="text-[11px] text-slate-500 mt-1">Poin reputasi akademik</p>
              </CardContent>
            </Card>
          </div>

          {/* Prestasi Akademik & Badges */}
          <div className="mb-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-amber-500" />
                  Prestasi & Badges Mahasiswa
                </h2>
                <p className="text-xs text-slate-500">
                  {gamification.unlockedBadgesCount} dari {gamification.totalBadgesCount} lencana kompetensi telah Anda raih
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {gamification.badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                    b.isUnlocked
                      ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/20 dark:border-amber-900/60 shadow-sm"
                      : "border-slate-200 bg-slate-50/60 opacity-60 dark:bg-slate-900/40 dark:border-slate-800"
                  }`}
                >
                  <div
                    className={`h-11 w-11 rounded-2xl flex items-center justify-center mb-2 shadow-sm ${
                      b.isUnlocked
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300"
                        : "bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {b.isUnlocked ? (
                      b.icon === "Footprints" ? (
                        <Footprints className="h-5 w-5" />
                      ) : b.icon === "BookOpenCheck" ? (
                        <BookOpenCheck className="h-5 w-5" />
                      ) : b.icon === "Award" ? (
                        <Award className="h-5 w-5" />
                      ) : b.icon === "Sparkles" ? (
                        <Sparkles className="h-5 w-5" />
                      ) : b.icon === "Compass" ? (
                        <Compass className="h-5 w-5" />
                      ) : (
                        <GraduationCap className="h-5 w-5" />
                      )
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {b.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">
                      {b.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Enrolled Section */}
          <div className="space-y-4 mb-8">
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

          {/* Bookmarks Section (Materi Tersimpan) */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Bookmark className="h-5 w-5 text-amber-500" />
                  Materi Tersimpan (Bookmarks)
                </h2>
                <p className="text-xs text-slate-500">
                  Daftar materi penting yang Anda simpan untuk referensi cepat
                </p>
              </div>
            </div>

            {(!bookmarks || bookmarks.length === 0) ? (
              <Card className="p-6 text-center border-dashed border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500">
                  Belum ada materi yang disimpan. Saat membaca pelajaran di Ruang Belajar, klik tombol <strong>"Simpan Materi"</strong> di kanan atas untuk menandai materi favorit.
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bookmarks.map((bm: any) => {
                  const lesson = Array.isArray(bm.lessons) ? bm.lessons[0] : bm.lessons;
                  const course = lesson && Array.isArray(lesson.courses) ? lesson.courses[0] : lesson?.courses;
                  if (!lesson || !course) return null;

                  return (
                    <Card
                      key={bm.id}
                      className="p-4 border-slate-200 hover:border-amber-300 transition-colors flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider block truncate">
                          {course.title}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                          {lesson.title}
                        </h4>
                        <span className="text-xs text-slate-500 flex items-center gap-1.5">
                          <Clock className="h-3 w-3" /> {lesson.estimated_minutes} Menit
                        </span>
                      </div>

                      <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
                        <Link href={`/courses/${course.slug}/learn/${lesson.slug}`} className="w-full block">
                          <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                            Buka Materi
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quiz Attempts / History Section */}
          <div className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Award className="h-5 w-5 text-indigo-600" />
                  Riwayat Uji Kompetensi Kuis
                </h2>
                <p className="text-xs text-slate-500">
                  Hasil evaluasi pemahaman materi yang terverifikasi otomatis oleh server
                </p>
              </div>
            </div>

            {(!quizAttempts || quizAttempts.length === 0) ? (
              <Card className="p-6 text-center border-dashed border border-slate-200 dark:border-slate-800">
                <p className="text-xs text-slate-500">
                  Belum ada riwayat pengerjaan kuis. Selesaikan modul materi pelajaran untuk mulai mengerjakan evaluasi akhir.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {quizAttempts.map((attempt) => {
                  const quiz = attempt.quizzes;
                  const course = quiz?.courses;
                  const score = Number(attempt.score);
                  const isPassed = attempt.is_passed;

                  return (
                    <div
                      key={attempt.id}
                      className="p-4 rounded-xl border border-slate-200/90 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-indigo-300 transition-colors dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex items-start sm:items-center gap-3.5">
                        <span
                          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold shrink-0 ${
                            isPassed
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                          }`}
                        >
                          {score}
                        </span>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                              {quiz?.title || "Uji Kompetensi"}
                            </h4>
                            <Badge variant={isPassed ? "success" : "danger"} className="text-[10px]">
                              {isPassed ? "LULUS" : "REMEDIAL"}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500">
                            Modul: {course?.title || "Informatika"} • Tanggal:{" "}
                            {new Date(attempt.started_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {course?.slug && (
                        <Link href={`/courses/${course.slug}/quiz`}>
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                            <RotateCcw className="h-3.5 w-3.5" />
                            Ulangi Kuis
                          </Button>
                        </Link>
                      )}
                    </div>
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
