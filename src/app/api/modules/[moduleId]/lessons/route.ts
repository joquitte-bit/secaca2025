// src/app/api/modules/[id]/lessons/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const moduleId = context.params.id

    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(lessons)
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const moduleId = context.params.id
    const { title, content, duration, isFree } = await request.json()

    // Bepaal volgende order nummer
    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: 'desc' }
    })

    const lesson = await prisma.lesson.create({
      data: {
        title,
        content: content || null,
        duration: duration || null,
        isFree: isFree || false,
        order: (lastLesson?.order || 0) + 1,
        moduleId,
      },
    })

    return NextResponse.json(lesson)
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}