'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/Icons'; // Voeg deze import toe

type ActivityType = 'course' | 'module' | 'lesson' | 'user';

interface ActivityItem {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: ActivityType;
}

interface DashboardStats {
  totalCourses: number;
  totalUsers: number;
  totalModules: number;
  totalLessons: number;
  recentActivity: ActivityItem[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalUsers: 0,
    totalModules: 0,
    totalLessons: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [coursesRes, usersRes, modulesRes, lessonsRes] = await Promise.all([
        fetch('/api/courses').catch(() => ({ json: () => [] })),
        fetch('/api/users').catch(() => ({ json: () => [] })),
        fetch('/api/modules').catch(() => ({ json: () => [] })),
        fetch('/api/lessons').catch(() => ({ json: () => [] }))
      ]);

      const courses = coursesRes ? await coursesRes.json() : [];
      const users = usersRes ? await usersRes.json() : [];
      const modules = modulesRes ? await modulesRes.json() : [];
      const lessons = lessonsRes ? await lessonsRes.json() : [];

      setStats({
        totalCourses: Array.isArray(courses) ? courses.length : 0,
        totalUsers: Array.isArray(users) ? users.length : 0,
        totalModules: Array.isArray(modules) ? modules.length : 0,
        totalLessons: Array.isArray(lessons) ? lessons.length : 0,
        recentActivity: generateRecentActivity()
      });
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
      setStats({
        totalCourses: 0,
        totalUsers: 0,
        totalModules: 0,
        totalLessons: 0,
        recentActivity: generateRecentActivity()
      });
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivity = (): ActivityItem[] => {
    return [
      {
        id: '1',
        action: 'Nieuwe cursus aangemaakt',
        user: 'Admin',
        timestamp: new Date().toISOString(),
        type: 'course'
      },
      {
        id: '2', 
        action: 'Module bijgewerkt',
        user: 'Trainer',
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        type: 'module'
      },
      {
        id: '3',
        action: 'Les gepubliceerd',
        user: 'Content Creator',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        type: 'lesson'
      },
      {
        id: '4',
        action: 'Nieuwe gebruiker geregistreerd',
        user: 'System',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
        type: 'user'
      }
    ];
  };

const getActivityIcon = (type: ActivityType) => {
  switch (type) {
    case 'course': return <Icons.courses className="w-5 h-5" />;
    case 'module': return <Icons.modules className="w-5 h-5" />;
    case 'lesson': return <Icons.lessons className="w-5 h-5" />;
    case 'user': return <Icons.users className="w-5 h-5" />;
    default: return <Icons.document className="w-5 h-5" />;
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="w-full">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Overzicht van je SECACA training platform
          </p>
        </div>

        {/* Statistics Cards - Minimalistische versie */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Courses Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totaal Cursussen</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.courses className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/dashboard/courses"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Bekijk alle cursussen →
              </Link>
            </div>
          </div>

          {/* Users Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totaal Gebruikers</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalUsers}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.users className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/dashboard/users"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Beheer gebruikers →
              </Link>
            </div>
          </div>

          {/* Modules Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totaal Modules</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalModules}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.modules className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/dashboard/modules"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Bekijk modules →
              </Link>
            </div>
          </div>

          {/* Lessons Card */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Totaal Lessen</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.totalLessons}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <Icons.lessons className="w-6 h-6 text-gray-700" />
              </div>
            </div>
            <div className="mt-4">
              <Link 
                href="/dashboard/lessons"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Bekijk lessen →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Snelle Acties
            </h2>
            <div className="space-y-3">
              <Link
                href="/dashboard/courses/new"
                className="flex items-center p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <Icons.add className="w-5 h-5 mr-3" />
                <span>Nieuwe Cursus</span>
              </Link>
              <Link
                href="/dashboard/modules/new"
                className="flex items-center p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <Icons.add className="w-5 h-5 mr-3" />
                <span>Nieuwe Module</span>
              </Link>
              <Link
                href="/dashboard/lessons/new"
                className="flex items-center p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <Icons.add className="w-5 h-5 mr-3" />
                <span>Nieuwe Les</span>
              </Link>
              <Link
                href="/dashboard/users/new"
                className="flex items-center p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                <Icons.add className="w-5 h-5 mr-3" />
                <span>Nieuwe Gebruiker</span>
              </Link>
            </div>
          </div>
        </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recente Activiteit
              </h2>
              <div className="space-y-4">
                {stats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="p-2 bg-gray-100 rounded-full text-gray-700">
                        {getActivityIcon(activity.type)}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{activity.action}</p>
                        <p className="text-sm text-gray-500">Door {activity.user}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(activity.timestamp).toLocaleTimeString('nl-NL', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(activity.timestamp).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Section */}
        <div className="mt-8 bg-white rounded-lg shadow border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Platform Voortgang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Database Integratie</span>
                <span className="text-sm font-medium text-gray-600">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Editor Functionaliteit</span>
                <span className="text-sm font-medium text-gray-600">70%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">User Interface</span>
                <span className="text-sm font-medium text-gray-600">95%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '95%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">API Endpoints</span>
                <span className="text-sm font-medium text-gray-600">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}