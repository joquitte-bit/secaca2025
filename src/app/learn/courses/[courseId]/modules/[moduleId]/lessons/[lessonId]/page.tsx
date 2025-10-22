export default async function LessonPage({ 
  params 
}: { 
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>
}) {
  const { courseId, moduleId, lessonId } = await params
  
  const lesson = {
    id: parseInt(lessonId),
    title: "Inleiding tot Wachtwoordbeveiliging",
    type: "Video" as const,
    content: `
      <h2>Waarom sterke wachtwoorden belangrijk zijn</h2>
      <p>Wachtwoorden zijn de eerste verdedigingslinie tegen cyberaanvallen. Zwakke wachtwoorden zijn verantwoordelijk voor 80% van alle datalekken.</p>
      
      <h3>Kenmerken van een sterk wachtwoord:</h3>
      <ul>
        <li>Minimaal 12 karakters</li>
        <li>Combinatie van hoofdletters, kleine letters, cijfers en symbolen</li>
        <li>Geen persoonlijke informatie</li>
        <li>Uniek voor elke account</li>
      </ul>
    `,
    duration: 20,
    module: "Wachtwoord Beveiliging",
    instructor: "Dr. Jan Bakker"
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h1>
        <p className="text-gray-600">
          {lesson.module} · {lesson.instructor} · {lesson.duration} minuten
        </p>
        
        {/* Progress */}
        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
          <span>Voortgang 0%</span>
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '0%' }}></div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">Video Player</p>
                <p className="text-sm text-gray-400">Placeholder voor video content</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {['Transcript', 'Bronnen', 'Notities', 'Discussie'].map((tab) => (
                  <button
                    key={tab}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      tab === 'Transcript'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Video Transcript</h3>
                <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Transcript</span>
                </button>
              </div>

              <div 
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            </div>
          </div>
        </div>

        {/* Sidebar - Course Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">Course Navigatie</h3>
            
            <nav className="space-y-3">
              {[
                { id: 1, title: "Inleiding Cybersecurity", completed: true },
                { id: 2, title: "Wachtwoord Beveiliging", completed: false, active: true },
                { id: 3, title: "Phishing Herkenning", completed: false },
                { id: 4, title: "Social Engineering", completed: false }
              ].map((module) => (
                <div
                  key={module.id}
                  className={`p-3 rounded-lg text-sm ${
                    module.active
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : module.completed
                      ? 'text-gray-600 hover:bg-gray-50'
                      : 'text-gray-400'
                  }`}
                >
                  {module.title}
                  {module.completed && (
                    <svg className="w-4 h-4 float-right text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-6 flex space-x-3">
              <button className="flex-1 bg-gray-500 text-white py-2 px-3 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                Vorige
              </button>
              <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                Volgende
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}