// 📁 BESTAND: /src/app/api/lessons/bulk/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /api/lessons/bulk - Bulk status update
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonIds, status } = body;

    if (!lessonIds || !Array.isArray(lessonIds) || lessonIds.length === 0) {
      return NextResponse.json(
        { error: 'Lesson IDs are required' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Map status to Prisma enum
    let prismaStatus: any = 'DRAFT';
    if (status === 'Actief') prismaStatus = 'PUBLISHED';
    if (status === 'Inactief') prismaStatus = 'ARCHIVED';
    if (status === 'Concept') prismaStatus = 'DRAFT';

    // Update all lessons
    const updatedLessons = await prisma.lesson.updateMany({
      where: {
        id: {
          in: lessonIds,
        },
      },
      data: {
        status: prismaStatus,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: `Successfully updated ${updatedLessons.count} lessons`,
      updatedCount: updatedLessons.count,
    });
  } catch (error) {
    console.error('Error bulk updating lessons:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/lessons/bulk - Bulk delete
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { lessonIds } = body;

    if (!lessonIds || !Array.isArray(lessonIds) || lessonIds.length === 0) {
      return NextResponse.json(
        { error: 'Lesson IDs are required' },
        { status: 400 }
      );
    }

    // Delete all lessons
    const deletedLessons = await prisma.lesson.deleteMany({
      where: {
        id: {
          in: lessonIds,
        },
      },
    });

    return NextResponse.json({
      message: `Successfully deleted ${deletedLessons.count} lessons`,
      deletedCount: deletedLessons.count,
    });
  } catch (error) {
    console.error('Error bulk deleting lessons:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}