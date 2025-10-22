// src/app/api/courses/[id]/modules/route.ts - GEFIXT
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log(`📥 GET /api/courses/${id}/modules`)

    const courseModules = await prisma.courseOnModule.findMany({
      where: { courseId: id },
      include: { module: true }
    })

    return NextResponse.json(courseModules)
  } catch (error: any) {
    console.error('❌ Error fetching course modules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course modules' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { moduleIds } = await request.json()
    
    console.log(`📝 POST /api/courses/${id}/modules:`, moduleIds)

    // Delete existing module relationships
    await prisma.courseOnModule.deleteMany({
      where: { courseId: id }
    })

    // Create new module relationships
    if (moduleIds && moduleIds.length > 0) {
      const courseModules = moduleIds.map((moduleId: string, index: number) => ({
        courseId: id,
        moduleId: moduleId,
        order: index
      }))

      await prisma.courseOnModule.createMany({
        data: courseModules
      })
    }

    return NextResponse.json({ message: 'Modules linked to course successfully' })
  } catch (error: any) {
    console.error('❌ Error linking modules:', error)
    return NextResponse.json(
      { error: 'Failed to link modules to course' },
      { status: 500 }
    )
  }
}