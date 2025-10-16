// src/app/dashboard/modules/page.tsx
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Icons } from '@/components/Icons'

export default async function ModulesPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const modules = [
    { 
      id: 1, 
      title: 'Phishing Awareness', 
      status: 'Actief', 
      students: 45, 
      progress: 85, 
      lessons: 5,
      description: 'Leer phishing aanvallen herkennen en voorkomen'
    },
    { 
      id: 2, 
      title: 'Social Engineering', 
      status: 'Actief', 
      students: 38, 
      progress: 72, 
      lessons: 4,
      description: 'Bescherm jezelf tegen sociale manipulatie'
    },
    { 
      id: 3, 
      title: 'Password Security', 
      status: 'Inactief', 
      students: 0, 
      progress: 0, 
      lessons: 3,
      description: 'Creëer en beheer sterke wachtwoorden'
    },
    { 
      id: 4, 
      title: 'Data Protection', 
      status: 'Actief', 
      students: 52, 
      progress: 90, 
      lessons: 6,
      description: 'Beveilig gevoelige bedrijfsdata'
    },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Modules</h1>
        <p className="text-gray-600 mt-1">Beheer alle training modules en cursussen</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Alle Modules</h2>
            <div className="text-sm text-gray-600">{modules.length} modules</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {modules.map((module) => (
            <div key={module.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icons.modules />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{module.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        module.status === 'Actief' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {module.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Icons.users />
                        <span>{module.students} studenten</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Icons.document />
                        <span>{module.lessons} lessen</span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">{module.progress}%</div>
                    <div className="text-sm text-gray-500">voltooid</div>
                  </div>
                  <div className="w-24">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="h-1.5 rounded-full bg-gray-900 transition-all duration-500"
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link 
                      href={`/dashboard/modules/${module.id}/edit`}
                      className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <Icons.settings />
                    </Link>
                    <button className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}