// src/app/api/courses/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId') || 'default-org'

    const courses = await prisma.course.findMany({
      where: { orgId },
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
        duration: undefined,
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
      data: createData,
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
          }
        },
        enrollments: true
      }
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

      // Reload course with updated modules
      const updatedCourse = await prisma.course.findUnique({
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
          enrollments: true
        }
      })

      // Transform the response
      const totalLessons = updatedCourse!.modules.reduce((acc, courseModule) => {
        return acc + (courseModule.module.lessons?.length || 0)
      }, 0)

      const transformedCourse = {
        id: updatedCourse!.id,
        title: updatedCourse!.title,
        description: updatedCourse!.description || '',
        status: status === 'PUBLISHED' ? 'Actief' : status === 'DRAFT' ? 'Concept' : 'Inactief',
        students: updatedCourse!.enrollments.length,
        progress: 0,
        modules: updatedCourse!.modules.length,
        category: updatedCourse!.level || '',
        order: 0,
        createdAt: updatedCourse!.createdAt.toISOString().split('T')[0],
        updatedAt: updatedCourse!.updatedAt.toISOString().split('T')[0],
        duration: undefined,
        difficulty: level === 'intermediate' ? 'Intermediate' : level === 'expert' ? 'Expert' : 'Beginner',
        tags: updatedCourse!.tags ? JSON.parse(updatedCourse!.tags) : [],
        includedModules: updatedCourse!.modules.map(cm => cm.moduleId)
      }

      return NextResponse.json(transformedCourse, { status: 201 })
    }

    // Transform the response for course without modules
    const transformedCourse = {
      id: newCourse.id,
      title: newCourse.title,
      description: newCourse.description || '',
      status: status === 'PUBLISHED' ? 'Actief' : status === 'DRAFT' ? 'Concept' : 'Inactief',
      students: 0,
      progress: 0,
      modules: 0,
      category: newCourse.level || '',
      order: 0,
      createdAt: newCourse.createdAt.toISOString().split('T')[0],
      updatedAt: newCourse.updatedAt.toISOString().split('T')[0],
      duration: undefined,
      difficulty: level === 'intermediate' ? 'Intermediate' : level === 'expert' ? 'Expert' : 'Beginner',
      tags: newCourse.tags ? JSON.parse(newCourse.tags) : [],
      includedModules: []
    }

    return NextResponse.json(transformedCourse, { status: 201 })
  } catch (error) {
    console.error('❌ [API] Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    )
  }
}