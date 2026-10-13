"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { updateProfileAction } from "./actions";
import { CheckCircle2, AlertCircle, Save, Shield, User, School, FileText, Mail, Calendar } from "lucide-react";

interface ProfileFormProps {
  userEmail: string;
  fullName: string;
  institution: string;
  bio: string | null;
  role: string;
  createdAt: string;
}

export function ProfileForm({
  userEmail,
  fullName,
  institution,
  bio,
  role,
  createdAt,
}: ProfileFormProps) {
  const [isPending, setIsPending] = React.useState(false);
  const [statusMessage, setStatusMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await updateProfileAction(formData);
      if (res.success) {
        setStatusMessage({ type: "success", text: res.message || "Profil berhasil disimpan!" });
      } else {
        setStatusMessage({ type: "error", text: res.error || "Gagal memperbarui profil." });
      }
    } catch {
      setStatusMessage({ type: "error", text: "Terjadi kesalahan jaringan." });
    } finally {
      setIsPending(false);
    }
  };

  const formattedJoinDate = new Date(createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {statusMessage && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Informasi Keamanan Akun (Read-only) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200 dark:bg-slate-900/60 dark:border-slate-800 text-xs">
        <div className="space-y-1">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email Akun
          </span>
          <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{userEmail}</p>
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" /> Peran Sistem
          </span>
          <div className="pt-0.5">
            <Badge variant="default" className="text-[11px] capitalize">
              {role === "student" ? "Mahasiswa" : role}
            </Badge>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-slate-500 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" /> Bergabung Sejak
          </span>
          <p className="font-semibold text-slate-800 dark:text-slate-200">{formattedJoinDate}</p>
        </div>
      </div>

      {/* Form Input Editable */}
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Nama Lengkap Mahasiswa
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            defaultValue={fullName}
            placeholder="Masukkan nama lengkap Anda..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="institution" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <School className="h-3.5 w-3.5" /> Program Studi / Perguruan Tinggi
          </label>
          <input
            id="institution"
            name="institution"
            type="text"
            defaultValue={institution}
            placeholder="Contoh: Program Studi Pendidikan Informatika - Universitas Negeri..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="bio" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5" /> Bio / Minat Akademik
          </label>
          <textarea
            id="bio"
            name="bio"
            rows={3}
            defaultValue={bio || ""}
            placeholder="Tuliskan minat pembelajaran Anda (misal: Rekayasa Perangkat Lunak, Media Pembelajaran Digital, Web Engineering)..."
            className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
          />
        </div>
      </div>

      <div className="pt-2 flex items-center justify-end gap-3">
        <Button type="submit" disabled={isPending} className="gap-2 text-xs font-semibold shadow-sm">
          <Save className="h-4 w-4" />
          {isPending ? "Menyimpan Perubahan..." : "Simpan Pembaruan Profil"}
        </Button>
      </div>
    </form>
  );
}
