'use client'

import { Icons } from './Icons'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export function LearnNav() {
  const router = useRouter()

  return (
    <nav className="bg-white fixed top-0 right-0 left-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8 ml-56 mr-auto">
        <div className="flex justify-between items-center h-16 border-b border-gray-200"> {/* border HIER toevoegen */}
          {/* EXACT HETZELFDE LOGO ALS DASHBOARD - MET ML-56 VOOR ALIGNMENT */}
          <div className="flex items-center space-x-8 ml-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900">Secaca</span>
            </div>
          </div>

          {/* RECHTS UITGELIJND */}
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