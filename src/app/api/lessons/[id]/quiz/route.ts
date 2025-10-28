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