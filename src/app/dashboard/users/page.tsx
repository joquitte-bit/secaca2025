// src/app/dashboard/users/page.tsx
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Icons } from '@/components/Icons'

export default async function UsersPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const users = [
    { 
      id: 1, 
      name: 'John Doe', 
      email: 'john@bedrijf.nl', 
      role: 'Gebruiker', 
      status: 'Actief', 
      lastLogin: '2024-01-15',
      joinDate: '2023-12-01'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      email: 'jane@bedrijf.nl', 
      role: 'Beheerder', 
      status: 'Actief', 
      lastLogin: '2024-01-14',
      joinDate: '2023-11-15'
    },
    { 
      id: 3, 
      name: 'Bob Johnson', 
      email: 'bob@bedrijf.nl', 
      role: 'Gebruiker', 
      status: 'Inactief', 
      lastLogin: '2024-01-10',
      joinDate: '2023-12-20'
    },
    { 
      id: 4, 
      name: 'Alice Brown', 
      email: 'alice@bedrijf.nl', 
      role: 'Gebruiker', 
      status: 'Actief', 
      lastLogin: '2024-01-15',
      joinDate: '2024-01-05'
    },
  ]

  return (
   <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Gebruikers</h1>
        <p className="text-gray-600 mt-1">Beheer alle gebruikers en hun rechten</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Gebruikers Lijst</h2>
            <div className="text-sm text-gray-600">{users.length} gebruikers</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {users.map((user) => (
            <div key={user.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icons.user />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{user.name}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Beheerder' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Actief' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <span>Lid sinds: {user.joinDate}</span>
                      <span>•</span>
                      <span>Laatste login: {user.lastLogin}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                    <Icons.settings />
                  </button>
                  <button className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}