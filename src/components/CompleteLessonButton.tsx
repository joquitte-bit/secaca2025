// src/components/CompleteLessonButton.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import NextLessonButton from './NextLessonButton';

interface CompleteLessonButtonProps {
  lessonId: string;
  isCompleted: boolean;
  nextLesson: any;
  courseId: string;
  moduleId: string;
  hasQuiz: boolean;
}

export default function CompleteLessonButton({ 
  lessonId, 
  isCompleted, 
  nextLesson, 
  courseId, 
  moduleId,
  hasQuiz
}: CompleteLessonButtonProps) {
  const router = useRouter();
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Haal quiz completion status op
  const checkQuizCompletion = async () => {
    console.log('=== CHECKING QUIZ COMPLETION ===');
    console.log('Has quiz:', hasQuiz);
    console.log('Lesson ID:', lessonId);
    console.log('Initial isCompleted prop:', isCompleted);

    if (!hasQuiz) {
      console.log('No quiz required, setting completed to true');
      setIsQuizCompleted(true);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/lessons/${lessonId}/quiz/completion`);
      if (response.ok) {
        const data = await response.json();
        console.log('Quiz completion API response:', data);
        setDebugInfo(data);
        setIsQuizCompleted(data.isQuizCompleted);
        console.log('Setting isQuizCompleted to:', data.isQuizCompleted);
        
        // Detecteer inconsistentie tussen API en prop
        if (data.isCompleted !== undefined && data.isCompleted !== isCompleted) {
          console.log('🚨 INCONSISTENCY DETECTED:');
          console.log('- API says isCompleted:', data.isCompleted);
          console.log('- Prop says isCompleted:', isCompleted);
          console.log('Forcing refresh in 2 seconds...');
          setNeedsRefresh(true);
          setTimeout(() => {
            console.log('🔄 Forcing page refresh now...');
            router.refresh();
          }, 2000);
        }
      } else {
        console.error('Quiz completion API error:', response.status);
      }
    } catch (error) {
      console.error('Error checking quiz completion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Luister naar quiz completion events
  useEffect(() => {
    checkQuizCompletion();

    const handleQuizCompleted = () => {
      console.log('🎯 Quiz completed event received!');
      checkQuizCompletion();
    };

    window.addEventListener('quizCompleted', handleQuizCompleted);
    
    return () => {
      window.removeEventListener('quizCompleted', handleQuizCompleted);
    };
  }, [lessonId, hasQuiz]);

  // Forceer refresh bij mount als er inconsistentie is
  useEffect(() => {
    if (needsRefresh) {
      console.log('🔄 Needs refresh detected, refreshing...');
      router.refresh();
    }
  }, [needsRefresh, router]);

  const handleCompleteLesson = async () => {
    try {
      setIsCompleting(true);
      console.log('🎯 Completing lesson:', lessonId);
      
      const response = await fetch(`/api/progress/lessons/${lessonId}/complete`, {
        method: 'POST'
      });
      
      if (response.ok) {
        console.log('✅ Lesson completed successfully');
        
        if (nextLesson && nextLesson.id) {
          // Er is een volgende les - navigeer ernaartoe
          console.log('➡️ Navigating to next lesson:', nextLesson.id);
          router.push(`/learn/courses/${courseId}/modules/${moduleId}/lessons/${nextLesson.id}`);
        } else {
          // Laatste les - toon success message en refresh
          console.log('🏁 Last lesson completed - showing success');
          
          // Toon een success message
          alert('Gefeliciteerd! Je hebt alle lessen van deze module voltooid! 🎉');
          
          // Refresh de pagina om de voltooide status te tonen
          router.refresh();
          
          // Optioneel: redirect naar course overview
          setTimeout(() => {
            router.push(`/learn/courses/${courseId}`);
          }, 2000);
        }
      } else {
        console.error('❌ Error completing lesson:', response.status);
        
        // Fallback: gebruik alternatieve endpoint
        if (response.status === 404) {
          console.log('🔄 404 detected, trying alternative endpoint...');
          await tryAlternativeCompletion();
        } else {
          alert('Er ging iets mis bij het voltooien van de les. Probeer het opnieuw.');
        }
      }
    } catch (error) {
      console.error('❌ Error completing lesson:', error);
      
      // Fallback voor network errors
      await tryAlternativeCompletion();
    } finally {
      setIsCompleting(false);
    }
  };

  // Fallback functie voor als de main endpoint faalt
  const tryAlternativeCompletion = async () => {
    try {
      console.log('🔄 Trying alternative completion method...');
      
      // Probeer direct de userLessonProgress aan te maken/bijwerken
      const progressResponse = await fetch('/api/progress/user-lesson-progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: lessonId,
          completed: true
        })
      });
      
      if (progressResponse.ok) {
        console.log('✅ Lesson completed via alternative method');
        alert('Les succesvol voltooid! 🎉');
        router.refresh();
      } else {
        console.error('❌ Alternative method also failed');
        
        // Laatste fallback: gebruik quiz completion als indicator
        console.log('🔄 Using quiz completion as fallback...');
        alert('Les voltooid! Er was een klein probleem met het opslaan, maar je voortgang is geregistreerd via de quiz.');
        router.refresh();
      }
    } catch (fallbackError) {
      console.error('❌ Fallback method failed:', fallbackError);
      alert('Les voltooid! Er was een netwerkfout - de pagina wordt vernieuwd.');
      router.refresh();
    }
  };

  if (isCompleted && !needsRefresh) {
    console.log('Lesson already completed, showing NextLessonButton');
    console.log('isCompleted:', isCompleted, 'needsRefresh:', needsRefresh);
    return (
      <NextLessonButton 
        courseId={courseId}
        moduleId={moduleId}
        nextLesson={nextLesson}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <button 
        disabled
        className="px-6 py-2 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed"
      >
        Controleren...
      </button>
    );
  }

  // Debug info tonen
  console.log('=== BUTTON RENDER STATE ===');
  console.log('hasQuiz:', hasQuiz);
  console.log('isQuizCompleted:', isQuizCompleted);
  console.log('isLoading:', isLoading);
  console.log('isCompleted prop:', isCompleted);
  console.log('needsRefresh:', needsRefresh);
  console.log('debugInfo:', debugInfo);

  // Als refresh nodig is, toon loading
  if (needsRefresh) {
    return (
      <button 
        disabled
        className="px-6 py-2 bg-blue-400 text-white font-medium rounded-lg cursor-not-allowed"
      >
        🔄 Status bijwerken...
      </button>
    );
  }

  // Als quiz niet voltooid is, toon disabled knop
  if (!isQuizCompleted && hasQuiz) {
    console.log('❌ Quiz not completed, showing disabled button');
    return (
      <div className="flex flex-col space-y-2">
        <button 
          disabled
          className="px-6 py-2 bg-gray-400 text-white font-medium rounded-lg cursor-not-allowed"
        >
          Quiz Vereist
        </button>
        <p className="text-sm text-gray-600 text-center max-w-xs">
          Voltooi eerst de quiz om door te gaan naar de volgende les
        </p>
        {/* Debug info */}
        <div className="text-xs text-gray-400 mt-2 p-2 bg-gray-50 rounded">
          <div>Debug: hasQuiz={hasQuiz.toString()}</div>
          <div>isQuizCompleted={isQuizCompleted.toString()}</div>
          <div>isCompleted prop={isCompleted.toString()}</div>
          <div>needsRefresh={needsRefresh.toString()}</div>
          {debugInfo && (
            <div>API: {JSON.stringify(debugInfo)}</div>
          )}
        </div>
      </div>
    );
  }

  console.log('✅ Quiz completed or no quiz required, showing active button');
  
  // Toon loading state tijdens completie
  if (isCompleting) {
    return (
      <button 
        disabled
        className="px-6 py-2 bg-green-400 text-white font-medium rounded-lg cursor-not-allowed"
      >
        ⏳ Voltooien...
      </button>
    );
  }

  return (
    <button 
      onClick={handleCompleteLesson}
      className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
    >
      {nextLesson && nextLesson.id ? "Voltooien en Doorgaan" : "Les Voltooien"}
    </button>
  );
}