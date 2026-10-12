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
  console.log("🚀 Seeding remaining lessons for 3 courses...\n");

  // Ambil courses
  const { data: courses, error: cErr } = await supabase.from("courses").select("id, slug, title");
  if (cErr) {
    console.error("Error fetching courses:", cErr.message);
    return;
  }

  const courseMap: Record<string, string> = {};
  courses?.forEach((c) => {
    courseMap[c.slug] = c.id;
  });

  // 1. Kursus: Dasar Basis Data dan Relasional SQL
  const dbCourseId = courseMap["dasar-basis-data-dan-sql"];
  if (dbCourseId) {
    console.log("📂 Inserting lessons for Basis Data dan SQL...");
    const dbLessons = [
      {
        course_id: dbCourseId,
        title: "Pengantar Basis Data Relasional & Entity-Relationship Diagram (ERD)",
        slug: "pengantar-basis-data-erd",
        sort_order: 1,
        estimated_minutes: 35,
        status: "published",
        learning_objectives: JSON.stringify([
          "Memahami perbedaan DBMS vs File Tradisional",
          "Mengenal konsep Relasional, Primary Key, dan Foreign Key",
          "Merancang Entity-Relationship Diagram (ERD) dari studi kasus riil",
        ]),
        content: `# Pengantar Basis Data Relasional & Entity-Relationship Diagram (ERD)

## Mengapa Membutuhkan Basis Data?

Sebelum adanya Database Management System (DBMS), data disimpan dalam berkas teks atau spreadsheet terpisah (*flat files*). Pendekatan ini menimbulkan banyak kelemahan:
1. **Redundansi data**: Data yang sama ditulis berulang kali di banyak berkas.
2. **Inkonsistensi data**: Pembaruan di satu berkas tidak sinkron dengan berkas lain.
3. **Kesulitan akses**: Tidak adanya bahasa query standar untuk pencarian data kompleks.
4. **Keamanan & Concurrency rendah**: Rawan korupsi data saat diakses banyak pengguna bersamaan.

---

## Konsep Model Data Relasional

Model relasional diusulkan oleh **Edgar F. Codd (1970)** di mana data direpresentasikan sebagai tabel berdimensi dua:
- **Tabel / Relasi (*Relation*)**: Kumpulan entitas sejenis.
- **Baris / Rekaman (*Tuple / Record*)**: Satu entitas data individual.
- **Kolom / Atribut (*Attribute*)**: Karakteristik atau sifat dari entitas.

### Kunci Relasional (Relational Keys)
- **Primary Key (PK)**: Atribut unik yang menjadi pembeda mutlak antar-baris (contoh: \`nim\` untuk mahasiswa, \`id\` UUID).
- **Foreign Key (FK)**: Atribut yang merujuk pada Primary Key tabel lain untuk membentuk hubungan relasi antar-tabel.

---

## Perancangan Entity-Relationship Diagram (ERD)

ERD adalah model grafis konseptual untuk menggambarkan struktur data dan keterhubungannya:

| Komponen | Bentuk Standar | Penjelasan | Contoh |
| :--- | :--- | :--- | :--- |
| **Entitas** | Persegi Panjang | Objek fisik/konsep yang dapat diidentifikasi | Mahasiswa, Mata Kuliah, Dosen |
| **Atribut** | Elips / Lingkaran | Properti dari entitas | nama, email, semester, nilai |
| **Relasi** | Belah Ketupat | Keterkaitan antar-entitas | Mengambil, Mengampu, Membimbing |

### Derajat Kardinalitas Relasi
1. **One-to-One (1:1)**: Satu dosen hanya memegang satu jabatan kepala lab.
2. **One-to-Many (1:N)**: Satu program studi memiliki banyak mahasiswa.
3. **Many-to-Many (M:N)**: Banyak mahasiswa mengambil banyak mata kuliah (memerlukan tabel penghubung / junction table).

---

## Latihan Mandiri

Rancanglah sebuah ERD sederhana untuk **Sistem Perpustakaan Kampus** yang melibatkan 3 entitas:
- \`Mahasiswa\` (NIM, Nama, Prodi)
- \`Buku\` (ISBN, Judul, Pengarang, Tahun)
- \`Peminjaman\` (ID_Pinjam, Tanggal_Pinjam, Tanggal_Kembali)`,
      },
      {
        course_id: dbCourseId,
        title: "Normalisasi Basis Data: Bentuk 1NF, 2NF, hingga 3NF",
        slug: "normalisasi-basis-data-1nf-2nf-3nf",
        sort_order: 2,
        estimated_minutes: 45,
        status: "published",
        learning_objectives: JSON.stringify([
          "Menganalisis anomali insersi, update, dan delesi",
          "Menerapkan aturan First Normal Form (1NF)",
          "Menghilangkan ketergantungan parsial (2NF) dan transitif (3NF)",
        ]),
        content: `# Normalisasi Basis Data: 1NF, 2NF, dan 3NF

## Apa itu Normalisasi?

**Normalisasi** adalah teknik sistematis untuk menguraikan tabel yang memiliki anomali ke dalam tabel-tabel yang lebih kecil dan terstruktur dengan baik tanpa kehilangan informasi (*lossless decomposition*).

### Tujuan Utama Normalisasi:
1. Meminimalkan redundansi (duplikasi) data.
2. Mencegah anomali manipulasi data:
   - **Insertion Anomaly**: Tidak bisa memasukkan data entitas tanpa data entitas lain.
   - **Update Anomaly**: Harus memperbarui data di banyak baris secara bersamaan.
   - **Deletion Anomaly**: Menghapus satu fakta menyebabkan hilangnya fakta lain yang tidak diinginkan.

---

## Tahapan Normalisasi

### 1. Bentuk Normal Pertama (1NF)
Sebuah tabel memenuhi 1NF jika:
- Setiap sel hanya bernilai **atomik** (tunggal, tidak berupa daftar/array).
- Tidak ada kelompok atribut yang berulang (*repeating groups*).

### 2. Bentuk Normal Kedua (2NF)
Sebuah tabel memenuhi 2NF jika:
- Sudah memenuhi aturan **1NF**.
- Semua atribut bukan kunci bergantung sepenuhnya pada seluruh Primary Key (**tidak ada ketergantungan parsial / partial dependency**).

> **Catatan:** Jika tabel hanya memiliki Single-Column Primary Key (bukan Composite Key), maka tabel yang sudah 1NF otomatis memenuhi 2NF.

### 3. Bentuk Normal Ketiga (3NF)
Sebuah tabel memenuhi 3NF jika:
- Sudah memenuhi aturan **2NF**.
- Tidak memiliki **ketergantungan transitif** (*transitive dependency*), yaitu atribut non-kunci tidak boleh bergantung pada atribut non-kunci lainnya.

\`\`\`
X (Primary Key) -> Y (Non-Key) -> Z (Non-Key)
Contoh Anomali:
id_mahasiswa -> kode_prodi -> nama_prodi

Solusi 3NF:
Pisahkan kode_prodi dan nama_prodi ke dalam tabel baru 'program_studi'.
\`\`\`

---

## Ringkasan Kaidah Kunci Normalisasi

> *"Setiap atribut non-kunci harus bergantung pada kunci (1NF), seluruh kunci (2NF), dan tidak ada yang lain selain kunci (3NF)."*`,
      },
      {
        course_id: dbCourseId,
        title: "Query SQL Komprehensif: DDL, DML, dan Multi-Table JOIN",
        slug: "query-sql-ddl-dml-join",
        sort_order: 3,
        estimated_minutes: 50,
        status: "published",
        learning_objectives: JSON.stringify([
          "Membuat skema tabel dengan DDL (CREATE, ALTER, DROP)",
          "Memanipulasi data dengan DML (INSERT, SELECT, UPDATE, DELETE)",
          "Menguasai teknik penggabungan data Multi-Table INNER & LEFT JOIN",
        ]),
        content: `# Query SQL Komprehensif: DDL, DML, dan Multi-Table JOIN

## Kategori Perintah SQL

SQL (Structured Query Language) dibagi menjadi beberapa sub-bahasa utama:
- **DDL (Data Definition Language)**: Mendefinisikan struktur database (\`CREATE\`, \`ALTER\`, \`DROP\`).
- **DML (Data Manipulation Language)**: Mengelola isi data (\`SELECT\`, \`INSERT\`, \`UPDATE\`, \`DELETE\`).
- **DCL & TCL**: Hak akses (\`GRANT\`, \`REVOKE\`) dan transaksi (\`COMMIT\`, \`ROLLBACK\`).

---

## Contoh DDL Pembuatan Tabel Relasional

\`\`\`sql
-- Membuat tabel mahasiswa
CREATE TABLE mahasiswa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nim VARCHAR(15) UNIQUE NOT NULL,
    nama_lengkap VARCHAR(100) NOT NULL,
    prodi VARCHAR(50) DEFAULT 'Pendidikan Informatika',
    angkatan INT CHECK (angkatan >= 2020),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Membuat tabel nilai dengan Foreign Key
CREATE TABLE nilai_mata_kuliah (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mahasiswa_id UUID REFERENCES mahasiswa(id) ON DELETE CASCADE,
    mata_kuliah VARCHAR(100) NOT NULL,
    skor_angka NUMERIC(5, 2) CHECK (skor_angka BETWEEN 0 AND 100),
    grade VARCHAR(2) NOT NULL
);
\`\`\`

---

## Operasi DML Dasar

\`\`\`sql
-- 1. Insert Data
INSERT INTO mahasiswa (nim, nama_lengkap, angkatan)
VALUES ('220101001', 'Muhammad Verdi', 2023);

-- 2. Update Data
UPDATE mahasiswa
SET prodi = 'Pendidikan Informatika Unggulan'
WHERE nim = '220101001';

-- 3. Select dengan Kondisi & Pengurutan
SELECT nim, nama_lengkap, angkatan
FROM mahasiswa
WHERE angkatan = 2023
ORDER BY nama_lengkap ASC;
\`\`\`

---

## Menggabungkan Data dengan SQL JOIN

JOIN digunakan untuk menghubungkan baris dari dua atau lebih tabel berdasarkan kolom terkait:

\`\`\`sql
-- INNER JOIN: Hanya mengambil baris yang memiliki kecocokan di kedua tabel
SELECT 
    m.nim,
    m.nama_lengkap,
    n.mata_kuliah,
    n.skor_angka,
    n.grade
FROM mahasiswa m
INNER JOIN nilai_mata_kuliah n ON m.id = n.mahasiswa_id
ORDER BY n.skor_angka DESC;

-- LEFT JOIN: Mengambil semua mahasiswa, termasuk yang belum memiliki nilai
SELECT 
    m.nim,
    m.nama_lengkap,
    COALESCE(AVG(n.skor_angka), 0) AS ipk_estimasi
FROM mahasiswa m
LEFT JOIN nilai_mata_kuliah n ON m.id = n.mahasiswa_id
GROUP BY m.id, m.nim, m.nama_lengkap;
\`\`\`

---

## Latihan Soal

Tuliskan sebuah query SQL untuk menampilkan daftar 5 mahasiswa dengan rata-rata nilai kuis tertinggi pada semester berjalan!`,
      },
    ];

    const { data: dbRes, error: dbErr } = await supabase
      .from("lessons")
      .upsert(dbLessons, { onConflict: "course_id,slug" })
      .select();

    if (dbErr) console.error("Error inserting DB lessons:", dbErr.message);
    else console.log(`✅ ${dbRes.length} lessons inserted for Basis Data dan SQL.`);
  }

  // 2. Kursus: Pengantar Rekayasa Perangkat Lunak
  const rplCourseId = courseMap["pengantar-rekayasa-perangkat-lunak"];
  if (rplCourseId) {
    console.log("📂 Inserting lessons for Rekayasa Perangkat Lunak...");
    const rplLessons = [
      {
        course_id: rplCourseId,
        title: "Siklus Hidup Pengembangan Perangkat Lunak (SDLC) & Agile Scrum",
        slug: "sdlc-dan-agile-scrum",
        sort_order: 1,
        estimated_minutes: 35,
        status: "published",
        learning_objectives: JSON.stringify([
          "Mengenal tahapan inti SDLC: Requirement, Design, Implementation, Testing, Maintenance",
          "Membandingkan model Waterfall vs Agile Scrum",
          "Memahami artefak dan seremoni dalam Agile Sprint",
        ]),
        content: `# Siklus Hidup Pengembangan Perangkat Lunak (SDLC) & Agile Scrum

## Apa itu Rekayasa Perangkat Lunak (RPL)?

**Rekayasa Perangkat Lunak (Software Engineering)** adalah penerapan pendekatan sistematis, terdisiplin, dan terukur dalam pengembangan, pengoperasian, dan pemeliharaan perangkat lunak.

Tujuan utama RPL adalah menghasilkan perangkat lunak yang:
- **Tepat fungsi (*Functionally Correct*)**
- **Dapat diandalkan (*Reliable*)**
- **Efisien dalam pemanfaatan sumber daya (*Efficient*)**
- **Mudah dirawat dan dikembangkan (*Maintainable*)**

---

## Tahapan Inti SDLC (Software Development Life Cycle)

1. **Analisis Kebutuhan (*Requirements Analysis*)**: Menggali dan mendokumentasikan spesifikasi kebutuhan fungsional & non-fungsional.
2. **Perancangan Arsitektur (*Design*)**: Menyusun arsitektur sistem, UI wireframe, dan skema basis data.
3. **Implementasi / Pengkodean (*Coding*)**: Menerjemahkan rancangan teknis ke dalam bahasa pemrograman yang dipilih.
4. **Pengujian (*Testing & QA*)**: Memastikan perangkat lunak bebas bug dan memenuhi seluruh kriteria penerimaan.
5. **Penerapan & Pemeliharaan (*Deployment & Maintenance*)**: Merilis produk ke server produksi dan melakukan pemantauan berkala.

---

## Waterfall vs Agile Scrum

| Aspek | Waterfall (Tradisional) | Agile Scrum (Modern) |
| :--- | :--- | :--- |
| **Alur Kerja** | Linear & berurutan (fase berikutnya baru jalan setelah fase sebelumnya tuntas) | Iteratif & inkremental dalam siklus pendek (*Sprint*) |
| **Fleksibilitas Perubahan** | Kaku dan sulit beradaptasi di tengah jalan | Sangat adaptif terhadap perubahan kebutuhan pengguna |
| **Keterlibatan Klien** | Terbatas di awal dan di akhir | Terus-menerus terlibat di setiap Sprint Review |
| **Waktu Rilis** | Rilis produk penuh di akhir siklus proyek | Rilis prototipe/fitur kerja di setiap 1-4 minggu |

---

## Seremoni & Peran dalam Scrum

- **Peran**: *Product Owner* (pemegang visi produk), *Scrum Master* (fasilitator proses), *Development Team* (tim pengembang).
- **Seremoni Utama**:
  1. **Sprint Planning**: Merencanakan backlog prioritas untuk 1-2 minggu ke depan.
  2. **Daily Standup**: Sinkronisasi harian 15 menit mengenai apa yang telah, akan, dan hambatan kerja.
  3. **Sprint Review & Demo**: Memperagakan fitur selesai kepada stakeholder.
  4. **Sprint Retrospective**: Evaluasi internal proses tim untuk continuous improvement.`,
      },
      {
        course_id: rplCourseId,
        title: "Pemodelan Berorientasi Objek dengan UML: Use Case & Class Diagram",
        slug: "pemodelan-uml-use-case-class-diagram",
        sort_order: 2,
        estimated_minutes: 40,
        status: "published",
        learning_objectives: JSON.stringify([
          "Mengenal Unified Modeling Language (UML) sebagai bahasa cetak biru sistem",
          "Merancang Use Case Diagram dan skenario fungsional",
          "Merancang Class Diagram beserta visibilitas dan relasi antar-kelas",
        ]),
        content: `# Pemodelan Berorientasi Objek dengan UML

## Mengapa Perlu Diagram UML?

Dalam proyek skala besar, pengembang tidak bisa langsung menulis kode tanpa rancangan arsitektur. **Unified Modeling Language (UML)** adalah bahasa visual standar industri untuk menentukan, memvisualisasikan, membangun, dan mendokumentasikan artefak sistem perangkat lunak.

---

## 1. Use Case Diagram

Use Case Diagram menggambarkan **fungsionalitas sistem dari sudut pandang pengguna eksternal (Aktor)**:

### Komponen Utama:
- **Aktor (*Actor*)**: Entitas luar yang berinteraksi dengan sistem (misal: *Mahasiswa*, *Dosen*, *Sistem Payment Gateway*).
- **Use Case**: Fungsi sistem berbentuk elips (misal: *Login*, *Mengerjakan Kuis*, *Melihat Nilai*).
- **Relasi Khusus**:
  - \`<<include>>\`: Use case A mutlak memerlukan eksekusi Use case B (contoh: *Kerjakan Kuis* mencakup *Autentikasi Akun*).
  - \`<<extend>>\`: Use case B dijalankan kondisional atas Use case A (contoh: *Kirim Notifikasi Remedial* saat *Nilai Kuis < Passing Score*).

---

## 2. Class Diagram

Class Diagram adalah diagram struktural statis yang menunjukkan kelas-kelas sistem, atribut, metode, dan relasi antar-objek:

\`\`\`text
+------------------------------------+
|               Course               |
+------------------------------------+
| - id: UUID                         |
| - title: String                    |
| - difficulty: CourseDifficulty     |
| - estimated_duration: Int          |
+------------------------------------+
| + publish(): Boolean               |
| + getProgress(userId: UUID): Float |
+------------------------------------+
\`\`\`

### Penanda Visibilitas:
- \`+\` : **Public** (dapat diakses dari luar kelas)
- \`-\` : **Private** (hanya dapat diakses oleh kelas itu sendiri)
- \`#\` : **Protected** (dapat diakses oleh kelas dan kelas turunannya)

---

## Relasi Antar-Kelas
1. **Asosiasi (*Association*)**: Hubungan umum dua kelas (garis lurus).
2. **Agregasi (*Aggregation*)**: Hubungan "memiliki" longgar di mana objek anak tetap hidup meski objek induk dihapus (simbol belah ketupat putih \`◇\`).
3. **Komposisi (*Composition*)**: Hubungan erat kepemilikan mutlak di mana objek anak musnah jika induk dihapus (simbol belah ketupat hitam \`◆\`). Contoh: Kursus memiliki Pelajaran.
4. **Generalisasi / Inheritance**: Hubungan turunan *is-a* (simbol panah segitiga).`,
      },
      {
        course_id: rplCourseId,
        title: "Prinsip Kualitas Perangkat Lunak, Pengujian (QA), dan Clean Code",
        slug: "kualitas-qa-dan-clean-code",
        sort_order: 3,
        estimated_minutes: 45,
        status: "published",
        learning_objectives: JSON.stringify([
          "Menerapkan piramida pengujian perangkat lunak (Unit, Integration, E2E)",
          "Menulis kode bersih mengikuti prinsip SOLID dan DRY",
          "Mencegah regresi perangkat lunak dengan automated testing",
        ]),
        content: `# Kualitas Perangkat Lunak, QA, dan Clean Code

## Piramida Pengujian Perangkat Lunak

Untuk menjamin reliabilitas aplikasi, pengujian dilakukan berlapis sesuai **Test Pyramid**:

1. **Unit Testing (Dasar Piramida)**:
   - Menguji unit terkecil kode (fungsi/metode terisolasi).
   - Eksekusi sangat cepat, biaya komputasi rendah.
2. **Integration Testing (Tengah)**:
   - Menguji interaksi antar-modul (misal: API endpoint berkomunikasi dengan database).
3. **End-to-End (E2E) Testing (Puncak Piramida)**:
   - Menguji alur pengguna nyata dari antarmuka browser hingga backend (misal: pendaftaran akun hingga pengerjaan kuis).

---

## Prinsip Clean Code yang Wajib Diterapkan

- **DRY (Don't Repeat Yourself)**: Hindari duplikasi logika kode yang identik di banyak tempat.
- **KISS (Keep It Simple, Stupid)**: Solusi paling sederhana yang berfungsi adalah yang terbaik.
- **YAGNI (You Aren't Gonna Need It)**: Jangan menulis fitur tambahan sebelum ada kebutuhan nyata.
- **Meaningful Names**: Gunakan nama variabel dan fungsi yang self-explanatory.
  \`\`\`typescript
  // ❌ Buruk
  const d = 86400;
  function prc(x: number) { ... }

  // ✅ Bersih
  const SECONDS_IN_A_DAY = 86400;
  function calculatePassingScorePercentage(score: number): number { ... }
  \`\`\`

---

## Ringkasan Prinsip SOLID

- **S (Single Responsibility Principle)**: Satu kelas/modul hanya memiliki satu alasan untuk berubah.
- **O (Open/Closed Principle)**: Terbuka untuk ekstensi, tertutup untuk modifikasi langsung.
- **L (Liskov Substitution Principle)**: Subtipe harus bisa menggantikan tipe induk tanpa merusak perilaku sistem.
- **I (Interface Segregation Principle)**: Klien tidak boleh dipaksa bergantung pada antarmuka yang tidak mereka gunakan.
- **D (Dependency Inversion Principle)**: Bergantunglah pada abstraksi, bukan konkrit implementasi.`,
      },
    ];

    const { data: rplRes, error: rplErr } = await supabase
      .from("lessons")
      .upsert(rplLessons, { onConflict: "course_id,slug" })
      .select();

    if (rplErr) console.error("Error inserting RPL lessons:", rplErr.message);
    else console.log(`✅ ${rplRes.length} lessons inserted for Rekayasa Perangkat Lunak.`);
  }

  // 3. Kursus: Teknologi Pendidikan & Media Pembelajaran Digital
  const tekpenCourseId = courseMap["teknologi-pendidikan-media-digital"];
  if (tekpenCourseId) {
    console.log("📂 Inserting lessons for Teknologi Pendidikan...");
    const tekpenLessons = [
      {
        course_id: tekpenCourseId,
        title: "Kerangka Kerja TPACK dalam Pembelajaran Informatika Modern",
        slug: "kerangka-kerja-tpack-informatika",
        sort_order: 1,
        estimated_minutes: 30,
        status: "published",
        learning_objectives: JSON.stringify([
          "Memahami komponen Technological, Pedagogical, and Content Knowledge (TPACK)",
          "Mengintegrasikan alat bantu komputasi dalam strategi mengajar",
          "Menganalisis studi kasus penerapan TPACK di kelas pemrograman",
        ]),
        content: `# Kerangka Kerja TPACK dalam Pembelajaran Informatika

## Apa itu TPACK?

**TPACK (Technological Pedagogical Content Knowledge)** yang dikembangkan oleh Mishra & Koehler (2006) adalah kerangka kerja komprehensif yang menjelaskan interaksi antara tiga bentuk pengetahuan utama seorang pendidik modern:

1. **Content Knowledge (CK)**: Pengetahuan tentang materi subjek yang diajarkan (misal: sintaks pemrograman, struktur data, algoritma).
2. **Pedagogical Knowledge (PK)**: Pengetahuan tentang teori belajar, metode instruksional, dan manajemen kelas.
3. **Technological Knowledge (TK)**: Pengetahuan tentang perangkat keras, perangkat lunak, dan platform digital.

---

## Irisan Sinergis TPACK

- **PCK (Pedagogical Content Knowledge)**: Cara menyampaikan konsep materi yang sulit agar mudah dipahami siswa (misal: menggunakan analogi antrean tiket untuk menjelaskan struktur data *Queue*).
- **TCK (Technological Content Knowledge)**: Bagaimana teknologi merepresentasikan konsep materi (misal: menggunakan visualizer memori untuk menunjukkan cara kerja pointer).
- **TPK (Technological Pedagogical Knowledge)**: Bagaimana teknologi mengubah pengalaman belajar mengajar (misal: sistem penilaian kuis otomatis untuk memberikan umpan balik langsung).
- **TPACK**: Titik temu harmonis di mana pendidik informatika memilih alat digital yang tepat, dengan pedagogi yang teruji, untuk materi komputasi tertentu.

---

## Studi Kasus Pendidikan Informatika

Guru ingin mengajarkan konsep **Algoritma Sorting (Bubble Sort vs Quick Sort)**:
- **Pendekatan Tradisional (CK saja)**: Menulis rumus matematika dan pseudocode di papan tulis.
- **Pendekatan Berbasis TPACK**:
  - Menggunakan simulasi web interaktif (TK).
  - Siswa mencoba mengurutkan kartu fisik terlebih dahulu, lalu membandingkan efisiensi algoritma di lab (PK).
  - Mengukur kompleksitas waktu Big-O secara empiris dan analitis (CK).`,
      },
      {
        course_id: tekpenCourseId,
        title: "Model Desain Instruksional ADDIE & Prinsip Multimedia Learning Mayer",
        slug: "desain-instruksional-addie-dan-mayer",
        sort_order: 2,
        estimated_minutes: 40,
        status: "published",
        learning_objectives: JSON.stringify([
          "Menerapkan lima tahapan model ADDIE (Analysis, Design, Development, Implementation, Evaluation)",
          "Memahami prinsip Cognitive Load Theory dalam pembelajaran digital",
          "Menerapkan prinsip Multimedia Learning karya Richard E. Mayer",
        ]),
        content: `# Model ADDIE & Prinsip Multimedia Learning Mayer

## Model Desain Instruksional ADDIE

Model **ADDIE** adalah kerangka kerja standar dalam merancang modul ajar dan program pelatihan digital:

1. **Analysis (Analisis)**:
   - Siapa target pembelajar (karakteristik awal, tingkat literasi digital)?
   - Apa kesenjangan kompetensi yang ingin dipecahkan?
2. **Design (Desain)**:
   - Menentukan Capaian Pembelajaran Lulusan (CPL) dan indikator terukur.
   - Merancang silabus, storyboard media, dan instrumen asesmen.
3. **Development (Pengembangan)**:
   - Memproduksi modul materi, video animasi, lab simulasi, dan bank soal kuis.
4. **Implementation (Implementasi)**:
   - Menyampaikan materi melalui Learning Management System (seperti SkillForge).
5. **Evaluation (Evaluasi)**:
   - Evaluasi formatif (kuis berkala) dan sumatif (analisis capaian hasil belajar).

---

## 5 Prinsip Kunci Multimedia Learning (Richard E. Mayer)

1. **Prinsip Multimedia**: Siswa belajar lebih baik dari kata-kata yang disertai gambar daripada kata-kata saja.
2. **Prinsip Kedekatan Spasial (*Spatial Contiguity*)**: Teks penjelasan harus diletakkan dekat dengan gambar atau kode yang dijelaskan.
3. **Prinsip Redundansi**: Hindari menampilkan teks penuh di layar bersamaan dengan narasi audio yang identik kata per kata (mengurangi beban memori kerja).
4. **Prinsip Koherensi (*Coherence*)**: Buang elemen dekoratif, musik latar berlebihan, atau animasi yang tidak berhubungan langsung dengan tujuan belajar.
5. **Prinsip Segmentasi (*Segmenting*)**: Materi lebih efektif jika dipecah menjadi modul-modul kecil bertahap (*micro-learning*).`,
      },
      {
        course_id: tekpenCourseId,
        title: "Perancangan Media Interaktif dan Asesmen Digital Terpadu",
        slug: "media-interaktif-dan-asesmen-digital",
        sort_order: 3,
        estimated_minutes: 45,
        status: "published",
        learning_objectives: JSON.stringify([
          "Merancang antarmuka media belajar yang memenuhi standar heuristik kegunaan (Usability)",
          "Menyusun instrumen evaluasi digital berbasis Higher Order Thinking Skills (HOTS)",
          "Memanfaatkan analitik belajar untuk pemantauan retensi siswa",
        ]),
        content: `# Media Interaktif dan Asesmen Digital Terpadu

## Kriteria Usability Media Pembelajaran Digital

Media pembelajaran yang baik bukan sekadar visual menarik, melainkan harus mendukung proses kognitif pembelajar:
- **Kemudahan Navigasi (*Learnability & Ease of Use*)**: Mahasiswa dapat langsung mengetahui langkah belajar selanjutnya tanpa kebingungan.
- **Konsistensi Desain**: Desain tombol, hierarki judul, dan warna umpan balik harus konsisten di seluruh modul.
- **Umpan Balik Cepat (*Immediate Feedback*)**: Pembelajar segera diberi tahu apakah respon latihan mereka benar atau salah beserta alasan pembahasannya.

---

## Taksonomi Bloom dalam Asesmen Digital

Penyusunan butir evaluasi kuis di platform SkillForge harus mencakup jenjang kognitif yang seimbang:
1. **C1 (Mengingat)**: Menyebutkan definisi atau sintaks dasar.
2. **C2 (Memahami)**: Menjelaskan alur kerja algoritma dengan kata-kata sendiri.
3. **C3 (Menerapkan)**: Menuliskan potongan kode untuk memecahkan kasus baru.
4. **C4 (Menganalisis)**: Menemukan bug logika pada kode program dan menganalisis kompleksitas waktu.

---

## Analitik Belajar (*Learning Analytics*)

Platform pembelajaran digital modern memanfaatkan jejak data aktivitas mahasiswa untuk:
- Mendeteksi materi pelajaran yang paling sering mengalami kegagalan kuis.
- Menghitung rata-rata waktu yang dibutuhkan untuk menyelesaikan satu unit modul.
- Mengirimkan rekomendasi materi pengayaan (*remedial/enrichment*) secara otomatis.`,
      },
    ];

    const { data: tekpenRes, error: tekpenErr } = await supabase
      .from("lessons")
      .upsert(tekpenLessons, { onConflict: "course_id,slug" })
      .select();

    if (tekpenErr) console.error("Error inserting Tekpen lessons:", tekpenErr.message);
    else console.log(`✅ ${tekpenRes.length} lessons inserted for Teknologi Pendidikan.`);
  }

  console.log("\n🎉 All 5 courses now have complete lessons and syllabi!");
}

main().catch(console.error);
