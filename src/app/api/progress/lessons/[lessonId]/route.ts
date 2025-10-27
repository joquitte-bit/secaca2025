import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const user = await getCurrentUser()
    
    // Voor development, gebruik demo user als er geen is
    const userId = user?.id || 'cmh8laluq0000874a2abur4m2-user'

    const lessonId = params.lessonId

    // Haal lesson progress op
    const progress = await prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: lessonId
        }
      }
    })

    return NextResponse.json({
      completed: progress?.completed || false
    })

  } catch (error) {
    console.error('Error fetching lesson progress:', error)
    return NextResponse.json(
      { completed: false, error: 'Failed to fetch lesson progress' },
      { status: 500 }
    )
  }
}