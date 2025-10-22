// Als je de complete component wilt, hier is de gefixte versie:
'use client'

import { Icons } from '@/components/Icons'

interface ViewLessonModalProps {
  lesson: any
  isOpen: boolean
  onClose: () => void
}

export default function ViewLessonModal({ lesson, isOpen, onClose }: ViewLessonModalProps) {
  if (!isOpen || !lesson) return null

  // Safe tags parsing
  const parseTags = (tags: any): string[] => {
    try {
      if (Array.isArray(tags)) return tags
      if (typeof tags === 'string') return JSON.parse(tags)
      return []
    } catch (error) {
      console.error('Error parsing tags:', error)
      return []
    }
  }

  const tagsArray = parseTags(lesson.tags)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Lesson Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icons.close className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.title}</h3>
              <p className="text-gray-600">{lesson.description}</p>
            </div>

            {/* Metadata */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  lesson.status === 'Actief' ? 'bg-green-100 text-green-800' :
                  lesson.status === 'Inactief' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {lesson.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Category:</span>
                <span className="ml-2 text-gray-600">{lesson.category}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Difficulty:</span>
                <span className="ml-2 text-gray-600">{lesson.difficulty}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <span className="ml-2 text-gray-600">{lesson.duration} min</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Type:</span>
                <span className="ml-2 text-gray-600">{lesson.type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Order:</span>
                <span className="ml-2 text-gray-600">{lesson.order}</span>
              </div>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tagsArray.length > 0 ? (
                  tagsArray.map((tag: string, index: number) => (
                    <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">Geen tags</span>
                )}
              </div>
            </div>

            {/* Content Preview */}
            {lesson.content && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Content</h3>
                <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {typeof lesson.content === 'string' 
                      ? lesson.content 
                      : JSON.stringify(lesson.content, null, 2)
                    }
                  </pre>
                </div>
              </div>
            )}

            {/* Video URL */}
            {lesson.videoUrl && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Video URL</h3>
                <a 
                  href={lesson.videoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm break-all"
                >
                  {lesson.videoUrl}
                </a>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sluiten
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}