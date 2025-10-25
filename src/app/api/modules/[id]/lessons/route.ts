// app/api/modules/[id]/lessons/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/modules/[id]/lessons - Haal lessons van module op
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const moduleId = params.id;
    console.log(`📥 GET /api/modules/${moduleId}/lessons - Fetching module lessons`);

    const moduleLessons = await prisma.lessonOnModule.findMany({
      where: { moduleId },
      select: {
        id: true,
        order: true,
        lessonId: true,
        lesson: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            duration: true,
            status: true,
            difficulty: true,
            category: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    });

    console.log(`✅ ${moduleLessons.length} module lessons fetched`);
    return NextResponse.json(moduleLessons);
  } catch (error) {
    console.error('❌ Error fetching module lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch module lessons' },
      { status: 500 }
    );
  }
}

// POST /api/modules/[id]/lessons - Voeg lessons toe aan module
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const moduleId = params.id;
    console.log(`📥 POST /api/modules/${moduleId}/lessons - Adding lessons to module`);

    const body = await request.json();
    const { lessonIds } = body;

    if (!lessonIds || !Array.isArray(lessonIds)) {
      return NextResponse.json(
        { error: 'lessonIds array is required' },
        { status: 400 }
      );
    }

    // Maak lesson-module relationships
    const moduleLessons = await prisma.lessonOnModule.createMany({
      data: lessonIds.map((lessonId, index) => ({
        moduleId,
        lessonId,
        order: index
      })),
      
    });

    console.log(`✅ ${moduleLessons.count} lessons added to module`);
    return NextResponse.json({ success: true, count: moduleLessons.count });
  } catch (error) {
    console.error('❌ Error adding lessons to module:', error);
    return NextResponse.json(
      { error: 'Failed to add lessons to module' },
      { status: 500 }
    );
  }
}

// DELETE /api/modules/[id]/lessons - Verwijder alle lessons van module
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const moduleId = params.id;
    console.log(`🗑️ DELETE /api/modules/${moduleId}/lessons - Removing all lessons from module`);

    const result = await prisma.lessonOnModule.deleteMany({
      where: { moduleId }
    });

    console.log(`✅ ${result.count} lessons removed from module`);
    return NextResponse.json({ success: true, count: result.count });
  } catch (error) {
    console.error('❌ Error removing lessons from module:', error);
    return NextResponse.json(
      { error: 'Failed to remove lessons from module' },
      { status: 500 }
    );
  }
}