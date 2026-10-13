import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  Layers,
  Award,
  PlusCircle,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard — SkillForge",
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Query metrik platform
  const { count: studentCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: courseCount } = await supabase
    .from("courses")
    .select("*", { count: "exact", head: true });

  const { count: lessonCount } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true });

  const { count: quizAttemptCount } = await supabase
    .from("quiz_attempts")
    .select("*", { count: "exact", head: true });

  // Query kursus terbaru
  const { data: recentCourses } = await supabase
    .from("courses")
    .select("*, categories(name), lessons(id)")
    .order("created_at", { ascending: false })
    .limit(5);

  // Query log aktivitas terbaru
  const { data: recentActivities } = await supabase
    .from("learning_activities")
    .select("*, profiles:user_id(full_name, email)")
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dashboard Manajemen Pembelajaran
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Pantau pertumbuhan mahasiswa, ketersediaan modul kurikulum, dan analitik ujian secara waktu nyata.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/courses/new">
            <Button size="sm" className="gap-2 text-xs font-semibold shadow-sm">
              <PlusCircle className="h-4 w-4" />
              Buat Kursus Baru
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Metrik Utama */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-200/90 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500">Total Pengguna</span>
            <Users className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{studentCount || 0}</div>
            <p className="text-[11px] text-slate-500 mt-1">Akun terdaftar di database</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500">Total Modul Kursus</span>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{courseCount || 0}</div>
            <p className="text-[11px] text-slate-500 mt-1">Modul kurikulum aktif</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500">Materi Pelajaran</span>
            <Layers className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{lessonCount || 0}</div>
            <p className="text-[11px] text-slate-500 mt-1">Unit materi instruksional</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/90 shadow-sm">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <span className="text-xs font-semibold text-slate-500">Ujian & Evaluasi Selesai</span>
            <Award className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold">{quizAttemptCount || 0}</div>
            <p className="text-[11px] text-slate-500 mt-1">Percobaan kuis terverifikasi</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Kursus Terbaru & Manajemen */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Daftar Kursus Terbaru
            </h2>
            <Link href="/admin/courses" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
              Lihat Semua ({courseCount})
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentCourses?.map((course) => (
              <div
                key={course.id}
                className="p-4 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant={course.status === "published" ? "success" : "warning"} className="text-[10px]">
                      {course.status === "published" ? "Published" : "Draft"}
                    </Badge>
                    <span className="text-xs text-slate-500 truncate">
                      {course.categories?.name}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {course.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {course.lessons?.length || 0} Pelajaran • Tingkat: {course.difficulty}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/admin/courses/${course.id}/lessons/new`}>
                    <Button variant="outline" size="sm" className="text-xs gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      Tambah Materi
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Aktivitas Platform Terbaru */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-600" />
            Aktivitas Terkini
          </h2>

          <Card className="border-slate-200/90 shadow-sm p-4 space-y-3">
            {(!recentActivities || recentActivities.length === 0) ? (
              <p className="text-xs text-slate-500 italic text-center py-4">
                Belum ada log aktivitas tercatat.
              </p>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((act) => {
                  const userProfile = act.profiles;
                  return (
                    <div key={act.id} className="text-xs space-y-0.5 border-b border-slate-100 dark:border-slate-800 pb-2.5 last:border-0 last:pb-0">
                      <p className="font-semibold text-slate-800 dark:text-slate-200 leading-snug">
                        {act.description}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{userProfile?.full_name || "Pengguna"}</span>
                        <span>
                          {new Date(act.created_at).toLocaleTimeString("id-ID", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
