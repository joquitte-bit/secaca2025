import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    const user = await getCurrentUser()
    
    // Voor development, gebruik demo user als er geen is
    const userId = user?.id || 'cmh8laluq0000874a2abur4m2-user'

    const lessonId = params.lessonId

    console.log('Completing lesson:', lessonId, 'for user:', userId)

    // Update of create lesson progress
    const progress = await prisma.userLessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: lessonId
        }
      },
      update: {
        completed: true
      },
      create: {
        userId: userId,
        lessonId: lessonId,
        completed: true
      }
    })

    console.log('Lesson completed successfully:', progress)

    return NextResponse.json({ 
      success: true,
      progress 
    })
  } catch (error) {
    console.error('Error completing lesson:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to complete lesson' 
      },
      { status: 500 }
    )
  }
}