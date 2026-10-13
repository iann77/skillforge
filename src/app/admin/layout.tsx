import * as React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  GraduationCap,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const navItems = [
    { name: "Ringkasan & Metrik", href: "/admin", icon: LayoutDashboard },
    { name: "Manajemen Kursus", href: "/admin/courses", icon: BookOpen },
    { name: "Bidang Kategori", href: "/admin/categories", icon: FolderTree },
  ];

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Sidebar Admin */}
      <aside className="w-64 border-r border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 flex flex-col shrink-0 hidden md:flex sticky top-0 h-screen">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-600 to-indigo-600 text-white shadow-md">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white block">
              Skill<span className="text-indigo-600">Forge</span>
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 block -mt-0.5">
              Admin & Instructor
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-1">
          <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Menu Pengelolaan
          </span>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-indigo-600 transition-colors dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-indigo-400"
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Switch to Student Portal */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 text-xs">
            <span className="text-[10px] text-slate-400 block">Login Sebagai:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
              {profile.full_name}
            </span>
            <span className="text-[10px] text-amber-600 font-semibold uppercase">
              Administrator
            </span>
          </div>

          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Ke Portal Mahasiswa
          </Link>
        </div>
      </aside>

      {/* Main Admin Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-slate-200 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">
              Pusat Manajemen Kurikulum Pendidikan Informatika
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              target="_blank"
              className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              Lihat Katalog Publik
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
