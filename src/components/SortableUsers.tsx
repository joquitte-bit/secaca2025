// 📁 BESTAND: /src/components/SortableUsers.tsx
'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Icons } from './Icons'

interface User {
  id: number
  name: string
  email: string
  role: 'Gebruiker' | 'Beheerder'
  status: 'Actief' | 'Inactief'
  lastLogin: string
  joinDate: string
  department?: string
  phone?: string
}

interface SortableUsersProps {
  user: User
  isSelected: boolean
  onToggleSelection: (userId: number) => void
  onEdit: (user: User) => void
  onToggleStatus: (userId: number) => void
  onDelete: (userId: number) => void
  getStatusColor: (status: string) => string
  getRoleColor: (role: string) => string
}

export function SortableUsers({
  user,
  isSelected,
  onToggleSelection,
  onEdit,
  onToggleStatus,
  onDelete,
  getStatusColor,
  getRoleColor
}: SortableUsersProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: user.id })

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
          {/* Drag Handle - IDENTIEK AAN SortableLesson */}
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
            onChange={() => onToggleSelection(user.id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          
          {/* User Icon */}
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icons.user className="w-5 h-5" />
          </div>
          
          {/* User Content */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-medium text-gray-900">{user.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {user.role}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                {user.status}
              </span>
              {user.department && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  {user.department}
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{user.email}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Icons.calendar className="w-4 h-4" />
                <span>Lid sinds: {user.joinDate}</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center space-x-1">
                <Icons.clock className="w-4 h-4" />
                <span>Laatste login: {user.lastLogin}</span>
              </span>
              {user.phone && (
                <>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center space-x-1">
                    <Icons.phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Actions - IDENTIEK AAN SortableLesson */}
        <div className="flex items-center space-x-2">
          <button 
            className="text-gray-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
            title="Bekijk gebruiker"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
          
          <button 
            onClick={() => onEdit(user)}
            className="text-gray-400 hover:text-green-600 p-2 rounded-lg hover:bg-green-50 transition-colors"
            title="Bewerk gebruiker"
          >
            <Icons.settings className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => onToggleStatus(user.id)}
            className={`p-2 rounded-lg transition-colors ${
              user.status === 'Actief' 
                ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50' 
                : 'text-green-600 hover:text-green-700 hover:bg-green-50'
            }`}
            title={user.status === 'Actief' ? 'Deactiveer gebruiker' : 'Activeer gebruiker'}
          >
            {user.status === 'Actief' ? (
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
            onClick={() => onDelete(user.id)}
            className="text-gray-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
            title="Verwijder gebruiker"
          >
            <Icons.trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}