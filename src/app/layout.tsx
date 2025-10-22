// src/app/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { AuthProvider } from '@/components/AuthProvider'
import './globals.css'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="nl">
      <body className={session ? 'authenticated' : 'unauthenticated'}>
        <AuthProvider session={session} user={user}>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}