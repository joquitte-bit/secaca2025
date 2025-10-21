// 📁 BESTAND: /src/app/dashboard/users/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Icons } from '@/components/Icons'

interface User {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'User' | 'Viewer'
  status: 'Actief' | 'Inactief' | 'Uitgenodigd'
  department: string
  completedCourses: number
  totalCourses: number
  progress: number
  lastActive: string
  joinedAt: string
  tags: string[]
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Alle statussen')
  const [roleFilter, setRoleFilter] = useState('Alle rollen')
  const [departmentFilter, setDepartmentFilter] = useState('Alle afdelingen')

  // Mock data - IDENTIEKE STRUCTUUR ALS ANDERE PAGINA'S
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'Jan Jansen',
        email: 'jan.jansen@bedrijf.nl',
        role: 'Admin',
        status: 'Actief',
        department: 'IT',
        completedCourses: 12,
        totalCourses: 15,
        progress: 80,
        lastActive: '2025-10-21T08:08:29.900Z',
        joinedAt: '2025-01-15T00:00:00.000Z',
        tags: ['admin', 'it']
      },
      {
        id: '2',
        name: 'Marie van Dijk',
        email: 'marie.vandijk@bedrijf.nl',
        role: 'Manager',
        status: 'Actief',
        department: 'HR',
        completedCourses: 8,
        totalCourses: 10,
        progress: 65,
        lastActive: '2025-10-20T14:30:00.000Z',
        joinedAt: '2025-02-10T00:00:00.000Z',
        tags: ['manager', 'hr']
      },
      {
        id: '3',
        name: 'Peter de Vries',
        email: 'peter.devries@bedrijf.nl',
        role: 'User',
        status: 'Uitgenodigd',
        department: 'Sales',
        completedCourses: 0,
        totalCourses: 5,
        progress: 0,
        lastActive: '2025-10-19T10:15:00.000Z',
        joinedAt: '2025-10-18T00:00:00.000Z',
        tags: ['sales', 'new']
      }
    ]
    setUsers(mockUsers)
  }, [])

  // Filter users - IDENTIEKE LOGICA ALS ANDERE PAGINA'S
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'Alle statussen' || user.status === statusFilter
    const matchesRole = roleFilter === 'Alle rollen' || user.role === roleFilter
    const matchesDepartment = departmentFilter === 'Alle afdelingen' || user.department === departmentFilter
    
    return matchesSearch && matchesStatus && matchesRole && matchesDepartment
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

  // IDENTIEKE HELPER FUNCTIES ALS ANDERE PAGINA'S
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Actief': return 'bg-green-100 text-green-800'
      case 'Inactief': return 'bg-red-100 text-red-800'
      case 'Uitgenodigd': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin': return 'bg-purple-100 text-purple-800'
      case 'Manager': return 'bg-blue-100 text-blue-800'
      case 'User': return 'bg-green-100 text-green-800'
      case 'Viewer': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('nl-NL')
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* MAIN CONTENT - 100% BREEDTE EN UITGELIJND MET NAVBAR */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* HEADER - EXACT HETZELFDE ALS ANDERE PAGINA'S */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gebruikers</h1>
              <p className="text-gray-600">Beheer alle gebruikers</p>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Nieuwe Gebruiker
            </button>
          </div>
        </div>

        {/* STATISTICS CARDS - EXACT HETZELFDE ALS ANDERE PAGINA'S */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icons.users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Totaal Gebruikers</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Icons.clock className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Actieve Gebruikers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.status === 'Actief').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Icons.courses className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Gem. Voltooiing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.length > 0 ? Math.round(users.reduce((acc, user) => acc + user.progress, 0) / users.length) : 0}%
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Icons.modules className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Voltooide Courses</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users.reduce((acc, user) => acc + user.completedCourses, 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS - EXACT HETZELFDE ALS ANDERE PAGINA'S */}
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
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>User</option>
                  <option>Viewer</option>
                </select>

                <select 
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
                >
                  <option>Alle afdelingen</option>
                  {Array.from(new Set(users.map(u => u.department))).map(department => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                {filteredUsers.length} van {users.length} gebruikers
              </div>
            </div>
          </div>

          {/* BULK ACTIONS - EXACT HETZELFDE ALS ANDERE PAGINA'S */}
          {selectedUsers.length > 0 && (
            <div className="bg-blue-50 px-4 py-3 border-b border-blue-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-blue-700">
                    {selectedUsers.length} gebruikers geselecteerd
                  </span>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Activeren
                  </button>
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Deactiveren
                  </button>
                  <button className="text-sm text-red-600 hover:text-red-800 font-medium">
                    Verwijderen
                  </button>
                </div>
                <button 
                  onClick={() => setSelectedUsers([])}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Selectie opheffen
                </button>
              </div>
            </div>
          )}

          {/* TABLE - EXACT HETZELFDE ALS ANDERE PAGINA'S */}
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
                    Afdeling
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voltooide Courses
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voortgang
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Laatst actief
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
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{user.department}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Icons.courses className="w-4 h-4 text-gray-400 mr-1" />
                        {user.completedCourses}/{user.totalCourses}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className="h-2 rounded-full bg-gray-900 transition-all duration-500"
                            style={{ width: `${user.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-900">{user.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.lastActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-600 hover:text-blue-600 transition-colors" title="Bekijken">
                          <Icons.eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-green-600 transition-colors" title="Bewerken">
                          <Icons.settings className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-orange-600 transition-colors" title="Status wijzigen">
                          <Icons.power className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-red-600 transition-colors" title="Verwijderen">
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

        {/* DRAG & DROP INFO - EXACT HETZELFDE ALS ANDERE PAGINA'S */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Sleep gebruikers om volgorde aan te passen
        </div>
      </div>
    </div>
  )
}