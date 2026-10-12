import * as React from "react";
import { PLATFORM_ADVANTAGES } from "@/data/curriculum";
import { Container } from "@/components/ui/container";
import {
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Flame,
  Smartphone,
  BarChart3,
} from "lucide-react";

const ICON_MAP: Record<string, React.ReactNode> = {
  GraduationCap: <GraduationCap className="h-6 w-6 text-indigo-600" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-emerald-600" />,
  CheckCircle2: <CheckCircle2 className="h-6 w-6 text-blue-600" />,
  Flame: <Flame className="h-6 w-6 text-amber-600" />,
  Smartphone: <Smartphone className="h-6 w-6 text-violet-600" />,
  BarChart3: <BarChart3 className="h-6 w-6 text-cyan-600" />,
};

export function Advantages() {
  return (
    <section id="advantages" className="py-20 bg-white dark:bg-slate-900">
      <Container size="default">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Nilai Tambah & Kualitas
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Mengapa SkillForge Tepat untuk Pendidikan Informatika?
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
            Dibangun dengan standar rekayasa modern tanpa kompromi pada aspek pedagogis dan keamanan data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_ADVANTAGES.map((adv, index) => (
            <div
              key={index}
              className="p-6 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all dark:bg-slate-800/40 dark:border-slate-800 dark:hover:bg-slate-800"
            >
              <div className="h-12 w-12 rounded-xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center mb-4 dark:bg-slate-900 dark:border-slate-700">
                {adv.icon && ICON_MAP[adv.icon] ? (
                  ICON_MAP[adv.icon]
                ) : (
                  <CheckCircle2 className="h-6 w-6 text-indigo-600" />
                )}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {adv.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {adv.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
