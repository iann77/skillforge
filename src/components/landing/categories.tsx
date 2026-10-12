import * as React from "react";
import Link from "next/link";
import { INFORMATICS_CATEGORIES } from "@/data/curriculum";
import { Container } from "@/components/ui/container";
import {
  Code2,
  Globe,
  Database,
  Boxes,
  Cpu,
  Network,
  Layers,
  GraduationCap,
  LayoutTemplate,
  CheckSquare,
  ArrowRight,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  Code2: <Code2 className="h-6 w-6 text-indigo-600" />,
  Globe: <Globe className="h-6 w-6 text-blue-600" />,
  Database: <Database className="h-6 w-6 text-emerald-600" />,
  Boxes: <Boxes className="h-6 w-6 text-amber-600" />,
  Cpu: <Cpu className="h-6 w-6 text-violet-600" />,
  Network: <Network className="h-6 w-6 text-cyan-600" />,
  Layers: <Layers className="h-6 w-6 text-teal-600" />,
  GraduationCap: <GraduationCap className="h-6 w-6 text-rose-600" />,
  LayoutTemplate: <LayoutTemplate className="h-6 w-6 text-fuchsia-600" />,
  CheckSquare: <CheckSquare className="h-6 w-6 text-sky-600" />,
};

export function Categories() {
  return (
    <section id="categories" className="py-20 bg-slate-50 dark:bg-slate-950/50">
      <Container size="default">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2">
            Pilar Kurikulum Terstruktur
          </h2>
          <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            10 Bidang Pembelajaran Pendidikan Informatika
          </h3>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
            Dirancang secara holistik mengintegrasikan keilmuan Computer Science teknis
            dengan prinsip Educational Technology & Pedagogi Digital.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {INFORMATICS_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/courses?category=${category.slug}`}
              className="group p-5 rounded-xl border border-slate-200/90 bg-white hover:border-indigo-400 hover:shadow-md transition-all flex flex-col justify-between dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500"
            >
              <div>
                <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform dark:bg-slate-800">
                  {category.icon && ICON_MAP[category.icon] ? (
                    ICON_MAP[category.icon]
                  ) : (
                    <Code2 className="h-6 w-6 text-indigo-600" />
                  )}
                </div>
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors text-base line-clamp-1 dark:text-white">
                  {category.name}
                </h4>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed dark:text-slate-400">
                  {category.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-500 group-hover:text-indigo-600 transition-colors dark:border-slate-800">
                <span>Eksplor Modul</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
