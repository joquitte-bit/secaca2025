// prisma/seed.ts
import { PrismaClient, LessonType, UserRole, CourseStatus, LessonStatus, ModuleStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')
  
  try {
    // Cleanup
    console.log('🧹 Cleaning up existing data...')
    
    await prisma.auditLog.deleteMany()
    await prisma.certificate.deleteMany()
    await prisma.quizAttempt.deleteMany()
    await prisma.quizQuestion.deleteMany()
    await prisma.enrollment.deleteMany()
    await prisma.lessonOnModule.deleteMany()
    await prisma.courseOnModule.deleteMany()
    await prisma.lesson.deleteMany()
    await prisma.module.deleteMany()
    await prisma.course.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.user.deleteMany()
    await prisma.organization.deleteMany()
    await prisma.reportSnapshot.deleteMany()

    console.log('✅ Database cleaned')

    // 1. Maak organization
    const org = await prisma.organization.create({
      data: {
        name: 'Demo Bedrijf BV',
        slug: 'demo-bedrijf',
      }
    })
    console.log('✅ Organization created')

    // 2. Maak admin user
    await prisma.user.create({
      data: {
        email: 'admin@demo-bedrijf.nl',
        name: 'Admin User',
        role: UserRole.ADMIN,
        orgId: org.id
      }
    })
    console.log('✅ Admin user created')

    // 3. Maak 4 lessons
    const lessons = await Promise.all([
      prisma.lesson.create({
        data: {
          title: 'Inleiding Security Awareness',
          description: 'Basis principes van security awareness',
          type: LessonType.TEXT,
          content: JSON.stringify({ content: 'Security awareness basis' }),
          order: 1,
          durationMinutes: 20,
          status: LessonStatus.PUBLISHED,
          difficulty: 'beginner',
          tags: JSON.stringify(['security', 'awareness', 'basics']),
          category: 'Security Basics',
          orgId: org.id
        }
      }),
      prisma.lesson.create({
        data: {
          title: 'Phishing Herkenning',
          description: 'Leer phishing emails herkennen en voorkomen',
          type: LessonType.TEXT,
          content: JSON.stringify({ content: 'Phishing herkenning' }),
          order: 2,
          durationMinutes: 25,
          status: LessonStatus.PUBLISHED,
          difficulty: 'beginner',
          tags: JSON.stringify(['phishing', 'email', 'security']),
          category: 'Security Basics',
          orgId: org.id
        }
      }),
      prisma.lesson.create({
        data: {
          title: 'Wachtwoord Beveiliging',
          description: 'Best practices voor sterke wachtwoorden',
          type: LessonType.TEXT,
          content: JSON.stringify({ content: 'Wachtwoord beveiliging' }),
          order: 3,
          durationMinutes: 15,
          status: LessonStatus.PUBLISHED,
          difficulty: 'beginner', 
          tags: JSON.stringify(['wachtwoorden', 'security']),
          category: 'Security Basics',
          orgId: org.id
        }
      }),
      prisma.lesson.create({
        data: {
          title: 'Social Engineering',
          description: 'Herkennen en voorkomen van manipulatie technieken',
          type: LessonType.TEXT,
          content: JSON.stringify({ content: 'Social engineering' }),
          order: 4,
          durationMinutes: 30,
          status: LessonStatus.PUBLISHED,
          difficulty: 'intermediate',
          tags: JSON.stringify(['social engineering', 'manipulatie']),
          category: 'Advanced Security',
          orgId: org.id
        }
      })
    ])
    console.log('✅ 4 lessons created')

    // 4. Maak 2 modules
    const modules = await Promise.all([
      prisma.module.create({
        data: {
          title: 'Security Basics Training',
          description: 'Complete basis security awareness training',
          category: 'Security Basics',
          status: ModuleStatus.ACTIEF,
          duration: 60,
          difficulty: 'Beginner',
          tags: JSON.stringify(['security', 'basics', 'awareness']),
          order: 1
        }
      }),
      prisma.module.create({
        data: {
          title: 'Geavanceerde Bedreigingen',
          description: 'Training voor geavanceerde security bedreigingen',
          category: 'Advanced Security', 
          status: ModuleStatus.ACTIEF,
          duration: 45,
          difficulty: 'Intermediate',
          tags: JSON.stringify(['advanced', 'threats', 'security']),
          order: 2
        }
      })
    ])
    console.log('✅ 2 modules created')

    // 5. Koppel lessons aan modules
    await prisma.lessonOnModule.createMany({
      data: [
        { moduleId: modules[0].id, lessonId: lessons[0].id, order: 0 },
        { moduleId: modules[0].id, lessonId: lessons[1].id, order: 1 },
        { moduleId: modules[0].id, lessonId: lessons[2].id, order: 2 },
        { moduleId: modules[1].id, lessonId: lessons[3].id, order: 0 }
      ]
    })
    console.log('✅ Lessons connected to modules')

    // 6. Maak course
    const course = await prisma.course.create({
      data: {
        title: 'Complete Security Awareness Training',
        slug: 'complete-security-awareness',
        description: 'Volledige security awareness training voor alle medewerkers',
        status: CourseStatus.PUBLISHED,
        orgId: org.id,
        courseModules: {
          create: [
            { moduleId: modules[0].id, order: 0 },
            { moduleId: modules[1].id, order: 1 }
          ]
        }
      }
    })
    console.log('✅ Course created with modules')

    // 7. Final counts
    const lessonCount = await prisma.lesson.count()
    const moduleCount = await prisma.module.count()
    const courseCount = await prisma.course.count()

    console.log('📊 Final database stats:')
    console.log('   Lessons:', lessonCount)
    console.log('   Modules:', moduleCount) 
    console.log('   Courses:', courseCount)
    console.log('🎉 Seeding completed successfully!')
    
  } catch (error) {
    console.error('❌ SEED ERROR:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error('💥 FATAL ERROR:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })