import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const user = await getCurrentUser()
    
    // Voor development, gebruik demo user als er geen is
    const userId = user?.id || 'cmh8laluq0000874a2abur4m2-user'

    const courseId = params.courseId

    console.log('Fetching progress for course:', courseId, 'user:', userId)

    // Eerst: check of de course bestaat
    const course = await prisma.course.findUnique({
      where: { id: courseId },
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

    if (!course) {
      console.log('Course not found:', courseId)
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    console.log('Course found:', course.title)
    console.log('Course modules:', course.courseModules.length)

    // Haal alle lesson IDs op uit deze course
    const allLessonIds: string[] = []
    
    course.courseModules.forEach(courseModule => {
      courseModule.module.lessonModules.forEach(lessonModule => {
        allLessonIds.push(lessonModule.lesson.id)
      })
    })

    console.log('All lesson IDs in course:', allLessonIds)

    // Haal completed lessons op voor deze user
    const completedProgress = await prisma.userLessonProgress.findMany({
      where: {
        userId: userId,
        completed: true,
        lessonId: {
          in: allLessonIds
        }
      }
    })

    console.log('Completed progress records:', completedProgress.length)

    const totalLessons = allLessonIds.length
    const completedCount = completedProgress.length
    const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

    console.log('Progress result:', { totalLessons, completedCount, progressPercentage })

    return NextResponse.json({
      totalLessons,
      completedLessons: completedCount,
      progressPercentage,
      lessons: completedProgress
    })

  } catch (error) {
    console.error('Error fetching course progress:', error)
    return NextResponse.json(
      { 
        totalLessons: 0,
        completedLessons: 0,
        progressPercentage: 0,
        lessons: [],
        error: 'Failed to fetch course progress' 
      },
      { status: 500 }
    )
  }
}