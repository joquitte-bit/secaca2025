import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        courseModules: {
          include: {
            module: {
              include: {
                lessonModules: {
                  include: {
                    lesson: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      courses: courses.map(course => ({
        id: course.id,
        title: course.title,
        modules: course.courseModules.length,
        lessons: course.courseModules.reduce((total, cm) => 
          total + cm.module.lessonModules.length, 0
        )
      }))
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}