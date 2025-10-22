// src/components/courses/CourseEditor.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'

interface Course {
  id: string
  title: string
  description: string
  status: 'Concept' | 'Actief' | 'Inactief'
  level: string
  tags: string[]
  slug: string
  order: number
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  category: string
  modules: number
  enrollments: number
  certificates: number
  completionRate: number
  createdAt: string
  updatedAt: string
  moduleCount: number
}

interface Module {
  id: string
  title: string
  description: string | null
  order: number
  duration: number | null
  category: string | null
  status: string | null
  difficulty: string | null
  tags: string | null
}

interface CourseEditorProps {
  course: Course | null
  categories: string[]
  onClose: () => void
  onSave: (course: Course) => void
}

// Safe number functie
const safeNumber = (value: any, fallback: number = 0): number => {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback
  }
  return Number(value)
}

// Fallback delete icon component
const DeleteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
)

// Fallback modules icon component
const ModulesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
)

export default function CourseEditor({ course, categories, onClose, onSave }: CourseEditorProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Concept' as 'Concept' | 'Actief' | 'Inactief',
    level: '',
    tags: [] as string[],
    slug: '',
    order: 0,
    duration: 0,
    difficulty: 'Beginner' as 'Beginner' | 'Intermediate' | 'Expert',
    category: '',
    modules: 0,
  })

  const [aiInput, setAiInput] = useState('')
  const [showAiImport, setShowAiImport] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [allModules, setAllModules] = useState<Module[]>([])
  const [selectedModules, setSelectedModules] = useState<string[]>([]) // Store module IDs
  const [moduleSearch, setModuleSearch] = useState('')
  const [isLoadingModules, setIsLoadingModules] = useState(false)

  // Default categories
  const defaultCategories = [
    'Security Basics',
    'Advanced Security', 
    'Network Security',
    'Web Security',
    'Cloud Security',
    'Mobile Security',
    'Cryptography',
    'Social Engineering',
    'Incident Response',
    'Compliance'
  ]

  const availableCategories = categories && categories.length > 0 ? categories : defaultCategories

  // Load all modules from database
  useEffect(() => {
    fetchAllModules()
  }, [])

  // Initialize form with course data when editing
  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title || '',
        description: course.description || '',
        status: course.status || 'Concept',
        level: course.level || '',
        tags: course.tags || [],
        slug: course.slug || '',
        order: safeNumber(course.order),
        duration: safeNumber(course.duration),
        difficulty: course.difficulty || 'Beginner',
        category: course.category || '',
        modules: safeNumber(course.modules),
      })
      // Load course modules
      loadCourseModules(course.id)
    } else {
      // Reset form for new course
      setFormData({
        title: '',
        description: '',
        status: 'Concept',
        level: '',
        tags: [],
        slug: '',
        order: 0,
        duration: 0,
        difficulty: 'Beginner',
        category: availableCategories[0] || '',
        modules: 0,
      })
      setSelectedModules([])
    }
  }, [course, availableCategories])

  const fetchAllModules = async () => {
    try {
      setIsLoadingModules(true)
      console.log('🔄 Fetching all modules...')
      
      const response = await fetch('/api/modules')
      
      if (response.ok) {
        const modules = await response.json()
        console.log('📚 Modules fetched:', modules)
        setAllModules(modules)
      } else {
        console.error('Failed to fetch modules')
      }
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setIsLoadingModules(false)
    }
  }

  const loadCourseModules = async (courseId: string) => {
    try {
      console.log(`🔄 Loading modules for course: ${courseId}`)
      const response = await fetch(`/api/courses/${courseId}/modules`)
      
      if (response.ok) {
        const courseModules = await response.json()
        const moduleIds = courseModules.map((cm: any) => cm.moduleId)
        setSelectedModules(moduleIds)
      }
    } catch (error) {
      console.error('Error loading course modules:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAIImport = () => {
    if (!aiInput.trim()) return

    try {
      // Try to parse as JSON first
      let parsedData
      try {
        parsedData = JSON.parse(aiInput)
      } catch {
        // If JSON fails, try to extract from text format
        parsedData = parseTextFormat(aiInput)
      }

      // Update form with AI data
      setFormData(prev => ({
        ...prev,
        title: parsedData.title || parsedData.course_title || parsedData.name || prev.title,
        description: parsedData.description || parsedData.course_description || parsedData.summary || prev.description,
        category: parsedData.category || parsedData.topic || prev.category || availableCategories[0],
        duration: safeNumber(parsedData.duration || parsedData.duration_minutes || parsedData.time_required || prev.duration),
        difficulty: parsedData.difficulty || parsedData.difficulty_level || parsedData.level || prev.difficulty,
        level: parsedData.level || parsedData.audience_level || prev.level,
        modules: safeNumber(parsedData.modules || parsedData.module_count || prev.modules),
        tags: parsedData.tags || parsedData.keywords || prev.tags
      }))

      // Clear AI input and hide section
      setAiInput('')
      setShowAiImport(false)
      
      alert('AI content succesvol geïmporteerd!')
    } catch (error) {
      alert('Fout bij importeren AI content. Controleer het format.')
      console.error('AI Import error:', error)
    }
  }

  const parseTextFormat = (text: string) => {
    const result: any = {}
    
    // Extract title
    const titleMatch = text.match(/Titel:\s*(.+)/i)
    if (titleMatch) result.title = titleMatch[1].trim()

    // Extract description
    const descMatch = text.match(/Beschrijving:\s*(.+)/i)
    if (descMatch) result.description = descMatch[1].trim()

    // Extract category
    const categoryMatch = text.match(/Categorie:\s*(.+)/i)
    if (categoryMatch) result.category = categoryMatch[1].trim()

    // Extract duration
    const durationMatch = text.match(/Duur:\s*(\d+)/i)
    if (durationMatch) result.duration = safeNumber(durationMatch[1])

    // Extract difficulty
    const difficultyMatch = text.match(/Moeilijkheid:\s*(Beginner|Intermediate|Expert)/i)
    if (difficultyMatch) result.difficulty = difficultyMatch[1]

    // Extract level
    const levelMatch = text.match(/Niveau:\s*(.+)/i)
    if (levelMatch) result.level = levelMatch[1]

    // Extract modules
    const modulesMatch = text.match(/Modules:\s*(\d+)/i)
    if (modulesMatch) result.modules = safeNumber(modulesMatch[1])

    return result
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
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

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-')
  }

  const toggleModuleSelection = (moduleId: string) => {
    setSelectedModules(prev => {
      const isAlreadySelected = prev.includes(moduleId)
      if (isAlreadySelected) {
        return prev.filter(id => id !== moduleId)
      } else {
        return [...prev, moduleId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title || !formData.description || !formData.category) {
      alert('Vul verplichte velden in: Titel, Beschrijving en Categorie')
      return
    }

    setIsLoading(true)

    try {
      // Generate slug if empty
      const slug = formData.slug || generateSlug(formData.title)

      // Calculate total duration from selected modules
      const totalDuration = allModules
        .filter(module => selectedModules.includes(module.id))
        .reduce((acc, module) => acc + safeNumber(module.duration), 0)

      // Prepare course data
      const courseData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        status: formData.status,
        category: formData.category,
        duration: totalDuration || safeNumber(formData.duration),
        difficulty: formData.difficulty,
        level: formData.level.trim() || 'Introductie',
        tags: formData.tags,
        slug: slug,
        order: safeNumber(formData.order),
        modules: selectedModules.length,
        enrollments: course?.enrollments || 0,
        certificates: course?.certificates || 0,
        completionRate: course?.completionRate || 0,
      }

      // For edit, add ID
      if (course?.id) {
        (courseData as any).id = course.id
      }

      console.log('💾 Saving course to database:', courseData)

      // API call for course
      const url = '/api/courses'
      const method = course?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      })

      console.log('📡 API Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${course?.id ? 'update' : 'create'} course`)
      }

      const savedCourse = await response.json()
      console.log('✅ Course saved successfully:', savedCourse)
      
      // Save course-module relationships
      if (selectedModules.length > 0) {
        await saveCourseModules(savedCourse.id, selectedModules)
      }
      
      // Call onSave with saved data
      onSave(savedCourse)
      
      // Show success modal
      setShowSuccessModal(true)
      
    } catch (error: any) {
      console.error('❌ Save error:', error)
      alert(`Fout bij opslaan course: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

const saveCourseModules = async (courseId: string, moduleIds: string[]) => {
  try {
    console.log(`💾 Saving course-module relationships for course: ${courseId}`)
    
    const response = await fetch(`/api/courses/${courseId}/modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ moduleIds }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to save course-module relationships')
    }

    console.log('✅ Course-module relationships saved successfully')
  } catch (error) {
    console.error('❌ Error saving course-module relationships:', error)
    throw error
  }
}

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    onClose()
  }

  // Filter modules based on search
  const filteredModules = allModules.filter(module => {
    if (!moduleSearch.trim()) return true
    
    const searchTerm = moduleSearch.toLowerCase()
    return (
      module.title.toLowerCase().includes(searchTerm) ||
      (module.description && module.description.toLowerCase().includes(searchTerm))
    )
  })

  // Calculate total duration for display
  const totalDuration = allModules
    .filter(module => selectedModules.includes(module.id))
    .reduce((acc, module) => acc + safeNumber(module.duration), 0)

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
                  {course ? 'Course Bewerken' : 'Nieuwe Course Maken'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {course ? 'Bewerk de course details' : 'Maak een nieuwe course aan'}
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
              {/* AI Content Import Section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-blue-900">AI Content Import (ChatGPT)</h3>
                  <button
                    type="button"
                    onClick={() => setShowAiImport(!showAiImport)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    disabled={isLoading}
                  >
                    {showAiImport ? 'Verbergen' : 'Toon AI Import'}
                  </button>
                </div>

                {showAiImport && (
                  <div className="space-y-3">
                    <div>
                      <textarea
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                        placeholder={`Plak hier je ChatGPT output...

Voorbeeld format:
Titel: Cybersecurity Fundamentals
Beschrijving: Leer de basisprincipes van cybersecurity en bescherm jezelf online
Categorie: Security Basics
Duur: 120
Moeilijkheid: Beginner
Niveau: Introductie
Modules: 5

Of gebruik JSON format:
{
  "title": "Cybersecurity Fundamentals",
  "description": "Leer de basisprincipes...",
  "category": "Security Basics",
  "duration": 120,
  "difficulty": "Beginner",
  "level": "Introductie",
  "modules": 5,
  "tags": ["cybersecurity", "basics"]
}`}
                        rows={8}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        disabled={isLoading}
                      />
                    </div>
                    
                    <button
                      type="button"
                      onClick={handleAIImport}
                      disabled={!aiInput.trim() || isLoading}
                      className={`w-full py-2 px-4 rounded-lg font-medium ${
                        !aiInput.trim() || isLoading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      Importeer AI Content
                    </button>
                  </div>
                )}
              </div>

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
                    placeholder="Bijv: Cybersecurity Fundamentals"
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
                    {availableCategories.map(category => (
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
                  placeholder="Korte beschrijving van de course..."
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Modules Section */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Modules Selecteren</h3>
                
                {/* Search Modules */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zoek Modules
                  </label>
                  <input
                    type="text"
                    value={moduleSearch}
                    onChange={(e) => setModuleSearch(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Zoek op module titel of beschrijving..."
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {filteredModules.length} van {allModules.length} modules gevonden
                    {moduleSearch && ` voor "${moduleSearch}"`}
                  </p>
                </div>

                {/* Available Modules List */}
                <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-lg">
                  {isLoadingModules ? (
                    <div className="p-4 text-center text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      Modules laden...
                    </div>
                  ) : filteredModules.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <ModulesIcon className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                      {moduleSearch ? 'Geen modules gevonden voor je zoekopdracht' : 'Geen modules beschikbaar'}
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200">
                      {filteredModules.map((module) => {
                        const isSelected = selectedModules.includes(module.id)
                        return (
                          <div
                            key={module.id}
                            className={`p-4 cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => toggleModuleSelection(module.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleModuleSelection(module.id)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div>
                                    <h4 className="font-medium text-gray-900">{module.title}</h4>
                                    <p className="text-sm text-gray-600">{module.description}</p>
                                    <p className="text-xs text-gray-500">
                                      {safeNumber(module.duration)} minuten • {module.category || 'Geen categorie'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Selected Modules Summary */}
                <div className="mt-4">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Geselecteerde Modules ({selectedModules.length})
                  </h4>
                  {selectedModules.length === 0 ? (
                    <p className="text-sm text-gray-500">Nog geen modules geselecteerd</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedModules.map((moduleId, index) => {
                        const module = allModules.find(m => m.id === moduleId)
                        if (!module) return null
                        
                        return (
                          <div key={moduleId} className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                                {index + 1}
                              </span>
                              <div>
                                <h5 className="font-medium text-gray-900">{module.title}</h5>
                                <p className="text-xs text-gray-600">
                                  {safeNumber(module.duration)} minuten • {module.category || 'Geen categorie'}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleModuleSelection(moduleId)}
                              className="text-red-600 hover:text-red-800"
                              disabled={isLoading}
                            >
                              <DeleteIcon className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Course Settings */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                    Niveau
                  </label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => handleInputChange('level', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Bijv: Introductie"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Totale Duur (min)
                  </label>
                  <input
                    type="number"
                    value={totalDuration}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                    min="0"
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
                    <option value="Concept">Concept</option>
                    <option value="Actief">Actief</option>
                    <option value="Inactief">Inactief</option>
                  </select>
                </div>
              </div>

              {/* Second Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="auto-generated-slug"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange('order', safeNumber(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                        disabled={isLoading}
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
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {selectedModules.length} modules • {totalDuration} minuten totaal
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
                    {isLoading ? 'Opslaan...' : (course ? 'Bijwerken' : 'Course Aanmaken')}
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
                De course is succesvol opgeslagen in het systeem.
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