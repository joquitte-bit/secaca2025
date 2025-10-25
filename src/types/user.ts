// src/types/user.ts
export interface User {
  id: string
  name: string
  email: string
  role: 'Beheerder' | 'Manager' | 'Cursist'
  status: 'Actief' | 'Inactief' | 'Uitgenodigd'
  image?: string
  organization: string
  enrollments: number
  certificates: number
  quizAttempts: number
  lastLogin: string
  createdAt: string
  updatedAt: string
}

export interface UserDetail {
  id: string
  name: string
  email: string
  role: 'Beheerder' | 'Manager' | 'Cursist'
  status: 'Actief' | 'Inactief' | 'Uitgenodigd'
  image?: string
  organization: string
  enrollments: any[]
  certificates: any[]
  quizAttempts: any[]
  lastLogin: string
  createdAt: string
  updatedAt: string
}