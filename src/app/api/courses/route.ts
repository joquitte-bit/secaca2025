// src/app/api/courses/route.ts - COMPLEET MET DELETE EN PATCH
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function voor safe number conversion
const safeNumber = (value: any, fallback: number = 0): number => {
  if (value === null || value === undefined || value === '' || isNaN(Number(value))) {
    return fallback
  }
  return Number(value)
}

export async function GET() {
  try {
    console.log('📥 GET /api/courses - Fetching all courses')
    
    const courses = await prisma.course.findMany({
      include: {
        courseModules: {
          include: {
            module: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`📊 Found ${courses.length} courses`)

    const transformedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      status: course.status as 'Concept' | 'Actief' | 'Inactief',
      level: course.level,
      tags: course.tags ? JSON.parse(course.tags) : [],
      slug: course.slug,
      order: safeNumber(course.order),
      duration: safeNumber(course.duration),
      difficulty: course.difficulty as 'Beginner' | 'Intermediate' | 'Expert',
      category: course.category || 'Uncategorized',
      modules: course.courseModules.length,
      enrollments: safeNumber(course.enrollmentCount),
      certificates: safeNumber(course.certificateCount),
      completionRate: safeNumber(course.completionRate),
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      moduleCount: course.courseModules.length
    }))

    console.log('✅ Courses transformed successfully')
    return NextResponse.json(transformedCourses)

  } catch (error: any) {
    console.error('❌ Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses: ' + error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/courses - Creating new course')
    
    const body = await request.json()
    console.log('📦 Request body:', body)

    const {
      title,
      description,
      status = 'Concept',
      level = 'Introductie',
      tags = [],
      slug,
      order = 0,
      duration = 0,
      difficulty = 'Beginner',
      category = 'Uncategorized',
      modules = 0,
      enrollments = 0,
      certificates = 0,
      completionRate = 0
    } = body

    // Validation
    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description and category are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const courseSlug = slug || generateSlug(title)

    // Check if slug already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug: courseSlug }
    })

    if (existingCourse) {
      return NextResponse.json(
        { error: 'Course with this slug already exists' },
        { status: 400 }
      )
    }

    // Get first organization for demo purposes
    const organization = await prisma.organization.findFirst()
    if (!organization) {
      // Create a default organization if none exists
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

    // Create course
    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        status,
        level,
        tags: JSON.stringify(tags),
        slug: courseSlug,
        order: safeNumber(order),
        duration: safeNumber(duration),
        difficulty,
        category,
        moduleCount: safeNumber(modules),
        enrollmentCount: safeNumber(enrollments),
        certificateCount: safeNumber(certificates),
        completionRate: safeNumber(completionRate),
        orgId: org.id
      }
    })

    console.log('✅ Course created successfully:', course.id)

    // Transform response
    const transformedCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      status: course.status as 'Concept' | 'Actief' | 'Inactief',
      level: course.level,
      tags: course.tags ? JSON.parse(course.tags) : [],
      slug: course.slug,
      order: safeNumber(course.order),
      duration: safeNumber(course.duration),
      difficulty: course.difficulty as 'Beginner' | 'Intermediate' | 'Expert',
      category: course.category || 'Uncategorized',
      modules: safeNumber(course.moduleCount),
      enrollments: safeNumber(course.enrollmentCount),
      certificates: safeNumber(course.certificateCount),
      completionRate: safeNumber(course.completionRate),
      createdAt: course.createdAt.toISOString(),
      updatedAt: course.updatedAt.toISOString(),
      moduleCount: safeNumber(course.moduleCount)
    }

    return NextResponse.json(transformedCourse, { status: 201 })

  } catch (error: any) {
    console.error('❌ Error creating course:', error)
    return NextResponse.json(
      { error: 'Failed to create course: ' + error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('✏️ PUT /api/courses - Updating course')
    
    const body = await request.json()
    console.log('📦 Request body:', body)

    const {
      id,
      title,
      description,
      status,
      level,
      tags = [],
      slug,
      order,
      duration,
      difficulty,
      category,
      modules,
      enrollments,
      certificates,
      completionRate
    } = body

    // Validation
    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: 'Title, description and category are required' },
        { status: 400 }
      )
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if slug is being changed and if it's already taken
    if (slug && slug !== existingCourse.slug) {
      const courseWithSlug = await prisma.course.findUnique({
        where: { slug }
      })

      if (courseWithSlug) {
        return NextResponse.json(
          { error: 'Course with this slug already exists' },
          { status: 400 }
        )
      }
    }

    // Update course
    const courseSlug = slug || existingCourse.slug

    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        title: title.trim(),
        description: description.trim(),
        status: status || existingCourse.status,
        level: level || existingCourse.level,
        tags: JSON.stringify(tags),
        slug: courseSlug,
        order: order !== undefined ? safeNumber(order) : existingCourse.order,
        duration: duration !== undefined ? safeNumber(duration) : existingCourse.duration,
        difficulty: difficulty || existingCourse.difficulty,
        category: category || existingCourse.category,
        moduleCount: modules !== undefined ? safeNumber(modules) : existingCourse.moduleCount,
        enrollmentCount: enrollments !== undefined ? safeNumber(enrollments) : existingCourse.enrollmentCount,
        certificateCount: certificates !== undefined ? safeNumber(certificates) : existingCourse.certificateCount,
        completionRate: completionRate !== undefined ? safeNumber(completionRate) : existingCourse.completionRate,
        updatedAt: new Date()
      }
    })

    console.log('✅ Course updated successfully:', updatedCourse.id)

    // Transform response
    const transformedCourse = {
      id: updatedCourse.id,
      title: updatedCourse.title,
      description: updatedCourse.description,
      status: updatedCourse.status as 'Concept' | 'Actief' | 'Inactief',
      level: updatedCourse.level,
      tags: updatedCourse.tags ? JSON.parse(updatedCourse.tags) : [],
      slug: updatedCourse.slug,
      order: safeNumber(updatedCourse.order),
      duration: safeNumber(updatedCourse.duration),
      difficulty: updatedCourse.difficulty as 'Beginner' | 'Intermediate' | 'Expert',
      category: updatedCourse.category || 'Uncategorized',
      modules: safeNumber(updatedCourse.moduleCount),
      enrollments: safeNumber(updatedCourse.enrollmentCount),
      certificates: safeNumber(updatedCourse.certificateCount),
      completionRate: safeNumber(updatedCourse.completionRate),
      createdAt: updatedCourse.createdAt.toISOString(),
      updatedAt: updatedCourse.updatedAt.toISOString(),
      moduleCount: safeNumber(updatedCourse.moduleCount)
    }

    return NextResponse.json(transformedCourse)

  } catch (error: any) {
    console.error('❌ Error updating course:', error)
    return NextResponse.json(
      { error: 'Failed to update course: ' + error.message },
      { status: 500 }
    )
  }
}

// NIEUW: DELETE method voor het verwijderen van courses
export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ DELETE /api/courses - Deleting course')
    
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Delete course
    await prisma.course.delete({
      where: { id }
    })

    console.log('✅ Course deleted successfully:', id)

    return NextResponse.json({ 
      message: 'Course deleted successfully',
      id: id
    })

  } catch (error: any) {
    console.error('❌ Error deleting course:', error)
    return NextResponse.json(
      { error: 'Failed to delete course: ' + error.message },
      { status: 500 }
    )
  }
}

// NIEUW: PATCH method voor status updates
export async function PATCH(request: NextRequest) {
  try {
    console.log('⚡ PATCH /api/courses - Updating course status')
    
    const body = await request.json()
    console.log('📦 Request body:', body)

    const { id, status } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Update only the status
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: {
        status: status,
        updatedAt: new Date()
      }
    })

    console.log('✅ Course status updated successfully:', updatedCourse.id)

    const transformedCourse = {
      id: updatedCourse.id,
      title: updatedCourse.title,
      description: updatedCourse.description,
      status: updatedCourse.status as 'Concept' | 'Actief' | 'Inactief',
      level: updatedCourse.level,
      tags: updatedCourse.tags ? JSON.parse(updatedCourse.tags) : [],
      slug: updatedCourse.slug,
      order: safeNumber(updatedCourse.order),
      duration: safeNumber(updatedCourse.duration),
      difficulty: updatedCourse.difficulty as 'Beginner' | 'Intermediate' | 'Expert',
      category: updatedCourse.category || 'Uncategorized',
      modules: safeNumber(updatedCourse.moduleCount),
      enrollments: safeNumber(updatedCourse.enrollmentCount),
      certificates: safeNumber(updatedCourse.certificateCount),
      completionRate: safeNumber(updatedCourse.completionRate),
      createdAt: updatedCourse.createdAt.toISOString(),
      updatedAt: updatedCourse.updatedAt.toISOString(),
      moduleCount: safeNumber(updatedCourse.moduleCount)
    }

    return NextResponse.json(transformedCourse)

  } catch (error: any) {
    console.error('❌ Error updating course status:', error)
    return NextResponse.json(
      { error: 'Failed to update course status: ' + error.message },
      { status: 500 }
    )
  }
}

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    .substring(0, 100)
}