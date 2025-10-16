import { NextRequest, NextResponse } from 'next/server'

const mockModules: any[] = []

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const courseId = params.id

    console.log('Fetching modules for course:', courseId)
    return NextResponse.json(mockModules)
  } catch (error) {
    console.error('Error fetching modules:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const courseId = params.id
    const { title, description } = await request.json()

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    }

    const newModule = {
      id: `mod_${Date.now()}`,
      title: title.trim(),
      description: description?.trim() || '',
      order: mockModules.length + 1,
      lessons: [],
      courseId
    }

    mockModules.push(newModule)
    return NextResponse.json(newModule)
  } catch (error) {
    console.error('Error creating module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}