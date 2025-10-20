// src/app/api/modules/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      include: {
        course: {
          select: {
            title: true
          }
        },
        lessons: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                description: true,
                order: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    })

    // Transform to match frontend interface
    const transformedModules = modules.map((module: any) => ({
      id: module.id,
      title: module.title,
      description: module.description || '',
      order: module.order,
      courseId: module.courseId,
      courseTitle: module.course?.title,
      category: module.category || 'Uncategorized',
      status: module.status || 'Concept',
      duration: module.duration || 0,
      difficulty: module.difficulty || 'Beginner',
      tags: module.tags ? JSON.parse(module.tags) : [],
      // 📍 CRITICAL FIX: Transform many-to-many data
      lessons: module.lessons.map((lessonOnModule: any) => lessonOnModule.lesson),
      lessonsCount: module.lessons.length,
      students: 0,
      progress: 0,
      createdAt: module.createdAt.toISOString().split('T')[0],
      updatedAt: module.updatedAt.toISOString().split('T')[0],
    }))

    console.log(`✅ [API] ${transformedModules.length} modules geladen met lessons`)
    
    return NextResponse.json(transformedModules)
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🔍 [API] POST module request:', body)

    // Validate required fields
    if (!body.title || !body.courseId) {
      return NextResponse.json(
        { error: 'Title and course are required' },
        { status: 400 }
      )
    }

    // Get the highest order for this course
    const highestOrderModule = await prisma.module.findFirst({
      where: { courseId: body.courseId },
      orderBy: { order: 'desc' }
    })
    const nextOrder = highestOrderModule ? highestOrderModule.order + 1 : 1

    // Prepare create data
    const createData: any = {
      courseId: body.courseId,
      title: body.title,
      description: body.description || '',
      order: nextOrder,
      category: body.category || 'Uncategorized',
      status: body.status || 'Concept',
      duration: body.duration || 0,
      difficulty: body.difficulty || 'Beginner',
      tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : '[]',
    }

    const newModule = await prisma.module.create({
      data: createData,
      include: {
        course: {
          select: {
            title: true
          }
        },
        lessons: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                description: true,
                order: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    // If lessonIds are provided, connect the lessons via junction table
    if (body.lessonIds && Array.isArray(body.lessonIds) && body.lessonIds.length > 0) {
      console.log('📚 [API] Connecting lessons to new module via junction:', body.lessonIds)
      
      // Create junction records
      const lessonConnections = body.lessonIds.map((lessonId: string, index: number) => ({
        moduleId: newModule.id,
        lessonId: lessonId,
        order: index
      }))

      await prisma.lessonOnModule.createMany({
        data: lessonConnections
      })

      // Reload module with updated lessons
      const updatedModule = await prisma.module.findUnique({
        where: { id: newModule.id },
        include: {
          course: {
            select: {
              title: true
            }
          },
          lessons: {
            include: {
              lesson: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  order: true
                }
              }
            },
            orderBy: {
              order: 'asc'
            }
          }
        }
      })

      console.log('✅ [API] Module created with lessons:', {
        id: updatedModule?.id,
        title: updatedModule?.title,
        lessonsCount: updatedModule?.lessons.length
      })

      // Transform the response
      const transformedModule = {
        id: updatedModule!.id,
        title: updatedModule!.title,
        description: updatedModule!.description || '',
        order: updatedModule!.order,
        courseId: updatedModule!.courseId,
        courseTitle: updatedModule!.course?.title,
        category: updatedModule!.category || 'Uncategorized',
        status: updatedModule!.status || 'Concept',
        duration: updatedModule!.duration || 0,
        difficulty: updatedModule!.difficulty || 'Beginner',
        tags: updatedModule!.tags ? JSON.parse(updatedModule!.tags) : [],
        lessons: updatedModule!.lessons.map((lessonOnModule: any) => lessonOnModule.lesson),
        lessonsCount: updatedModule!.lessons.length,
        students: 0,
        progress: 0,
        createdAt: updatedModule!.createdAt.toISOString().split('T')[0],
        updatedAt: updatedModule!.updatedAt.toISOString().split('T')[0],
      }

      return NextResponse.json(transformedModule, { status: 201 })
    }

    console.log('✅ [API] Module created without lessons:', {
      id: newModule.id,
      title: newModule.title
    })

    // Transform the response for module without lessons
    const transformedModule = {
      id: newModule.id,
      title: newModule.title,
      description: newModule.description || '',
      order: newModule.order,
      courseId: newModule.courseId,
      courseTitle: newModule.course?.title,
      category: newModule.category || 'Uncategorized',
      status: newModule.status || 'Concept',
      duration: newModule.duration || 0,
      difficulty: newModule.difficulty || 'Beginner',
      tags: newModule.tags ? JSON.parse(newModule.tags) : [],
      lessons: [],
      lessonsCount: 0,
      students: 0,
      progress: 0,
      createdAt: newModule.createdAt.toISOString().split('T')[0],
      updatedAt: newModule.updatedAt.toISOString().split('T')[0],
    }

    return NextResponse.json(transformedModule, { status: 201 })
  } catch (error) {
    console.error('❌ [API] Error creating module:', error)
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    )
  }
}