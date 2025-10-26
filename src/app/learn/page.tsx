import { BookOpen, Clock, Award } from 'lucide-react'

export default function LearnPage() {
  const recentCourses = [
    { id: 1, title: 'Security Awareness Fundamentals', progress: 75, lastAccessed: '2 uur geleden' },
    { id: 2, title: 'Phishing Herkenning', progress: 30, lastAccessed: '1 dag geleden' },
    { id: 3, title: 'Data Privacy Basics', progress: 10, lastAccessed: '3 dagen geleden' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Welkom terug, Learner! 👋
        </h1>
        <p className="text-gray-600">
          Ga verder met je learning journey of ontdek nieuwe courses.
        </p>
      </div>

      {/* Continue Learning */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Doorgaan met leren</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recentCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <BookOpen className="h-6 w-6 text-blue-600 mt-1" />
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {course.progress}% voltooid
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{course.lastAccessed}</span>
                </div>
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Verder leren →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-sm text-gray-600">Courses voltooid</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">12h</p>
              <p className="text-sm text-gray-600">Leer tijd</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <Award className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-600">Badges verdiend</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}