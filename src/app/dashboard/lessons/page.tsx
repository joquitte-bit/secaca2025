// 📁 BESTAND: /src/app/dashboard/lessons/page.tsx
'use client'

import { useState, useMemo } from 'react'
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

// Lesson interface
interface Lesson {
  id: number
  title: string
  description: string
  status: 'Actief' | 'Inactief' | 'Concept'
  category: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  type: 'Video' | 'Artikel' | 'Quiz' | 'Interactief'
  order: number
  tags?: string[]
  includedInModules: number
  includedInCourses: number
  completionRate: number
  createdAt: string
  updatedAt: string
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([
    { 
      id: 1, 
      title: 'Phishing herkennen: 5 rode vlaggen', 
      status: 'Actief', 
      description: 'Leer de belangrijkste signalen van phishing emails herkennen',
      category: 'Security Basics',
      duration: 15,
      difficulty: 'Beginner',
      type: 'Video',
      order: 1,
      tags: ['phishing', 'email', 'security'],
      includedInModules: 3,
      includedInCourses: 2,
      completionRate: 85,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15'
    },
    { 
      id: 2, 
      title: 'Veilige links controleren', 
      status: 'Actief', 
      description: 'Hoe je veilig kunt navigeren en verdachte links kunt identificeren',
      category: 'Security Basics',
      duration: 10,
      difficulty: 'Beginner',
      type: 'Interactief',
      order: 2,
      tags: ['links', 'browsing', 'veiligheid'],
      includedInModules: 2,
      includedInCourses: 1,
      completionRate: 78,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-14'
    },
    { 
      id: 3, 
      title: 'CEO-fraude herkennen', 
      status: 'Concept', 
      description: 'Specifieke technieken voor het herkennen van CEO-fraude aanvallen',
      category: 'Advanced Security',
      duration: 20,
      difficulty: 'Intermediate',
      type: 'Artikel',
      order: 3,
      tags: ['ceo-fraude', 'social-engineering'],
      includedInModules: 1,
      includedInCourses: 1,
      completionRate: 0,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    },
    { 
      id: 4, 
      title: 'Wachtwoord beveiliging quiz', 
      status: 'Actief', 
      description: 'Test je kennis over sterke wachtwoorden en beveiliging',
      category: 'Security Basics',
      duration: 8,
      difficulty: 'Beginner',
      type: 'Quiz',
      order: 4,
      tags: ['wachtwoord', 'quiz', 'security'],
      includedInModules: 2,
      includedInCourses: 2,
      completionRate: 92,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-15'
    },
  ])

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
  const [sortBy, setSortBy] = useState<'title' | 'order' | 'completionRate' | 'duration' | 'updatedAt'>('order')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Bulk actions state
  const [selectedLessons, setSelectedLessons] = useState<number[]>([])

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
    let filtered = lessons.filter((lesson: Lesson) => {
      const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (lesson.tags && lesson.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      const matchesCategory = !selectedCategory || lesson.category === selectedCategory
      const matchesStatus = !selectedStatus || lesson.status === selectedStatus
      const matchesDifficulty = !selectedDifficulty || lesson.difficulty === selectedDifficulty
      const matchesType = !selectedType || lesson.type === selectedType
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty && matchesType
    })

    // Sorting
    filtered.sort((a: Lesson, b: Lesson) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]
      
      if (sortBy === 'updatedAt') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
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
  const handleDeleteLesson = (lessonId: number) => {
    if (confirm('Weet je zeker dat je deze les wilt verwijderen?')) {
      setLessons(lessons.filter(lesson => lesson.id !== lessonId))
    }
  }

  const handleToggleStatus = (lessonId: number) => {
    setLessons(lessons.map(lesson => 
      lesson.id === lessonId 
        ? { 
            ...lesson, 
            status: lesson.status === 'Actief' ? 'Inactief' : 'Actief',
            updatedAt: new Date().toISOString().split('T')[0]
          } 
        : lesson
    ))
  }

  const handleSaveLesson = (lessonData: any) => {
    if (lessonData.id && lessons.find(l => l.id === lessonData.id)) {
      // Update bestaande lesson
      setLessons(lessons.map(lesson => 
        lesson.id === lessonData.id ? lessonData : lesson
      ))
    } else {
      // Nieuwe lesson
      setLessons(prev => [...prev, {
        ...lessonData,
        id: Date.now(),
        includedInModules: 0,
        includedInCourses: 0,
        completionRate: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }])
    }
    
    // Close modals automatisch
    setShowCreateModal(false)
    setEditingLesson(null)
  }

  // Bulk action handlers
  const toggleLessonSelection = (lessonId: number) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    )
  }

  const selectAllLessons = () => {
    setSelectedLessons(
      selectedLessons.length === filteredLessons.length
        ? []
        : filteredLessons.map((lesson: Lesson) => lesson.id)
    )
  }

  const handleBulkStatusChange = (newStatus: 'Actief' | 'Inactief') => {
    setLessons(lessons.map(lesson =>
      selectedLessons.includes(lesson.id)
        ? { ...lesson, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : lesson
    ))
    setSelectedLessons([])
  }

  const handleBulkDelete = () => {
    if (confirm(`Weet je zeker dat je ${selectedLessons.length} lessen wilt verwijderen?`)) {
      setLessons(lessons.filter(lesson => !selectedLessons.includes(lesson.id)))
      setSelectedLessons([])
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
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setLessons((currentLessons) => {
        const oldIndex = currentLessons.findIndex((lesson) => lesson.id === active.id)
        const newIndex = currentLessons.findIndex((lesson) => lesson.id === over.id)

        const reorderedLessons = arrayMove(currentLessons, oldIndex, newIndex)
        
        // Update order numbers based on new positions
        return reorderedLessons.map((lesson, index) => ({
          ...lesson,
          order: index + 1,
          updatedAt: new Date().toISOString().split('T')[0]
        }))
      })
    }
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
            <Icons.add className="w-4 h-4" />
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
              <Icons.document className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
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
              <p className="text-2xl font-semibold text-gray-900">{lessons.length}</p>
            </div>
            <Icons.lessons className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text.text-gray-600">Actieve Lessen</p>
              <p className="text-2xl font-semibold text-gray-900">
                {lessons.filter(l => l.status === 'Actief').length}
              </p>
            </div>
            <Icons.check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gem. Voltooiing</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(lessons.reduce((acc, lesson) => acc + lesson.completionRate, 0) / lessons.length)}%
              </p>
            </div>
            <Icons.chart className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totale Duur</p>
              <p className="text-2xl font-semibold text-gray-900">
                {lessons.reduce((acc, lesson) => acc + lesson.duration, 0)} min
              </p>
            </div>
            <Icons.clock className="w-8 h-8 text-purple-600" />
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
                  <Icons.document className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveLesson}
        />
      )}

      {editingLesson && (
        <LessonModal 
          lesson={editingLesson}
          categories={categories}
          lessonTypes={lessonTypes}
          onClose={() => setEditingLesson(null)}
          onSave={handleSaveLesson}
        />
      )}
    </div>
  )
}