// src/components/SortableCourse.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icons } from './Icons'

interface Course {
  id: number
  title: string
  status: 'Actief' | 'Inactief' | 'Concept'
  students: number
  progress: number
  modules: number
  description: string
  category: string
  order: number
  createdAt: string
  updatedAt: string
  duration?: number
  difficulty?: 'Beginner' | 'Intermediate' | 'Expert'
  tags?: string[]
}

interface SortableCourseProps {
  course: Course
  isSelected: boolean
  onToggleSelection: (courseId: number) => void
  onEdit: (course: Course) => void
  onToggleStatus: (courseId: number) => void
  onDelete: (courseId: number) => void
  getStatusColor: (status: string) => string
  getDifficultyColor: (difficulty: string) => string
}

export function SortableCourse({
  course,
  isSelected,
  onToggleSelection,
  onEdit,
  onToggleStatus,
  onDelete,
  getStatusColor,
  getDifficultyColor
}: SortableCourseProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: course.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white p-6 hover:bg-gray-50 transition-colors ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isSelected ? 'bg-blue-50 border-blue-200' : ''}`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection(course.id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            onClick={(e) => e.stopPropagation()}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {course.title}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                {course.status}
              </span>
              {course.difficulty && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {course.description}
            </p>

            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Icons.modules className="w-4 h-4" />
                <span>{course.modules} modules</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icons.users className="w-4 h-4" />
                <span>{course.students} studenten</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icons.chart className="w-4 h-4" />
                <span>{course.progress}% voltooid</span>
              </span>
              {course.duration && (
                <span className="flex items-center space-x-1">
                  <Icons.clock className="w-4 h-4" />
                  <span>{course.duration} min</span>
                </span>
              )}
              <span className="text-gray-400">{course.category}</span>
            </div>

            {course.tags && course.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {course.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {tag}
                  </span>
                ))}
                {course.tags.length > 3 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500">
                    +{course.tags.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(course)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Bewerken"
          >
            <Icons.edit className="w-4 h-4" />
          </button>

          <button
            onClick={() => onToggleStatus(course.id)}
            className={`p-2 rounded-lg transition-colors ${
              course.status === 'Actief' 
                ? 'text-green-400 hover:text-green-600 hover:bg-green-50' 
                : 'text-gray-400 hover:text-orange-600 hover:bg-orange-50'
            }`}
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
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Verwijderen"
          >
            <Icons.trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}