// src/app/dashboard/users/page.tsx - CONSISTENTE STYLING VERSIE
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'
import { UserEditor } from '@/components/users/UserEditor'

interface User {
  id: string
  name: string
  email: string
  role: 'Beheerder' | 'Manager' | 'Cursist'
  status: 'Actief' | 'Inactief' | 'Uitgenodigd'
  image?: string
  organization: string
  enrollments: number
  certificates: number
  quizAttempts: number
  lastLogin: string
  createdAt: string
  updatedAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showEditor, setShowEditor] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      console.log('🔄 Fetching users from API...')
      setIsLoading(true)
      
      const response = await fetch('/api/users')
      console.log('📡 API Response status:', response.status)
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const usersData = await response.json()
      console.log('📊 Users data received:', usersData)
      setUsers(usersData)
    } catch (error) {
      console.error('❌ Error fetching users:', error)
      // Fallback data for demo
      setUsers([
        {
          id: '1',
          name: 'Jan Jansen',
          email: 'jan.jansen@bedrijf.nl',
          role: 'Beheerder',
          status: 'Actief',
          organization: 'SECACA',
          enrollments: 5,
          certificates: 3,
          quizAttempts: 12,
          lastLogin: '2025-10-25T10:30:00Z',
          createdAt: '2025-01-15T00:00:00Z',
          updatedAt: '2025-10-25T00:00:00Z'
        },
        {
          id: '2',
          name: 'Marie de Vries',
          email: 'marie.devries@bedrijf.nl',
          role: 'Cursist',
          status: 'Actief',
          organization: 'SECACA',
          enrollments: 3,
          certificates: 1,
          quizAttempts: 8,
          lastLogin: '2025-10-24T14:20:00Z',
          createdAt: '2025-02-20T00:00:00Z',
          updatedAt: '2025-10-24T00:00:00Z'
        },
        {
          id: '3',
          name: 'Peter Bakker',
          email: 'peter.bakker@bedrijf.nl',
          role: 'Manager',
          status: 'Uitgenodigd',
          organization: 'SECACA',
          enrollments: 0,
          certificates: 0,
          quizAttempts: 0,
          lastLogin: '2025-10-20T09:15:00Z',
          createdAt: '2025-10-20T00:00:00Z',
          updatedAt: '2025-10-20T00:00:00Z'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchTerm === '' || 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.organization.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === '' || user.status === statusFilter
    const matchesRole = roleFilter === '' || user.role === roleFilter

    return matchesSearch && matchesStatus && matchesRole
  })

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  // Handle select all
  const handleSelectAll = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map(user => user.id)
    )
  }

  // Handle new user
  const handleNewUser = () => {
    setEditingUser(null)
    setShowEditor(true)
  }

  // Handle edit user
  const handleEditUser = (user: User) => {
    console.log('Edit user:', user)
    setEditingUser(user)
    setShowEditor(true)
  }

  // Handle save user
  const handleSaveUser = async (userData: any) => {
    try {
      // Use real API call
      const method = editingUser ? 'PUT' : 'POST'
      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save user')
      }

      const savedUser = await response.json()
      
      if (editingUser) {
        // Update existing user
        setUsers(prev => prev.map(user =>
          user.id === savedUser.id ? savedUser : user
        ))
      } else {
        // Add new user
        setUsers(prev => [savedUser, ...prev])
      }
      
      setShowEditor(false)
      setEditingUser(null)
    } catch (error) {
      console.error('Error saving user:', error)
      throw error
    }
  }

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
      return
    }

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }

      // Update local state
      setUsers(prev => prev.filter(user => user.id !== userId))
      setSelectedUsers(prev => prev.filter(id => id !== userId))
      
      console.log(`✅ User ${userId} deleted successfully`)
    } catch (error) {
      console.error('❌ Error deleting user:', error)
      alert(`Fout bij verwijderen gebruiker: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
    }
  }

  // Handle status toggle (lightning icon)
  const handleStatusToggle = async (userId: string, newStatus: 'Actief' | 'Inactief') => {
    try {
      console.log(`🔄 Updating user ${userId} status to ${newStatus}`)
      
      const response = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          status: newStatus
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to update user ${userId}`)
      }

      const updatedUser = await response.json()
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === userId ? updatedUser : user
      ))
      
      console.log(`✅ User ${userId} status updated to ${newStatus}`)
    } catch (error) {
      console.error('❌ Error updating user status:', error)
      alert(`Fout bij bijwerken status gebruiker: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
    }
  }

  // Handle bulk status toggle
  const handleBulkStatusToggle = async (newStatus: 'Actief' | 'Inactief') => {
    try {
      for (const userId of selectedUsers) {
        const response = await fetch('/api/users', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userId,
            status: newStatus
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to update user ${userId}`)
        }
      }

      // Refresh users
      fetchUsers()
      setSelectedUsers([])
      
      console.log(`✅ Bulk status update to ${newStatus} completed`)
    } catch (error) {
      console.error('❌ Error in bulk status toggle:', error)
      alert(`Fout bij bijwerken status gebruikers: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
    }
  }

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!confirm(`Weet je zeker dat je ${selectedUsers.length} gebruikers wilt verwijderen?`)) {
      return
    }

    try {
      for (const userId of selectedUsers) {
        const response = await fetch(`/api/users?id=${userId}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || `Failed to delete user ${userId}`)
        }
      }

      // Refresh users
      fetchUsers()
      setSelectedUsers([])
      
      console.log(`✅ Bulk delete completed for ${selectedUsers.length} users`)
    } catch (error) {
      console.error('❌ Error in bulk delete:', error)
      alert(`Fout bij verwijderen gebruikers: ${error instanceof Error ? error.message : 'Onbekende fout'}`)
    }
  }

  // Handle view user (eye icon)
  const handleViewUser = (user: User) => {
    alert(`Bekijk gebruiker: ${user.name}\n\nEmail: ${user.email}\n\nRol: ${user.role}\n\nStatus: ${user.status}\n\nInschrijvingen: ${user.enrollments}\n\nCertificaten: ${user.certificates}`)
  }

  // Get status color - CONSISTENTE STYLING
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actief':
        return 'bg-green-50 text-green-700 border border-green-200'
      case 'Inactief':
        return 'bg-gray-100 text-gray-700 border border-gray-300'
      case 'Uitgenodigd':
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300'
    }
  }

  // Get role color - CONSISTENTE STYLING
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Beheerder':
        return 'bg-purple-50 text-purple-700 border border-purple-200'
      case 'Manager':
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      case 'Cursist':
        return 'bg-green-50 text-green-700 border border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-300'
    }
  }

  // Format last login date
  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours} uur geleden`
    } else {
      return date.toLocaleDateString('nl-NL')
    }
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
            <button 
              onClick={handleNewUser}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <Icons.add className="w-5 h-5 mr-2" />
              Nieuwe Gebruiker
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS - TERUG NAAR GRIJS/ZWART */}
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
                <p className="text-sm font-medium text-gray-600">Gem. Certificaten</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length > 0 ? Math.round(users.reduce((acc, user) => acc + (user.certificates || 0), 0) / users.length) : 0}
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
                <p className="text-sm font-medium text-gray-600">Online Vandaag</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => {
                    const lastLogin = new Date(u.lastLogin)
                    const today = new Date()
                    return lastLogin.toDateString() === today.toDateString()
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BULK ACTIONS BAR - CONSISTENTE STYLING */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Icons.document className="w-5 h-5 text-blue-700 mr-2" />
                <span className="text-blue-800 font-medium">
                  {selectedUsers.length} gebruiker(s) geselecteerd
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleBulkStatusToggle('Actief')}
                  className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700 transition-colors font-medium"
                >
                  Activeren
                </button>
                <button
                  onClick={() => handleBulkStatusToggle('Inactief')}
                  className="bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-gray-700 transition-colors font-medium"
                >
                  Deactiveren
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium"
                >
                  Verwijderen
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="bg-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-400 transition-colors font-medium"
                >
                  Annuleren
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SEARCH AND FILTERS - CONSISTENTE STYLING */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder="Zoeken op naam, email of organisatie..."
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
                    <option value="Actief">Actief</option>
                    <option value="Inactief">Inactief</option>
                    <option value="Uitgenodigd">Uitgenodigd</option>
                  </select>
                  
                  <select 
                    className="border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-w-[140px]"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="">Alle rollen</option>
                    <option value="Beheerder">Beheerder</option>
                    <option value="Manager">Manager</option>
                    <option value="Cursist">Cursist</option>
                  </select>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg font-medium">
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
                      onChange={handleSelectAll}
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
                    Organisatie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inschrijvingen
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
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
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
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.organization}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>{user.enrollments} ingeschreven</div>
                        <div className="text-xs text-gray-500">{user.certificates} certificaten</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatLastLogin(user.lastLogin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('nl-NL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-1">
                        {/* Eye icon - View */}
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                          title="Bekijk gebruiker"
                        >
                          <Icons.eye className="w-4 h-4" />
                        </button>

                        {/* Edit icon */}
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50"
                          title="Bewerk gebruiker"
                        >
                          <Icons.edit className="w-4 h-4" />
                        </button>

                        {/* Status toggle icon */}
                        <button
                          onClick={() => handleStatusToggle(
                            user.id, 
                            user.status === 'Actief' ? 'Inactief' : 'Actief'
                          )}
                          className="text-gray-400 hover:text-yellow-600 transition-colors p-2 rounded-lg hover:bg-yellow-50"
                          title={user.status === 'Actief' ? 'Deactiveren' : 'Activeren'}
                        >
                          <Icons.bolt className="w-4 h-4" />
                        </button>

                        {/* Delete icon */}
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50"
                          title="Verwijder gebruiker"
                        >
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

        {/* User Editor Modal */}
        {showEditor && (
          <UserEditor
            user={editingUser}
            onClose={() => {
              setShowEditor(false)
              setEditingUser(null)
            }}
            onSave={handleSaveUser}
          />
        )}
      </div>
    </div>
  )
}