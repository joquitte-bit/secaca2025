// src/app/api/modules/[moduleId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ moduleId: string }> }
) {
  try {
    const params = await context.params
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
      lessons: module.lessons,
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ moduleId: string }> }
) {
  try {
    const params = await context.params
    const { moduleId } = params
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.courseId) {
      return NextResponse.json(
        { error: 'Title and course are required' },
        { status: 400 }
      )
    }

    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        title: body.title,
        description: body.description || '',
        courseId: body.courseId,
        order: body.order,
      },
      include: {
        course: {
          select: {
            title: true
          }
        },
        lessons: true
      }
    })

    // Transform the response
    const transformedModule = {
      id: updatedModule.id,
      title: updatedModule.title,
      description: updatedModule.description || '',
      order: updatedModule.order,
      courseId: updatedModule.courseId,
      courseTitle: updatedModule.course?.title,
      lessons: updatedModule.lessons,
      createdAt: updatedModule.createdAt.toISOString().split('T')[0],
      updatedAt: updatedModule.updatedAt.toISOString().split('T')[0],
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
  context: { params: Promise<{ moduleId: string }> }
) {
  try {
    const params = await context.params
    const { moduleId } = params

    await prisma.module.delete({
      where: { id: moduleId }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Module ${moduleId} deleted successfully` 
    })
  } catch (error) {
    console.error('Error deleting module:', error)
    return NextResponse.json(
      { error: 'Failed to delete module' },
      { status: 500 }
    )
  }
}