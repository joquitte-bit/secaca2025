// src/components/Sidebar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '@/components/Icons'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Icons.dashboard },
  { name: 'Modules', href: '/dashboard/modules', icon: Icons.modules },
  { name: 'Gebruikers', href: '/dashboard/users', icon: Icons.users },
  { name: 'Analytics', href: '/dashboard/analytics', icon: Icons.analytics },
  { name: 'Instellingen', href: '/dashboard/settings', icon: Icons.settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 pt-16">
      <nav className="mt-8">
        <ul className="space-y-1 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}