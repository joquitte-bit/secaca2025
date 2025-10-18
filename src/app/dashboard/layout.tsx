// src/app/dashboard/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DashboardLayoutClient from './DashboardLayoutClient'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { session }, error } = await supabase.auth.getSession()

  if (!session || error) {
    redirect('/login')
  }

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}