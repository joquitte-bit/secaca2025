// src/app/api/lessons/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient, LessonStatus, LessonType } from '@prisma/client'

const prisma = new PrismaClient()

// Map frontend status naar Prisma enum
const mapStatusToEnum = (status: string): LessonStatus => {
  const statusMap: { [key: string]: LessonStatus } = {
    'Concept': LessonStatus.DRAFT,
    'Actief': LessonStatus.PUBLISHED,
    'Inactief': LessonStatus.ARCHIVED
  }
  return statusMap[status] || LessonStatus.DRAFT
}

// Map Prisma enum naar frontend status
const mapEnumToStatus = (status: LessonStatus): string => {
  const statusMap: { [key: string]: string } = {
    'DRAFT': 'Concept',
    'PUBLISHED': 'Actief',
    'ARCHIVED': 'Inactief'
  }
  return statusMap[status] || 'Concept'
}

// Map frontend type naar Prisma enum
const mapTypeToEnum = (type: string): LessonType => {
  const typeMap: { [key: string]: LessonType } = {
    'Text': LessonType.TEXT,
    'Video': LessonType.VIDEO,
    'Quiz': LessonType.QUIZ,
    'Download': LessonType.DOWNLOAD
  }
  return typeMap[type] || LessonType.TEXT
}

// Map Prisma enum naar frontend type
const mapEnumToType = (type: LessonType): string => {
  const typeMap: { [key: string]: string } = {
    'TEXT': 'Text',
    'VIDEO': 'Video',
    'QUIZ': 'Quiz',
    'DOWNLOAD': 'Download'
  }
  return typeMap[type] || 'Text'
}

// GET alle lessons
export async function GET() {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        modules: {
          include: {
            module: true
          }
        },
        quizQuestions: true
      },
      orderBy: { order: 'asc' }
    })

    // Transform data voor frontend
    const transformedLessons = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      content: lesson.content || '',
      status: mapEnumToStatus(lesson.status),
      category: lesson.category || '',
      difficulty: lesson.difficulty || 'beginner',
      type: mapEnumToType(lesson.type),
      tags: lesson.tags ? JSON.parse(lesson.tags) : [],
      videoUrl: lesson.videoUrl || '',
      order: lesson.order,
      duration: lesson.durationMinutes || 0,
      modules: lesson.modules.length,
      quizQuestions: lesson.quizQuestions.length,
      completionRate: 0,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt,
      moduleCount: lesson.modules.length,
    }))

    return NextResponse.json(transformedLessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: 'Failed to fetch lessons' }, { status: 500 })
  }
}

// POST - Nieuwe lesson aanmaken
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('📝 Creating lesson:', body)
    
    const lesson = await prisma.lesson.create({
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        status: mapStatusToEnum(body.status || 'Concept'),
        category: body.category,
        difficulty: body.difficulty,
        type: mapTypeToEnum(body.type || 'Text'),
        tags: body.tags ? JSON.stringify(body.tags) : '[]',
        videoUrl: body.videoUrl,
        order: body.order || 0,
        durationMinutes: body.duration || 0,
      }
    })
    
    console.log('✅ Lesson created:', lesson.id)
    return NextResponse.json(lesson)
  } catch (error) {
    console.error('❌ Error creating lesson:', error)
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 })
  }
}

// PUT - Lesson bijwerken
export async function PUT(request: Request) {
  try {
    const body = await request.json()
    console.log('📝 Updating lesson:', body)
    
    const updatedLesson = await prisma.lesson.update({
      where: { id: body.id },
      data: {
        title: body.title,
        description: body.description,
        content: body.content,
        status: mapStatusToEnum(body.status),
        category: body.category,
        difficulty: body.difficulty,
        type: mapTypeToEnum(body.type),
        tags: body.tags ? JSON.stringify(body.tags) : '[]',
        videoUrl: body.videoUrl,
        order: body.order,
        durationMinutes: body.duration || 0,
      }
    })
    
    console.log('✅ Lesson updated:', updatedLesson.id)
    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error('❌ Error updating lesson:', error)
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 })
  }
}

// PATCH - Lesson status bijwerken
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    
    const updatedLesson = await prisma.lesson.update({
      where: { id: body.id },
      data: { 
        status: mapStatusToEnum(body.status)
      }
    })
    
    return NextResponse.json(updatedLesson)
  } catch (error) {
    console.error('❌ Error patching lesson:', error)
    return NextResponse.json({ error: 'Failed to update lesson status' }, { status: 500 })
  }
}

// DELETE - Lesson verwijderen
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 })
    }

    await prisma.lesson.delete({
      where: { id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('❌ Error deleting lesson:', error)
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 })
  }
}