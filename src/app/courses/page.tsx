import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";
import {
  Search,
  Clock,
  BookOpen,
  User,
  ArrowRight,
  CheckCircle2,
  Filter,
} from "lucide-react";

export const metadata = {
  title: "Katalog Kursus — SkillForge",
  description: "Daftar lengkap modul dan kursus Pendidikan Informatika di SkillForge",
};

interface CoursesPageProps {
  searchParams: Promise<{
    category?: string;
    difficulty?: string;
    search?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const { category: selectedCategory, difficulty: selectedDifficulty, search: searchQuery } =
    await searchParams;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil profil jika login
  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  // Ambil semua kategori dari database
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  // Query kursus dari database
  let coursesQuery = supabase
    .from("courses")
    .select("*, categories(*), lessons(id)")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (selectedDifficulty) {
    coursesQuery = coursesQuery.eq("difficulty", selectedDifficulty);
  }

  if (searchQuery) {
    coursesQuery = coursesQuery.ilike("title", `%${searchQuery}%`);
  }

  const { data: rawCourses } = await coursesQuery;

  // Filter kategori di server-side jika ada
  let courses = rawCourses || [];
  if (selectedCategory) {
    courses = courses.filter((c) => c.categories?.slug === selectedCategory);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar user={user} fullName={profile?.full_name} />
      <main className="flex-1 py-12 bg-slate-50/50 dark:bg-slate-950">
        <Container size="default">
          {/* Header Section */}
          <div className="mb-10 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Eksplorasi Kurikulum
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              Katalog Kursus Pendidikan Informatika
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl text-sm sm:text-base">
              Pilih topik pembelajaran terstruktur yang selaras dengan profil kompetensi mahasiswa Pendidikan Informatika.
            </p>
          </div>

          {/* Search & Difficulty Filter Bar */}
          <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input Form */}
            <form method="GET" className="relative flex-1 max-w-md">
              {selectedCategory && (
                <input type="hidden" name="category" value={selectedCategory} />
              )}
              {selectedDifficulty && (
                <input type="hidden" name="difficulty" value={selectedDifficulty} />
              )}
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                name="search"
                defaultValue={searchQuery || ""}
                placeholder="Cari materi (misal: HTML, Algoritma, SQL)..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
              />
            </form>

            {/* Difficulty Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <Link
                href={`/courses?${new URLSearchParams({
                  ...(selectedCategory ? { category: selectedCategory } : {}),
                  ...(searchQuery ? { search: searchQuery } : {}),
                }).toString()}`}
              >
                <Button
                  size="sm"
                  variant={!selectedDifficulty ? "default" : "outline"}
                  className="text-xs h-8 rounded-lg"
                >
                  Semua Tingkat
                </Button>
              </Link>
              <Link
                href={`/courses?${new URLSearchParams({
                  ...(selectedCategory ? { category: selectedCategory } : {}),
                  ...(searchQuery ? { search: searchQuery } : {}),
                  difficulty: "beginner",
                }).toString()}`}
              >
                <Button
                  size="sm"
                  variant={selectedDifficulty === "beginner" ? "default" : "outline"}
                  className="text-xs h-8 rounded-lg"
                >
                  Pemula
                </Button>
              </Link>
              <Link
                href={`/courses?${new URLSearchParams({
                  ...(selectedCategory ? { category: selectedCategory } : {}),
                  ...(searchQuery ? { search: searchQuery } : {}),
                  difficulty: "intermediate",
                }).toString()}`}
              >
                <Button
                  size="sm"
                  variant={selectedDifficulty === "intermediate" ? "default" : "outline"}
                  className="text-xs h-8 rounded-lg"
                >
                  Menengah
                </Button>
              </Link>
            </div>
          </div>

          {/* Category Horizontal Pills */}
          <div className="mb-8 flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-none">
            <Link
              href={`/courses?${new URLSearchParams({
                ...(selectedDifficulty ? { difficulty: selectedDifficulty } : {}),
                ...(searchQuery ? { search: searchQuery } : {}),
              }).toString()}`}
              className="shrink-0"
            >
              <span
                className={`inline-flex items-center whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                  !selectedCategory
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white border border-slate-200/90 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                }`}
              >
                Semua Kategori ({courses.length})
              </span>
            </Link>
            {categories?.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/courses?${new URLSearchParams({
                    category: cat.slug,
                    ...(selectedDifficulty ? { difficulty: selectedDifficulty } : {}),
                    ...(searchQuery ? { search: searchQuery } : {}),
                  }).toString()}`}
                  className="shrink-0"
                >
                  <span
                    className={`inline-flex items-center whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium cursor-pointer transition-all ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                        : "bg-white border border-slate-200/90 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 shadow-sm dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Courses Grid */}
          {courses.length === 0 ? (
            <Card className="p-12 text-center border-dashed border-2">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-500 mb-4 dark:bg-slate-800">
                <Filter className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Tidak ada kursus yang sesuai
              </h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-6">
                Coba ubah kata kunci pencarian atau reset filter kategori untuk melihat semua modul.
              </p>
              <Link href="/courses">
                <Button variant="outline" size="sm">
                  Reset Semua Filter
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => {
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

                const lessonsCount = course.lessons?.length || 0;

                return (
                  <Card
                    key={course.id}
                    className="flex flex-col justify-between overflow-hidden border-slate-200/80 hover:border-indigo-400 transition-all hover:shadow-lg dark:border-slate-800"
                  >
                    <div>
                      <div className="h-3 bg-gradient-to-r from-indigo-500 to-indigo-700" />
                      <CardHeader className="p-5 pb-3">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <Badge variant="default" className="text-[11px] font-medium">
                            {course.categories?.name || "Informatika"}
                          </Badge>
                          <Badge variant={difficultyVariant} className="text-[11px]">
                            {difficultyLabel}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-bold leading-snug line-clamp-2">
                          {course.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-5 pt-0">
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed mb-4">
                          {course.description}
                        </p>

                        {objectives.length > 0 && (
                          <div className="space-y-1.5 mb-4 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                              Capaian Pembelajaran:
                            </span>
                            {objectives.slice(0, 2).map((obj: string, idx: number) => (
                              <div
                                key={idx}
                                className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400"
                              >
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                                <span className="line-clamp-1">{obj}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDuration(course.estimated_duration_minutes || 60)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5" />
                            <span>{lessonsCount} Pelajaran</span>
                          </div>
                        </div>
                      </CardContent>
                    </div>

                    <CardFooter className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <User className="h-3.5 w-3.5" />
                        <span className="truncate max-w-[130px]">Dosen Pengampu</span>
                      </div>
                      <Link href={`/courses/${course.slug}`}>
                        <Button size="sm" className="gap-1 text-xs">
                          Buka Modul
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </div>
  );
}
