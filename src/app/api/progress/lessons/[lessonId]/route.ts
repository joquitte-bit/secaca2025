import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    const user = await getCurrentUser()
    
    // Gebruik de echte user ID voor development
    const userId = user?.id || 'cmh9la1uu0004874a9mlxtu4c'

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