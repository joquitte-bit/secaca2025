// src/app/dashboard/layout.tsx
import { DashboardNav } from '@/components/DashboardNav'
import { DashboardSidebar } from '@/components/DashboardSidebar'
import { AuthProvider } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <AuthProvider session={session} user={user}>
      <div className="min-h-screen bg-gray-50">
        <DashboardNav 
          activeSection="dashboard" 
          onSectionChange={() => {}} 
          user={user}
        />
        <div className="flex pt-16">
          <DashboardSidebar activeSection="dashboard" />
          <main className="flex-1 lg:ml-56">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AuthProvider>
  )
}