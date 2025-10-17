// prisma/seed.ts
import { PrismaClient, LessonType, UserRole, CourseStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database with complete schema...')
  
  try {
    // Cleanup (in juiste volgorde van dependencies)
    await prisma.auditLog.deleteMany()
    await prisma.certificate.deleteMany()
    await prisma.quizAttempt.deleteMany()
    await prisma.quizQuestion.deleteMany()
    await prisma.enrollment.deleteMany()
    await prisma.lesson.deleteMany()
    await prisma.module.deleteMany()
    await prisma.course.deleteMany()
    await prisma.subscription.deleteMany()
    await prisma.user.deleteMany()
    await prisma.organization.deleteMany()
    await prisma.reportSnapshot.deleteMany()

    // 1. Maak organization
    const org = await prisma.organization.create({
      data: {
        name: 'Demo Bedrijf BV',
        slug: 'demo-bedrijf',
        trialEndsAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 dagen trial
      }
    })
    console.log('✅ Organization created:', org.name)

    // 2. Maak users met verschillende roles
    const admin = await prisma.user.create({
      data: {
        email: 'admin@demo-bedrijf.nl',
        name: 'Sanne Admin',
        role: UserRole.ADMIN,
        orgId: org.id
      }
    })

    const manager = await prisma.user.create({
      data: {
        email: 'manager@demo-bedrijf.nl',
        name: 'Thomas Manager',
        role: UserRole.MANAGER,
        orgId: org.id
      }
    })

    const learner1 = await prisma.user.create({
      data: {
        email: 'medewerker1@demo-bedrijf.nl',
        name: 'Lisa Medewerker',
        role: UserRole.LEARNER,
        orgId: org.id
      }
    })

    const learner2 = await prisma.user.create({
      data: {
        email: 'medewerker2@demo-bedrijf.nl',
        name: 'Mike Medewerker',
        role: UserRole.LEARNER,
        orgId: org.id
      }
    })
    console.log('✅ Users created with roles')

    // 3. Maak subscription
    await prisma.subscription.create({
      data: {
        orgId: org.id,
        stripeSubId: 'sub_demo_123',
        plan: 'standard',
        status: 'active',
        seats: 10,
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    })
    console.log('✅ Subscription created')

    // 4. Maak courses volgens je specificatie
    const cybersecurityCourse = await prisma.course.create({
      data: {
        title: 'Basis Cybersecurity voor Medewerkers (NIS2-ready)',
        slug: 'basis-cybersecurity',
        description: 'Leer de basisprincipes van cybersecurity en bescherm je organisatie tegen digitale dreigingen',
        summary: 'Complete basis training voor cybersecurity awareness',
        level: 'beginner',
        tags: JSON.stringify(['NIS2', 'AVG', 'Wachtwoorden', 'Phishing', 'Data']),
        status: CourseStatus.PUBLISHED,
        orgId: org.id,
        modules: {
          create: [
            {
              title: 'Wachtwoorden & MFA',
              order: 1,
              lessons: {
                create: [
                  {
                    title: 'Introductie Wachtwoordbeveiliging',
                    type: LessonType.TEXT,
                    content: JSON.stringify({ text: 'Leer waarom sterke wachtwoorden belangrijk zijn en hoe je ze maakt...' }),
                    order: 1,
                    durationMinutes: 10
                  },
                  {
                    title: 'Video: MFA Uitleg',
                    type: LessonType.VIDEO,
                    content: JSON.stringify({ videoUrl: 'https://example.com/video/mfa-uitleg' }),
                    order: 2,
                    durationMinutes: 5
                  },
                  {
                    title: 'Quiz: Wachtwoord Kennis',
                    type: LessonType.QUIZ,
                    content: JSON.stringify({ description: 'Test je kennis over wachtwoordbeveiliging' }),
                    order: 3,
                    durationMinutes: 15
                  }
                ]
              }
            },
            {
              title: 'E-mail & Phishing',
              order: 2,
              lessons: {
                create: [
                  {
                    title: 'Phishing Herkennen',
                    type: LessonType.TEXT,
                    content: JSON.stringify({ text: 'Leer de signalen van phishing emails herkennen...' }),
                    order: 1,
                    durationMinutes: 15
                  }
                ]
              }
            }
          ]
        }
      }
    })
    console.log('✅ Cybersecurity course created with modules and lessons')

    // 5. Maak quiz questions voor de quiz lesson
    const quizLesson = await prisma.lesson.findFirst({
      where: { type: LessonType.QUIZ }
    })

    if (quizLesson) {
      await prisma.quizQuestion.create({
        data: {
          lessonId: quizLesson.id,
          prompt: 'Wat is de minimale aanbevolen lengte voor een wachtwoord?',
          answers: JSON.stringify(['6 karakters', '8 karakters', '12 karakters', '16 karakters']),
          correctIndex: 2,
          explanation: '12 karakters is het minimum voor goede beveiliging',
          order: 1
        }
      })

      await prisma.quizQuestion.create({
        data: {
          lessonId: quizLesson.id,
          prompt: 'Welke van deze is het sterkste wachtwoord?',
          answers: JSON.stringify(['wachtwoord123', 'P@ssw0rd!', 'CorrectePaardBatterijSpeld', '12345678']),
          correctIndex: 2,
          explanation: 'Lange zinnen zijn sterker dan complexe korte wachtwoorden',
          order: 2
        }
      })
      console.log('✅ Quiz questions created')
    }

    // 6. Maak extra courses als placeholders
    const phishingCourse = await prisma.course.create({
      data: {
        title: 'Phishing Simulatie (intro)',
        slug: 'phishing-simulatie',
        description: 'Oefen met het herkennen van phishing attempts',
        summary: 'Introductie in phishing herkenning',
        level: 'beginner',
        tags: JSON.stringify(['Phishing', 'E-mail', 'NIS2']),
        status: CourseStatus.PUBLISHED,
        orgId: org.id
      }
    })

    const privacyCourse = await prisma.course.create({
      data: {
        title: 'Privacy Fundamentals (AVG)',
        slug: 'privacy-fundamentals',
        description: 'Begrijp de basisprincipes van de AVG wetgeving',
        summary: 'AVG/GDPR awareness training',
        level: 'beginner',
        tags: JSON.stringify(['AVG', 'Privacy', 'Data']),
        status: CourseStatus.PUBLISHED,
        orgId: org.id
      }
    })
    console.log('✅ Additional courses created')

    // 7. Maak enrollments
    await prisma.enrollment.create({
      data: {
        userId: learner1.id,
        courseId: cybersecurityCourse.id,
        progress: 25
      }
    })

    await prisma.enrollment.create({
      data: {
        userId: learner2.id,
        courseId: cybersecurityCourse.id,
        progress: 50
      }
    })
    console.log('✅ Enrollments created')

    // 8. Maak quiz attempt
    if (quizLesson) {
      await prisma.quizAttempt.create({
        data: {
          userId: learner1.id,
          lessonId: quizLesson.id,
          score: 85,
          passed: true,
          answers: JSON.stringify([2, 2]) // Correcte antwoorden
        }
      })
      console.log('✅ Quiz attempt created')
    }

    // 9. Maak certificaat
    await prisma.certificate.create({
      data: {
        userId: learner1.id,
        courseId: cybersecurityCourse.id,
        url: '/certificates/demo-certificaat.pdf'
      }
    })
    console.log('✅ Certificate created')

    // 10. Maak audit log
    await prisma.auditLog.create({
      data: {
        orgId: org.id,
        userId: admin.id,
        action: 'CREATE',
        entity: 'COURSE',
        entityId: cybersecurityCourse.id,
        meta: JSON.stringify({ title: cybersecurityCourse.title })
      }
    })
    console.log('✅ Audit log created')

    // 11. Final counts
    const orgCount = await prisma.organization.count()
    const userCount = await prisma.user.count()
    const courseCount = await prisma.course.count()
    const moduleCount = await prisma.module.count()
    const lessonCount = await prisma.lesson.count()
    const enrollmentCount = await prisma.enrollment.count()
    const quizQuestionCount = await prisma.quizQuestion.count()
    const quizAttemptCount = await prisma.quizAttempt.count()
    const certificateCount = await prisma.certificate.count()
    const auditLogCount = await prisma.auditLog.count()

    console.log('📊 Final database stats:')
    console.log('   Organizations:', orgCount)
    console.log('   Users:', userCount)
    console.log('   Courses:', courseCount)
    console.log('   Modules:', moduleCount)
    console.log('   Lessons:', lessonCount)
    console.log('   Enrollments:', enrollmentCount)
    console.log('   Quiz Questions:', quizQuestionCount)
    console.log('   Quiz Attempts:', quizAttemptCount)
    console.log('   Certificates:', certificateCount)
    console.log('   Audit Logs:', auditLogCount)
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
    console.log('🔌 Database disconnected')
  })