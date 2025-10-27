// src/app/learn/courses/page.tsx
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    include: {
      organization: true,
      courseModules: {
        include: {
          module: {
            include: {
              lessonModules: {
                include: {
                  lesson: true
                }
              }
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Beschikbare Cursussen</h1>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Geen cursussen gevonden</p>
            <p className="text-gray-400 text-sm">
              Run eerst de database seed: <code>npx prisma db seed</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/learn/courses/${course.id}/modules/${course.courseModules[0]?.module.id}/lessons/${course.courseModules[0]?.module.lessonModules[0]?.lesson.id}`}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow block"
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{course.courseModules.length} modules</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    course.status === 'PUBLISHED' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {course.status}
                  </span>
                </div>
                <div className="mt-4">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {course.organization.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}