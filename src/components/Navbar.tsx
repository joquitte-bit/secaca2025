// src/components/Navbar.tsx
'use client'

import { useAuth } from '@/components/AuthProvider'

export default function Navbar() {
  const { session, user } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold">SECACA Admin</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-700">
                  {user?.email || session.user.email}
                </span>
                <form action="/auth/signout" method="POST">
                  <button 
                    type="submit"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Uitloggen
                  </button>
                </form>
              </>
            ) : (
              <a href="/login" className="text-gray-500 hover:text-gray-700">
                Inloggen
              </a>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}