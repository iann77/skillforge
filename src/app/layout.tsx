import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillForge — Interactive Informatics Learning Platform",
  description:
    "Platform pembelajaran digital interaktif khusus bidang Pendidikan Informatika. Kuasai algoritma, rekayasa perangkat lunak, hingga perancangan media pembelajaran digital.",
  keywords: [
    "SkillForge",
    "Pendidikan Informatika",
    "Learning Platform",
    "Algoritma",
    "Pemrograman Web",
    "Basis Data",
    "EdTech",
  ],
  authors: [{ name: "SkillForge Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
