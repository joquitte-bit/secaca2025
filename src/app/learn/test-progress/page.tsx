// src/app/learn/test-progress/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface ProgressData {
  completed: boolean;
  progressId: string | null;
}

interface CourseProgressData {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
  lessons: Array<{
    lessonId: string;
    completed: boolean;
  }>;
}

export default function TestProgressPage() {
  const [lessonProgress, setLessonProgress] = useState<ProgressData | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgressData | null>(null);
  const [loading, setLoading] = useState(false);

  const lessonId = 'cmh9hd418000687nuzitajm34'; // Inleiding Security Awareness
  const courseId = 'cmh9hd41q000k87nuzq3o5byg'; // Complete Security Awareness Training

  const fetchLessonProgress = async () => {
    try {
      const response = await fetch(`/api/progress/lessons/${lessonId}`);
      const data = await response.json();
      setLessonProgress(data);
    } catch (error) {
      console.error('Error fetching lesson progress:', error);
    }
  };

  const fetchCourseProgress = async () => {
    try {
      const response = await fetch(`/api/progress/courses/${courseId}`);
      const data = await response.json();
      setCourseProgress(data);
    } catch (error) {
      console.error('Error fetching course progress:', error);
    }
  };

  const markLessonComplete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/progress/lessons/${lessonId}/complete`, {
        method: 'POST'
      });
      const data = await response.json();
      console.log('Lesson completed:', data);
      
      // Refresh progress data
      await fetchLessonProgress();
      await fetchCourseProgress();
    } catch (error) {
      console.error('Error completing lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessonProgress();
    fetchCourseProgress();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Test Progress API</h1>
      
      {/* Lesson Progress */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Lesson Progress</h2>
        <div className="mb-4">
          <p><strong>Lesson ID:</strong> {lessonId}</p>
          <p><strong>Completed:</strong> {lessonProgress?.completed ? 'Yes' : 'No'}</p>
          <p><strong>Progress ID:</strong> {lessonProgress?.progressId || 'None'}</p>
        </div>
        <button
          onClick={markLessonComplete}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Marking...' : 'Mark Lesson Complete'}
        </button>
      </div>

      {/* Course Progress */}
      <div className="p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Course Progress</h2>
        {courseProgress ? (
          <div>
            <p><strong>Total Lessons:</strong> {courseProgress.totalLessons}</p>
            <p><strong>Completed Lessons:</strong> {courseProgress.completedLessons}</p>
            <p><strong>Progress:</strong> {courseProgress.progressPercentage}%</p>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">Lesson Status:</h3>
              {courseProgress.lessons.map((lesson, index) => (
                <div key={lesson.lessonId} className="flex items-center space-x-2 mb-1">
                  <span className={`w-3 h-3 rounded-full ${lesson.completed ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                  <span>Lesson {index + 1}: {lesson.completed ? 'Completed' : 'Not completed'}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading course progress...</p>
        )}
      </div>

      {/* Refresh Button */}
      <div className="mt-4">
        <button
          onClick={() => {
            fetchLessonProgress();
            fetchCourseProgress();
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Refresh All Data
        </button>
      </div>
    </div>
  );
}