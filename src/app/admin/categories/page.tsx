import * as React from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderTree, BookOpen, Layers } from "lucide-react";

export const metadata = {
  title: "Bidang Kategori — Admin SkillForge",
};

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*, courses(id)")
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Bidang Keilmuan Pendidikan Informatika
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Daftar 10 bidang kompetensi kurikulum yang menaungi seluruh mata kuliah dan modul di platform SkillForge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories?.map((cat) => {
          const courseCount = cat.courses?.length || 0;

          return (
            <Card key={cat.id} className="p-5 border-slate-200/90 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    Urutan #{cat.sort_order}
                  </span>
                  <Badge variant={courseCount > 0 ? "success" : "outline"} className="text-[10px]">
                    {courseCount} Kursus Aktif
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {cat.name}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>

                <div className="text-[11px] font-mono text-slate-400">
                  Slug: {cat.slug}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
