// src/types/lesson.ts
export interface Lesson {
  id: string
  title: string
  description: string
  status: 'Actief' | 'Inactief' | 'Concept'
  category: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  type?: 'Video' | 'Artikel' | 'Quiz' | 'Interactief'
  order?: number
  tags?: string[]
  videoUrl?: string
  content?: string
  isFree: boolean // ✅ Verplicht in beide
  modules: number // ✅ Verplicht in beide
  quizQuestions: number // ✅ Verplicht in beide
  completionRate: number // ✅ Verplicht in beide
  createdAt: string // ✅ Verplicht in beide
  updatedAt: string // ✅ Verplicht in beide
}