// 📁 BESTAND: /src/types/lesson.ts
export interface Lesson {
  id: string  // ✅ Consistent houden als string (zoals in Prisma)
  title: string
  status: 'Actief' | 'Inactief' | 'Concept'
  description: string
  category: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  type: 'Video' | 'Artikel' | 'Quiz' | 'Interactief'
  order: number
  tags?: string[]
  moduleCount?: number
  includedInModules: number
  includedInCourses: number
  completionRate: number
  createdAt: string
  updatedAt: string
  content?: string
  videoUrl?: string
  modules?: any[]
  // ✅ Optionele velden voor backward compatibility
  moduleId?: string | null
  moduleTitle?: string | null
}