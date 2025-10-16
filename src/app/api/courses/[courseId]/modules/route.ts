import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  const params = await context.params
  const { courseId } = params
  // Your modules logic here
  return NextResponse.json([{ id: '1', title: 'Module 1', courseId }])
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  const params = await context.params
  const { courseId } = params
  const data = await request.json()
  // Your POST logic here
  return NextResponse.json({ id: '1', ...data, courseId })
}
