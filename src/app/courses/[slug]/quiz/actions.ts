"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface SubmitQuizPayload {
  quizId: string;
  courseSlug: string;
  answers: Record<string, string>; // questionId -> selectedOptionId
}

export interface QuestionReview {
  questionId: string;
  questionText: string;
  selectedOptionId: string | null;
  correctOptionId: string;
  isCorrect: boolean;
  explanation: string | null;
  options: {
    id: string;
    optionText: string;
    isCorrect: boolean;
  }[];
}

export interface QuizSubmissionResult {
  attemptId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  isPassed: boolean;
  passingScore: number;
  reviews: QuestionReview[];
}

export async function submitQuizAction(
  payload: SubmitQuizPayload
): Promise<{ success: boolean; result?: QuizSubmissionResult; error?: string }> {
  const supabase = await createClient();
  const adminDb = createAdminClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesi Anda telah kedaluwarsa. Silakan masuk kembali." };
  }

  const { quizId, courseSlug, answers } = payload;

  // 1. Ambil data kuis via adminDb
  const { data: quiz, error: qErr } = await adminDb
    .from("quizzes")
    .select("id, title, passing_score, course_id")
    .eq("id", quizId)
    .single();

  if (qErr || !quiz) {
    return { success: false, error: "Data kuis tidak ditemukan." };
  }

  // 2. Ambil semua pertanyaan beserta opsi jawabannya via adminDb
  const { data: questions, error: questErr } = await adminDb
    .from("quiz_questions")
    .select("id, question_text, explanation, sort_order, quiz_options(id, option_text, is_correct, sort_order)")
    .eq("quiz_id", quizId)
    .order("sort_order", { ascending: true });

  if (questErr || !questions || questions.length === 0) {
    return { success: false, error: "Pertanyaan kuis belum tersedia." };
  }

  // 3. Evaluasi jawaban di server
  let correctCount = 0;
  const reviews: QuestionReview[] = [];
  const answersToInsert: {
    question_id: string;
    selected_option_id: string | null;
    is_correct: boolean;
  }[] = [];

  for (const q of questions) {
    const selectedOptionId = answers[q.id] || null;
    const correctOption = q.quiz_options.find((opt) => opt.is_correct);
    const isCorrect = !!(selectedOptionId && correctOption && selectedOptionId === correctOption.id);

    if (isCorrect) {
      correctCount += 1;
    }

    answersToInsert.push({
      question_id: q.id,
      selected_option_id: selectedOptionId,
      is_correct: isCorrect,
    });

    reviews.push({
      questionId: q.id,
      questionText: q.question_text,
      selectedOptionId,
      correctOptionId: correctOption ? correctOption.id : "",
      isCorrect,
      explanation: q.explanation,
      options: q.quiz_options.map((opt) => ({
        id: opt.id,
        optionText: opt.option_text,
        isCorrect: opt.is_correct,
      })),
    });
  }

  const totalQuestions = questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = score >= quiz.passing_score;

  // 4. Simpan percobaan kuis ke tabel quiz_attempts via adminDb
  const { data: attempt, error: attemptErr } = await adminDb
    .from("quiz_attempts")
    .insert({
      user_id: user.id,
      quiz_id: quizId,
      score,
      is_passed: isPassed,
      finished_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (attemptErr || !attempt) {
    console.error("Error creating quiz attempt:", attemptErr?.message);
    return { success: false, error: "Gagal menyimpan hasil kuis ke database." };
  }

  // 5. Simpan detail jawaban ke quiz_answers via adminDb
  const answersRecords = answersToInsert.map((ans) => ({
    attempt_id: attempt.id,
    question_id: ans.question_id,
    selected_option_id: ans.selected_option_id,
    is_correct: ans.is_correct,
  }));

  await adminDb.from("quiz_answers").insert(answersRecords);

  // 6. Catat aktivitas belajar via adminDb
  await adminDb.from("learning_activities").insert({
    user_id: user.id,
    activity_type: "quiz_completed",
    description: `Menyelesaikan kuis "${quiz.title}" dengan skor ${score}/100 (${isPassed ? "Lulus" : "Belum Lulus"})`,
    metadata: {
      quiz_id: quizId,
      attempt_id: attempt.id,
      score,
      is_passed: isPassed,
    },
  });

  revalidatePath(`/courses/${courseSlug}/quiz`);
  revalidatePath("/dashboard");

  return {
    success: true,
    result: {
      attemptId: attempt.id,
      score,
      totalQuestions,
      correctAnswers: correctCount,
      isPassed,
      passingScore: quiz.passing_score,
      reviews,
    },
  };
}
