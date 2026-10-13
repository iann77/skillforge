"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function enrollCourseAction(courseId: string, courseSlug: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/courses/${courseSlug}`);
  }

  // Cek apakah sudah terdaftar
  const { data: existingEnrollment } = await supabase
    .from("course_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("course_id", courseId)
    .maybeSingle();

  if (!existingEnrollment) {
    // Daftarkan mahasiswa ke kursus
    const { error } = await supabase.from("course_enrollments").insert({
      user_id: user.id,
      course_id: courseId,
      progress_percentage: 0.0,
    });

    if (error) {
      console.error("Error enrolling course:", error.message);
      return { error: "Gagal mendaftar kursus. Silakan coba lagi." };
    }

    // Catat log aktivitas belajar
    await supabase.from("learning_activities").insert({
      user_id: user.id,
      activity_type: "course_enrolled",
      description: `Mendaftar kursus baru`,
      metadata: { course_id: courseId },
    });
  }

  // Cari pelajaran pertama
  const { data: firstLesson } = await supabase
    .from("lessons")
    .select("slug")
    .eq("course_id", courseId)
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .limit(1)
    .maybeSingle();

  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath("/dashboard");

  if (firstLesson) {
    redirect(`/courses/${courseSlug}/learn/${firstLesson.slug}`);
  } else {
    redirect(`/courses/${courseSlug}`);
  }
}

export async function toggleLessonProgressAction(
  lessonId: string,
  courseId: string,
  courseSlug: string,
  nextLessonSlug?: string | null
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/courses/${courseSlug}`);
  }

  // Cek progres saat ini
  const { data: currentProgress } = await supabase
    .from("lesson_progress")
    .select("id, is_completed")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  const nextStatus = currentProgress ? !currentProgress.is_completed : true;

  if (currentProgress) {
    await supabase
      .from("lesson_progress")
      .update({
        is_completed: nextStatus,
        completed_at: nextStatus ? new Date().toISOString() : null,
      })
      .eq("id", currentProgress.id);
  } else {
    await supabase.from("lesson_progress").insert({
      user_id: user.id,
      lesson_id: lessonId,
      is_completed: true,
      completed_at: new Date().toISOString(),
    });
  }

  // Hitung ulang progress percentage pada course_enrollments
  const { data: allLessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", courseId)
    .eq("status", "published");

  const totalLessons = allLessons?.length || 1;

  const { data: completedLessons } = await supabase
    .from("lesson_progress")
    .select("lesson_id")
    .eq("user_id", user.id)
    .eq("is_completed", true)
    .in("lesson_id", allLessons?.map((l) => l.id) || []);

  const completedCount = completedLessons?.length || 0;
  const progressPct = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  await supabase
    .from("course_enrollments")
    .update({
      progress_percentage: progressPct,
      completed_at: progressPct === 100 ? new Date().toISOString() : null,
    })
    .eq("user_id", user.id)
    .eq("course_id", courseId);

  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath(`/courses/${courseSlug}/learn/${nextLessonSlug || ""}`);
  revalidatePath("/dashboard");

  if (nextLessonSlug) {
    redirect(`/courses/${courseSlug}/learn/${nextLessonSlug}`);
  }
}

export async function toggleBookmarkAction(
  lessonId: string,
  courseSlug: string,
  lessonSlug: string
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/auth/login?redirect=/courses/${courseSlug}/learn/${lessonSlug}`);
  }

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", user.id)
    .eq("lesson_id", lessonId)
    .maybeSingle();

  if (existing) {
    await supabase.from("bookmarks").delete().eq("id", existing.id);
  } else {
    await supabase.from("bookmarks").insert({
      user_id: user.id,
      lesson_id: lessonId,
    });
  }

  revalidatePath(`/courses/${courseSlug}/learn/${lessonSlug}`);
  revalidatePath("/dashboard");
}
