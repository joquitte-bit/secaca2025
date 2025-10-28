import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔧 Adding demo progress...')
    
    // Gebruik de exacte IDs uit je database
    const progressData = [
      {
        userId: 'cmh8laluq0000874a2abur4m2-user', // Demo gebruiker ID
        lessonId: 'cmh9la1uv0006874ak8e9gsf7',    // Inleiding Security Awareness
        completed: true
      },
      {
        userId: 'cmh8laluq0000874a2abur4m2-user',
        lessonId: 'cmh9la1uw000b874a8yt0mwn6',    // Phishing Herkenning
        completed: true
      }
    ]

    let addedCount = 0
    const results = []

    for (const progress of progressData) {
      try {
        const result = await prisma.userLessonProgress.upsert({
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
        results.push(result)
        console.log(`✅ Progress added: ${progress.lessonId}`)
      } catch (error) {
        console.log(`⚠️ Progress exists or error for ${progress.lessonId}:`, error)
      }
    }

    console.log(`📊 Total progress added: ${addedCount}`)

    return NextResponse.json({ 
      success: true, 
      message: `Progress toegevoegd voor ${addedCount} lessons`,
      results 
    })

  } catch (error) {
    console.error('💥 Error adding progress:', error)
    return NextResponse.json({ 
      success: false, 
      error: String(error) 
    }, { status: 500 })
  }
}