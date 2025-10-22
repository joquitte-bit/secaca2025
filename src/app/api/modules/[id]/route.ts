import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log(`📥 GET /api/modules/${id} - Fetching module`)

    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        lessonModules: {  // ✅ CORRECT
          include: {
            lesson: true
          }
        }
      }
    })

    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    // Transform the data
    const transformedModule = {
      id: module.id,
      title: module.title,
      description: module.description,
      order: module.order,
      duration: module.duration,
      category: module.category,
      status: module.status,
      difficulty: module.difficulty,
      tags: module.tags ? JSON.parse(module.tags) : [],
      lessons: module.lessonModules?.map(lm => lm.lesson) || [],
      lessonCount: module.lessonModules?.length || 0,
      createdAt: module.createdAt.toISOString(),
      updatedAt: module.updatedAt.toISOString()
    }

    return NextResponse.json(transformedModule)
  } catch (error) {
    console.error('❌ Error fetching module:', error)
    return NextResponse.json(
      { error: 'Failed to fetch module' },
      { status: 500 }
    )
  }
}

// Voeg PUT en DELETE methods toe als nodig