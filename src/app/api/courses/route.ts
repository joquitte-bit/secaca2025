// src/app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId') // Geen default value, toon alle courses als geen orgId wordt meegegeven

    const courses = await prisma.course.findMany({
      where: orgId ? { orgId } : {},
      include: {
        modules: {
          include: {
            module: {
              include: {
                lessons: {
                  include: {
                    lesson: true
                  }
                }
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        },
        enrollments: {
          select: {
            id: true,
            progress: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to match frontend interface
    const transformedCourses = courses.map(course => {
      const totalLessons = course.modules.reduce((acc, courseModule) => {
        return acc + (courseModule.module.lessons?.length || 0)
      }, 0)

      const averageProgress = course.enrollments.length > 0 
        ? Math.round(course.enrollments.reduce((acc, enrollment) => acc + enrollment.progress, 0) / course.enrollments.length)
        : 0

      // Map database status to frontend status
      let status: 'Actief' | 'Inactief' | 'Concept' = 'Concept'
      if (course.status === 'PUBLISHED') status = 'Actief'
      if (course.status === 'ARCHIVED') status = 'Inactief'

      // Map database level to frontend difficulty
      let difficulty: 'Beginner' | 'Intermediate' | 'Expert' = 'Beginner'
      if (course.level === 'intermediate') difficulty = 'Intermediate'
      if (course.level === 'expert') difficulty = 'Expert'

      return {
        id: course.id,
        title: course.title,
        description: course.description || '',
        status: status,
        students: course.enrollments.length,
        progress: averageProgress,
        modules: course.modules.length,
        category: course.level || '', // Using level as category for now
        order: 0, // Not in schema, default to 0
        createdAt: course.createdAt.toISOString().split('T')[0],
        updatedAt: course.updatedAt.toISOString().split('T')[0],
        duration: totalLessons, // Use total lessons as duration indicator
        difficulty: difficulty,
        tags: course.tags ? JSON.parse(course.tags) : [],
        includedModules: course.modules.map(cm => cm.moduleId)
      }
    })

    console.log(`✅ [API] ${transformedCourses.length} courses loaded for org ${orgId}`)
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
    
    console.log('🔍 [API] POST course request:', body)

    // Validate required fields
    if (!body.title || !body.orgId) {
      return NextResponse.json(
        { error: 'Title and organization are required' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    // Map frontend status to database status
    let status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' = 'DRAFT'
    if (body.status === 'Actief') status = 'PUBLISHED'
    if (body.status === 'Inactief') status = 'ARCHIVED'

    // Map frontend difficulty to database level
    let level = 'beginner'
    if (body.difficulty === 'Intermediate') level = 'intermediate'
    if (body.difficulty === 'Expert') level = 'expert'

    const createData: any = {
      orgId: body.orgId || 'default-org',
      title: body.title,
      slug: slug,
      description: body.description || '',
      summary: body.summary || '',
      level: level,
      tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : '[]',
      status: status
    }

    const newCourse = await prisma.course.create({
      data: createData
    })

    // Create CourseOnModule relations if moduleIds are provided
    if (body.includedModules && Array.isArray(body.includedModules) && body.includedModules.length > 0) {
      console.log('📚 [API] Connecting modules to new course:', body.includedModules)
      
      const moduleConnections = body.includedModules.map((moduleId: string, index: number) => ({
        courseId: newCourse.id,
        moduleId: moduleId,
        order: index
      }))

      await prisma.courseOnModule.createMany({
        data: moduleConnections
      })
    }

    // Fetch the complete course with all relations for response
    const completeCourse = await prisma.course.findUnique({
      where: { id: newCourse.id },
      include: {
        modules: {
          include: {
            module: {
              include: {
                lessons: {
                  include: {
                    lesson: true
                  }
                }
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        },
        enrollments: {
          select: {
            id: true,
            progress: true
          }
        }
      }
    })

    if (!completeCourse) {
      throw new Error('Failed to fetch created course')
    }

    // Calculate total lessons for duration
    const totalLessons = completeCourse.modules.reduce((acc, courseModule) => {
      return acc + (courseModule.module.lessons?.length || 0)
    }, 0)

    // Calculate average progress
    const averageProgress = completeCourse.enrollments.length > 0 
      ? Math.round(completeCourse.enrollments.reduce((acc, enrollment) => acc + enrollment.progress, 0) / completeCourse.enrollments.length)
      : 0

    // Transform the response
    const transformedCourse = {
      id: completeCourse.id,
      title: completeCourse.title,
      description: completeCourse.description || '',
      status: status === 'PUBLISHED' ? 'Actief' : status === 'DRAFT' ? 'Concept' : 'Inactief',
      students: completeCourse.enrollments.length,
      progress: averageProgress,
      modules: completeCourse.modules.length,
      category: completeCourse.level || '',
      order: 0,
      createdAt: completeCourse.createdAt.toISOString().split('T')[0],
      updatedAt: completeCourse.updatedAt.toISOString().split('T')[0],
      duration: totalLessons,
      difficulty: level === 'intermediate' ? 'Intermediate' : level === 'expert' ? 'Expert' : 'Beginner',
      tags: completeCourse.tags ? JSON.parse(completeCourse.tags) : [],
      includedModules: completeCourse.modules.map(cm => cm.moduleId)
    }

    console.log('✅ [API] Course created successfully:', transformedCourse.title)
    return NextResponse.json(transformedCourse, { status: 201 })
  } catch (error) {
    console.error('❌ [API] Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}