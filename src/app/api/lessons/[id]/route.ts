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

// PUT /api/lessons/[id] - Update volledige les
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('🔄 PUT /api/lessons/[id] - Starting update')
    const { id } = await params;
    console.log('📝 Lesson ID:', id)
    
    const body = await request.json();
    console.log('📦 Request body:', body)

    const { title, description, status, category, duration, difficulty, type, tags, videoUrl, content, order } = body;

    console.log('🎯 Received fields:', { 
      title, description, status, category, duration, difficulty, type 
    })

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

    // Map difficulty - gebruik exact dezelfde values
    let prismaDifficulty: string | undefined = difficulty;

    // Map type - gebruik exact dezelfde values
    let prismaType: any = type;

    // Tags als JSON string opslaan
    const tagsJson = tags ? JSON.stringify(tags) : undefined;

    // Update data object - gebruik de juiste database veldnamen
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (prismaStatus) updateData.status = prismaStatus;
    if (category) updateData.category = category;
    if (duration !== undefined) updateData.durationMinutes = duration; // Map naar durationMinutes
    if (prismaDifficulty) updateData.difficulty = prismaDifficulty;
    if (prismaType) updateData.type = prismaType;
    if (tagsJson) updateData.tags = tagsJson;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (content) updateData.content = content;
    if (order !== undefined) updateData.order = order;

    console.log('📊 Update data for database:', updateData)

    // Update lesson
    const updatedLesson = await prisma.lesson.update({
      where: { id },
      data: updateData,
    });

    console.log('✅ Lesson updated successfully:', {
      id: updatedLesson.id,
      title: updatedLesson.title,
      type: updatedLesson.type,
      difficulty: updatedLesson.difficulty,
      duration: updatedLesson.durationMinutes,
      category: updatedLesson.category,
      status: updatedLesson.status
    })

    // Return de updated lesson met alle velden
    const responseLesson = {
      ...updatedLesson,
      duration: updatedLesson.durationMinutes, // Map terug naar duration voor frontend
      tags: updatedLesson.tags ? JSON.parse(updatedLesson.tags) : [],
    }

    return NextResponse.json(responseLesson);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/lessons/[id] - Update les (partial update)
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

    // Update data object - alleen meegegeven velden updaten
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Map status to Prisma enum (alleen als meegegeven) - CONSISTENT MET COURSES/MODULES
    if (status !== undefined) {
      let prismaStatus: any = undefined;
      if (status === 'Actief') prismaStatus = 'PUBLISHED';
      if (status === 'Inactief') prismaStatus = 'ARCHIVED';
      if (status === 'Concept') prismaStatus = 'DRAFT';
      if (prismaStatus) updateData.status = prismaStatus;
    }

    // Map difficulty (alleen als meegegeven)
    if (difficulty !== undefined) {
      let prismaDifficulty: string | undefined = undefined;
      if (difficulty === 'Beginner') prismaDifficulty = 'beginner';
      if (difficulty === 'Intermediate') prismaDifficulty = 'intermediate';
      if (difficulty === 'Expert') prismaDifficulty = 'expert';
      if (prismaDifficulty) updateData.difficulty = prismaDifficulty;
    }

    // Map type to Prisma enum (alleen als meegegeven)
    if (type !== undefined) {
      let prismaType: any = undefined;
      if (type === 'Video') prismaType = 'VIDEO';
      if (type === 'Artikel') prismaType = 'TEXT';
      if (type === 'Quiz') prismaType = 'QUIZ';
      if (type === 'Interactief') prismaType = 'DOWNLOAD';
      if (prismaType) updateData.type = prismaType;
    }

    // Alleen velden updaten die zijn meegegeven
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (duration !== undefined) updateData.durationMinutes = duration;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (content !== undefined) updateData.content = content;
    if (order !== undefined) updateData.order = order;

    // Tags als JSON string opslaan als tags meegegeven wordt
    if (tags !== undefined) {
      const tagsJson = Array.isArray(tags) ? JSON.stringify(tags) : undefined;
      if (tagsJson) updateData.tags = tagsJson;
    }

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