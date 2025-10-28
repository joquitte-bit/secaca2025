import LearnSidebar from '@/components/LearnSidebar'
import LessonsNavigator from '@/components/LessonsNavigator'
import CompleteLessonButton from '@/components/CompleteLessonButton'
import Quiz from '@/components/Quiz'
import ReactMarkdown from 'react-markdown'
import { notFound } from 'next/navigation'
import { getCurrentUser } from '@/lib/session'
import { prisma } from '@/lib/prisma'

interface PageProps {
  params: Promise<{
    courseId: string
    moduleId: string 
    lessonId: string
  }>
}

// Helper functie om TipTap JSON content te renderen
function renderTipTapContent(content: any) {
  if (!content.content) return null
  
  const renderNode = (node: any, index: number) => {
    if (node.type === 'heading' && node.attrs?.level) {
      // Gebruik directe HTML elementen in plaats van dynamische tags
      if (node.attrs.level === 1) {
        return (
          <h1 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-4">
            {node.content?.map((textNode: any, textIndex: number) => 
              textNode.text
            )}
          </h1>
        )
      } else if (node.attrs.level === 2) {
        return (
          <h2 key={index} className="text-xl font-semibold text-gray-900 mt-5 mb-3">
            {node.content?.map((textNode: any, textIndex: number) => 
              textNode.text
            )}
          </h2>
        )
      } else {
        return (
          <h3 key={index} className="text-lg font-semibold text-gray-900 mt-4 mb-2">
            {node.content?.map((textNode: any, textIndex: number) => 
              textNode.text
            )}
          </h3>
        )
      }
    }
    
    if (node.type === 'paragraph') {
      return (
        <p key={index} className="text-gray-700 leading-relaxed my-4">
          {node.content?.map((textNode: any, textIndex: number) => 
            textNode.text
          )}
        </p>
      )
    }
    
    if (node.type === 'bulletList') {
      return (
        <ul key={index} className="list-disc list-inside my-4 text-gray-700 space-y-2">
          {node.content?.map((listItem: any, itemIndex: number) => 
            renderNode(listItem, itemIndex)
          )}
        </ul>
      )
    }
    
    if (node.type === 'listItem') {
      return (
        <li key={index} className="text-gray-700">
          {node.content?.map((paragraph: any, paraIndex: number) => 
            renderNode(paragraph, paraIndex)
          )}
        </li>
      )
    }
    
    if (node.type === 'text') {
      return (
        <span key={index} className={node.marks?.some((mark: any) => mark.type === 'bold') ? 'font-semibold' : ''}>
          {node.text}
        </span>
      )
    }
    
    return null
  }
  
  return (
    <div className="prose prose-gray max-w-none">
      {content.content.map((node: any, index: number) => renderNode(node, index))}
    </div>
  )
}

// Helper functie om lesson content te renderen
function renderLessonContent(content: any) {
  if (!content) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg mb-2">
          Deze les heeft nog geen inhoud
        </p>
        <p className="text-gray-400">
          De content wordt binnenkort toegevoegd
        </p>
      </div>
    )
  }

  // Als content een string is
  if (typeof content === 'string') {
    try {
      // Probeer te parsen als JSON
      const parsedContent = JSON.parse(content)
      if (parsedContent.type === 'doc' && parsedContent.content) {
        return renderTipTapContent(parsedContent)
      } else {
        // Als het geen TipTap JSON is, behandel het als markdown
        return <ReactMarkdown>{content}</ReactMarkdown>
      }
    } catch {
      // Als het geen JSON is, behandel het als markdown
      return <ReactMarkdown>{content}</ReactMarkdown>
    }
  }
  
  // Als content al een object is
  if (content.type === 'doc' && content.content) {
    return renderTipTapContent(content)
  }
  
  // Fallback: toon als string
  return (
    <div className="text-gray-700 leading-relaxed">
      {JSON.stringify(content)}
    </div>
  )
}

export default async function LessonPage({ params }: PageProps) {
  const { courseId, moduleId, lessonId } = await params
  const user = await getCurrentUser()

  try {
    // Fetch course with modules
    const course = await prisma.course.findUnique({
      where: { 
        id: courseId 
      },
      include: {
        organization: true,
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
                        description: true,
                        type: true,
                        content: true,
                        order: true,
                        durationMinutes: true,
                        duration: true,
                        status: true,
                        difficulty: true,
                        tags: true,
                        category: true,
                        videoUrl: true,
                        slug: true,
                        createdAt: true,
                        updatedAt: true,
                        orgId: true
                      }
                    }
                  },
                  orderBy: {
                    order: 'asc'
                  }
                }
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    // Fetch module with lessons
    const module = await prisma.module.findUnique({
      where: { 
        id: moduleId 
      },
      include: {
        lessonModules: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                description: true,
                type: true,
                content: true,
                order: true,
                durationMinutes: true,
                duration: true,
                status: true,
                difficulty: true,
                tags: true,
                category: true,
                videoUrl: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
                orgId: true
              }
            }
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    // Fetch lesson directly
    const lesson = await prisma.lesson.findUnique({
      where: { 
        id: lessonId 
      },
      include: {
        quizQuestions: {
          orderBy: {
            order: 'asc'
          }
        }
      }
    })

    // Check if data is valid
    if (!course || !module || !lesson) {
      console.log('Missing data:', { 
        course: !!course, 
        module: !!module, 
        lesson: !!lesson 
      })
      notFound()
    }

    // Fetch lesson progress voor alle lessons in de module
    let lessonProgressMap: Record<string, boolean> = {}
    if (user) {
      try {
        const progressRecords = await prisma.userLessonProgress.findMany({
          where: {
            userId: user.id,
            lessonId: {
              in: module.lessonModules.map(lm => lm.lesson.id)
            }
          }
        })
        
        progressRecords.forEach(progress => {
          lessonProgressMap[progress.lessonId] = progress.completed
        })
      } catch (error) {
        console.error('Error fetching lesson progress:', error)
      }
    }

    // Voeg progress info toe aan lessons
    const courseWithProgress = {
      ...course,
      courseModules: course.courseModules.map(courseModule => ({
        ...courseModule,
        module: {
          ...courseModule.module,
          lessonModules: courseModule.module.lessonModules.map(lessonModule => ({
            ...lessonModule,
            lesson: {
              ...lessonModule.lesson,
              completed: lessonProgressMap[lessonModule.lesson.id] || false
            }
          }))
        }
      }))
    }

    const moduleWithProgress = {
      ...module,
      lessonModules: module.lessonModules.map(lessonModule => ({
        ...lessonModule,
        lesson: {
          ...lessonModule.lesson,
          completed: lessonProgressMap[lessonModule.lesson.id] || false
        }
      }))
    }

    // Fetch current lesson progress
    let currentLessonProgress = { completed: false, progressId: null as string | null }
    if (user) {
      try {
        const progress = await prisma.userLessonProgress.findUnique({
          where: {
            userId_lessonId: {
              userId: user.id,
              lessonId: lessonId
            }
          }
        })
        
        if (progress) {
          currentLessonProgress = {
            completed: progress.completed,
            progressId: progress.id
          }
        }
      } catch (error) {
        console.error('Error fetching lesson progress:', error)
      }
    }

    // Fetch course progress voor de progress bar
    let courseProgress = { progressPercentage: 0, completedLessons: 0, totalLessons: 0 }
    if (user) {
      try {
        // Get all lessons in the course
        const allLessonsInCourse = await prisma.lesson.findMany({
          where: {
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
        })

        // Get completed lessons for this user in this course
        const completedLessons = await prisma.userLessonProgress.findMany({
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

        const totalLessons = allLessonsInCourse.length
        const completedCount = completedLessons.length
        const progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

        courseProgress = {
          progressPercentage,
          completedLessons: completedCount,
          totalLessons
        }
      } catch (error) {
        console.error('Error fetching course progress:', error)
      }
    }

    // Check if lesson has quiz
    const hasQuiz = lesson.quizQuestions && lesson.quizQuestions.length > 0

    // Bepaal volgende les
    const lessons = module.lessonModules.map(lm => lm.lesson)
    const currentLessonIndex = lessons.findIndex(l => l.id === lessonId)
    const hasNextLesson = currentLessonIndex < lessons.length - 1
    const nextLesson = hasNextLesson ? lessons[currentLessonIndex + 1] : null

    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          {/* Left Sidebar */}
          <div className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
            <LearnSidebar 
              course={courseWithProgress}
              currentModuleId={moduleId}
              currentLessonId={lessonId}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-64">
            <div className="p-6">
              {/* Header Section */}
              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {lesson.title || "Les titel"}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {course.title} • {module.title}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-500">
                      {lesson.durationMinutes || lesson.duration || 0} minuten
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${courseProgress.progressPercentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {courseProgress.progressPercentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Middle - Lesson Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Lesson Content Card */}
                  <div className="bg-white rounded-lg shadow-sm">
                    {/* Video Player Section */}
                    <div>
                      {lesson.videoUrl ? (
                        <div className="bg-gray-100 rounded-t-lg overflow-hidden">
                          {lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be') ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${getYouTubeId(lesson.videoUrl)}`}
                              className="w-full h-96"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              title={lesson.title}
                            />
                          ) : (
                            <video
                              controls
                              className="w-full h-96"
                              src={lesson.videoUrl}
                            >
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-gray-100 rounded-t-lg flex items-center justify-center">
                          <div className="text-center text-gray-600">
                            <svg className="w-12 h-12 mx-auto mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <p className="text-sm">Geen video beschikbaar</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Controls */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Transcript
                          </button>
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Bronnen
                          </button>
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Notities
                          </button>
                        </div>
                        
                        {/* Complete Lesson Button - CLIENT COMPONENT */}
<CompleteLessonButton 
  lessonId={lessonId}
  isCompleted={currentLessonProgress.completed}
  nextLesson={nextLesson}
  courseId={courseId}
  moduleId={moduleId}
  hasQuiz={hasQuiz} // ← NIEUW: geef hasQuiz door
/>
                      </div>
                    </div>

                    {/* Lesson Content */}
                    <div className="p-6">
                      {renderLessonContent(lesson.content)}
                    </div>
                  </div>

                  {/* Quiz Section - Toon alleen als de les een quiz heeft */}
                  {hasQuiz && (
                    <div className="bg-white rounded-lg shadow-sm">
                      <div className="p-6 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Test je kennis
                        </h3>
                        <p className="text-gray-600 mt-1 text-sm">
                          Beantwoord de vragen om te controleren of je de lesstof begrepen hebt.
                        </p>
                      </div>
                      <div className="p-6">
                        <Quiz lessonId={lessonId} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Sidebar - Lessons Navigator */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                    <LessonsNavigator 
                      module={moduleWithProgress}
                      currentLessonId={lessonId}
                      courseId={courseId}
                    />
                    
                    {/* Quick Stats */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Voortgang</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Les voltooid:</span>
                          <span className={currentLessonProgress.completed ? "text-green-600 font-medium" : "text-gray-500"}>
                            {currentLessonProgress.completed ? "Ja" : "Nee"}
                          </span>
                        </div>
                        {hasQuiz && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Quiz beschikbaar:</span>
                            <span className="text-blue-600 font-medium">Ja</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Module voortgang:</span>
                          <span className="text-gray-900 font-medium">
                            {Math.round((currentLessonIndex + 1) / lessons.length * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

  } catch (error) {
    console.error('Error loading lesson page:', error)
    notFound()
  }
}

// YouTube ID helper functie
function getYouTubeId(url: string): string {
  if (!url) return ''
  
  const standardMatch = url.match(/[?&]v=([^&#]+)/)
  if (standardMatch) return standardMatch[1]
  
  const shortMatch = url.match(/youtu\.be\/([^?&#]+)/)
  if (shortMatch) return shortMatch[1]
  
  const embedMatch = url.match(/embed\/([^?&#]+)/)
  if (embedMatch) return embedMatch[1]
  
  const mobileMatch = url.match(/m\.youtube\.com\/watch\?v=([^&#]+)/)
  if (mobileMatch) return mobileMatch[1]
  
  return ''
}