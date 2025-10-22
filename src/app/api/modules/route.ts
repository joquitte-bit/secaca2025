// src/app/api/modules/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('📥 GET /api/modules - Fetching all modules')
    
    // Eerst simpel zonder relations om te testen
    const modules = await prisma.module.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    console.log(`📊 Found ${modules.length} modules`)

    // Simpele transformatie zonder relations
    const transformedModules = modules.map(module => ({
      id: module.id,
      title: module.title,
      description: module.description,
      order: module.order || 0,
      duration: module.duration || 0,
      category: module.category || 'Uncategorized',
      status: module.status || 'DRAFT',
      difficulty: module.difficulty || 'BEGINNER',
      tags: module.tags ? JSON.parse(module.tags) : [],
      // Temporarily empty arrays for relations
      lessons: [],
      courses: [],
      lessonCount: 0,
      courseCount: 0,
      createdAt: module.createdAt.toISOString(),
      updatedAt: module.updatedAt.toISOString()
    }))

    console.log('✅ Modules transformed successfully')
    return NextResponse.json(transformedModules)

  } catch (error: any) {
    console.error('❌ Error fetching modules:', error)
    return NextResponse.json(
      { error: `Failed to fetch modules: ${error.message}` },
      { status: 500 }
    )
  }
}