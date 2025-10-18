// src/app/dashboard/courses/page.tsx
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
import { CourseModal } from '@/components/CourseModal'
import { SortableCourse } from '@/components/SortableCourse'

// Course interface
interface Course {
  id: number
  title: string
  description: string
  status: 'Actief' | 'Inactief' | 'Concept'
  students: number
  progress: number
  modules: number
  category: string
  order: number
  createdAt: string
  updatedAt: string
  duration?: number
  difficulty?: 'Beginner' | 'Intermediate' | 'Expert'
  tags?: string[]
  includedModules?: number[] // IDs van modules in deze course
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([
    { 
      id: 1, 
      title: 'Complete Security Awareness', 
      status: 'Actief', 
      students: 45, 
      progress: 85, 
      modules: 3,
      description: 'Volledige security awareness training voor alle medewerkers',
      category: 'Security Basics',
      order: 1,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-15',
      duration: 180,
      difficulty: 'Beginner',
      tags: ['security', 'awareness', 'compliance'],
      includedModules: [1, 2, 4]
    },
    { 
      id: 2, 
      title: 'Advanced Threat Protection', 
      status: 'Actief', 
      students: 28, 
      progress: 65, 
      modules: 2,
      description: 'Geavanceerde training voor IT-personeel en security teams',
      category: 'Advanced Security',
      order: 2,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-14',
      duration: 120,
      difficulty: 'Intermediate',
      tags: ['threat protection', 'advanced', 'IT'],
      includedModules: [2, 4]
    },
    { 
      id: 3, 
      title: 'Data Privacy Fundamentals', 
      status: 'Inactief', 
      students: 0, 
      progress: 0, 
      modules: 2,
      description: 'GDPR en data privacy compliance training',
      category: 'Compliance',
      order: 3,
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
      duration: 90,
      difficulty: 'Beginner',
      tags: ['GDPR', 'compliance', 'data privacy'],
      includedModules: [4]
    },
    { 
      id: 4, 
      title: 'Phishing Defense Specialist', 
      status: 'Actief', 
      students: 32, 
      progress: 78, 
      modules: 1,
      description: 'Gespecialiseerde training in phishing herkenning en preventie',
      category: 'Security Basics',
      order: 4,
      createdAt: '2024-01-08',
      updatedAt: '2024-01-15',
      duration: 90,
      difficulty: 'Intermediate',
      tags: ['phishing', 'defense', 'specialist'],
      includedModules: [1]
    },
  ])

  const [categories] = useState([
    'Security Basics',
    'Advanced Security', 
    'Data Security',
    'Compliance',
    'Technical Security'
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [sortBy, setSortBy] = useState<'title' | 'order' | 'progress' | 'students' | 'updatedAt'>('order')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Bulk actions state
  const [selectedCourses, setSelectedCourses] = useState<number[]>([])

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

  // Filtered and sorted courses
  const filteredCourses = useMemo(() => {
    let filtered = courses.filter((course: Course) => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (course.tags && course.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      const matchesCategory = !selectedCategory || course.category === selectedCategory
      const matchesStatus = !selectedStatus || course.status === selectedStatus
      const matchesDifficulty = !selectedDifficulty || course.difficulty === selectedDifficulty
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty
    })

    // Sorting
    filtered.sort((a: Course, b: Course) => {
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
  }, [courses, searchTerm, selectedCategory, selectedStatus, selectedDifficulty, sortBy, sortOrder])

  // Reset alle filters
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedStatus('')
    setSelectedDifficulty('')
    setSortBy('order')
    setSortOrder('asc')
  }

  // Course actions
  const handleDeleteCourse = (courseId: number) => {
    if (confirm('Weet je zeker dat je deze course wilt verwijderen?')) {
      setCourses(courses.filter(course => course.id !== courseId))
    }
  }

  const handleToggleStatus = (courseId: number) => {
    setCourses(courses.map(course => 
      course.id === courseId 
        ? { 
            ...course, 
            status: course.status === 'Actief' ? 'Inactief' : 'Actief',
            updatedAt: new Date().toISOString().split('T')[0]
          } 
        : course
    ))
  }

  const handleSaveCourse = (courseData: any) => {
    if (courseData.id && courses.find(c => c.id === courseData.id)) {
      // Update bestaande course
      setCourses(courses.map(course => 
        course.id === courseData.id ? courseData : course
      ))
    } else {
      // Nieuwe course
      setCourses(prev => [...prev, {
        ...courseData,
        id: Date.now(),
        students: 0,
        progress: 0,
        modules: courseData.includedModules?.length || 0,
        createdAt: new Date().toISOString().split('T')[0]
      }])
    }
  }

  // Bulk action handlers
  const toggleCourseSelection = (courseId: number) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  const selectAllCourses = () => {
    setSelectedCourses(
      selectedCourses.length === filteredCourses.length
        ? []
        : filteredCourses.map((course: Course) => course.id)
    )
  }

  const handleBulkStatusChange = (newStatus: 'Actief' | 'Inactief') => {
    setCourses(courses.map(course =>
      selectedCourses.includes(course.id)
        ? { ...course, status: newStatus, updatedAt: new Date().toISOString().split('T')[0] }
        : course
    ))
    setSelectedCourses([])
  }

  const handleBulkDelete = () => {
    if (confirm(`Weet je zeker dat je ${selectedCourses.length} courses wilt verwijderen?`)) {
      setCourses(courses.filter(course => !selectedCourses.includes(course.id)))
      setSelectedCourses([])
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
      setCourses((currentCourses) => {
        const oldIndex = currentCourses.findIndex((course) => course.id === active.id)
        const newIndex = currentCourses.findIndex((course) => course.id === over.id)

        const reorderedCourses = arrayMove(currentCourses, oldIndex, newIndex)
        
        // Update order numbers based on new positions
        return reorderedCourses.map((course, index) => ({
          ...course,
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
            <h1 className="text-2xl font-semibold text-gray-900">Courses Beheer</h1>
            <p className="text-gray-600 mt-1">Beheer alle training courses en leerpaden</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <Icons.add className="w-4 h-4" />
            <span>Nieuwe Course</span>
          </button>
        </div>
      </div>

      {/* Filters en Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
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
                <option value="progress">Voortgang</option>
                <option value="students">Studenten</option>
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
              {filteredCourses.length} van {courses.length} courses
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
      {selectedCourses.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-blue-700 font-medium">
                {selectedCourses.length} course(s) geselecteerd
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
              onClick={() => setSelectedCourses([])}
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
              <p className="text-sm font-medium text-gray-600">Totaal Courses</p>
              <p className="text-2xl font-semibold text-gray-900">{courses.length}</p>
            </div>
            <Icons.courses className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actieve Courses</p>
              <p className="text-2xl font-semibold text-gray-900">
                {courses.filter(c => c.status === 'Actief').length}
              </p>
            </div>
            <Icons.check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totaal Modules</p>
              <p className="text-2xl font-semibold text-gray-900">
                {courses.reduce((acc, course) => acc + course.modules, 0)}
              </p>
            </div>
            <Icons.modules className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gem. Voltooiing</p>
              <p className="text-2xl font-semibold text-gray-900">
                {Math.round(courses.reduce((acc, course) => acc + course.progress, 0) / courses.length)}%
              </p>
            </div>
            <Icons.chart className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                onChange={selectAllCourses}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <h2 className="text-lg font-medium text-gray-900">Courses</h2>
              <div className="text-sm text-gray-600">
                {filteredCourses.length} van {courses.length} courses
              </div>
              
              {/* Drag & Drop Info */}
              <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <span>Sleep courses om volgorde aan te passen</span>
              </div>
            </div>
            
            {selectedCourses.length > 0 && (
              <div className="text-sm text-blue-600 font-medium">
                {selectedCourses.length} geselecteerd
              </div>
            )}
          </div>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredCourses.map((c: Course) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="divide-y divide-gray-200">
              {filteredCourses.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Icons.document className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Geen courses gevonden</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedCategory || selectedStatus || selectedDifficulty 
                      ? 'Probeer je zoekcriteria aan te passen.' 
                      : 'Er zijn nog geen courses aangemaakt.'}
                  </p>
                  {!searchTerm && !selectedCategory && !selectedStatus && !selectedDifficulty && (
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Eerste Course Aanmaken
                    </button>
                  )}
                </div>
              ) : (
                filteredCourses.map((course: Course) => (
                  <SortableCourse
                    key={course.id}
                    course={course}
                    isSelected={selectedCourses.includes(course.id)}
                    onToggleSelection={toggleCourseSelection}
                    onEdit={setEditingCourse}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteCourse}
                    getStatusColor={getStatusColor}
                    getDifficultyColor={getDifficultyColor}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CourseModal 
          course={null}
          categories={categories}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveCourse}
        />
      )}

      {editingCourse && (
        <CourseModal 
          course={editingCourse}
          categories={categories}
          onClose={() => setEditingCourse(null)}
          onSave={handleSaveCourse}
        />
      )}
    </div>
  )
}