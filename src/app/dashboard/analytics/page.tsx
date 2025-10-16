// src/app/dashboard/analytics/page.tsx
'use client'

import { Icons } from '@/components/Icons'

export default function AnalyticsPage() {
  const analyticsData = {
    completionRates: [
      { module: 'Phishing Awareness', completion: 85 },
      { module: 'Social Engineering', completion: 72 },
      { module: 'Password Security', completion: 90 },
      { module: 'Data Protection', completion: 68 },
    ],
    userActivity: [
      { date: '2024-01-15', activeUsers: 45, completions: 12 },
      { date: '2024-01-14', activeUsers: 38, completions: 8 },
      { date: '2024-01-13', activeUsers: 52, completions: 15 },
      { date: '2024-01-12', activeUsers: 41, completions: 10 },
    ]
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">Inzicht in gebruikersgedrag en prestaties</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Completion Rates */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Icons.chart className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Module Voltooiingspercentages</h3>
          </div>
          <div className="space-y-4">
            {analyticsData.completionRates.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>{item.module}</span>
                  <span>{item.completion}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="h-1.5 rounded-full bg-gray-900 transition-all duration-300"
                    style={{ width: `${item.completion}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Icons.users className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Recente Activiteit</h3>
          </div>
          <div className="space-y-4">
            {analyticsData.userActivity.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
                <div>
                  <div className="text-sm font-medium text-gray-900">{item.date}</div>
                  <div className="text-sm text-gray-500">
                    {item.activeUsers} actieve gebruikers
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {item.completions} voltooiingen
                  </div>
                  <div className="text-sm text-gray-500">
                    {Math.round((item.completions / item.activeUsers) * 100)}% rate
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Icons.analytics className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Overzicht Statistieken</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="text-2xl font-semibold text-gray-900">156</div>
              <div className="text-sm text-gray-600">Totaal Gebruikers</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="text-2xl font-semibold text-gray-900">78%</div>
              <div className="text-sm text-gray-600">Gemiddelde Voltooiing</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="text-2xl font-semibold text-gray-900">245</div>
              <div className="text-sm text-gray-600">Totaal Voltooiingen</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="text-2xl font-semibold text-gray-900">12</div>
              <div className="text-sm text-gray-600">Actieve Modules</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}