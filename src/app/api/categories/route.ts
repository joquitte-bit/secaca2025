// app/api/categories/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('📥 GET /api/categories - Fetching categories');
    
    // Return default categories voor SECACA
    const categories = [
      'Security Basics',
      'Advanced Security', 
      'Network Security',
      'Web Security',
      'Cloud Security',
      'Mobile Security',
      'Cryptography',
      'Social Engineering',
      'Incident Response',
      'Compliance',
      'Privacy',
      'Risk Management',
      'Security Awareness',
      'Phishing Prevention',
      'Data Protection',
      'NIS2 Compliance',
      'GDPR Compliance'
    ];
    
    console.log(`✅ ${categories.length} categories returned`);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('❌ Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}