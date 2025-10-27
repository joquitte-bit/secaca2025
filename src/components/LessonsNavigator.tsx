// src/components/LessonsNavigator.tsx
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';

// Update alleen de interfaces om nullable fields te accepteren
interface Lesson {
  id: string;
  title: string;
  duration: number | null; // <- null toestaan
  durationMinutes?: number | null; // <- optioneel toevoegen
}

interface Module {
  id: string;
  title: string;
  lessonModules: {
    lesson: Lesson;
  }[];
}

interface LessonsNavigatorProps {
  module: Module;
  currentLessonId: string;
  courseId: string;
}

async function getLessonProgress(lessonId: string) {
  try {
    const user = await getCurrentUser();
    if (!user) return false;

    const response = await fetch(
      `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/progress/lessons/${lessonId}`,
      { cache: 'no-store' }
    );
    
    if (response.ok) {
      const progress = await response.json();
      return progress.completed;
    }
  } catch (error) {
    console.error('Error fetching lesson progress:', error);
  }
  
  return false;
}

export default async function LessonsNavigator({ module, currentLessonId, courseId }: LessonsNavigatorProps) {
  const lessons = module.lessonModules.map(lm => lm.lesson);

  // Haal progress op voor alle lessons in deze module
  const lessonsWithProgress = await Promise.all(
    lessons.map(async (lesson) => ({
      ...lesson,
      completed: await getLessonProgress(lesson.id)
    }))
  );

  const completedCount = lessonsWithProgress.filter(lesson => lesson.completed).length;
  const progressPercentage = lessons.length > 0 
    ? Math.round((completedCount / lessons.length) * 100) 
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="font-semibold text-gray-900 text-lg mb-4">
        Lessen in deze module
      </h3>
      
      <div className="space-y-2">
        {lessonsWithProgress.map((lesson, index) => {
          const isCurrentLesson = lesson.id === currentLessonId;
          const duration = lesson.duration || lesson.durationMinutes || 0; // <- null-safe duration

          return (
            <Link
              key={lesson.id}
              href={`/learn/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`}
              className={`block p-3 rounded-lg transition-colors ${
                isCurrentLesson 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'text-gray-700 hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    lesson.completed 
                      ? 'bg-green-100 text-green-600 border border-green-300' 
                      : isCurrentLesson 
                        ? 'bg-blue-200 text-blue-600 border border-blue-300'
                        : 'bg-gray-100 text-gray-400 border border-gray-300'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium text-sm">{lesson.title}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {lesson.completed && (
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {duration} min
                  </span>
                </div>
              </div>
              
              {isCurrentLesson && (
                <div className="mt-2 text-xs text-blue-600 font-medium flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  <span>Huidige les</span>
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Module Progress Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">Module voortgang</span>
          <span>{completedCount} / {lessons.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1 text-center">
          {progressPercentage}% voltooid
        </div>
      </div>
    </div>
  );
}