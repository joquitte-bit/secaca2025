// src/app/dashboard/users/page.tsx
'use client'

import { useState, useMemo } from 'react'
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
import { UsersModal } from '@/components/UsersModal'
import { SortableUsers } from '@/components/SortableUsers'

interface User {
  id: number
  name: string
  email: string
  role: 'Gebruiker' | 'Beheerder'
  status: 'Actief' | 'Inactief'
  lastLogin: string
  joinDate: string
  department?: string
  phone?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@bedrijf.nl', 
      role: 'Gebruiker', 
      status: 'Actief', 
      lastLogin: '2024-01-15',
      joinDate: '2023-12-01',
      department: 'IT',
      phone: '+31 6 12345678'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@bedrijf.nl', 
      role: 'Beheerder', 
      status: 'Actief', 
      lastLogin: '2024-01-14',
      joinDate: '2023-11-15',
      department: 'HR',
      phone: '+31 6 23456789'
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      email: 'bob@bedrijf.nl', 
      role: 'Gebruiker', 
      status: 'Inactief', 
      lastLogin: '2024-01-10',
      joinDate: '2023-12-20',
      department: 'Finance',
      phone: '+31 6 34567890'
    },
    { 
      id: 4, 
      name: 'Alice Brown', 
      email: 'alice@bedrijf.nl', 
      role: 'Gebruiker', 
      status: 'Actief', 
      lastLogin: '2024-01-15',
      joinDate: '2024-01-05',
      department: 'Marketing',
      phone: '+31 6 45678901'
    },
  ])

  const [departments] = useState([
    'IT',
    'HR', 
    'Finance',
    'Marketing',
    'Sales',
    'Operations'
  ])

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'lastLogin' | 'joinDate' | 'department'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Bulk actions state
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])

  // Helper functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actief': return 'bg-green-100 text-green-800 border border-green-200'
      case 'Inactief': return 'bg-red-100 text-red-800 border border-red-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Beheerder': return 'bg-purple-100 text-purple-800 border border-purple-200'
      case 'Gebruiker': return 'bg-blue-100 text-blue-800 border border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter((user: User) => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesDepartment = !selectedDepartment || user.department === selectedDepartment
      const matchesStatus = !selectedStatus || user.status === selectedStatus
      const matchesRole = !selectedRole || user.role === selectedRole
      
      return matchesSearch && matchesDepartment && matchesStatus && matchesRole
    })

    // Sorting
    filtered.sort((a: User, b: User) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]
      
      if (sortBy === 'lastLogin' || sortBy === 'joinDate') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return filtered
  }, [users, searchTerm, selectedDepartment, selectedStatus, selectedRole, sortBy, sortOrder])

  // Reset alle filters
  const resetFilters = () => {
    setSearchTerm('')
    setSelectedDepartment('')
    setSelectedStatus('')
    setSelectedRole('')
    setSortBy('name')
    setSortOrder('asc')
  }

  // User actions
  const handleDeleteUser = (userId: number) => {
    if (confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?')) {
      setUsers(users.filter(user => user.id !== userId))
    }
  }

  const handleToggleStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { 
            ...user, 
            status: user.status === 'Actief' ? 'Inactief' : 'Actief'
          } 
        : user
    ))
  }

  const handleSaveUser = (userData: any) => {
    if (userData.id && users.find(u => u.id === userData.id)) {
      // Update bestaande user
      setUsers(users.map(user => 
        user.id === userData.id ? userData : user
      ))
    } else {
      // Nieuwe user
      setUsers(prev => [...prev, {
        ...userData,
        id: Date.now(),
        lastLogin: '2024-01-15' // Standaard waarde
      }])
    }
    
    // Close modals automatisch
    setShowCreateModal(false)
    setEditingUser(null)
  }

  // Bulk action handlers
  const toggleUserSelection = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const selectAllUsers = () => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map((user: User) => user.id)
    )
  }

  const handleBulkStatusChange = (newStatus: 'Actief' | 'Inactief') => {
    setUsers(users.map(user =>
      selectedUsers.includes(user.id)
        ? { ...user, status: newStatus }
        : user
    ))
    setSelectedUsers([])
  }

  const handleBulkDelete = () => {
    if (confirm(`Weet je zeker dat je ${selectedUsers.length} gebruikers wilt verwijderen?`)) {
      setUsers(users.filter(user => !selectedUsers.includes(user.id)))
      setSelectedUsers([])
    }
  }

  // Drag & Drop sensors - TOEGEVOEGD
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Handle drag end - TOEGEVOEGD
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setUsers((currentUsers) => {
        const oldIndex = currentUsers.findIndex((user) => user.id === active.id)
        const newIndex = currentUsers.findIndex((user) => user.id === over.id)

        return arrayMove(currentUsers, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Gebruikers Beheer</h1>
            <p className="text-gray-600 mt-1">Beheer alle gebruikers en hun rechten</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
          >
            <Icons.add className="w-4 h-4" />
            <span>Nieuwe Gebruiker</span>
          </button>
        </div>
      </div>

      {/* Filters en Search Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-4">
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
                placeholder="Zoek op naam, email of afdeling..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Icons.search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>

          {/* Department Filter */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
              Afdeling
            </label>
            <select
              id="department"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
            >
              <option value="">Alle afdelingen</option>
              {departments.map(department => (
                <option key={department} value={department}>{department}</option>
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
            </select>
          </div>

          {/* Role Filter */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
              Rol
            </label>
            <select
              id="role"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Alle rollen</option>
              <option value="Beheerder">Beheerder</option>
              <option value="Gebruiker">Gebruiker</option>
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
                <option value="name">Naam</option>
                <option value="lastLogin">Laatste login</option>
                <option value="joinDate">Lid sinds</option>
                <option value="department">Afdeling</option>
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
              {filteredUsers.length} van {users.length} gebruikers
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
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-blue-700 font-medium">
                {selectedUsers.length} gebruiker(s) geselecteerd
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
              onClick={() => setSelectedUsers([])}
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
              <p className="text-sm font-medium text-gray-600">Totaal Gebruikers</p>
              <p className="text-2xl font-semibold text-gray-900">{users.length}</p>
            </div>
            <Icons.users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actieve Gebruikers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.status === 'Actief').length}
              </p>
            </div>
            <Icons.check className="w-8 h-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Beheerders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'Beheerder').length}
              </p>
            </div>
            <Icons.shield className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nieuwe Gebruikers</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => new Date(u.joinDate) > new Date('2024-01-01')).length}
              </p>
            </div>
            <Icons.add className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                onChange={selectAllUsers}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <h2 className="text-lg font-medium text-gray-900">Gebruikers Lijst</h2>
              <div className="text-sm text-gray-600">
                {filteredUsers.length} van {users.length} gebruikers
              </div>
              
              {/* Drag & Drop Info - TOEGEVOEGD */}
              <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <span>Sleep gebruikers om volgorde aan te passen</span>
              </div>
            </div>
            
            {selectedUsers.length > 0 && (
              <div className="text-sm text-blue-600 font-medium">
                {selectedUsers.length} geselecteerd
              </div>
            )}
          </div>
        </div>
        
        {/* DndContext wrapper - TOEGEVOEGD */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredUsers.map((u: User) => u.id)} strategy={verticalListSortingStrategy}>
            <div className="divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Icons.users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Geen gebruikers gevonden</h3>
                  <p className="text-gray-600 mb-4">
                    {searchTerm || selectedDepartment || selectedStatus || selectedRole
                      ? 'Probeer je zoekcriteria aan te passen.' 
                      : 'Er zijn nog geen gebruikers aangemaakt.'}
                  </p>
                  {!searchTerm && !selectedDepartment && !selectedStatus && !selectedRole && (
                    <button 
                      onClick={() => setShowCreateModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Eerste Gebruiker Aanmaken
                    </button>
                  )}
                </div>
              ) : (
                filteredUsers.map((user: User) => (
                  <SortableUsers
                    key={user.id}
                    user={user}
                    isSelected={selectedUsers.includes(user.id)}
                    onToggleSelection={toggleUserSelection}
                    onEdit={setEditingUser}
                    onToggleStatus={handleToggleStatus}
                    onDelete={handleDeleteUser}
                    getStatusColor={getStatusColor}
                    getRoleColor={getRoleColor}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      {/* Modals */}
      {showCreateModal && (
        <UsersModal 
          user={null}
          departments={departments}
          onClose={() => setShowCreateModal(false)}
          onSave={handleSaveUser}
        />
      )}

      {editingUser && (
        <UsersModal 
          user={editingUser}
          departments={departments}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}
    </div>
  )
}