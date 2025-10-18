export default function LearnCoursesPage() {
  const availableCourses = [
    {
      id: 1,
      title: "Cybersecurity Basis",
      description: "Leer de fundamenten van cybersecurity awareness",
      progress: 0,
      moduleCount: 4,
      duration: "2 uur",
      category: "Basis"
    },
    {
      id: 2, 
      title: "Phishing Herkenning",
      description: "Leer phishing attempts herkennen en voorkomen",
      progress: 0,
      moduleCount: 3,
      duration: "1.5 uur",
      category: "Geavanceerd"
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mijn Courses</h1>
        <p className="text-gray-600">Kies een course om te starten met leren</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {availableCourses.map((course) => (
          <div key={course.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {course.category}
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-4">{course.description}</p>
            
            <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
              <span>{course.moduleCount} modules</span>
              <span>{course.duration}</span>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
              {course.progress > 0 ? 'Verder leren' : 'Start course'}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}