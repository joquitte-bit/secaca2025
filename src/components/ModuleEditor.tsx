// src/components/ModuleEditor.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'

// COMPLETE Module interface
interface Module {
  id: string
  title: string
  description: string
  status: 'CONCEPT' | 'ACTIEF' | 'INACTIEF'
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  lessons: number
  duration: number
  order: number
  courseCount: number
  completionRate: number
  tags: string[]
  content: string
  objectives: string[]
  prerequisites: string[]
  createdAt: string
  updatedAt: string
  level?: string
  slug?: string
  enrollments?: number
  lessonCount?: number
}

interface Lesson {
  id: string
  title: string
  description: string
  type: string
  duration: number
  category: string
  status: string
}

interface ModuleEditorProps {
  module?: Module | null
  categories: string[]
  onClose: () => void
  onSave: (module: Module) => void
}

const statusOptions = [
  { value: 'CONCEPT', label: 'Concept' },
  { value: 'ACTIEF', label: 'Actief' },
  { value: 'INACTIEF', label: 'Inactief' }
]

const safeNumber = (value: any, fallback: number = 0): number => {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback
  }
  return Number(value)
}

// Helper functies voor tags
const cleanTag = (tag: string): string => {
  return tag.replace(/"/g, '').trim()
}

const isValidTag = (tag: any): boolean => {
  return Boolean(tag) && typeof tag === 'string' && tag.trim().length > 0
}

const getValidTags = (tags: any): string[] => {
  if (!Array.isArray(tags)) return []
  return tags
    .filter(tag => isValidTag(tag))
    .map(tag => cleanTag(tag))
}

const ModuleEditor = ({ module, categories = [], onClose, onSave }: ModuleEditorProps) => {
  const [formData, setFormData] = useState<Module>({
    id: '',
    title: '',
    description: '',
    status: 'CONCEPT',
    category: '',
    difficulty: 'Beginner',
    lessons: 0,
    duration: 0,
    order: 0,
    courseCount: 0,
    completionRate: 0,
    tags: [],
    content: '',
    objectives: [],
    prerequisites: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    level: '',
    slug: '',
    enrollments: 0,
    lessonCount: 0
  })

  const [tagInput, setTagInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [newObjective, setNewObjective] = useState('')
  const [newPrerequisite, setNewPrerequisite] = useState('')
  
  const [allLessons, setAllLessons] = useState<Lesson[]>([])
  const [selectedLessons, setSelectedLessons] = useState<string[]>([])
  const [lessonSearch, setLessonSearch] = useState('')
  const [isLoadingLessons, setIsLoadingLessons] = useState(false)

  useEffect(() => {
    if (module) {
      // Zorg ervoor dat alle arrays correct geïnitialiseerd zijn
      setFormData({
        ...module,
        objectives: Array.isArray(module.objectives) ? module.objectives : [],
        prerequisites: Array.isArray(module.prerequisites) ? module.prerequisites : [],
        tags: getValidTags(module.tags), // Gebruik helper functie voor tags
        level: module.level || '',
        slug: module.slug || '',
        enrollments: module.enrollments || 0,
        lessonCount: module.lessonCount || 0
      })
    } else {
      // Reset form for new module
      setFormData({
        id: '',
        title: '',
        description: '',
        status: 'CONCEPT',
        category: '',
        difficulty: 'Beginner',
        lessons: 0,
        duration: 0,
        order: 0,
        courseCount: 0,
        completionRate: 0,
        tags: [],
        content: '',
        objectives: [],
        prerequisites: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        level: '',
        slug: '',
        enrollments: 0,
        lessonCount: 0
      })
    }
  }, [module])

  useEffect(() => {
    fetchAllLessons()
  }, [])

  useEffect(() => {
    if (module?.id) {
      loadModuleLessons(module.id)
    }
  }, [module?.id])

  const fetchAllLessons = async () => {
    try {
      setIsLoadingLessons(true)
      const response = await fetch('/api/lessons')
      
      if (response.ok) {
        const lessons = await response.json()
        const activeLessons = lessons.filter((lesson: Lesson) => lesson.status === 'PUBLISHED')
        setAllLessons(activeLessons)
      } else {
        console.error('❌ Failed to fetch lessons')
        setAllLessons([])
      }
    } catch (error) {
      console.error('❌ Error fetching lessons:', error)
      setAllLessons([])
    } finally {
      setIsLoadingLessons(false)
    }
  }

  const loadModuleLessons = async (moduleId: string) => {
    try {
      const response = await fetch(`/api/modules/${moduleId}/lessons`)
      
      if (response.ok) {
        const moduleLessons = await response.json()
        const lessonIds = moduleLessons.map((ml: any) => ml.lessonId)
        setSelectedLessons(lessonIds)
      } else {
        console.error('❌ Failed to load module lessons')
        setSelectedLessons([])
      }
    } catch (error) {
      console.error('❌ Error loading module lessons:', error)
      setSelectedLessons([])
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAddTag = () => {
    const cleanedTag = cleanTag(tagInput)
    if (isValidTag(cleanedTag) && !formData.tags.includes(cleanedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, cleanedTag]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleAddObjective = () => {
    if (newObjective.trim() && !formData.objectives.includes(newObjective.trim())) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()]
      }))
      setNewObjective('')
    }
  }

  const handleRemoveObjective = (objectiveToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj !== objectiveToRemove)
    }))
  }

  const handleAddPrerequisite = () => {
    if (newPrerequisite.trim() && !formData.prerequisites.includes(newPrerequisite.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()]
      }))
      setNewPrerequisite('')
    }
  }

  const handleRemovePrerequisite = (prereqToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(prereq => prereq !== prereqToRemove)
    }))
  }

  const toggleLessonSelection = (lessonId: string) => {
    setSelectedLessons(prev => {
      const isAlreadySelected = prev.includes(lessonId)
      if (isAlreadySelected) {
        return prev.filter(id => id !== lessonId)
      } else {
        return [...prev, lessonId]
      }
    })
  }

  const getLessonTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Icons.video className="w-4 h-4 text-blue-600" />
      case 'QUIZ': return <Icons.document className="w-4 h-4 text-purple-600" />
      case 'DOWNLOAD': return <Icons.download className="w-4 h-4 text-green-600" />
      default: return <Icons.document className="w-4 h-4 text-gray-600" />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.category) {
      alert('Vul verplichte velden in: Titel, Beschrijving en Categorie')
      return
    }

    setIsLoading(true)

    try {
      const totalDuration = allLessons
        .filter(lesson => selectedLessons.includes(lesson.id))
        .reduce((acc, lesson) => acc + safeNumber(lesson.duration), 0)

      // Zorg dat tags proper worden opgeslagen
      const cleanTags = getValidTags(formData.tags)

      const moduleData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        category: formData.category,
        difficulty: formData.difficulty,
        duration: totalDuration || safeNumber(formData.duration),
        order: formData.order || 0,
        tags: cleanTags, // Gebruik schone tags
        content: formData.content || '',
        objectives: formData.objectives,
        prerequisites: formData.prerequisites
      }

      console.log('💾 Saving module data:', moduleData)

      const url = module?.id ? `/api/modules/${module.id}` : '/api/modules'
      const method = module?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moduleData),
      })

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorData.message || errorMessage
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const savedModule = await response.json()
      console.log('✅ Module saved successfully:', savedModule)
      
      // Save module-lesson relationships separately
      if (selectedLessons.length > 0 && savedModule.id) {
        try {
          await saveModuleLessons(savedModule.id, selectedLessons)
        } catch (relationError) {
          console.warn('Could not save module-lesson relationships:', relationError)
        }
      }
      
      onSave(savedModule)
      setShowSuccessModal(true)
      
    } catch (error: any) {
      console.error('❌ Save error:', error)
      alert(`Fout bij opslaan module: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const saveModuleLessons = async (moduleId: string, lessonIds: string[]) => {
    try {
      // Delete existing relationships
      await fetch(`/api/modules/${moduleId}/lessons`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      // Add new relationships
      const response = await fetch(`/api/modules/${moduleId}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonIds }),
      })

      if (!response.ok) {
        throw new Error('Failed to save module-lesson relationships')
      }

      console.log('✅ Module-lesson relationships saved successfully')
    } catch (error) {
      console.error('❌ Error saving module-lesson relationships:', error)
      throw error
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    onClose()
  }

  const filteredLessons = allLessons.filter(lesson => {
    if (!lessonSearch.trim()) return true
    const searchTerm = lessonSearch.toLowerCase()
    return (
      lesson.title.toLowerCase().includes(searchTerm) ||
      lesson.description.toLowerCase().includes(searchTerm)
    )
  })

  const totalDuration = allLessons
    .filter(lesson => selectedLessons.includes(lesson.id))
    .reduce((acc, lesson) => acc + safeNumber(lesson.duration), 0)

  return (
    <>
      {/* Main Editor Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {module ? 'Module Bewerken' : 'Nieuwe Module Maken'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {module ? 'Bewerk de module details' : 'Maak een nieuwe module aan'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isLoading}
              >
                <Icons.close className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[70vh]">
            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Titel *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bijv: React Fundamentals"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categorie *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    disabled={isLoading}
                  >
                    <option value="">Selecteer categorie</option>
                    {(categories || []).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beschrijving *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Korte beschrijving van de module..."
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Lessons Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">Lessen Selecteren</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Alleen gepubliceerde lessen worden getoond ({allLessons.length} beschikbaar)
                    </p>
                  </div>
                </div>
                
                {/* Search Lessons */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zoek Lessen
                  </label>
                  <input
                    type="text"
                    value={lessonSearch}
                    onChange={(e) => setLessonSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Zoek op les titel of beschrijving..."
                    disabled={isLoading}
                  />
                </div>

                {/* Available Lessons List */}
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                  {isLoadingLessons ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      Actieve lessen laden...
                    </div>
                  ) : filteredLessons.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <Icons.document className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      {lessonSearch ? 'Geen actieve lessen gevonden voor je zoekopdracht' : 'Geen actieve lessen beschikbaar'}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredLessons.map((lesson) => {
                        const isSelected = selectedLessons.includes(lesson.id)
                        return (
                          <div
                            key={lesson.id}
                            className={`p-4 cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => toggleLessonSelection(lesson.id)}
                          >
                            <div className="flex items-center space-x-3">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleLessonSelection(lesson.id)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                onClick={(e) => e.stopPropagation()}
                              />
                              <div className="flex-shrink-0">
                                {getLessonTypeIcon(lesson.type)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                                <p className="text-sm text-gray-600">{lesson.description}</p>
                                <div className="flex items-center space-x-3 mt-1">
                                  <span className="text-xs text-gray-500">
                                    {lesson.type} • {safeNumber(lesson.duration)} min • {lesson.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Selected Lessons Summary */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Geselecteerde Lessen ({selectedLessons.length})
                  </h4>
                  {selectedLessons.length === 0 ? (
                    <p className="text-sm text-gray-500">Nog geen lessen geselecteerd</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedLessons.map((lessonId, index) => {
                        const lesson = allLessons.find(l => l.id === lessonId)
                        if (!lesson) return null
                        return (
                          <div key={lessonId} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                                {index + 1}
                              </span>
                              <div>
                                <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                                <p className="text-xs text-gray-600">
                                  {safeNumber(lesson.duration)} minuten • {lesson.type}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleLessonSelection(lessonId)}
                              className="text-red-600 hover:text-red-800"
                              disabled={isLoading}
                            >
                              <Icons.trash className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Module Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moeilijkheid
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Totale Duur (min)
                  </label>
                  <input
                    type="number"
                    value={totalDuration}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Automatisch berekend</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leerdoelen
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddObjective())}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Voeg leerdoel toe..."
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleAddObjective}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={isLoading}
                  >
                    Toevoegen
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.objectives.map((objective, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border">
                      <span className="text-gray-700">{objective}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveObjective(objective)}
                        className="text-gray-500 hover:text-red-600"
                        disabled={isLoading}
                      >
                        <Icons.trash className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prerequisites */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vereiste Kennis
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPrerequisite())}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Voeg vereiste kennis toe..."
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleAddPrerequisite}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={isLoading}
                  >
                    Toevoegen
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border">
                      <span className="text-gray-700">{prereq}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePrerequisite(prereq)}
                        className="text-gray-500 hover:text-red-600"
                        disabled={isLoading}
                      >
                        <Icons.trash className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags - FIXED VERSION */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Voeg tag toe..."
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={isLoading}
                  >
                    Toevoegen
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.filter(tag => isValidTag(tag)).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-gray-600 hover:text-red-600"
                        disabled={isLoading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  {formData.tags.filter(tag => isValidTag(tag)).length === 0 && (
                    <p className="text-sm text-gray-500">Nog geen tags toegevoegd</p>
                  )}
                </div>
              </div>

              {/* Module Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module Inhoud (Optioneel)
                </label>
                <textarea
                  rows={4}
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Algemene inhoud of introductie voor de module..."
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedLessons.length} lessen • {totalDuration} minuten totaal
                </div>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                    disabled={isLoading}
                  >
                    Annuleren
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isLoading
                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isLoading ? 'Opslaan...' : (module ? 'Bijwerken' : 'Module Aanmaken')}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-auto">
            <div className="p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ✅ Succesvol opgeslagen!
              </h3>
              <p className="text-gray-600">
                De module is succesvol opgeslagen in het systeem.
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-lg">
              <button
                onClick={handleSuccessModalClose}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200 font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ModuleEditor