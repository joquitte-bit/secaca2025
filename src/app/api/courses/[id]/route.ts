// src/app/api/courses/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        courseModules: {
          include: {
            module: {
              include: {
                lessonModules: {
                  include: {
                    lesson: {
                      select: {
                        id: true,
                        title: true,
                        duration: true,
                        // Verwijder 'completed' als het niet in je schema bestaat
                        // completed: true
                      }
                    }
                  },
                  orderBy: { order: 'asc' }
                }
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Houd bestaande PUT, PATCH, DELETE methods
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, category, difficulty, status, tags, modules } = body;

    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: {
        title,
        description,
        category,
        difficulty,
        status,
        tags: tags ? JSON.stringify(tags) : undefined,
      },
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error('Error patching course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.course.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}