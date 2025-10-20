// src/app/api/lessons/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orgId = searchParams.get('orgId') || 'default-org'

    console.log('🔍 Fetching lessons for org:', orgId)

    // Haal ALLE lessons op, ook die zonder orgId
    const lessons = await prisma.lesson.findMany({
      orderBy: { createdAt: 'desc' }
    })

    console.log(`✅ ${lessons.length} lessons gevonden (inclusief zonder orgId)`)
    console.log('📋 Lesson IDs:', lessons.map(l => ({ id: l.id, orgId: l.orgId })))

    // Transform the data to match frontend expectations
    const transformedLessons = lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      description: lesson.description || '',
      type: lesson.type,
      content: lesson.content,
      order: lesson.order,
      duration: lesson.durationMinutes || 0,
      status: lesson.status,
      difficulty: lesson.difficulty || 'Beginner',
      tags: lesson.tags ? JSON.parse(lesson.tags) : [],
      category: lesson.category || 'Uncategorized',
      videoUrl: lesson.videoUrl,
      moduleId: null,
      students: 0,
      progress: 0,
      createdAt: lesson.createdAt.toISOString().split('T')[0],
      updatedAt: lesson.updatedAt.toISOString().split('T')[0],
    }))

    return NextResponse.json(transformedLessons)
  } catch (error) {
    console.error('Lessons fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}