// src/app/dashboard/progress/page.tsx
import { Icons } from '@/components/Icons'

export default function ProgressPage() {
  const progressData = [
    { module: 'Phishing Awareness', students: 45, completed: 38, progress: 85, avgScore: 82 },
    { module: 'Social Engineering', students: 38, completed: 27, progress: 72, avgScore: 78 },
    { module: 'Password Security', students: 52, completed: 47, progress: 90, avgScore: 85 },
    { module: 'Data Protection', students: 41, completed: 28, progress: 68, avgScore: 75 },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Voortgang Overzicht</h1>
        <p className="text-gray-600 mt-1">Gedetailleerde voortgang per module en gebruiker</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Module Voortgang</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {progressData.map((module, index) => (
            <div key={index} className="px-4 lg:px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-medium text-gray-900">{module.module}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                    <span>{module.students} studenten</span>
                    <span>•</span>
                    <span>{module.completed} voltooid</span>
                    <span>•</span>
                    <span>Gem. score: {module.avgScore}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">{module.progress}%</div>
                  <div className="text-sm text-gray-500">voltooid</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-green-500 transition-all duration-500"
                  style={{ width: `${module.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}