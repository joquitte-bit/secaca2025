// src/app/api/courses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, CourseStatus } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/courses/[id] - Haal specifieke course op
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: { id },
include: {
  courseModules: {  // 👈 courseModules i.p.v. modules
    include: {
      module: true
    }
  }
}
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/courses/[id] - Update course
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, summary, status, level, tags, slug } = body;

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Map status to Prisma enum
    let prismaStatus: CourseStatus | undefined = undefined;
    if (status === 'Actief') prismaStatus = CourseStatus.PUBLISHED;
    if (status === 'Inactief') prismaStatus = CourseStatus.ARCHIVED;
    if (status === 'Concept') prismaStatus = CourseStatus.DRAFT;

    // Tags als JSON string opslaan
    const tagsJson = tags ? JSON.stringify(tags) : undefined;

    // Update data object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (summary) updateData.summary = summary;
    if (prismaStatus) updateData.status = prismaStatus;
    if (level) updateData.level = level;
    if (tagsJson) updateData.tags = tagsJson;
    if (slug) updateData.slug = slug;

    // Update course
    const updatedCourse = await prisma.course.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Verwijder course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Delete course
    await prisma.course.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: 'Course deleted successfully',
      deletedId: id 
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}