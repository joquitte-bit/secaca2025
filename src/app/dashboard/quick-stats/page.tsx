// src/app/dashboard/quick-stats/page.tsx
import { Icons } from '@/components/Icons'

export default function QuickStatsPage() {
  const stats = [
    { name: 'Vandaag Actief', value: '24', change: '+3', icon: Icons.users },
    { name: 'Nieuwe Voltooiingen', value: '8', change: '+2', icon: Icons.check },
    { name: 'Gem. Studietijd', value: '32min', change: '+5min', icon: Icons.analytics },
    { name: 'Quiz Score', value: '86%', change: '+4%', icon: Icons.chart },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Snelle Statistieken</h1>
        <p className="text-gray-600 mt-1">Real-time overzicht van platform activiteit</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <div className="flex items-baseline mt-1">
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  <p className="ml-2 text-sm text-green-600 font-medium">
                    {stat.change}
                  </p>
                </div>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 lg:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Activiteit</h3>
        <div className="space-y-3">
          {[
            { user: 'John Doe', action: 'Startte module', module: 'Phishing Awareness', time: '2 min geleden' },
            { user: 'Jane Smith', action: 'Voltooide les', module: 'Social Engineering', time: '5 min geleden' },
            { user: 'Bob Johnson', action: 'Beantwoorde quiz', module: 'Password Security', time: '8 min geleden' },
            { user: 'Alice Brown', action: 'Startte module', module: 'Data Protection', time: '12 min geleden' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Icons.user className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action} - {activity.module}</p>
                </div>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}