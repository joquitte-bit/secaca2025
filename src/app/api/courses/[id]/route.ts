// src/app/api/courses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const courseId = context.params.id

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        tenant: true,
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const courseId = context.params.id
    const { title, description, price, isPublished } = await request.json()

    const course = await prisma.course.update({
      where: { id: courseId },
      data: {
        title,
        description,
        price: price ? price : null,
        isPublished,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const courseId = context.params.id
    
    await prisma.course.delete({
      where: { id: courseId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}