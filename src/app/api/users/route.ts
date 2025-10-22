// src/app/api/users/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

// Map frontend role naar Prisma enum
const mapRoleToEnum = (role: string): UserRole => {
  const roleMap: { [key: string]: UserRole } = {
    'Eigenaar': UserRole.OWNER,
    'Beheerder': UserRole.ADMIN,
    'Manager': UserRole.MANAGER,
    'Cursist': UserRole.LEARNER
  }
  return roleMap[role] || UserRole.LEARNER
}

// Map Prisma enum naar frontend role
const mapEnumToRole = (role: UserRole): string => {
  const roleMap: { [key: string]: string } = {
    'OWNER': 'Eigenaar',
    'ADMIN': 'Beheerder',
    'MANAGER': 'Manager',
    'LEARNER': 'Cursist'
  }
  return roleMap[role] || 'Cursist'
}

// GET alle users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        organization: true,
        enrollments: {
          include: {
            course: true
          }
        },
        certificates: true
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transform data voor frontend
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: mapEnumToRole(user.role),
      image: user.image || '',
      organization: user.organization.name,
      enrollments: user.enrollments.length,
      certificates: user.certificates.length,
      lastLogin: user.updatedAt,
      status: 'Actief',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }))

    return NextResponse.json(transformedUsers)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST - Nieuwe user aanmaken
export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('📝 Creating user:', body)
    
    const orgId = body.orgId || 'cmgy9he28000487zak1dq4e0t'
    
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        role: mapRoleToEnum(body.role || 'Cursist'),
        image: body.image,
        orgId: orgId
      }
    })
    
    console.log('✅ User created:', user.id)
    return NextResponse.json(user)
  } catch (error) {
    console.error('❌ Error creating user:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}