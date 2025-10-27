import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import Link from 'next/link'
import { notFound } from 'next/navigation'

interface PageProps {
  params: Promise<{ courseId: string }>
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params
  const user = await getCurrentUser()

  // Haal echte course data op
  const course = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
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
        },
        orderBy: {
          order: 'asc'
        }
      },
      organization: true
    }
  })

  if (!course) {
    notFound()
  }

  // Bereken progress
  let progress = 0
  let totalLessons = 0
  let completedLessons = 0

  if (user) {
    // Tel alle lessons in de course
    course.courseModules.forEach(courseModule => {
      totalLessons += courseModule.module.lessonModules.length
    })

    // Haal completed lessons op
    const completedProgress = await prisma.userLessonProgress.findMany({
      where: {
        userId: user.id,
        completed: true,
        lesson: {
          lessonModules: {
            some: {
              module: {
                courseModules: {
                  some: {
                    courseId: courseId
                  }
                }
              }
            }
          }
        }
      }
    })

    completedLessons = completedProgress.length
    progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>
        
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          {progress}% voltooid ({completedLessons}/{totalLessons} lessen)
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {course.courseModules.map((courseModule, moduleIndex) => {
          const firstLesson = courseModule.module.lessonModules[0]?.lesson
          
          return (
            <div key={courseModule.module.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                    {moduleIndex + 1}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{courseModule.module.title}</h3>
                    <p className="text-sm text-gray-500">
                      {courseModule.module.lessonModules.length} lessen • {courseModule.module.duration} minuten
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {courseModule.module.description}
                    </p>
                  </div>
                </div>
                
                {firstLesson && (
                  <Link 
                    href={`/learn/courses/${courseId}/modules/${courseModule.module.id}/lessons/${firstLesson.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Start Module
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}