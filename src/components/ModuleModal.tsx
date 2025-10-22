'use client'

import { useState, useEffect } from 'react'
import { Icons } from './Icons'

interface Lesson {
  id: string
  title: string
  description?: string
  durationMinutes?: number
  difficulty?: string
  category?: string
}

interface Module {
  id?: string
  title: string
  description: string
  category: string
  status: 'Concept' | 'Actief' | 'Inactief'
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  order: number
  tags: string[] // 📍 VERPLICHT: altijd een array (geen ? meer)
  includedLessons?: string[]
  courseId?: string
}

interface ModuleModalProps {
  module: Module | null
  categories: string[]
  onClose: () => void
  onSave: (module: Module) => void
}

export function ModuleModal({ module, categories, onClose, onSave }: ModuleModalProps) {
  const [title, setTitle] = useState(module?.title || '')
  const [description, setDescription] = useState(module?.description || '')
  const [category, setCategory] = useState(module?.category || categories[0] || '')
  const [status, setStatus] = useState<'Concept' | 'Actief' | 'Inactief'>(module?.status || 'Concept')
  const [duration, setDuration] = useState(module?.duration || 0)
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Expert'>(module?.difficulty || 'Beginner')
  const [order, setOrder] = useState(module?.order || 1)
  const [tags, setTags] = useState<string[]>(module?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [includedLessons, setIncludedLessons] = useState<string[]>(module?.includedLessons || [])
  const [isLoading, setIsLoading] = useState(false)

  // Haal lessons op bij het openen van de modal
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/lessons')
        if (response.ok) {
          const data = await response.json()
          console.log('📚 Lessons fetched:', data)
          setLessons(Array.isArray(data) ? data : [])
        }
      } catch (error) {
        console.error('Error fetching lessons:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLessons()
  }, [])

  // 📍 NIEUW: Haal gekoppelde lessons op bij bewerken
  useEffect(() => {
    const fetchModuleLessons = async () => {
      if (module?.id) {
        try {
          console.log('🔍 Fetching lessons for module:', module.id)
          const response = await fetch(`/api/modules/${module.id}`)
          if (response.ok) {
            const moduleData = await response.json()
            console.log('📚 Loaded module lessons:', moduleData.lessons)
            // Update de includedLessons met de daadwerkelijk gekoppelde lessons
            if (moduleData.lessons && Array.isArray(moduleData.lessons)) {
              setIncludedLessons(moduleData.lessons.map((lesson: any) => lesson.id))
            }
          }
        } catch (error) {
          console.error('Error fetching module lessons:', error)
        }
      }
    }

    fetchModuleLessons()
  }, [module?.id])

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  // 📍 GEBRUIK EEN ECHTE COURSE ID - vervang met een ID uit Prisma Studio
  const courseId = module?.courseId || 'cmgy9he28000487zak1dq4e0t' // ← VERVANG DIT MET EEN ECHTE ID
  
  const moduleData: Module = {
    id: module?.id,
    title,
    description,
    category,
    status,
    duration,
    difficulty,
    order,
    tags,
    includedLessons,
    courseId: courseId
  }

  console.log('💾 Saving module data:', moduleData)
  console.log('🏫 Using courseId:', courseId)
  
  try {
    await onSave(moduleData)
    console.log('✅ Module saved to database:', moduleData)
  } catch (error) {
    console.error('❌ Error saving module:', error)
  }
}

  const toggleLesson = (lessonId: string) => {
    setIncludedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {module ? 'Module Bewerken' : 'Nieuwe Module'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Module titel"
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
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Module beschrijving"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Categorie */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
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
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Voeg tag toe"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
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
                      className="ml-2 text-blue-600 hover:text-blue-800"
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
                Selecteer Lessons ({includedLessons.length} geselecteerd)
              </label>
              <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 text-center text-gray-500">
                    Lessons laden...
                  </div>
                ) : lessons.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    Geen lessons beschikbaar
                  </div>
                ) : (
                  lessons.map(lesson => (
                    <div
                      key={lesson.id}
                      className="flex items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={includedLessons.includes(lesson.id)}
                        onChange={() => toggleLesson(lesson.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-900">
                          {lesson.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {lesson.durationMinutes || 0}min • {lesson.difficulty || 'Beginner'} • {lesson.category || 'Uncategorized'}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Actie knoppen */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Annuleren
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {module ? 'Bijwerken' : 'Aanmaken'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}