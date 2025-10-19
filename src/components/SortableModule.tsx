'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icons } from './Icons'

// Gebruik dezelfde Module interface als in page.tsx
interface Module {
  id: string
  title: string
  description: string
  status: 'Actief' | 'Inactief' | 'Concept'
  category: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  order: number
  tags?: string[]
  students: number
  progress: number
  lessons: any
  createdAt: string
  updatedAt: string
}

interface SortableModuleProps {
  module: Module
  isSelected: boolean
  onToggleSelection: (moduleId: string) => void
  onEdit: (module: Module) => void
  onDelete: (moduleId: string) => void
  getStatusColor: (status: string) => string
  getDifficultyColor: (difficulty: string) => string
  onToggleStatus: (moduleId: string) => void
}

export function SortableModule({ 
  module, 
  isSelected, 
  onToggleSelection, 
  onEdit, 
  onDelete,
  getStatusColor,
  getDifficultyColor,
  onToggleStatus
}: SortableModuleProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // Veilige manier om lessons count te bepalen
  const getLessonsCount = () => {
    if (typeof module.lessons === 'number') {
      return module.lessons
    } else if (Array.isArray(module.lessons)) {
      return module.lessons.length
    } else if (module.lessons && typeof module.lessons === 'object') {
      return 1
    }
    return 0
  }

  const lessonsCount = getLessonsCount()

  // Format date like lessons page
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border-b border-gray-200 transition-all ${
        isDragging ? 'opacity-50 shadow-lg' : 'hover:bg-gray-50'
      } ${isSelected ? 'bg-blue-50' : ''}`}
    >
      <div className="px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 flex-1">
            {/* Drag Handle */}
            <button
              {...attributes}
              {...listeners}
              className="mt-1 text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-grab active:cursor-grabbing"
              title="Slepen om volgorde aan te passen"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
              </svg>
            </button>

            {/* Selectie Checkbox */}
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelection(module.id)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />

            {/* Document Icon */}
            <div className="mt-1 text-gray-400">
              <Icons.document className="w-5 h-5" />
            </div>
            
            <div className="flex-1 min-w-0">
              {/* Eerste rij: Titel, Status, Difficulty */}
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {module.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                  {module.status}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                  {module.difficulty}
                </span>
              </div>
              
              {/* Tweede rij: Beschrijving */}
              <p className="text-gray-600 mb-3">
                {module.description}
              </p>

              {/* Derde rij: Metadata - IDENTIEK AAN LESSONS */}
              <div className="flex items-center space-x-6 text-sm text-gray-500 mb-2">
                <span className="flex items-center space-x-1">
                  <Icons.clock className="w-4 h-4" />
                  <span>{module.duration}min</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icons.modules className="w-4 h-4" />
                  <span>{lessonsCount}modules</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Icons.users className="w-4 h-4" />
                  <span>{module.students}courses</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span>Bijgewerkt: {formatDate(module.updatedAt)}</span>
                </span>
              </div>

              {/* Vierde rij: Tags */}
              {module.tags && module.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {module.tags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                  {module.tags.length > 3 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                      +{module.tags.length - 3} meer
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Actie Iconen - Rechts - IDENTIEK AAN LESSONS */}
          <div className="flex items-center space-x-3 ml-4">
            {/* Voortgang percentage - zoals in lessons */}
            <span className="text-sm font-medium text-gray-700 min-w-12 text-right">
              voltooid
            </span>

            <span className="text-sm font-medium text-gray-700 min-w-8 text-right">
              {module.progress}%
            </span>

            {/* Preview (oog-icoon) */}
            <button
              onClick={() => console.log('Preview module:', module.id)}
              className="text-gray-400 hover:text-blue-600 transition-colors p-1"
              title="Preview"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            {/* Instellingen (tandwiel) */}
            <button
              onClick={() => onEdit(module)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              title="Instellingen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Publicatiestatus - ZELFDE ALS LESSONS: altijd groen vinkje */}
            <button
              onClick={() => onToggleStatus(module.id)}
              className="text-green-500 hover:text-green-700 transition-colors p-1"
              title={module.status === 'Actief' ? 'Gepubliceerd' : 'Niet gepubliceerd'}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>

            {/* Verwijderen (prullenbak) */}
            <button
              onClick={() => onDelete(module.id)}
              className="text-gray-400 hover:text-red-600 transition-colors p-1"
              title="Verwijderen"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}