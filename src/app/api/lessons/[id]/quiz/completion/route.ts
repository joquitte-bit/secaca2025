// app/api/lessons/[id]/quiz/completion/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    const userId = 'cmh9la1uu0004874a9mlxtu4c';

    console.log('Checking quiz completion for:', { lessonId, userId });

    // Alleen attempts van de afgelopen 24 uur tellen
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const passedAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId: userId,
        lessonId: lessonId,
        passed: true,
        createdAt: {
          gte: twentyFourHoursAgo
        }
      }
    });

    console.log('Recent passed attempt:', passedAttempt);

    return NextResponse.json({
      isQuizCompleted: !!passedAttempt,
      hasQuiz: true,
      lastAttempt: passedAttempt
    });
    
  } catch (error) {
    console.error('Error checking quiz completion:', error);
    return NextResponse.json({ 
      isQuizCompleted: false, 
      hasQuiz: false
    }, { status: 500 });
  }
}

// 🔥 GECORRIGEERDE POST METHOD VOOR QUIZ SUBMIT
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: lessonId } = await params;
    const userId = 'cmh9la1uu0004874a9mlxtu4c';
    
    const body = await request.json();
    const { score, passed, totalQuestions, answers } = body;

    console.log('Submitting quiz attempt:', { 
      lessonId, 
      userId, 
      score, 
      passed, 
      totalQuestions 
    });

    // Sla quiz attempt op (gebruik de juiste veldnamen uit je schema)
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: userId,
        lessonId: lessonId,
        score: score,           // Aantal correcte antwoorden
        passed: passed,         // Of de gebruiker geslaagd is
        answers: JSON.stringify(answers || []),  // JSON string van antwoorden
        createdAt: new Date()
      }
    });

    console.log('Quiz attempt saved:', quizAttempt.id);

    // Als quiz gehaald is, markeer les als voltooid
    if (passed) {
      try {
        await prisma.userLessonProgress.upsert({
          where: {
            userId_lessonId: {
              lessonId: lessonId,
              userId: userId
            }
          },
          update: {
            completed: true,
            updatedAt: new Date()
          },
          create: {
            lessonId: lessonId,
            userId: userId,
            completed: true,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log('Lesson marked as completed in userLessonProgress');
      } catch (progressError) {
        console.error('Error updating lesson progress:', progressError);
        // Ga door zelfs als progress update faalt
      }
    }

    return NextResponse.json({
      success: true,
      attemptId: quizAttempt.id,
      score: score,
      passed: passed,
      message: passed ? 'Quiz completed successfully!' : 'Quiz failed, try again!'
    });
    
  } catch (error) {
    console.error('Error submitting quiz:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Failed to submit quiz' 
    }, { status: 500 });
  }
}