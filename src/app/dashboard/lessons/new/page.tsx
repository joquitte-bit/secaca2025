// src/app/dashboard/lessons/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewLessonPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    moduleId: '',
    content: '',
    duration: '',
    videoUrl: '',
    isActive: true
  })

  const modules = [
    { id: '1', name: 'Phishing Awareness' },
    { id: '2', name: 'Social Engineering' },
    { id: '3', name: 'Password Security' },
    { id: '4', name: 'Data Protection' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Hier zou je de les opslaan
    console.log('Les aanmaken:', formData)
    router.push('/dashboard/lessons')
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Nieuwe Les</h1>
        <p className="text-gray-600 mt-1">Voeg een nieuwe les toe aan een module</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Les Titel *
            </label>
            <input
              type="text"
              id="title"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label htmlFor="moduleId" className="block text-sm font-medium text-gray-700">
              Module *
            </label>
            <select
              id="moduleId"
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.moduleId}
              onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
            >
              <option value="">Kies een module</option>
              {modules.map((module) => (
                <option key={module.id} value={module.id}>
                  {module.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Beschrijving
            </label>
            <textarea
              id="description"
              rows={3}
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duur (minuten)
              </label>
              <input
                type="number"
                id="duration"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700">
                Video URL (optioneel)
              </label>
              <input
                type="url"
                id="videoUrl"
                className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
              Les Content *
            </label>
            <textarea
              id="content"
              rows={8}
              required
              className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Voeg hier de volledige les content toe..."
            />
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
              Les direct activeren
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="bg-blue-600 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Les Aanmaken
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}