import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`🔍 Fetching module ID: ${params.id}`);
    
    const module = await prisma.module.findUnique({
      where: { id: params.id },
      include: {
        lessonModules: {
          include: {
            lesson: {
              select: {
                id: true,
                title: true,
                description: true,
                type: true,
                content: true,
                durationMinutes: true,
                status: true,
                difficulty: true,
                category: true,
                videoUrl: true,
                order: true,
                tags: true
              }
            }
          },
          orderBy: { order: 'asc' }
        },
        courseModules: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true
              }
            }
          }
        }
      }
    });

    if (!module) {
      console.log('❌ Module not found');
      return Response.json({ error: "Module not found" }, { status: 404 });
    }

    console.log('✅ Module found:', module.title);
    
    // Transform the response to match frontend expectations
    const transformedModule = {
      ...module,
      lessons: module.lessonModules.map(lm => lm.lesson),
      courses: module.courseModules.map(cm => cm.course),
      duration: module.duration || 0,
      lessonCount: module.lessonModules.length
    };

    return Response.json(transformedModule);
  } catch (error) {
    console.error('❌ Error fetching module:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Houd de bestaande PUT, PATCH, DELETE methods hetzelfde
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { title, description, duration, status, difficulty, category, order, lessonIds } = body;

    const updatedModule = await prisma.module.update({
      where: { id: params.id },
      data: {
        title,
        description,
        duration,
        status,
        difficulty,
        category,
        order,
        // Update lesson connections if provided
        ...(lessonIds && {
          lessonModules: {
            deleteMany: {}, // Remove existing connections
            create: lessonIds.map((lessonId: string, index: number) => ({
              lessonId,
              order: index
            }))
          }
        })
      },
      include: {
        lessonModules: {
          include: {
            lesson: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    return Response.json(updatedModule);
  } catch (error) {
    console.error('Error updating module:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.module.delete({
      where: { id: params.id }
    });

    return Response.json({ message: "Module deleted successfully" });
  } catch (error) {
    console.error('Error deleting module:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const updatedModule = await prisma.module.update({
      where: { id: params.id },
      data: body,
      include: {
        lessonModules: {
          include: {
            lesson: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    return Response.json(updatedModule);
  } catch (error) {
    console.error('Error patching module:', error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}