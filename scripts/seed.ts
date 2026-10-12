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

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const CATEGORIES = [
  {
    name: "Algoritma dan Pemrograman",
    slug: "algoritma-dan-pemrograman",
    description: "Fondasi logika komputasi, pseudocode, flowchart, dan implementasi kode terstruktur.",
    icon: "Code2",
    sort_order: 1,
  },
  {
    name: "Pengembangan Web",
    slug: "pengembangan-web",
    description: "Membangun aplikasi web modern dari HTML, CSS, JavaScript hingga fullstack ecosystem.",
    icon: "Globe",
    sort_order: 2,
  },
  {
    name: "Basis Data dan SQL",
    slug: "basis-data-dan-sql",
    description: "Perancangan skema relasional, normalisasi, indexing, dan manipulasi data dengan SQL.",
    icon: "Database",
    sort_order: 3,
  },
  {
    name: "Struktur Data",
    slug: "struktur-data",
    description: "Pengorganisasian data efisien: Linked List, Stack, Queue, Tree, dan Graph serta analisis Big-O.",
    icon: "Boxes",
    sort_order: 4,
  },
  {
    name: "Sistem Komputer & OS",
    slug: "sistem-komputer-dan-os",
    description: "Arsitektur Von Neumann, manajemen memori, proses, concurrency, dan sistem berkas.",
    icon: "Cpu",
    sort_order: 5,
  },
  {
    name: "Jaringan Komputer",
    slug: "jaringan-komputer",
    description: "Model OSI & TCP/IP, subnetting IP, routing, switching, dan protokol komunikasi internet.",
    icon: "Network",
    sort_order: 6,
  },
  {
    name: "Rekayasa Perangkat Lunak",
    slug: "rekayasa-perangkat-lunak",
    description: "SDLC, Scrum/Agile, pemodelan UML, design patterns, testing, dan QA perangkat lunak.",
    icon: "Layers",
    sort_order: 7,
  },
  {
    name: "Teknologi Pendidikan",
    slug: "teknologi-pendidikan",
    description: "Integrasi pedagogical content knowledge (TPACK) dalam transformasi pendidikan modern.",
    icon: "GraduationCap",
    sort_order: 8,
  },
  {
    name: "Media Pembelajaran Digital",
    slug: "desain-instruksional-media",
    description: "Perancangan media ajar interaktif, simulasi multimedia, dan prinsip desain instruksional ADDIE.",
    icon: "LayoutTemplate",
    sort_order: 9,
  },
  {
    name: "Evaluasi Pembelajaran Digital",
    slug: "evaluasi-pembelajaran-digital",
    description: "Metrik asesmen berbasis rubrik digital, item response theory (IRT), dan analitik belajar.",
    icon: "CheckSquare",
    sort_order: 10,
  },
];

async function seed() {
  console.log("Seeding categories to Supabase...");
  const { data, error } = await supabase
    .from("categories")
    .upsert(CATEGORIES, { onConflict: "slug" })
    .select();

  if (error) {
    console.error("Error seeding categories:", error.message);
  } else {
    console.log(`Successfully seeded ${data.length} categories!`);
  }
}

seed().catch(console.error);
