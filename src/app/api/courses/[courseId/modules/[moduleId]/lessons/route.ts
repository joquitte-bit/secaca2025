import { NextRequest, NextResponse } from 'next/server'

const mockLessons: any[] = []

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  try {
    const params = await context.params
    const { moduleId } = params
    const { title, duration, isFree, order } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const newLesson = {
      id: `les_${Date.now()}`,
      title: title.trim(),
      duration: duration ? parseInt(duration) : null,
      isFree: isFree || false,
      order: order || 1,
      moduleId
    }

    mockLessons.push(newLesson)
    return NextResponse.json(newLesson)
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}