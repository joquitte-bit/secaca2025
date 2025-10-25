import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/lessons - Haal alle lessons op
export async function GET(request: NextRequest) {
  try {
    console.log('📥 GET /api/lessons - Fetching all lessons');
    
    const lessons = await prisma.lesson.findMany({
      // Gebruik select om alleen bestaande velden op te halen
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        content: true,
        order: true,
        durationMinutes: true,
        status: true,
        difficulty: true,
        tags: true,
        category: true,
        videoUrl: true,
        level: true,
        slug: true,
        duration: true,
        moduleCount: true,
        enrollmentCount: true,
        certificateCount: true,
        completionRate: true,
        createdAt: true,
        updatedAt: true,
        // Relations - alleen als ze nodig zijn
        lessonModules: {
          select: {
            id: true,
            order: true,
            module: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Parse JSON strings voor de frontend
    const responseLessons = lessons.map(lesson => ({
      ...lesson,
      tags: lesson.tags ? JSON.parse(lesson.tags) : [],
    }));

    return NextResponse.json(responseLessons);
  } catch (error) {
    console.error('❌ Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

// POST /api/lessons - Maak nieuwe lesson
export async function POST(request: NextRequest) {
  try {
    console.log('📥 POST /api/lessons - Creating new lesson');
    
    const body = await request.json();
    const {
      title,
      description,
      type,
      content,
      order,
      durationMinutes,
      status,
      difficulty,
      tags,
      category,
      videoUrl,
      level,
      slug
    } = body;

    // Valideer required fields
    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    // Prepare create data
    const createData: any = {
      title,
      description: description || '',
      type,
      content: content || '',
      order: order || 0,
      status: status || 'DRAFT',
      level: level || 'Introductie',
      slug: slug || null
    };

    // Optionele velden
    if (durationMinutes !== undefined) createData.durationMinutes = durationMinutes;
    if (difficulty !== undefined) createData.difficulty = difficulty;
    if (category !== undefined) createData.category = category;
    if (videoUrl !== undefined) createData.videoUrl = videoUrl;

    // Array velden - convert to JSON
    if (tags !== undefined && Array.isArray(tags)) {
      createData.tags = JSON.stringify(tags);
    }

    const newLesson = await prisma.lesson.create({
      data: createData,
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        content: true,
        order: true,
        durationMinutes: true,
        status: true,
        difficulty: true,
        tags: true,
        category: true,
        videoUrl: true,
        level: true,
        slug: true,
        duration: true,
        moduleCount: true,
        enrollmentCount: true,
        certificateCount: true,
        completionRate: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // Parse JSON strings voor response
    const responseLesson = {
      ...newLesson,
      tags: newLesson.tags ? JSON.parse(newLesson.tags) : [],
    };

    console.log('✅ Lesson created successfully:', responseLesson);
    return NextResponse.json(responseLesson, { status: 201 });
    
  } catch (error) {
    console.error('❌ Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}