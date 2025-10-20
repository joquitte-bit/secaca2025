// src/app/api/modules/[moduleId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { moduleId } = params
    const body = await request.json()

    console.log('🔍 [API] PUT module request:', { moduleId, body })

    if (!moduleId) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      title: body.title,
      description: body.description || '',
      category: body.category || 'Uncategorized',
      status: body.status || 'Concept',
      duration: body.duration || 0,
      difficulty: body.difficulty || 'Beginner',
      tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : '[]',
    }

    // Update module first
    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: updateData,
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

    // Handle lesson connections via junction table - SIMPLIFIED VERSION
    if (body.lessonIds && Array.isArray(body.lessonIds)) {
      console.log('📚 [API] Updating lesson connections:', body.lessonIds)

      // 1. Delete existing connections
      await prisma.lessonOnModule.deleteMany({
        where: { moduleId }
      })

      // 2. Create new connections if there are lessons
      if (body.lessonIds.length > 0) {
        const lessonConnections = body.lessonIds.map((lessonId: string, index: number) => ({
          moduleId: moduleId,
          lessonId: lessonId,
          order: index
        }))

        await prisma.lessonOnModule.createMany({
          data: lessonConnections
        })

        // Reload module with updated lessons
        const finalModule = await prisma.module.findUnique({
          where: { id: moduleId },
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

        console.log('✅ [API] Module updated successfully with lessons:', {
          id: finalModule?.id,
          title: finalModule?.title,
          lessonsCount: finalModule?.lessons.length
        })

        // Transform the response
        const transformedModule = {
          id: finalModule!.id,
          title: finalModule!.title,
          description: finalModule!.description || '',
          order: finalModule!.order,
          courseId: finalModule!.courseId,
          courseTitle: finalModule!.course?.title,
          category: finalModule!.category || 'Uncategorized',
          status: finalModule!.status || 'Concept',
          duration: finalModule!.duration || 0,
          difficulty: finalModule!.difficulty || 'Beginner',
          tags: finalModule!.tags ? JSON.parse(finalModule!.tags) : [],
          lessons: finalModule!.lessons.map((lessonOnModule: any) => lessonOnModule.lesson),
          lessonsCount: finalModule!.lessons.length,
          students: 0,
          progress: 0,
          createdAt: finalModule!.createdAt.toISOString().split('T')[0],
          updatedAt: finalModule!.updatedAt.toISOString().split('T')[0],
        }

        return NextResponse.json(transformedModule)
      }
    }

    console.log('✅ [API] Module updated successfully without lessons:', {
      id: updatedModule.id,
      title: updatedModule.title,
      lessonsCount: updatedModule.lessons.length
    })

    // Transform the response for module without lesson changes
    const transformedModule = {
      id: updatedModule.id,
      title: updatedModule.title,
      description: updatedModule.description || '',
      order: updatedModule.order,
      courseId: updatedModule.courseId,
      courseTitle: updatedModule.course?.title,
      category: updatedModule.category || 'Uncategorized',
      status: updatedModule.status || 'Concept',
      duration: updatedModule.duration || 0,
      difficulty: updatedModule.difficulty || 'Beginner',
      tags: updatedModule.tags ? JSON.parse(updatedModule.tags) : [],
      lessons: updatedModule.lessons.map((lessonOnModule: any) => lessonOnModule.lesson),
      lessonsCount: updatedModule.lessons.length,
      students: 0,
      progress: 0,
      createdAt: updatedModule.createdAt.toISOString().split('T')[0],
      updatedAt: updatedModule.updatedAt.toISOString().split('T')[0],
    }

    return NextResponse.json(transformedModule)
  } catch (error) {
    console.error('❌ [API] Error updating module:', error)
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    )
  }
}

// Keep existing GET, PATCH, DELETE functions but update the include for lessons
export async function GET(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { moduleId } = params

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
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

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    // Transform the response
    const transformedModule = {
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
      lessons: module.lessons.map((lessonOnModule: any) => lessonOnModule.lesson),
      lessonsCount: module.lessons.length,
      students: 0,
      progress: 0,
      createdAt: module.createdAt.toISOString().split('T')[0],
      updatedAt: module.updatedAt.toISOString().split('T')[0],
    }

    return NextResponse.json(transformedModule)
  } catch (error) {
    console.error('Error fetching module:', error)
    return NextResponse.json(
      { error: 'Failed to fetch module' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { moduleId } = params
    const body = await request.json()

    const module = await prisma.module.update({
      where: { id: moduleId },
      data: body,
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

    // Transform the response
    const transformedModule = {
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
      lessons: module.lessons.map((lessonOnModule: any) => lessonOnModule.lesson),
      lessonsCount: module.lessons.length,
      students: 0,
      progress: 0,
      createdAt: module.createdAt.toISOString().split('T')[0],
      updatedAt: module.updatedAt.toISOString().split('T')[0],
    }

    return NextResponse.json(transformedModule)
  } catch (error) {
    console.error('Error updating module:', error)
    return NextResponse.json(
      { error: 'Failed to update module' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    const { moduleId } = params

    await prisma.module.delete({
      where: { id: moduleId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    )
  }
}