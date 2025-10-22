// create-course-module-relations.js
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createRelations() {
  try {
    console.log('🚀 SECACA - Course-Module Relaties Aanmaken...')
    
    // STAP 1: Vind de course (gebruik de bekende ID)
    const courseId = 'cmgy9he28000487zak1dq4e0t' // Je course ID
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })
    
    if (!course) {
      console.log('❌ Course niet gevonden. Beschikbare courses:')
      const allCourses = await prisma.course.findMany()
      allCourses.forEach(c => console.log(`   - "${c.title}" (${c.id})`))
      return
    }
    
    console.log(`📊 Course gevonden: "${course.title}" (${course.id})`)
    
    // STAP 2: Vind alle modules
    const modules = await prisma.module.findMany({
      select: { id: true, title: true }
    })
    
    console.log(`📋 ${modules.length} modules gevonden:`)
    modules.forEach(module => {
      console.log(`   - "${module.title}" (${module.id})`)
    })
    
    // STAP 3: Creëer relaties voor alle modules met de course
    let createdCount = 0
    let skippedCount = 0
    
    for (const module of modules) {
      try {
        await prisma.courseOnModule.create({
          data: {
            courseId: course.id,
            moduleId: module.id,
            order: 0
          }
        })
        createdCount++
        console.log(`   ✅ "${module.title}" ↔ "${course.title}"`)
      } catch (error) {
        if (error.code === 'P2002') {
          // Unique constraint violation - relatie bestaat al
          console.log(`   ⏭️  Relatie bestaat al: "${module.title}"`)
          skippedCount++
        } else {
          console.log(`   💥 Error bij "${module.title}":`, error.message)
        }
      }
    }
    
    // STAP 4: Samenvatting
    console.log(`\n🎉 VOLTOOID!`)
    console.log(`   ✅ ${createdCount} nieuwe relaties aangemaakt`)
    console.log(`   ⏭️  ${skippedCount} bestaande relaties overgeslagen`)
    
    if (createdCount > 0) {
      console.log(`\n📝 Controleer in Prisma Studio:`)
      console.log(`   npx prisma studio`)
    }
    
  } catch (error) {
    console.error('❌ Algemene error:', error)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Database verbinding gesloten')
  }
}

// Run de functie
createRelations().catch(console.error)