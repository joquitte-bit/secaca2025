// src/components/LearnSidebar.tsx
'use client';

import Link from 'next/link';
import { Icons } from './Icons';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Interfaces blijven hetzelfde zoals je hebt aangepast
interface Lesson {
  id: string;
  title: string;
  duration: number | null;
  durationMinutes?: number | null;
}

interface Module {
  id: string;
  title: string;
  lessonModules: {
    lesson: Lesson;
  }[];
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  courseModules: {
    module: Module;
  }[];
}

interface LearnSidebarProps {
  course: Course;
  currentModuleId: string;
  currentLessonId: string;
}

interface ProgressData {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  moduleProgress: {
    moduleId: string;
    completedLessons: number;
    totalLessons: number;
    progressPercentage: number;
  }[];
}

export default function LearnSidebar({ course, currentModuleId, currentLessonId }: LearnSidebarProps) {
  const pathname = usePathname();
  const [progressData, setProgressData] = useState<ProgressData>({
    totalLessons: 0,
    completedLessons: 0,
    progressPercentage: 0,
    moduleProgress: []
  });

  // Haal progress op voor de hele course
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/progress/courses/${course.id}`);
        if (response.ok) {
          const courseProgress = await response.json();
          
          // Bereken module progress
          const moduleProgress = course.courseModules.map(courseModule => {
            const module = courseModule.module;
            const moduleLessons = module.lessonModules.map(lm => lm.lesson.id);
            const completedInModule = courseProgress.lessons?.filter(
              (l: any) => moduleLessons.includes(l.lessonId) && l.completed
            ).length || 0;
            
            return {
              moduleId: module.id,
              completedLessons: completedInModule,
              totalLessons: moduleLessons.length,
              progressPercentage: moduleLessons.length > 0 
                ? Math.round((completedInModule / moduleLessons.length) * 100) 
                : 0
            };
          });

          setProgressData({
            totalLessons: courseProgress.totalLessons || 0,
            completedLessons: courseProgress.completedLessons || 0,
            progressPercentage: courseProgress.progressPercentage || 0,
            moduleProgress
          });
        }
      } catch (error) {
        console.error('Error fetching course progress:', error);
      }
    };

    fetchProgress();
  }, [course.id, course.courseModules, pathname]);

  const getModuleProgress = (moduleId: string) => {
    return progressData.moduleProgress.find(mp => mp.moduleId === moduleId) || {
      completedLessons: 0,
      totalLessons: 0,
      progressPercentage: 0
    };
  };

  return (
    <div className="w-64 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 fixed left-0 top-16 flex flex-col">
      {/* Content - ZONDER header, begint direct met course info */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {/* Course Info */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h2>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.description || 'Geen beschrijving beschikbaar'}
            </p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Voortgang</span>
                <span className="font-semibold">{progressData.progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressData.progressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Course Stats */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-gray-50 rounded p-2">
                <div className="font-bold text-gray-900">{course.courseModules.length}</div>
                <div className="text-gray-500">Modules</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="font-bold text-gray-900">{progressData.totalLessons}</div>
                <div className="text-gray-500">Lessen</div>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <div className="font-bold text-gray-900">{progressData.completedLessons}</div>
                <div className="text-gray-500">Voltooid</div>
              </div>
            </div>
          </div>

          {/* Modules Navigation */}
          <nav className="space-y-2">
            {/* MODULES TITEL MET LIJN - zoals in dashboard */}
            <div className="border-b border-gray-200 pb-3 mb-3">
              <h3 className="font-semibold text-gray-700 text-xs uppercase tracking-wider">
                MODULES
              </h3>
            </div>
            
            {course.courseModules.map((courseModule, index) => {
              const module = courseModule.module;
              const moduleLessons = module.lessonModules;
              const moduleProgress = getModuleProgress(module.id);
              const isCurrentModule = module.id === currentModuleId;

              return (
                <div key={module.id} className={`rounded-lg transition-colors ${
                  isCurrentModule 
                    ? 'bg-blue-50' 
                    : 'bg-gray-50 hover:bg-white'
                }`}>
                  <Link 
                    href={`/learn/courses/${course.id}/modules/${module.id}`}
                    className={`block p-3 ${isCurrentModule ? 'text-blue-900' : 'text-gray-700'}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isCurrentModule 
                            ? 'bg-blue-100 text-blue-700' 
                            : moduleProgress.progressPercentage === 100
                              ? 'bg-green-100 text-green-600'
                              : 'bg-white text-gray-600'
                        }`}>
                          {moduleProgress.progressPercentage === 100 ? (
                            <Icons.check className="w-3 h-3" />
                          ) : (
                            index + 1
                          )}
                        </span>
                        <h4 className="font-medium text-sm leading-tight">{module.title}</h4>
                      </div>
                      <span className="text-xs text-gray-500 bg-white px-1.5 py-0.5 rounded">
                        {moduleProgress.completedLessons}/{moduleLessons.length}
                      </span>
                    </div>
                    
                    {/* Module Progress */}
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="flex-1 bg-white rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            moduleProgress.progressPercentage === 100 ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${Math.max(moduleProgress.progressPercentage, 5)}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-500 whitespace-nowrap text-xs">
                        {moduleProgress.progressPercentage}%
                      </span>
                    </div>
                  </Link>

                  {/* Lessons in Module (Expanded for current module) */}
                  {isCurrentModule && moduleLessons.length > 0 && (
                    <div className="bg-white rounded-b-lg">
                      <div className="p-2">
                        <h5 className="text-xs font-medium text-blue-800 mb-2 px-1">
                          Lessen:
                        </h5>
                        {moduleLessons.map((lessonModule, lessonIndex) => {
                          const lesson = lessonModule.lesson;
                          const isCurrentLesson = lesson.id === currentLessonId;
                          
                          // Simpele check - in een echte app zou dit via API moeten
                          const isCompleted = lessonIndex < moduleProgress.completedLessons;
                          const duration = lesson.duration || lesson.durationMinutes || 0;
                          
                          return (
                            <Link
                              key={lesson.id}
                              href={`/learn/courses/${course.id}/modules/${module.id}/lessons/${lesson.id}`}
                              className={`flex items-center py-1.5 px-3 text-xs rounded mb-1 transition-colors ${
                                isCurrentLesson 
                                  ? 'bg-blue-100 text-blue-700' 
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs mr-2 ${
                                isCompleted 
                                  ? 'bg-green-100 text-green-600' 
                                  : isCurrentLesson 
                                    ? 'bg-blue-200 text-blue-700'
                                    : 'bg-gray-100 text-gray-500'
                              }`}>
                                {isCompleted ? (
                                  <Icons.check className="w-3 h-3" />
                                ) : (
                                  lessonIndex + 1
                                )}
                              </span>
                              <span className="flex-1 truncate">{lesson.title}</span>
                              <span className="text-gray-400 ml-1 text-xs">
                                {duration} min
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors">
            <Icons.settings className="w-4 h-4" />
            <span>Snelle Instellingen</span>
          </button>
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-white rounded-lg transition-colors">
            <Icons.help className="w-4 h-4" />
            <span>Help & Support</span>
          </button>
        </div>
      </div>
    </div>
  );
}