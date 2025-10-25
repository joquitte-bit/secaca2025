// app/dashboard/modules/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Icons } from '@/components/Icons'
import ModuleEditor from '@/components/ModuleEditor'

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
}

export default function ModuleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const moduleId = params.id as string
  
  const [module, setModule] = useState<Module | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    if (moduleId) {
      fetchModule()
      fetchCategories()
    }
  }, [moduleId])

  const fetchModule = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log(`🔄 Fetching module ${moduleId}...`)
      const response = await fetch(`/api/modules/${moduleId}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch module: ${response.status}`)
      }
      
      const moduleData = await response.json()
      console.log('📊 Module data received:', moduleData)
      setModule(moduleData)
      
    } catch (err) {
      console.error('❌ Error fetching module:', err)
      setError('Failed to load module: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      } else {
        // Fallback categorieën
        setCategories(['Security Basics', 'Advanced Security', 'Network Security', 'Cryptography'])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
      setCategories(['Security Basics', 'Advanced Security', 'Network Security', 'Cryptography'])
    }
  }

  const handleSaveModule = (savedModule: any) => {
    setModule(savedModule)
    console.log('✅ Module saved successfully')
  }

  const handleBack = () => {
    router.push('/dashboard/modules')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 w-full p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Module laden...</p>
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
          <div className="mt-4 flex gap-3">
            <button 
              onClick={fetchModule}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Probeer opnieuw
            </button>
            <button 
              onClick={handleBack}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Terug naar overzicht
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Not found state
  if (!module) {
    return (
      <div className="min-h-screen bg-gray-50 w-full p-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
          <div className="flex items-center">
            <Icons.info className="w-6 h-6 text-yellow-600 mr-3" />
            <h3 className="text-lg font-medium text-yellow-800">Module niet gevonden</h3>
          </div>
          <p className="mt-2 text-yellow-700">De module die je zoekt bestaat niet of is verwijderd.</p>
          <button 
            onClick={handleBack}
            className="mt-4 bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Terug naar overzicht
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={handleBack}
                className="text-gray-600 hover:text-gray-800 transition-colors p-2 rounded-lg hover:bg-gray-100"
                title="Terug naar overzicht"
              >
                <Icons.arrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{module.title}</h1>
                <p className="text-gray-600 mt-1">Bewerk module details en inhoud</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Laatst bijgewerkt: {module.updatedAt ? new Date(module.updatedAt).toLocaleDateString('nl-NL') : 'Onbekend'}</span>
            </div>
          </div>
        </div>

        {/* EDITOR */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ModuleEditor
            module={module}
            categories={categories}
            onClose={handleBack}
            onSave={handleSaveModule}
          />
        </div>
      </div>
    </div>
  )
}