// migrate-course-relations.js
const { PrismaClient } = require('@prisma/client')
const { randomBytes } = require('crypto')

// Maak Prisma client instance
const prisma = new PrismaClient()

function generateCuid() {
  const timestamp = Date.now().toString(36)
  const random = randomBytes(5).toString('hex')
  return `c${timestamp}${random}`
}

async function migrateCourseRelations() {
  try {
    console.log('🚀 SECACA - Course Relations Migratie Gestart...')
    console.log('📡 Prisma client initialiseren...')
    
    // Test de database connectie
    await prisma.$connect()
    console.log('✅ Database verbinding succesvol')
    
    // STAP 1: Vind ALLE modules en filter handmatig
    console.log('🔍 Zoeken naar modules...')
    const allModules = await prisma.module.findMany({
      select: {
        id: true,
        title: true,
        courseId: true
      }
    })

    console.log(`📊 Totaal modules gevonden: ${allModules.length}`)
    
    // Filter modules met courseId handmatig
    const modulesWithCourseId = allModules.filter(module => module.courseId !== null)
    
    console.log(`📋 ${modulesWithCourseId.length} modules met courseId:`)
    modulesWithCourseId.forEach(module => {
      console.log(`   - "${module.title}" → courseId: ${module.courseId}`)
    })

    if (modulesWithCourseId.length === 0) {
      console.log('✅ Geen modules met courseId gevonden. Migration niet nodig.')
      return
    }

    // STAP 2: Verifieer dat de course bestaat
    console.log('\n🔍 Verifiëren dat course bestaat...')
    const courseId = modulesWithCourseId[0].courseId
    
    const existingCourse = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true }
    })

    if (existingCourse) {
      console.log(`✅ Course gevonden: "${existingCourse.title}" (id: ${existingCourse.id})`)
    } else {
      console.log(`❌ Course niet gevonden: ${courseId}`)
      return
    }

    // STAP 3: Creëer CourseOnModule records
    console.log('\n🔄 Maken van CourseOnModule records...')
    
    let createdCount = 0
    let skippedCount = 0

    for (const module of modulesWithCourseId) {
      try {
        console.log(`   📝 Verwerken: "${module.title}"`)
        
        // Check of CourseOnModule table bestaat en toegankelijk is
        try {
          // Eenvoudige insert zonder eerst te checken
          await prisma.courseOnModule.create({
            data: {
              id: generateCuid(),
              courseId: module.courseId,
              moduleId: module.id,
              order: 0
            }
          })
          createdCount++
          console.log(`   ✅ "${module.title}" ↔ "${existingCourse.title}"`)
        } catch (createError) {
          if (createError.code === 'P2002') {
            // Unique constraint error - relatie bestaat al
            console.log(`   ⏭️  Relatie bestaat al: "${module.title}" ↔ "${existingCourse.title}"`)
            skippedCount++
          } else {
            console.log(`   💥 Create error bij "${module.title}":`, createError.message)
          }
        }
      } catch (error) {
        console.log(`   💥 Algemene error bij "${module.title}":`, error.message)
      }
    }

    // STAP 4: Samenvatting
    console.log(`\n🎉 MIGRATIE VOLTOOID!`)
    console.log(`   ✅ ${createdCount} nieuwe CourseOnModule records aangemaakt`)
    console.log(`   ⏭️  ${skippedCount} bestaande relaties overgeslagen`)
    
    if (createdCount > 0) {
      console.log(`\n📝 Controleer in Prisma Studio:`)
      console.log(`   npx prisma studio`)
      console.log(`\n🚀 Nu kun je de Prisma migration uitvoeren:`)
      console.log(`   npx prisma migrate dev --name "fix-courses-modules-many-to-many"`)
    } else {
      console.log(`\n⚠️  Geen nieuwe records. Mogelijk bestaan de relaties al of is er een schema issue.`)
    }

  } catch (error) {
    console.error('❌ Migratie error:', error)
    console.error('Details:', error.message)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Database verbinding gesloten')
  }
}

// Run de migratie
migrateCourseRelations().catch(console.error)