"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sesi Anda telah kedaluwarsa. Silakan login kembali." };
  }

  const fullName = formData.get("fullName") as string;
  const institution = formData.get("institution") as string;
  const bio = formData.get("bio") as string;

  if (!fullName || fullName.trim().length < 2) {
    return { success: false, error: "Nama lengkap wajib diisi minimal 2 karakter." };
  }

  // Update profil di tabel public.profiles (tanpa menyentuh field role)
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName.trim(),
      institution: institution?.trim() || "Program Studi Pendidikan Informatika",
      bio: bio?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("Error updating profile:", error.message);
    return { success: false, error: "Gagal memperbarui profil: " + error.message };
  }

  // Catat aktivitas belajar jika pertama kali melengkapi profil
  await supabase.from("learning_activities").insert({
    user_id: user.id,
    activity_type: "profile_updated",
    description: "Memperbarui informasi profil mahasiswa",
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");

  return { success: true, message: "Profil Anda berhasil diperbarui!" };
}
