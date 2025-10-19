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
    const transformedModules = modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description || '',
      order: module.order,
      courseId: module.courseId,
      courseTitle: module.course?.title,
      lessons: module.lessons,
      createdAt: module.createdAt.toISOString().split('T')[0],
      updatedAt: module.updatedAt.toISOString().split('T')[0],
    }))

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

    const newModule = await prisma.module.create({
      data: {
        courseId: body.courseId,
        title: body.title,
        description: body.description || '',
        order: nextOrder,
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
      id: newModule.id,
      title: newModule.title,
      description: newModule.description || '',
      order: newModule.order,
      courseId: newModule.courseId,
      courseTitle: newModule.course?.title,
      lessons: newModule.lessons,
      createdAt: newModule.createdAt.toISOString().split('T')[0],
      updatedAt: newModule.updatedAt.toISOString().split('T')[0],
    }

    return NextResponse.json(transformedModule, { status: 201 })
  } catch (error) {
    console.error('Error creating module:', error)
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    )
  }
}