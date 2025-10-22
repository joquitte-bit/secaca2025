export default async function CourseDetailPage({ 
  params 
}: { 
  params: Promise<{ courseId: string }> 
}) {
  // AWAIT de params
  const { courseId } = await params
  
  // TODO: Haal echte course data op
  const course = {
    id: parseInt(courseId),
    title: "Cybersecurity Basis",
    description: "Leer de fundamenten van cybersecurity awareness",
    progress: 0,
    modules: [
      { id: 1, title: "Inleiding Cybersecurity", duration: "30 min", completed: false },
      { id: 2, title: "Wachtwoord Beveiliging", duration: "45 min", completed: false },
      { id: 3, title: "Phishing Herkenning", duration: "25 min", completed: false },
      { id: 4, title: "Social Engineering", duration: "20 min", completed: false }
    ]
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
        <p className="text-gray-600 mt-2">{course.description}</p>
        
        <div className="mt-4 w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${course.progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">{course.progress}% voltooid</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
        {course.modules.map((module, index) => (
          <div key={module.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  module.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.duration}</p>
                </div>
              </div>
              
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                {module.completed ? 'Herhaal' : 'Start'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}