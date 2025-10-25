import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('📥 GET /api/modules - Fetching all modules')
    
    const modules = await prisma.module.findMany({
      include: {
        lessonModules: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                durationMinutes: true,
                difficulty: true,
                type: true,
                status: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📊 Found ${modules.length} modules`)

    // Helper functies voor tags
    const cleanTag = (tag: string): string => {
      return tag.replace(/"/g, '').trim()
    }

const isValidTag = (tag: any): boolean => {
  return Boolean(tag) && typeof tag === 'string' && tag.trim().length > 0
}

    const getValidTags = (tags: any): string[] => {
      if (!Array.isArray(tags)) return []
      return tags
        .filter(tag => isValidTag(tag))
        .map(tag => cleanTag(tag))
        .filter(tag => tag.length > 0) // Filter lege tags na cleaning
    }

    // Transform modules met lessons data
    const transformedModules = modules.map(module => {
      const lessons = module.lessonModules.map(lm => lm.lesson)
      const totalDuration = lessons.reduce((acc, lesson) => acc + (lesson.durationMinutes || 0), 0)
      const expertLessonsCount = lessons.filter(lesson => lesson.difficulty === 'expert').length

      // Bepaal difficulty level
      let difficulty = 'Beginner'
      if (expertLessonsCount > 0 && expertLessonsCount === lessons.length) {
        difficulty = 'Expert'
      } else if (expertLessonsCount > 0) {
        difficulty = 'Intermediate'
      }

      // Zorg dat tags altijd een schone array is
      const cleanTags = getValidTags(module.tags)

      return {
        id: module.id,
        title: module.title,
        description: module.description,
        status: module.status,
        category: module.category,
        order: module.order,
        // BELANGRIJK: Gebruik 'lessons' in plaats van 'lessonsCount' voor compatibiliteit
        lessons: lessons.length,
        lessonsCount: lessons.length, // behoud voor backward compatibility
        expertLessonsCount: expertLessonsCount,
        totalDuration: totalDuration,
        createdAt: module.createdAt.toISOString(),
        updatedAt: module.updatedAt.toISOString(),
        // Voor compatibiliteit met frontend
        duration: totalDuration,
        difficulty: difficulty,
        // Optionele velden voor frontend
        courseCount: 0,
        completionRate: 0,
        tags: cleanTags, // Nu gegarandeerd een schone array
        content: module.content || '',
        objectives: module.objectives || [],
        prerequisites: module.prerequisites || [],
        // Extra velden die de frontend verwacht
        level: difficulty.toLowerCase(),
        slug: module.slug || module.title.toLowerCase().replace(/\s+/g, '-'),
        enrollments: 0,
        lessonCount: lessons.length // alternatieve naam
      }
    })

    console.log('✅ Modules transformed successfully')
    
    // Debug: log de eerste module om de structuur te zien
    if (transformedModules.length > 0) {
      console.log('🔍 First module structure:', {
        title: transformedModules[0].title,
        lessons: transformedModules[0].lessons,
        tags: transformedModules[0].tags,
        tagsType: typeof transformedModules[0].tags
      })
    }
    
    return NextResponse.json(transformedModules)

  } catch (error: any) {
    console.error('❌ Error fetching modules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch modules: ' + error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}