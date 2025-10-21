// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('🔄 [API] Fetching users...')
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        orgId: true,
        createdAt: true,
        updatedAt: true,
        // Gebruik directe relations ipv _count
        enrollments: {
          select: {
            id: true
          }
        },
        quizAttempts: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    console.log(`✅ [API] Found ${users.length} users`)

    // Transform for frontend - AANGEPAST VOOR WERKELIJKE SCHEMA
    const transformedUsers = users.map((user) => ({
      id: user.id,
      name: user.name || 'Naamloos',
      email: user.email,
      role: user.role || 'USER',
      status: 'Actief', // Placeholder - bestaat niet in schema
      lastLogin: 'Recent', // Placeholder - bestaat niet in schema
      enrollments: user.enrollments.length,
      quizAttempts: user.quizAttempts.length,
      completionRate: 0, // Placeholder
      createdAt: user.createdAt.toISOString().split('T')[0],
      updatedAt: user.updatedAt.toISOString().split('T')[0],
    }))

    console.log(`✅ [API] ${transformedUsers.length} users transformed`)
    
    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('❌ [API] Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}