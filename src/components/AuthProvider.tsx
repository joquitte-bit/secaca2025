// src/components/AuthProvider.tsx
'use client'

import { createContext, useContext, ReactNode } from 'react'

interface AuthContextType {
  session: any
  user: any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ 
  session, 
  user, 
  children 
}: { 
  session: any
  user: any
  children: ReactNode 
}) {
  return (
    <AuthContext.Provider value={{ session, user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}