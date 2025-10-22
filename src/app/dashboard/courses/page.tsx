// src/app/dashboard/courses/page.tsx - GEFIXT MET KLEUREN ZOALS LESSONS
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'
import CourseEditor from '@/components/courses/CourseEditor'

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'Concept' | 'Actief' | 'Inactief'>('all')

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

  // Fetch courses from API
  const fetchCourses = async () => {
    try {
      console.log('🔄 Fetching courses from API...')
      setIsLoading(true)
      
      const response = await fetch('/api/courses')
      console.log('📡 API Response status:', response.status)
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses')
      }
      
      const coursesData = await response.json()
      console.log('📊 Courses data received:', coursesData)
      setCourses(coursesData)
    } catch (error) {
      console.error('❌ Error fetching courses:', error)
      alert('Fout bij ophalen courses')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  // Filter courses based on search and status
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handle course selection
  const handleCourseSelect = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  // Handle select all
  const handleSelectAll = () => {
    setSelectedCourses(
      selectedCourses.length === filteredCourses.length
        ? []
        : filteredCourses.map(course => course.id)
    )
  }

  // Handle new course
  const handleNewCourse = () => {
    setEditingCourse(null)
    setShowEditor(true)
  }

  // Handle edit course
  const handleEditCourse = (course: Course) => {
    console.log('Edit course:', course)
    setEditingCourse(course)
    setShowEditor(true)
  }

  // Handle save course
  const handleSaveCourse = (savedCourse: Course) => {
    if (editingCourse) {
      // Update existing course
      setCourses(prev => prev.map(course =>
        course.id === savedCourse.id ? savedCourse : course
      ))
    } else {
      // Add new course
      setCourses(prev => [savedCourse, ...prev])
    }
    setShowEditor(false)
    setEditingCourse(null)
  }

  // Handle delete course
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm('Weet je zeker dat je deze course wilt verwijderen?')) {
      return
    }

    try {
      const response = await fetch(`/api/courses?id=${courseId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete course')
      }

      // Update local state
      setCourses(prev => prev.filter(course => course.id !== courseId))
      setSelectedCourses(prev => prev.filter(id => id !== courseId))
      
      console.log(`✅ Course ${courseId} deleted successfully`)
    } catch (error) {
      console.error('❌ Error deleting course:', error)
      alert('Fout bij verwijderen course')
    }
  }

  // Handle status toggle (lightning icon)
  const handleStatusToggle = async (courseId: string, newStatus: 'Actief' | 'Inactief') => {
    try {
      const response = await fetch('/api/courses', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: courseId,
          status: newStatus
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update course ${courseId}`)
      }

      const updatedCourse = await response.json()
      
      // Update local state
      setCourses(prev => prev.map(course => 
        course.id === courseId ? updatedCourse : course
      ))
      
      console.log(`✅ Course ${courseId} status updated to ${newStatus}`)
    } catch (error) {
      console.error('❌ Error updating course status:', error)
      alert('Fout bij bijwerken status course')
    }
  }

  // Handle bulk status toggle
  const handleBulkStatusToggle = async (newStatus: 'Actief' | 'Inactief') => {
    try {
      for (const courseId of selectedCourses) {
        const response = await fetch('/api/courses', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: courseId,
            status: newStatus
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to update course ${courseId}`)
        }
      }

      // Refresh courses
      fetchCourses()
      setSelectedCourses([])
      
      console.log(`✅ Bulk status update to ${newStatus} completed`)
    } catch (error) {
      console.error('❌ Error in bulk status toggle:', error)
      alert('Fout bij bijwerken status courses')
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!confirm(`Weet je zeker dat je ${selectedCourses.length} courses wilt verwijderen?`)) {
      return
    }

    try {
      for (const courseId of selectedCourses) {
        const response = await fetch(`/api/courses?id=${courseId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error(`Failed to delete course ${courseId}`)
        }
      }

      // Refresh courses
      fetchCourses()
      setSelectedCourses([])
      
      console.log(`✅ Bulk delete completed for ${selectedCourses.length} courses`)
    } catch (error) {
      console.error('❌ Error in bulk delete:', error)
      alert('Fout bij verwijderen courses')
    }
  }

  // Handle view course (eye icon)
  const handleViewCourse = (course: Course) => {
    alert(`Bekijk course: ${course.title}\n\nBeschrijving: ${course.description}\n\nModules: ${course.modules}\n\nDuur: ${course.duration} minuten`)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actief':
        return 'bg-green-100 text-green-800'
      case 'Concept':
        return 'bg-yellow-100 text-yellow-800'
      case 'Inactief':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get difficulty color
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
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
              <p className="text-gray-600">Beheer alle courses</p>
            </div>
            <button 
              onClick={handleNewCourse}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Nieuwe Course
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS - AANGEPAST MET KLEUREN ZOALS LESSONS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icons.courses className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Courses</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icons.check className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actieve Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'Actief').length}
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
                <p className="text-sm font-medium text-gray-600">Totaal Modules</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce((acc, course) => acc + (course.modules || 0), 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Icons.clock className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gem. Duur</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.length > 0 ? Math.round(courses.reduce((acc, course) => acc + (course.duration || 0), 0) / courses.length) : 0} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BULK ACTIONS BAR */}
        {selectedCourses.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icons.document className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-blue-800 font-medium">
                  {selectedCourses.length} course(s) geselecteerd
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
                  onClick={() => setSelectedCourses([])}
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
                    placeholder="Zoek op titel of beschrijving..."
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
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                >
                  <option value="all">Alle statussen</option>
                  <option value="Concept">Concept</option>
                  <option value="Actief">Actief</option>
                  <option value="Inactief">Inactief</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredCourses.length} van {courses.length} courses
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
                      checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                      onChange={handleSelectAll}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
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
                    Modules
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
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => handleCourseSelect(course.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{course.title}</div>
                        <div className="text-sm text-gray-500">{course.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {course.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.modules className="w-4 h-4 text-gray-400 mr-1" />
                        {course.modules}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.clock className="w-4 h-4 text-gray-400 mr-1" />
                        {course.duration} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(course.createdAt).toLocaleDateString('nl-NL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {/* Eye icon - View (blauw) */}
                        <button
                          onClick={() => handleViewCourse(course)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Bekijk course"
                        >
                          <Icons.eye className="w-4 h-4" />
                        </button>

                        {/* Settings icon - Edit (grijs) */}
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="text-gray-600 hover:text-gray-800 transition-colors"
                          title="Bewerk course"
                        >
                          <Icons.settings className="w-4 h-4" />
                        </button>

                        {/* Bolt icon - Toggle status (geel/oranje) */}
                        <button
                          onClick={() => handleStatusToggle(
                            course.id, 
                            course.status === 'Actief' ? 'Inactief' : 'Actief'
                          )}
                          className="text-yellow-600 hover:text-yellow-800 transition-colors"
                          title={course.status === 'Actief' ? 'Deactiveren' : 'Activeren'}
                        >
                          <Icons.bolt className="w-4 h-4" />
                        </button>

                        {/* Trash icon - Delete (rood) */}
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Verwijder course"
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

        {/* Course Editor Modal */}
        {showEditor && (
          <CourseEditor
            course={editingCourse}
            categories={categories}
            onClose={() => {
              setShowEditor(false)
              setEditingCourse(null)
            }}
            onSave={handleSaveCourse}
          />
        )}
      </div>
    </div>
  )
}