// src/components/NextLessonButton.tsx
'use client';

import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
}

interface NextLessonButtonProps {
  courseId: string;
  moduleId: string;
  nextLesson: Lesson | null;
}

export default function NextLessonButton({ courseId, moduleId, nextLesson }: NextLessonButtonProps) {
  if (!nextLesson) {
    return (
      <button 
        className="px-6 py-2 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed"
        disabled
      >
        Geen volgende les
      </button>
    );
  }

  return (
    <Link
      href={`/learn/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.id}`}
      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 inline-block"
    >
      Volgende Les: {nextLesson.title}
    </Link>
  );
}