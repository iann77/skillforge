import * as React from "react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CertificateViewer } from "./certificate-viewer";
import { ArrowLeft, Lock, CheckCircle2, Award, PlayCircle } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: course } = await supabase
    .from("courses")
    .select("title")
    .eq("slug", slug)
    .single();

  if (!course) return { title: "Sertifikat — SkillForge" };
  return {
    title: `Sertifikat Kelulusan: ${course.title} — SkillForge`,
  };
}

export const dynamic = "force-dynamic";

export default async function CourseCertificatePage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/courses/${slug}/certificate`);
  }

  // Ambil profil mahasiswa
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Ambil data kursus beserta instruktur dan kategori
  const { data: course } = await supabase
    .from("courses")
    .select("*, categories(name), profiles:instructor_id(full_name)")
    .eq("slug", slug)
    .single();

  if (!course) {
    return notFound();
  }

  // Cek enrollment dan progres kursus
  const { data: enrollment } = await supabase
    .from("course_enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", course.id)
    .maybeSingle();

  // Ambil data kuis kursus ini
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, title, passing_score")
    .eq("course_id", course.id)
    .maybeSingle();

  // Cek apakah mahasiswa lulus kuis kursus ini
  let bestAttempt = null;
  if (quiz) {
    const { data: attempt } = await supabase
      .from("quiz_attempts")
      .select("*")
      .eq("user_id", user.id)
      .eq("quiz_id", quiz.id)
      .eq("is_passed", true)
      .order("score", { ascending: false })
      .limit(1)
      .maybeSingle();

    bestAttempt = attempt;
  }

  const isProgressComplete = (enrollment?.progress_percentage || 0) >= 100;
  const isQuizPassed = !!bestAttempt;
  const isEligibleForCertificate = isProgressComplete && isQuizPassed;

  const recipientName = profile?.full_name || user.email?.split("@")[0] || "Mahasiswa Informatika";
  const instructorName = (Array.isArray(course.profiles) ? course.profiles[0]?.full_name : course.profiles?.full_name) || "Dosen Pengampu PTI";
  const categoryName = (Array.isArray(course.categories) ? course.categories[0]?.name : course.categories?.name) || "Pendidikan Informatika";
  const completionDate = enrollment?.completed_at || bestAttempt?.finished_at || new Date().toISOString();
  const certificateId = `SF-${course.slug.substring(0, 4).toUpperCase()}-${user.id.substring(0, 8).toUpperCase()}`;

  // =========================================================================
  // JIKA BELUM MEMENUHI SYARAT KELULUSAN
  // =========================================================================
  if (!isEligibleForCertificate) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 text-slate-900 dark:text-slate-100">
        <Container size="default">
          <div className="max-w-xl mx-auto space-y-6">
            <Link
              href={`/courses/${course.slug}`}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke {course.title}
            </Link>

            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-6 dark:bg-slate-900 dark:border-slate-800">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/60 dark:border-amber-800">
                <Lock className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <Badge variant="warning" className="text-xs">
                  Sertifikat Terkunci
                </Badge>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Syarat Kelulusan Belum Terpenuhi
                </h1>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Untuk menerbitkan Sertifikat Kelulusan resmi modul <strong>{course.title}</strong>, Anda harus menuntaskan seluruh materi silabus dan lulus uji kompetensi kuis.
                </p>
              </div>

              {/* Checklist Syarat */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-left space-y-3 dark:bg-slate-800/40 dark:border-slate-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        isProgressComplete ? "text-emerald-600" : "text-slate-300"
                      }`}
                    />
                    Menyelesaikan 100% Seluruh Materi Pelajaran
                  </span>
                  <span className="font-semibold font-mono text-slate-700 dark:text-slate-300">
                    {enrollment?.progress_percentage || 0}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2
                      className={`h-4 w-4 ${
                        isQuizPassed ? "text-emerald-600" : "text-slate-300"
                      }`}
                    />
                    Lulus Uji Kompetensi Kuis (Passing: {quiz?.passing_score || 70}%)
                  </span>
                  <span className="font-semibold font-mono text-slate-700 dark:text-slate-300">
                    {isQuizPassed ? `Lulus (${bestAttempt?.score}%)` : "Belum Lulus"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {!isProgressComplete && (
                  <Link href={`/courses/${course.slug}`}>
                    <Button size="sm" className="gap-2 text-xs">
                      <PlayCircle className="h-4 w-4" />
                      Lanjutkan Pelajaran Modul
                    </Button>
                  </Link>
                )}
                {!isQuizPassed && (
                  <Link href={`/courses/${course.slug}/quiz`}>
                    <Button size="sm" variant="outline" className="gap-2 text-xs">
                      <Award className="h-4 w-4" />
                      Kerjakan Uji Kompetensi Kuis
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // =========================================================================
  // JIKA LULUS: TAMPILKAN SERTIFIKAT RESMI
  // =========================================================================
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-10 print:p-0 print:bg-white text-slate-900 dark:text-slate-100">
      <Container size="default">
        <CertificateViewer
          certificateId={certificateId}
          studentName={recipientName}
          institution={profile?.institution || "Program Studi Pendidikan Informatika"}
          courseTitle={course.title}
          categoryName={categoryName}
          instructorName={instructorName}
          completionDate={completionDate}
          courseSlug={course.slug}
          quizScore={Number(bestAttempt?.score || 100)}
        />
      </Container>
    </div>
  );
}
