// src/components/users/UserEditor.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '../Icons'

// Lokale User interface
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

interface UserEditorProps {
  user: User | null
  onClose: () => void
  onSave: (userData: any) => Promise<void>
}

export function UserEditor({ user, onClose, onSave }: UserEditorProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Cursist' as 'Beheerder' | 'Manager' | 'Cursist',
    status: 'Actief' as 'Actief' | 'Inactief' | 'Uitgenodigd',
    image: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Cursist',
        status: user.status || 'Actief',
        image: user.image || ''
      })
    } else {
      // Reset form for new user
      setFormData({
        name: '',
        email: '',
        role: 'Cursist',
        status: 'Actief',
        image: ''
      })
    }
    setError(null)
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    
    // Validation
    if (!formData.name.trim()) {
      setError('Naam is verplicht')
      return
    }
    
    if (!formData.email.trim()) {
      setError('Email is verplicht')
      return
    }
    
    if (!formData.email.includes('@')) {
      setError('Voer een geldig email adres in')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await onSave(formData)
      onClose()
    } catch (err) {
      console.error('Error saving user:', err)
      setError(err instanceof Error ? err.message : 'Er is een fout opgetreden bij het opslaan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actief': return 'bg-green-100 text-green-800 border border-green-200'
      case 'Inactief': return 'bg-red-100 text-red-800 border border-red-200'
      case 'Uitgenodigd': return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {user ? 'Gebruiker Bewerken' : 'Nieuwe Gebruiker'}
            </h3>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <Icons.close className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <Icons.shield className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Volledige Naam *
            </label>
            <input
              type="text"
              id="name"
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Bijv: Jan Jansen"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Adres *
            </label>
            <input
              type="email"
              id="email"
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="bijv: jan@bedrijf.nl"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Rol *
            </label>
            <select
              id="role"
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Beheerder' | 'Manager' | 'Cursist' })}
            >
              <option value="Cursist">Cursist</option>
              <option value="Manager">Manager</option>
              <option value="Beheerder">Beheerder</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Beheerder: Volledige toegang • Manager: Beperkte toegang • Cursist: Alleen leren
            </p>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status *
            </label>
            <select
              id="status"
              required
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Actief' | 'Inactief' | 'Uitgenodigd' })}
            >
              <option value="Actief">Actief</option>
              <option value="Inactief">Inactief</option>
              <option value="Uitgenodigd">Uitgenodigd</option>
            </select>
          </div>

          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
              Profielfoto URL
            </label>
            <input
              type="url"
              id="image"
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://voorbeeld.nl/foto.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optioneel: URL naar profielfoto
            </p>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Voorbeeld:</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Naam:</span>
                <span>{formData.name || 'Niet ingevuld'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{formData.email || 'Niet ingevuld'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Rol:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getRoleColor(formData.role)}`}>
                  {formData.role}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(formData.status)}`}>
                  {formData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Bezig...</span>
                </>
              ) : (
                <span>{user ? 'Bijwerken' : 'Aanmaken'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}