// src/app/dashboard/courses/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewCoursePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'beginner',
    isActive: true,
    includedModules: [] as number[]
  })

  // Mock modules data - in een echte app zou dit uit de database komen
  const availableModules = [
    { id: 1, title: 'Phishing Awareness', category: 'Security Basics' },
    { id: 2, title: 'Social Engineering', category: 'Advanced Security' },
    { id: 3, title: 'Password Security', category: 'Security Basics' },
    { id: 4, title: 'Data Protection', category: 'Data Security' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Hier zou je de course opslaan
    console.log('Course aanmaken:', formData)
    router.push('/dashboard/courses')
  }

  const toggleModuleSelection = (moduleId: number) => {
    setFormData(prev => ({
      ...prev,
      includedModules: prev.includedModules.includes(moduleId)
        ? prev.includedModules.filter(id => id !== moduleId)
        : [...prev.includedModules, moduleId]
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Nieuwe Course</h1>
            <p className="text-gray-600">Voeg een nieuwe training course toe met modules</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Titel *
                </label>
                <input
                  type="text"
                  id="title"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Beschrijving
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Categorie
                  </label>
                  <select
                    id="category"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="">Kies een categorie</option>
                    <option value="Security Basics">Security Basics</option>
                    <option value="Advanced Security">Advanced Security</option>
                    <option value="Data Security">Data Security</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Technical Security">Technical Security</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                    Moeilijkheidsgraad
                  </label>
                  <select
                    id="difficulty"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Gevorderd</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>

              {/* Module Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Selecteer Modules voor deze Course
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4">
                  {availableModules.map(module => (
                    <div key={module.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`module-${module.id}`}
                        checked={formData.includedModules.includes(module.id)}
                        onChange={() => toggleModuleSelection(module.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label 
                        htmlFor={`module-${module.id}`}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        {module.title} 
                        <span className="text-gray-500 text-xs ml-2">({module.category})</span>
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {formData.includedModules.length} module(s) geselecteerd
                </p>
              </div>

              <div className="flex items-center">
                <input
                  id="isActive"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Course direct activeren
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Course Aanmaken
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}