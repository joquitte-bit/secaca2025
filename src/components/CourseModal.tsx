// src/components/CourseModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from './Icons'

interface Module {
  id: string
  title: string
  description?: string
  duration?: number
  difficulty?: string
  category?: string
  status?: string
  lessons?: number
  order?: number
  tags?: string[]
}

interface Course {
  id?: string
  title: string
  description: string
  summary: string
  status: 'Concept' | 'Actief' | 'Inactief'
  level: string
  tags: string[]
  slug: string
  order: number
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  category: string
  includedModules?: string[]
  orgId?: string
}

interface CourseModalProps {
  course: Course | null
  levels: string[]
  onClose: () => void
  onSave: (course: Course) => void
}

export function CourseModal({ course, levels, onClose, onSave }: CourseModalProps) {
  const [title, setTitle] = useState(course?.title || '')
  const [description, setDescription] = useState(course?.description || '')
  const [summary, setSummary] = useState(course?.summary || '')
  const [status, setStatus] = useState<'Concept' | 'Actief' | 'Inactief'>(course?.status || 'Concept')
  const [level, setLevel] = useState(course?.level || levels[0] || '')
  const [slug, setSlug] = useState(course?.slug || '')
  const [order, setOrder] = useState(course?.order || 1)
  const [duration, setDuration] = useState(course?.duration || 0)
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Expert'>(course?.difficulty || 'Beginner')
  const [category, setCategory] = useState(course?.category || '')
  const [tags, setTags] = useState<string[]>(course?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [modules, setModules] = useState<Module[]>([])
  const [includedModules, setIncludedModules] = useState<string[]>(course?.includedModules || [])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Haal modules op bij het openen van de modal
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/modules')
        if (response.ok) {
          const data = await response.json()
          console.log('📚 Modules fetched:', data)
          setModules(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Error fetching modules:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchModules()
  }, [])

  // Haal gekoppelde modules op bij bewerken
  useEffect(() => {
    const fetchCourseModules = async () => {
      if (course?.id) {
        try {
          console.log('🔍 Fetching modules for course:', course.id)
          const response = await fetch(`/api/courses/${course.id}/modules`)
          if (response.ok) {
            const courseData = await response.json()
            console.log('📚 Loaded course modules:', courseData)
            // Update de includedModules met de daadwerkelijk gekoppelde modules
            if (Array.isArray(courseData)) {
              setIncludedModules(courseData.map((courseModule: any) => courseModule.moduleId))
            }
          }
        } catch (error) {
          console.error('Error fetching course modules:', error)
        }
      }
    }

    fetchCourseModules()
  }, [course?.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // 📍 GEBRUIK EEN ECHTE ORGANIZATION ID - vervang met een ID uit Prisma Studio
      const orgId = course?.orgId || 'cmgy9he28000487zak1dq4e0t'
      
      const courseData: Course = {
        id: course?.id,
        title,
        description,
        summary,
        status,
        level,
        tags,
        slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
        order,
        duration,
        difficulty,
        category: level, // Gebruik level als category voor consistentie
        includedModules,
        orgId: orgId
      }

      console.log('💾 Saving course data:', courseData)
      console.log('🏢 Using orgId:', orgId)
      
      await onSave(courseData)
      console.log('✅ Course saved to database:', courseData)
    } catch (error) {
      console.error('❌ Error saving course:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleModule = (moduleId: string) => {
    setIncludedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()])
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove))
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Helper functie voor status kleuren
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actief': return 'bg-green-100 text-green-800'
      case 'Inactief': return 'bg-red-100 text-red-800'
      case 'Concept': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Helper functie voor difficulty kleuren
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-blue-100 text-blue-800'
      case 'Expert': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Bereken totale duur van geselecteerde modules
  const totalDuration = modules
    .filter(module => includedModules.includes(module.id))
    .reduce((total, module) => total + (module.duration || 0), 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {course ? 'Course Bewerken' : 'Nieuwe Course'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
              disabled={isSubmitting}
            >
              <Icons.close className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titel */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titel *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Course titel"
                disabled={isSubmitting}
              />
            </div>

            {/* Beschrijving */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Beschrijving
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Course beschrijving"
                disabled={isSubmitting}
              />
            </div>

            {/* Samenvatting */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Samenvatting
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Korte samenvatting"
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Niveau */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {levels.map(lvl => (
                    <option key={lvl} value={lvl}>{lvl}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <option value="Concept">Concept</option>
                  <option value="Actief">Actief</option>
                  <option value="Inactief">Inactief</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {/* Duur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duur (minuten)
                </label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  min="0"
                  disabled={isSubmitting}
                />
              </div>

              {/* Moeilijkheid */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moeilijkheid
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              {/* Volgorde */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Volgorde
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  min="1"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  placeholder="Voeg tag toe"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  Toevoegen
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      disabled={isSubmitting}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Lessons Selectie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecteer Modules ({includedModules.length} geselecteerd) • {totalDuration} minuten totaal
              </label>
              <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Modules laden...
                  </div>
                ) : modules.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Geen modules beschikbaar
                  </div>
                ) : (
                  modules.map(module => (
                    <div
                      key={module.id}
                      className="flex items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={includedModules.includes(module.id)}
                        onChange={() => toggleModule(module.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        disabled={isSubmitting}
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-900">
                          {module.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {module.duration || 0}min • {module.difficulty || 'Beginner'} • {module.category || 'Uncategorized'}
                          {module.status && (
                            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getStatusColor(module.status)}`}>
                              {module.status}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Voorbeeld:</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Titel:</strong> {title || 'Niet ingevuld'}</p>
                <p><strong>Niveau:</strong> {level || 'Niet ingevuld'}</p>
                <p className="flex items-center">
                  <strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </p>
                <p className="flex items-center">
                  <strong>Moeilijkheid:</strong> 
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getDifficultyColor(difficulty)}`}>
                    {difficulty}
                  </span>
                </p>
                <p><strong>Aantal modules:</strong> {includedModules.length}</p>
                <p><strong>Totale duur:</strong> {totalDuration} minuten</p>
              </div>
            </div>

            {/* Actie knoppen */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                Annuleren
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Icons.loading className="w-4 h-4 animate-spin" />
                )}
                <span>{isSubmitting ? 'Bezig...' : (course ? 'Bijwerken' : 'Aanmaken')}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}