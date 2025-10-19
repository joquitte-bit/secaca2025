import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Supabase auth check - nu async
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const lessons = await prisma.lesson.findMany({
      orderBy: { createdAt: 'desc' },
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

export async function POST(request: NextRequest) {
  try {
    // Supabase auth check - nu async
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      moduleId 
    } = body;

    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        type: type || 'TEXT',
        content,
        order: order || 0,
        durationMinutes,
        status: status || 'DRAFT',
        difficulty,
        tags,
        category,
        videoUrl,
        moduleId: moduleId || null
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