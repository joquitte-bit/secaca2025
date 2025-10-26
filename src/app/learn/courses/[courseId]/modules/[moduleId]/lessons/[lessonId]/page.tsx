// src/app/learn/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx
import LearnSidebar from '@/components/LearnSidebar';
import LessonsNavigator from '@/components/LessonsNavigator';
import ReactMarkdown from 'react-markdown';

interface PageProps {
  params: Promise<{
    courseId: string;
    moduleId: string; 
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  // AWAIT de params
  const { courseId, moduleId, lessonId } = await params;

  try {
    // Fetch course data with modules and lessons
    const course = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses/${courseId}`, {
      cache: 'no-store',
    }).then(res => res.json());

    const module = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/modules/${moduleId}`, {
      cache: 'no-store',
    }).then(res => res.json());

    const lesson = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/lessons/${lessonId}`, {
      cache: 'no-store',
    }).then(res => res.json());

    if (!course || course.error || !module || module.error || !lesson || lesson.error) {
      throw new Error('Data not found');
    }

    return (
      <div className="min-h-[calc(100vh-4rem-3rem)] flex">
        {/* Left Sidebar - Course Navigation */}
        <div className="w-64 shrink-0">
          {/* Lege div voor spacing - sidebar is fixed */}
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 flex">
          {/* Actual Sidebar Content */}
          <div className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem-3rem)] overflow-y-auto">
            <LearnSidebar 
              course={course}
              currentModuleId={moduleId}
              currentLessonId={lessonId}
            />
          </div>

          {/* Middle - Lesson Content */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[500px]">
              {/* Header */}
              <div className="border-b border-gray-200 px-8 py-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {lesson.title || "Les titel"}
                </h1>
                <p className="text-gray-600">
                  {`${lesson.category || "Categorie"} • ${lesson.duration || 0} minuten • ${lesson.difficulty || "Beginner"}`}
                </p>
              </div>

              {/* Video Player & Content */}
              <div className="px-8 py-6">
                {/* Video Player */}
                {lesson.videoUrl ? (
                  <div className="mb-6">
                    <div className="bg-gray-100 rounded-lg overflow-hidden">
                      {lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be') ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(lesson.videoUrl)}`}
                          className="w-full h-[34rem]"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          title={lesson.title}
                        />
                      ) : (
                        <div className="w-full h-[34rem] flex items-center justify-center bg-gray-200 rounded-lg">
                          <p className="text-gray-500">Video niet beschikbaar</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="w-full h-[34rem] bg-black rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <svg className="w-16 h-16 mx-auto text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mt-2 text-lg">Video speler</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Video Controls */}
                <div className="flex justify-between items-center mb-8">
                  <div className="flex space-x-1">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      Transcript
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      Bronnen
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      Notities
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                      Discussie
                    </button>
                  </div>
                  <span className="text-sm text-gray-600">{lesson.duration || 0}:00 / {lesson.duration || 0}:00</span>
                </div>

                {/* Lesson Description */}
                {lesson.description && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                      Over deze les
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>
                )}

                {/* Lesson Content with Markdown */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Les Inhoud
                  </h3>
                  
                  <div className="prose prose-gray max-w-none text-gray-700">
                    {lesson.content ? (
                      <ReactMarkdown>
                        {lesson.content}
                      </ReactMarkdown>
                    ) : (
                      <p className="text-gray-500 italic">
                        Deze les heeft nog geen inhoud.
                      </p>
                    )}
                  </div>
                </div>

                {/* Objectives Section */}
                {lesson.objectives && lesson.objectives.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Leerdoelen
                    </h3>
                    <ul className="space-y-2">
                      {lesson.objectives.map((objective: string, index: number) => (
                        <li key={index} className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border">
                          <span className="text-gray-700">{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Prerequisites Section */}
                {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Vereiste Kennis
                    </h3>
                    <ul className="space-y-2">
                      {lesson.prerequisites.map((prereq: string, index: number) => (
                        <li key={index} className="flex items-center bg-gray-50 px-3 py-2 rounded-lg border">
                          <span className="text-gray-700">{prereq}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Progress Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-gray-700">Voortgang</span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">0%</span>
                    </div>
                    
                    <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                      Volgende Les
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Lessons Navigator */}
          <div className="w-80 p-6">
            <LessonsNavigator 
              module={module}
              currentLessonId={lessonId}
              courseId={courseId}
            />
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading lesson page:', error);
    
    return (
      <div className="min-h-[calc(100vh-4rem-3rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Les niet gevonden</h1>
          <p className="text-gray-600 mb-4">Er is een probleem met het laden van de les.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Probeer opnieuw
          </button>
        </div>
      </div>
    );
  }
}

// YouTube ID extractor helper functie
function getYouTubeId(url: string): string {
  if (!url) return '';
  
  // Voor YouTube URLs zoals: https://www.youtube.com/watch?v=VIDEO_ID
  const match = url.match(/[?&]v=([^&]+)/);
  if (match) return match[1];
  
  // Voor YouTube shortened URLs zoals: https://youtu.be/VIDEO_ID
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return shortMatch[1];
  
  // Voor YouTube embed URLs
  const embedMatch = url.match(/embed\/([^?]+)/);
  if (embedMatch) return embedMatch[1];
  
  return '';
}