// src/app/api/quiz/attempt/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { lessonId, answers, score, passed } = await request.json();

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id,
        lessonId,
        answers: JSON.stringify(answers),
        score,
        passed
      }
    });

    // Als de quiz passed is, markeer de les ook als voltooid
    if (passed) {
      await prisma.userLessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: user.id,
            lessonId
          }
        },
        update: {
          completed: true
        },
        create: {
          userId: user.id,
          lessonId,
          completed: true
        }
      });
    }

    return NextResponse.json({ success: true, attempt });
  } catch (error) {
    console.error('Error saving quiz attempt:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}