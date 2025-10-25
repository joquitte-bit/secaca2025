// app/dashboard/modules/new/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ModuleEditor from '@/components/ModuleEditor'
import { Module } from '@/types' // ← IMPORT FROM SHARED TYPES


export default function NewModulePage() {
  const router = useRouter()
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    fetchCategories()
  }, [])

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

  const handleSaveModule = (savedModule: Module) => {
    console.log('✅ Module created successfully:', savedModule)
    // Redirect naar modules overzicht
    router.push('/dashboard/modules')
  }

  const handleClose = () => {
    router.push('/dashboard/modules')
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Nieuwe Module</h1>
              <p className="text-gray-600 mt-1">Maak een nieuwe module aan</p>
            </div>
          </div>
        </div>

        {/* EDITOR */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <ModuleEditor
            module={null}
            categories={categories}
            onClose={handleClose}
            onSave={handleSaveModule}
          />
        </div>
      </div>
    </div>
  )
}