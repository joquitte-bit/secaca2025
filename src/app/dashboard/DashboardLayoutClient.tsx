// src/app/dashboard/DashboardLayoutClient.tsx
'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardNav } from '@/components/DashboardNav'
import { DashboardSidebar } from '@/components/DashboardSidebar'

type Section = 'dashboard' | 'modules' | 'lessons' | 'users' | 'analytics' | 'settings' | 'courses'

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState<Section>('dashboard')
  const pathname = usePathname()

  // Alleen de layout bepaalt de activeSection gebaseerd op pathname
  useEffect(() => {
    console.log('Pathname changed to:', pathname)
    
    if (pathname.startsWith('/dashboard/courses')) {
      setActiveSection('courses')
    } else if (pathname.startsWith('/dashboard/modules')) {
      setActiveSection('modules')
    } else if (pathname.startsWith('/dashboard/lessons')) {
      setActiveSection('lessons')
    } else if (pathname.startsWith('/dashboard/users')) {
      setActiveSection('users')
    } else if (pathname.startsWith('/dashboard/analytics')) {
      setActiveSection('analytics')
    } else if (pathname.startsWith('/dashboard/settings')) {
      setActiveSection('settings')
    } else if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
      setActiveSection('dashboard')
    }
  }, [pathname])

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav 
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <div className="flex">
        <DashboardSidebar activeSection={activeSection} />
        <main className="flex-1 min-w-0">
          <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}