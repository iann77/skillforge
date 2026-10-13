export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: "lesson" | "quiz" | "course" | "streak";
  isUnlocked: boolean;
  unlockedAt?: string | null;
}

export interface GamificationStats {
  totalXp: number;
  level: number;
  levelTitle: string;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPercent: number;
  unlockedBadgesCount: number;
  totalBadgesCount: number;
  badges: Badge[];
}

export function calculateGamification({
  completedLessonsCount,
  passedQuizzesCount,
  perfectQuizzesCount,
  enrolledCoursesCount,
  completedCoursesCount,
}: {
  completedLessonsCount: number;
  passedQuizzesCount: number;
  perfectQuizzesCount: number;
  enrolledCoursesCount: number;
  completedCoursesCount: number;
}): GamificationStats {
  // Hitung XP
  // 1 Lesson = 25 XP
  // 1 Quiz Passed = 100 XP
  // 1 Perfect Quiz = +50 XP bonus
  // 1 Course Enrolled = 10 XP
  // 1 Course Completed = 200 XP bonus
  const totalXp =
    completedLessonsCount * 25 +
    passedQuizzesCount * 100 +
    perfectQuizzesCount * 50 +
    enrolledCoursesCount * 10 +
    completedCoursesCount * 200;

  // Level Tiers:
  // Level 1: 0 - 99 XP (Mahasiswa Baru)
  // Level 2: 100 - 299 XP (Junior Programmer)
  // Level 3: 300 - 599 XP (Praktisi Komputasi)
  // Level 4: 600 - 999 XP (Informatics Engineer)
  // Level 5: 1000+ XP (Informatics Master)
  let level = 1;
  let levelTitle = "Mahasiswa Baru";
  let currentLevelXp = 0;
  let nextLevelXp = 100;

  if (totalXp >= 1000) {
    level = 5;
    levelTitle = "Informatics Master";
    currentLevelXp = 1000;
    nextLevelXp = 1000;
  } else if (totalXp >= 600) {
    level = 4;
    levelTitle = "Informatics Engineer";
    currentLevelXp = 600;
    nextLevelXp = 1000;
  } else if (totalXp >= 300) {
    level = 3;
    levelTitle = "Praktisi Komputasi";
    currentLevelXp = 300;
    nextLevelXp = 600;
  } else if (totalXp >= 100) {
    level = 2;
    levelTitle = "Junior Programmer";
    currentLevelXp = 100;
    nextLevelXp = 300;
  }

  const range = nextLevelXp - currentLevelXp;
  const progressPercent =
    level === 5
      ? 100
      : Math.min(100, Math.max(0, Math.round(((totalXp - currentLevelXp) / range) * 100)));

  // Badges
  const badges: Badge[] = [
    {
      id: "first-step",
      title: "Langkah Pertama",
      description: "Selesaikan modul pelajaran pertama Anda di SkillForge.",
      icon: "Footprints",
      category: "lesson",
      isUnlocked: completedLessonsCount >= 1,
    },
    {
      id: "diligent-student",
      title: "Pembelajar Tekun",
      description: "Selesaikan setidaknya 5 materi pelajaran.",
      icon: "BookOpenCheck",
      category: "lesson",
      isUnlocked: completedLessonsCount >= 5,
    },
    {
      id: "quiz-graduate",
      title: "Lulus Uji Kompetensi",
      description: "Lulus minimal satu uji kompetensi kuis.",
      icon: "Award",
      category: "quiz",
      isUnlocked: passedQuizzesCount >= 1,
    },
    {
      id: "perfect-score",
      title: "Nilai Sempurna 100",
      description: "Raih skor sempurna 100 pada uji kompetensi kuis.",
      icon: "Sparkles",
      category: "quiz",
      isUnlocked: perfectQuizzesCount >= 1,
    },
    {
      id: "multi-course",
      title: "Eksplorasi Kurikulum",
      description: "Mendaftar ke 3 atau lebih modul kursus bidang informatika.",
      icon: "Compass",
      category: "course",
      isUnlocked: enrolledCoursesCount >= 3,
    },
    {
      id: "course-finisher",
      title: "Alumni Modul",
      description: "Selesaikan 100% seluruh materi dalam satu kursus.",
      icon: "GraduationCap",
      category: "course",
      isUnlocked: completedCoursesCount >= 1,
    },
  ];

  const unlockedBadgesCount = badges.filter((b) => b.isUnlocked).length;

  return {
    totalXp,
    level,
    levelTitle,
    currentLevelXp,
    nextLevelXp,
    progressPercent,
    unlockedBadgesCount,
    totalBadgesCount: badges.length,
    badges,
  };
}
