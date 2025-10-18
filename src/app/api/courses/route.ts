// src/app/api/courses/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Voor nu returnen we dummy data
    // Later kun je dit vervangen door echte data uit Supabase
    const courses = [
      {
        id: '1',
        title: 'Phishing Awareness',
        description: 'Leer phishing aanvallen herkennen en voorkomen',
        isPublished: true,
        modulesCount: 3,
        createdAt: new Date().toISOString()
      },
      {
        id: '2', 
        title: 'Password Security',
        description: 'Best practices voor wachtwoordbeveiliging',
        isPublished: false,
        modulesCount: 0,
        createdAt: new Date().toISOString()
      }
    ]

    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Simuleer het aanmaken van een course
    const newCourse = {
      id: Math.random().toString(36).substr(2, 9),
      title: body.title,
      description: body.description || null,
      isPublished: false,
      modulesCount: 0,
      createdAt: new Date().toISOString()
    }

    return NextResponse.json(newCourse, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}