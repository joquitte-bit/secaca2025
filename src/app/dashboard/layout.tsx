// src/app/dashboard/layout.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardNav } from '@/components/DashboardNav'
import { DashboardSidebar } from '@/components/DashboardSidebar'

type Section = 'dashboard' | 'modules' | 'lessons' | 'users' | 'analytics' | 'settings'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const pathname = usePathname()

  // Bepaal actieve sectie gebaseerd op huidige route
  useEffect(() => {
    if (pathname.startsWith('/dashboard/modules')) {
      setActiveSection('modules')
    } else if (pathname.startsWith('/dashboard/lessons')) {
      setActiveSection('lessons')
    } else if (pathname.startsWith('/dashboard/users')) {
      setActiveSection('users')
    } else if (pathname.startsWith('/dashboard/analytics')) {
      setActiveSection('analytics')
    } else if (pathname.startsWith('/dashboard/settings')) {
      setActiveSection('settings')
    } else {
      setActiveSection('dashboard')
    }
  }, [pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      {/* Verwijder pt-16 zodat sidebar direct onder navbar start */}
      <div className="flex">
        <DashboardSidebar activeSection={activeSection} />
        {/* Main content - 100% breedte en perfecte alignment */}
        <main className="flex-1 min-w-0">
          {/* Gebruik dezelfde padding als de navbar voor perfecte alignment */}
          <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}