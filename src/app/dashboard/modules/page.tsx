// src/app/dashboard/modules/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'
import ModuleEditor from '@/components/ModuleEditor'

// Gebruik de EXACTEzelfde interface als ModuleEditor
interface Module {
  id: string
  title: string
  description: string
  status: 'CONCEPT' | 'ACTIEF' | 'INACTIEF'
  category: string
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  lessons: number
  duration: number
  order: number
  courseCount: number
  completionRate: number
  tags: string[]
  content: string
  objectives: string[]
  prerequisites: string[]
  createdAt: string
  updatedAt: string
  level?: string
  slug?: string
  enrollments?: number
  lessonCount?: number
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedModules, setSelectedModules] = useState<string[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [difficultyFilter, setDifficultyFilter] = useState('')

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

  // Fetch modules from API - FIXED VERSION
  const fetchModules = async () => {
    try {
      console.log('🔄 Fetching modules from API...')
      setIsLoading(true)
      
      const response = await fetch('/api/modules')
      console.log('📡 API Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch modules: ${response.status} ${response.statusText}`)
      }
      
      const modulesData = await response.json()
      console.log('📊 Modules data received:', modulesData)
      
      // DEBUG: Log each module's lessons count
      modulesData.forEach((module: Module, index: number) => {
        console.log(`📝 Module ${index + 1}:`, {
          title: module.title,
          lessons: module.lessons,
          lessonCount: module.lessonCount,
          duration: module.duration
        })
      })
      
      setModules(modulesData)
    } catch (error) {
      console.error('❌ Error fetching modules:', error)
      alert('Fout bij ophalen modules')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [])

  // Filter modules based on search and filters
  const filteredModules = modules.filter(module => {
    const matchesSearch = searchTerm === '' || 
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (module.tags && module.tags.some((tag: string) => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    
    const matchesStatus = statusFilter === '' || module.status === statusFilter
    const matchesCategory = categoryFilter === '' || module.category === categoryFilter
    const matchesDifficulty = difficultyFilter === '' || module.difficulty === difficultyFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesDifficulty
  })

  // Calculate total lessons - FIXED VERSION
  const totalLessons = modules.reduce((acc, module) => {
    const moduleLessons = Number(module.lessons) || 0
    console.log(`📊 Counting lessons for ${module.title}:`, moduleLessons)
    return acc + moduleLessons
  }, 0)

  // Calculate average duration - FIXED VERSION
  const totalDuration = modules.reduce((acc, module) => {
    const moduleDuration = Number(module.duration) || 0
    return acc + moduleDuration
  }, 0)
  
  const averageDuration = modules.length > 0 ? Math.round(totalDuration / modules.length) : 0

  console.log('📈 Statistics:', {
    totalModules: modules.length,
    totalLessons,
    totalDuration,
    averageDuration
  })

  // Handle module selection
  const handleModuleSelect = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  // Handle select all
  const handleSelectAll = () => {
    if (filteredModules.length === 0) return
    
    setSelectedModules(
      selectedModules.length === filteredModules.length
        ? []
        : filteredModules.map(module => module.id)
    )
  }

  // Handle new module
  const handleNewModule = () => {
    setEditingModule(null)
    setShowEditor(true)
  }

  // Handle edit module
  const handleEditModule = (module: Module) => {
    console.log('✏️ Edit module:', {
      title: module.title,
      lessons: module.lessons,
      duration: module.duration
    })
    setEditingModule(module)
    setShowEditor(true)
  }

  // Handle save module - FIXED VERSION
  const handleSaveModule = async (savedModule: Module) => {
    console.log('💾 Saving module with data:', {
      title: savedModule.title,
      lessons: savedModule.lessons,
      duration: savedModule.duration
    })
    
    try {
      // Zorg ervoor dat lessons en duration numbers zijn
      const processedModule = {
        ...savedModule,
        lessons: Number(savedModule.lessons) || 0,
        duration: Number(savedModule.duration) || 0
      }

      if (editingModule) {
        // Update existing module
        setModules(prev => prev.map(module =>
          module.id === processedModule.id ? processedModule : module
        ))
        console.log('✅ Module updated:', processedModule)
      } else {
        // Add new module
        setModules(prev => [processedModule, ...prev])
        console.log('✅ New module added:', processedModule)
      }
      
      // Refresh data from API to ensure consistency
      await fetchModules()
      
    } catch (error) {
      console.error('❌ Error in handleSaveModule:', error)
    } finally {
      setShowEditor(false)
      setEditingModule(null)
    }
  }

  // Handle delete module
  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Weet je zeker dat je deze module wilt verwijderen?')) {
      return
    }

    try {
      const response = await fetch(`/api/modules?id=${moduleId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete module')
      }

      // Update local state
      setModules(prev => prev.filter(module => module.id !== moduleId))
      setSelectedModules(prev => prev.filter(id => id !== moduleId))
      
      console.log(`✅ Module ${moduleId} deleted successfully`)
    } catch (error: any) {
      console.error('❌ Error deleting module:', error)
      alert(`Fout bij verwijderen module: ${error.message}`)
    }
  }

  // Handle status toggle (lightning icon)
const handleStatusToggle = async (moduleId: string, newStatus: 'ACTIEF' | 'INACTIEF') => {
  try {
    console.log(`🔄 Updating module ${moduleId} status to ${newStatus}`)
    
    const response = await fetch(`/api/modules/${moduleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: newStatus
      }),
    })

    console.log('📡 Status update response:', response.status, response.statusText)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Server error response:', errorText)
      throw new Error(`Failed to update module ${moduleId}: ${response.status} ${response.statusText}`)
    }

    // In plaats van de response te gebruiken, fetch de modules opnieuw
    await fetchModules()
    
    console.log('✅ Module status updated and data refreshed')
    
  } catch (error: any) {
    console.error('❌ Error updating module status:', error)
    alert(`Fout bij bijwerken status module: ${error.message}`)
  }
}

  // Handle bulk status toggle
const handleBulkStatusToggle = async (newStatus: 'ACTIEF' | 'INACTIEF') => {
  if (selectedModules.length === 0) return

  try {
    console.log(`🔄 Bulk updating ${selectedModules.length} modules to ${newStatus}`)
    
    const updatePromises = selectedModules.map(async (moduleId) => {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to update module ${moduleId}`)
      }
      return response.json()
    })

    await Promise.all(updatePromises)
    
    // Refresh modules om consistente data te garanderen
    await fetchModules()
    setSelectedModules([])
    
    console.log(`✅ Bulk status update to ${newStatus} completed`)
  } catch (error: any) {
    console.error('❌ Error in bulk status toggle:', error)
    alert(`Fout bij bijwerken status modules: ${error.message}`)
  }
}

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedModules.length === 0) return
    
    if (!confirm(`Weet je zeker dat je ${selectedModules.length} modules wilt verwijderen?`)) {
      return
    }

    try {
      const deletePromises = selectedModules.map(async (moduleId) => {
        const response = await fetch(`/api/modules?id=${moduleId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          throw new Error(`Failed to delete module ${moduleId}`)
        }
      })

      await Promise.all(deletePromises)

      // Refresh modules
      await fetchModules()
      setSelectedModules([])
      
      console.log(`✅ Bulk delete completed for ${selectedModules.length} modules`)
    } catch (error: any) {
      console.error('❌ Error in bulk delete:', error)
      alert(`Fout bij verwijderen modules: ${error.message}`)
    }
  }

  // Handle view module (eye icon)
  const handleViewModule = (module: Module) => {
    alert(`Bekijk module: ${module.title}\n\nBeschrijving: ${module.description}\n\nLessons: ${module.lessons}\n\nDuur: ${module.duration} minuten`)
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIEF':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'CONCEPT':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      case 'INACTIEF':
        return 'bg-red-50 text-red-700 border border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300'
    }
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'Expert':
        return 'bg-purple-50 text-purple-700 border border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300'
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Modules laden...</p>
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
              <h1 className="text-2xl font-bold text-gray-900">Modules</h1>
              <p className="text-gray-600">Beheer alle modules</p>
            </div>
            <button 
              onClick={handleNewModule}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <Icons.add className="w-5 h-5 mr-2" />
              Nieuwe Module
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS - FIXED LESSONS COUNT */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.modules className="w-6 h-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Modules</p>
                <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.check className="w-6 h-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actieve Modules</p>
                <p className="text-2xl font-bold text-gray-900">
                  {modules.filter(m => m.status === 'ACTIEF').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.lessons className="w-6 h-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Lessons</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalLessons}
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
                  {averageDuration} min
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BULK ACTIONS BAR */}
        {selectedModules.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center">
                <Icons.document className="w-5 h-5 text-blue-700 mr-2" />
                <span className="text-blue-800 font-medium">
                  {selectedModules.length} module(s) geselecteerd
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleBulkStatusToggle('ACTIEF')}
                  className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center"
                >
                  <Icons.bolt className="w-4 h-4 mr-1" />
                  Activeren
                </button>
                <button
                  onClick={() => handleBulkStatusToggle('INACTIEF')}
                  className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors flex items-center"
                >
                  <Icons.bolt className="w-4 h-4 mr-1" />
                  Deactiveren
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center"
                >
                  <Icons.trash className="w-4 h-4 mr-1" />
                  Verwijderen
                </button>
                <button
                  onClick={() => setSelectedModules([])}
                  className="bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm hover:bg-gray-400 transition-colors"
                >
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH AND FILTERS */}
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
                    <option value="ACTIEF">Actief</option>
                    <option value="CONCEPT">Concept</option>
                    <option value="INACTIEF">Inactief</option>
                  </select>
                  
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[160px]"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="">Alle categorieën</option>
                    {Array.from(new Set(modules.map(m => m.category).filter(Boolean))).map(category => (
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
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                {filteredModules.length} van {modules.length} modules
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
                      checked={selectedModules.length === filteredModules.length && filteredModules.length > 0}
                      onChange={handleSelectAll}
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
                    Categorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Moeilijkheid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lessons
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
  {filteredModules.length === 0 ? (
    <tr>
      <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
        {modules.length === 0 ? 'Geen modules gevonden' : 'Geen modules die overeenkomen met de filters'}
      </td>
    </tr>
  ) : (
    filteredModules.map((module) => (
      <tr key={module.id} className="hover:bg-gray-50 transition-colors">
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selectedModules.includes(module.id)}
            onChange={() => handleModuleSelect(module.id)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
        </td>
<td className="px-6 py-4">
  <div>
    <div className="font-medium text-gray-900">{module.title}</div>
    <div className="text-sm text-gray-500 line-clamp-2">{module.description}</div>
    {/* ALTIJD tags controleren op lengte > 0 */}
    {Array.isArray(module.tags) && module.tags.filter(tag => tag && tag.trim().length > 0).length > 0 && (
      <div className="flex flex-wrap gap-1 mt-1">
        {module.tags
          .filter(tag => tag && tag.trim().length > 0) // Filter lege tags
          .slice(0, 3)
          .map((tag, index) => (
            <span key={index} className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
              {tag.replace(/"/g, '')} {/* Verwijder dubbele quotes */}
            </span>
          ))}
        {module.tags.filter(tag => tag && tag.trim().length > 0).length > 3 && (
          <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
            +{module.tags.filter(tag => tag && tag.trim().length > 0).length - 3}
          </span>
        )}
      </div>
    )}
  </div>
</td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(module.status)}`}>
            {module.status === 'ACTIEF' ? 'Actief' : module.status === 'CONCEPT' ? 'Concept' : 'Inactief'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {module.category || '-'}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(module.difficulty)}`}>
            {module.difficulty}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center text-sm text-gray-900">
            <Icons.lessons className="w-4 h-4 text-gray-400 mr-1" />
            {module.lessons || 0}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center text-sm text-gray-900">
            <Icons.clock className="w-4 h-4 text-gray-400 mr-1" />
            {module.duration || 0} min
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {new Date(module.createdAt).toLocaleDateString('nl-NL')}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
          <div className="flex items-center space-x-1">
            {/* Eye icon - View */}
            <button
              onClick={() => handleViewModule(module)}
              className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded hover:bg-blue-50"
              title="Bekijk module"
            >
              <Icons.eye className="w-4 h-4" />
            </button>

            {/* Edit icon */}
            <button
              onClick={() => handleEditModule(module)}
              className="text-gray-400 hover:text-green-600 transition-colors p-2 rounded hover:bg-green-50"
              title="Bewerk module"
            >
              <Icons.edit className="w-4 h-4" />
            </button>

            {/* Status toggle icon */}
            <button
              onClick={() => handleStatusToggle(
                module.id, 
                module.status === 'ACTIEF' ? 'INACTIEF' : 'ACTIEF'
              )}
              className={`transition-colors p-2 rounded ${
                module.status === 'ACTIEF' 
                  ? 'text-yellow-400 hover:text-yellow-600 hover:bg-yellow-50' 
                  : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
              }`}
              title={module.status === 'ACTIEF' ? 'Deactiveren' : 'Activeren'}
            >
              <Icons.bolt className="w-4 h-4" />
            </button>

            {/* Delete icon */}
            <button
              onClick={() => handleDeleteModule(module.id)}
              className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded hover:bg-red-50"
              title="Verwijder module"
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

        {/* Module Editor Modal */}
        {showEditor && (
          <ModuleEditor
            module={editingModule}
            categories={categories}
            onClose={() => {
              setShowEditor(false)
              setEditingModule(null)
            }}
            onSave={handleSaveModule}
          />
        )}
      </div>
    </div>
  )
}