import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    // Supabase auth check - nu async
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = params;
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
      videoUrl 
    } = body;

    // Check if module exists
    const module = await prisma.module.findUnique({
      where: { id: moduleId }
    });

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    // Create lesson
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        type,
        content,
        order: order || 0,
        durationMinutes,
        status: status || 'DRAFT',
        difficulty,
        tags,
        category,
        videoUrl,
        moduleId: moduleId
      },
      include: {
        module: true
      }
    });

    return NextResponse.json(lesson);
  } catch (error) {
    console.error('Lesson creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { moduleId: string } }
) {
  try {
    // Supabase auth check - nu async
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { moduleId } = params;

    const lessons = await prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
      include: {
        module: true
      }
    });

    return NextResponse.json(lessons);
  } catch (error) {
    console.error('Lessons fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}