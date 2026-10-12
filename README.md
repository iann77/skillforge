# ⚡ SkillForge — Interactive Informatics Learning Platform

> **"Learn Informatics. Build Your Future."**

SkillForge adalah platform pembelajaran digital interaktif yang dirancang khusus untuk sivitas akademika **Pendidikan Informatika** (calon pendidik, pengembang perangkat lunak, dan mahasiswa teknologi). Platform ini memadukan kedalaman keilmuan *Computer Science* murni (algoritma, pemrograman web, basis data, arsitektur sistem) dengan prinsip modern *Educational Technology* (desain instruksional, pedagogi digital TPACK, dan asesmen berbantuan komputer).

Project ini dibangun sebagai portofolio utama berskala produksi dengan arsitektur modern, backend teruji, Row Level Security (RLS), serta validasi server-side.

---

## 🚀 Fitur Utama

1. **Public Website & Educational Landing Page**
   - Penjelasan pilar kurikulum terstruktur (10 Bidang Studi Pendidikan Informatika).
   - Katalog modul komprehensif dengan capaian pembelajaran (Learning Objectives) terukur.
   - FAQ interaktif dan informasi kepatuhan kebijakan data mahasiswa.

2. **Autentikasi & Multi-Role Access Control (Supabase Auth)**
   - Role terisolasi: `student` (default), `instructor`, dan `admin`.
   - Perlindungan data ketat berbasis *PostgreSQL Row Level Security (RLS)*.

3. **Ruang Belajar Interaktif (Learning Space)**
   - Modul bertahap: *Category → Course → Lesson → Quiz*.
   - Navigasi antarmateri dengan penanda penyelesaian dan pelacakan progres otomatis.

4. **Sistem Evaluasi Kuis Terverifikasi Server**
   - Penilaian kuis di sisi server untuk integritas nilai dan pencegahan manipulasi klien.
   - Umpan balik kunci jawaban dan penjelasan setelah submission.

5. **Gamifikasi & Dashboard Mahasiswa**
   - Pelacakan streak belajar harian, akumulasi poin, bookmark materi, dan ringkasan aktivitas nyata.

6. **Admin & Instructor Management Area**
   - Manajemen modul (CRUD Course, Lesson, Quiz, Question).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Server Components & Client Components)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide React](https://lucide.dev/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL dengan RLS)
- **Form & Validation**: React Hook Form & Zod
- **Deployment**: Vercel & GitHub Actions

---

## 📁 Struktur Direktori

```text
skillforge/
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (Pages & Layouts)
│   │   ├── auth/           # Login & Registrasi
│   │   ├── courses/        # Katalog & Detail Kursus
│   │   ├── privacy/        # Kebijakan Privasi
│   │   ├── terms/          # Ketentuan Penggunaan
│   │   ├── globals.css     # Design tokens & styling
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Homepage / Landing page
│   ├── components/
│   │   ├── landing/        # Modul Landing Page (Hero, Categories, FAQ, dll.)
│   │   ├── layout/         # Reusable Layout (Navbar, Footer, Container)
│   │   └── ui/             # Reusable UI Primitives (Button, Card, Badge)
│   ├── data/               # Seed data & kurikulum Pendidikan Informatika
│   ├── lib/
│   │   ├── supabase/       # Client & Server Supabase connectors (@supabase/ssr)
│   │   └── utils.ts        # Helper functions & cn()
│   └── types/              # Strict TypeScript definitions
├── supabase/
│   └── migrations/         # PostgreSQL DDL migrations & RLS policies
├── .env.example            # Template konfigurasi environment
├── package.json
└── tsconfig.json
```

---

## 💻 Panduan Instalasi Lokal

### 1. Prasyarat
- **Node.js**: Versi LTS 20.x atau 24.x
- **NPM** atau **PNPM**
- **Git**

### 2. Kloning & Instal Dependensi
```bash
git clone <url-repository-anda>
cd skillforge
npm install
```

### 3. Konfigurasi Environment Variables
Salin template konfigurasi:
```bash
cp .env.example .env.local
```
Lengkapi nilai pada file `.env.local` dari dashboard Supabase Anda:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Menjalankan SQL Migration di Supabase
1. Buka dashboard Supabase project Anda.
2. Masuk ke menu **SQL Editor**.
3. Buka file `supabase/migrations/001_initial_schema.sql` dan jalankan script SQL tersebut.

### 5. Menjalankan Server Pengembangan
```bash
npm run dev
```
Akses aplikasi melalui peramban web di: `http://localhost:3000`.

---

## 🧪 Pengujian & Build Production

Untuk memverifikasi tipe TypeScript dan kesiapan build:
```bash
npm run build
```

---

## 🚀 Panduan Deployment ke Vercel

1. Push commit ke repository GitHub Anda:
   ```bash
   git add .
   git commit -m "feat: complete Phase 1 SkillForge setup"
   git push origin main
   ```
2. Buka [Vercel](https://vercel.com/) dan import repository GitHub tersebut.
3. Tambahkan environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) di panel settings Vercel.
4. Klik **Deploy**.

---

## 🗺️ Roadmap Pengembangan

- [x] **Fase 1**: Audit project, setup Next.js, design system tokens, dan complete landing page.
- [ ] **Fase 2**: Integrasi Supabase Auth & implementasi database profiles, guards, dan session.
- [ ] **Fase 3**: Katalog kursus dinamis, filter kategori, dan antarmuka ruang belajar interaktif.
- [ ] **Fase 4**: Dashboard mahasiswa, kalkulasi progres riil, dan sinkronisasi aktivitas belajar.
- [ ] **Fase 5**: Engine kuis server-side, scoring anti-manipulasi, dan riwayat nilai.
- [ ] **Fase 6**: Admin & Instructor dashboard untuk manajemen kurikulum & materi.
- [ ] **Fase 7**: Gamifikasi, streak belajar, bookmark, dan achievement.
- [ ] **Fase 8**: Security review, automated testing, dan final production deployment.
- [ ] **Fase 9**: Portofolio showcase video & integrasi evaluasi tingkat lanjut.
