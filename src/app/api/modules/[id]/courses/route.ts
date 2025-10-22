import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/modules/[id]/courses - Haal courses voor module op
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const moduleCourses = await prisma.courseOnModule.findMany({
      where: { moduleId: id },
      include: {
        course: true
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(moduleCourses);
  } catch (error) {
    console.error('Error fetching module courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}