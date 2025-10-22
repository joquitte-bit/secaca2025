import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/modules/[id]/lessons - Haal lessons voor module op
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const moduleLessons = await prisma.lessonOnModule.findMany({
      where: { moduleId: id },
      include: {
        lesson: true
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(moduleLessons);
  } catch (error) {
    console.error('Error fetching module lessons:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/modules/[id]/lessons - Voeg lesson toe aan module
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { lessonId, order = 0 } = body;

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    // Check if module exists
    const existingModule = await prisma.module.findUnique({
      where: { id },
    });

    if (!existingModule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!existingLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Create many-to-many relation
    const moduleLesson = await prisma.lessonOnModule.create({
      data: {
        moduleId: id,
        lessonId: lessonId,
        order: order
      },
      include: {
        lesson: true
      }
    });

    return NextResponse.json(moduleLesson);
  } catch (error) {
    console.error('Error adding lesson to module:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/modules/[id]/lessons - Verwijder lesson van module
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json({ error: 'Lesson ID is required' }, { status: 400 });
    }

    // Delete many-to-many relation
    await prisma.lessonOnModule.delete({
      where: {
        moduleId_lessonId: {
          moduleId: id,
          lessonId: lessonId
        }
      }
    });

    return NextResponse.json({ 
      message: 'Lesson removed from module successfully'
    });
  } catch (error) {
    console.error('Error removing lesson from module:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}