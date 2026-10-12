import * as React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FEATURED_COURSES, INFORMATICS_CATEGORIES } from "@/data/curriculum";
import { formatDuration } from "@/lib/utils";
import { Search, Clock, BookOpen, User, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Katalog Kursus — SkillForge",
  description: "Daftar lengkap modul dan kursus Pendidikan Informatika di SkillForge",
};

export default function CoursesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="flex-1 py-12 bg-slate-50/50 dark:bg-slate-950">
        <Container size="default">
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Eksplorasi Kurikulum
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-slate-900 dark:text-white">
              Katalog Kursus Pendidikan Informatika
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl text-sm sm:text-base">
              Pilih topik pembelajaran terstruktur yang sesuai dengan rencana studi atau peminatan teknologi Anda.
            </p>
          </div>

          {/* Quick Category Pills */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shrink-0 cursor-pointer shadow-sm">
              Semua Kategori ({FEATURED_COURSES.length})
            </span>
            {INFORMATICS_CATEGORIES.slice(0, 6).map((cat) => (
              <span
                key={cat.id}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 shrink-0 cursor-pointer transition-colors dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
              >
                {cat.name}
              </span>
            ))}
          </div>

          {/* Course List Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURED_COURSES.map((course) => {
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
                <Card
                  key={course.id}
                  className="flex flex-col justify-between overflow-hidden border-slate-200/80 hover:border-indigo-400 transition-all hover:shadow-lg dark:border-slate-800"
                >
                  <div>
                    <div className="h-3 bg-gradient-to-r from-indigo-500 to-indigo-700" />
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <Badge variant="default" className="text-[11px] font-medium">
                          {course.category?.name || "Informatika"}
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

                      <div className="space-y-1.5 mb-4 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                          Capaian Pembelajaran:
                        </span>
                        {course.learning_objectives.slice(0, 2).map((obj, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{obj}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatDuration(course.estimated_duration_minutes)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>{course.total_lessons} Pelajaran</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800 mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <User className="h-3.5 w-3.5" />
                      <span className="truncate max-w-[130px]">{course.instructor_name}</span>
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
        </Container>
      </main>
      <Footer />
    </div>
  );
}
