// src/app/dashboard/page.tsx - SIMPELE VERSIE
import { prisma } from '@/lib/prisma'

export default async function DashboardPage() {
  try {
    // SIMPELE QUERIES zonder complexe relaties
    const courseCount = await prisma.course.count()
    const userCount = await prisma.user.count() 
    const moduleCount = await prisma.module.count()
    const lessonCount = await prisma.lesson.count()
    const enrollmentCount = await prisma.enrollment.count()

    const stats = [
      courseCount,
      userCount, 
      moduleCount,
      lessonCount,
      enrollmentCount
    ]

    // ... rest van je component
  } catch (error) {
    console.error('Dashboard error:', error)
    
    // Fallback stats
    const stats = [0, 0, 0, 0, 0]
    
    // ... render component met fallback data
  }
}