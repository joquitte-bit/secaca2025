// src/app/dashboard/layout.tsx
'use client'

import { useState } from 'react'
import { DashboardNav } from '@/components/DashboardNav'
import { DashboardSidebar } from '@/components/DashboardSidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeSection, setActiveSection] = useState<string | null>('dashboard')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleSectionChange = (section: string | null) => {
    setActiveSection(section)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DashboardNav 
        onSectionChange={handleSectionChange}
        activeSection={activeSection}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={toggleSidebar}
      />
      <div className="flex flex-1 relative">
        <DashboardSidebar 
          activeSection={activeSection as any} 
          isOpen={isSidebarOpen}
          onToggleSidebar={toggleSidebar}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-56' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}