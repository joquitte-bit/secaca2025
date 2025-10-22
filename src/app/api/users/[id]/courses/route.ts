// src/app/api/users/[id]/courses/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/users/[id]/courses - Haal courses voor user op (enrollments)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const userEnrollments = await prisma.enrollment.findMany({
      where: { userId: id },
      include: {
        course: {
include: {
  courseModules: {  // 👈 courseModules i.p.v. modules
    include: {
      module: true
    }
  }
}
        }
      },
      orderBy: { startedAt: 'desc' }
    });

    return NextResponse.json(userEnrollments);
  } catch (error) {
    console.error('Error fetching user courses:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users/[id]/courses - Schrijf user in voor course
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: id,
        courseId: courseId
      },
      include: {
        course: true
      }
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error('Error enrolling user in course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}