// src/lib/auth.ts
import { supabase } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return user
}

export async function signOut() {
  'use server'
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    console.error('Sign out error:', error)
  }
  
  redirect('/login')
}