import * as React from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { QuizPlayer } from "./quiz-player";

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

  if (!course) return { title: "Kuis — SkillForge" };
  return {
    title: `Uji Kompetensi: ${course.title} — SkillForge`,
  };
}

export default async function CourseQuizPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/courses/${slug}/quiz`);
  }

  // Ambil profil
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Ambil kursus
  const { data: course } = await supabase
    .from("courses")
    .select("id, title, slug")
    .eq("slug", slug)
    .single();

  if (!course) {
    return notFound();
  }

  // Ambil data kuis
  const { data: quiz } = await supabase
    .from("quizzes")
    .select("id, title, description, passing_score")
    .eq("course_id", course.id)
    .maybeSingle();

  if (!quiz) {
    return (
      <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
        <Navbar user={user} fullName={profile?.full_name} />
        <main className="flex-1 py-16">
          <Container size="default">
            <div className="max-w-md mx-auto text-center space-y-4">
              <h2 className="text-xl font-bold">Kuis Belum Tersedia</h2>
              <p className="text-sm text-slate-500">
                Uji kompetensi untuk modul ini sedang disiapkan oleh dosen pengampu.
              </p>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    );
  }

  // Ambil pertanyaan beserta opsi (HANYA id, question_text, sort_order, dan opsi tanpa is_correct)
  // Untuk keamanan tinggi, kita tidak memilih is_correct di sini!
  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, question_text, sort_order, quiz_options(id, option_text, sort_order)")
    .eq("quiz_id", quiz.id)
    .order("sort_order", { ascending: true });

  if (!questions || questions.length === 0) {
    return notFound();
  }

  // Urutkan opsi
  const sanitizedQuestions = questions.map((q) => ({
    ...q,
    quiz_options: (q.quiz_options || []).sort((a, b) => a.sort_order - b.sort_order),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar user={user} fullName={profile?.full_name} />
      <main className="flex-1 py-10">
        <Container size="default">
          <QuizPlayer
            quizId={quiz.id}
            quizTitle={quiz.title}
            quizDescription={quiz.description}
            passingScore={quiz.passing_score}
            courseSlug={course.slug}
            courseTitle={course.title}
            questions={sanitizedQuestions}
          />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
