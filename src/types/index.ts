export type UserRole = "student" | "instructor" | "admin";

export type CourseDifficulty = "beginner" | "intermediate" | "advanced";

export type ContentStatus = "draft" | "published" | "archived";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string | null;
  role: UserRole;
  bio?: string | null;
  institution?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  sort_order: number;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  learning_objectives: string[];
  category_id: string;
  category?: Category;
  difficulty: CourseDifficulty;
  estimated_duration_minutes: number;
  instructor_id: string;
  instructor_name?: string;
  status: ContentStatus;
  thumbnail_url?: string;
  total_lessons?: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  slug: string;
  sort_order: number;
  content: string; // Markdown or structured text
  learning_objectives: string[];
  estimated_minutes: number;
  status: ContentStatus;
  created_at: string;
  updated_at: string;
}

export interface QuizQuestionOption {
  id: string;
  question_id: string;
  option_text: string;
  sort_order: number;
  // is_correct is strictly server-side / not exposed before submission
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  explanation?: string;
  sort_order: number;
  options: QuizQuestionOption[];
}

export interface Quiz {
  id: string;
  course_id: string;
  lesson_id?: string | null;
  title: string;
  description: string;
  passing_score: number;
  questions?: QuizQuestion[];
  created_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  completed_at?: string | null;
}

export interface CourseEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  completed_at?: string | null;
  progress_percentage: number;
}
