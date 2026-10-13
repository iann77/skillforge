import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createLessonAction } from "@/app/admin/actions";
import { ArrowLeft, PlusCircle, Sparkles, BookOpen } from "lucide-react";

interface Props {
  params: Promise<{ courseId: string }>;
}

export const metadata = {
  title: "Tambah Modul Pelajaran — Admin SkillForge",
};

export default async function AdminNewLessonPage({ params }: Props) {
  const { courseId } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, title, slug, categories(name)")
    .eq("id", courseId)
    .single();

  if (!course) {
    return notFound();
  }

  // Hitung jumlah pelajaran saat ini untuk default sort_order
  const { count: currentLessonsCount } = await supabase
    .from("lessons")
    .select("*", { count: "exact", head: true })
    .eq("course_id", course.id);

  const nextSortOrder = (currentLessonsCount || 0) + 1;

  const category = Array.isArray(course.categories) ? course.categories[0] : course.categories;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/courses"
        className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Kembali ke Manajemen Kursus
      </Link>

      <Card className="border-slate-200/90 shadow-sm overflow-hidden">
        <div className="h-3 bg-gradient-to-r from-emerald-500 to-indigo-600" />
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="default" className="text-xs">
              {category?.name || "Informatika"}
            </Badge>
            <span className="text-xs text-slate-500 font-semibold truncate max-w-md">
              {course.title}
            </span>
          </div>
          <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">
            Tambah Modul Pelajaran Baru
          </CardTitle>
          <p className="text-xs text-slate-500">
            Tuliskan materi pembelajaran baru dengan format teks terstruktur atau Markdown instruksional.
          </p>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <form
            action={async (formData: FormData) => {
              "use server";
              await createLessonAction(formData);
            }}
            className="space-y-5"
          >
            <input type="hidden" name="courseId" value={course.id} />
            <input type="hidden" name="courseSlug" value={course.slug} />

            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Judul Materi Pelajaran *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Contoh: Konsep Pewarisan (Inheritance) dan Polimorfisme"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="slug" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Slug URL Unik *
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  placeholder="konsep-pewarisan-dan-polimorfisme"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="sortOrder" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Urutan Modul
                </label>
                <input
                  id="sortOrder"
                  name="sortOrder"
                  type="number"
                  defaultValue={nextSortOrder}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="estimatedMinutes" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Estimasi Waktu Belajar (Menit)
              </label>
              <input
                id="estimatedMinutes"
                name="estimatedMinutes"
                type="number"
                defaultValue={35}
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="objectives" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Tujuan Pembelajaran Modul (1 baris per tujuan)
              </label>
              <textarea
                id="objectives"
                name="objectives"
                rows={3}
                placeholder="Memahami sintaks pewarisan kelas&#10;Mampu mengimplementasikan override method"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="content" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Konten Lengkap Materi Pembelajaran (Markdown / Structured Text) *
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                required
                placeholder="# Judul Materi&#10;&#10;## Pengantar Teori&#10;Tuliskan konsep dasar...&#10;&#10;```typescript&#10;// Contoh blok kode program&#10;```&#10;&#10;## Latihan Soal&#10;Kerjakan latihan mandiri..."
                className="w-full px-3.5 py-2.5 text-sm font-mono rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Link href="/admin/courses">
                <Button type="button" variant="outline" size="sm" className="text-xs">
                  Batal
                </Button>
              </Link>
              <Button type="submit" size="sm" className="gap-2 text-xs font-semibold shadow-sm">
                <PlusCircle className="h-4 w-4" />
                Simpan & Terbitkan Materi
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
