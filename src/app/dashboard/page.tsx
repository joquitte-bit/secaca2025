// src/app/dashboard/page.tsx
import { getUser, signOut } from '@/lib/auth'
import { prisma } from '@/lib/db'

export default async function Dashboard() {
  const user = await getUser()
  
  // Sync user with our database
  const dbUser = await prisma.user.upsert({
    where: { email: user.email! },
    update: {},
    create: {
      email: user.email!,
      tenantId: 'default-tenant', // Later dynamisch maken
    },
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              SECACA Dashboard
            </h1>
            <p className="text-gray-600">Security Awareness Academy</p>
          </div>
          <form action={signOut}>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
              Uitloggen
            </button>
          </form>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Welkom, {user.email}</h2>
          <div className="space-y-2">
            <p className="text-gray-600">Je bent succesvol ingelogd in het SECACA platform.</p>
            <p className="text-gray-600">User ID: {dbUser.id}</p>
          </div>
        </div>
      </div>
    </div>
  )
}