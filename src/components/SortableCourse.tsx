// src/components/SortableCourse.tsx
'use client'

import { Icons } from './Icons'

interface Course {
  id: number
  title: string
  description: string
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  status: 'Actief' | 'Inactief' | 'Concept'
  tags: string[]
  includedModules: string[]
  order: number
  students: number
  progress: number
  modules: number
  duration: number
  createdAt: string
  updatedAt: string
}

interface SortableCourseProps {
  course: Course
  isSelected: boolean
  onToggleSelection: (courseId: number) => void
  onEdit: (course: Course) => void
  onToggleStatus: (courseId: number) => void
  onDelete: (courseId: number) => void
}

// Helper functie voor status kleuren
const getStatusColor = (status: 'Actief' | 'Inactief' | 'Concept') => {
  switch (status) {
    case 'Actief':
      return 'bg-green-100 text-green-800'
    case 'Inactief':
      return 'bg-red-100 text-red-800'
    case 'Concept':
      return 'bg-yellow-100 text-yellow-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Helper functie voor difficulty kleuren
const getDifficultyColor = (difficulty: 'Beginner' | 'Intermediate' | 'Expert') => {
  switch (difficulty) {
    case 'Beginner':
      return 'bg-green-100 text-green-800'
    case 'Intermediate':
      return 'bg-blue-100 text-blue-800'
    case 'Expert':
      return 'bg-purple-100 text-purple-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function SortableCourse({
  course,
  isSelected,
  onToggleSelection,
  onEdit,
  onToggleStatus,
  onDelete
}: SortableCourseProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`
    }
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}u ${mins}min` : `${hours}u`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection(course.id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
          />

          {/* Course Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-medium text-gray-900">{course.title}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                {course.status}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                {course.difficulty}
              </span>
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {course.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center space-x-1">
                <Icons.book className="w-4 h-4" />
                <span>{course.modules} modules</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icons.clock className="w-4 h-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icons.users className="w-4 h-4" />
                <span>{course.students} studenten</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icons.chart className="w-4 h-4" />
                <span>{course.progress}% voltooid</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                {course.category}
              </span>
              {course.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {tag}
                </span>
              ))}
              {course.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                  +{course.tags.length - 3} meer
                </span>
              )}
            </div>

            {/* Dates */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Aangemaakt: {formatDate(course.createdAt)}</span>
              <span>Bijgewerkt: {formatDate(course.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(course)}
            className="text-gray-400 hover:text-blue-600 transition-colors p-2"
            title="Bewerken"
          >
            <Icons.edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleStatus(course.id)}
            className="text-gray-400 hover:text-green-600 transition-colors p-2"
            title={course.status === 'Actief' ? 'Deactiveren' : 'Activeren'}
          >
            {course.status === 'Actief' ? (
              <Icons.pause className="w-4 h-4" />
            ) : (
              <Icons.play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onDelete(course.id)}
            className="text-gray-400 hover:text-red-600 transition-colors p-2"
            title="Verwijderen"
          >
            <Icons.trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}