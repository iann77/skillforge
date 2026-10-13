"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Helper verifikasi admin
async function verifyAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return { supabase, user };
}

export async function createCourseAction(formData: FormData) {
  const { supabase, user } = await verifyAdmin();

  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string)?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  const description = formData.get("description") as string;
  const categoryId = formData.get("categoryId") as string;
  const difficulty = formData.get("difficulty") as "beginner" | "intermediate" | "advanced";
  const duration = parseInt(formData.get("duration") as string) || 60;
  const status = formData.get("status") as "draft" | "published";
  const objectivesRaw = formData.get("objectives") as string;

  if (!title || !slug || !description || !categoryId) {
    return { success: false, error: "Semua kolom wajib diisi dengan benar." };
  }

  const objectives = objectivesRaw
    ? objectivesRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const { data, error } = await supabase
    .from("courses")
    .insert({
      title,
      slug,
      description,
      category_id: categoryId,
      difficulty,
      estimated_duration_minutes: duration,
      instructor_id: user.id,
      status: status || "published",
      learning_objectives: JSON.stringify(objectives),
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating course:", error.message);
    return { success: false, error: "Gagal membuat kursus: " + error.message };
  }

  await supabase.from("learning_activities").insert({
    user_id: user.id,
    activity_type: "admin_course_created",
    description: `Membuat kursus baru "${title}"`,
    metadata: { course_id: data.id },
  });

  revalidatePath("/courses");
  revalidatePath("/admin");
  revalidatePath("/admin/courses");

  redirect("/admin/courses");
}

export async function toggleCourseStatusAction(courseId: string, currentStatus: string) {
  const { supabase } = await verifyAdmin();

  const newStatus = currentStatus === "published" ? "draft" : "published";

  const { error } = await supabase
    .from("courses")
    .update({ status: newStatus })
    .eq("id", courseId);

  if (error) {
    console.error("Error toggling course status:", error.message);
    return { success: false, error: error.message };
  }

  revalidatePath("/courses");
  revalidatePath("/admin");
  revalidatePath("/admin/courses");

  return { success: true, newStatus };
}

export async function createLessonAction(formData: FormData) {
  const { supabase, user } = await verifyAdmin();

  const courseId = formData.get("courseId") as string;
  const courseSlug = formData.get("courseSlug") as string;
  const title = formData.get("title") as string;
  const slug = (formData.get("slug") as string)?.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 1;
  const estimatedMinutes = parseInt(formData.get("estimatedMinutes") as string) || 30;
  const content = formData.get("content") as string;
  const objectivesRaw = formData.get("objectives") as string;

  if (!courseId || !title || !slug || !content) {
    return { success: false, error: "Judul, slug, dan isi materi wajib diisi." };
  }

  const objectives = objectivesRaw
    ? objectivesRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const { data, error } = await supabase
    .from("lessons")
    .insert({
      course_id: courseId,
      title,
      slug,
      sort_order: sortOrder,
      estimated_minutes: estimatedMinutes,
      content,
      learning_objectives: JSON.stringify(objectives),
      status: "published",
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating lesson:", error.message);
    return { success: false, error: "Gagal membuat pelajaran: " + error.message };
  }

  await supabase.from("learning_activities").insert({
    user_id: user.id,
    activity_type: "admin_lesson_created",
    description: `Menambahkan modul pelajaran baru "${title}"`,
    metadata: { lesson_id: data.id, course_id: courseId },
  });

  revalidatePath(`/courses/${courseSlug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/courses");

  redirect(`/admin/courses`);
}
