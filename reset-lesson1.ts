// reset-lesson1.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function resetLesson1() {
  try {
    console.log('🔍 Zoeken naar lessons...')
    
    // Toon alle lessons met hun details
    const lessons = await prisma.lesson.findMany({
      select: { id: true, title: true, order: true }
    })
    
    console.log('\n📚 Beschikbare lessons:')
    lessons.forEach(lesson => {
      console.log(`- ${lesson.title} (Order: ${lesson.order}): ${lesson.id}`)
    })
    
    // Vind les 1 (meestal order: 1)
    const lesson1 = lessons.find(l => l.order === 1)
    
    if (!lesson1) {
      console.log('❌ Les 1 niet gevonden')
      return
    }
    
    console.log(`\n🔄 Resetten van les 1: ${lesson1.title}`)
    
    // Eerst checken welke velden bestaan in UserLessonProgress
    const progressRecord = await prisma.userLessonProgress.findFirst({
      where: {
        lessonId: lesson1.id
      }
    })
    
    console.log('📊 Huidige progress record:', progressRecord)
    
    if (progressRecord) {
      // Update naar niet voltooid - gebruik alleen bekende velden
      const updateData: any = {
        completed: false
      }
      
      // Alleen progress toevoegen als het veld bestaat
      if ('progress' in progressRecord) {
        updateData.progress = 0
      }
      
      await prisma.userLessonProgress.update({
        where: { id: progressRecord.id },
        data: updateData
      })
      
      console.log('✅ Les 1 progress gereset naar niet voltooid')
    } else {
      console.log('ℹ️  Geen progress record gevonden voor les 1')
      
      // Optioneel: Toon alle progress records om te zien wat er wel bestaat
      const allProgress = await prisma.userLessonProgress.findMany({
        include: { lesson: true }
      })
      
      console.log('\n📋 Alle progress records:')
      allProgress.forEach(p => {
        console.log(`- Les: ${p.lesson?.title}, Voltooid: ${p.completed}, ID: ${p.id}`)
      })
    }
  } catch (error) {
    console.error('❌ Fout bij resetten:', error)
  } finally {
    await prisma.$disconnect()
  }
}

resetLesson1()