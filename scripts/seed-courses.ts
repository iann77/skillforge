import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// Load .env.local
const envFile = fs.readFileSync(path.resolve(process.cwd(), ".env.local"), "utf8");
const envVars: Record<string, string> = {};
envFile.split("\n").forEach((line) => {
  const parts = line.trim().split("=");
  if (parts.length >= 2 && !line.startsWith("#")) {
    envVars[parts[0].trim()] = parts.slice(1).join("=").trim();
  }
});

const supabaseUrl = envVars["NEXT_PUBLIC_SUPABASE_URL"];
const serviceKey = envVars["SUPABASE_SERVICE_ROLE_KEY"] || envVars["NEXT_PUBLIC_SUPABASE_ANON_KEY"];
const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  console.log("🚀 Seeding SkillForge database...\n");

  // 1. Seed categories
  console.log("📂 Inserting categories...");
  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .upsert([
      { name: "Algoritma dan Pemrograman", slug: "algoritma-dan-pemrograman", description: "Fondasi logika komputasi, pseudocode, flowchart, dan implementasi kode terstruktur.", icon: "Code2", sort_order: 1 },
      { name: "Pengembangan Web", slug: "pengembangan-web", description: "Membangun aplikasi web modern dari HTML, CSS, JavaScript hingga fullstack ecosystem.", icon: "Globe", sort_order: 2 },
      { name: "Basis Data dan SQL", slug: "basis-data-dan-sql", description: "Perancangan skema relasional, normalisasi, indexing, dan manipulasi data dengan SQL.", icon: "Database", sort_order: 3 },
      { name: "Struktur Data", slug: "struktur-data", description: "Pengorganisasian data efisien: Linked List, Stack, Queue, Tree, dan Graph.", icon: "Boxes", sort_order: 4 },
      { name: "Sistem Komputer & OS", slug: "sistem-komputer-dan-os", description: "Arsitektur Von Neumann, manajemen memori, proses, dan sistem berkas.", icon: "Cpu", sort_order: 5 },
      { name: "Jaringan Komputer", slug: "jaringan-komputer", description: "Model OSI & TCP/IP, subnetting, routing, dan protokol komunikasi.", icon: "Network", sort_order: 6 },
      { name: "Rekayasa Perangkat Lunak", slug: "rekayasa-perangkat-lunak", description: "SDLC, Scrum/Agile, pemodelan UML, design patterns, testing, dan QA.", icon: "Layers", sort_order: 7 },
      { name: "Teknologi Pendidikan", slug: "teknologi-pendidikan", description: "Integrasi TPACK dalam transformasi pendidikan modern.", icon: "GraduationCap", sort_order: 8 },
      { name: "Media Pembelajaran Digital", slug: "desain-instruksional-media", description: "Perancangan media ajar interaktif dan prinsip desain instruksional ADDIE.", icon: "LayoutTemplate", sort_order: 9 },
      { name: "Evaluasi Pembelajaran Digital", slug: "evaluasi-pembelajaran-digital", description: "Asesmen berbasis rubrik digital dan analitik belajar.", icon: "CheckSquare", sort_order: 10 },
    ], { onConflict: "slug" }).select();

  if (catErr) { console.error("Category error:", catErr.message); process.exit(1); }
  console.log(`✅ ${cats!.length} categories seeded.\n`);

  const catMap: Record<string, string> = {};
  cats!.forEach(c => { catMap[c.slug] = c.id; });

  // 2. We need a system instructor profile. Get any admin or create placeholder.
  // Use a fake but valid UUID for instructor_id (will be updated later)
  // First check if we have any profile
  const { data: profiles } = await supabase.from("profiles").select("id, role").limit(5);
  let instructorId = profiles?.[0]?.id;

  if (!instructorId) {
    console.log("⚠️  No profiles found yet. Create an account first via the app, then re-run seed.");
    console.log("Seeding categories only — courses will be seeded after first user signup.\n");
    return;
  }

  console.log(`👤 Using profile ${instructorId} as course instructor.\n`);

  // 3. Seed courses
  console.log("📚 Inserting courses...");
  const courses = [
    {
      title: "Dasar HTML, CSS, dan JavaScript Modern",
      slug: "dasar-html-css-javascript",
      description: "Pelajari pondasi utama web engineering. Kuasai semantik HTML5, modern layouting flexbox/grid, dan pemrograman JavaScript ES6+ untuk membangun antarmuka web yang responsif.",
      learning_objectives: JSON.stringify([
        "Memahami struktur semantik dan standar aksesibilitas HTML5",
        "Menguasai teknik layout modern menggunakan Flexbox dan CSS Grid",
        "Mengimplementasikan manipulasi DOM interaktif dengan vanilla JavaScript",
        "Membangun proyek mini web responsif berstandar industri",
      ]),
      category_id: catMap["pengembangan-web"],
      difficulty: "beginner",
      estimated_duration_minutes: 360,
      instructor_id: instructorId,
      status: "published",
    },
    {
      title: "Algoritma dan Pemrograman Dasar",
      slug: "algoritma-dan-pemrograman-dasar",
      description: "Kembangkan computational thinking dan problem-solving skill. Membahas tipe data, struktur kontrol, array, fungsi modular, dan pengantar kompleksitas waktu.",
      learning_objectives: JSON.stringify([
        "Menganalisis masalah komputasi dan merumuskan algoritma efisien",
        "Menguasai alur kontrol kondisional dan perulangan bersarang",
        "Mendesain fungsi modular dengan konsep pass-by-value/reference",
        "Memecahkan studi kasus algoritma pencarian dan pengurutan dasar",
      ]),
      category_id: catMap["algoritma-dan-pemrograman"],
      difficulty: "beginner",
      estimated_duration_minutes: 420,
      instructor_id: instructorId,
      status: "published",
    },
    {
      title: "Dasar Basis Data dan Relasional SQL",
      slug: "dasar-basis-data-dan-sql",
      description: "Kuasai konsep pemodelan Entity-Relationship (ERD), normalisasi data, serta query SQL tingkat lanjut: DDL, DML, JOIN bersarang, aggregasi, dan indexing.",
      learning_objectives: JSON.stringify([
        "Merancang Entity-Relationship Diagram (ERD) dari spesifikasi kebutuhan",
        "Menerapkan teknik normalisasi basis data untuk meminimalisir redundansi",
        "Menulis query SQL kompleks melibatkan Multi-table JOIN dan subquery",
        "Mengintegrasikan basis data PostgreSQL dengan aplikasi modern",
      ]),
      category_id: catMap["basis-data-dan-sql"],
      difficulty: "intermediate",
      estimated_duration_minutes: 300,
      instructor_id: instructorId,
      status: "published",
    },
    {
      title: "Pengantar Rekayasa Perangkat Lunak",
      slug: "pengantar-rekayasa-perangkat-lunak",
      description: "Pendekatan sistematis pengembangan perangkat lunak berskala besar. Mulai dari analisis kebutuhan (SRS), metodologi Scrum, pemodelan UML, hingga strategi pengujian.",
      learning_objectives: JSON.stringify([
        "Menyusun dokumen Software Requirements Specification (SRS) yang terstruktur",
        "Merancang diagram arsitektur UML (Use Case, Class, Sequence Diagram)",
        "Menerapkan prinsip clean code dan pengujian perangkat lunak otomatis",
        "Memahami siklus sprint delivery dalam metodologi Agile",
      ]),
      category_id: catMap["rekayasa-perangkat-lunak"],
      difficulty: "intermediate",
      estimated_duration_minutes: 330,
      instructor_id: instructorId,
      status: "published",
    },
    {
      title: "Teknologi Pendidikan & Media Pembelajaran Digital",
      slug: "teknologi-pendidikan-media-digital",
      description: "Pelajari cara merancang modul digital interaktif, integrasi simulasi ajar, pedagogi TPACK, dan instrumen asesmen pembelajaran berbasis web untuk calon pendidik informatika.",
      learning_objectives: JSON.stringify([
        "Menerapkan kerangka kerja TPACK dalam perencanaan pembelajaran informatika",
        "Mendesain media ajar interaktif dengan prinsip ADDIE dan Multimedia Learning",
        "Mengintegrasikan platform digital untuk meningkatkan keterlibatan siswa",
        "Menyusun instrumen evaluasi digital yang valid dan reliabel",
      ]),
      category_id: catMap["teknologi-pendidikan"],
      difficulty: "beginner",
      estimated_duration_minutes: 270,
      instructor_id: instructorId,
      status: "published",
    },
  ];

  const { data: insertedCourses, error: courseErr } = await supabase
    .from("courses")
    .upsert(courses, { onConflict: "slug" })
    .select();

  if (courseErr) { console.error("Course error:", courseErr.message); process.exit(1); }
  console.log(`✅ ${insertedCourses!.length} courses seeded.\n`);

  // 4. Seed lessons for course 1 (HTML/CSS/JS)
  const webCourse = insertedCourses!.find(c => c.slug === "dasar-html-css-javascript");
  if (webCourse) {
    console.log("📖 Inserting lessons for Web course...");
    const lessons = [
      {
        course_id: webCourse.id,
        title: "Pengantar HTML5 dan Struktur Semantik",
        slug: "pengantar-html5-semantik",
        sort_order: 1,
        estimated_minutes: 30,
        status: "published",
        learning_objectives: JSON.stringify(["Memahami peran HTML dalam web", "Menguasai elemen semantik HTML5"]),
        content: `# Pengantar HTML5 dan Struktur Semantik

## Apa itu HTML?

**HTML (HyperText Markup Language)** adalah bahasa markup standar yang digunakan untuk membuat halaman web. HTML mendefinisikan *struktur* dan *konten* dari sebuah halaman web menggunakan elemen-elemen yang direpresentasikan oleh **tag**.

---

## Struktur Dasar Dokumen HTML5

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Halaman Web Saya</title>
</head>
<body>
  <header>
    <nav>
      <a href="/">Beranda</a>
    </nav>
  </header>

  <main>
    <h1>Judul Utama</h1>
    <p>Ini adalah paragraf pertama.</p>
  </main>

  <footer>
    <p>&copy; 2026 SkillForge</p>
  </footer>
</body>
</html>
\`\`\`

---

## Elemen Semantik HTML5

HTML5 memperkenalkan elemen-elemen **semantik** yang memberikan makna struktural pada konten:

| Elemen | Fungsi |
|--------|--------|
| \`<header>\` | Kepala halaman atau bagian |
| \`<nav>\` | Navigasi utama |
| \`<main>\` | Konten utama halaman |
| \`<article>\` | Konten mandiri (artikel, postingan) |
| \`<section>\` | Bagian tematik konten |
| \`<aside>\` | Konten sampingan |
| \`<footer>\` | Kaki halaman atau bagian |

---

## Mengapa Semantik Penting?

1. **Aksesibilitas**: Screen reader lebih mudah memahami struktur halaman.
2. **SEO**: Mesin pencari mengindeks konten lebih akurat.
3. **Keterbacaan Kode**: Developer lain lebih mudah memahami struktur.

---

## Latihan

Buatlah dokumen HTML5 dengan struktur semantik yang tepat yang terdiri dari:
- Header dengan navigasi 3 tautan
- Main dengan satu artikel yang berisi judul dan 2 paragraf
- Footer dengan informasi hak cipta`,
      },
      {
        course_id: webCourse.id,
        title: "CSS Modern: Flexbox dan Grid Layout",
        slug: "css-flexbox-dan-grid",
        sort_order: 2,
        estimated_minutes: 45,
        status: "published",
        learning_objectives: JSON.stringify(["Menguasai Flexbox untuk layout 1D", "Menerapkan CSS Grid untuk layout 2D kompleks"]),
        content: `# CSS Modern: Flexbox dan Grid Layout

## CSS Flexbox

**Flexbox** adalah model layout CSS yang dirancang untuk mengatur elemen dalam **satu dimensi** (baris atau kolom).

\`\`\`css
.container {
  display: flex;
  justify-content: space-between; /* horizontal alignment */
  align-items: center;            /* vertical alignment */
  gap: 16px;
}

.item {
  flex: 1; /* setiap item mengambil ruang yang sama */
}
\`\`\`

---

## CSS Grid

**CSS Grid** adalah sistem layout dua dimensi yang memungkinkan pengaturan baris **dan** kolom sekaligus.

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 24px;
}

/* Item yang melebar 2 kolom */
.featured-item {
  grid-column: span 2;
}
\`\`\`

---

## Kapan Menggunakan Apa?

| Skenario | Rekomendasi |
|----------|-------------|
| Navigasi horizontal | Flexbox |
| Kartu dengan tinggi sama | Flexbox |
| Layout halaman penuh | Grid |
| Galeri foto responsif | Grid |
| Komponen kecil (tombol, badge) | Flexbox |

---

## Contoh Layout Responsif

\`\`\`css
/* Mobile: 1 kolom */
.card-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

/* Tablet: 2 kolom */
@media (min-width: 640px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 3 kolom */
@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
\`\`\`

---

## Latihan

Buat layout halaman blog sederhana menggunakan CSS Grid dengan:
- Header penuh lebar
- Sidebar (1/4 lebar) dan konten utama (3/4 lebar) di tengah
- Footer penuh lebar`,
      },
      {
        course_id: webCourse.id,
        title: "JavaScript ES6+: Variabel, Fungsi, dan DOM",
        slug: "javascript-es6-variabel-fungsi-dom",
        sort_order: 3,
        estimated_minutes: 60,
        status: "published",
        learning_objectives: JSON.stringify(["Memahami perbedaan var, let, dan const", "Menguasai arrow function dan template literals", "Memanipulasi DOM secara interaktif"]),
        content: `# JavaScript ES6+: Variabel, Fungsi, dan DOM

## Deklarasi Variabel Modern

ES6 memperkenalkan \`let\` dan \`const\` sebagai pengganti \`var\`:

\`\`\`javascript
// ❌ Hindari var (hoisting tidak terduga)
var nama = "Budi";

// ✅ Gunakan const untuk nilai tetap
const PI = 3.14159;
const APP_NAME = "SkillForge";

// ✅ Gunakan let untuk nilai yang berubah
let skor = 0;
skor += 10;
\`\`\`

---

## Arrow Function

Arrow function adalah sintaks ringkas untuk mendefinisikan fungsi:

\`\`\`javascript
// Fungsi tradisional
function tambah(a, b) {
  return a + b;
}

// Arrow function - satu baris
const tambah = (a, b) => a + b;

// Arrow function - multi baris
const hitungLuas = (panjang, lebar) => {
  const luas = panjang * lebar;
  return luas;
};

console.log(tambah(5, 3));    // 8
console.log(hitungLuas(4, 6)); // 24
\`\`\`

---

## Template Literals

\`\`\`javascript
const nama = "Mahasiswa";
const nilai = 95;

// ❌ Cara lama
console.log("Selamat, " + nama + "! Nilai Anda: " + nilai);

// ✅ Template literal (backtick)
console.log(\`Selamat, \${nama}! Nilai Anda: \${nilai}\`);
\`\`\`

---

## Manipulasi DOM

\`\`\`javascript
// Memilih elemen
const judul = document.querySelector("h1");
const tombol = document.getElementById("btn-submit");
const semuaItem = document.querySelectorAll(".item");

// Mengubah konten dan gaya
judul.textContent = "SkillForge - Belajar Informatika";
judul.style.color = "#4F46E5"; // indigo

// Menambahkan event listener
tombol.addEventListener("click", () => {
  alert("Tombol diklik!");
  tombol.textContent = "Sudah diklik";
  tombol.disabled = true;
});

// Membuat elemen baru
const paragraf = document.createElement("p");
paragraf.textContent = "Paragraf baru ditambahkan secara dinamis!";
document.body.appendChild(paragraf);
\`\`\`

---

## Latihan

Buat halaman interaktif dengan JavaScript yang:
1. Menampilkan formulir nama dan nilai
2. Saat tombol diklik, tampilkan pesan "Lulus" jika nilai ≥ 70, "Tidak Lulus" jika < 70
3. Tambahkan riwayat hasil ke daftar di bawah formulir`,
      },
    ];

    const { data: insertedLessons, error: lessonErr } = await supabase
      .from("lessons")
      .upsert(lessons, { onConflict: "course_id,slug" })
      .select();

    if (lessonErr) { console.error("Lesson error:", lessonErr.message); process.exit(1); }
    console.log(`✅ ${insertedLessons!.length} lessons seeded for Web course.\n`);
  }

  // 5. Seed lessons for Algorithms course
  const algoCourse = insertedCourses!.find(c => c.slug === "algoritma-dan-pemrograman-dasar");
  if (algoCourse) {
    console.log("📖 Inserting lessons for Algorithms course...");
    const algoLessons = [
      {
        course_id: algoCourse.id,
        title: "Pengantar Algoritma dan Computational Thinking",
        slug: "pengantar-algoritma-computational-thinking",
        sort_order: 1,
        estimated_minutes: 30,
        status: "published",
        learning_objectives: JSON.stringify(["Mendefinisikan algoritma dengan tepat", "Menerapkan 4 pilar computational thinking"]),
        content: `# Pengantar Algoritma dan Computational Thinking

## Apa itu Algoritma?

**Algoritma** adalah sekumpulan instruksi langkah demi langkah yang terdefinisi dengan baik untuk menyelesaikan suatu masalah atau mencapai tujuan tertentu.

### Ciri-ciri Algoritma yang Baik:
1. **Finiteness** — Berhenti setelah sejumlah langkah terbatas
2. **Definiteness** — Setiap langkah jelas dan tidak ambigu  
3. **Input** — Mempunyai nol atau lebih masukan
4. **Output** — Menghasilkan minimal satu keluaran
5. **Effectiveness** — Setiap langkah sederhana dan dapat dikerjakan

---

## Computational Thinking

**Computational Thinking** adalah proses berpikir terstruktur untuk memecahkan masalah kompleks, terdiri dari 4 pilar:

| Pilar | Penjelasan | Contoh |
|-------|------------|--------|
| **Decomposition** | Memecah masalah besar menjadi bagian kecil | Memecah "buat website" menjadi sub-tugas |
| **Pattern Recognition** | Menemukan pola yang berulang | Mengenali pola pengurutan data |
| **Abstraction** | Fokus pada informasi penting, abaikan detail | Peta jalan (abstraksi dari jalan nyata) |
| **Algorithm Design** | Merancang solusi langkah demi langkah | Flowchart resep masakan |

---

## Contoh Algoritma Sederhana

**Masalah:** Menentukan bilangan terbesar dari dua angka.

\`\`\`
ALGORITMA Terbesar(A, B):
  MULAI
    BACA A, B
    JIKA A > B MAKA
      TAMPILKAN "A lebih besar:", A
    SEBALIKNYA JIKA B > A MAKA
      TAMPILKAN "B lebih besar:", B
    SEBALIKNYA
      TAMPILKAN "A dan B sama besar"
    AKHIR JIKA
  SELESAI
\`\`\`

---

## Representasi Algoritma

1. **Pseudocode** — Bahasa informal menyerupai kode program
2. **Flowchart** — Diagram alur menggunakan simbol standar
3. **Kode Program** — Implementasi dalam bahasa pemrograman nyata

---

## Latihan

Tulis algoritma dalam pseudocode untuk menghitung nilai rata-rata dari 5 nilai mahasiswa!`,
      },
      {
        course_id: algoCourse.id,
        title: "Struktur Kontrol: Percabangan dan Perulangan",
        slug: "struktur-kontrol-percabangan-perulangan",
        sort_order: 2,
        estimated_minutes: 45,
        status: "published",
        learning_objectives: JSON.stringify(["Menerapkan if-else dan switch untuk percabangan", "Menggunakan for, while, dan do-while untuk perulangan"]),
        content: `# Struktur Kontrol: Percabangan dan Perulangan

## Percabangan (Conditional)

### If-Else
\`\`\`python
nilai = 85

if nilai >= 90:
    grade = "A"
elif nilai >= 80:
    grade = "B"
elif nilai >= 70:
    grade = "C"
elif nilai >= 60:
    grade = "D"
else:
    grade = "E"

print(f"Grade Anda: {grade}")  # Output: Grade Anda: B
\`\`\`

---

## Perulangan (Loop)

### For Loop — Perulangan Tertentu
\`\`\`python
# Mencetak angka 1 sampai 10
for i in range(1, 11):
    print(i)

# Iterasi elemen list
mahasiswa = ["Budi", "Siti", "Andi"]
for nama in mahasiswa:
    print(f"Halo, {nama}!")
\`\`\`

### While Loop — Perulangan Kondisional
\`\`\`python
# Terus berjalan sampai pengguna menebak angka benar
rahasia = 42
tebakan = 0

while tebakan != rahasia:
    tebakan = int(input("Tebak angka: "))
    if tebakan < rahasia:
        print("Terlalu kecil!")
    elif tebakan > rahasia:
        print("Terlalu besar!")

print("Selamat! Tebakan Anda benar.")
\`\`\`

---

## Perulangan Bersarang (Nested Loop)

\`\`\`python
# Mencetak tabel perkalian 1-5
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i*j:3}", end="")
    print()  # Baris baru setiap baris selesai
\`\`\`

Output:
\`\`\`
  1  2  3  4  5
  2  4  6  8 10
  3  6  9 12 15
  4  8 12 16 20
  5 10 15 20 25
\`\`\`

---

## Latihan

Buat program yang:
1. Meminta pengguna memasukkan 10 nilai mahasiswa
2. Menghitung rata-rata, nilai tertinggi, dan nilai terendah
3. Menampilkan grade untuk setiap nilai`,
      },
    ];

    const { data: algoLessonsData, error: algoLessonErr } = await supabase
      .from("lessons")
      .upsert(algoLessons, { onConflict: "course_id,slug" })
      .select();

    if (algoLessonErr) { console.error("Algo lesson error:", algoLessonErr.message); process.exit(1); }
    console.log(`✅ ${algoLessonsData!.length} lessons seeded for Algorithms course.\n`);
  }

  console.log("🎉 Database seeding complete!");
}

main().catch(console.error);
