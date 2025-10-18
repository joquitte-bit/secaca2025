// src/app/api/courses/[courseId]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  try {
    const params = await context.params
    const { courseId } = params

    // Simuleer course data - later vervangen door database call
    const course = {
      id: courseId,
      title: `Course ${courseId}`,
      description: `Description for course ${courseId}`,
      isPublished: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Course not found' },
      { status: 404 }
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

    // Simuleer het updaten van een course
    const updatedCourse = {
      id: courseId,
      title: body.title,
      description: body.description,
      isPublished: body.isPublished,
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json(updatedCourse)
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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

    // Simuleer het verwijderen van een course
    return NextResponse.json({ 
      success: true, 
      message: `Course ${courseId} deleted successfully` 
    })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}