// types/index.ts
export interface Module {
  id?: string
  title: string
  description: string
  status: 'CONCEPT' | 'ACTIEF' | 'INACTIEF'
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  lessons: number
  duration: number
  order: number
  courseCount: number
  completionRate: number
  tags: string[]
  content: string
  objectives: string[]
  prerequisites: string[]
  createdAt?: string
  updatedAt?: string
}

export interface Lesson {
  id: string
  title: string
  description: string
  content: string
  duration: number
  order: number
  type: 'TEXT' | 'VIDEO' | 'QUIZ' | 'DOWNLOAD'
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  category: string
  tags: string[] | string
  slug: string
  videoUrl?: string
  quizQuestions?: number
  createdAt: string
  updatedAt: string
}