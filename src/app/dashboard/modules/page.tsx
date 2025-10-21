// 📁 BESTAND: /src/app/dashboard/module/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'

interface Module {
  id: string
  title: string
  description: string
  status: 'Actief' | 'Inactief' | 'Concept'
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  lessons: number
  duration: number
  order: number
  completionRate: number
  courseCount: number
  tags: string[]
  updatedAt: string
}

export default function ModulePage() {
  const [modules, setModules] = useState<Module[]>([])
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Alle statussen')
  const [categoryFilter, setCategoryFilter] = useState('Alle categorieën')
  const [difficultyFilter, setDifficultyFilter] = useState('Alle niveaus')

  // Mock data - IDENTIEKE STRUCTUUR ALS LESSONS & COURSES
  useEffect(() => {
    const mockModules: Module[] = [
      {
        id: '1',
        title: 'Phishing Awareness',
        description: 'Herkennen en voorkomen van phishing aanvallen',
        status: 'Actief',
        category: 'Security',
        difficulty: 'Beginner',
        lessons: 5,
        duration: 45,
        order: 1,
        completionRate: 85,
        courseCount: 2,
        tags: ['phishing', 'security'],
        updatedAt: '2025-10-21T08:08:29.900Z'
      },
      {
        id: '2',
        title: 'Data Privacy',
        description: 'Begrijpen en implementeren van dataprivacy principes',
        status: 'Actief',
        category: 'Compliance',
        difficulty: 'Intermediate',
        lessons: 8,
        duration: 60,
        order: 2,
        completionRate: 72,
        courseCount: 3,
        tags: ['privacy', 'gdpr'],
        updatedAt: '2025-10-20T14:30:00.000Z'
      },
      {
        id: '3',
        title: 'Advanced Threat Analysis',
        description: 'Geavanceerde technieken voor bedreigingsanalyse',
        status: 'Concept',
        category: 'Security',
        difficulty: 'Expert',
        lessons: 12,
        duration: 120,
        order: 3,
        completionRate: 45,
        courseCount: 1,
        tags: ['threat', 'analysis', 'advanced'],
        updatedAt: '2025-10-19T10:15:00.000Z'
      }
    ]
    setModules(mockModules)
  }, [])

  // Filter modules - IDENTIEKE LOGICA ALS LESSONS & COURSES
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'Alle statussen' || module.status === statusFilter
    const matchesCategory = categoryFilter === 'Alle categorieën' || module.category === categoryFilter
    const matchesDifficulty = difficultyFilter === 'Alle niveaus' || module.difficulty === difficultyFilter
    
    return matchesSearch && matchesStatus && matchesCategory && matchesDifficulty
  })

  const toggleModuleSelection = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const toggleAllModules = () => {
    setSelectedModules(
      selectedModules.length === filteredModules.length
        ? []
        : filteredModules.map(module => module.id)
    )
  }

  // IDENTIEKE HELPER FUNCTIES ALS LESSONS & COURSES
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
        {/* HEADER - EXACT HETZELFDE ALS LESSONS & COURSES */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Modules</h1>
              <p className="text-gray-600">Beheer alle training modules</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Nieuwe Module
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS - EXACT HETZELFDE ALS LESSONS & COURSES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icons.modules className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Modules</p>
                <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icons.clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actieve Modules</p>
                <p className="text-2xl font-bold text-gray-900">
                  {modules.filter(m => m.status === 'Actief').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Icons.lessons className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gem. Voltooiing</p>
                <p className="text-2xl font-bold text-gray-90">
                  {modules.length > 0 ? Math.round(modules.reduce((acc, module) => acc + module.completionRate, 0) / modules.length) : 0}%
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
                  {modules.reduce((acc, module) => acc + module.duration, 0)} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS - EXACT HETZELFDE ALS LESSONS & COURSES */}
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
                  {Array.from(new Set(modules.map(m => m.category))).map(category => (
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
                {filteredModules.length} van {modules.length} modules
              </div>
            </div>
          </div>

          {/* BULK ACTIONS - EXACT HETZELFDE ALS LESSONS & COURSES */}
          {selectedModules.length > 0 && (
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-700">
                    {selectedModules.length} modules geselecteerd
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
                  onClick={() => setSelectedModules([])}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Selectie opheffen
                </button>
              </div>
            </div>
          )}

          {/* TABLE - EXACT HETZELFDE ALS LESSONS & COURSES */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      checked={selectedModules.length === filteredModules.length && filteredModules.length > 0}
                      onChange={toggleAllModules}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Niveau
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lessen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Courses
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
                {filteredModules.map((module) => (
                  <tr key={module.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedModules.includes(module.id)}
                        onChange={() => toggleModuleSelection(module.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{module.title}</div>
                        <div className="text-sm text-gray-500">{module.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
                        {module.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
                        {module.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.lessons className="w-4 h-4 text-gray-400 mr-1" />
                        {module.lessons}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.clock className="w-4 h-4 text-gray-400 mr-1" />
                        {module.duration} min
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.courses className="w-4 h-4 text-gray-400 mr-1" />
                        {module.courseCount}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="h-2 rounded-full bg-gray-900 transition-all duration-500"
                            style={{ width: `${module.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{module.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(module.updatedAt)}
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

        {/* DRAG & DROP INFO - EXACT HETZELFDE ALS LESSONS & COURSES */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Sleep modules om volgorde aan te passen
        </div>
      </div>
    </div>
  )
}