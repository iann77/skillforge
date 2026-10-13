import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createCourseAction } from "@/app/admin/actions";
import { ArrowLeft, BookPlus, Sparkles } from "lucide-react";

export const metadata = {
  title: "Tambah Kursus Baru — Admin SkillForge",
};

export default async function AdminNewCoursePage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order", { ascending: true });

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
        <div className="h-3 bg-gradient-to-r from-indigo-500 to-indigo-700" />
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center gap-2 text-indigo-600 mb-1">
            <BookPlus className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Kurikulum Baru
            </span>
          </div>
          <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">
            Form Pembuatan Kursus Informatika
          </CardTitle>
          <p className="text-xs text-slate-500">
            Daftarkan mata kuliah atau topik baru ke dalam repositori pembelajaran SkillForge.
          </p>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          <form
            action={async (formData: FormData) => {
              "use server";
              await createCourseAction(formData);
            }}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label htmlFor="title" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Judul Kursus *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Contoh: Pemrograman Berorientasi Objek Lanjut"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="slug" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Slug URL Unik *
                </label>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  required
                  placeholder="pemrograman-berorientasi-objek-lanjut"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="categoryId" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Bidang Kategori *
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                >
                  <option value="">Pilih Kategori Bidang...</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="difficulty" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Tingkat Kesulitan
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  defaultValue="beginner"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                >
                  <option value="beginner">Pemula (Beginner)</option>
                  <option value="intermediate">Menengah (Intermediate)</option>
                  <option value="advanced">Lanjutan (Advanced)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="duration" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Estimasi Durasi (Menit)
                </label>
                <input
                  id="duration"
                  name="duration"
                  type="number"
                  defaultValue={180}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="status" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Status Publikasi
                </label>
                <select
                  id="status"
                  name="status"
                  defaultValue="published"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                >
                  <option value="published">Publikasikan Langsung</option>
                  <option value="draft">Simpan Sebagai Draft</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="description" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Deskripsi Lengkap Kursus *
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                required
                placeholder="Jelaskan cakupan topik dan relevansi modul ini bagi calon sarjana pendidikan informatika..."
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="objectives" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                Capaian Pembelajaran (Learning Objectives) — 1 per baris
              </label>
              <textarea
                id="objectives"
                name="objectives"
                rows={4}
                placeholder="Memahami konsep paradigma OOP dan enkapsulasi&#10;Mampu merancang diagram kelas UML berstandar industri&#10;Mengimplementasikan unit testing otomatis"
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <Link href="/admin/courses">
                <Button type="button" variant="outline" size="sm" className="text-xs">
                  Batal
                </Button>
              </Link>
              <Button type="submit" size="sm" className="gap-2 text-xs font-semibold shadow-sm">
                <BookPlus className="h-4 w-4" />
                Simpan & Daftarkan Kursus
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
