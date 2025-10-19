// src/app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: {
          orderBy: {
            order: 'asc'
          },
          include: {
            lessons: true // ← Voeg deze regel toe
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to match your frontend interface
    const transformedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      status: course.status === 'PUBLISHED' ? 'Actief' : course.status === 'DRAFT' ? 'Concept' : 'Inactief',
      students: 0, // You'll need to calculate this from enrollments
      progress: 0, // You'll need to calculate this from enrollments
      lessons: course.modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0), // ← Veilige access
      description: course.description || '',
      category: '', // Not in your schema
      order: 0, // Not in Course model, but in Module model
      createdAt: course.createdAt.toISOString().split('T')[0],
      updatedAt: course.updatedAt.toISOString().split('T')[0],
      duration: undefined, // Not in your schema
      difficulty: course.level as 'Beginner' | 'Intermediate' | 'Expert' | undefined,
      tags: course.tags ? JSON.parse(course.tags) : undefined
    }))

    return NextResponse.json(transformedCourses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    // For demo purposes, using a default orgId
    // In a real app, you'd get this from the authenticated user
    const defaultOrgId = 'default-org-id'

    const newCourse = await prisma.course.create({
      data: {
        orgId: defaultOrgId,
        title: body.title,
        slug: body.title.toLowerCase().replace(/\s+/g, '-'),
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
            lessons: true // ← Ook hier toevoegen voor consistentie
          }
        }
      }
    })

    // Transform the response
    const transformedCourse = {
      id: newCourse.id,
      title: newCourse.title,
      status: newCourse.status === 'PUBLISHED' ? 'Actief' : 
              newCourse.status === 'DRAFT' ? 'Concept' : 'Inactief',
      students: 0,
      progress: 0,
      lessons: newCourse.modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0), // ← Veilige access
      description: newCourse.description || '',
      category: '',
      order: 0,
      createdAt: newCourse.createdAt.toISOString().split('T')[0],
      updatedAt: newCourse.updatedAt.toISOString().split('T')[0],
      duration: undefined,
      difficulty: newCourse.level as 'Beginner' | 'Intermediate' | 'Expert' | undefined,
      tags: newCourse.tags ? JSON.parse(newCourse.tags) : undefined
    }

    return NextResponse.json(transformedCourse, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}