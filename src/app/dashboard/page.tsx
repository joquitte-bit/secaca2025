// src/app/dashboard/page.tsx
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Haal user data op met role
  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
    include: { 
      organization: true,
      enrollments: {
        include: {
          course: true
        }
      }
    }
  })

  if (!dbUser) {
    redirect('/login')
  }

  // Render verschillende dashboards gebaseerd op role (gebruik strings i.p.v. enum)
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Welkom, {dbUser.name || dbUser.email}
        </h1>
        <div className="text-sm text-gray-500">
          <span className="font-medium">{dbUser.organization.name}</span>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            {dbUser.role}
          </span>
        </div>
      </div>

      {/* Toon verschillende content gebaseerd op role - gebruik string comparison */}
      {dbUser.role === 'ADMIN' && <AdminDashboard user={dbUser} />}
      {dbUser.role === 'MANAGER' && <ManagerDashboard user={dbUser} />}
      {dbUser.role === 'LEARNER' && <LearnerDashboard user={dbUser} />}
      {dbUser.role === 'OWNER' && <OwnerDashboard user={dbUser} />}
    </div>
  )
}

// ADMIN DASHBOARD - Volledig overzicht
async function AdminDashboard({ user }: { user: any }) {
  const stats = await prisma.$transaction([
    prisma.course.count({ where: { orgId: user.orgId } }),
    prisma.user.count({ where: { orgId: user.orgId } }),
    prisma.module.count({ where: { course: { orgId: user.orgId } } }),
    prisma.lesson.count({ where: { module: { course: { orgId: user.orgId } } } }),
    prisma.enrollment.count({ where: { course: { orgId: user.orgId } } }),
  ])

  const [courseCount, userCount, moduleCount, lessonCount, enrollmentCount] = stats

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Admin Dashboard</h2>
        <p className="text-sm text-gray-500">Volledig overzicht van je organisatie</p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Cursussen" value={courseCount} />
        <StatCard title="Gebruikers" value={userCount} />
        <StatCard title="Modules" value={moduleCount} />
        <StatCard title="Lessen" value={lessonCount} />
        <StatCard title="Inschrijvingen" value={enrollmentCount} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentCourses orgId={user.orgId} />
        <RecentUsers orgId={user.orgId} />
      </div>
    </>
  )
}

// MANAGER DASHBOARD - Team overzicht
async function ManagerDashboard({ user }: { user: any }) {
  const teamStats = await prisma.$transaction([
    prisma.user.count({ where: { orgId: user.orgId, role: 'LEARNER' } }),
    prisma.enrollment.count({ where: { course: { orgId: user.orgId } } }),
    prisma.course.count({ where: { orgId: user.orgId, status: 'PUBLISHED' } }),
  ])

  const [learnerCount, enrollmentCount, publishedCourseCount] = teamStats

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Manager Dashboard</h2>
        <p className="text-sm text-gray-500">Overzicht van je team en hun voortgang</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard title="Teamleden" value={learnerCount} />
        <StatCard title="Actieve inschrijvingen" value={enrollmentCount} />
        <StatCard title="Beschikbare cursussen" value={publishedCourseCount} />
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Voortgang</h3>
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">📊</div>
            <p className="text-gray-500">Team progress charts worden binnenkort toegevoegd</p>
            <p className="text-sm text-gray-400 mt-2">Hier komen grafieken van team voortgang</p>
          </div>
        </div>
      </div>
    </>
  )
}

// LEARNER DASHBOARD - Mijn leerpad
async function LearnerDashboard({ user }: { user: any }) {
  const myCourses = await prisma.enrollment.findMany({
    where: { userId: user.id },
    include: {
      course: {
        include: {
          modules: {
            include: {
              lessons: true
            }
          }
        }
      }
    },
    orderBy: { startedAt: 'desc' }
  })

  const averageProgress = myCourses.length > 0 
    ? Math.round(myCourses.reduce((acc, curr) => acc + curr.progress, 0) / myCourses.length)
    : 0

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Mijn Leerpad</h2>
        <p className="text-sm text-gray-500">Jouw persoonlijke voortgang en cursussen</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard title="Mijn Cursussen" value={myCourses.length} />
        <StatCard title="Gemiddelde Voortgang" value={`${averageProgress}%`} />
        <StatCard title="Voltooide Cursussen" value={myCourses.filter(c => c.progress === 100).length} />
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mijn Cursussen</h3>
          <div className="space-y-4">
            {myCourses.map((enrollment) => (
              <div key={enrollment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{enrollment.course.title}</h4>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {enrollment.progress}% voltooid • {enrollment.course.modules.length} modules
                  </p>
                </div>
                <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  {enrollment.progress === 100 ? 'Bekijk Certificaat' : 'Verder Leren'}
                </button>
              </div>
            ))}
            {myCourses.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <p className="text-gray-500">Je bent nog niet ingeschreven voor cursussen</p>
                <p className="text-sm text-gray-400 mt-2">Neem contact op met je manager om toegang te krijgen</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// OWNER DASHBOARD - Facturatie & organisatie
async function OwnerDashboard({ user }: { user: any }) {
  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900">Eigenaar Dashboard</h2>
        <p className="text-sm text-gray-500">Facturatie en organisatie beheer</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard title="Organisatie" value={user.organization.name} />
        <StatCard title="Subscription" value="Actief" />
        <StatCard title="Seats" value="10" />
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Facturatie Overzicht</h3>
          <div className="text-center py-8">
            <div className="text-gray-400 text-6xl mb-4">💳</div>
            <p className="text-gray-500">Facturatie dashboard wordt binnenkort toegevoegd</p>
            <p className="text-sm text-gray-400 mt-2">Hier komen subscription details en facturen</p>
          </div>
        </div>
      </div>
    </>
  )
}

// Hulp componenten
function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">{value}</dd>
      </div>
    </div>
  )
}

async function RecentCourses({ orgId }: { orgId: string }) {
  const courses = await prisma.course.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
    take: 5,
    include: { modules: true, enrollments: true }
  })

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recente Cursussen</h3>
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="flex items-center justify-between py-2">
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">{course.title}</h4>
                <p className="text-sm text-gray-500">
                  {course.modules.length} modules • {course.enrollments.length} inschrijvingen
                </p>
              </div>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                course.status === 'PUBLISHED' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {course.status === 'PUBLISHED' ? 'Live' : 'Concept'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

async function RecentUsers({ orgId }: { orgId: string }) {
  const users = await prisma.user.findMany({
    where: { orgId },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recente Gebruikers</h3>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between py-2">
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-gray-900 truncate">{user.name || user.email}</h4>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
              <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
                user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {user.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}