// 📁 BESTAND: /src/app/dashboard/modules/page.tsx
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
import { ModuleModal as ModuleEditor } from '@/components/ModuleModal'
import { SortableModule } from '@/components/SortableModule'

// Module interface - CONSISTENTE VERSIE
interface Module {
  id: string
  title: string
  description: string
  status: 'Actief' | 'Inactief' | 'Concept'
  category: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Expert'
  order: number
  tags?: string[]
  students: number
  progress: number
  lessons: number
  createdAt: string
  updatedAt: string
}

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Haal modules op van de database
  useEffect(() => {
    const fetchModules = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await fetch('/api/modules')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch modules: ${response.status}`)
        }
        
        const data = await response.json()
        console.log('📥 API Response data:', data)
        
        if (Array.isArray(data)) {
          const transformedModules = data.map((module: any) => ({
            id: module.id || '',
            title: module.title || 'Untitled Module',
            description: module.description || '',
            status: module.status || 'Concept',
            category: module.category || 'Uncategorized',
            duration: module.duration || 0,
            difficulty: module.difficulty || 'Beginner',
            order: module.order || 0,
            tags: Array.isArray(module.tags) 
              ? module.tags 
              : typeof module.tags === 'string' 
                ? JSON.parse(module.tags || '[]')
                : [],
            students: module.students || 0,
            progress: module.progress || 0,
            lessons: module.lessons || (Array.isArray(module.includedLessons) ? module.includedLessons.length : 0) || 0,
            createdAt: module.createdAt || new Date().toISOString().split('T')[0],
            updatedAt: module.updatedAt || new Date().toISOString().split('T')[0]
          }))
          setModules(transformedModules)
          console.log(`✅ Loaded ${transformedModules.length} modules directly from array`)
        } else if (data.modules && Array.isArray(data.modules)) {
          const transformedModules = data.modules.map((module: any) => ({
            id: module.id || '',
            title: module.title || 'Untitled Module',
            description: module.description || '',
            status: module.status || 'Concept',
            category: module.category || 'Uncategorized',
            duration: module.duration || 0,
            difficulty: module.difficulty || 'Beginner',
            order: module.order || 0,
            tags: Array.isArray(module.tags) 
              ? module.tags 
              : typeof module.tags === 'string' 
                ? JSON.parse(module.tags || '[]')
                : [],
            students: module.students || 0,
            progress: module.progress || 0,
            lessons: module.lessons || (Array.isArray(module.includedLessons) ? module.includedLessons.length : 0) || 0,
            createdAt: module.createdAt || new Date().toISOString().split('T')[0],
            updatedAt: module.updatedAt || new Date().toISOString().split('T')[0]
          }))
          setModules(transformedModules)
          console.log(`✅ Loaded ${transformedModules.length} modules from data.modules`)
        } else {
          console.log('❌ No modules array found in response:', data)
          setModules([])
        }
      } catch (error) {
        console.error('Error fetching modules:', error)
        setError('Failed to load modules. Please try again.')
        setModules([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchModules()
  }, [])

  const [categories] = useState([
    'Security Basics',
    'Advanced Security', 
    'Data Security',
    'Compliance',
    'Technical Security'
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [sortBy, setSortBy] = useState<'title' | 'order' | 'duration' | 'updatedAt'>('order')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Bulk actions state
  const [selectedModules, setSelectedModules] = useState<string[]>([])

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

  // Filtered and sorted modules
  const filteredModules = useMemo(() => {
    if (!modules || !Array.isArray(modules)) {
      return []
    }

    let filtered = modules.filter((module: Module) => {
      const title = module?.title || ''
      const description = module?.description || ''
      const tags = module?.tags || []
      const category = module?.category || ''
      const status = module?.status || 'Concept'
      const difficulty = module?.difficulty || 'Beginner'

      const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesCategory = !selectedCategory || category === selectedCategory
      const matchesStatus = !selectedStatus || status === selectedStatus
      const matchesDifficulty = !selectedDifficulty || difficulty === selectedDifficulty
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty
    })

    // Sorting
    filtered.sort((a: Module, b: Module) => {
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
  }, [modules, searchTerm, selectedCategory, selectedStatus, selectedDifficulty, sortBy, sortOrder])

  // Reset alle filters
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedStatus('')
    setSelectedDifficulty('')
    setSortBy('order')
    setSortOrder('asc')
  }

  // Module actions
  const handleDeleteModule = async (moduleId: string) => {
    if (!moduleId) {
      console.error('❌ No module ID provided for deletion')
      alert('Error: No module ID provided')
      return
    }

    if (confirm('Weet je zeker dat je deze module wilt verwijderen?')) {
      try {
        console.log(`🗑️ Attempting to delete module: ${moduleId}`)
        
        const response = await fetch(`/api/modules/${moduleId}`, {
          method: 'DELETE',
        })

        console.log(`📨 Delete response status: ${response.status}`)

        if (response.ok) {
          console.log(`✅ Successfully deleted module: ${moduleId}`)
          setModules(modules.filter(module => module.id !== moduleId))
          setSelectedModules(prev => prev.filter(id => id !== moduleId))
        } else {
          const errorText = await response.text()
          console.error(`❌ Failed to delete module: ${response.status} - ${errorText}`)
          alert(`Failed to delete module: ${response.status}`)
        }
      } catch (error) {
        console.error('💥 Error deleting module:', error)
        alert('Error deleting module. Check console for details.')
      }
    }
  }

  const handleToggleStatus = async (moduleId: string) => {
    if (!moduleId) {
      console.error('❌ No module ID provided for status toggle')
      return
    }

    const module = modules.find(m => m.id === moduleId)
    if (!module) {
      console.error(`❌ Module not found: ${moduleId}`)
      return
    }

    const newStatus = module.status === 'Actief' ? 'Inactief' : 'Actief'
    console.log(`🔄 Toggling status for module ${moduleId} from ${module.status} to ${newStatus}`)
    
    try {
      const response = await fetch(`/api/modules/${moduleId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      console.log(`📨 Status update response: ${response.status}`)

      if (response.ok) {
        console.log(`✅ Successfully updated status for module: ${moduleId}`)
        setModules(modules.map(module => 
          module.id === moduleId 
            ? { 
                ...module, 
                status: newStatus,
                updatedAt: new Date().toISOString()
              } 
            : module
        ))
      } else {
        const errorText = await response.text()
        console.error(`❌ Failed to update module status: ${response.status} - ${errorText}`)
        alert(`Failed to update module status: ${response.status}`)
      }
    } catch (error) {
      console.error('💥 Error updating module status:', error)
      alert('Error updating module status. Check console for details.')
    }
  }

  const handleSaveModule = async (moduleData: any) => {
    try {
      console.log('💾 Saving module data:', moduleData)

      // Bereid de data voor voor de API - gebruik de data van ModuleModal
      const payload = {
        title: moduleData.title,
        description: moduleData.description,
        category: moduleData.category,
        status: moduleData.status,
        order: moduleData.order || 1,
        duration: moduleData.duration || 0,
        difficulty: moduleData.difficulty || 'Beginner',
        tags: moduleData.tags || [],
        lessonIds: moduleData.includedLessons || [],
        courseId: moduleData.courseId
      }

      console.log('🎯 Final payload to API:', payload)

      let response
      let url = '/api/modules'
      let method = 'POST'

      // Check of we een bestaande module updaten
      if (moduleData.id) {
        url = `/api/modules/${moduleData.id}`
        method = 'PUT' // Gebruik PUT voor updates
        console.log(`🔄 Updating existing module: ${moduleData.id}`)
      } else {
        console.log('🆕 Creating new module')
      }

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      console.log('📨 API Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const savedModule = await response.json()
      console.log('✅ Module saved successfully:', savedModule)

      // Update de state direct in plaats van te refreshen
      if (moduleData.id) {
        // Update bestaande module
        setModules(prev => prev.map(module => 
          module.id === moduleData.id 
            ? {
                ...module,
                title: moduleData.title,
                description: moduleData.description,
                category: moduleData.category,
                status: moduleData.status,
                duration: moduleData.duration || 0,
                difficulty: moduleData.difficulty || 'Beginner',
                order: moduleData.order || 1,
                tags: moduleData.tags || [],
                lessons: moduleData.includedLessons?.length || 0,
                updatedAt: new Date().toISOString()
              }
            : module
        ))
      } else {
        // Voeg nieuwe module toe
        const newModule: Module = {
          id: savedModule.id || Date.now().toString(),
          title: moduleData.title,
          description: moduleData.description,
          status: moduleData.status,
          category: moduleData.category,
          duration: moduleData.duration || 0,
          difficulty: moduleData.difficulty || 'Beginner',
          order: moduleData.order || 1,
          tags: moduleData.tags || [],
          students: 0,
          progress: 0,
          lessons: moduleData.includedLessons?.length || 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        setModules(prev => [...prev, newModule])
      }
      
      // Close modals
      setShowCreateModal(false)
      setEditingModule(null)
      alert('Module succesvol opgeslagen!')
      
    } catch (error) {
      console.error('💥 Error saving module:', error)
      alert(`Error saving module: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Bulk action handlers
  const toggleModuleSelection = (moduleId: string) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const selectAllModules = () => {
    setSelectedModules(
      selectedModules.length === filteredModules.length && filteredModules.length > 0
        ? []
        : filteredModules.map((module: Module) => module.id)
    )
  }

  const handleBulkStatusChange = async (newStatus: 'Actief' | 'Inactief') => {
    if (selectedModules.length === 0) return

    try {
      console.log(`🔄 Bulk updating ${selectedModules.length} modules to status: ${newStatus}`)
      
      const response = await fetch('/api/modules/bulk', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          moduleIds: selectedModules,
          status: newStatus
        }),
      })

      console.log(`📨 Bulk update response: ${response.status}`)

      if (response.ok) {
        console.log(`✅ Successfully bulk updated ${selectedModules.length} modules`)
        setModules(modules.map(module =>
          selectedModules.includes(module.id)
            ? { ...module, status: newStatus, updatedAt: new Date().toISOString() }
            : module
        ))
        setSelectedModules([])
      } else {
        const errorText = await response.text()
        console.error(`❌ Failed to bulk update modules: ${response.status} - ${errorText}`)
        alert(`Failed to update modules: ${response.status}`)
      }
    } catch (error) {
      console.error('💥 Error updating modules:', error)
      alert('Error updating modules. Check console for details.')
    }
  }

  const handleBulkDelete = async () => {
    if (selectedModules.length === 0) return

    if (confirm(`Weet je zeker dat je ${selectedModules.length} modules wilt verwijderen?`)) {
      try {
        console.log(`🗑️ Attempting bulk delete of ${selectedModules.length} modules`)
        
        const response = await fetch('/api/modules/bulk', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ moduleIds: selectedModules }),
        })

        console.log(`📨 Bulk delete response: ${response.status}`)

        if (response.ok) {
          console.log(`✅ Successfully bulk deleted ${selectedModules.length} modules`)
          setModules(modules.filter(module => !selectedModules.includes(module.id)))
          setSelectedModules([])
        } else {
          const errorText = await response.text()
          console.error(`❌ Failed to bulk delete modules: ${response.status} - ${errorText}`)
          alert(`Failed to delete modules: ${response.status}`)
        }
      } catch (error) {
        console.error('💥 Error deleting modules:', error)
        alert('Error deleting modules. Check console for details.')
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
      const oldIndex = modules.findIndex((module) => module.id === active.id)
      const newIndex = modules.findIndex((module) => module.id === over.id)

      if (oldIndex === -1 || newIndex === -1) return

      const reorderedModules = arrayMove(modules, oldIndex, newIndex)
      
      const updatedModules = reorderedModules.map((module, index) => ({
        ...module,
        order: index + 1,
        updatedAt: new Date().toISOString()
      }))

      setModules(updatedModules)

      try {
        const response = await fetch('/api/modules/reorder', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            modules: updatedModules.map(module => ({
              id: module.id,
              order: module.order
            }))
          }),
        })

        if (!response.ok) {
          console.error('Failed to update module order')
        }
      } catch (error) {
        console.error('Error updating module order:', error)
      }
    }
  }

  // Calculate statistics safely
  const totalModules = modules.length
  const activeModules = modules.filter(m => m.status === 'Actief').length
  const totalDuration = modules.reduce((acc, module) => acc + (module.duration || 0), 0)
  const totalLessons = modules.reduce((acc, module) => {
    const lessons = module.lessons;
    if (typeof lessons === 'number') {
      return acc + lessons;
    } else {
      return acc + 0;
    }
  }, 0)

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600">
            <Icons.loading />
          </div>
          <p className="text-gray-600">Modules laden...</p>
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
            <h1 className="text-2xl font-semibold text-gray-900">Modules Beheer</h1>
            <p className="text-gray-600 mt-1">Beheer alle training modules</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <div className="w-4 h-4">
              <Icons.add />
            </div>
            <span>Nieuwe Module</span>
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
              {filteredModules.length} van {modules.length} modules
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
      {selectedModules.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-blue-700 font-medium">
                {selectedModules.length} module(s) geselecteerd
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
              onClick={() => setSelectedModules([])}
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
              <p className="text-sm font-medium text-gray-600">Totaal Modules</p>
              <p className="text-2xl font-semibold text-gray-900">{totalModules}</p>
            </div>
            <div className="w-8 h-8 text-blue-600">
              <Icons.modules />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actieve Modules</p>
              <p className="text-2xl font-semibold text-gray-900">{activeModules}</p>
            </div>
            <div className="w-8 h-8 text-green-600">
              <Icons.check />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totaal Lessen</p>
              <p className="text-2xl font-semibold text-gray-900">{totalLessons}</p>
            </div>
            <div className="w-8 h-8 text-purple-600">
              <Icons.lessons />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totale Duur</p>
              <p className="text-2xl font-semibold text-gray-900">{totalDuration} min</p>
            </div>
            <div className="w-8 h-8 text-orange-600">
              <Icons.clock />
            </div>
          </div>
        </div>
      </div>

      {/* Modules Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedModules.length === filteredModules.length && filteredModules.length > 0}
                onChange={selectAllModules}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <h2 className="text-lg font-medium text-gray-900">Modules</h2>
              <div className="text-sm text-gray-600">
                {filteredModules.length} van {modules.length} modules
              </div>
              
              {/* Drag & Drop Info */}
              <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <span>Sleep modules om volgorde aan te passen</span>
              </div>
            </div>
            
            {selectedModules.length > 0 && (
              <div className="text-sm text-blue-600 font-medium">
                {selectedModules.length} geselecteerd
              </div>
            )}
          </div>
        </div>
        
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredModules.map((m: Module) => m.id)} strategy={verticalListSortingStrategy}>
            <div className="divide-y divide-gray-200">
              {filteredModules.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
                    <Icons.document />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Geen modules gevonden</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedCategory || selectedStatus || selectedDifficulty
                      ? 'Probeer je zoekcriteria aan te passen.' 
                      : 'Er zijn nog geen modules aangemaakt.'}
                  </p>
                  {!searchTerm && !selectedCategory && !selectedStatus && !selectedDifficulty && (
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Eerste Module Aanmaken
                    </button>
                  )}
                </div>
              ) : (
                filteredModules.map((module: Module) => (
                  <SortableModule
                    key={module.id}
                    module={module}
                    isSelected={selectedModules.includes(module.id)}
                    onToggleSelection={toggleModuleSelection}
                    onEdit={(module) => setEditingModule(module)}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteModule}
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
        <ModuleEditor 
          module={null}
          categories={categories}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveModule}
        />
      )}

      {editingModule && (
        <ModuleEditor 
          module={editingModule}
          categories={categories}
          onClose={() => setEditingModule(null)}
          onSave={handleSaveModule}
        />
      )}
    </div>
  )
}