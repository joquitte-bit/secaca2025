// src/components/DashboardSidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from './Icons'

const sidebarSections = {
  dashboard: {
    title: 'Dashboard',
    icon: Icons.dashboard,
    items: [
      { name: 'Overzicht', href: '/dashboard', icon: Icons.dashboard },
      { name: 'Snelle Statistieken', href: '/dashboard/quick-stats', icon: Icons.chart },
      { name: 'Recente Activiteit', href: '/dashboard/activity', icon: Icons.check },
      { name: 'Voortgang', href: '/dashboard/progress', icon: Icons.analytics },
    ]
  },
  modules: {
    title: 'Modules',
    icon: Icons.modules,
    items: [
      { name: 'Alle Modules', href: '/dashboard/modules', icon: Icons.modules },
      { name: 'Nieuwe Module', href: '/dashboard/modules/new', icon: Icons.add },
      { name: 'Categorieën', href: '/dashboard/modules/categories', icon: Icons.document },
      { name: 'Volgorde', href: '/dashboard/modules/order', icon: Icons.settings },
    ]
  },
  lessons: {
    title: 'Lessen',
    icon: Icons.lessons,
    items: [
      { name: 'Alle Lessen', href: '/dashboard/lessons', icon: Icons.lessons },
      { name: 'Nieuwe Les', href: '/dashboard/lessons/new', icon: Icons.add },
      { name: 'Media Bibliotheek', href: '/dashboard/lessons/media', icon: Icons.document },
      { name: 'Quizzen', href: '/dashboard/lessons/quizzes', icon: Icons.check },
    ]
  },
  users: {
    title: 'Gebruikers',
    icon: Icons.users,
    items: [
      { name: 'Alle Gebruikers', href: '/dashboard/users', icon: Icons.users },
      { name: 'Gebruiker Toevoegen', href: '/dashboard/users/new', icon: Icons.add },
      { name: 'Groepen', href: '/dashboard/users/groups', icon: Icons.document },
      { name: 'Toegangsrechten', href: '/dashboard/users/permissions', icon: Icons.settings },
    ]
  },
  analytics: {
    title: 'Analytics',
    icon: Icons.analytics,
    items: [
      { name: 'Overzicht', href: '/dashboard/analytics', icon: Icons.analytics },
      { name: 'Rapporten', href: '/dashboard/analytics/reports', icon: Icons.document },
      { name: 'Export', href: '/dashboard/analytics/export', icon: Icons.chart },
    ]
  },
  settings: {
    title: 'Instellingen',
    icon: Icons.settings,
    items: [
      { name: 'Algemeen', href: '/dashboard/settings', icon: Icons.settings },
      { name: 'Facturatie', href: '/dashboard/settings/billing', icon: Icons.document },
      { name: 'Integraties', href: '/dashboard/settings/integrations', icon: Icons.check },
    ]
  }
}

interface DashboardSidebarProps {
  activeSection?: keyof typeof sidebarSections | null
}

export function DashboardSidebar({ 
  activeSection
}: DashboardSidebarProps = {}) {
  const pathname = usePathname()

  const section = activeSection ? sidebarSections[activeSection] : sidebarSections.dashboard

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-56 bg-white border-r border-gray-200 lg:static lg:h-[calc(100vh-4rem)] flex flex-col">
      {/* Header zonder toggle button */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-2 text-gray-900">
          <section.icon className="w-5 h-5" />
          <h3 className="font-semibold">{section.title}</h3>
        </div>
      </div>
      
      {/* Navigation - Neemt alle beschikbare ruimte in */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-1">
          {section.items.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600 transform translate-x-1'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 hover:transform hover:translate-x-1'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Quick Actions Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors">
            <Icons.settings className="w-4 h-4" />
            <span>Snelle Instellingen</span>
          </button>
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors">
            <Icons.help className="w-4 h-4" />
            <span>Help & Support</span>
          </button>
        </div>
      </div>
    </div>
  )
}