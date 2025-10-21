// 📁 BESTAND: /src/components/LessonModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from './Icons'

interface Module {
  id: string
  title: string
  description?: string
  status?: string
  duration?: number
  category?: string
  lessons?: number
}

interface Lesson {
  id?: string
  title: string
  description: string
  category: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Expert'
  status: 'Actief' | 'Inactief' | 'Concept'
  type: 'Video' | 'Artikel' | 'Quiz' | 'Interactief'
  duration: number
  content?: string
  tags?: string[]
  order?: number
  modules?: Module[]
  moduleIds?: string[]
  createdAt?: string
  updatedAt?: string
  completionRate?: number
}

interface LessonModalProps {
  lesson: Lesson | null
  categories: string[]
  lessonTypes: string[]
  modules: Module[]
  onClose: () => void
  onSave: (lessonData: any) => void
}

export function LessonModal({ lesson, categories, lessonTypes, modules, onClose, onSave }: LessonModalProps) {
  const [formData, setFormData] = useState<Lesson>({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    status: 'Concept',
    type: 'Video',
    duration: 0,
    content: '',
    tags: [],
    order: 0,
    modules: [],
    moduleIds: []
  })

  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        category: lesson.category || '',
        difficulty: lesson.difficulty || 'Beginner',
        status: lesson.status || 'Concept',
        type: lesson.type || 'Video',
        duration: lesson.duration || 0,
        content: lesson.content || '',
        tags: lesson.tags || [],
        order: lesson.order || 0,
        modules: lesson.modules || [],
        moduleIds: lesson.modules?.map(m => m.id) || []
      })
    } else {
      setFormData(prev => ({
        ...prev,
        order: categories.length > 0 ? categories.length + 1 : 1
      }))
    }
  }, [lesson, categories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      const lessonData = {
        ...formData,
        id: lesson?.id || `lesson-${Date.now()}`,
        createdAt: lesson?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        moduleIds: formData.moduleIds || []
      }

      await onSave(lessonData)
      onClose()
    } catch (error) {
      console.error('Error saving lesson:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const toggleModuleSelection = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      moduleIds: prev.moduleIds?.includes(moduleId)
        ? prev.moduleIds.filter(id => id !== moduleId)
        : [...(prev.moduleIds || []), moduleId]
    }))
  }

  // Helper functie voor status kleuren - IDENTIEK AAN COURSEMODAL
  const getStatusColor = (status: string) => {
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

  // Helper functie voor difficulty kleuren - IDENTIEK AAN COURSEMODAL
  const getDifficultyColor = (difficulty: string) => {
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

  // Helper functie voor type kleuren
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Video':
        return 'bg-red-100 text-red-800'
      case 'Artikel':
        return 'bg-blue-100 text-blue-800'
      case 'Quiz':
        return 'bg-purple-100 text-purple-800'
      case 'Interactief':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header - IDENTIEK AAN COURSEMODAL */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {lesson ? 'Les Bewerken' : 'Nieuwe Les'}
            </h3>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <Icons.close className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basis Informatie - IDENTIEKE LAYOUT ALS COURSEMODAL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titel */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Les Titel *
              </label>
              <input
                type="text"
                id="title"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Bijv: Phishing herkennen: 5 rode vlaggen"
              />
            </div>

            {/* Beschrijving */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Beschrijving *
              </label>
              <textarea
                id="description"
                required
                rows={3}
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Beschrijf de inhoud en doelstellingen van deze les..."
              />
            </div>

            {/* Categorie */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categorie *
              </label>
              <select
                id="category"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Selecteer een categorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Type Les */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type Les *
              </label>
              <select
                id="type"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              >
                <option value="">Selecteer type</option>
                {lessonTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
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
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              >
                <option value="Concept">Concept</option>
                <option value="Actief">Actief</option>
                <option value="Inactief">Inactief</option>
              </select>
            </div>

            {/* Moeilijkheidsgraad */}
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
                Moeilijkheidsgraad
              </label>
              <select
                id="difficulty"
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.difficulty || 'Beginner'}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* Duur */}
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Duur (minuten) *
              </label>
              <input
                type="number"
                id="duration"
                required
                min="1"
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                placeholder="15"
              />
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
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          {/* Tags - IDENTIEKE STYLING ALS COURSEMODAL */}
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    disabled={isSubmitting}
                    className="ml-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                disabled={isSubmitting}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Voeg een tag toe..."
              />
              <button
                type="button"
                onClick={addTag}
                disabled={isSubmitting}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Toevoegen
              </button>
            </div>
          </div>

          {/* Module Selectie Sectie - VEREENVoudigde versie van CourseModal */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Modules voor deze Les</h4>
                <p className="text-sm text-gray-600">
                  Selecteer modules waar deze les aan gekoppeld moet worden
                </p>
              </div>
              <div className="text-sm text-gray-600">
                {formData.moduleIds?.length || 0} van {modules.length} modules geselecteerd
              </div>
            </div>

            {/* Modules Lijst - IDENTIEKE STYLING ALS COURSEMODAL */}
            <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Beschikbare modules</span>
                  <span className="text-sm text-gray-500">
                    {modules.length} modules beschikbaar
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {modules.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    Geen modules beschikbaar
                  </div>
                ) : (
                  modules.map(module => (
                    <div key={module.id} className="flex items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.moduleIds?.includes(module.id) || false}
                        onChange={() => toggleModuleSelection(module.id)}
                        disabled={isSubmitting}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-900">
                          {module.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-4 mt-1">
                          {module.category && <span>{module.category}</span>}
                          {module.duration && <span>{module.duration} minuten</span>}
                          {module.lessons && <span>{module.lessons} lessen</span>}
                          {module.status && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(module.status)}`}>
                              {module.status}
                            </span>
                          )}
                        </div>
                        {module.description && (
                          <p className="text-sm text-gray-500 mt-1">{module.description}</p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Les Content */}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Les Content
            </label>
            <textarea
              id="content"
              rows={6}
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Voeg hier de volledige les content toe (tekst, HTML, markdown, etc.)..."
            />
            <p className="text-sm text-gray-500 mt-1">
              Gebruik markdown of HTML voor opmaak van de les content
            </p>
          </div>

          {/* Preview - IDENTIEK AAN COURSEMODAL */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Voorbeeld:</h4>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Titel:</strong> {formData.title || 'Niet ingevuld'}</p>
              <p><strong>Categorie:</strong> {formData.category || 'Niet ingevuld'}</p>
              <p className="flex items-center">
                <strong>Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(formData.status)}`}>
                  {formData.status || 'Niet ingevuld'}
                </span>
              </p>
              <p className="flex items-center">
                <strong>Type:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getTypeColor(formData.type)}`}>
                  {formData.type || 'Niet ingevuld'}
                </span>
              </p>
              <p className="flex items-center">
                <strong>Moeilijkheidsgraad:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getDifficultyColor(formData.difficulty || 'Beginner')}`}>
                  {formData.difficulty || 'Beginner'}
                </span>
              </p>
              <p><strong>Duur:</strong> {formData.duration || 0} minuten</p>
              <p><strong>Aantal modules:</strong> {formData.moduleIds?.length || 0}</p>
            </div>
          </div>

          {/* Actions - IDENTIEK AAN COURSEMODAL */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
            >
              Annuleren
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isSubmitting ? 'Bezig...' : (lesson ? 'Bijwerken' : 'Les Aanmaken')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}