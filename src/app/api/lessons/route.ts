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
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transformeer de data voor de frontend
    const transformedLessons = lessons.map(lesson => {
      // Map module status van database enum naar frontend string
      const modulesWithStatus = lesson.modules.map(lessonModule => ({
        ...lessonModule.module,
        status: lessonModule.module.status === 'ACTIEF' ? 'Actief' : 
                lessonModule.module.status === 'INACTIEF' ? 'Inactief' : 'Concept'
      }))

      return {
        ...lesson,
        modules: modulesWithStatus,
        moduleCount: lesson.modules.length
      }
    })

    console.log(`✅ ${transformedLessons.length} lessons loaded`)
    return NextResponse.json(transformedLessons)
  } catch (error) {
    console.error('Lessons fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}