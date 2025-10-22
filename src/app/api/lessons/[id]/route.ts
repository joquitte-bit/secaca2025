// 📁 BESTAND: /src/app/api/lessons/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/lessons/[id] - Haal specifieke les op
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const lesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/lessons/[id] - Update les
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, status, category, duration, difficulty, type, tags, videoUrl, content, order } = body;

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Map status to Prisma enum
    let prismaStatus: any = undefined;
    if (status === 'Actief') prismaStatus = 'PUBLISHED';
    if (status === 'Inactief') prismaStatus = 'ARCHIVED';
    if (status === 'Concept') prismaStatus = 'DRAFT';

    // Map difficulty - gewoon als string opslaan
    let prismaDifficulty: string | undefined = undefined;
    if (difficulty === 'Beginner') prismaDifficulty = 'beginner';
    if (difficulty === 'Intermediate') prismaDifficulty = 'intermediate';
    if (difficulty === 'Expert') prismaDifficulty = 'expert';

    // Map type to Prisma enum
    let prismaType: any = undefined;
    if (type === 'Video') prismaType = 'VIDEO';
    if (type === 'Artikel') prismaType = 'TEXT';
    if (type === 'Quiz') prismaType = 'QUIZ';
    if (type === 'Interactief') prismaType = 'DOWNLOAD';

    // Tags als JSON string opslaan als tags meegegeven wordt
    const tagsJson = tags ? JSON.stringify(tags) : undefined;

    // Update data object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (prismaStatus) updateData.status = prismaStatus;
    if (category) updateData.category = category;
    if (duration !== undefined) updateData.durationMinutes = duration;
    if (prismaDifficulty) updateData.difficulty = prismaDifficulty;
    if (prismaType) updateData.type = prismaType;
    if (tagsJson) updateData.tags = tagsJson;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (content) updateData.content = content;
    if (order !== undefined) updateData.order = order;

    // Update lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedLesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/lessons/[id] - Verwijder les
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if lesson exists
    const existingLesson = await prisma.lesson.findUnique({
      where: { id },
    });

    if (!existingLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Delete lesson
    await prisma.lesson.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Lesson deleted successfully',
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}