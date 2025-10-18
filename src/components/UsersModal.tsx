// 📁 BESTAND: /src/components/UsersModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from './Icons'

interface User {
  id?: number
  name: string
  email: string
  role: 'Gebruiker' | 'Beheerder'
  status: 'Actief' | 'Inactief'
  department?: string
  phone?: string
  lastLogin?: string
  joinDate?: string
}

interface UsersModalProps {
  user: User | null
  departments: string[]
  onClose: () => void
  onSave: (userData: any) => void
}

export function UsersModal({ user, departments, onClose, onSave }: UsersModalProps) {
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    role: 'Gebruiker',
    status: 'Actief',
    department: '',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0]
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || 'Gebruiker',
        status: user.status || 'Actief',
        department: user.department || '',
        phone: user.phone || '',
        lastLogin: user.lastLogin,
        joinDate: user.joinDate || new Date().toISOString().split('T')[0]
      })
    } else {
      // Nieuwe gebruiker - standaardwaarden
      setFormData(prev => ({
        ...prev,
        joinDate: new Date().toISOString().split('T')[0],
        status: 'Actief',
        role: 'Gebruiker'
      }))
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const userData = {
        ...formData,
        id: user?.id || Date.now(),
        lastLogin: user?.lastLogin || null
      }

      await onSave(userData)
      onClose()
    } catch (error) {
      console.error('Error saving user:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {user ? 'Gebruiker Bewerken' : 'Nieuwe Gebruiker'}
            </h3>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <Icons.close className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Persoonlijke Informatie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Naam */}
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Volledige Naam *
              </label>
              <input
                type="text"
                id="name"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Bijv: Jan Jansen"
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Adres *
              </label>
              <input
                type="email"
                id="email"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="bijv: jan@bedrijf.nl"
              />
            </div>

            {/* Afdeling */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                Afdeling
              </label>
              <select
                id="department"
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="">Selecteer afdeling</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Telefoon */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefoonnummer
              </label>
              <input
                type="tel"
                id="phone"
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+31 6 12345678"
              />
            </div>

            {/* Rol */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Rol *
              </label>
              <select
                id="role"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Gebruiker' | 'Beheerder' })}
              >
                <option value="Gebruiker">Gebruiker</option>
                <option value="Beheerder">Beheerder</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                id="status"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Actief' | 'Inactief' })}
              >
                <option value="Actief">Actief</option>
                <option value="Inactief">Inactief</option>
              </select>
            </div>

            {/* Lid sinds */}
            <div>
              <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-2">
                Lid sinds
              </label>
              <input
                type="date"
                id="joinDate"
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Voorbeeld:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Naam:</strong> {formData.name || 'Niet ingevuld'}</p>
              <p><strong>Email:</strong> {formData.email || 'Niet ingevuld'}</p>
              <p><strong>Rol:</strong> 
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                  formData.role === 'Beheerder' 
                    ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  {formData.role || 'Niet ingevuld'}
                </span>
              </p>
              <p><strong>Status:</strong> 
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                  formData.status === 'Actief' 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  {formData.status || 'Niet ingevuld'}
                </span>
              </p>
              <p><strong>Afdeling:</strong> {formData.department || 'Niet toegewezen'}</p>
              <p><strong>Lid sinds:</strong> {formData.joinDate || 'Niet ingevuld'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isSubmitting ? 'Bezig...' : (user ? 'Bijwerken' : 'Gebruiker Aanmaken')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}