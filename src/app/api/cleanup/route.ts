import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const userId = 'cmh9la1uu0004874a9mlxtu4c';
    
    console.log('🧹 Cleaning up quiz attempts for user:', userId);

    // Verwijder ALLE quiz attempts voor deze gebruiker
    const result = await prisma.quizAttempt.deleteMany({
      where: {
        userId: userId
      }
    });

    console.log(`✅ Deleted ${result.count} quiz attempts`);

    return NextResponse.json({
      success: true,
      deletedCount: result.count,
      message: `Successfully deleted ${result.count} quiz attempts for user ${userId}`
    });

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    return NextResponse.json(
      { error: 'Cleanup failed', details: String(error) },
      { status: 500 }
    );
  }
}

// Ook POST ondersteunen voor flexibiliteit
export async function POST(request: NextRequest) {
  return GET(request);
}