// src/app/api/lessons/route.ts - COMPLEET MET DELETE EN STATUS UPDATE
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, LessonStatus } from '@prisma/client'

const prisma = new PrismaClient()

const safeNumber = (value: any, fallback: number = 0): number => {
  if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
    return fallback
  }
  return Number(value)
}

// Helper functie om frontend status naar Prisma enum te converteren
const mapStatusToPrisma = (status: string): LessonStatus => {
  switch (status) {
    case 'Actief':
      return LessonStatus.PUBLISHED
    case 'Concept':
      return LessonStatus.DRAFT
    case 'Inactief':
      return LessonStatus.ARCHIVED
    default:
      return LessonStatus.DRAFT
  }
}

// Helper functie om Prisma enum naar frontend status te converteren
const mapStatusFromPrisma = (status: LessonStatus): string => {
  switch (status) {
    case LessonStatus.PUBLISHED:
      return 'Actief'
    case LessonStatus.DRAFT:
      return 'Concept'
    case LessonStatus.ARCHIVED:
      return 'Inactief'
    default:
      return 'Concept'
  }
}

export async function GET() {
  try {
    console.log('📥 GET /api/lessons - Fetching all lessons')
    
    const lessons = await prisma.lesson.findMany({
      include: {
        lessonModules: {
          include: {
            module: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📊 Found ${lessons.length} lessons`)

    const transformedLessons = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      status: mapStatusFromPrisma(lesson.status),
      level: 'Introductie',
      tags: lesson.tags ? JSON.parse(lesson.tags) : [],
      slug: lesson.id,
      order: safeNumber(lesson.order),
      duration: safeNumber(lesson.durationMinutes),
      difficulty: lesson.difficulty as 'Beginner' | 'Intermediate' | 'Expert',
      category: lesson.category || 'Uncategorized',
      modules: lesson.lessonModules.length,
      enrollments: 0,
      certificates: 0,
      completionRate: 0,
      type: lesson.type,
      videoUrl: lesson.videoUrl || '',
      createdAt: lesson.createdAt.toISOString(),
      updatedAt: lesson.updatedAt.toISOString(),
      moduleCount: lesson.lessonModules.length
    }))

    console.log('✅ Lessons transformed successfully')
    return NextResponse.json(transformedLessons)

  } catch (error: any) {
    console.error('❌ Error fetching lessons:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons: ' + error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/lessons - Creating new lesson')
    
    const body = await request.json()
    console.log('📦 Request body:', body)

    const {
      title,
      description = '',
      content = '',
      status = 'Concept',
      tags = [],
      order = 0,
      duration = 0,
      difficulty = 'Beginner',
      category = 'Uncategorized',
      type = 'TEXT',
      videoUrl = ''
    } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const organization = await prisma.organization.findFirst()
    if (!organization) {
      const defaultOrg = await prisma.organization.create({
        data: {
          name: 'Default Organization',
          slug: 'default-org'
        }
      })
      console.log('✅ Created default organization:', defaultOrg.id)
    }

    const org = organization || await prisma.organization.findFirst()
    if (!org) {
      return NextResponse.json(
        { error: 'No organization available' },
        { status: 400 }
      )
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        content: content.trim(),
        status: mapStatusToPrisma(status),
        tags: JSON.stringify(tags),
        order: safeNumber(order),
        durationMinutes: safeNumber(duration),
        difficulty,
        category,
        type: type as any,
        videoUrl: videoUrl.trim(),
        orgId: org.id
      }
    })

    console.log('✅ Lesson created successfully:', lesson.id)

    const transformedLesson = {
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      status: mapStatusFromPrisma(lesson.status),
      level: 'Introductie',
      tags: lesson.tags ? JSON.parse(lesson.tags) : [],
      slug: lesson.id,
      order: safeNumber(lesson.order),
      duration: safeNumber(lesson.durationMinutes),
      difficulty: lesson.difficulty as 'Beginner' | 'Intermediate' | 'Expert',
      category: lesson.category || 'Uncategorized',
      modules: 0,
      enrollments: 0,
      certificates: 0,
      completionRate: 0,
      type: lesson.type,
      videoUrl: lesson.videoUrl || '',
      createdAt: lesson.createdAt.toISOString(),
      updatedAt: lesson.updatedAt.toISOString(),
      moduleCount: 0
    }

    return NextResponse.json(transformedLesson, { status: 201 })

  } catch (error: any) {
    console.error('❌ Error creating lesson:', error)
    return NextResponse.json(
      { error: 'Failed to create lesson: ' + error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('✏️ PUT /api/lessons - Updating lesson')
    
    const body = await request.json()
    console.log('📦 Request body:', body)

    const {
      id,
      title,
      description,
      content,
      status,
      tags = [],
      order,
      duration,
      difficulty,
      category,
      type,
      videoUrl
    } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      )
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const existingLesson = await prisma.lesson.findUnique({
      where: { id }
    })

    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description !== undefined ? description.trim() : existingLesson.description,
        content: content !== undefined ? content.trim() : existingLesson.content,
        status: status ? mapStatusToPrisma(status) : existingLesson.status,
        tags: JSON.stringify(tags),
        order: order !== undefined ? safeNumber(order) : existingLesson.order,
        durationMinutes: duration !== undefined ? safeNumber(duration) : existingLesson.durationMinutes,
        difficulty: difficulty || existingLesson.difficulty,
        category: category || existingLesson.category,
        type: type || existingLesson.type,
        videoUrl: videoUrl !== undefined ? videoUrl.trim() : existingLesson.videoUrl,
        updatedAt: new Date()
      }
    })

    console.log('✅ Lesson updated successfully:', updatedLesson.id)

    const transformedLesson = {
      id: updatedLesson.id,
      title: updatedLesson.title,
      description: updatedLesson.description || '',
      content: updatedLesson.content || '',
      status: mapStatusFromPrisma(updatedLesson.status),
      level: 'Introductie',
      tags: updatedLesson.tags ? JSON.parse(updatedLesson.tags) : [],
      slug: updatedLesson.id,
      order: safeNumber(updatedLesson.order),
      duration: safeNumber(updatedLesson.durationMinutes),
      difficulty: updatedLesson.difficulty as 'Beginner' | 'Intermediate' | 'Expert',
      category: updatedLesson.category || 'Uncategorized',
      modules: 0,
      enrollments: 0,
      certificates: 0,
      completionRate: 0,
      type: updatedLesson.type,
      videoUrl: updatedLesson.videoUrl || '',
      createdAt: updatedLesson.createdAt.toISOString(),
      updatedAt: updatedLesson.updatedAt.toISOString(),
      moduleCount: 0
    }

    return NextResponse.json(transformedLesson)

  } catch (error: any) {
    console.error('❌ Error updating lesson:', error)
    return NextResponse.json(
      { error: 'Failed to update lesson: ' + error.message },
      { status: 500 }
    )
  }
}

// NIEUW: DELETE method voor het verwijderen van lessons
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ DELETE /api/lessons - Deleting lesson')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      )
    }

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id }
    })

    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Delete lesson
    await prisma.lesson.delete({
      where: { id }
    })

    console.log('✅ Lesson deleted successfully:', id)

    return NextResponse.json({ 
      message: 'Lesson deleted successfully',
      id: id
    })

  } catch (error: any) {
    console.error('❌ Error deleting lesson:', error)
    return NextResponse.json(
      { error: 'Failed to delete lesson: ' + error.message },
      { status: 500 }
    )
  }
}

// NIEUW: PATCH method voor status updates
export async function PATCH(request: NextRequest) {
  try {
    console.log('⚡ PATCH /api/lessons - Updating lesson status')
    
    const body = await request.json()
    console.log('📦 Request body:', body)

    const { id, status } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id }
    })

    if (!existingLesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Update only the status
    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: {
        status: mapStatusToPrisma(status),
        updatedAt: new Date()
      }
    })

    console.log('✅ Lesson status updated successfully:', updatedLesson.id)

    const transformedLesson = {
      id: updatedLesson.id,
      title: updatedLesson.title,
      description: updatedLesson.description || '',
      content: updatedLesson.content || '',
      status: mapStatusFromPrisma(updatedLesson.status),
      level: 'Introductie',
      tags: updatedLesson.tags ? JSON.parse(updatedLesson.tags) : [],
      slug: updatedLesson.id,
      order: safeNumber(updatedLesson.order),
      duration: safeNumber(updatedLesson.durationMinutes),
      difficulty: updatedLesson.difficulty as 'Beginner' | 'Intermediate' | 'Expert',
      category: updatedLesson.category || 'Uncategorized',
      modules: 0,
      enrollments: 0,
      certificates: 0,
      completionRate: 0,
      type: updatedLesson.type,
      videoUrl: updatedLesson.videoUrl || '',
      createdAt: updatedLesson.createdAt.toISOString(),
      updatedAt: updatedLesson.updatedAt.toISOString(),
      moduleCount: 0
    }

    return NextResponse.json(transformedLesson)

  } catch (error: any) {
    console.error('❌ Error updating lesson status:', error)
    return NextResponse.json(
      { error: 'Failed to update lesson status: ' + error.message },
      { status: 500 }
    )
  }
}