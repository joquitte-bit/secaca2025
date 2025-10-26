// src/app/learn/courses/[courseId]/modules/[moduleId]/lessons/[lessonId]/page.tsx
import LearnSidebar from '@/components/LearnSidebar';
import LessonsNavigator from '@/components/LessonsNavigator';
import ReactMarkdown from 'react-markdown';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    courseId: string;
    moduleId: string; 
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: PageProps) {
  const { courseId, moduleId, lessonId } = await params;

  try {
    // Fetch course with modules
    const courseResponse = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/courses/${courseId}`,
      { cache: 'no-store' }
    );
    
    if (!courseResponse.ok) throw new Error('Course not found');
    const course = await courseResponse.json();

    // Fetch module with lessons
    const moduleResponse = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/modules/${moduleId}`,
      { cache: 'no-store' }
    );
    
    if (!moduleResponse.ok) throw new Error('Module not found');
    const module = await moduleResponse.json();

    // Fetch lesson directly
    const lessonResponse = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/lessons/${lessonId}`,
      { cache: 'no-store' }
    );
    
    if (!lessonResponse.ok) throw new Error('Lesson not found');
    const lesson = await lessonResponse.json();

    // Check if data is valid
    if (!course || !module || !lesson) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Main Content Area - EXACT ZELFDE LAYOUT ALS DASHBOARD/USERS */}
        <div className="flex">
          {/* Left Sidebar - Course Navigation - FIXED POSITION ONDER NAVBAR */}
<div className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
  <LearnSidebar 
    course={course}
    currentModuleId={moduleId}
    currentLessonId={lessonId}
  />
</div>

          {/* Main Content - LESS MARGIN LIKE DASHBOARD/USERS */}
          <div className="flex-1 ml-64">
            {/* Content Container - SAME PADDING AS DASHBOARD/USERS */}
            <div className="p-6">
              {/* Header Section - SIMILAR TO DASHBOARD/USERS HEADER */}
<div className="mb-6">
  <div className="flex justify-between items-center">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {lesson.title || "Les titel"}
      </h1>
      <p className="text-gray-600 mt-1">
        {course.title} • {module.title}
      </p>
    </div>
    <div className="flex items-center space-x-3">
      <span className="text-sm text-gray-500">
        {lesson.durationMinutes || lesson.duration || 0} minuten
      </span>
      <div className="flex items-center space-x-2">
        <div className="w-32 bg-gray-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: '0%' }}></div>
        </div>
        <span className="text-sm text-gray-600">0%</span>
      </div>
    </div>
  </div>
</div>

              {/* Main Content Grid - SIMILAR TO DASHBOARD LAYOUT */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Middle - Lesson Content - TAKES 2/3 SPACE */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-sm">
                    {/* Video Player Section */}
                    <div>
                      {lesson.videoUrl ? (
                        <div className="bg-gray-100 rounded-t-lg overflow-hidden">
                          {lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be') ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${getYouTubeId(lesson.videoUrl)}`}
                              className="w-full h-96"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              title={lesson.title}
                            />
                          ) : (
                            <video
                              controls
                              className="w-full h-96"
                              src={lesson.videoUrl}
                            >
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                      ) : (
                        <div className="w-full h-96 bg-black rounded-t-lg flex items-center justify-center">
                          <div className="text-white text-center">
                            <svg className="w-16 h-16 mx-auto text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="mt-2 text-lg">Geen video beschikbaar</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Video Controls */}
                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Transcript
                          </button>
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Bronnen
                          </button>
                          <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            Notities
                          </button>
                        </div>
                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
                          Volgende Les
                        </button>
                      </div>
                    </div>

                    {/* Lesson Content */}
                    <div className="p-6">
                      <div className="prose prose-gray max-w-none">
                        {lesson.content ? (
                          <ReactMarkdown>
                            {lesson.content}
                          </ReactMarkdown>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-gray-500 text-lg mb-2">
                              Deze les heeft nog geen inhoud
                            </p>
                            <p className="text-gray-400">
                              De content wordt binnenkort toegevoegd
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar - Lessons Navigator - TAKES 1/3 SPACE */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <LessonsNavigator 
                      module={module}
                      currentLessonId={lessonId}
                      courseId={courseId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading lesson page:', error);
    notFound();
  }
}

// YouTube ID extractor helper functie
function getYouTubeId(url: string): string {
  if (!url) return '';
  
  const match = url.match(/[?&]v=([^&]+)/);
  if (match) return match[1];
  
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  if (shortMatch) return shortMatch[1];
  
  const embedMatch = url.match(/embed\/([^?]+)/);
  if (embedMatch) return embedMatch[1];
  
  return '';
}