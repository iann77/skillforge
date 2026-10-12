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
  console.log("🚀 Seeding interactive quizzes for SkillForge courses...\n");

  const { data: courses, error: cErr } = await supabase.from("courses").select("id, slug, title");
  if (cErr || !courses) {
    console.error("Error fetching courses:", cErr?.message);
    return;
  }

  const courseMap: Record<string, string> = {};
  courses.forEach((c) => {
    courseMap[c.slug] = c.id;
  });

  // 1. Kuis Web Development
  const webCourseId = courseMap["dasar-html-css-javascript"];
  if (webCourseId) {
    console.log("📝 Inserting Quiz: Dasar HTML, CSS, dan JavaScript Modern...");
    // Cek apakah kuis sudah ada
    let { data: existingQuiz } = await supabase
      .from("quizzes")
      .select("id")
      .eq("course_id", webCourseId)
      .maybeSingle();

    let quizId = existingQuiz?.id;

    if (!quizId) {
      const { data: newQuiz, error: qErr } = await supabase
        .from("quizzes")
        .insert({
          course_id: webCourseId,
          title: "Uji Kompetensi: Dasar Web Engineering",
          description: "Kuis evaluasi pemahaman semantik HTML5, modern layouting CSS Grid/Flexbox, dan JavaScript ES6+.",
          passing_score: 70,
        })
        .select()
        .single();

      if (qErr) {
        console.error("Error creating quiz:", qErr.message);
        return;
      }
      quizId = newQuiz.id;
    }

    // Soal-soal kuis
    const questions = [
      {
        question_text: "Elemen semantik HTML5 manakah yang paling tepat digunakan untuk membungkus konten mandiri seperti artikel blog atau berita?",
        explanation: "Elemen <article> dirancang khusus untuk memuat konten mandiri dan independen yang dapat didistribusikan ulang, seperti posting blog atau artikel berita.",
        sort_order: 1,
        options: [
          { text: "<section>", is_correct: false },
          { text: "<article>", is_correct: true },
          { text: "<div>", is_correct: false },
          { text: "<aside>", is_correct: false },
        ],
      },
      {
        question_text: "Model layout CSS manakah yang dirancang khusus untuk mengatur elemen dalam satu dimensi (hanya baris atau kolom)?",
        explanation: "CSS Flexbox adalah sistem tata letak satu dimensi (1D), sedangkan CSS Grid adalah sistem tata letak dua dimensi (2D).",
        sort_order: 2,
        options: [
          { text: "CSS Grid", is_correct: false },
          { text: "CSS Flexbox", is_correct: true },
          { text: "Float & Clearfix", is_correct: false },
          { text: "Position Absolute", is_correct: false },
        ],
      },
      {
        question_text: "Dalam JavaScript ES6, apakah perbedaan utama antara kata kunci 'const' dan 'let'?",
        explanation: "'const' digunakan untuk deklarasi variabel yang referensinya tidak dapat di-reassign (tetap), sedangkan 'let' nilainya dapat diubah kembali (mutable reassignment). Keduanya memiliki block scope.",
        sort_order: 3,
        options: [
          { text: "'const' memiliki global scope, sedangkan 'let' memiliki function scope", is_correct: false },
          { text: "'const' tidak dapat di-reassign nilainya, sedangkan 'let' nilainya dapat diubah", is_correct: true },
          { text: "'const' hanya untuk tipe data angka, 'let' untuk string", is_correct: false },
          { text: "'const' mengalami variable hoisting penuh, sedangkan 'let' tidak", is_correct: false },
        ],
      },
      {
        question_text: "Metode JavaScript modern apa yang digunakan untuk menambahkan event handler pada elemen DOM tanpa menimpa handler sebelumnya?",
        explanation: "addEventListener() memungkinkan pendaftaran beberapa listener pada satu elemen secara modular tanpa saling menimpa, berbeda dengan atribut onclick.",
        sort_order: 4,
        options: [
          { text: "element.attachHandler()", is_correct: false },
          { text: "element.onclick = function", is_correct: false },
          { text: "element.addEventListener()", is_correct: true },
          { text: "element.listenEvent()", is_correct: false },
        ],
      },
      {
        question_text: "Apa kepanjangan dari DOM dalam konteks pengembangan web interaktif?",
        explanation: "DOM adalah Document Object Model, yaitu representasi terstruktur berupa pohon objek dari dokumen HTML yang dapat dimanipulasi oleh bahasa pemrograman seperti JavaScript.",
        sort_order: 5,
        options: [
          { text: "Data Object Management", is_correct: false },
          { text: "Document Oriented Module", is_correct: false },
          { text: "Document Object Model", is_correct: true },
          { text: "Digital Ordinance Matrix", is_correct: false },
        ],
      },
    ];

    for (const q of questions) {
      // Hapus soal lama jika ada agar bersih
      const { data: qData, error: qErr } = await supabase
        .from("quiz_questions")
        .insert({
          quiz_id: quizId,
          question_text: q.question_text,
          explanation: q.explanation,
          sort_order: q.sort_order,
        })
        .select()
        .single();

      if (qErr) {
        console.error("Question insert error:", qErr.message);
        continue;
      }

      const optionsToInsert = q.options.map((opt, idx) => ({
        question_id: qData.id,
        option_text: opt.text,
        is_correct: opt.is_correct,
        sort_order: idx + 1,
      }));

      await supabase.from("quiz_options").insert(optionsToInsert);
    }
    console.log("✅ Quiz Web Development seeded with 5 questions.");
  }

  // 2. Kuis Algoritma dan Pemrograman Dasar
  const algoCourseId = courseMap["algoritma-dan-pemrograman-dasar"];
  if (algoCourseId) {
    console.log("📝 Inserting Quiz: Algoritma dan Pemrograman Dasar...");
    let { data: existingQuiz } = await supabase
      .from("quizzes")
      .select("id")
      .eq("course_id", algoCourseId)
      .maybeSingle();

    let quizId = existingQuiz?.id;

    if (!quizId) {
      const { data: newQuiz, error: qErr } = await supabase
        .from("quizzes")
        .insert({
          course_id: algoCourseId,
          title: "Uji Kompetensi: Algoritma & Logika Komputasi",
          description: "Evaluasi penguasaan Computational Thinking, struktur kontrol percabangan/perulangan, dan analisis algoritma.",
          passing_score: 70,
        })
        .select()
        .single();

      if (qErr) {
        console.error("Error creating algo quiz:", qErr.message);
        return;
      }
      quizId = newQuiz.id;
    }

    const algoQuestions = [
      {
        question_text: "Manakah ciri algoritma yang menyatakan bahwa algoritma harus berhenti setelah mengerjakan sejumlah langkah terbatas?",
        explanation: "Finiteness (keberhinggaan) adalah prinsip bahwa algoritma harus memiliki akhir dan tidak boleh mengalami loop tak terhingga (infinite loop).",
        sort_order: 1,
        options: [
          { text: "Definiteness", is_correct: false },
          { text: "Finiteness", is_correct: true },
          { text: "Effectiveness", is_correct: false },
          { text: "Generality", is_correct: false },
        ],
      },
      {
        question_text: "Pilar Computational Thinking manakah yang berfokus pada memecah masalah besar yang kompleks menjadi sub-masalah yang lebih kecil dan mudah dikelola?",
        explanation: "Decomposition (dekomposisi) adalah proses memecah masalah kompleks menjadi bagian-bagian yang lebih kecil dan terpisah.",
        sort_order: 2,
        options: [
          { text: "Pattern Recognition", is_correct: false },
          { text: "Abstraction", is_correct: false },
          { text: "Decomposition", is_correct: true },
          { text: "Algorithm Design", is_correct: false },
        ],
      },
      {
        question_text: "Dalam struktur kontrol, perulangan yang memeriksa kondisi di awal dan hanya berjalan jika kondisi bernilai TRUE adalah:",
        explanation: "While loop memeriksa kondisi di awal (pre-test loop). Jika kondisi bernilai false sejak awal, badan loop tidak akan pernah dieksekusi sama sekali.",
        sort_order: 3,
        options: [
          { text: "Do-While Loop", is_correct: false },
          { text: "While Loop", is_correct: true },
          { text: "Switch-Case", is_correct: false },
          { text: "Nested If", is_correct: false },
        ],
      },
      {
        question_text: "Berapa kali perulangan berikut akan mencetak teks? for (int i = 0; i < 5; i++) { ... }",
        explanation: "Variabel i berjalan dari nilai 0, 1, 2, 3, 4 (tepat 5 kali eksekusi). Pada saat i = 5, kondisi i < 5 menjadi false.",
        sort_order: 4,
        options: [
          { text: "4 kali", is_correct: false },
          { text: "5 kali", is_correct: true },
          { text: "6 kali", is_correct: false },
          { text: "Tak terhingga", is_correct: false },
        ],
      },
      {
        question_text: "Manakah syarat utama agar algoritma Binary Search (Pencarian Biner) dapat diterapkan pada sekumpulan data array?",
        explanation: "Binary Search mengharuskan elemen array sudah terurut (sorted) secara ascending atau descending agar dapat membagi ruang pencarian menjadi separuh di setiap langkah.",
        sort_order: 5,
        options: [
          { text: "Data harus berupa bilangan bulat positif", is_correct: false },
          { text: "Elemen data harus sudah dalam keadaan terurut (sorted)", is_correct: true },
          { text: "Array harus berukuran bilangan genap", is_correct: false },
          { text: "Tidak boleh ada nilai nol di dalam array", is_correct: false },
        ],
      },
    ];

    for (const q of algoQuestions) {
      const { data: qData, error: qErr } = await supabase
        .from("quiz_questions")
        .insert({
          quiz_id: quizId,
          question_text: q.question_text,
          explanation: q.explanation,
          sort_order: q.sort_order,
        })
        .select()
        .single();

      if (qErr) continue;

      const optionsToInsert = q.options.map((opt, idx) => ({
        question_id: qData.id,
        option_text: opt.text,
        is_correct: opt.is_correct,
        sort_order: idx + 1,
      }));

      await supabase.from("quiz_options").insert(optionsToInsert);
    }
    console.log("✅ Quiz Algoritma seeded with 5 questions.");
  }

  // 3. Kuis Basis Data dan SQL
  const dbCourseId = courseMap["dasar-basis-data-dan-sql"];
  if (dbCourseId) {
    console.log("📝 Inserting Quiz: Basis Data dan Relasional SQL...");
    let { data: existingQuiz } = await supabase
      .from("quizzes")
      .select("id")
      .eq("course_id", dbCourseId)
      .maybeSingle();

    let quizId = existingQuiz?.id;

    if (!quizId) {
      const { data: newQuiz, error: qErr } = await supabase
        .from("quizzes")
        .insert({
          course_id: dbCourseId,
          title: "Uji Kompetensi: Desain Basis Data & Query SQL",
          description: "Evaluasi pemahaman konsep ERD, aturan normalisasi 1NF-3NF, dan sintaks SQL relasional.",
          passing_score: 70,
        })
        .select()
        .single();

      if (qErr) {
        console.error("Error creating DB quiz:", qErr.message);
        return;
      }
      quizId = newQuiz.id;
    }

    const dbQuestions = [
      {
        question_text: "Atribut dalam tabel relasional yang secara unik dan mutlak membedakan setiap baris data disebut:",
        explanation: "Primary Key (Kunci Utama) adalah atribut atau kombinasi atribut unik yang tidak boleh bernilai NULL dan membedakan setiap baris/rekaman.",
        sort_order: 1,
        options: [
          { text: "Foreign Key", is_correct: false },
          { text: "Candidate Key", is_correct: false },
          { text: "Primary Key", is_correct: true },
          { text: "Composite Attribute", is_correct: false },
        ],
      },
      {
        question_text: "Aturan utama sebuah tabel agar memenuhi Bentuk Normal Pertama (1NF) adalah:",
        explanation: "1NF mewajibkan setiap sel atribut hanya bernilai atomik (tunggal) dan tidak mengandung kumpulan array/daftar nilai berulang.",
        sort_order: 2,
        options: [
          { text: "Semua tabel harus memiliki Foreign Key", is_correct: false },
          { text: "Setiap nilai kolom harus bernilai atomik (tidak ada repeating groups)", is_correct: true },
          { text: "Tidak boleh ada relasi Many-to-Many", is_correct: false },
          { text: "Semua data numerik harus memiliki indeks B-Tree", is_correct: false },
        ],
      },
      {
        question_text: "Manakah perintah SQL yang tergolong dalam kelompok DDL (Data Definition Language)?",
        explanation: "CREATE, ALTER, dan DROP adalah perintah DDL karena memanipulasi struktur/skema basis data, bukan memanipulasi baris data (DML).",
        sort_order: 3,
        options: [
          { text: "INSERT INTO", is_correct: false },
          { text: "UPDATE", is_correct: false },
          { text: "CREATE TABLE", is_correct: true },
          { text: "DELETE FROM", is_correct: false },
        ],
      },
      {
        question_text: "Tipe JOIN manakah yang hanya mengembalikan baris yang memiliki kecocokan di kedua tabel yang digabungkan?",
        explanation: "INNER JOIN hanya menghasilkan baris data jika kondisi relasi terpenuhi di kedua tabel yang dihubungkan.",
        sort_order: 4,
        options: [
          { text: "FULL OUTER JOIN", is_correct: false },
          { text: "LEFT JOIN", is_correct: false },
          { text: "INNER JOIN", is_correct: true },
          { text: "CROSS JOIN", is_correct: false },
        ],
      },
      {
        question_text: "Fungsi agregat SQL apa yang digunakan untuk menghitung nilai rata-rata dari sebuah kolom numerik?",
        explanation: "AVG() adalah fungsi agregat bawaan SQL untuk menghitung nilai rata-rata aritmatika dari sekumpulan nilai numerik.",
        sort_order: 5,
        options: [
          { text: "MEAN()", is_correct: false },
          { text: "COUNT()", is_correct: false },
          { text: "AVG()", is_correct: true },
          { text: "SUM()", is_correct: false },
        ],
      },
    ];

    for (const q of dbQuestions) {
      const { data: qData, error: qErr } = await supabase
        .from("quiz_questions")
        .insert({
          quiz_id: quizId,
          question_text: q.question_text,
          explanation: q.explanation,
          sort_order: q.sort_order,
        })
        .select()
        .single();

      if (qErr) continue;

      const optionsToInsert = q.options.map((opt, idx) => ({
        question_id: qData.id,
        option_text: opt.text,
        is_correct: opt.is_correct,
        sort_order: idx + 1,
      }));

      await supabase.from("quiz_options").insert(optionsToInsert);
    }
    console.log("✅ Quiz Basis Data seeded with 5 questions.");
  }

  console.log("\n🎉 Quiz seeding successfully finished!");
}

main().catch(console.error);
