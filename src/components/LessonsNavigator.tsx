// src/components/LessonsNavigator.tsx
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  duration: number;
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

export default function LessonsNavigator({ module, currentLessonId, courseId }: LessonsNavigatorProps) {
  const lessons = module.lessonModules.map(lm => lm.lesson);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 text-lg mb-4">
        Lessen in deze module
      </h3>
      
      <div className="space-y-2">
        {lessons.map((lesson, index) => {
          const isCurrentLesson = lesson.id === currentLessonId;
          const isCompleted = false;

          return (
            <Link
              key={lesson.id}
              href={`/learn/courses/${courseId}/modules/${module.id}/lessons/${lesson.id}`}
              className={`block p-3 rounded-lg border transition-colors ${
                isCurrentLesson 
                  ? 'border-blue-500 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : isCurrentLesson 
                        ? 'bg-blue-200 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="font-medium text-sm">{lesson.title}</span>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {lesson.duration}m
                </span>
              </div>
              
              {isCurrentLesson && (
                <div className="mt-2 text-xs text-blue-600 font-medium">
                  Huidige les
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Module Progress Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Module voortgang</span>
          <span>0 / {lessons.length}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-500 h-2 rounded-full transition-all duration-300"
            style={{ width: '0%' }}
          ></div>
        </div>
      </div>
    </div>
  );
}