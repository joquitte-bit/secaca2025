// src/app/dashboard/users/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Icons } from '@/components/Icons'

// Lokale UserDetail interface
interface UserDetail {
  id: string
  name: string
  email: string
  role: 'Beheerder' | 'Manager' | 'Cursist'
  status: 'Actief' | 'Inactief' | 'Uitgenodigd'
  image?: string
  organization: string
  enrollments: any[]
  certificates: any[]
  quizAttempts: any[]
  lastLogin: string
  createdAt: string
  updatedAt: string
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [user, setUser] = useState<UserDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUser()
  }, [params.id])

  const fetchUser = async () => {
    try {
      const response = await fetch(`/api/users/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch user')
      const data = await response.json()
      
      // Transform the data to match our interface
      const userData: UserDetail = {
        ...data,
        role: data.role as 'Beheerder' | 'Manager' | 'Cursist',
        status: data.status as 'Actief' | 'Inactief' | 'Uitgenodigd',
        enrollments: data.enrollments || [],
        certificates: data.certificates || [],
        quizAttempts: data.quizAttempts || []
      }
      
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="flex items-center justify-center h-64">
          <Icons.loading className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl">
          <div className="flex items-center">
            <Icons.shield className="w-6 h-6 text-red-600 mr-3" />
            <h3 className="text-lg font-medium text-red-800">Error</h3>
          </div>
          <p className="mt-2 text-red-700">{error || 'User not found'}</p>
          <button 
            onClick={() => router.push('/dashboard/users')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Terug naar Gebruikers
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.push('/dashboard/users')}
            className="flex items-center text-gray-600 hover:text-gray-800 mb-4"
          >
            <Icons.arrowLeft className="w-4 h-4 mr-2" />
            Terug naar Gebruikers
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-600">{user.email}</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Bewerken
              </button>
            </div>
          </div>
        </div>

        {/* User Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Gebruikersinformatie</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Rol:</span>
                <span className="font-medium">{user.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  user.status === 'Actief' ? 'bg-green-100 text-green-800' : 
                  user.status === 'Inactief' ? 'bg-red-100 text-red-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Organisatie:</span>
                <span className="font-medium">{user.organization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aangemaakt op:</span>
                <span className="font-medium">{new Date(user.createdAt).toLocaleDateString('nl-NL')}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Statistieken</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Inschrijvingen:</span>
                <span className="font-medium">{user.enrollments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Certificaten:</span>
                <span className="font-medium">{user.certificates.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quiz pogingen:</span>
                <span className="font-medium">{user.quizAttempts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Laatst bijgewerkt:</span>
                <span className="font-medium">{new Date(user.updatedAt).toLocaleDateString('nl-NL')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enrollments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Cursus Inschrijvingen</h3>
          </div>
          <div className="p-6">
            {user.enrollments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Nog geen cursus inschrijvingen</p>
            ) : (
              <div className="space-y-4">
                {user.enrollments.map((enrollment: any) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{enrollment.course?.title || 'Onbekende cursus'}</h4>
                      <p className="text-sm text-gray-600">
                        Gestart: {new Date(enrollment.startedAt).toLocaleDateString('nl-NL')}
                        {enrollment.completedAt && ` - Voltooid: ${new Date(enrollment.completedAt).toLocaleDateString('nl-NL')}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-gray-600">Voortgang: {enrollment.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}