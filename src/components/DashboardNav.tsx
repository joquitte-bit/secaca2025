// src/components/DashboardNav.tsx
'use client'

import { Icons } from './Icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Section = 'dashboard' | 'courses' | 'modules' | 'lessons' | 'users' | 'analytics' | 'settings'

const navSections = [
  { id: 'dashboard' as Section, name: 'Dashboard', href: '/dashboard', icon: Icons.dashboard },
  { id: 'courses' as Section, name: 'Courses', href: '/dashboard/courses', icon: Icons.modules },
  { id: 'modules' as Section, name: 'Modules', href: '/dashboard/modules', icon: Icons.modules },
  { id: 'lessons' as Section, name: 'Lessen', href: '/dashboard/lessons', icon: Icons.lessons },
  { id: 'users' as Section, name: 'Gebruikers', href: '/dashboard/users', icon: Icons.users },
  { id: 'analytics' as Section, name: 'Analytics', href: '/dashboard/analytics', icon: Icons.analytics },
  { id: 'settings' as Section, name: 'Instellingen', href: '/dashboard/settings', icon: Icons.settings },
] as const

interface DashboardNavProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
  user?: {
    email?: string
    name?: string
  }
}

export function DashboardNav({ 
  activeSection, 
  onSectionChange,
  user 
}: DashboardNavProps) {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    if (isLoggingOut) return
    
    try {
      setIsLoggingOut(true)
      console.log('Uitloggen...')
      
      const response = await fetch('/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 302 || response.ok) {
        console.log('Succesvol uitgelogd')
        window.location.href = '/login'
      } else {
        console.error('Uitloggen mislukt met status:', response.status)
        router.push('/login')
        router.refresh()
      }
    } catch (error) {
      console.error('Fout bij uitloggen:', error)
      router.push('/login')
      router.refresh()
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleSectionClick = (sectionId: Section, sectionHref: string) => {
    console.log('Nav clicked - section:', sectionId, 'href:', sectionHref)
    onSectionChange(sectionId)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 ml-56 mr-auto">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8 ml-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Secaca</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {navSections.map((section) => {
                const isActive = activeSection === section.id
                return (
                  <Link
                    key={section.id}
                    href={section.href}
                    onClick={() => handleSectionClick(section.id, section.href)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <section.icon className="w-4 h-4" />
                    <span>{section.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4 mr-6">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
              <Icons.check className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">Pro Plan</span>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Icons.notification className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs text-gray-600">
                {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  {user?.email || 'Admin'}
                </span>
                <button 
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={`flex items-center space-x-1 text-xs transition-colors ${
                    isLoggingOut 
                      ? 'text-gray-400 cursor-not-allowed' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icons.logout className="w-3 h-3" />
                  <span>{isLoggingOut ? 'Uitloggen...' : 'Uitloggen'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}