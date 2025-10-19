// 📁 BESTAND: /src/components/ModuleModal.tsx - GEFIXTE VERSIE
'use client'

import { useState, useEffect } from 'react'
import { Icons } from './Icons'

interface Lesson {
  id: string
  title: string
  durationMinutes: number
  category: string
  status: string
  description?: string
}

interface Module {
  id: string
  title: string
  status: string
  students: number
  progress: number
  lessons: number // Consistent met page.tsx
  description: string
  category: string
  order: number
  createdAt: string
  updatedAt: string
  duration?: number
  difficulty?: 'Beginner' | 'Intermediate' | 'Expert'
  tags?: string[]
  includedLessons?: string[]
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
    status: 'DRAFT' as string,
    duration: 0,
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Expert',
    tags: [] as string[],
    order: 0,
    includedLessons: [] as string[]
  })

  const [availableLessons, setAvailableLessons] = useState<Lesson[]>([])
  const [availableCourses, setAvailableCourses] = useState<any[]>([])
  const [newTag, setNewTag] = useState('')
  const [lessonSearch, setLessonSearch] = useState('')
  const [selectedLessonCategory, setSelectedLessonCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [lessonsLoading, setLessonsLoading] = useState(true)
  const [coursesLoading, setCoursesLoading] = useState(true)
  const [selectedCourseId, setSelectedCourseId] = useState('')

  // Fetch lessons from database
  useEffect(() => {
    const fetchLessons = async () => {
      try {
        setLessonsLoading(true)
        console.log('🔍 Fetching lessons from API...')
        
        const response = await fetch('/api/lessons')
        
        if (!response.ok) {
          throw new Error('Failed to fetch lessons')
        }
        
        const lessons = await response.json()
        console.log('📚 Lessons fetched:', lessons.length, lessons)
        
        const transformedLessons: Lesson[] = lessons.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          durationMinutes: lesson.durationMinutes || 0,
          category: lesson.category || 'Uncategorized',
          status: lesson.status === 'PUBLISHED' ? 'Actief' : 'Concept',
          description: lesson.description
        }))
        
        setAvailableLessons(transformedLessons)
      } catch (error) {
        console.error('Error fetching lessons:', error)
      } finally {
        setLessonsLoading(false)
      }
    }

    fetchLessons()
  }, [])

  // Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setCoursesLoading(true)
        console.log('🔍 Fetching courses from API...')
        
        const response = await fetch('/api/courses')
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }
        
        const courses = await response.json()
        console.log('📚 Courses fetched:', courses.length, courses)
        
        setAvailableCourses(courses)
        
        // Select first course by default
        if (courses.length > 0 && !selectedCourseId) {
          setSelectedCourseId(courses[0].id)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setCoursesLoading(false)
      }
    }

    fetchCourses()
  }, [])

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
        order: module.order,
        includedLessons: module.includedLessons || []
      })
      
      // Als het een bestaande module is, gebruik de courseId van de module
      if (module.id) {
        // Je zou hier de courseId van de module moeten ophalen
        // Voor nu gebruiken we de eerste beschikbare course
        setSelectedCourseId(availableCourses[0]?.id || '')
      }
    } else {
      // Nieuwe module - bepaal volgende order nummer
      setFormData(prev => ({
        ...prev,
        order: categories.length > 0 ? categories.length + 1 : 1
      }))
    }
  }, [module, categories, availableCourses])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // Valideer vereiste velden
      if (!formData.title.trim()) {
        throw new Error('Titel is verplicht')
      }
      
      if (!formData.description.trim()) {
        throw new Error('Beschrijving is verplicht')
      }
      
      if (!formData.category) {
        throw new Error('Categorie is verplicht')
      }
      
      if (!selectedCourseId) {
        throw new Error('Selecteer een cursus voor deze module')
      }

      // Bereken totale duur op basis van geselecteerde lessen
      const selectedLessons = availableLessons.filter(lesson => 
        formData.includedLessons.includes(lesson.id)
      )
      const totalDuration = selectedLessons.reduce((total, lesson) => 
        total + lesson.durationMinutes, 0
      )

      // Prepare data for API
      const moduleData = {
        ...formData,
        duration: totalDuration,
        courseId: selectedCourseId,
        // Zorg dat de module ID wordt meegestuurd voor updates
        ...(module?.id && { id: module.id })
      }

      console.log('💾 Saving module data:', moduleData)

      // Save to database via API
      const url = module ? `/api/modules/${module.id}` : '/api/modules'
      const method = module ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moduleData),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to save module: ${errorText}`)
      }

      const savedModule = await response.json()
      console.log('✅ Module saved to database:', savedModule)

      // Call the parent onSave with the complete module data
      await onSave({
        ...moduleData,
        id: savedModule.id || module?.id,
        students: module?.students || 0,
        progress: module?.progress || 0,
        lessons: formData.includedLessons.length,
        createdAt: module?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      onClose()
    } catch (error: unknown) {
      console.error('Error saving module:', error)
      let errorMessage = 'Er is een fout opgetreden bij het opslaan van de module'
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      alert(`${errorMessage}. Check de console voor details.`)
    } finally {
      setIsSubmitting(false)
    }
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

  // Lesson selection handlers
  const toggleLessonSelection = (lessonId: string) => {
    setFormData(prev => ({
      ...prev,
      includedLessons: prev.includedLessons.includes(lessonId)
        ? prev.includedLessons.filter(id => id !== lessonId)
        : [...prev.includedLessons, lessonId]
    }))
  }

  const selectAllLessons = () => {
    const filteredLessons = getFilteredLessons()
    const allLessonIds = filteredLessons.map(lesson => lesson.id)
    
    setFormData(prev => ({
      ...prev,
      includedLessons: 
        prev.includedLessons.length === allLessonIds.length 
          ? [] 
          : allLessonIds
    }))
  }

  // Filter lessons voor weergave
  const getFilteredLessons = () => {
    return availableLessons.filter(lesson => {
      const matchesSearch = lesson.title.toLowerCase().includes(lessonSearch.toLowerCase())
      const matchesCategory = !selectedLessonCategory || lesson.category === selectedLessonCategory
      return matchesSearch && matchesCategory
    })
  }

  const filteredLessons = getFilteredLessons()
  const selectedLessons = availableLessons.filter(lesson => formData.includedLessons.includes(lesson.id))
  const totalDuration = selectedLessons.reduce((total, lesson) => total + lesson.durationMinutes, 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {module ? 'Bewerk Module' : 'Nieuwe Module'}
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
          {/* Basis Informatie */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cursus Selectie */}
            <div className="md:col-span-2">
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                Cursus *
              </label>
              <select
                id="course"
                required
                disabled={isSubmitting || coursesLoading}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
              >
                <option value="">Selecteer een cursus</option>
                {availableCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.title}
                  </option>
                ))}
              </select>
              {coursesLoading && (
                <p className="text-sm text-gray-500 mt-1">Cursussen laden...</p>
              )}
            </div>

            {/* Titel */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Module Titel *
              </label>
              <input
                type="text"
                id="title"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Bijv: Phishing Awareness Training"
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
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Beschrijf de inhoud en doelstellingen van deze module..."
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
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="DRAFT">Concept</option>
                <option value="PUBLISHED">Actief</option>
                <option value="ARCHIVED">Inactief</option>
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
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
                    disabled={isSubmitting}
                    className="ml-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
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
                disabled={isSubmitting}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                placeholder="Voeg een tag toe..."
              />
              <button
                type="button"
                onClick={addTag}
                disabled={isSubmitting}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
              >
                Toevoegen
              </button>
            </div>
          </div>

          {/* Lesson Selectie Sectie */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Lessen in deze Module</h4>
                <p className="text-sm text-gray-600">
                  Selecteer bestaande lessen om aan deze module toe te voegen
                </p>
              </div>
              <div className="text-sm text-gray-600">
                {lessonsLoading ? (
                  'Lessen laden...'
                ) : (
                  <>
                    {formData.includedLessons.length} van {availableLessons.length} lessen geselecteerd
                    {totalDuration > 0 && ` • ${totalDuration} minuten totaal`}
                  </>
                )}
              </div>
            </div>

            {/* Lesson Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="lessonSearch" className="block text-sm font-medium text-gray-700 mb-2">
                  Zoek lessen
                </label>
                <input
                  type="text"
                  id="lessonSearch"
                  disabled={isSubmitting || lessonsLoading}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  value={lessonSearch}
                  onChange={(e) => setLessonSearch(e.target.value)}
                  placeholder="Zoek op les titel..."
                />
              </div>
              <div>
                <label htmlFor="lessonCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter op categorie
                </label>
                <select
                  id="lessonCategory"
                  disabled={isSubmitting || lessonsLoading}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  value={selectedLessonCategory}
                  onChange={(e) => setSelectedLessonCategory(e.target.value)}
                >
                  <option value="">Alle categorieën</option>
                  {Array.from(new Set(availableLessons.map(l => l.category))).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Lessons Lijst */}
            <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.includedLessons.length === filteredLessons.length && filteredLessons.length > 0}
                      onChange={selectAllLessons}
                      disabled={isSubmitting || lessonsLoading}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <span className="text-sm font-medium text-gray-700">Selecteer alle gefilterde lessen</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {lessonsLoading ? 'Laden...' : `${filteredLessons.length} lessen gevonden`}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {lessonsLoading ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    Lessen laden...
                  </div>
                ) : filteredLessons.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    Geen lessen gevonden met de huidige filters
                  </div>
                ) : (
                  filteredLessons.map(lesson => (
                    <div key={lesson.id} className="px-4 py-3 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.includedLessons.includes(lesson.id)}
                          onChange={() => toggleLessonSelection(lesson.id)}
                          disabled={isSubmitting}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {lesson.title}
                            </span>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                              lesson.status === 'Actief' ? 'bg-green-100 text-green-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {lesson.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{lesson.category}</span>
                            <span>{lesson.durationMinutes} minuten</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
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
                  formData.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' :
                  formData.status === 'ARCHIVED' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {formData.status === 'PUBLISHED' ? 'Actief' : 
                   formData.status === 'ARCHIVED' ? 'Inactief' : 'Concept'}
                </span>
              </p>
              <p><strong>Aantal lessen:</strong> {formData.includedLessons.length}</p>
              {totalDuration > 0 && <p><strong>Totale duur:</strong> {totalDuration} minuten</p>}
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
              disabled={isSubmitting || !selectedCourseId}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isSubmitting && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              <span>{isSubmitting ? 'Bezig...' : (module ? 'Bijwerken' : 'Module Aanmaken')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}