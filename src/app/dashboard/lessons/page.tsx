// 📁 BESTAND: /src/app/dashboard/lessons/page.tsx
'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Icons } from '@/components/Icons'
import { LessonModal } from '@/components/LessonModal'
import { SortableLesson } from '@/components/SortableLesson'

// ✅ GECORRIGEERDE Lesson interface - consistent met SortableLesson
interface Lesson {
  id: string
  title: string
  description: string
  category: string
  difficulty?: 'Beginner' | 'Intermediate' | 'Expert'
  status: 'Actief' | 'Inactief' | 'Concept'
  type: 'Video' | 'Artikel' | 'Quiz' | 'Interactief'
  duration: number
  content?: string
  tags?: string[]
  order?: number
  modules?: any[]
  moduleCount?: number
  includedInModules?: number
  includedInCourses?: number
  completionRate?: number
  createdAt?: string
  updatedAt?: string
}

// Module interface
interface Module {
  id: string
  title: string
  description?: string
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Haal lessons EN modules op van de database
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Haal lessons op
        const lessonsResponse = await fetch('/api/lessons')
        if (!lessonsResponse.ok) {
          throw new Error(`Failed to fetch lessons: ${lessonsResponse.status}`)
        }
        
        const lessonsData = await lessonsResponse.json()
        console.log('📥 Lessons API Response data:', lessonsData)
        
        // Haal modules op
        const modulesResponse = await fetch('/api/modules')
        let modulesData: Module[] = []
        if (modulesResponse.ok) {
          modulesData = await modulesResponse.json()
          console.log('📥 Modules API Response data:', modulesData)
        } else {
          console.warn('⚠️ Could not fetch modules, using empty array')
        }
        
        setModules(modulesData)

        // Transformeer lessons data
        if (Array.isArray(lessonsData)) {
          const transformedLessons = lessonsData.map((lesson: any) => ({
            id: lesson.id || '',
            title: lesson.title || 'Untitled Lesson',
            description: lesson.description || '',
            status: lesson.status || 'Concept',
            category: lesson.category || 'Uncategorized',
            duration: lesson.duration || lesson.durationMinutes || 0,
            difficulty: lesson.difficulty || 'Beginner',
            type: lesson.type || 'Artikel',
            order: lesson.order || 0,
            tags: Array.isArray(lesson.tags) 
              ? lesson.tags 
              : typeof lesson.tags === 'string' 
                ? JSON.parse(lesson.tags || '[]')
                : [],
            // ✅ CRITICAL FIX: Gebruik moduleCount van API, fallback naar modules.length
            moduleCount: lesson.moduleCount || (lesson.modules ? lesson.modules.length : 0),
            includedInModules: lesson.moduleCount || lesson.includedInModules || (lesson.modules ? lesson.modules.length : 0),
            includedInCourses: lesson.includedInCourses || 0,
            completionRate: lesson.completionRate || 0,
            createdAt: lesson.createdAt || new Date().toISOString().split('T')[0],
            updatedAt: lesson.updatedAt || new Date().toISOString().split('T')[0],
            modules: lesson.modules || []
          }))
          setLessons(transformedLessons)
          console.log(`✅ Loaded ${transformedLessons.length} lessons and ${modulesData.length} modules`)
          console.log('📊 Module counts sample:', transformedLessons.map((l: any) => ({ 
            title: l.title, 
            moduleCount: l.moduleCount,
            modules: l.modules?.length 
          })))
        } else {
          console.log('❌ No lessons array found in response:', lessonsData)
          setLessons([])
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please try again.')
        setLessons([])
        setModules([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const [categories] = useState([
    'Security Basics',
    'Advanced Security', 
    'Data Security',
    'Compliance',
    'Technical Security'
  ])

  const [lessonTypes] = useState([
    'Video',
    'Artikel', 
    'Quiz',
    'Interactief'
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState<'title' | 'order' | 'completionRate' | 'duration' | 'updatedAt' | 'moduleCount'>('order')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Bulk actions state
  const [selectedLessons, setSelectedLessons] = useState<string[]>([])

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
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Video': return 'bg-purple-100 text-purple-800'
      case 'Artikel': return 'bg-blue-100 text-blue-800'
      case 'Quiz': return 'bg-orange-100 text-orange-800'
      case 'Interactief': return 'bg-pink-100 text-pink-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Filtered and sorted lessons
  const filteredLessons = useMemo(() => {
    if (!lessons || !Array.isArray(lessons)) {
      return []
    }

    let filtered = lessons.filter((lesson: Lesson) => {
      const title = lesson?.title || ''
      const description = lesson?.description || ''
      const tags = lesson?.tags || []
      const category = lesson?.category || ''
      const status = lesson?.status || 'Concept'
      const difficulty = lesson?.difficulty || 'Beginner'
      const type = lesson?.type || 'Artikel'

      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = !selectedCategory || category === selectedCategory
      const matchesStatus = !selectedStatus || status === selectedStatus
      const matchesDifficulty = !selectedDifficulty || difficulty === selectedDifficulty
      const matchesType = !selectedType || type === selectedType
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty && matchesType
    })

    // Sorting
    filtered.sort((a: Lesson, b: Lesson) => {
      let aValue: any = a[sortBy] || 0
      let bValue: any = b[sortBy] || 0
      
      if (sortBy === 'updatedAt') {
        aValue = new Date(aValue).getTime() || 0
        bValue = new Date(bValue).getTime() || 0
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [lessons, searchTerm, selectedCategory, selectedStatus, selectedDifficulty, selectedType, sortBy, sortOrder])

  // Reset alle filters
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedStatus('')
    setSelectedDifficulty('')
    setSelectedType('')
    setSortBy('order')
    setSortOrder('asc')
  }

  // Lesson actions
  const handleDeleteLesson = async (lessonId: string) => {
    if (!lessonId) {
      console.error('❌ No lesson ID provided for deletion')
      alert('Error: No lesson ID provided')
      return
    }

    if (confirm('Weet je zeker dat je deze les wilt verwijderen?')) {
      try {
        console.log(`🗑️ Attempting to delete lesson: ${lessonId}`)
        
        const response = await fetch(`/api/lessons/${lessonId}`, {
          method: 'DELETE',
        })

        console.log(`📨 Delete response status: ${response.status}`)

        if (response.ok) {
          console.log(`✅ Successfully deleted lesson: ${lessonId}`)
          setLessons(lessons.filter(lesson => lesson.id !== lessonId))
          setSelectedLessons(prev => prev.filter(id => id !== lessonId))
        } else {
          const errorText = await response.text()
          console.error(`❌ Failed to delete lesson: ${response.status} - ${errorText}`)
          alert(`Failed to delete lesson: ${response.status}`)
        }
      } catch (error) {
        console.error('💥 Error deleting lesson:', error)
        alert('Error deleting lesson. Check console for details.')
      }
    }
  }

  const handleToggleStatus = async (lessonId: string) => {
    if (!lessonId) {
      console.error('❌ No lesson ID provided for status toggle')
      return
    }

    const lesson = lessons.find(l => l.id === lessonId)
    if (!lesson) {
      console.error(`❌ Lesson not found: ${lessonId}`)
      return
    }

    const newStatus = lesson.status === 'Actief' ? 'Inactief' : 'Actief'
    console.log(`🔄 Toggling status for lesson ${lessonId} from ${lesson.status} to ${newStatus}`)
    
    try {
      const response = await fetch(`/api/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      console.log(`📨 Status update response: ${response.status}`)

      if (response.ok) {
        console.log(`✅ Successfully updated status for lesson: ${lessonId}`)
        setLessons(lessons.map(lesson => 
          lesson.id === lessonId 
            ? { 
                ...lesson, 
                status: newStatus,
                updatedAt: new Date().toISOString()
              } 
            : lesson
        ))
      } else {
        const errorText = await response.text()
        console.error(`❌ Failed to update lesson status: ${response.status} - ${errorText}`)
        alert(`Failed to update lesson status: ${response.status}`)
      }
    } catch (error) {
      console.error('💥 Error updating lesson status:', error)
      alert('Error updating lesson status. Check console for details.')
    }
  }

  const handleSaveLesson = async (lessonData: any) => {
    try {
      console.log('📤 Sending to API:', lessonData)

      let contentString = lessonData.content
      if (typeof contentString === 'string' && contentString.startsWith('{')) {
        try {
          JSON.parse(contentString)
          console.log('✅ Content is valid JSON, keeping as is')
        } catch {
          contentString = String(contentString)
          console.log('⚠️ Content was invalid JSON, converted to string')
        }
      } else if (typeof contentString === 'object') {
        contentString = JSON.stringify(contentString)
        console.log('🔄 Content was object, stringified to JSON')
      } else {
        contentString = String(contentString || '')
        console.log('📝 Content set to plain string')
      }

      const moduleIds = lessonData.moduleIds || []

      const payload = {
        ...lessonData,
        content: contentString,
        durationMinutes: lessonData.duration,
        videoUrl: lessonData.videoUrl || '',
        tags: lessonData.tags || [],
        order: lessonData.order || 1,
        moduleIds: moduleIds
      }

      console.log('🎯 Final payload to API:', payload)
      console.log('🔗 Module IDs to link:', moduleIds)

      let response
      let url = '/api/lessons'
      let method = 'POST'

      if (lessonData.id && lessons.find(l => l.id === lessonData.id)) {
        url = `/api/lessons/${lessonData.id}`
        method = 'PATCH'
        console.log(`🔄 Updating existing lesson: ${lessonData.id}`)
      } else {
        console.log('🆕 Creating new lesson')
      }

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('📨 API Response status:', response.status)

      if (response.ok) {
        const savedLesson = await response.json()
        console.log('✅ API Response data:', savedLesson)
        
        // Refresh de lessons lijst
        const refreshResponse = await fetch('/api/lessons')
        if (refreshResponse.ok) {
          const data = await refreshResponse.json()
          console.log('🔄 Refreshed lessons data:', data)
          
          if (Array.isArray(data)) {
            const transformedLessons = data.map((lesson: any) => ({
              id: lesson.id || '',
              title: lesson.title || 'Untitled Lesson',
              description: lesson.description || '',
              status: lesson.status || 'Concept',
              category: lesson.category || 'Uncategorized',
              duration: lesson.duration || lesson.durationMinutes || 0,
              difficulty: lesson.difficulty || 'Beginner',
              type: lesson.type || 'Artikel',
              order: lesson.order || 0,
              tags: Array.isArray(lesson.tags) 
                ? lesson.tags 
                : typeof lesson.tags === 'string' 
                  ? JSON.parse(lesson.tags || '[]')
                  : [],
              moduleCount: lesson.moduleCount || (lesson.modules ? lesson.modules.length : 0),
              includedInModules: lesson.moduleCount || lesson.includedInModules || (lesson.modules ? lesson.modules.length : 0),
              includedInCourses: lesson.includedInCourses || 0,
              completionRate: lesson.completionRate || 0,
              createdAt: lesson.createdAt || new Date().toISOString().split('T')[0],
              updatedAt: lesson.updatedAt || new Date().toISOString().split('T')[0],
              modules: lesson.modules || []
            }))
            setLessons(transformedLessons)
            console.log(`📊 Loaded ${transformedLessons.length} lessons directly from array`)
          } else if (data.lessons && Array.isArray(data.lessons)) {
            const transformedLessons = data.lessons.map((lesson: any) => ({
              id: lesson.id || '',
              title: lesson.title || 'Untitled Lesson',
              description: lesson.description || '',
              status: lesson.status || 'Concept',
              category: lesson.category || 'Uncategorized',
              duration: lesson.duration || lesson.durationMinutes || 0,
              difficulty: lesson.difficulty || 'Beginner',
              type: lesson.type || 'Artikel',
              order: lesson.order || 0,
              tags: lesson.tags || [],
              moduleCount: lesson.moduleCount || 0,
              includedInModules: lesson.includedInModules || lesson.moduleCount || 0,
              includedInCourses: lesson.includedInCourses || 0,
              completionRate: lesson.completionRate || 0,
              createdAt: lesson.createdAt || new Date().toISOString().split('T')[0],
              updatedAt: lesson.updatedAt || new Date().toISOString().split('T')[0],
              modules: lesson.modules || []
            }))
            setLessons(transformedLessons)
            console.log(`📊 Loaded ${transformedLessons.length} lessons from data.lessons`)
          } else {
            console.log('❌ No lessons array found in refresh response:', data)
          }
        }
        
        setShowCreateModal(false)
        setEditingLesson(null)
        alert('Les succesvol opgeslagen!')
      } else {
        const errorText = await response.text()
        console.error('❌ API Error response:', errorText)
        alert(`Failed to save lesson: ${response.status} - ${errorText}`)
      }
    } catch (error) {
      console.error('💥 Error saving lesson:', error)
      alert(`Error saving lesson: ${error}`)
    }
  }

  // Bulk action handlers
  const toggleLessonSelection = (lessonId: string) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    )
  }

  const selectAllLessons = () => {
    setSelectedLessons(
      selectedLessons.length === filteredLessons.length && filteredLessons.length > 0
        ? []
        : filteredLessons.map((lesson: Lesson) => lesson.id)
    )
  }

  const handleBulkStatusChange = async (newStatus: 'Actief' | 'Inactief') => {
    if (selectedLessons.length === 0) return

    try {
      console.log(`🔄 Bulk updating ${selectedLessons.length} lessons to status: ${newStatus}`)
      
      const response = await fetch('/api/lessons/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonIds: selectedLessons,
          status: newStatus
        }),
      })

      console.log(`📨 Bulk update response: ${response.status}`)

      if (response.ok) {
        console.log(`✅ Successfully bulk updated ${selectedLessons.length} lessons`)
        setLessons(lessons.map(lesson =>
          selectedLessons.includes(lesson.id)
            ? { ...lesson, status: newStatus, updatedAt: new Date().toISOString() }
            : lesson
        ))
        setSelectedLessons([])
      } else {
        const errorText = await response.text()
        console.error(`❌ Failed to bulk update lessons: ${response.status} - ${errorText}`)
        alert(`Failed to update lessons: ${response.status}`)
      }
    } catch (error) {
      console.error('💥 Error updating lessons:', error)
      alert('Error updating lessons. Check console for details.')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedLessons.length === 0) return

    if (confirm(`Weet je zeker dat je ${selectedLessons.length} lessen wilt verwijderen?`)) {
      try {
        console.log(`🗑️ Attempting bulk delete of ${selectedLessons.length} lessons`)
        
        const response = await fetch('/api/lessons/bulk', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ lessonIds: selectedLessons }),
        })

        console.log(`📨 Bulk delete response: ${response.status}`)

        if (response.ok) {
          console.log(`✅ Successfully bulk deleted ${selectedLessons.length} lessons`)
          setLessons(lessons.filter(lesson => !selectedLessons.includes(lesson.id)))
          setSelectedLessons([])
        } else {
          const errorText = await response.text()
          console.error(`❌ Failed to bulk delete lessons: ${response.status} - ${errorText}`)
          alert(`Failed to delete lessons: ${response.status}`)
        }
      } catch (error) {
        console.error('💥 Error deleting lessons:', error)
        alert('Error deleting lessons. Check console for details.')
      }
    }
  }

  // Drag & Drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag end
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = lessons.findIndex((lesson) => lesson.id === active.id)
      const newIndex = lessons.findIndex((lesson) => lesson.id === over.id)

      if (oldIndex === -1 || newIndex === -1) return

      const reorderedLessons = arrayMove(lessons, oldIndex, newIndex)
      
      const updatedLessons = reorderedLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
        updatedAt: new Date().toISOString()
      }))

      setLessons(updatedLessons)

      try {
        const response = await fetch('/api/lessons/reorder', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            lessons: updatedLessons.map(lesson => ({
              id: lesson.id,
              order: lesson.order
            }))
          }),
        })

        if (!response.ok) {
          console.error('Failed to update lesson order')
        }
      } catch (error) {
        console.error('Error updating lesson order:', error)
      }
    }
  }

  // Calculate statistics safely
  const totalLessons = lessons.length
  const activeLessons = lessons.filter(l => l.status === 'Actief').length
  const averageCompletion = lessons.length > 0 
    ? Math.round(lessons.reduce((acc, lesson) => acc + (lesson.completionRate || 0), 0) / lessons.length)
    : 0
  const totalDuration = lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600">
            <Icons.loading />
          </div>
          <p className="text-gray-600">Lessen laden...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 text-red-500 mx-auto mb-4">
            <Icons.close />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Lessen Beheer</h1>
            <p className="text-gray-600 mt-1">Beheer alle individuele training lessen</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <div className="w-4 h-4">
              <Icons.add />
            </div>
            <span>Nieuwe Les</span>
          </button>
        </div>
      </div>

      {/* Filters en Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Zoeken
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Zoek op titel, beschrijving of tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2">
                <Icons.document />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Categorie
            </label>
            <select
              id="category"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Alle categorieën</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Alle statussen</option>
              <option value="Actief">Actief</option>
              <option value="Inactief">Inactief</option>
              <option value="Concept">Concept</option>
            </select>
          </div>

          {/* Difficulty Filter */}
          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
              Moeilijkheid
            </label>
            <select
              id="difficulty"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              <option value="">Alle niveaus</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert</option>
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              id="type"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Alle types</option>
              {lessonTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Sort en Reset */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                Sorteren op:
              </label>
              <select
                id="sort"
                className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="order">Volgorde</option>
                <option value="title">Titel</option>
                <option value="moduleCount">Aantal Modules</option>
                <option value="completionRate">Voltooiing</option>
                <option value="duration">Duur</option>
                <option value="updatedAt">Laatst bijgewerkt</option>
              </select>
            </div>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
            >
              <span>{sortOrder === 'asc' ? 'Oplopend' : 'Aflopend'}</span>
              {sortOrder === 'asc' ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">
              {filteredLessons.length} van {lessons.length} lessen
            </span>
            <button
              onClick={resetFilters}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              Filters resetten
            </button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLessons.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-blue-700 font-medium">
                {selectedLessons.length} les(sen) geselecteerd
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkStatusChange('Actief')}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Activeren
                </button>
                <button
                  onClick={() => handleBulkStatusChange('Inactief')}
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
              </div>
            </div>
            <button
              onClick={() => setSelectedLessons([])}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Selectie opheffen
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totaal Lessen</p>
              <p className="text-2xl font-semibold text-gray-900">{totalLessons}</p>
            </div>
            <div className="w-8 h-8 text-blue-600">
              <Icons.lessons />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actieve Lessen</p>
              <p className="text-2xl font-semibold text-gray-900">{activeLessons}</p>
            </div>
            <div className="w-8 h-8 text-green-600">
              <Icons.check />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gem. Voltooiing</p>
              <p className="text-2xl font-semibold text-gray-900">{averageCompletion}%</p>
            </div>
            <div className="w-8 h-8 text-orange-600">
              <Icons.chart />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totale Duur</p>
              <p className="text-2xl font-semibold text-gray-900">{totalDuration} min</p>
            </div>
            <div className="w-8 h-8 text-purple-600">
              <Icons.clock />
            </div>
          </div>
        </div>
      </div>

      {/* Lessons Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedLessons.length === filteredLessons.length && filteredLessons.length > 0}
                onChange={selectAllLessons}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <h2 className="text-lg font-medium text-gray-900">Lessen</h2>
              <div className="text-sm text-gray-600">
                {filteredLessons.length} van {lessons.length} lessen
              </div>
              
              {/* Drag & Drop Info */}
              <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <span>Sleep lessen om volgorde aan te passen</span>
              </div>
            </div>
            
            {selectedLessons.length > 0 && (
              <div className="text-sm text-blue-600 font-medium">
                {selectedLessons.length} geselecteerd
              </div>
            )}
          </div>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredLessons.map((l: Lesson) => l.id)} strategy={verticalListSortingStrategy}>
            <div className="divide-y divide-gray-200">
              {filteredLessons.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
                    <Icons.document />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Geen lessen gevonden</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedCategory || selectedStatus || selectedDifficulty || selectedType
                      ? 'Probeer je zoekcriteria aan te passen.' 
                      : 'Er zijn nog geen lessen aangemaakt.'}
                  </p>
                  {!searchTerm && !selectedCategory && !selectedStatus && !selectedDifficulty && !selectedType && (
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Eerste Les Aanmaken
                    </button>
                  )}
                </div>
              ) : (
                filteredLessons.map((lesson: Lesson) => (
                  <SortableLesson
                    key={lesson.id}
                    lesson={lesson}
                    isSelected={selectedLessons.includes(lesson.id)}
                    onToggleSelection={toggleLessonSelection}
                    onEdit={setEditingLesson}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteLesson}
                    getStatusColor={getStatusColor}
                    getDifficultyColor={getDifficultyColor}
                    getTypeColor={getTypeColor}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <LessonModal 
          lesson={null}
          categories={categories}
          lessonTypes={lessonTypes}
          modules={modules}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveLesson}
        />
      )}

      {editingLesson && (
        <LessonModal 
          lesson={editingLesson}
          categories={categories}
          lessonTypes={lessonTypes}
          modules={modules}
          onClose={() => setEditingLesson(null)}
          onSave={handleSaveLesson}
        />
      )}
    </div>
  )
}