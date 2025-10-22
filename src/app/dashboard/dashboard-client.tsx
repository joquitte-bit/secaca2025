// src/app/dashboard/dashboard-client.tsx
'use client'

import Link from 'next/link'
import { Icons } from '@/components/Icons'

interface DashboardClientPageProps {
  user: any
}

export default function DashboardClientPage({ user }: DashboardClientPageProps) {
  const quickActions = [
    {
      title: 'Snelle Statistieken',
      description: 'Real-time platform overzicht',
      href: '/dashboard/quick-stats',
      icon: Icons.chart
    },
    {
      title: 'Recente Activiteit',
      description: 'Bekijk alle activiteiten',
      href: '/dashboard/activity',
      icon: Icons.check
    },
    {
      title: 'Voortgang',
      description: 'Module en gebruiker voortgang',
      href: '/dashboard/progress',
      icon: Icons.analytics
    },
    {
      title: 'Modules Beheren',
      description: 'Naar modules overzicht',
      href: '/dashboard/modules',
      icon: Icons.modules
    },
  ]

  return (
    <div className="min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overzicht</h1>
        <p className="text-gray-600 mt-1">Welkom terug, {user?.email || 'gebruiker'}</p>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Snelle Navigatie</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:border-blue-300 hover:bg-blue-50 transition-colors group"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <action.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-600">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Welkomst Bericht */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Welkom bij SECACA Admin</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <p>Je dashboard is het centrale punt voor het beheren van je security awareness trainingen.</p>
            <p>Gebruik de sidebar navigatie om snel toegang te krijgen tot alle functies:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Bekijk real-time statistieken</li>
              <li>Monitor gebruikersactiviteit</li>
              <li>Beheer modules en lessen</li>
              <li>Analyseer voortgang en resultaten</li>
            </ul>
          </div>
        </div>

        {/* Snelle Tips */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Snelle Tips</h3>
          <div className="space-y-3">
            {[
              { tip: 'Voeg nieuwe modules toe via de modules sectie', icon: Icons.add },
              { tip: 'Monitor voortgang in de analytics sectie', icon: Icons.chart },
              { tip: 'Beheer gebruikersrechten in de gebruikers sectie', icon: Icons.users },
              { tip: 'Pas platform instellingen aan naar wens', icon: Icons.settings },
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="p-1 bg-gray-100 rounded-lg mt-0.5">
                  <item.icon className="w-4 h-4" />
                </div>
                <p className="text-sm text-gray-600 flex-1">{item.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}