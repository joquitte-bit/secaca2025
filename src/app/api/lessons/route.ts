// src/app/api/lessons/route.ts - GECORRIGEERDE VERSIE
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/lessons - Haal alle lessons op
export async function GET(request: NextRequest) {
  try {
    console.log('📥 GET /api/lessons - Fetching all lessons');
    
    const lessons = await prisma.lesson.findMany({
      // ALLEEN velden die WEL bestaan in je Prisma schema
      select: {
        id: true,
        title: true,
        description: true,
        type: true,
        content: true,
        order: true,
        durationMinutes: true,
        status: true,
        // difficulty: true, // BESTAAT NIET - verwijder
        tags: true,
        // category: true, // BESTAAT NIET - verwijder  
        videoUrl: true,
        // level: true, // BESTAAT NIET - verwijder
        // slug: true, // BESTAAT NIET - verwijder
        // duration: true, // BESTAAT NIET - verwijder
        // moduleCount: true, // BESTAAT NIET - verwijder
        // enrollmentCount: true, // BESTAAT NIET - verwijder
        // certificateCount: true, // BESTAAT NIET - verwijder
        // completionRate: true, // BESTAAT NIET - verwijder
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Found ${lessons.length} lessons`);

    // Transform voor frontend - voeg default waarden toe voor ontbrekende velden
    const responseLessons = lessons.map(lesson => ({
      ...lesson,
      // Voeg default waarden toe voor velden die de frontend verwacht maar niet in DB bestaan
      difficulty: 'Beginner',
      category: 'Security Basics', 
      level: 'Introductie',
      slug: lesson.title.toLowerCase().replace(/\s+/g, '-'),
      duration: lesson.durationMinutes || 0,
      moduleCount: 0,
      enrollmentCount: 0,
      certificateCount: 0,
      completionRate: 0,
      // Parse JSON strings
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
      // level, // BESTAAT NIET - verwijder
      // slug // BESTAAT NIET - verwijder
    } = body;

    // Valideer required fields
    if (!title || !type) {
      return NextResponse.json(
        { error: 'Title and type are required' },
        { status: 400 }
      );
    }

    // Prepare create data - ALLEEN velden die WEL bestaan
    const createData: any = {
      title,
      description: description || '',
      type,
      content: content || '',
      order: order || 0,
      status: status || 'DRAFT',
      // level: level || 'Introductie', // BESTAAT NIET - verwijder
      // slug: slug || null // BESTAAT NIET - verwijder
    };

    // Optionele velden die WEL bestaan
    if (durationMinutes !== undefined) createData.durationMinutes = durationMinutes;
    // if (difficulty !== undefined) createData.difficulty = difficulty; // BESTAAT NIET
    // if (category !== undefined) createData.category = category; // BESTAAT NIET
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
        // difficulty: true, // BESTAAT NIET
        tags: true,
        // category: true, // BESTAAT NIET
        videoUrl: true,
        // level: true, // BESTAAT NIET
        // slug: true, // BESTAAT NIET
        // duration: true, // BESTAAT NIET
        // moduleCount: true, // BESTAAT NIET
        // enrollmentCount: true, // BESTAAT NIET
        // certificateCount: true, // BESTAAT NIET
        // completionRate: true, // BESTAAT NIET
        createdAt: true,
        updatedAt: true
      }
    });

    // Parse JSON strings voor response + voeg default velden toe
    const responseLesson = {
      ...newLesson,
      difficulty: 'Beginner',
      category: 'Security Basics',
      level: 'Introductie',
      slug: newLesson.title.toLowerCase().replace(/\s+/g, '-'),
      duration: newLesson.durationMinutes || 0,
      moduleCount: 0,
      enrollmentCount: 0,
      certificateCount: 0,
      completionRate: 0,
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