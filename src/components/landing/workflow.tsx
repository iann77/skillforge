import * as React from "react";
import { PLATFORM_WORKFLOW } from "@/data/curriculum";
import { Container } from "@/components/ui/container";

export function Workflow() {
  return (
    <section id="learning-path" className="py-20 bg-slate-50 dark:bg-slate-950/60 border-y border-slate-200/70 dark:border-slate-800">
      <Container size="default">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Alur Pembelajaran
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            Bagaimana Mahasiswa Belajar di SkillForge?
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-base">
            Metode terpadu dari pengenalan konsep dasar, latihan terstruktur, hingga uji kompetensi server-side.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PLATFORM_WORKFLOW.map((item, index) => (
            <div
              key={item.step}
              className="relative p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between dark:bg-slate-900 dark:border-slate-800"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-black font-mono text-indigo-600/30 dark:text-indigo-400/30">
                    {item.step}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
