"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import {
  submitQuizAction,
  QuizSubmissionResult,
} from "./actions";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Sparkles,
  HelpCircle,
  Check,
} from "lucide-react";

interface QuestionOption {
  id: string;
  option_text: string;
  sort_order: number;
}

interface Question {
  id: string;
  question_text: string;
  sort_order: number;
  quiz_options: QuestionOption[];
}

interface QuizPlayerProps {
  quizId: string;
  quizTitle: string;
  quizDescription: string | null;
  passingScore: number;
  courseSlug: string;
  courseTitle: string;
  questions: Question[];
}

export function QuizPlayer({
  quizId,
  quizTitle,
  quizDescription,
  passingScore,
  courseSlug,
  courseTitle,
  questions,
}: QuizPlayerProps) {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<QuizSubmissionResult | null>(null);

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (questionId: string, optionId: string) => {
    if (result) return; // Kuis sudah disubmit
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitQuizAction({
        quizId,
        courseSlug,
        answers,
      });

      if (!res.success || !res.result) {
        setErrorMessage(res.error || "Terjadi kesalahan saat memproses jawaban kuis.");
      } else {
        setResult(res.result);
      }
    } catch {
      setErrorMessage("Koneksi gagal. Silakan coba kirim kembali.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setResult(null);
    setAnswers({});
    setCurrentIdx(0);
    setErrorMessage(null);
  };

  // =========================================================================
  // TAMPILAN HASIL / REVIEW KUIS
  // =========================================================================
  if (result) {
    return (
      <div className="space-y-8 max-w-3xl mx-auto">
        {/* Banner Skor Akhir */}
        <Card className={`border-2 overflow-hidden shadow-lg ${result.isPassed ? "border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20" : "border-rose-400 bg-rose-50/30 dark:bg-rose-950/20"}`}>
          <div className={`h-3 ${result.isPassed ? "bg-emerald-500" : "bg-rose-500"}`} />
          <CardContent className="p-8 text-center space-y-4">
            <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl ${result.isPassed ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60" : "bg-rose-100 text-rose-600 dark:bg-rose-900/60"}`}>
              {result.isPassed ? <Award className="h-10 w-10" /> : <RotateCcw className="h-10 w-10" />}
            </div>

            <div>
              <Badge variant={result.isPassed ? "success" : "danger"} className="text-sm px-3 py-1 mb-2 font-semibold">
                {result.isPassed ? "🎉 LULUS KOMPETENSI" : "⚠️ BELUM LULUS (REMEDIAL)"}
              </Badge>
              <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                Skor Anda: {result.score} / 100
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Menjawab benar <strong className="text-slate-900 dark:text-white">{result.correctAnswers}</strong> dari total{" "}
                <strong className="text-slate-900 dark:text-white">{result.totalQuestions}</strong> pertanyaan. Passing score minimal:{" "}
                <strong className="text-slate-900 dark:text-white">{result.passingScore}%</strong>.
              </p>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              {result.isPassed && (
                <Link href={`/courses/${courseSlug}/certificate`}>
                  <Button className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 shadow-md font-semibold">
                    <Award className="h-4 w-4" />
                    Klaim Sertifikat Kelulusan Resmi
                  </Button>
                </Link>
              )}
              <Button onClick={handleRetake} variant="outline" className="gap-2 text-xs">
                <RotateCcw className="h-4 w-4" />
                Ulangi Pengerjaan Kuis
              </Button>
              <Link href={`/courses/${courseSlug}`}>
                <Button variant="outline" className="gap-2 text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  Detail Kursus
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost" className="gap-2 text-xs">
                  Ke Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Breakdown Pembahasan Soal */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Review Pembahasan Pedagogis ({result.reviews.length} Soal)
            </h3>
            <span className="text-xs text-slate-500">
              Evaluasi Terverifikasi Server
            </span>
          </div>

          {result.reviews.map((rev, idx) => (
            <Card
              key={rev.questionId}
              className={`border transition-all ${
                rev.isCorrect
                  ? "border-emerald-200 dark:border-emerald-900/60"
                  : "border-rose-200 dark:border-rose-900/60"
              }`}
            >
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-slate-500">
                    Pertanyaan #{idx + 1}
                  </span>
                  <Badge variant={rev.isCorrect ? "success" : "danger"} className="text-xs gap-1">
                    {rev.isCorrect ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> Benar
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" /> Salah
                      </>
                    )}
                  </Badge>
                </div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {rev.questionText}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-5 pt-0 space-y-3">
                <div className="space-y-2">
                  {rev.options.map((opt) => {
                    const isUserChoice = opt.id === rev.selectedOptionId;
                    const isCorrectChoice = opt.isCorrect;

                    let optionStyle = "border-slate-200 bg-white text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300";
                    if (isCorrectChoice) {
                      optionStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold dark:bg-emerald-950/60 dark:text-emerald-200";
                    } else if (isUserChoice && !rev.isCorrect) {
                      optionStyle = "border-rose-500 bg-rose-50 text-rose-900 line-through dark:bg-rose-950/60 dark:text-rose-200";
                    }

                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-colors ${optionStyle}`}
                      >
                        <div className="flex items-center gap-2">
                          {isCorrectChoice && <Check className="h-4 w-4 text-emerald-600 shrink-0" />}
                          {isUserChoice && !isCorrectChoice && <XCircle className="h-4 w-4 text-rose-600 shrink-0" />}
                          <span>{opt.optionText}</span>
                        </div>
                        {isUserChoice && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                            Pilihan Anda
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {rev.explanation && (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1 dark:bg-slate-800/40 dark:border-slate-800 dark:text-slate-300">
                    <span className="font-semibold block text-indigo-600 dark:text-indigo-400">
                      💡 Pembahasan Konsep:
                    </span>
                    <p className="leading-relaxed">{rev.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // =========================================================================
  // TAMPILAN LEMBAR PENGERJAAN KUIS
  // =========================================================================
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Kuis */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <Link
            href={`/courses/${courseSlug}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Kembali ke {courseTitle}
          </Link>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {quizTitle}
          </h1>
          {quizDescription && (
            <p className="text-xs text-slate-500 mt-0.5">{quizDescription}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs font-mono">
            Passing: {passingScore}%
          </Badge>
          <Badge variant="outline" className="text-xs">
            {answeredCount} / {totalQuestions} Terjawab
          </Badge>
        </div>
      </div>

      {/* Navigasi Nomor Soal (Pills) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {questions.map((q, idx) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = idx === currentIdx;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIdx(idx)}
              className={`h-9 w-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center shrink-0 ${
                isCurrent
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 scale-105"
                  : isAnswered
                  ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Kartu Pertanyaan Aktif */}
      <Card className="border-slate-200/90 shadow-md">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>
              Soal {currentIdx + 1} dari {totalQuestions}
            </span>
            <span>Pilihan Ganda</span>
          </div>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
            {currentQuestion.question_text}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6 pt-0 space-y-3">
          {currentQuestion.quiz_options.map((option, optIdx) => {
            const isSelected = answers[currentQuestion.id] === option.id;
            const optionLetter = String.fromCharCode(65 + optIdx); // A, B, C, D

            return (
              <div
                key={option.id}
                onClick={() => handleSelectOption(currentQuestion.id, option.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3.5 ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-50/70 text-indigo-900 dark:bg-indigo-950/60 dark:border-indigo-500 dark:text-indigo-200 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/40"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                    isSelected
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                  }`}
                >
                  {optionLetter}
                </span>
                <span className="text-sm font-medium leading-relaxed">
                  {option.option_text}
                </span>
              </div>
            );
          })}
        </CardContent>

        <CardFooter className="p-6 pt-0 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIdx((prev) => Math.max(0, prev - 1))}
            disabled={currentIdx === 0}
            className="gap-1.5 text-xs"
          >
            <ArrowLeft className="h-4 w-4" />
            Sebelumnya
          </Button>

          {currentIdx < totalQuestions - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrentIdx((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="gap-1.5 text-xs"
            >
              Selanjutnya
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={isSubmitting || answeredCount === 0}
              className="gap-2 text-xs bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isSubmitting ? "Memverifikasi Jawaban..." : "Selesaikan & Submit Kuis"}
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Error Banner jika ada */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tombol Submit Cepat di Bawah Jika Belum Terakhir */}
      {currentIdx < totalQuestions - 1 && answeredCount === totalQuestions && (
        <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-center space-y-2 dark:bg-indigo-950/40 dark:border-indigo-900">
          <p className="text-xs text-indigo-900 dark:text-indigo-200 font-medium">
            🎯 Semua {totalQuestions} pertanyaan telah Anda jawab! Anda siap mengirimkan hasil ujian.
          </p>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold gap-1.5"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isSubmitting ? "Memproses Nilai..." : "Kirim Jawaban Kuis Sekarang"}
          </Button>
        </div>
      )}
    </div>
  );
}
