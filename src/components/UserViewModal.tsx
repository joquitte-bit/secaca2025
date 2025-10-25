// src/components/UserViewModal.tsx
'use client'

import { Icons } from './Icons'

interface User {
  id: string
  name: string
  email: string
  role: 'Beheerder' | 'Manager' | 'Cursist'
  status: 'Actief' | 'Inactief' | 'Uitgenodigd'
  image?: string
  organization: string
  enrollments: number
  certificates: number
  quizAttempts: number
  lastLogin: string
  createdAt: string
  updatedAt: string
}

interface UserViewModalProps {
  user: User
  onClose: () => void
  onEdit: () => void
}

export function UserViewModal({ user, onClose, onEdit }: UserViewModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actief': return 'bg-green-100 text-green-800 border border-green-200'
      case 'Inactief': return 'bg-red-100 text-red-800 border border-red-200'
      case 'Uitgenodigd': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Beheerder': return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'Manager': return 'bg-green-100 text-green-800 border border-green-200'
      case 'Cursist': return 'bg-gray-100 text-gray-800 border border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Gebruiker Details
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icons.close className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* User Header */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              {user.image ? (
                <img 
                  src={user.image} 
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <Icons.users className="w-8 h-8 text-gray-500" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Basis Informatie</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Organisatie:</span>
                  <span className="font-medium">{user.organization}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Aangemaakt op:</span>
                  <span className="font-medium">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Laatst bijgewerkt:</span>
                  <span className="font-medium">{formatDate(user.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Laatste login:</span>
                  <span className="font-medium">{formatDate(user.lastLogin)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Statistieken</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cursus inschrijvingen:</span>
                  <span className="font-medium">{user.enrollments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Behaalde certificaten:</span>
                  <span className="font-medium">{user.certificates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Quiz pogingen:</span>
                  <span className="font-medium">{user.quizAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gem. voortgang:</span>
                  <span className="font-medium">-</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recente Activiteit</h4>
            <div className="text-sm text-gray-600">
              <p>Nog geen recente activiteit geregistreerd.</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Sluiten
            </button>
            <button
              onClick={onEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Bewerken
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}