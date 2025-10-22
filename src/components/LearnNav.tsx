'use client'

import { Icons } from './Icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function LearnNav() {
  const router = useRouter()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 ml-56 mr-auto">
        <div className="flex justify-between items-center h-16">
          {/* Links uitgelijnd met sidebar */}
          <div className="flex items-center space-x-3 ml-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Icons.shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">SECACA Learn</span>
          </div>

          {/* Rechts uitgelijnd met dashboard navbar */}
          <div className="flex items-center space-x-4 mr-6">
            <Link 
              href="/dashboard" 
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Naar Dashboard
            </Link>
            
            <button 
              onClick={() => router.push('/auth/signout')}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}