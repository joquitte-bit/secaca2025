// src/app/layout.tsx
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import { AuthProvider } from '@/components/AuthProvider'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="nl">
      <body className={session ? 'authenticated' : 'unauthenticated'}>
        <AuthProvider session={session} user={user}>
          {session ? (
            // Authenticated layout met sidebar
            <div className="flex h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col ml-64">
                <Navbar />
                <main className="flex-1 overflow-auto pt-16">
                  {children}
                </main>
              </div>
            </div>
          ) : (
            // Unauthenticated layout zonder sidebar
            <div>
              <Navbar />
              <main>
                {children}
              </main>
            </div>
          )}
        </AuthProvider>
      </body>
    </html>
  )
}