// src/app/dashboard/users/page.tsx - MINIMALIST STYLE
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: 'Actief' | 'Inactief' | 'Uitgenodigd'
  lastLogin: string
  enrollments: number
  quizAttempts: number
  completionRate: number
  createdAt: string
  updatedAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Alle statussen')
  const [roleFilter, setRoleFilter] = useState('Alle rollen')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // VERVANG MOCK DATA MET ECHTE API CALL
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      console.log('🔄 Fetching users from API...')
      
      const response = await fetch('/api/users')
      
      console.log('📡 API Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('📊 Users data received:', data)
      console.log('🔍 Number of users:', data.length)
      
      setUsers(data)
      
    } catch (err) {
      console.error('❌ Error fetching users:', err)
      setError('Failed to load users: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'Alle statussen' || user.status === statusFilter
    const matchesRole = roleFilter === 'Alle rollen' || user.role === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const toggleAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map(user => user.id)
    )
  }

  // Helper functions - MINIMALIST VERSION
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actief': return 'bg-gray-100 text-gray-700 border border-gray-300'
      case 'Inactief': return 'bg-gray-100 text-gray-700 border border-gray-300'
      case 'Uitgenodigd': return 'bg-gray-100 text-gray-700 border border-gray-300'
      default: return 'bg-gray-100 text-gray-700 border border-gray-300'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-gray-100 text-gray-700 border border-gray-300'
      case 'TEACHER': return 'bg-gray-100 text-gray-700 border border-gray-300'
      case 'USER': return 'bg-gray-100 text-gray-700 border border-gray-300'
      default: return 'bg-gray-100 text-gray-700 border border-gray-300'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL')
  }

  const formatRole = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Beheerder'
      case 'TEACHER': return 'Docent'
      case 'USER': return 'Gebruiker'
      default: return role
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 w-full p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Gebruikers laden...</p>
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
          <button 
            onClick={fetchUsers}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
          >
            Probeer opnieuw
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gebruikers</h1>
              <p className="text-gray-600">Beheer alle gebruikers</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center">
              <Icons.add className="w-5 h-5 mr-2" />
              Nieuwe Gebruiker
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS - MINIMALIST STYLE */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.users className="w-6 h-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Gebruikers</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.check className="w-6 h-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actieve Gebruikers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'Actief').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.courses className="w-6 h-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gem. Inschrijvingen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length > 0 ? Math.round(users.reduce((acc, user) => acc + user.enrollments, 0) / users.length) : 0}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.document className="w-6 h-6 text-gray-700" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Quizzen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((acc, user) => acc + user.quizAttempts, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BULK ACTIONS BAR - MINIMALIST STYLE */}
        {selectedUsers.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icons.document className="w-5 h-5 text-gray-700 mr-2" />
                <span className="text-gray-800 font-medium">
                  {selectedUsers.length} gebruiker(s) geselecteerd
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {/* handle bulk activate */}}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                >
                  Activeren
                </button>
                <button
                  onClick={() => {/* handle bulk deactivate */}}
                  className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
                >
                  Deactiveren
                </button>
                <button
                  onClick={() => {/* handle bulk delete */}}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Verwijderen
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400 transition-colors"
                >
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH AND FILTERS */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Zoeken op naam of email..."
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
                  <option>Uitgenodigd</option>
                </select>
                
                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option>Alle rollen</option>
                  <option>ADMIN</option>
                  <option>TEACHER</option>
                  <option>USER</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredUsers.length} van {users.length} gebruikers
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
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onChange={toggleAllUsers}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gebruiker
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inschrijvingen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quizzen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laatste Login
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => toggleUserSelection(user.id)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {formatRole(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.courses className="w-4 h-4 text-gray-400 mr-1" />
                        {user.enrollments}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.document className="w-4 h-4 text-gray-400 mr-1" />
                        {user.quizAttempts}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-600 hover:text-blue-600 transition-colors p-1 rounded hover:bg-gray-100" title="Bekijken">
                          <Icons.eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-blue-600 transition-colors p-1 rounded hover:bg-gray-100" title="Bewerken">
                          <Icons.edit className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-yellow-600 transition-colors p-1 rounded hover:bg-gray-100" title="Status wijzigen">
                          <Icons.bolt className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-red-600 transition-colors p-1 rounded hover:bg-gray-100" title="Verwijderen">
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

        <div className="text-center text-sm text-gray-500 mt-4">
          {selectedUsers.length > 0 && `${selectedUsers.length} gebruikers geselecteerd`}
        </div>
      </div>
    </div>
  )
}