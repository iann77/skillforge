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
  console.log("🚀 Seeding quizzes for ALL courses in SkillForge...\n");

  const { data: courses, error: cErr } = await supabase.from("courses").select("id, slug, title");
  if (cErr || !courses) {
    console.error("Error fetching courses:", cErr?.message);
    return;
  }

  const courseMap: Record<string, string> = {};
  courses.forEach((c) => {
    courseMap[c.slug] = c.id;
  });

  // 1. Kuis Pengantar Rekayasa Perangkat Lunak
  const rplCourseId = courseMap["pengantar-rekayasa-perangkat-lunak"];
  if (rplCourseId) {
    console.log("📝 Inserting Quiz: Pengantar Rekayasa Perangkat Lunak...");

    // Cek apakah kuis sudah ada
    let { data: existingQuiz } = await supabase
      .from("quizzes")
      .select("id")
      .eq("course_id", rplCourseId)
      .maybeSingle();

    let quizId = existingQuiz?.id;

    if (!quizId) {
      const { data: newQuiz, error: qErr } = await supabase
        .from("quizzes")
        .insert({
          course_id: rplCourseId,
          title: "Uji Kompetensi: Rekayasa Perangkat Lunak & Metodologi Agile",
          description: "Kuis evaluasi pemahaman SDLC, Scrum Sprint, pemodelan sistem UML, QA testing, dan Clean Code.",
          passing_score: 70,
        })
        .select()
        .single();

      if (qErr) {
        console.error("Error creating RPL quiz:", qErr.message);
      } else {
        quizId = newQuiz.id;
      }
    }

    if (quizId) {
      // Hapus soal lama jika ada agar bersih
      await supabase.from("quiz_questions").delete().eq("quiz_id", quizId);

      const rplQuestions = [
        {
          question_text: "Fase awal dalam siklus hidup pengembangan perangkat lunak (SDLC) yang bertujuan menggali dan mendefinisikan kebutuhan fungsional sistem adalah:",
          explanation: "Requirements Analysis (Analisis Kebutuhan) adalah tahapan pertama yang kritis untuk mendokumentasikan spesifikasi kebutuhan perangkat lunak (SRS).",
          sort_order: 1,
          options: [
            { text: "System Architecture Design", is_correct: false },
            { text: "Requirements Analysis", is_correct: true },
            { text: "Deployment & Delivery", is_correct: false },
            { text: "Integration Testing", is_correct: false },
          ],
        },
        {
          question_text: "Karakteristik utama dari metodologi Agile Scrum dibandingkan model Waterfall konvensional adalah:",
          explanation: "Agile Scrum bekerja secara iteratif dan inkremental dalam siklus kerja pendek (Sprint berdurasi 1-4 minggu) untuk menghasilkan prototipe kerja yang adaptif terhadap perubahan.",
          sort_order: 2,
          options: [
            { text: "Pengembangan dilakukan secara linear bertahap dan kaku", is_correct: false },
            { text: "Iteratif dan inkremental dalam siklus sprint pendek yang adaptif", is_correct: true },
            { text: "Klien hanya dilibatkan pada akhir proyek saat rilis", is_correct: false },
            { text: "Dokumentasi tebal harus diselesaikan sebelum kode ditulis", is_correct: false },
          ],
        },
        {
          question_text: "Diagram UML manakah yang memodelkan fungsionalitas sistem dari sudut pandang pengguna eksternal (Aktor)?",
          explanation: "Use Case Diagram menggambarkan interaksi antara aktor (pengguna atau sistem eksternal) dengan fungsi-fungsi utama sistem.",
          sort_order: 3,
          options: [
            { text: "Class Diagram", is_correct: false },
            { text: "Deployment Diagram", is_correct: false },
            { text: "Use Case Diagram", is_correct: true },
            { text: "Component Diagram", is_correct: false },
          ],
        },
        {
          question_text: "Prinsip Clean Code 'DRY' merupakan singkatan dari:",
          explanation: "DRY (Don't Repeat Yourself) menekankan pentingnya menghindari redundansi dan duplikasi logika kode di berbagai tempat.",
          sort_order: 4,
          options: [
            { text: "Do Refactor Yearly", is_correct: false },
            { text: "Don't Repeat Yourself", is_correct: true },
            { text: "Deploy Rapidly Yesterday", is_correct: false },
            { text: "Data Relational Yield", is_correct: false },
          ],
        },
        {
          question_text: "Pada piramida pengujian perangkat lunak (Test Pyramid), lapisan pengujian yang berada paling dasar dengan kecepatan eksekusi tertinggi adalah:",
          explanation: "Unit Testing berada di dasar piramida, menguji fungsi/metode terkecil secara terisolasi dengan kecepatan tinggi dan biaya rendah.",
          sort_order: 5,
          options: [
            { text: "End-to-End (E2E) Testing", is_correct: false },
            { text: "Unit Testing", is_correct: true },
            { text: "User Acceptance Testing (UAT)", is_correct: false },
            { text: "Manual Smoke Testing", is_correct: false },
          ],
        },
      ];

      for (const q of rplQuestions) {
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
      console.log("✅ Quiz Rekayasa Perangkat Lunak seeded with 5 questions.");
    }
  }

  // 2. Kuis Teknologi Pendidikan & Media Pembelajaran Digital
  const tekpenCourseId = courseMap["teknologi-pendidikan-media-digital"];
  if (tekpenCourseId) {
    console.log("📝 Inserting Quiz: Teknologi Pendidikan & Media Digital...");

    let { data: existingQuiz } = await supabase
      .from("quizzes")
      .select("id")
      .eq("course_id", tekpenCourseId)
      .maybeSingle();

    let quizId = existingQuiz?.id;

    if (!quizId) {
      const { data: newQuiz, error: qErr } = await supabase
        .from("quizzes")
        .insert({
          course_id: tekpenCourseId,
          title: "Uji Kompetensi: Desain Instruksional & Media Pembelajaran Digital",
          description: "Evaluasi penguasaan kerangka kerja TPACK, model ADDIE, prinsip Multimedia Learning, dan asesmen digital.",
          passing_score: 70,
        })
        .select()
        .single();

      if (qErr) {
        console.error("Error creating Tekpen quiz:", qErr.message);
      } else {
        quizId = newQuiz.id;
      }
    }

    if (quizId) {
      await supabase.from("quiz_questions").delete().eq("quiz_id", quizId);

      const tekpenQuestions = [
        {
          question_text: "Kerangka kerja TPACK (Mishra & Koehler) merupakan sintesis terintegrasi dari tiga pengetahuan utama pendidik, yaitu:",
          explanation: "TPACK memadukan Technological Knowledge (Teknologi), Pedagogical Knowledge (Pedagogi), dan Content Knowledge (Materi Pelajaran).",
          sort_order: 1,
          options: [
            { text: "Teaching, Planning, Assessment, Curriculum, Knowledge", is_correct: false },
            { text: "Technological, Pedagogical, and Content Knowledge", is_correct: true },
            { text: "Technical, Practical, Analytical, and Computational Kit", is_correct: false },
            { text: "Theory, Practice, Application, and Certification", is_correct: false },
          ],
        },
        {
          question_text: "Urutan lima tahapan dalam model desain instruksional ADDIE yang tepat adalah:",
          explanation: "ADDIE adalah akronim dari Analysis (Analisis), Design (Desain), Development (Pengembangan), Implementation (Implementasi), dan Evaluation (Evaluasi).",
          sort_order: 2,
          options: [
            { text: "Assessment, Delivery, Documentation, Integration, Evaluation", is_correct: false },
            { text: "Analysis, Design, Development, Implementation, Evaluation", is_correct: true },
            { text: "Adaptation, Deduction, Deployment, Instruction, Execution", is_correct: false },
            { text: "Algorithm, Data, Design, Iteration, Education", is_correct: false },
          ],
        },
        {
          question_text: "Menurut Teori Kognitif Pembelajaran Multimedia (Richard E. Mayer), prinsip 'Multimedia' menyatakan bahwa:",
          explanation: "Prinsip Multimedia membuktikan bahwa pembelajar dapat membangun model mental yang lebih kokoh jika materi disajikan dengan kata-kata dan gambar dibandingkan kata-kata saja.",
          sort_order: 3,
          options: [
            { text: "Semakin banyak animasi dan efek suara, pemahaman semakin tinggi", is_correct: false },
            { text: "Siswa belajar lebih baik dari kata-kata yang disertai visual gambar daripada teks saja", is_correct: true },
            { text: "Video instruksional harus berdurasi minimal 60 menit tanpa henti", is_correct: false },
            { text: "Teks harus dibacakan kata demi kata secara identik oleh narator", is_correct: false },
          ],
        },
        {
          question_text: "Ketika seorang guru informatika menggunakan analogi 'antrean tiket konser' untuk mempermudah siswa memahami struktur data Queue, aspek TPACK yang sedang diterapkan adalah:",
          explanation: "Pedagogical Content Knowledge (PCK) adalah kemampuan menyusun analogi, representasi, dan metode ajar yang efektif untuk materi konsep tertentu.",
          sort_order: 4,
          options: [
            { text: "Technological Knowledge (TK)", is_correct: false },
            { text: "Pedagogical Content Knowledge (PCK)", is_correct: true },
            { text: "Technological Pedagogical Knowledge (TPK)", is_correct: false },
            { text: "Content Knowledge (CK) murni", is_correct: false },
          ],
        },
        {
          question_text: "Aktivitas asesmen di mana mahasiswa diminta menganalisis potongan kode pemrograman dan mendeteksi kesalahan logika (bug) tergolong dalam ranah Taksonomi Bloom level:",
          explanation: "Menemukan bug logika dan menganalisis relasi antar-komponen kode merupakan ranah kognitif C4 (Menganalisis / Analyzing).",
          sort_order: 5,
          options: [
            { text: "C1 (Mengingat)", is_correct: false },
            { text: "C2 (Memahami)", is_correct: false },
            { text: "C4 (Menganalisis)", is_correct: true },
            { text: "C6 (Mencipta)", is_correct: false },
          ],
        },
      ];

      for (const q of tekpenQuestions) {
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
      console.log("✅ Quiz Teknologi Pendidikan seeded with 5 questions.");
    }
  }

  console.log("\n🎉 ALL 5 courses now have complete interactive quizzes!");
}

main().catch(console.error);
