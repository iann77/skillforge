import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleCourseStatusAction } from "@/app/admin/actions";
import { PlusCircle, BookOpen, Layers, ExternalLink, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Manajemen Kursus — Admin SkillForge",
};

export default async function AdminCoursesPage() {
  const supabase = await createClient();

  const { data: courses } = await supabase
    .from("courses")
    .select("*, categories(name), lessons(id, title)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Manajemen Kursus & Modul
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola status kurikulum, tambah modul materi baru, dan pantau silabus mata kuliah informatika.
          </p>
        </div>

        <Link href="/admin/courses/new">
          <Button size="sm" className="gap-2 text-xs font-semibold shadow-sm">
            <PlusCircle className="h-4 w-4" />
            Tambah Kursus Baru
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {courses?.map((course) => {
          const lessonsCount = course.lessons?.length || 0;

          return (
            <Card key={course.id} className="border-slate-200/90 shadow-sm overflow-hidden">
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 min-w-0 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <Badge variant={course.status === "published" ? "success" : "warning"} className="text-[10px]">
                      {course.status === "published" ? "Publikasi Aktif" : "Draft (Tersimpan)"}
                    </Badge>
                    <Badge variant="default" className="text-[10px]">
                      {course.categories?.name}
                    </Badge>
                    <span className="text-[11px] text-slate-400 capitalize">
                      Tingkat: {course.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Layers className="h-3.5 w-3.5" /> {lessonsCount} Modul Pelajaran
                    </span>
                    <span>Durasi: {course.estimated_duration_minutes} menit</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <Link href={`/admin/courses/${course.id}/lessons/new`}>
                    <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                      <PlusCircle className="h-3.5 w-3.5" />
                      Tambah Materi
                    </Button>
                  </Link>

                  <Link href={`/courses/${course.slug}`} target="_blank">
                    <Button size="sm" variant="ghost" className="gap-1 text-xs">
                      Pratinjau
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </Link>

                  <form
                    action={async () => {
                      "use server";
                      await toggleCourseStatusAction(course.id, course.status);
                    }}
                  >
                    <Button
                      type="submit"
                      size="sm"
                      variant="outline"
                      className={`text-xs ${
                        course.status === "published"
                          ? "text-amber-600 hover:bg-amber-50"
                          : "text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      {course.status === "published" ? "Tarik ke Draft" : "Publikasikan"}
                    </Button>
                  </form>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
