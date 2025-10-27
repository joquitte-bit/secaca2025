import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    // Voor development, sta toe zonder user
    if (!user) {
      console.log('No user found, but allowing for development')
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const lessonId = params.id
    console.log('Fetching quiz for lesson:', lessonId)

    // Haal quiz vragen op voor deze lesson
    const quizQuestions = await prisma.quizQuestion.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        prompt: true,
        answers: true,
        explanation: true,
        order: true
      }
    })

    console.log('Found questions:', quizQuestions.length)

    if (quizQuestions.length === 0) {
      return NextResponse.json({ 
        error: 'No questions found for this lesson' 
      }, { status: 404 })
    }

    // Parse JSON answers
    const questionsWithParsedAnswers = quizQuestions.map(q => ({
      ...q,
      answers: JSON.parse(q.answers)
    }))

    return NextResponse.json({ 
      questions: questionsWithParsedAnswers 
    })
  } catch (error) {
    console.error('Error fetching quiz questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz questions' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    // Voor development, gebruik demo user als er geen is
    const userId = user?.id || 'cmh8laluq0000874a2abur4m2-user'

    const lessonId = params.id
    const { answers } = await request.json()

    console.log('Submitting quiz for lesson:', lessonId, 'by user:', userId)

    // Haal quiz vragen op om antwoorden te valideren
    const quizQuestions = await prisma.quizQuestion.findMany({
      where: { lessonId },
      orderBy: { order: 'asc' }
    })

    if (quizQuestions.length === 0) {
      return NextResponse.json({ 
        error: 'No questions found for this lesson' 
      }, { status: 404 })
    }

    // Bereken score
    let score = 0
    const answerResults = answers.map((userAnswer: any, index: number) => {
      const question = quizQuestions[index]
      const isCorrect = userAnswer.answerIndex === question.correctIndex
      if (isCorrect) score++
      
      return {
        questionId: question.id,
        answerIndex: userAnswer.answerIndex,
        correct: isCorrect
      }
    })

    const passed = score >= Math.ceil(quizQuestions.length * 0.7) // 70% nodig om te slagen

    console.log('Quiz result:', { score, total: quizQuestions.length, passed })

    // Maak quiz attempt
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: userId,
        lessonId,
        score,
        passed,
        answers: JSON.stringify(answerResults)
      }
    })

    // Update lesson progress als geslaagd
    if (passed) {
      await prisma.userLessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId: userId,
            lessonId
          }
        },
        update: {
          completed: true
        },
        create: {
          userId: userId,
          lessonId,
          completed: true
        }
      })
      
      console.log('Lesson marked as completed for user:', userId)
    }

    return NextResponse.json({
      score,
      totalQuestions: quizQuestions.length,
      passed,
      answers: answerResults
    })

  } catch (error) {
    console.error('Error submitting quiz:', error)
    return NextResponse.json(
      { error: 'Failed to submit quiz' },
      { status: 500 }
    )
  }
}