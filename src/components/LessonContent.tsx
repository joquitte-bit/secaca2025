// src/components/LessonContent.tsx
import React from 'react';
import { Icons } from './Icons';
import ReactMarkdown from 'react-markdown';

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'VIDEO' | 'QUIZ' | 'TEXT' | 'DOWNLOAD';
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  duration: number;
  category: string;
  videoUrl: string;
  // ... andere velden
}

interface LessonContentProps {
  lesson: Lesson;
}

const LessonContent = ({ lesson }: LessonContentProps) => {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {lesson.title}
        </h1>
        <p className="text-gray-600">
          {lesson.category} • {lesson.duration} minuten
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-8 py-8">
          {/* Video Player - alleen tonen als videoUrl bestaat */}
          {lesson.videoUrl && (
            <>
              <div className="bg-black rounded-lg overflow-hidden mb-8">
                <div className="aspect-video bg-gray-800 flex items-center justify-center">
                  <iframe
                    src={`https://www.youtube.com/embed/${getYouTubeId(lesson.videoUrl)}`}
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Video Controls */}
              <div className="flex justify-between items-center mb-6 px-2">
                <span className="text-sm text-gray-600">Video</span>
                <div className="flex space-x-1">
                  <button className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md">
                    Transcript
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-md">
                    Bronnen
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Les Content met Markdown ondersteuning */}
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown>
              {lesson.content}
            </ReactMarkdown>
          </div>

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
                Volgende Module
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functie om YouTube ID te extraheren
function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/);
  return match ? match[1] : '';
}

export default LessonContent;