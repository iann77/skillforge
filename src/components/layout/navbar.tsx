"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { logoutAction } from "@/app/auth/actions";
import { Code2, Menu, X, BookOpen, LogIn, UserPlus, LogOut, GraduationCap, LayoutDashboard } from "lucide-react";

interface User {
  id: string;
  email?: string;
}

interface NavbarProps {
  user?: User | null;
  fullName?: string | null;
}

export function Navbar({ user, fullName }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const publicLinks = [
    { name: "Beranda", href: "/" },
    { name: "Katalog Kursus", href: "/courses" },
    { name: "Keunggulan", href: "/#advantages" },
    { name: "FAQ", href: "/#faq" },
  ];

  const displayName = fullName || user?.email?.split("@")[0] || "Mahasiswa";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      <Container size="default">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-700 to-indigo-500 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Code2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Skill<span className="text-indigo-600">Forge</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 -mt-1">
                Pendidikan Informatika
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {publicLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  pathname === link.href
                    ? "text-indigo-600 font-semibold"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-1.5 font-medium text-slate-700">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="max-w-[120px] truncate">{displayName}</span>
                  </Button>
                </Link>
                <form action={logoutAction}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 font-medium text-rose-600 hover:text-rose-700 border-rose-200 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="gap-1.5 font-medium">
                    <LogIn className="h-4 w-4" />
                    Masuk
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="gap-1.5 font-medium shadow-sm">
                    <UserPlus className="h-4 w-4" />
                    Daftar Mahasiswa
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
          <nav className="flex flex-col space-y-3">
            {publicLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-base font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-200"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-2.5">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard Saya
                    </Button>
                  </Link>
                  <form action={logoutAction}>
                    <Button
                      variant="outline"
                      className="w-full justify-center gap-2 text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Keluar
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      Masuk ke Platform
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center">
                      Daftar Akun Baru
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
