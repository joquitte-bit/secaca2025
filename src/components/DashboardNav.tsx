// src/components/DashboardNav.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from './Icons'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Icons.dashboard, section: 'dashboard' },
  { name: 'Modules', href: '/dashboard/modules', icon: Icons.modules, section: 'modules' },
  { name: 'Lessen', href: '/dashboard/lessons', icon: Icons.lessons, section: 'lessons' },
  { name: 'Gebruikers', href: '/dashboard/users', icon: Icons.users, section: 'users' },
  { name: 'Analytics', href: '/dashboard/analytics', icon: Icons.analytics, section: 'analytics' },
  { name: 'Instellingen', href: '/dashboard/settings', icon: Icons.settings, section: 'settings' },
]

interface DashboardNavProps {
  onSectionChange?: (section: string | null) => void
  activeSection?: string | null
  isSidebarOpen?: boolean
  onToggleSidebar?: () => void
}

export function DashboardNav({ 
  onSectionChange, 
  activeSection, 
  isSidebarOpen,
  onToggleSidebar 
}: DashboardNavProps = {}) {
  const pathname = usePathname()

  const handleNavClick = (section: string | null, href: string) => {
    onSectionChange?.(section)
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Icons.security className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-lg font-semibold text-gray-900">SECACA</span>
                  <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Admin</span>
                </div>
              </Link>
            </div>
            <div className="hidden md:block ml-8">
              <div className="flex items-baseline space-x-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => handleNavClick(item.section, item.href)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span className="ml-2">{item.name}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600 bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Pro Plan
            </span>
            <form action="/auth/signout" method="POST">
              <button 
                type="submit"
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Icons.logout className="w-4 h-4" />
                <span>Uitloggen</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toggle button - fixed position links op dezelfde hoogte als sidebar header */}
      {!isSidebarOpen && (
        <button
          onClick={onToggleSidebar}
          className="fixed left-0 top-[76px] z-40 p-3 bg-white border-r border-t border-b border-gray-200 rounded-r-lg shadow-sm hover:bg-gray-50 transition-colors"
          title="Sidebar tonen"
          style={{ marginTop: '0px' }} /* Exact dezelfde hoogte als sidebar header */
        >
          {/* Driehoek naar rechts wanneer sidebar gesloten is */}
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  )
}