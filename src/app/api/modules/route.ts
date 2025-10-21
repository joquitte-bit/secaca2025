// src/app/api/modules/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔄 [API] Fetching modules...')
    
    // EERST: Simpele query zonder complexe includes
    const modules = await prisma.module.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        order: true,
        category: true,
        status: true,
        difficulty: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        // Simpele counts zonder complexe relations
        _count: {
          select: {
            lessons: true,
            courses: true
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    })

    console.log(`✅ [API] Found ${modules.length} modules`)

    // Transform to match frontend interface
    const transformedModules = modules.map((module) => {
      return {
        id: module.id,
        title: module.title,
        description: module.description || '',
        order: module.order,
        category: module.category || 'Uncategorized',
        status: module.status === 'ACTIEF' ? 'Actief' : 
                module.status === 'INACTIEF' ? 'Inactief' : 'Concept',
        duration: 0, // Placeholder voor nu
        difficulty: (module.difficulty as 'Beginner' | 'Intermediate' | 'Expert') || 'Beginner',
        tags: module.tags ? JSON.parse(module.tags) : [],
        // Gebruik _count voor aantallen
        lessons: module._count.lessons,
        courseCount: module._count.courses,
        completionRate: 0,
        createdAt: module.createdAt.toISOString().split('T')[0],
        updatedAt: module.updatedAt.toISOString().split('T')[0],
      }
    })

    console.log(`✅ [API] ${transformedModules.length} modules transformed`)
    
    return NextResponse.json(transformedModules)
  } catch (error) {
    console.error('❌ [API] Error fetching modules:', error)
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    )
  }
}