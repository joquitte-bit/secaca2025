// src/app/dashboard/lessons/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'
import LessonEditor from '@/components/LessonEditor'

interface Lesson {
  id: string
  title: string
  description: string
  content: string
  type: 'VIDEO' | 'QUIZ' | 'TEXT' | 'DOWNLOAD'
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  duration: number
  category: string
  tags: string[]
  status: 'PUBLISHED' | 'ARCHIVED' | 'CONCEPT'  // Gebruik CONCEPT i.p.v. DRAFT
  order: number
  resources: string[]
  objectives: string[]
  prerequisites: string[]
  createdAt: string
  updatedAt: string
  moduleId?: string
  courseId?: string
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedLessons, setSelectedLessons] = useState<string[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  // Available categories
  const categories = [
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

  // Fetch lessons from API
const fetchLessons = async () => {
  try {
    console.log('🔄 Fetching lessons from API...')
    setIsLoading(true)
    
    const response = await fetch('/api/lessons')
    console.log('📡 API Response status:', response.status)
    
    if (!response.ok) {
      throw new Error('Failed to fetch lessons')
    }
    
    const lessonsData = await response.json()
    console.log('📊 Lessons data received:', lessonsData)
    
    // Transform alle velden van backend naar frontend
    const transformedLessons = lessonsData.map((lesson: any) => ({
      ...lesson,
      status: lesson.status === 'PUBLISHED' ? 'PUBLISHED' : 
              lesson.status === 'ARCHIVED' ? 'ARCHIVED' : 'CONCEPT',
      duration: lesson.durationMinutes || lesson.duration || 0, // Map durationMinutes naar duration
      difficulty: lesson.difficulty || 'Beginner',
      type: lesson.type || 'TEXT',
      category: lesson.category || '',
      tags: Array.isArray(lesson.tags) ? lesson.tags : []
    }))
    
    console.log('🔄 Transformed lessons:', transformedLessons)
    setLessons(transformedLessons)
  } catch (error) {
    console.error('❌ Error fetching lessons:', error)
    alert('Fout bij ophalen lessons')
  } finally {
    setIsLoading(false)
  }
}

  useEffect(() => {
    fetchLessons()
  }, [])

  // Filter lessons based on search and filters
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = searchTerm === '' || 
      lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.tags.some((tag: string) => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
    
    const matchesStatus = statusFilter === '' || lesson.status === statusFilter
    const matchesCategory = categoryFilter === '' || lesson.category === categoryFilter
    const matchesDifficulty = difficultyFilter === '' || lesson.difficulty === difficultyFilter
    const matchesType = typeFilter === '' || lesson.type === typeFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesDifficulty && matchesType
  })

  // Handle lesson selection
  const handleLessonSelect = (lessonId: string) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    )
  }

  // Handle select all
  const handleSelectAll = () => {
    setSelectedLessons(
      selectedLessons.length === filteredLessons.length
        ? []
        : filteredLessons.map(lesson => lesson.id)
    )
  }

  // Handle new lesson
  const handleNewLesson = () => {
    setEditingLesson(null)
    setShowEditor(true)
  }

  // Handle edit lesson
  const handleEditLesson = (lesson: Lesson) => {
    console.log('Edit lesson:', lesson)
    setEditingLesson(lesson)
    setShowEditor(true)
  }

  // Handle save lesson
  const handleSaveLesson = (savedLesson: Lesson) => {
    if (editingLesson) {
      // Update existing lesson
      setLessons(prev => prev.map(lesson =>
        lesson.id === savedLesson.id ? savedLesson : lesson
      ))
    } else {
      // Add new lesson
      setLessons(prev => [savedLesson, ...prev])
    }
    setShowEditor(false)
    setEditingLesson(null)
  }

  // Handle delete lesson
  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('Weet je zeker dat je deze les wilt verwijderen?')) {
      return
    }

    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete lesson')
      }

      // Update local state
      setLessons(prev => prev.filter(lesson => lesson.id !== lessonId))
      setSelectedLessons(prev => prev.filter(id => id !== lessonId))
      
      console.log(`✅ Lesson ${lessonId} deleted successfully`)
    } catch (error: any) {
      console.error('❌ Error deleting lesson:', error)
      alert(`Fout bij verwijderen lesson: ${error.message}`)
    }
  }

  // Handle status toggle (lightning icon) - GECORRIGEERDE VERSIE
  const handleStatusToggle = async (lessonId: string, currentStatus: string) => {
    try {
      console.log(`🔄 Updating lesson ${lessonId} status from ${currentStatus}`)
      
      // Bepaal nieuwe status - toggle tussen PUBLISHED en ARCHIVED
      const newStatus = currentStatus === 'PUBLISHED' ? 'ARCHIVED' : 'PUBLISHED'
      
      console.log(`🎯 New status will be: ${newStatus}`)

      // Map naar backend formaat
      const statusMapping = {
        'PUBLISHED': 'Actief',
        'ARCHIVED': 'Inactief',
        'DRAFT': 'Concept'
      }

      const backendStatus = statusMapping[newStatus as keyof typeof statusMapping]
      console.log(`📤 Sending to backend: ${backendStatus}`)

      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: backendStatus
        }),
      })

      console.log('📡 Status update response:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Server error response:', errorText)
        throw new Error(`Failed to update lesson ${lessonId}: ${response.status} ${response.statusText}`)
      }

      const updatedLesson = await response.json()
      console.log('✅ Lesson status updated successfully:', updatedLesson)
      
      // Update local state DIRECT met de nieuwe status
      setLessons(prev => prev.map(lesson => 
        lesson.id === lessonId ? {
          ...lesson,
          status: newStatus // Gebruik de nieuwe status direct
        } : lesson
      ))
      
      console.log('✅ UI updated with new status:', newStatus)
      
    } catch (error: any) {
      console.error('❌ Error updating lesson status:', error)
      alert(`Fout bij bijwerken status lesson: ${error.message}`)
    }
  }

  // Handle bulk status toggle - GECORRIGEERDE VERSIE
  const handleBulkStatusToggle = async (newStatus: 'PUBLISHED' | 'ARCHIVED') => {
    try {
      console.log(`🔄 Bulk updating ${selectedLessons.length} lessons to ${newStatus}`)
      
      // Map naar backend formaat
      const statusMapping = {
        'PUBLISHED': 'Actief',
        'ARCHIVED': 'Inactief',
        'DRAFT': 'Concept'
      }

      for (const lessonId of selectedLessons) {
        const response = await fetch(`/api/lessons/${lessonId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: statusMapping[newStatus]
          }),
        })

        if (!response.ok) {
          console.warn(`⚠️ Failed to update lesson ${lessonId}, continuing with others...`)
          continue
        }
      }

      // Refresh lessons
      fetchLessons()
      setSelectedLessons([])
      
      console.log(`✅ Bulk status update to ${newStatus} completed`)
    } catch (error: any) {
      console.error('❌ Error in bulk status toggle:', error)
      alert(`Fout bij bijwerken status lessons: ${error.message}`)
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!confirm(`Weet je zeker dat je ${selectedLessons.length} lessons wilt verwijderen?`)) {
      return
    }

    try {
      for (const lessonId of selectedLessons) {
        const response = await fetch(`/api/lessons/${lessonId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error(`Failed to delete lesson ${lessonId}`)
        }
      }

      // Refresh lessons
      fetchLessons()
      setSelectedLessons([])
      
      console.log(`✅ Bulk delete completed for ${selectedLessons.length} lessons`)
    } catch (error: any) {
      console.error('❌ Error in bulk delete:', error)
      alert(`Fout bij verwijderen lessons: ${error.message}`)
    }
  }

  // Handle view lesson (eye icon)
  const handleViewLesson = (lesson: Lesson) => {
    alert(`Bekijk lesson: ${lesson.title}\n\nBeschrijving: ${lesson.description}\n\nType: ${lesson.type}\n\nDuur: ${lesson.duration} minuten`)
  }

  // Get status color - MET KLEUREN VOOR DUIDELIJKHEID
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'bg-green-100 text-green-800 border border-green-200'
    case 'CONCEPT':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'ARCHIVED':
      return 'bg-gray-100 text-gray-600 border border-gray-300'
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-300'
  }
}

// Status display text
const getStatusText = (status: string) => {
  switch (status) {
    case 'PUBLISHED':
      return 'Actief'
    case 'CONCEPT':
      return 'Concept'
    case 'ARCHIVED':
      return 'Inactief'
    default:
      return status
  }
}

  // Get difficulty color - MINIMALIST VERSION
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-gray-100 text-gray-700 border border-gray-300'
      case 'Intermediate':
        return 'bg-gray-100 text-gray-700 border border-gray-300'
      case 'Expert':
        return 'bg-gray-100 text-gray-700 border border-gray-300'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300'
    }
  }

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO': return <Icons.video className="w-4 h-4 text-blue-600" />
      case 'QUIZ': return <Icons.quiz className="w-4 h-4 text-purple-600" />
      case 'DOWNLOAD': return <Icons.download className="w-4 h-4 text-green-600" />
      default: return <Icons.document className="w-4 h-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lessons</h1>
              <p className="text-gray-600">Beheer alle lessons</p>
            </div>
            <button 
              onClick={handleNewLesson}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <Icons.add className="w-5 h-5 mr-2" />
              Nieuwe Lesson
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS - MINIMALIST STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.lessons className="w-6 h-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.check className="w-6 h-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gepubliceerd</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lessons.filter(l => l.status === 'PUBLISHED').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.video className="w-6 h-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Video Lessons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lessons.filter(l => l.type === 'VIDEO').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.clock className="w-6 h-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gem. Duur</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lessons.length > 0 ? Math.round(lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0) / lessons.length) : 0} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BULK ACTIONS BAR - MINIMALIST STYLE */}
        {selectedLessons.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icons.document className="w-5 h-5 text-gray-700 mr-2" />
                <span className="text-gray-800 font-medium">
                  {selectedLessons.length} lesson(s) geselecteerd
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkStatusToggle('PUBLISHED')}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Publiceren
                </button>
                <button
                  onClick={() => handleBulkStatusToggle('ARCHIVED')}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Archiveren
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Verwijderen
                </button>
                <button
                  onClick={() => setSelectedLessons([])}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                >
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH AND FILTERS - IMPROVED VERSION */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Zoeken op titel, beschrijving of tags..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Icons.search className="w-4 h-4" />
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[140px]"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">Alle statussen</option>
                    <option value="PUBLISHED">Actief</option>
                    <option value="DRAFT">Concept</option>
                    <option value="ARCHIVED">Inactief</option>
                  </select>
                  
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[160px]"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">Alle categorieën</option>
                    {Array.from(new Set(lessons.map(l => l.category))).map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>

                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[150px]"
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                  >
                    <option value="">Alle niveaus</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>

                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[140px]"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                  >
                    <option value="">Alle types</option>
                    <option value="VIDEO">Video</option>
                    <option value="QUIZ">Quiz</option>
                    <option value="TEXT">Text</option>
                    <option value="DOWNLOAD">Download</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                {filteredLessons.length} van {lessons.length} lessons
              </div>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      checked={selectedLessons.length === filteredLessons.length && filteredLessons.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lesson
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moeilijkheid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aangemaakt
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLessons.map((lesson) => (
                  <tr key={lesson.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedLessons.includes(lesson.id)}
                        onChange={() => handleLessonSelect(lesson.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{lesson.title}</div>
                        <div className="text-sm text-gray-500">{lesson.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        {getTypeIcon(lesson.type)}
                        <span className="ml-2 capitalize">{lesson.type.toLowerCase()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                        {getStatusText(lesson.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lesson.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                        {lesson.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.clock className="w-4 h-4 text-gray-400 mr-1" />
                        {lesson.duration} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(lesson.createdAt).toLocaleDateString('nl-NL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Eye icon - View */}
                        <button
                          onClick={() => handleViewLesson(lesson)}
                          className="text-gray-600 hover:text-blue-600 transition-colors p-1 rounded hover:bg-gray-100"
                          title="Bekijk lesson"
                        >
                          <Icons.eye className="w-4 h-4" />
                        </button>

                        {/* Edit icon */}
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className="text-gray-600 hover:text-blue-600 transition-colors p-1 rounded hover:bg-gray-100"
                          title="Bewerk lesson"
                        >
                          <Icons.edit className="w-4 h-4" />
                        </button>

                        {/* Status toggle icon - GECORRIGEERDE VERSIE */}
                        <button
                          onClick={() => handleStatusToggle(lesson.id, lesson.status)}
                          className="text-gray-600 hover:text-yellow-600 transition-colors p-1 rounded hover:bg-gray-100"
                          title={lesson.status === 'PUBLISHED' ? 'Deactiveren' : 'Activeren'}
                        >
                          <Icons.bolt className="w-4 h-4" />
                        </button>

                        {/* Delete icon */}
                        <button
                          onClick={() => handleDeleteLesson(lesson.id)}
                          className="text-gray-600 hover:text-red-600 transition-colors p-1 rounded hover:bg-gray-100"
                          title="Verwijder lesson"
                        >
                          <Icons.trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lesson Editor Modal */}
        {showEditor && (
          <LessonEditor
            lesson={editingLesson}
            categories={categories}
            onClose={() => {
              setShowEditor(false)
              setEditingLesson(null)
            }}
            onSave={handleSaveLesson}
          />
        )}
      </div>
    </div>
  )
}