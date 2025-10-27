// src/components/CompleteLessonButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import NextLessonButton from './NextLessonButton';

interface CompleteLessonButtonProps {
  lessonId: string;
  isCompleted: boolean;
  nextLesson: any;
  courseId: string;
  moduleId: string;
}

export default function CompleteLessonButton({ 
  lessonId, 
  isCompleted, 
  nextLesson, 
  courseId, 
  moduleId 
}: CompleteLessonButtonProps) {
  const router = useRouter();

  if (isCompleted) {
    return (
      <NextLessonButton 
        courseId={courseId}
        moduleId={moduleId}
        nextLesson={nextLesson}
      />
    );
  }

  const handleCompleteLesson = async () => {
    try {
      const response = await fetch(`/api/progress/lessons/${lessonId}/complete`, {
        method: 'POST'
      });
      
      if (response.ok) {
        // Refresh de pagina om de updated progress te tonen
        router.refresh();
      }
    } catch (error) {
      console.error('Error completing lesson:', error);
    }
  };

  return (
    <button 
      onClick={handleCompleteLesson}
      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
    >
      Les Voltooien
    </button>
  );
}