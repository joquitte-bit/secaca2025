// src/app/dashboard/lessons/page.tsx
import { getUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Icons } from '@/components/Icons'

export default async function LessonsPage() {
  const user = await getUser()
  
  if (!user) {
    redirect('/login')
  }

  const lessons = [
    { 
      id: 1, 
      title: 'Wat is Phishing?', 
      module: 'Phishing Awareness', 
      duration: '15 min', 
      status: 'Actief',
      lastUpdated: '2024-01-15'
    },
    { 
      id: 2, 
      title: 'Herkennen van Phishing Mails', 
      module: 'Phishing Awareness', 
      duration: '20 min', 
      status: 'Actief',
      lastUpdated: '2024-01-14'
    },
    { 
      id: 3, 
      title: 'Social Engineering Technieken', 
      module: 'Social Engineering', 
      duration: '25 min', 
      status: 'Concept',
      lastUpdated: '2024-01-12'
    },
    { 
      id: 4, 
      title: 'Veilige Wachtwoorden', 
      module: 'Password Security', 
      duration: '18 min', 
      status: 'Actief',
      lastUpdated: '2024-01-10'
    },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Lessen</h1>
        <p className="text-gray-600 mt-1">Beheer alle training lessen en content</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Alle Lessen</h2>
            <div className="text-sm text-gray-600">{lessons.length} lessen</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icons.document />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <h3 className="font-medium text-gray-900">{lesson.title}</h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        lesson.status === 'Actief' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lesson.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                      <span>{lesson.module}</span>
                      <span>•</span>
                      <span>{lesson.duration}</span>
                      <span>•</span>
                      <span>Laatst bijgewerkt: {lesson.lastUpdated}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </button>
                  <Link 
                    href={`/dashboard/lessons/${lesson.id}/edit`}
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
          ))}
        </div>
      </div>
    </div>
  )
}