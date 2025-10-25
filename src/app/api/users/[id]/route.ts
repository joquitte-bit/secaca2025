// src/app/api/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

// Helper functies voor role mapping - AANGEPAST AAN HUIDIGE SCHEMA
const mapRoleToEnum = (role: string): UserRole => {
  const roleMap: { [key: string]: UserRole } = {
    'Eigenaar': UserRole.ADMIN,      // ADMIN gebruikt als eigenaar
    'Beheerder': UserRole.ADMIN,     // ADMIN gebruikt als beheerder  
    'Manager': UserRole.INSTRUCTOR,  // INSTRUCTOR gebruikt als manager
    'Cursist': UserRole.LEARNER
  }
  return roleMap[role] || UserRole.LEARNER;
}

const mapEnumToRole = (role: UserRole): string => {
  const roleMap: { [key: string]: string } = {
    'ADMIN': 'Beheerder',      // ADMIN toont als Beheerder
    'INSTRUCTOR': 'Manager',   // INSTRUCTOR toont als Manager
    'LEARNER': 'Cursist'
  }
  return roleMap[role] || 'Cursist';
}

// GET /api/users/[id] - Haal specifieke user op
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🔍 Fetching user:', id);
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true
          }
        },
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                status: true
              }
            }
          }
        },
        certificates: {
          select: {
            id: true,
            courseId: true,
            issuedAt: true
          }
        },
        quizAttempts: {
          select: {
            id: true,
            lessonId: true,
            score: true,
            passed: true,
            createdAt: true
          }
        }
      }
    });

    if (!user) {
      console.log('❌ User not found:', id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform data voor frontend
    const transformedUser = {
      id: user.id,
      name: user.name || '',
      email: user.email,
      role: mapEnumToRole(user.role),
      image: user.image || '',
      status: 'Actief', // Default status
      organization: user.organization?.name || 'Geen organisatie',
      enrollments: user.enrollments.length,
      certificates: user.certificates.length,
      quizAttempts: user.quizAttempts.length,
      lastLogin: user.updatedAt.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };

    console.log('✅ User fetched successfully:', user.id);
    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Update user
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('📝 Updating user:', id, body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      console.log('❌ User not found for update:', id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Map role to Prisma enum - AANGEPAST
    let prismaRole: UserRole | undefined = undefined;
    if (body.role) {
      if (body.role === 'Eigenaar') prismaRole = UserRole.ADMIN;
      else if (body.role === 'Beheerder') prismaRole = UserRole.ADMIN;
      else if (body.role === 'Manager') prismaRole = UserRole.INSTRUCTOR;
      else if (body.role === 'Cursist') prismaRole = UserRole.LEARNER;
    }

    // Update data object
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (prismaRole !== undefined) updateData.role = prismaRole;
    if (body.image !== undefined) updateData.image = body.image;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        organization: {
          select: {
            name: true
          }
        },
        enrollments: {
          include: {
            course: true
          }
        }
      }
    });

    // Transform response
    const transformedUser = {
      id: updatedUser.id,
      name: updatedUser.name || '',
      email: updatedUser.email,
      role: mapEnumToRole(updatedUser.role),
      image: updatedUser.image || '',
      status: 'Actief',
      organization: updatedUser.organization?.name || 'Geen organisatie',
      enrollments: updatedUser.enrollments.length,
      certificates: 0,
      lastLogin: updatedUser.updatedAt.toISOString(),
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };

    console.log('✅ User updated successfully:', updatedUser.id);
    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    
    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return NextResponse.json(
          { error: 'Email address already exists' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Verwijder user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🗑️ Deleting user:', id);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      console.log('❌ User not found for deletion:', id);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has important relations that should prevent deletion
    const userEnrollments = await prisma.enrollment.count({
      where: { userId: id }
    });

    const userCertificates = await prisma.certificate.count({
      where: { userId: id }
    });

    if (userEnrollments > 0 || userCertificates > 0) {
      console.log('❌ User has relations, cannot delete:', id);
      return NextResponse.json(
        { 
          error: 'Cannot delete user with existing enrollments or certificates. Please deactivate instead.' 
        },
        { status: 400 }
      );
    }

    // Delete user (Prisma will cascade delete related records based on schema)
    await prisma.user.delete({
      where: { id },
    });

    console.log('✅ User deleted successfully:', id);
    return NextResponse.json({ 
      message: 'User deleted successfully',
      deletedUserId: id
    });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Alternative update method
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log('📝 PUT - Updating user:', id, body);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // For PUT, we expect complete user data
    const updateData: any = {
      updatedAt: new Date(),
      name: body.name || '',
      email: body.email,
      role: mapRoleToEnum(body.role || 'Cursist'),
      image: body.image || null,
    };

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        organization: {
          select: {
            name: true
          }
        }
      }
    });

    // Transform response
    const transformedUser = {
      id: updatedUser.id,
      name: updatedUser.name || '',
      email: updatedUser.email,
      role: mapEnumToRole(updatedUser.role),
      image: updatedUser.image || '',
      status: 'Actief',
      organization: updatedUser.organization?.name || 'Geen organisatie',
      enrollments: 0,
      certificates: 0,
      lastLogin: updatedUser.updatedAt.toISOString(),
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString(),
    };

    console.log('✅ User updated via PUT:', updatedUser.id);
    return NextResponse.json(transformedUser);
  } catch (error) {
    console.error('❌ Error in PUT user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}