// 📁 BESTAND: /src/app/dashboard/courses/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'

interface Course {
  id: string
  title: string
  description: string
  status: 'Actief' | 'Inactief' | 'Concept'
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  modules: number
  duration: number
  students: number
  completionRate: number
  order: number
  tags: string[]
  updatedAt: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [selectedCourses, setSelectedCourses] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Alle statussen')
  const [categoryFilter, setCategoryFilter] = useState('Alle categorieën')
  const [difficultyFilter, setDifficultyFilter] = useState('Alle niveaus')

  // Mock data - IDENTIEKE STRUCTUUR ALS LESSONS
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: '1',
        title: 'Security Awareness Training',
        description: 'Complete security awareness training voor alle medewerkers',
        status: 'Actief',
        category: 'Security',
        difficulty: 'Beginner',
        modules: 3,
        duration: 135,
        students: 45,
        completionRate: 78,
        order: 1,
        tags: ['security', 'awareness'],
        updatedAt: '2025-10-21T08:08:29.900Z'
      },
      {
        id: '2',
        title: 'Data Privacy Fundamentals',
        description: 'Grondbeginselen van dataprivacy en GDPR compliance',
        status: 'Actief',
        category: 'Compliance',
        difficulty: 'Intermediate',
        modules: 5,
        duration: 180,
        students: 32,
        completionRate: 65,
        order: 2,
        tags: ['privacy', 'gdpr'],
        updatedAt: '2025-10-20T14:30:00.000Z'
      },
      {
        id: '3',
        title: 'Advanced Cybersecurity',
        description: 'Geavanceerde cybersecurity technieken voor experts',
        status: 'Concept',
        category: 'Security',
        difficulty: 'Expert',
        modules: 8,
        duration: 240,
        students: 12,
        completionRate: 40,
        order: 3,
        tags: ['cybersecurity', 'advanced'],
        updatedAt: '2025-10-19T10:15:00.000Z'
      }
    ]
    setCourses(mockCourses)
  }, [])

  // Filter courses - IDENTIEKE LOGICA ALS LESSONS
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'Alle statussen' || course.status === statusFilter
    const matchesCategory = categoryFilter === 'Alle categorieën' || course.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'Alle niveaus' || course.difficulty === difficultyFilter
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDifficulty
  })

  const toggleCourseSelection = (courseId: string) => {
    setSelectedCourses(prev =>
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    )
  }

  const toggleAllCourses = () => {
    setSelectedCourses(
      selectedCourses.length === filteredCourses.length
        ? []
        : filteredCourses.map(course => course.id)
    )
  }

  // IDENTIEKE HELPER FUNCTIES ALS LESSONS
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

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* MAIN CONTENT - 100% BREEDTE EN UITGELIJND MET NAVBAR */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER - EXACT HETZELFDE ALS LESSONS */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
              <p className="text-gray-600">Beheer alle training courses</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Nieuwe Course
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS - EXACT HETZELFDE ALS LESSONS */}
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
                <Icons.clock className="w-6 h-6 text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Gem. Voltooiing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.length > 0 ? Math.round(courses.reduce((acc, course) => acc + course.completionRate, 0) / courses.length) : 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Icons.users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Studenten</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.reduce((acc, course) => acc + course.students, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS - EXACT HETZELFDE ALS LESSONS */}
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
                  {Array.from(new Set(courses.map(c => c.category))).map(category => (
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
                {filteredCourses.length} van {courses.length} courses
              </div>
            </div>
          </div>

          {/* BULK ACTIONS - EXACT HETZELFDE ALS LESSONS */}
          {selectedCourses.length > 0 && (
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-700">
                    {selectedCourses.length} courses geselecteerd
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Activeren
                  </button>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Deactiveren
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                    Verwijderen
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedCourses([])}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Selectie opheffen
                </button>
              </div>
            </div>
          )}

          {/* TABLE - EXACT HETZELFDE ALS LESSONS */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      checked={selectedCourses.length === filteredCourses.length && filteredCourses.length > 0}
                      onChange={toggleAllCourses}
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
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Modules
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Studenten
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
                {filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedCourses.includes(course.id)}
                        onChange={() => toggleCourseSelection(course.id)}
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.users className="w-4 h-4 text-gray-400 mr-1" />
                        {course.students}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="h-2 rounded-full bg-gray-900 transition-all duration-500"
                            style={{ width: `${course.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{course.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(course.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-600 hover:text-blue-600 transition-colors" title="Bekijken">
                          <Icons.eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-green-600 transition-colors" title="Bewerken">
                          <Icons.settings className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-orange-600 transition-colors" title="Status wijzigen">
                          <Icons.power className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-red-600 transition-colors" title="Verwijderen">
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

        {/* DRAG & DROP INFO - EXACT HETZELFDE ALS LESSONS */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Sleep courses om volgorde aan te passen
        </div>
      </div>
    </div>
  )
}