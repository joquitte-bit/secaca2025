// src/components/CourseModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from './Icons'

interface Module {
  id: string
  title: string
  duration: number
  category: string
  status: 'Actief' | 'Inactief' | 'Concept'
  lessons: number
}

interface Course {
  id?: number
  title: string
  description: string
  category: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Expert'
  status: 'Actief' | 'Inactief' | 'Concept'
  tags?: string[]
  includedModules?: string[]
  order?: number
  students?: number
  progress?: number
  modules?: number
  duration?: number
  createdAt?: string
  updatedAt?: string
}

interface CourseModalProps {
  course: Course | null
  categories: string[]
  onClose: () => void
  onSave: (courseData: any) => void
}

export function CourseModal({ course, categories, onClose, onSave }: CourseModalProps) {
  const [formData, setFormData] = useState<Course>({
    title: '',
    description: '',
    category: '',
    difficulty: 'Beginner',
    status: 'Concept',
    tags: [],
    includedModules: [],
    order: 0
  })

  const [tagInput, setTagInput] = useState('')
  const [moduleSearch, setModuleSearch] = useState('')
  const [selectedModuleCategory, setSelectedModuleCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableModules, setAvailableModules] = useState<Module[]>([])

  // Fetch available modules from API
  useEffect(() => {
    const fetchModules = async () => {
      try {
        // Mock modules data die overeenkomt met wat in modules pagina wordt getoond
        const mockModules: Module[] = [
          { 
            id: '1', 
            title: 'Security Basics Training', 
            duration: 60, 
            category: 'Security Basics', 
            status: 'Actief', 
            lessons: 3 
          },
          { 
            id: '2', 
            title: 'Geavanceerde Bedreigingen', 
            duration: 45, 
            category: 'Advanced Security', 
            status: 'Actief', 
            lessons: 1 
          },
          { 
            id: '3', 
            title: 'Phishing Awareness', 
            duration: 30, 
            category: 'Security Basics', 
            status: 'Actief', 
            lessons: 2 
          },
          { 
            id: '4', 
            title: 'Data Protection', 
            duration: 75, 
            category: 'Data Security', 
            status: 'Actief', 
            lessons: 4 
          },
          { 
            id: '5', 
            title: 'Social Engineering Defense', 
            duration: 50, 
            category: 'Advanced Security', 
            status: 'Concept', 
            lessons: 2 
          },
        ]
        setAvailableModules(mockModules)
      } catch (error) {
        console.error('Error fetching modules:', error)
      }
    }

    fetchModules()
  }, [])

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        category: course.category || '',
        difficulty: course.difficulty || 'Beginner',
        status: course.status || 'Concept',
        tags: course.tags || [],
        includedModules: course.includedModules || [],
        order: course.order || 0
      })
    } else {
      setFormData(prev => ({
        ...prev,
        order: categories.length > 0 ? categories.length + 1 : 1
      }))
    }
  }, [course, categories])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isSubmitting) return
    setIsSubmitting(true)

    try {
      // Calculate totals based on selected modules
      const selectedModules = availableModules.filter(module => 
        formData.includedModules?.includes(module.id)
      )
      const totalDuration = selectedModules.reduce((total, module) => total + module.duration, 0)
      const totalLessons = selectedModules.reduce((total, module) => total + module.lessons, 0)
      
      // Prepare course data
      const courseData = {
        ...formData,
        modules: formData.includedModules?.length || 0,
        duration: totalDuration,
        students: course?.students || 0,
        progress: course?.progress || 0,
        createdAt: course?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }

      // Simuleer API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(courseData)
      onClose()
    } catch (error) {
      console.error('Error saving course:', error)
      // Fallback to local state if API fails
      const selectedModules = availableModules.filter(module => 
        formData.includedModules?.includes(module.id)
      )
      const totalDuration = selectedModules.reduce((total, module) => total + module.duration, 0)
      
      const courseData = {
        ...formData,
        id: course?.id || Date.now(),
        duration: totalDuration,
        modules: formData.includedModules?.length || 0,
        students: course?.students || 0,
        progress: course?.progress || 0,
        createdAt: course?.createdAt || new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      }
      onSave(courseData)
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

  const toggleModuleSelection = (moduleId: string) => {
    setFormData(prev => ({
      ...prev,
      includedModules: prev.includedModules?.includes(moduleId)
        ? prev.includedModules.filter(id => id !== moduleId)
        : [...(prev.includedModules || []), moduleId]
    }))
  }

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // Module filtering
  const getFilteredModules = () => {
    return availableModules.filter(module => {
      const matchesSearch = module.title.toLowerCase().includes(moduleSearch.toLowerCase())
      const matchesCategory = !selectedModuleCategory || module.category === selectedModuleCategory
      return matchesSearch && matchesCategory
    })
  }

  const filteredModules = getFilteredModules()
  const selectedModules = availableModules.filter(module => formData.includedModules?.includes(module.id))
  const totalDuration = selectedModules.reduce((total, module) => total + module.duration, 0)
  const totalLessons = selectedModules.reduce((total, module) => total + module.lessons, 0)

  const selectAllModules = () => {
    const allModuleIds = filteredModules.map(module => module.id)
    
    setFormData(prev => ({
      ...prev,
      includedModules: 
        prev.includedModules?.length === allModuleIds.length 
          ? [] 
          : allModuleIds
    }))
  }

  // Helper functie voor status kleuren - UNIFORM MET LESSONS EN MODULES
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

  // Helper functie voor difficulty kleuren - UNIFORM MET LESSONS EN MODULES
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header - UNIFORM MET LESSONMODAL */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              {course ? 'Course Bewerken' : 'Nieuwe Course'}
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
          {/* Basis Informatie - UNIFORM LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Titel */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Course Titel *
              </label>
              <input
                type="text"
                id="title"
                required
                disabled={isSubmitting}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Bijv: Complete Security Awareness Training"
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
                placeholder="Beschrijf de inhoud en doelstellingen van deze course..."
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

          {/* Tags - UNIFORM STYLING */}
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

          {/* Module Selectie Sectie - UNIFORM MET LESSONMODAL'S MODULE SELECTIE */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-lg font-medium text-gray-900">Modules in deze Course</h4>
                <p className="text-sm text-gray-600">
                  Selecteer bestaande modules om aan deze course toe te voegen
                </p>
              </div>
              <div className="text-sm text-gray-600">
                {formData.includedModules?.length || 0} van {availableModules.length} modules geselecteerd
                {totalDuration > 0 && ` • ${totalDuration} minuten totaal`}
                {totalLessons > 0 && ` • ${totalLessons} lessen totaal`}
              </div>
            </div>

            {/* Module Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="moduleSearch" className="block text-sm font-medium text-gray-700 mb-2">
                  Zoek modules
                </label>
                <input
                  type="text"
                  id="moduleSearch"
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  value={moduleSearch}
                  onChange={(e) => setModuleSearch(e.target.value)}
                  placeholder="Zoek op module titel..."
                />
              </div>
              <div>
                <label htmlFor="moduleCategory" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter op categorie
                </label>
                <select
                  id="moduleCategory"
                  disabled={isSubmitting}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  value={selectedModuleCategory}
                  onChange={(e) => setSelectedModuleCategory(e.target.value)}
                >
                  <option value="">Alle categorieën</option>
                  {Array.from(new Set(availableModules.map(m => m.category))).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modules Lijst - UNIFORM STYLING */}
            <div className="border border-gray-300 rounded-lg max-h-60 overflow-y-auto">
              <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.includedModules?.length === filteredModules.length && filteredModules.length > 0}
                      onChange={selectAllModules}
                      disabled={isSubmitting}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                    />
                    <span className="text-sm font-medium text-gray-700">Selecteer alle gefilterde modules</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {filteredModules.length} modules gevonden
                  </span>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredModules.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500">
                    Geen modules gevonden met de huidige filters
                  </div>
                ) : (
                  filteredModules.map(module => (
                    <div key={module.id} className="flex items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={formData.includedModules?.includes(module.id) || false}
                        onChange={() => toggleModuleSelection(module.id)}
                        disabled={isSubmitting}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-gray-900">
                          {module.title}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center space-x-4 mt-1">
                          <span>{module.category}</span>
                          <span>{module.duration} minuten</span>
                          <span>{module.lessons} lessen</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(module.status)}`}>
                            {module.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Preview - UNIFORM MET LESSONMODAL */}
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
                <strong>Moeilijkheidsgraad:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getDifficultyColor(formData.difficulty || 'Beginner')}`}>
                  {formData.difficulty || 'Beginner'}
                </span>
              </p>
              <p><strong>Aantal modules:</strong> {formData.includedModules?.length || 0}</p>
              {totalDuration > 0 && <p><strong>Totale duur:</strong> {totalDuration} minuten</p>}
              {totalLessons > 0 && <p><strong>Totaal lessen:</strong> {totalLessons}</p>}
            </div>
          </div>

          {/* Actions - UNIFORM MET LESSONMODAL EN MODULEMODAL */}
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
                <Icons.loading className="w-4 h-4 animate-spin" />
              )}
              <span>{isSubmitting ? 'Bezig...' : (course ? 'Bijwerken' : 'Course Aanmaken')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}