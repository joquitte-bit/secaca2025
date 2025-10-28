// reset-all-quiz-attempts.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetAllQuizAttempts() {
  try {
    console.log('🔍 Zoeken naar alle lessons...')
    
    // Toon alle lessons
    const lessons = await prisma.lesson.findMany({
      select: { id: true, title: true, order: true }
    })
    
    console.log('\n📚 Alle lessons:')
    lessons.forEach(lesson => {
      console.log(`- ${lesson.title} (Order: ${lesson.order}): ${lesson.id}`)
    })
    
    console.log('\n🗑️ Verwijderen quiz attempts voor ALLE lessons...')
    
    // Verwijder alle quiz attempts
    const result = await prisma.quizAttempt.deleteMany({})
    
    console.log(`✅ ${result.count} quiz attempts verwijderd voor alle lessons`)
    
    // Check of ze echt weg zijn
    const remainingAttempts = await prisma.quizAttempt.findMany({})
    console.log('📊 Resterende attempts totaal:', remainingAttempts.length)
    
  } catch (error) {
    console.error('❌ Fout bij verwijderen quiz attempts:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetAllQuizAttempts()