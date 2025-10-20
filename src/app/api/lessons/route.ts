// src/app/api/lessons/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId')

    console.log('🔍 Fetching lessons with modules for org:', orgId)

    const whereClause = orgId ? { orgId } : {}

    // Haal lessons op met hun modules via de junction table
    const lessons = await prisma.lesson.findMany({
      where: whereClause,
      include: {
        modules: {
          include: {
            module: {
              select: {
                id: true,
                title: true,
                description: true,
                order: true,
                category: true,
                status: true,
                duration: true,
                difficulty: true,
                tags: true
              }
            }
          },
          orderBy: {
            module: {
              order: 'asc'
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log(`✅ ${lessons.length} lessons gevonden`)

    const transformedLessons = lessons.map(lesson => {
      // Haal modules op uit de junction table
      const modules = lesson.modules.map(lessonOnModule => ({
        id: lessonOnModule.module.id,
        title: lessonOnModule.module.title,
        description: lessonOnModule.module.description,
        order: lessonOnModule.module.order,
        category: lessonOnModule.module.category,
        status: lessonOnModule.module.status,
        duration: lessonOnModule.module.duration,
        difficulty: lessonOnModule.module.difficulty,
        tags: lessonOnModule.module.tags ? JSON.parse(lessonOnModule.module.tags) : []
      }))

      const primaryModule = modules.length > 0 ? modules[0] : null

      console.log(`📚 Lesson "${lesson.title}" heeft ${modules.length} modules:`, 
        modules.map(m => m.title))

      return {
        id: lesson.id,
        title: lesson.title,
        description: lesson.description || '',
        type: lesson.type,
        content: lesson.content,
        order: lesson.order,
        duration: lesson.durationMinutes || 0,
        status: lesson.status,
        difficulty: lesson.difficulty || 'Beginner',
        tags: lesson.tags ? JSON.parse(lesson.tags) : [],
        category: lesson.category || 'Uncategorized',
        videoUrl: lesson.videoUrl,
        // Voor backward compatibility
        moduleId: primaryModule?.id || null,
        moduleTitle: primaryModule?.title || null,
        // Nieuwe velden met alle modules
        modules: modules,
        moduleCount: modules.length,
        students: 0,
        progress: 0,
        createdAt: lesson.createdAt.toISOString().split('T')[0],
        updatedAt: lesson.updatedAt.toISOString().split('T')[0],
      }
    })

    return NextResponse.json(transformedLessons)
  } catch (error) {
    console.error('Lessons fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}