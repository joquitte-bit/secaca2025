// src/app/api/lessons/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔄 [API] Fetching lessons...')
    
    const lessons = await prisma.lesson.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
        durationMinutes: true,
        status: true,
        difficulty: true,
        category: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        modules: {
          select: {
            id: true
          }
        },
        quizQuestions: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    })

    console.log(`✅ [API] Found ${lessons.length} lessons`)

    // Transform for frontend - GEBRUIK CORRECTE STATUS VALUES
    const transformedLessons = lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      order: lesson.order,
      duration: lesson.durationMinutes || 0,
      isFree: false, // Placeholder, bestaat niet in schema
      status: lesson.status === 'PUBLISHED' ? 'Actief' : 
              lesson.status === 'ARCHIVED' ? 'Inactief' : 'Concept', // Gebruikzelfde values als courses
      difficulty: (lesson.difficulty as 'Beginner' | 'Intermediate' | 'Expert') || 'Beginner',
      category: lesson.category || 'Uncategorized',
      tags: lesson.tags ? JSON.parse(lesson.tags) : [],
      modules: lesson.modules.length,
      quizQuestions: lesson.quizQuestions.length,
      completionRate: 0,
      createdAt: lesson.createdAt.toISOString().split('T')[0],
      updatedAt: lesson.updatedAt.toISOString().split('T')[0],
    }))

    console.log(`✅ [API] ${transformedLessons.length} lessons transformed`)
    
    return NextResponse.json(transformedLessons)
  } catch (error) {
    console.error('❌ [API] Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}