import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ courseId: string }> }
) {
  const params = await context.params
  const { courseId } = params
  // Your GET logic here
  return NextResponse.json({ id: courseId, title: `Course ${courseId}` })
}
