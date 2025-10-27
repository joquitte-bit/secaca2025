import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession()
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const lessonId = params.id

    // Haal progress op
    const progress = await prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId
        }
      }
    })

    // Haal quiz attempts op
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId: user.id,
        lessonId
      },
      orderBy: { createdAt: 'desc' },
      take: 1
    })

    const latestAttempt = quizAttempts[0]

    return NextResponse.json({
      completed: progress?.completed || false,
      quizAttempt: latestAttempt ? {
        score: latestAttempt.score,
        passed: latestAttempt.passed,
        createdAt: latestAttempt.createdAt
      } : null
    })

  } catch (error) {
    console.error('Error fetching lesson progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lesson progress' },
      { status: 500 }
    )
  }
}