// src/components/ModuleModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from './Icons'

interface Module {
  id: number
  title: string
  status: 'Actief' | 'Inactief' | 'Concept'
  students: number
  progress: number
  lessons: number
  description: string
  category: string
  order: number
  createdAt: string
  updatedAt: string
  duration?: number
  difficulty?: 'Beginner' | 'Intermediate' | 'Expert'
  tags?: string[]
}

interface ModuleModalProps {
  module: Module | null
  onClose: () => void
  onSave: (data: any) => void
  categories: string[]
}

export function ModuleModal({ module, onClose, onSave, categories }: ModuleModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    status: 'Concept' as 'Actief' | 'Inactief' | 'Concept',
    duration: 0,
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Expert',
    tags: [] as string[],
    order: 0
  })

  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (module) {
      setFormData({
        title: module.title,
        description: module.description,
        category: module.category,
        status: module.status,
        duration: module.duration || 0,
        difficulty: module.difficulty || 'Beginner',
        tags: module.tags || [],
        order: module.order
      })
    } else {
      // Nieuwe module - bepaal volgende order nummer
      setFormData(prev => ({
        ...prev,
        order: categories.length > 0 ? categories.length + 1 : 1
      }))
    }
  }, [module, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const moduleData = {
      ...formData,
      id: module?.id || Date.now(),
      students: module?.students || 0,
      progress: module?.progress || 0,
      lessons: module?.lessons || 0,
      createdAt: module?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }

    onSave(moduleData)
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {module ? 'Bewerk Module' : 'Nieuwe Module'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Icons.logout className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Titel */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Module Titel *
            </label>
            <input
              type="text"
              id="title"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Bijv: Phishing Awareness Training"
            />
          </div>

          {/* Beschrijving */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Beschrijving *
            </label>
            <textarea
              id="description"
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Beschrijf de inhoud en doelstellingen van deze module..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Categorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categorie *
              </label>
              <select
                id="category"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                <option value="">Selecteer een categorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
              >
                <option value="Concept">Concept</option>
                <option value="Actief">Actief</option>
                <option value="Inactief">Inactief</option>
              </select>
            </div>

            {/* Duur */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Geschatte duur (minuten)
              </label>
              <input
                type="number"
                id="duration"
                min="0"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                placeholder="60"
              />
            </div>

            {/* Moeilijkheidsgraad */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Moeilijkheidsgraad
              </label>
              <select
                id="difficulty"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* Volgorde */}
            <div>
              <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
                Weergave Volgorde
              </label>
              <input
                type="number"
                id="order"
                min="1"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Voeg een tag toe..."
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Toevoegen
              </button>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Voorbeeld:</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Titel:</strong> {formData.title || 'Niet ingevuld'}</p>
              <p><strong>Categorie:</strong> {formData.category || 'Niet ingevuld'}</p>
              <p><strong>Status:</strong> 
                <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                  formData.status === 'Actief' ? 'bg-green-100 text-green-800' :
                  formData.status === 'Inactief' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {formData.status || 'Niet ingevuld'}
                </span>
              </p>
              {formData.duration > 0 && <p><strong>Duur:</strong> {formData.duration} minuten</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {module ? 'Bijwerken' : 'Module Aanmaken'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}