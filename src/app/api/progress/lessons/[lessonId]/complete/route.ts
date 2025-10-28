import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;
    
    const userId = 'cmh9la1uu0004874a9mlxtu4c'; // Demo Gebruiker
    console.log('Completing lesson:', lessonId, 'for user:', userId);

    console.log('=== DEBUG START ===');
    console.log('User ID:', userId);
    console.log('Lesson ID:', lessonId);

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId }
    });
    console.log('User exists:', userExists);

    // Check if lesson exists  
    const lessonExists = await prisma.lesson.findUnique({
      where: { id: lessonId }
    });
    console.log('Lesson exists:', lessonExists);

    // Check if progress record already exists
    const existingProgress = await prisma.userLessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: userId,
          lessonId: lessonId
        }
      }
    });
    console.log('Existing progress:', existingProgress);

    console.log('=== DEBUG END ===');

    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!lessonExists) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Try simple create first
    try {
      const progress = await prisma.userLessonProgress.create({
        data: {
          userId: userId,
          lessonId: lessonId,
          completed: true,
        }
      });
      console.log('Progress created:', progress);
      return NextResponse.json({ success: true, progress });
    } catch (createError) {
      console.log('Create failed, trying update:', createError);
      
      // If create fails, try update
      const progress = await prisma.userLessonProgress.update({
        where: {
          userId_lessonId: {
            userId: userId,
            lessonId: lessonId
          }
        },
        data: {
          completed: true,
        }
      });
      console.log('Progress updated:', progress);
      return NextResponse.json({ success: true, progress });
    }
    
  } catch (error) {
    console.error('Final error completing lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}