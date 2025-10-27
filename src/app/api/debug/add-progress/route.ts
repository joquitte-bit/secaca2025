import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Eerst proberen we de progress records één voor één toe te voegen
    // om duplicate errors te vermijden
    
    const progressData = [
      {
        userId: 'cmh8laluq0000874a2abur4m2-user',
        lessonId: 'cmh9la1uv0006874ak8e9gsf7',
        completed: true
      },
      {
        userId: 'cmh8laluq0000874a2abur4m2-user',
        lessonId: 'cmh9la1uw000b874a8yt0mwn6', 
        completed: true
      }
    ]

    let addedCount = 0

    // Voeg elke progress record toe, skip als die al bestaat
    for (const progress of progressData) {
      try {
        await prisma.userLessonProgress.upsert({
          where: {
            userId_lessonId: {
              userId: progress.userId,
              lessonId: progress.lessonId
            }
          },
          update: {
            completed: progress.completed
          },
          create: {
            userId: progress.userId,
            lessonId: progress.lessonId,
            completed: progress.completed
          }
        })
        addedCount++
      } catch (error) {
        console.log('Progress already exists or error:', error)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Progress toegevoegd voor ${addedCount} lessons` 
    })
  } catch (error) {
    console.error('Error adding progress:', error)
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 })
  }
}