// src/app/dashboard/DashboardLayoutClient.tsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { DashboardNav } from '@/components/DashboardNav'
import { DashboardSidebar } from '@/components/DashboardSidebar'

type Section = 'dashboard' | 'courses' | 'modules' | 'lessons' | 'users' | 'analytics' | 'settings'

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<Section>('dashboard')

  // Bepaal active section based on pathname
  const getActiveSection = (): Section => {
    if (pathname.includes('/courses')) return 'courses'
    if (pathname.includes('/modules')) return 'modules'
    if (pathname.includes('/lessons')) return 'lessons'
    if (pathname.includes('/users')) return 'users'
    if (pathname.includes('/analytics')) return 'analytics'
    if (pathname.includes('/settings')) return 'settings'
    return 'dashboard'
  }

  const currentSection = getActiveSection()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Navbar */}
      <DashboardNav 
        activeSection={currentSection}
        onSectionChange={setActiveSection}
      />
      
      <div className="flex pt-16"> {/* pt-16 voor navbar hoogte */}
        {/* Fixed Sidebar - onder navbar */}
        <div className="fixed top-16 left-0 h-[calc(100vh-4rem)] z-40">
          <DashboardSidebar activeSection={currentSection} />
        </div>
        
        {/* Main Content Area */}
        <div className="ml-56 flex-1 flex flex-col min-h-[calc(100vh-4rem)]">
          <main className="flex-1 p-6">
            {children}
          </main>
          
          {/* Dashboard Footer - altijd onderaan */}
          <footer className="bg-white border-t border-gray-200 h-12 flex items-center justify-center shrink-0">
            <div className="text-center text-gray-500 text-sm">
              SECACA Dashboard &copy; {new Date().getFullYear()}
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}