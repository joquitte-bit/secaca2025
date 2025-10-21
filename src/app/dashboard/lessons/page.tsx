// src/app/dashboard/lessons/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'
import { ActionButtons } from '@/components/ActionButtons'
import ViewLessonModal from '@/components/ViewLessonModal'  // ✅ CORRECT: default import
import LessonEditor from '@/components/LessonEditor'

interface Lesson {
  id: string
  title: string
  description: string
  status: 'Actief' | 'Inactief' | 'Concept'
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  duration: number
  isFree: boolean
  order: number
  modules: number
  quizQuestions: number
  completionRate: number
  tags: string[]
  createdAt: string
  updatedAt: string
  type?: 'Video' | 'Artikel' | 'Quiz' | 'Interactief'
  content?: string
  videoUrl?: string
}

interface Module {
  id: string
  title: string
  description?: string
  status?: string
  duration?: number
  category?: string
  lessons?: number
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [selectedLessons, setSelectedLessons] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Alle statussen')
  const [categoryFilter, setCategoryFilter] = useState('Alle categorieën')
  const [difficultyFilter, setDifficultyFilter] = useState('Alle niveaus')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // MODAL STATES
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)

  // VERVANG MOCK DATA MET ECHTE API CALL
  useEffect(() => {
    fetchLessons()
    fetchModules()
  }, [])

  const fetchLessons = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('🔄 Fetching lessons from API...')
      
      const response = await fetch('/api/lessons')
      
      console.log('📡 API Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lessons: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📊 Lessons data received:', data)
      console.log('🔍 Number of lessons:', data.length)
      
      setLessons(data)
      
    } catch (err) {
      console.error('❌ Error fetching lessons:', err)
      setError('Failed to load lessons: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const fetchModules = async () => {
    try {
      const response = await fetch('/api/modules')
      if (response.ok) {
        const modulesData = await response.json()
        setModules(modulesData)
      }
    } catch (err) {
      console.error('Error fetching modules:', err)
    }
  }

  // ACTION HANDLERS
  const handleEditLesson = (lesson: Lesson) => {
    console.log('Edit lesson:', lesson)
    setSelectedLesson(lesson)
    setEditModalOpen(true)
  }

  const handleDeleteLesson = async (lesson: Lesson) => {
    if (confirm(`Weet je zeker dat je "${lesson.title}" wilt verwijderen?`)) {
      try {
        console.log('Deleting lesson:', lesson.id)
        
        const response = await fetch(`/api/lessons?id=${lesson.id}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error('Failed to delete lesson')
        }

        // Update local state
        setLessons(prev => prev.filter(l => l.id !== lesson.id))
        console.log('✅ Lesson deleted successfully')
        
      } catch (err) {
        console.error('❌ Error deleting lesson:', err)
        alert('Error deleting lesson: ' + (err instanceof Error ? err.message : 'Unknown error'))
      }
    }
  }

  const handleViewLesson = (lesson: Lesson) => {
    console.log('View lesson:', lesson)
    setSelectedLesson(lesson)
    setViewModalOpen(true)
  }

  const handleStatusToggle = async (lesson: Lesson) => {
    try {
      const newStatus = lesson.status === 'Actief' ? 'Inactief' : 'Actief'
      console.log(`Toggling lesson status from ${lesson.status} to ${newStatus}`)

      const response = await fetch(`/api/lessons`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: lesson.id,
          status: newStatus
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update lesson status')
      }

      // Update local state
      setLessons(prev => prev.map(l => 
        l.id === lesson.id ? { ...l, status: newStatus } : l
      ))
      
      console.log('✅ Lesson status updated successfully')
      
    } catch (err) {
      console.error('❌ Error updating lesson status:', err)
      alert('Error updating lesson status: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleLessonUpdate = async (updatedLessonData: any) => {
    try {
      console.log('Updating lesson:', updatedLessonData)
      
      const response = await fetch(`/api/lessons`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedLessonData),
      })

      if (!response.ok) {
        throw new Error('Failed to update lesson')
      }

      const updatedLesson = await response.json()

      // Update local state
      setLessons(prev => prev.map(lesson => 
        lesson.id === updatedLesson.id ? updatedLesson : lesson
      ))

      setEditModalOpen(false)
      setSelectedLesson(null)
      
      console.log('✅ Lesson updated successfully')
      
    } catch (err) {
      console.error('❌ Error updating lesson:', err)
      alert('Error updating lesson: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleCreateLesson = async (lessonData: any) => {
    try {
      console.log('Creating new lesson:', lessonData)
      
      const response = await fetch('/api/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData),
      })

      if (!response.ok) {
        throw new Error('Failed to create lesson')
      }

      const newLesson = await response.json()

      // Update local state
      setLessons(prev => [...prev, newLesson])

      setEditModalOpen(false)
      setSelectedLesson(null)
      
      console.log('✅ Lesson created successfully')
      
    } catch (err) {
      console.error('❌ Error creating lesson:', err)
      alert('Error creating lesson: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  const handleNewLesson = () => {
    setSelectedLesson(null)
    setEditModalOpen(true)
  }

  // BULK ACTIONS
  const handleBulkDelete = async () => {
    if (selectedLessons.length === 0) return
    
    if (confirm(`Weet je zeker dat je ${selectedLessons.length} lesson(s) wilt verwijderen?`)) {
      try {
        console.log('Bulk deleting lessons:', selectedLessons)
        
        // TODO: Implement bulk delete API call
        // For now, delete individually
        for (const lessonId of selectedLessons) {
          const response = await fetch(`/api/lessons?id=${lessonId}`, {
            method: 'DELETE',
          })
          
          if (!response.ok) {
            throw new Error(`Failed to delete lesson ${lessonId}`)
          }
        }

        // Update local state
        setLessons(prev => prev.filter(lesson => !selectedLessons.includes(lesson.id)))
        setSelectedLessons([])
        
        console.log('✅ Bulk delete completed')
        
      } catch (err) {
        console.error('❌ Error in bulk delete:', err)
        alert('Error deleting lessons: ' + (err instanceof Error ? err.message : 'Unknown error'))
      }
    }
  }

  const handleBulkStatusToggle = async (newStatus: 'Actief' | 'Inactief') => {
    if (selectedLessons.length === 0) return
    
    try {
      console.log(`Bulk updating ${selectedLessons.length} lessons to ${newStatus}`)
      
      // TODO: Implement bulk update API call
      // For now, update individually
      for (const lessonId of selectedLessons) {
        const response = await fetch(`/api/lessons`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: lessonId,
            status: newStatus
          }),
        })
        
        if (!response.ok) {
          throw new Error(`Failed to update lesson ${lessonId}`)
        }
      }

      // Update local state
      setLessons(prev => prev.map(lesson => 
        selectedLessons.includes(lesson.id) ? { ...lesson, status: newStatus } : lesson
      ))
      
      console.log('✅ Bulk status update completed')
      
    } catch (err) {
      console.error('❌ Error in bulk status update:', err)
      alert('Error updating lessons: ' + (err instanceof Error ? err.message : 'Unknown error'))
    }
  }

  // Filter lessons
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'Alle statussen' || lesson.status === statusFilter
    const matchesCategory = categoryFilter === 'Alle categorieën' || lesson.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'Alle niveaus' || lesson.difficulty === difficultyFilter
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDifficulty
  })

  const toggleLessonSelection = (lessonId: string) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    )
  }

  const toggleAllLessons = () => {
    setSelectedLessons(
      selectedLessons.length === filteredLessons.length
        ? []
        : filteredLessons.map(lesson => lesson.id)
    )
  }

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actief': return 'bg-green-100 text-green-800'
      case 'Inactief': return 'bg-red-100 text-red-800'
      case 'Concept': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-blue-100 text-blue-800'
      case 'Expert': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL')
  }

  // Data voor LessonEditor
  const categories = Array.from(new Set(lessons.map(l => l.category)))
  const lessonTypes = ['Video', 'Artikel', 'Quiz', 'Interactief']

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 w-full p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Lessons laden...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 w-full p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center">
            <Icons.shield className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-lg font-medium text-red-800">Error</h3>
          </div>
          <p className="mt-2 text-red-700">{error}</p>
          <button 
            onClick={fetchLessons}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lessons</h1>
              <p className="text-gray-600">Beheer alle lessen</p>
            </div>
            <button 
              onClick={handleNewLesson}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Nieuwe Lesson
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS - AANGEPAST */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icons.lessons className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Lessons</p>
                <p className="text-2xl font-bold text-gray-900">{lessons.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icons.clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actieve Lessons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lessons.filter(l => l.status === 'Actief').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Icons.modules className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gem. Duur</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lessons.length > 0 ? Math.round(lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0) / lessons.length) : 0} min
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Icons.document className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Quizzen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {lessons.reduce((acc, lesson) => acc + (lesson.quizQuestions || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BULK ACTIONS BAR */}
        {selectedLessons.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icons.document className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  {selectedLessons.length} lesson(s) geselecteerd
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkStatusToggle('Actief')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Activeren
                </button>
                <button
                  onClick={() => handleBulkStatusToggle('Inactief')}
                  className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
                >
                  Deactiveren
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Verwijderen
                </button>
                <button
                  onClick={() => setSelectedLessons([])}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH AND FILTERS */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Zoeken op titel, beschrijving of tags..."
                    className="w-full md:w-80 border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute left-3 top-2.5 text-gray-400">
                    <Icons.search className="w-4 h-4" />
                  </div>
                </div>
                
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>Alle statussen</option>
                  <option>Actief</option>
                  <option>Inactief</option>
                  <option>Concept</option>
                </select>
                
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option>Alle categorieën</option>
                  {Array.from(new Set(lessons.map(l => l.category))).map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>

                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                >
                  <option>Alle niveaus</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredLessons.length} van {lessons.length} lessons
              </div>
            </div>
          </div>

          {/* TABLE - AANGEPAST MET ACTIONBUTTONS */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      checked={selectedLessons.length === filteredLessons.length && filteredLessons.length > 0}
                      onChange={toggleAllLessons}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lesson
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modules
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quiz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Volgorde
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laatst bijgewerkt
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
                        onChange={() => toggleLessonSelection(lesson.id)}
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
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(lesson.status)}`}>
                        {lesson.status}
                      </span>
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.modules className="w-4 h-4 text-gray-400 mr-1" />
                        {lesson.modules}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.document className="w-4 h-4 text-gray-400 mr-1" />
                        {lesson.quizQuestions}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {lesson.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(lesson.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <ActionButtons
                        entity={lesson}
                        entityType="lesson"
                        onEdit={handleEditLesson}
                        onDelete={handleDeleteLesson}
                        onView={handleViewLesson}
                        onStatusToggle={handleStatusToggle}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-4">
          Sleep lessons om volgorde aan te passen
        </div>

        {/* MODALS */}
        {selectedLesson && (
          <ViewLessonModal
            lesson={selectedLesson}
            isOpen={viewModalOpen}
            onClose={() => {
              setViewModalOpen(false)
              setSelectedLesson(null)
            }}
          />
        )}
        
        {/* EDIT MODAL - Gebruik LessonEditor met CORRECTE prop naam */}
        {editModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {selectedLesson ? 'Les Bewerken' : 'Nieuwe Les Aanmaken'}
                </h2>
                <LessonEditor
                  lesson={selectedLesson}  
                  categories={categories}
                  lessonTypes={lessonTypes}
                  onClose={() => {
                    setEditModalOpen(false)
                    setSelectedLesson(null)
                  }}
                  onSave={selectedLesson ? handleLessonUpdate : handleCreateLesson}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}