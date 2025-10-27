import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const courseId = (await params).courseId
    console.log('Debug: Fetching course:', courseId)

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        courseModules: {
          include: {
            module: {
              include: {
                lessonModules: {
                  include: {
                    lesson: {
                      select: {
                        id: true,
                        title: true,
                        order: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    // Format voor betere leesbaarheid
    const formattedCourse = {
      id: course.id,
      title: course.title,
      totalModules: course.courseModules.length,
      totalLessons: course.courseModules.reduce((total: number, cm: any) => 
        total + cm.module.lessonModules.length, 0
      ),
      modules: course.courseModules.map((cm: any) => ({
        id: cm.module.id,
        title: cm.module.title,
        lessons: cm.module.lessonModules.map((lm: any) => ({
          id: lm.lesson.id,
          title: lm.lesson.title,
          order: lm.lesson.order
        }))
      }))
    }

    return NextResponse.json(formattedCourse)

  } catch (error) {
    console.error('Debug course error:', error)
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 })
  }
}