// 📁 BESTAND: /src/components/SortableLesson.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icons } from './Icons'

interface Lesson {
  id: number
  title: string
  status: 'Actief' | 'Inactief' | 'Concept'
  description: string
  category: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  type: 'Video' | 'Artikel' | 'Quiz' | 'Interactief'
  order: number
  tags?: string[]
  includedInModules: number
  includedInCourses: number
  completionRate: number
  createdAt: string
  updatedAt: string
}

interface SortableLessonProps {
  lesson: Lesson
  isSelected: boolean
  onToggleSelection: (lessonId: number) => void
  onEdit: (lesson: Lesson) => void
  onToggleStatus: (lessonId: number) => void
  onDelete: (lessonId: number) => void
  getStatusColor: (status: string) => string
  getDifficultyColor: (difficulty: string) => string
  getTypeColor: (type: string) => string
}

export function SortableLesson({
  lesson,
  isSelected,
  onToggleSelection,
  onEdit,
  onToggleStatus,
  onDelete,
  getStatusColor,
  getDifficultyColor,
  getTypeColor
}: SortableLessonProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`px-6 py-4 hover:bg-gray-50 transition-colors ${
        isDragging ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
            title="Sleep om volgorde aan te passen"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
          </div>

          {/* Selection Checkbox */}
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelection(lesson.id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          
          {/* Lesson Icon */}
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icons.lessons className="w-5 h-5" />
          </div>
          
          {/* Lesson Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-medium text-gray-900">{lesson.title}</h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                {lesson.status}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {lesson.category}
              </span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(lesson.type)}`}>
                {lesson.type}
              </span>
              {lesson.difficulty && (
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                  {lesson.difficulty}
                </span>
              )}
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Volgorde: {lesson.order}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{lesson.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Icons.clock className="w-4 h-4" />
                <span>{lesson.duration} min</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icons.modules className="w-4 h-4" />
                <span>{lesson.includedInModules} modules</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icons.courses className="w-4 h-4" />
                <span>{lesson.includedInCourses} courses</span>
              </span>
              <span className="text-gray-400">Bijgewerkt: {lesson.updatedAt}</span>
            </div>
            
            {lesson.tags && lesson.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {lesson.tags.map((tag: string) => (
                  <span key={tag} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Completion Rate */}
          <div className="text-right min-w-[80px]">
            <div className="text-lg font-semibold text-gray-900">{lesson.completionRate}%</div>
            <div className="text-sm text-gray-500">voltooid</div>
            <div className="w-24 mt-1">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full bg-gray-900 transition-all duration-500"
                  style={{ width: `${lesson.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => window.open(`/dashboard/lessons/${lesson.id}`, '_blank')}
              className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
              title="Bekijk les"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            
            <button 
              onClick={() => onEdit(lesson)}
              className="text-gray-600 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors"
              title="Bewerk les"
            >
              <Icons.settings className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => onToggleStatus(lesson.id)}
              className={`p-2 rounded-lg transition-colors ${
                lesson.status === 'Actief' 
                  ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' 
                  : 'text-green-600 hover:text-green-700 hover:bg-green-50'
              }`}
              title={lesson.status === 'Actief' ? 'Deactiveer les' : 'Activeer les'}
            >
              {lesson.status === 'Actief' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
            
            <button 
              onClick={() => onDelete(lesson.id)}
              className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
              title="Verwijder les"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}