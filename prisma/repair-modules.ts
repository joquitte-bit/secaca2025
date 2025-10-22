// prisma/repair-modules.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function repairModules() {
  try {
    console.log('🔧 Repairing module data...')
    
    // Update alle modules met correcte enum values
    const result = await prisma.module.updateMany({
      where: {
        OR: [
          { status: 'Actief' },
          { status: 'Inactief' },
          { status: 'Concept' }
        ]
      },
      data: {
        status: 'ACTIEF',  // Correcte enum value
        difficulty: 'BEGINNER' // Zet allemaal op BEGINNER voor nu
      }
    })
    
    console.log(`✅ Repaired ${result.count} modules`)
    
    // Toon de gerepareerde modules
    const modules = await prisma.module.findMany()
    console.log('📋 Current modules:')
    modules.forEach(module => {
      console.log(`- ${module.title}: status=${module.status}, difficulty=${module.difficulty}`)
    })
    
  } catch (error) {
    console.error('❌ Repair failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

repairModules()