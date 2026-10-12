import * as React from "react";
import Link from "next/link";
import { FEATURED_COURSES } from "@/data/curriculum";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDuration } from "@/lib/utils";
import { Clock, BookOpen, User, ArrowRight, CheckCircle2 } from "lucide-react";

export function FeaturedCourses() {
  return (
    <section id="courses" className="py-20 bg-white dark:bg-slate-900">
      <Container size="default">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Modul Pilihan
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
              Kursus Unggulan Pendidikan Informatika
            </h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-xl text-base">
              Materi komprehensif yang dirancang oleh akademisi dengan capaian pembelajaran terukur dan pengujian pemahaman berbasis kuis.
            </p>
          </div>
          <Link href="/courses">
            <Button variant="outline" className="gap-2">
              Lihat Semua Kursus
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

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
                        Capaian Pembelajaran Utama:
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
    </section>
  );
}
