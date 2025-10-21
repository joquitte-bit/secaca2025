// 📁 BESTAND: /src/app/dashboard/lessons/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'

interface Lesson {
  id: string
  title: string
  description: string
  status: 'Actief' | 'Inactief' | 'Concept'
  category: string
  type: string
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  duration: number
  order: number
  completionRate: number
  moduleCount: number
  courseCount: number
  tags: string[]
  updatedAt: string
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [selectedLessons, setSelectedLessons] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Alle statussen')
  const [categoryFilter, setCategoryFilter] = useState('Alle categorieën')
  const [difficultyFilter, setDifficultyFilter] = useState('Alle niveaus')

  // Mock data - VERVANG DIT MET ECHTE DATA
  useEffect(() => {
    const mockLessons: Lesson[] = [
      {
        id: '1',
        title: 'Inleiding Security Awareness',
        description: 'Basis principes van security awareness',
        status: 'Actief',
        category: 'Security Basics',
        type: 'Artikel',
        difficulty: 'Beginner',
        duration: 20,
        order: 1,
        completionRate: 85,
        moduleCount: 3,
        courseCount: 2,
        tags: ['security', 'awareness', 'basics'],
        updatedAt: '2025-10-21T08:08:29.900Z'
      },
      {
        id: '2',
        title: 'Phishing Herkenning',
        description: 'Leer phishing emails herkennen en voorkomen',
        status: 'Actief',
        category: 'Security Basics',
        type: 'Quiz',
        difficulty: 'Beginner',
        duration: 25,
        order: 2,
        completionRate: 72,
        moduleCount: 2,
        courseCount: 1,
        tags: ['phishing', 'email', 'security'],
        updatedAt: '2025-10-21T08:08:29.900Z'
      },
      {
        id: '3',
        title: 'Wachtwoord Beveiliging',
        description: 'Best practices voor sterke wachtwoorden',
        status: 'Actief',
        category: 'Security Basics',
        type: 'Video',
        difficulty: 'Beginner',
        duration: 15,
        order: 3,
        completionRate: 90,
        moduleCount: 1,
        courseCount: 1,
        tags: ['wachtwoorden', 'security'],
        updatedAt: '2025-10-21T08:08:29.900Z'
      },
      {
        id: '4',
        title: 'Social Engineering',
        description: 'Herkennen en voorkomen van manipulatie technieken',
        status: 'Actief',
        category: 'Advanced Security',
        type: 'Interactief',
        difficulty: 'Intermediate',
        duration: 30,
        order: 4,
        completionRate: 65,
        moduleCount: 1,
        courseCount: 1,
        tags: ['social engineering', 'manipulatie'],
        updatedAt: '2025-10-21T08:08:29.900Z'
      },
      {
        id: '5',
        title: 'Data Privacy Fundamentals',
        description: 'Basisprincipes van data privacy en GDPR',
        status: 'Concept',
        category: 'Compliance',
        type: 'Artikel',
        difficulty: 'Beginner',
        duration: 18,
        order: 5,
        completionRate: 0,
        moduleCount: 0,
        courseCount: 0,
        tags: ['privacy', 'gdpr', 'compliance'],
        updatedAt: '2025-10-20T08:08:29.900Z'
      }
    ]
    setLessons(mockLessons)
  }, [])

  // Filter lessons - ZELFDE LOGICA ALS COURSES
  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
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
      selectedLessons.length === filteredLessons.length && filteredLessons.length > 0
        ? []
        : filteredLessons.map(lesson => lesson.id)
    )
  }

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Video': return 'bg-red-100 text-red-800'
      case 'Artikel': return 'bg-blue-100 text-blue-800'
      case 'Quiz': return 'bg-purple-100 text-purple-800'
      case 'Interactief': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL')
  }

  // Bulk actions
  const handleBulkStatusChange = (newStatus: 'Actief' | 'Inactief') => {
    if (selectedLessons.length === 0) return

    setLessons(lessons.map(lesson =>
      selectedLessons.includes(lesson.id)
        ? { ...lesson, status: newStatus, updatedAt: new Date().toISOString() }
        : lesson
    ))
    setSelectedLessons([])
  }

  const handleBulkDelete = () => {
    if (selectedLessons.length === 0) return

    if (confirm(`Weet je zeker dat je ${selectedLessons.length} lessen wilt verwijderen?`)) {
      setLessons(lessons.filter(lesson => !selectedLessons.includes(lesson.id)))
      setSelectedLessons([])
    }
  }

  // Calculate statistics
  const totalLessons = lessons.length
  const activeLessons = lessons.filter(l => l.status === 'Actief').length
  const averageCompletion = lessons.length > 0 
    ? Math.round(lessons.reduce((acc, lesson) => acc + lesson.completionRate, 0) / lessons.length)
    : 0
  const totalDuration = lessons.reduce((acc, lesson) => acc + lesson.duration, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* FIXED: 100% width container met zelfde padding als navbar */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER - EXACT HETZELFDE ALS COURSES */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lessen</h1>
              <p className="text-gray-600">Beheer alle training lessons</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Nieuwe Les
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS - EXACT HETZELFDE ALS COURSES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icons.lessons className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Lessen</p>
                <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icons.clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actieve Lessen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeLessons}
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
                <p className="text-sm font-medium text-gray-600">Gem. Voltooiing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {averageCompletion}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Icons.courses className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totale Duur</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalDuration} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS - EXACT HETZELFDE ALS COURSES */}
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
                {filteredLessons.length} van {lessons.length} lessen
              </div>
            </div>
          </div>

          {/* BULK ACTIONS - EXACT HETZELFDE ALS COURSES */}
          {selectedLessons.length > 0 && (
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-700">
                    {selectedLessons.length} lessen geselecteerd
                  </span>
                  <button 
                    onClick={() => handleBulkStatusChange('Actief')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Activeren
                  </button>
                  <button 
                    onClick={() => handleBulkStatusChange('Inactief')}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Deactiveren
                  </button>
                  <button 
                    onClick={handleBulkDelete}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    Verwijderen
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedLessons([])}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Selectie opheffen
                </button>
              </div>
            </div>
          )}

          {/* TABLE - EXACT HETZELFDE ALS COURSES */}
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
                    Les
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modules
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voltooid
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
                {filteredLessons.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-12 text-center">
                      <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
                        <Icons.lessons className="w-12 h-12" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Geen lessen gevonden</h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm || statusFilter !== 'Alle statussen' || categoryFilter !== 'Alle categorieën' || difficultyFilter !== 'Alle niveaus'
                          ? 'Probeer je zoekcriteria aan te passen.' 
                          : 'Er zijn nog geen lessen aangemaakt.'}
                      </p>
                      {!searchTerm && statusFilter === 'Alle statussen' && categoryFilter === 'Alle categorieën' && difficultyFilter === 'Alle niveaus' && (
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                          Eerste Les Aanmaken
                        </button>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredLessons.map((lesson) => (
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
                          <div className="flex flex-wrap gap-1 mt-1">
                            {lesson.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                {tag}
                              </span>
                            ))}
                            {lesson.tags.length > 3 && (
                              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                                +{lesson.tags.length - 3} meer
                              </span>
                            )}
                          </div>
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
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(lesson.type)}`}>
                          {lesson.type}
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
                          {lesson.moduleCount}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="h-2 rounded-full bg-green-600 transition-all duration-500"
                              style={{ width: `${lesson.completionRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{lesson.completionRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(lesson.updatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-gray-600 hover:text-blue-600 transition-colors p-1 rounded"
                            title="Bekijken"
                          >
                            <Icons.eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-green-600 transition-colors p-1 rounded"
                            title="Bewerken"
                          >
                            <Icons.settings className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-orange-600 transition-colors p-1 rounded"
                            title="Status wijzigen"
                          >
                            <Icons.power className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-gray-600 hover:text-red-600 transition-colors p-1 rounded"
                            title="Verwijderen"
                          >
                            <Icons.trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DRAG & DROP INFO - EXACT HETZELFDE ALS COURSES */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Sleep lessen om volgorde aan te passen
        </div>
      </div>
    </div>
  )
}