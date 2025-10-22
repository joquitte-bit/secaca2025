// src/components/ActionButtons.tsx
'use client'

import { Icons } from '@/components/Icons'

interface ActionButtonsProps {
  entity: any
  entityType: 'lesson' | 'module' | 'course' | 'user'
  onEdit: (entity: any) => void
  onDelete: (entity: any) => void
  onView: (entity: any) => void
  onStatusToggle: (entity: any) => void
}

export function ActionButtons({ 
  entity, 
  entityType, 
  onEdit, 
  onDelete, 
  onView, 
  onStatusToggle 
}: ActionButtonsProps) {
  return (
    <div className="flex items-center space-x-2">
      {/* View Button */}
      <button 
        onClick={() => onView(entity)} 
        className="text-gray-600 hover:text-blue-600 transition-colors"
        title="Bekijken"
      >
        <Icons.eye className="w-4 h-4" />
      </button>
      
      {/* Edit Button */}
      <button 
        onClick={() => onEdit(entity)} 
        className="text-gray-600 hover:text-green-600 transition-colors"
        title="Bewerken"
      >
        <Icons.settings className="w-4 h-4" />
      </button>
      
      {/* Status Toggle */}
      <button 
        onClick={() => onStatusToggle(entity)} 
        className={
          entity.status === 'Actief' 
            ? 'text-green-600 hover:text-orange-600 transition-colors' 
            : 'text-gray-400 hover:text-green-600 transition-colors'
        }
        title="Status wijzigen"
      >
        <Icons.power className="w-4 h-4" />
      </button>
      
      {/* Delete Button */}
      <button 
        onClick={() => onDelete(entity)} 
        className="text-gray-600 hover:text-red-600 transition-colors"
        title="Verwijderen"
      >
        <Icons.trash className="w-4 h-4" />
      </button>
    </div>
  )
}