// src/app/api/courses/[courseId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const params = await context.params
    const { courseId } = params

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: {
            order: 'asc'
          },
          include: {
            lessons: {
              orderBy: {
                order: 'asc'
              }
            }
          }
        },
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Calculate progress and student stats
    const totalEnrollments = course._count.enrollments
    const completedEnrollments = await prisma.enrollment.count({
      where: {
        courseId: courseId,
        completedAt: { not: null }
      }
    })

    const progress = totalEnrollments > 0 ? 
      Math.round((completedEnrollments / totalEnrollments) * 100) : 0

    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0)

    // Transform the response
    const transformedCourse = {
      id: course.id,
      title: course.title,
      status: course.status === 'PUBLISHED' ? 'Actief' : 
              course.status === 'DRAFT' ? 'Concept' : 'Inactief',
      students: totalEnrollments,
      progress: progress,
      lessons: totalLessons,
      description: course.description || '',
      category: '', // Not in your schema
      order: 0, // Not in Course model
      createdAt: course.createdAt.toISOString().split('T')[0],
      updatedAt: course.updatedAt.toISOString().split('T')[0],
      duration: undefined, // Not in your schema
      difficulty: course.level as 'Beginner' | 'Intermediate' | 'Expert' | undefined,
      tags: course.tags ? JSON.parse(course.tags) : undefined
    }

    return NextResponse.json(transformedCourse)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const params = await context.params
    const { courseId } = params
    const body = await request.json()

    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: {
        title: body.title,
        description: body.description || '',
        summary: body.summary || '',
        level: body.difficulty || null,
        tags: body.tags ? JSON.stringify(body.tags) : null,
        status: body.status === 'Actief' ? 'PUBLISHED' : 
                body.status === 'Concept' ? 'DRAFT' : 'ARCHIVED'
      },
      include: {
        modules: {
          include: {
            lessons: true
          }
        }
      }
    })

    // Calculate stats
    const totalLessons = updatedCourse.modules.reduce((acc, module) => acc + module.lessons.length, 0)

    // Transform the response
    const transformedCourse = {
      id: updatedCourse.id,
      title: updatedCourse.title,
      status: updatedCourse.status === 'PUBLISHED' ? 'Actief' : 
              updatedCourse.status === 'DRAFT' ? 'Concept' : 'Inactief',
      students: 0, // You might want to keep this from previous state or recalculate
      progress: 0, // You might want to keep this from previous state or recalculate
      lessons: totalLessons,
      description: updatedCourse.description || '',
      category: '',
      order: 0,
      createdAt: updatedCourse.createdAt.toISOString().split('T')[0],
      updatedAt: updatedCourse.updatedAt.toISOString().split('T')[0],
      duration: undefined,
      difficulty: updatedCourse.level as 'Beginner' | 'Intermediate' | 'Expert' | undefined,
      tags: updatedCourse.tags ? JSON.parse(updatedCourse.tags) : undefined
    }

    return NextResponse.json(transformedCourse)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const params = await context.params
    const { courseId } = params

    await prisma.course.delete({
      where: { id: courseId }
    })

    return NextResponse.json({ 
      success: true, 
      message: `Course ${courseId} deleted successfully` 
    })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}