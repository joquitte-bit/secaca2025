// src/components/LessonEditor.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'

interface Lesson {
  id: string
  title: string
  description: string
  content: string
  transcript: string // NIEUW VELD TOEGEVOEGD
  type: 'VIDEO' | 'QUIZ' | 'TEXT' | 'DOWNLOAD'
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  duration: number
  category: string
  tags: string[]
  status: 'CONCEPT' | 'PUBLISHED' | 'ARCHIVED'
  order: number
  resources: string[]
  objectives: string[]
  prerequisites: string[]
  videoUrl: string
  createdAt: string
  updatedAt: string
  moduleId?: string
  courseId?: string
}

interface LessonEditorProps {
  lesson?: Lesson | null
  categories: string[]
  onClose: () => void
  onSave: (lesson: Lesson) => void
}

const lessonTypes = [
  { value: 'VIDEO', label: 'Video', icon: 'video' },
  { value: 'QUIZ', label: 'Quiz', icon: 'quiz' },
  { value: 'TEXT', label: 'Text', icon: 'document' },
  { value: 'DOWNLOAD', label: 'Download', icon: 'download' }
]

const statusOptions = [
  { value: 'CONCEPT', label: 'Concept' },
  { value: 'PUBLISHED', label: 'Actief' },
  { value: 'ARCHIVED', label: 'Inactief' }
]

const safeNumber = (value: any, fallback: number = 0): number => {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback
  }
  return Number(value)
}

const LessonEditor = ({ lesson, categories = [], onClose, onSave }: LessonEditorProps) => {
  const [formData, setFormData] = useState<Lesson>({
    id: '',
    title: '',
    description: '',
    content: '',
    transcript: '', // NIEUW VELD TOEGEVOEGD
    type: 'TEXT',
    difficulty: 'Beginner',
    duration: 0,
    category: '',
    tags: [],
    status: 'CONCEPT',
    order: 0,
    resources: [],
    objectives: [],
    prerequisites: [],
    videoUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    moduleId: '',
    courseId: ''
  })

  const [tagInput, setTagInput] = useState('')
  const [resourceInput, setResourceInput] = useState('')
  const [objectiveInput, setObjectiveInput] = useState('')
  const [prerequisiteInput, setPrerequisiteInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    if (lesson) {
      setFormData({
        ...lesson,
        duration: lesson.duration || 0,
        difficulty: lesson.difficulty || 'Beginner',
        type: lesson.type || 'TEXT',
        category: lesson.category || '',
        tags: Array.isArray(lesson.tags) ? lesson.tags : [],
        resources: Array.isArray(lesson.resources) ? lesson.resources : [],
        objectives: Array.isArray(lesson.objectives) ? lesson.objectives : [],
        prerequisites: Array.isArray(lesson.prerequisites) ? lesson.prerequisites : [],
        videoUrl: lesson.videoUrl || '',
        transcript: lesson.transcript || '' // NIEUW VELD TOEGEVOEGD
      })
    } else {
      // Reset form for new lesson
      setFormData({
        id: '',
        title: '',
        description: '',
        content: '',
        transcript: '', // NIEUW VELD TOEGEVOEGD
        type: 'TEXT',
        difficulty: 'Beginner',
        duration: 0,
        category: '',
        tags: [],
        status: 'CONCEPT',
        order: 0,
        resources: [],
        objectives: [],
        prerequisites: [],
        videoUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        moduleId: '',
        courseId: ''
      })
    }
  }, [lesson])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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

  const handleAddResource = () => {
    if (resourceInput.trim() && !formData.resources.includes(resourceInput.trim())) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, resourceInput.trim()]
      }))
      setResourceInput('')
    }
  }

  const handleRemoveResource = (resourceToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter(resource => resource !== resourceToRemove)
    }))
  }

  const handleAddObjective = () => {
    if (objectiveInput.trim() && !formData.objectives.includes(objectiveInput.trim())) {
      setFormData(prev => ({
        ...prev,
        objectives: [...prev.objectives, objectiveInput.trim()]
      }))
      setObjectiveInput('')
    }
  }

  const handleRemoveObjective = (objectiveToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      objectives: prev.objectives.filter(obj => obj !== objectiveToRemove)
    }))
  }

  const handleAddPrerequisite = () => {
    if (prerequisiteInput.trim() && !formData.prerequisites.includes(prerequisiteInput.trim())) {
      setFormData(prev => ({
        ...prev,
        prerequisites: [...prev.prerequisites, prerequisiteInput.trim()]
      }))
      setPrerequisiteInput('')
    }
  }

  const handleRemovePrerequisite = (prereqToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      prerequisites: prev.prerequisites.filter(prereq => prereq !== prereqToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.category) {
      alert('Vul verplichte velden in: Titel, Beschrijving en Categorie')
      return
    }

    setIsLoading(true)

    try {
      // Map status van frontend naar backend formaat
      const statusMapping = {
        'PUBLISHED': 'Actief',
        'ARCHIVED': 'Inactief', 
        'CONCEPT': 'Concept'
      }

      const lessonData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        content: formData.content || '',
        transcript: formData.transcript || '', // NIEUW VELD TOEGEVOEGD
        type: formData.type,
        difficulty: formData.difficulty,
        duration: safeNumber(formData.duration),
        category: formData.category,
        tags: formData.tags,
        status: statusMapping[formData.status as keyof typeof statusMapping] || 'Concept',
        order: formData.order || 0,
        resources: formData.resources,
        objectives: formData.objectives,
        prerequisites: formData.prerequisites,
        videoUrl: formData.videoUrl.trim()
      }

      console.log('💾 Saving lesson data:', lessonData)

      // Gebruik PUT voor zowel create als update
      const url = lesson?.id ? `/api/lessons/${lesson.id}` : '/api/lessons'
      const method = lesson?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
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

      const savedLesson = await response.json()
      console.log('✅ Lesson saved successfully:', savedLesson)
      
      // Transform de backend response naar frontend formaat
      const transformedLesson = {
        ...savedLesson,
        status: savedLesson.status === 'PUBLISHED' ? 'PUBLISHED' : 
                savedLesson.status === 'ARCHIVED' ? 'ARCHIVED' : 'CONCEPT',
        // Zorg dat alle velden correct worden gemapped
        duration: savedLesson.durationMinutes || savedLesson.duration || 0,
        difficulty: savedLesson.difficulty || 'Beginner',
        type: savedLesson.type || 'TEXT',
        videoUrl: savedLesson.videoUrl || '',
        transcript: savedLesson.transcript || '' // NIEUW VELD TOEGEVOEGD
      }
      
      onSave(transformedLesson)
      setShowSuccessModal(true)
      
    } catch (error: any) {
      console.error('❌ Save error:', error)
      alert(`Fout bij opslaan lesson: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    onClose()
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Icons.video className="w-5 h-5" />
      case 'QUIZ': return <Icons.quiz className="w-5 h-5" />
      case 'DOWNLOAD': return <Icons.download className="w-5 h-5" />
      default: return <Icons.document className="w-5 h-5" />
    }
  }

  // Helper functie om YouTube URL te valideren
  const isValidYouTubeUrl = (url: string): boolean => {
    if (!url) return false
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    return youtubeRegex.test(url)
  }

  return (
    <>
      {/* Main Editor Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {lesson ? 'Les Bewerken' : 'Nieuwe Les Maken'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {lesson ? 'Bewerk de les details' : 'Maak een nieuwe les aan'}
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
                    placeholder="Bijv: Introductie tot Security"
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
                  placeholder="Korte beschrijving van de les..."
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Lesson Settings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    {lessonTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

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
                    Duur (minuten)
                  </label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', safeNumber(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (YouTube)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://www.youtube.com/watch?v=... of https://youtu.be/..."
                  disabled={isLoading}
                />
                <div className="mt-2 flex items-center space-x-2 text-xs">
                  {formData.videoUrl && (
                    <>
                      {isValidYouTubeUrl(formData.videoUrl) ? (
                        <span className="text-green-600 flex items-center">
                          <Icons.check className="w-4 h-4 mr-1" />
                          Geldige YouTube URL
                        </span>
                      ) : (
                        <span className="text-orange-600 flex items-center">
                          <Icons.warning className="w-4 h-4 mr-1" />
                          Mogelijk ongeldige YouTube URL
                        </span>
                      )}
                    </>
                  )}
                  <span className="text-gray-500">
                    Ondersteund: youtube.com/watch?v=... of youtu.be/...
                  </span>
                </div>
              </div>

              {/* Lesson Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Les Inhoud
                </label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Volledige inhoud van de les (getoond in 'Les Inhoud' tab)..."
                  disabled={isLoading}
                />
              </div>

              {/* Transcript - NIEUW VELD TOEGEVOEGD */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Transcript
                </label>
                <textarea
                  rows={8}
                  value={formData.transcript}
                  onChange={(e) => handleInputChange('transcript', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Volledige transcript van de video (getoond in 'Transcript' tab)..."
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Dit transcript wordt getoond wanneer gebruikers op de "Transcript" tab klikken
                </p>
              </div>

              {/* Objectives */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leerdoelen
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={objectiveInput}
                    onChange={(e) => setObjectiveInput(e.target.value)}
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
                    value={prerequisiteInput}
                    onChange={(e) => setPrerequisiteInput(e.target.value)}
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

              {/* Resources */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bronnen (extra links)
                </label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={resourceInput}
                    onChange={(e) => setResourceInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddResource())}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Voeg bron toe (URL of beschrijving)..."
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={handleAddResource}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    disabled={isLoading}
                  >
                    Toevoegen
                  </button>
                </div>
                <ul className="space-y-2">
                  {formData.resources.map((resource, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg border">
                      <span className="text-gray-700">{resource}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveResource(resource)}
                        className="text-gray-500 hover:text-red-600"
                        disabled={isLoading}
                      >
                        <Icons.trash className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tags */}
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
                  {formData.tags.map((tag, index) => (
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
                </div>
              </div>

              {/* Status and Order */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volgorde
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
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {formData.type} • {formData.duration} minuten
                  {formData.videoUrl && ' • 📹 Video beschikbaar'}
                  {formData.transcript && ' • 📝 Transcript beschikbaar'}
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
                    {isLoading ? 'Opslaan...' : (lesson ? 'Bijwerken' : 'Les Aanmaken')}
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
                De les is succesvol opgeslagen in het systeem.
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

export default LessonEditor