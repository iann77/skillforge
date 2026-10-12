import * as React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Categories } from "@/components/landing/categories";
import { FeaturedCourses } from "@/components/landing/featured-courses";
import { Workflow } from "@/components/landing/workflow";
import { Advantages } from "@/components/landing/advantages";
import { FAQ } from "@/components/landing/faq";
import { CTA } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 selection:bg-indigo-500 selection:text-white dark:bg-slate-950 dark:text-slate-100">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Categories />
        <FeaturedCourses />
        <Workflow />
        <Advantages />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
