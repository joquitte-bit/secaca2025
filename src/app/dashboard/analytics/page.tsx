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

      {/* Quick Stats - NU IN HETZELFDE FORMAT ALS ANDERE PAGINA'S */}
      <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
        {/* Totaal Gebruikers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totaal Gebruikers</p>
              <p className="text-2xl font-semibold text-gray-900">156</p>
            </div>
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
        </div>

        {/* Gemiddelde Voltooiing */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gemiddelde Voltooiing</p>
              <p className="text-2xl font-semibold text-gray-900">78%</p>
            </div>
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Totaal Voltooiingen */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Totaal Voltooiingen</p>
              <p className="text-2xl font-semibold text-gray-900">245</p>
            </div>
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        </div>

        {/* Actieve Modules */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Actieve Modules</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
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
      </div>
    </div>
  )
}