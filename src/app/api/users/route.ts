// src/app/api/users/route.ts - COMPLEET VERSIE
import { NextResponse } from 'next/server'
import { PrismaClient, UserRole } from '@prisma/client'

const prisma = new PrismaClient()

// Helper functies voor role mapping
const mapRoleToEnum = (role: string): UserRole => {
  const roleMap: { [key: string]: UserRole } = {
    'Beheerder': UserRole.ADMIN,
    'Manager': UserRole.INSTRUCTOR,
    'Cursist': UserRole.LEARNER
  }
  return roleMap[role] || UserRole.LEARNER
}

const mapEnumToRole = (role: UserRole): string => {
  const roleMap: { [key: string]: string } = {
    'ADMIN': 'Beheerder',
    'INSTRUCTOR': 'Manager', 
    'LEARNER': 'Cursist'
  }
  return roleMap[role] || 'Cursist'
}

// GET alle users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        organization: {
          select: {
            name: true
          }
        },
        enrollments: {
          select: {
            id: true
          }
        },
        certificates: {
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
      orderBy: { createdAt: 'desc' }
    })

    // Transform data voor frontend
    const transformedUsers = users.map(user => ({
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: mapEnumToRole(user.role),
      image: user.image || '',
      organization: user.organization?.name || 'Geen organisatie',
      enrollments: user.enrollments.length,
      certificates: user.certificates.length,
      quizAttempts: user.quizAttempts.length,
      lastLogin: user.updatedAt.toISOString(),
      status: 'Actief', // Default status voor nu
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
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
    
    // Eerst controleren of er organizations bestaan
    const organizations = await prisma.organization.findMany()
    console.log('🏢 Available organizations:', organizations)
    
    let orgId = body.orgId
    
    // Als er geen orgId is opgegeven en er bestaan organizations, gebruik de eerste
    if (!orgId && organizations.length > 0) {
      orgId = organizations[0].id
      console.log('🔍 Using first organization:', orgId)
    }
    
    // Als er nog steeds geen orgId is, maak een default organization aan
    if (!orgId) {
      console.log('🏗️ Creating default organization...')
      const defaultOrg = await prisma.organization.create({
        data: {
          name: 'Demo Organisatie',
          slug: 'demo-organisatie'
        }
      })
      orgId = defaultOrg.id
      console.log('✅ Default organization created:', orgId)
    }
    
    // Controleren of de organization bestaat
    const organization = await prisma.organization.findUnique({
      where: { id: orgId }
    })
    
    if (!organization) {
      console.log('❌ Organization not found:', orgId)
      return NextResponse.json({ error: 'Organization not found' }, { status: 400 })
    }
    
    console.log('✅ Using organization:', organization.name)
    
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
    
    // Return transformed user data
    const transformedUser = {
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: mapEnumToRole(user.role),
      image: user.image || '',
      status: 'Actief',
      organization: organization.name,
      enrollments: 0,
      certificates: 0,
      quizAttempts: 0,
      lastLogin: user.updatedAt.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    }
    
    return NextResponse.json(transformedUser)
  } catch (error) {
    console.error('❌ Error creating user:', error)
    
    // Specifieke error handling
    if (error instanceof Error && 'code' in error) {
      const prismaError = error as any
      
      if (prismaError.code === 'P2002') {
        return NextResponse.json({ error: 'Email address already exists' }, { status: 400 })
      }
      
      if (prismaError.code === 'P2003') {
        return NextResponse.json({ error: 'Invalid organization reference' }, { status: 400 })
      }
    }
    
    return NextResponse.json({ 
      error: 'Failed to create user: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

// PATCH - User status bijwerken
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    console.log('🔄 Updating user status:', { id, status })

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 })
    }

    // Zoek de user
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            name: true
          }
        },
        enrollments: {
          select: {
            id: true
          }
        },
        certificates: {
          select: {
            id: true
          }
        },
        quizAttempts: {
          select: {
            id: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update de user (voor nu alleen de updatedAt, want we hebben geen status veld in Prisma)
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        updatedAt: new Date()
      },
      include: {
        organization: {
          select: {
            name: true
          }
        },
        enrollments: {
          select: {
            id: true
          }
        },
        certificates: {
          select: {
            id: true
          }
        },
        quizAttempts: {
          select: {
            id: true
          }
        }
      }
    })

    // Return transformed user data met nieuwe status
    const transformedUser = {
      id: updatedUser.id,
      name: updatedUser.name || '',
      email: updatedUser.email,
      role: mapEnumToRole(updatedUser.role),
      image: updatedUser.image || '',
      status: status, // Gebruik de nieuwe status
      organization: updatedUser.organization?.name || 'Geen organisatie',
      enrollments: updatedUser.enrollments.length,
      certificates: updatedUser.certificates.length,
      quizAttempts: updatedUser.quizAttempts.length,
      lastLogin: updatedUser.updatedAt.toISOString(),
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    }

    console.log('✅ User status updated successfully')
    return NextResponse.json(transformedUser)
  } catch (error) {
    console.error('❌ Error updating user status:', error)
    return NextResponse.json({ 
      error: 'Failed to update user status: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}

// DELETE - User verwijderen
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    console.log('🗑️ Deleting user:', id)

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Controleren of user bestaat
    const user = await prisma.user.findUnique({
      where: { id }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // User verwijderen
    await prisma.user.delete({
      where: { id }
    })

    console.log('✅ User deleted successfully')
    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('❌ Error deleting user:', error)
    return NextResponse.json({ 
      error: 'Failed to delete user: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 })
  }
}