// 📁 BESTAND: /src/components/LessonEditor.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'


// ✅ GEBRUIK DEZELFDE INTERFACE ALS IN PAGE.TSX
interface Lesson {
  id: string  // ✅ Verander van optioneel naar verplicht
  title: string
  description: string
  status: 'Actief' | 'Inactief' | 'Concept'
  category: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  type?: 'Video' | 'Artikel' | 'Quiz' | 'Interactief'
  order?: number
  tags?: string[]
  videoUrl?: string
  content?: string
  // VOEG DEZE OPTIONELE PROPERTIES TOE voor compatibiliteit:
  isFree?: boolean
  modules?: number
  quizQuestions?: number
  completionRate?: number
  createdAt?: string
  updatedAt?: string
}

interface LessonEditorProps {
  lesson: Lesson | null
  categories: string[]
  lessonTypes: string[]
  onClose: () => void
  onSave: (lesson: Lesson) => void
}

export default function LessonEditor({ lesson, categories, lessonTypes, onClose, onSave }: LessonEditorProps) {
  const [formData, setFormData] = useState<Omit<Lesson, 'id'> & { id?: string }>({
    title: '',
    description: '',
    status: 'Concept',
    category: '',
    duration: 0,
    difficulty: 'Beginner',
    type: 'Video',
    tags: [],
    videoUrl: '',
    content: '',
    modules: 0,
    quizQuestions: 0,
    order: 0
  })

  const [aiInput, setAiInput] = useState('')
  const [showAiImport, setShowAiImport] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Initialize form with lesson data when editing
  useEffect(() => {
    if (lesson) {
      setFormData(lesson)
    } else {
      // Reset form for new lesson
      setFormData({
        title: '',
        description: '',
        status: 'Concept',
        category: '',
        duration: 0,
        difficulty: 'Beginner',
        type: 'Video',
        tags: [],
        videoUrl: '',
        content: '',
        modules: 0,
        quizQuestions: 0,
        order: 0
      })
    }
  }, [lesson])

  const handleInputChange = (field: keyof typeof formData, value: any) => {
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
        title: parsedData.title || parsedData.lesson_title || parsedData.name || prev.title,
        description: parsedData.description || parsedData.lesson_description || parsedData.summary || prev.description,
        category: parsedData.category || parsedData.topic || prev.category,
        duration: parsedData.duration || parsedData.duration_minutes || parsedData.time_required || prev.duration,
        difficulty: parsedData.difficulty || parsedData.difficulty_level || parsedData.level || prev.difficulty,
        type: parsedData.type || parsedData.content_type || parsedData.format || prev.type,
        content: parsedData.content || parsedData.lesson_content || parsedData.body || prev.content,
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

    // Extract content (everything after "Content:")
    const contentMatch = text.match(/Content:\s*([\s\S]+)/i)
    if (contentMatch) result.content = contentMatch[1].trim()

    // Extract category
    const categoryMatch = text.match(/Categorie:\s*(.+)/i)
    if (categoryMatch) result.category = categoryMatch[1].trim()

    // Extract duration
    const durationMatch = text.match(/Duur:\s*(\d+)/i)
    if (durationMatch) result.duration = parseInt(durationMatch[1])

    // Extract difficulty
    const difficultyMatch = text.match(/Moeilijkheid:\s*(Beginner|Intermediate|Expert)/i)
    if (difficultyMatch) result.difficulty = difficultyMatch[1]

    // Extract type
    const typeMatch = text.match(/Type:\s*(Video|Artikel|Quiz|Interactief)/i)
    if (typeMatch) result.type = typeMatch[1]

    return result
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }))
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
      // Bereken order (simpele versie)
      const order = lesson?.order || 1

      // Zorg dat content een string is
      let contentString = formData.content
      if (typeof contentString === 'object') {
        contentString = JSON.stringify(contentString)
      }

      const lessonData = {
        ...formData,
        content: contentString,
        order: order,
        duration: parseInt(formData.duration.toString()) || 0,
      }

      console.log('Saving lesson to database:', lessonData)

      // ✅ FIX: Doe de API call direct in de editor
      const url = '/api/lessons'
      const method = lesson?.id ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Opslaan mislukt')
      }

      const savedLesson = await response.json()
      
      // ✅ Roep onSave aan met de opgeslagen data
      onSave(savedLesson)
      
      // ✅ Toon success modal
      setShowSuccessModal(true)
      
    } catch (error: any) {
      console.error('Save error:', error)
      alert(`Fout bij opslaan les: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    onClose() // Sluit de editor
  }

  return (
    <>
      {/* Hoofd Editor Modal */}
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
                        placeholder="Plak hier je ChatGPT output...

Voorbeeld format:
Titel: Phishing Herkennen - Basis
Beschrijving: Leer de belangrijkste signalen van phishing emails herkennen
Content: In deze les leer je hoe je phishing emails kunt herkennen aan de hand van 5 rode vlaggen...

Of gebruik JSON format:
{
  'title': 'Phishing Herkennen',
  'description': 'Leer phishing herkennen...',
  'category': 'Security Basics',
  'duration': 15,
  'difficulty': 'Beginner',
  'type': 'Video',
  'content': 'Les content hier...',
  'tags': ['phishing', 'security']
}"
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
                    placeholder="Bijv: Phishing Herkennen - Basis"
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
                    {categories.map(category => (
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

              {/* Lesson Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Les Content
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Volledige les content, tekst, uitleg, etc..."
                  disabled={isLoading}
                />
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    {lessonTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moeilijkheid
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => handleInputChange('difficulty', e.target.value as any)}
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
                    onChange={(e) => handleInputChange('duration', parseInt(e.target.value) || 0)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as any)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={isLoading}
                  >
                    <option value="Concept">Concept</option>
                    <option value="Actief">Actief</option>
                    <option value="Inactief">Inactief</option>
                  </select>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video URL (optioneel)
                </label>
                <input
                  type="url"
                  value={formData.videoUrl || ''}
                  onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://youtube.com/..."
                  disabled={isLoading}
                />
              </div>

             {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {/* Safe tags rendering */}
                  {Array.isArray(formData.tags) && formData.tags.map((tag, index) => (
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
              <div className="flex items-center justify-end space-x-3">
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
          </form>
        </div>
      </div>

      {/* ✅ NIEUW: Success Modal */}
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