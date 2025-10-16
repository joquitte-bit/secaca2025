// src/app/dashboard/activity/page.tsx
import { Icons } from '@/components/Icons'

export default function ActivityPage() {
  const activities = [
    { type: 'module', action: 'Module toegevoegd', title: 'Advanced Phishing', user: 'Admin', time: '2 uur geleden', icon: Icons.modules },
    { type: 'user', action: 'Nieuwe gebruiker', title: 'carol@bedrijf.nl', user: 'Systeem', time: '4 uur geleden', icon: Icons.users },
    { type: 'lesson', action: 'Les geüpdatet', title: 'Phishing Herkennen', user: 'Admin', time: '6 uur geleden', icon: Icons.document },
    { type: 'completion', action: 'Cursus voltooid', title: 'Social Engineering', user: 'John Doe', time: '1 dag geleden', icon: Icons.check },
    { type: 'quiz', action: 'Hoge quiz score', title: 'Password Security - 95%', user: 'Jane Smith', time: '1 dag geleden', icon: Icons.analytics },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Recente Activiteit</h1>
        <p className="text-gray-600 mt-1">Gedetailleerd overzicht van alle platform activiteiten</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-4 lg:px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Activiteiten Log</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {activities.map((activity, index) => (
            <div key={index} className="px-4 lg:px-6 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <activity.icon className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.title}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
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