// src/app/auth/signout/route.ts
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  
  try {
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Signout error:', error)
      // Even if there's an error, we still want to redirect to login
    }
    
    // Create redirect response
    const loginUrl = new URL('/login', request.url)
    const response = NextResponse.redirect(loginUrl)
    
    // Clear any auth cookies to be sure
    response.cookies.set('sb-access-token', '', {
      maxAge: -1,
      path: '/',
    })
    response.cookies.set('sb-refresh-token', '', {
      maxAge: -1,
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('Signout error:', error)
    // Fallback redirect in case of error
    return NextResponse.redirect(new URL('/login', request.url))
  }
}