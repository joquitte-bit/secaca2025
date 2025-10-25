// src/app/api/modules/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, ModuleStatus } from '@prisma/client'

const prisma = new PrismaClient()

function mapStatus(status: string): ModuleStatus {
  const statusMap: { [key: string]: ModuleStatus } = {
    'CONCEPT': ModuleStatus.DRAFT,
    'Concept': ModuleStatus.DRAFT,
    'DRAFT': ModuleStatus.DRAFT,
    'Actief': ModuleStatus.ACTIEF,
    'ACTIEF': ModuleStatus.ACTIEF,
    'Inactief': ModuleStatus.ARCHIVED,
    'ARCHIVED': ModuleStatus.ARCHIVED
  };
  
  return statusMap[status] || ModuleStatus.DRAFT;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const moduleId = params.id
    console.log(`📝 PUT /api/modules/${moduleId} - Updating module`)
    
    const body = await request.json()
    console.log('📦 Request body:', JSON.stringify(body, null, 2))

    // Pak ONLY de velden die bestaan in de database
    const {
      title,
      description,
      status,
      content,
      duration,
      order,
      tags,
      category,
      difficulty,
      objectives,
      prerequisites
    } = body

    // Check if module exists
    const existingModule = await prisma.module.findUnique({
      where: { id: moduleId }
    })

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    // Map status naar Prisma enum
    const prismaStatus = status ? mapStatus(status) : undefined

    // Update module - ONLY met bestaande database velden
    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        ...(title && { title: title.trim() }),
        ...(description && { description: description.trim() }),
        ...(status && { status: prismaStatus }),
        ...(content !== undefined && { content: content.toString().trim() }),
        ...(duration !== undefined && { duration: Number(duration) || 0 }),
        ...(order !== undefined && { order: Number(order) || 0 }),
        ...(tags && { tags: JSON.stringify(tags) }),
        ...(category && { category: category.toString().trim() }),
        ...(difficulty && { difficulty }),
        ...(objectives !== undefined && { objectives: objectives.toString().trim() }),
        ...(prerequisites !== undefined && { prerequisites: prerequisites.toString().trim() })
      }
    })

    console.log('✅ Module updated successfully:', updatedModule.id)

    // Response
    const response = {
      id: updatedModule.id,
      title: updatedModule.title,
      description: updatedModule.description,
      status: updatedModule.status,
      content: updatedModule.content,
      duration: updatedModule.duration,
      order: updatedModule.order,
      tags: updatedModule.tags ? JSON.parse(updatedModule.tags) : [],
      category: updatedModule.category,
      difficulty: updatedModule.difficulty,
      objectives: updatedModule.objectives,
      prerequisites: updatedModule.prerequisites,
      lessons: 0,
      courseCount: updatedModule.courseCount || 0,
      completionRate: updatedModule.completionRate || 0,
      createdAt: updatedModule.createdAt.toISOString(),
      updatedAt: updatedModule.updatedAt.toISOString()
    }

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('❌ Error updating module:', error)
    
    if (error.code) {
      console.error('Prisma error code:', error.code)
    }
    if (error.meta) {
      console.error('Prisma error meta:', error.meta)
    }
    
    return NextResponse.json(
      { error: 'Failed to update module: ' + error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const moduleId = params.id
    console.log(`🗑️ DELETE /api/modules/${moduleId} - Deleting module`)

    // Check if module exists
    const existingModule = await prisma.module.findUnique({
      where: { id: moduleId }
    })

    if (!existingModule) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      )
    }

    // Delete module
    await prisma.module.delete({
      where: { id: moduleId }
    })

    console.log('✅ Module deleted successfully:', moduleId)

    return NextResponse.json({ 
      message: 'Module deleted successfully',
      id: moduleId
    })

  } catch (error: any) {
    console.error('❌ Error deleting module:', error)
    return NextResponse.json(
      { error: 'Failed to delete module: ' + error.message },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}