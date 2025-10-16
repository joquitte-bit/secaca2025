// src/app/dashboard/courses/[id]/modules/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface Module {
  id: string
  title: string
  description: string | null
  order: number
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  order: number
  duration: number | null
  isFree: boolean
}

export default function CourseModulesPage() {
  const params = useParams()
  const courseId = params.id as string

  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showNewModuleForm, setShowNewModuleForm] = useState(false)
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null)

  useEffect(() => {
    fetchModules()
  }, [courseId])

  const fetchModules = async () => {
    try {
      const response = await fetch(`/api/courses/${courseId}/modules`)
      if (response.ok) {
        const data = await response.json()
        setModules(data)
      }
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createModule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newModuleTitle.trim()) return

    try {
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newModuleTitle,
          description: '',
        }),
      })

      if (response.ok) {
        setNewModuleTitle('')
        setShowNewModuleForm(false)
        fetchModules()
      }
    } catch (error) {
      console.error('Error creating module:', error)
    }
  }

  const handleAddLesson = (moduleId: string) => {
    setSelectedModuleId(selectedModuleId === moduleId ? null : moduleId)
  }

  const handleCloseLessonForm = () => {
    setSelectedModuleId(null)
  }

  const handleLessonCreated = () => {
    setSelectedModuleId(null)
    fetchModules()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Course Modules</h1>
            <p className="text-gray-600">Manage course modules and lessons</p>
          </div>
          <button
            onClick={() => setShowNewModuleForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            New Module
          </button>
        </div>

        {showNewModuleForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">New Module</h3>
            <form onSubmit={createModule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Module Title *
                </label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder="e.g., Phishing Recognition Basics"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Create Module
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewModuleForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {modules.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">No modules created yet</p>
              <button
                onClick={() => setShowNewModuleForm(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
              >
                Create Your First Module
              </button>
            </div>
          ) : (
            modules.map((module) => (
              <div key={module.id} className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        Module {module.order}: {module.title}
                      </h3>
                      {module.description && (
                        <p className="text-gray-600 mt-1">{module.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Edit
                      </button>
                      <button 
                        onClick={() => handleAddLesson(module.id)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Add Lesson
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wide mb-4">
                    Lessons ({module.lessons.length})
                  </h4>
                  
                  {selectedModuleId === module.id && (
                    <div className="mb-6">
                      <LessonCreationForm 
                        moduleId={module.id}
                        courseId={courseId}
                        onCancel={handleCloseLessonForm}
                        onSuccess={handleLessonCreated}
                        nextOrder={module.lessons.length + 1}
                      />
                    </div>
                  )}
                  
                  {module.lessons.length === 0 ? (
                    <p className="text-gray-500 text-sm">No lessons in this module yet</p>
                  ) : (
                    <div className="space-y-3">
                      {module.lessons.map((lesson) => (
                        <div key={lesson.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-500 w-8">#{lesson.order}</span>
                            <span className="font-medium">{lesson.title}</span>
                            {lesson.isFree && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Free
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-4">
                            {lesson.duration && (
                              <span className="text-sm text-gray-500">{lesson.duration} min</span>
                            )}
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              Edit
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// Lesson Creation Form Component
interface LessonCreationFormProps {
  moduleId: string
  courseId: string
  onCancel: () => void
  onSuccess: () => void
  nextOrder: number
}

function LessonCreationForm({ moduleId, courseId, onCancel, onSuccess, nextOrder }: LessonCreationFormProps) {
  const [title, setTitle] = useState('')
  const [duration, setDuration] = useState('')
  const [isFree, setIsFree] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/courses/${courseId}/modules/${moduleId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          duration: duration ? parseInt(duration) : null,
          isFree,
          order: nextOrder,
        }),
      })

      if (response.ok) {
        setTitle('')
        setDuration('')
        setIsFree(false)
        onSuccess()
      }
    } catch (error) {
      console.error('Error creating lesson:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
      <h3 className="text-lg font-semibold text-blue-900 mb-4">Add New Lesson</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-blue-700">
            Lesson Title *
          </label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Introduction to Phishing"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="1"
              className="mt-1 block w-full rounded-md border border-blue-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 30"
            />
          </div>

          <div className="flex items-center">
            <div className="flex items-center h-5 mt-6">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
                checked={isFree}
                onChange={(e) => setIsFree(e.target.checked)}
              />
            </div>
            <label className="ml-2 block text-sm font-medium text-blue-700 mt-6">
              Free lesson
            </label>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Lesson'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}