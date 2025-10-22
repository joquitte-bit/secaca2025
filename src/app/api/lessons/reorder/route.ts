// 📁 BESTAND: /src/app/api/lessons/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /api/lessons/reorder - Update lesson order
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessons } = body;

    if (!lessons || !Array.isArray(lessons)) {
      return NextResponse.json(
        { error: 'Lessons array is required' },
        { status: 400 }
      );
    }

    // Update order for all lessons in transaction
    const updatePromises = lessons.map((lesson: { id: string; order: number }) =>
      prisma.lesson.update({
        where: { id: lesson.id },
        data: { 
          order: lesson.order,
          updatedAt: new Date(),
        },
      })
    );

    await prisma.$transaction(updatePromises);

    return NextResponse.json({
      message: `Successfully updated order for ${lessons.length} lessons`,
    });
  } catch (error) {
    console.error('Error reordering lessons:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}