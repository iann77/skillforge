import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/ui/container";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";
import { ArrowLeft, UserCheck, ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Pengaturan Profil Mahasiswa — SkillForge",
  description: "Kelola profil akademik dan informasi akun mahasiswa Anda di SkillForge",
};

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/profile");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <Navbar user={user} fullName={profile?.full_name} />
      <main className="flex-1 py-10">
        <Container size="default">
          <div className="max-w-2xl mx-auto space-y-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Dashboard Mahasiswa
            </Link>

            <Card className="border-slate-200/90 shadow-sm overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700" />
              <CardHeader className="p-6 pb-4">
                <div className="flex items-center gap-2 text-indigo-600 mb-1">
                  <UserCheck className="h-5 w-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Identitas Akademik
                  </span>
                </div>
                <CardTitle className="text-xl font-extrabold text-slate-900 dark:text-white">
                  Pengaturan Profil Mahasiswa
                </CardTitle>
                <p className="text-xs text-slate-500">
                  Perbarui nama lengkap, institusi pendidikan, dan minat komputasi Anda untuk keperluan sertifikat dan transkrip kelulusan modul.
                </p>
              </CardHeader>

              <CardContent className="p-6 pt-0">
                <ProfileForm
                  userEmail={user.email || ""}
                  fullName={profile?.full_name || ""}
                  institution={profile?.institution || "Program Studi Pendidikan Informatika"}
                  bio={profile?.bio || null}
                  role={profile?.role || "student"}
                  createdAt={profile?.created_at || user.created_at || new Date().toISOString()}
                />
              </CardContent>
            </Card>

            <div className="p-4 rounded-xl border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex items-start gap-3 text-xs text-slate-500">
              <ShieldAlert className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Kebijakan Integritas:</strong> Peran akun (*Role*) dikunci pada tingkat sistem dan dilindungi oleh Supabase Row Level Security (RLS). Pengubahan hak akses instruktur atau admin hanya dapat dilakukan melalui otoritas administrator.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
