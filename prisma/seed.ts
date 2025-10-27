// prisma/seed.ts
import { PrismaClient, LessonType, UserRole, CourseStatus, LessonStatus, ModuleStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')
  
  try {
    // Cleanup - VOLGORDE AANGEPAST vanwege foreign key constraints
    console.log('🧹 Cleaning up existing data...')
    
    // Eerst tabellen met foreign keys
    await prisma.userLessonProgress.deleteMany()
    await prisma.auditLog.deleteMany()
    await prisma.certificate.deleteMany()
    await prisma.quizAttempt.deleteMany()
    await prisma.quizQuestion.deleteMany()
    await prisma.enrollment.deleteMany()
    await prisma.lessonOnModule.deleteMany()
    await prisma.courseOnModule.deleteMany()
    
    // Dan hoofdtabellen
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

    // 2. Maak admin user EN regular user voor progress
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@demo-bedrijf.nl',
        name: 'Admin User',
        role: UserRole.ADMIN,
        orgId: org.id
      }
    })

    const regularUser = await prisma.user.create({
      data: {
        email: 'gebruiker@demo-bedrijf.nl',
        name: 'Demo Gebruiker',
        role: UserRole.LEARNER,
        orgId: org.id
      }
    })
    console.log('✅ Users created')

    // 3. Maak lessons
    const lessons = await Promise.all([
      prisma.lesson.create({
        data: {
          title: 'Inleiding Security Awareness',
          description: 'Basis principes van security awareness',
          type: LessonType.TEXT,
          content: JSON.stringify({
            type: 'doc',
            content: [
              {
                type: 'heading',
                attrs: { level: 1 },
                content: [{ type: 'text', text: 'Inleiding Security Awareness' }]
              },
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'Welkom bij de security awareness training. In deze les leren we de basisprincipes van informatiebeveiliging.' }
                ]
              }
            ]
          }),
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
          content: JSON.stringify({
            type: 'doc',
            content: [
              {
                type: 'heading',
                attrs: { level: 1 },
                content: [{ type: 'text', text: 'Phishing Herkenning' }]
              },
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'Phishing is een veelvoorkomende aanvalstechniek waarbij aanvallers proberen persoonlijke informatie te stelen via nep-e-mails, websites of berichten.' }
                ]
              }
            ]
          }),
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
          content: JSON.stringify({
            type: 'doc',
            content: [
              {
                type: 'heading',
                attrs: { level: 1 },
                content: [{ type: 'text', text: 'Wachtwoord Beveiliging' }]
              },
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'Sterke wachtwoorden zijn essentieel voor de beveiliging van jouw accounts en bedrijfsgegevens.' }
                ]
              }
            ]
          }),
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
          content: JSON.stringify({
            type: 'doc',
            content: [
              {
                type: 'heading',
                attrs: { level: 1 },
                content: [{ type: 'text', text: 'Social Engineering' }]
              },
              {
                type: 'paragraph',
                content: [
                  { type: 'text', text: 'Social engineering is de psychologische manipulatie van mensen om hen handelingen te laten verrichten of vertrouwelijke informatie te delen.' }
                ]
              }
            ]
          }),
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

    // 4. Maak quiz vragen voor elke lesson
    console.log('❓ Creating quiz questions...')
    
    // Quiz vragen voor Lesson 1: Inleiding Security Awareness
    await prisma.quizQuestion.createMany({
      data: [
        {
          lessonId: lessons[0].id,
          prompt: 'Wat is het belangrijkste doel van security awareness training?',
          answers: JSON.stringify([
            'IT-afdeling helpen met technische problemen',
            'Medewerkers bewust maken van security risico\'s en hoe deze te voorkomen',
            'Meer werkdruk creëren voor medewerkers',
            'Alleen compliance vereisten afvinken'
          ]),
          correctIndex: 1,
          explanation: 'Het hoofddoel is medewerkers bewust maken van security risico\'s en hen te leren hoe ze deze kunnen herkennen en voorkomen.',
          order: 0
        },
        {
          lessonId: lessons[0].id,
          prompt: 'Welke van de volgende is GEEN veelvoorkomend security risico?',
          answers: JSON.stringify([
            'Phishing emails',
            'Zwakke wachtwoorden',
            'Onbevoegde toegang tot kantoorruimtes',
            'Het gebruik van goedgekeurde software'
          ]),
          correctIndex: 3,
          explanation: 'Het gebruik van goedgekeurde software is juist een security best practice, geen risico.',
          order: 1
        },
        {
          lessonId: lessons[0].id,
          prompt: 'Security awareness is alleen de verantwoordelijkheid van de IT-afdeling.',
          answers: JSON.stringify(['Waar', 'Onwaar']),
          correctIndex: 1,
          explanation: 'Security awareness is de verantwoordelijkheid van elke medewerker in de organisatie.',
          order: 2
        }
      ]
    })

    // Quiz vragen voor Lesson 2: Phishing Herkenning
    await prisma.quizQuestion.createMany({
      data: [
        {
          lessonId: lessons[1].id,
          prompt: 'Welke kenmerken kunnen wijzen op een phishing email?',
          answers: JSON.stringify([
            'Persoonlijke aanhef met jouw correcte naam',
            'Dringende taal en tijdsdruk',
            'Officieel logo van het bedrijf',
            'Geen links of bijlagen'
          ]),
          correctIndex: 1,
          explanation: 'Phishing emails gebruiken vaak dringende taal om je onder druk te zetten snel te handelen zonder na te denken.',
          order: 0
        },
        {
          lessonId: lessons[1].id,
          prompt: 'Wat moet je doen als je een verdachte email ontvangt?',
          answers: JSON.stringify([
            'Direct verwijderen',
            'Klikken op links om te controleren of het legitiem is',
            'Reageren met persoonlijke informatie',
            'Melden bij de security afdeling en niet klikken op links'
          ]),
          correctIndex: 3,
          explanation: 'Verdachte emails moeten gemeld worden bij de security afdeling. Klik nooit op links of bijlagen in verdachte emails.',
          order: 1
        },
        {
          lessonId: lessons[1].id,
          prompt: 'Alle emails van bekende afzenders zijn altijd veilig.',
          answers: JSON.stringify(['Waar', 'Onwaar']),
          correctIndex: 1,
          explanation: 'Ook bekende afzenders kunnen gehackt zijn. Blijf altijd alert op verdachte inhoud, zelfs bij bekende afzenders.',
          order: 2
        }
      ]
    })

    // Quiz vragen voor Lesson 3: Wachtwoord Beveiliging
    await prisma.quizQuestion.createMany({
      data: [
        {
          lessonId: lessons[2].id,
          prompt: 'Wat maakt een wachtwoord sterk?',
          answers: JSON.stringify([
            'Korte, eenvoudige woorden',
            'Persoonlijke informatie zoals geboortedata',
            'Combinatie van hoofdletters, kleine letters, cijfers en symbolen',
            'Hetzelfde wachtwoord voor meerdere accounts'
          ]),
          correctIndex: 2,
          explanation: 'Sterke wachtwoorden bevatten een combinatie van verschillende soorten karakters en zijn minimaal 12 karakters lang.',
          order: 0
        },
        {
          lessonId: lessons[2].id,
          prompt: 'Hoe vaak moet je je wachtwoorden wijzigen volgens best practices?',
          answers: JSON.stringify([
            'Dagelijks',
            'Alleen wanneer er een security incident is geweest',
            'Regelmatig, maar niet te vaak zodat je ze gaat vergeten',
            'Nooit, als ze eenmaal sterk zijn'
          ]),
          correctIndex: 2,
          explanation: 'Wachtwoorden moeten regelmatig gewijzigd worden, maar niet zo vaak dat medewerkers ze gaan vergeten of op gaan schrijven.',
          order: 1
        },
        {
          lessonId: lessons[2].id,
          prompt: 'Het is veilig om wachtwoorden op te slaan in een browser.',
          answers: JSON.stringify(['Waar', 'Onwaar']),
          correctIndex: 1,
          explanation: 'Het is veiliger om een dedicated password manager te gebruiken dan wachtwoorden in browsers op te slaan.',
          order: 2
        }
      ]
    })

    // Quiz vragen voor Lesson 4: Social Engineering
    await prisma.quizQuestion.createMany({
      data: [
        {
          lessonId: lessons[3].id,
          prompt: 'Wat is een veelvoorkomend teken van social engineering?',
          answers: JSON.stringify([
            'Iemand die om officiële autorisatie vraagt',
            'Iemand die zich voordoet als iemand anders om vertrouwelijke informatie te krijgen',
            'Collega\'s die elkaar helpen met werkgerelateerde taken',
            'Standaard security procedures volgen'
          ]),
          correctIndex: 1,
          explanation: 'Social engineering houdt vaak in dat iemand zich voordoet als iemand anders om vertrouwelijke informatie te verkrijgen.',
          order: 0
        },
        {
          lessonId: lessons[3].id,
          prompt: 'Hoe moet je reageren op een onverwacht telefoontje van iemand die beweert van de IT-afdeling te zijn?',
          answers: JSON.stringify([
            'Direct meewerken en gevraagde informatie verstrekken',
            'Opbellen via het officiële telefoonnummer van de IT-afdeling om te verifiëren',
            'De beller confronteren en beschuldigen van social engineering',
            'Negeren en ophangen'
          ]),
          correctIndex: 1,
          explanation: 'Bel altijd terug via het officiële telefoonnummer om de identiteit van de beller te verifiëren voordat je informatie deelt.',
          order: 1
        },
        {
          lessonId: lessons[3].id,
          prompt: 'Social engineering aanvallen zijn alleen gericht op hooggeplaatste medewerkers.',
          answers: JSON.stringify(['Waar', 'Onwaar']),
          correctIndex: 1,
          explanation: 'Social engineering aanvallen kunnen gericht zijn op elke medewerker, ongeacht hun positie in het bedrijf.',
          order: 2
        }
      ]
    })
    console.log('✅ Quiz questions created')

    // 5. Maak 2 modules
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
          order: 1,
          orgId: org.id
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
          order: 2,
          orgId: org.id
        }
      })
    ])
    console.log('✅ 2 modules created')

    // 6. Koppel lessons aan modules
    await prisma.lessonOnModule.createMany({
      data: [
        { moduleId: modules[0].id, lessonId: lessons[0].id, order: 0 },
        { moduleId: modules[0].id, lessonId: lessons[1].id, order: 1 },
        { moduleId: modules[0].id, lessonId: lessons[2].id, order: 2 },
        { moduleId: modules[1].id, lessonId: lessons[3].id, order: 0 }
      ]
    })
    console.log('✅ Lessons connected to modules')

    // 7. Maak course
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

    // 8. Maak quiz attempts voor demo gebruiker
    console.log('🎯 Creating quiz attempts...')
    
    // Quiz attempt voor eerste lesson (voltooid)
    const quizAttempt1 = await prisma.quizAttempt.create({
      data: {
        userId: regularUser.id,
        lessonId: lessons[0].id,
        score: 3, // 3 correcte antwoorden
        passed: true,
        answers: JSON.stringify([
          { questionId: 1, answerIndex: 1, correct: true },
          { questionId: 2, answerIndex: 3, correct: true },
          { questionId: 3, answerIndex: 1, correct: true }
        ])
      }
    })

    // Quiz attempt voor tweede lesson (voltooid)
    const quizAttempt2 = await prisma.quizAttempt.create({
      data: {
        userId: regularUser.id,
        lessonId: lessons[1].id,
        score: 2, // 2 correcte antwoorden
        passed: true,
        answers: JSON.stringify([
          { questionId: 1, answerIndex: 1, correct: true },
          { questionId: 2, answerIndex: 3, correct: true },
          { questionId: 3, answerIndex: 0, correct: false }
        ])
      }
    })

    // Quiz attempt voor derde lesson (nog niet voltooid)
    const quizAttempt3 = await prisma.quizAttempt.create({
      data: {
        userId: regularUser.id,
        lessonId: lessons[2].id,
        score: 1, // 1 correct antwoord
        passed: false,
        answers: JSON.stringify([
          { questionId: 1, answerIndex: 2, correct: true },
          { questionId: 2, answerIndex: 0, correct: false },
          { questionId: 3, answerIndex: 0, correct: false }
        ])
      }
    })

    console.log('✅ Quiz attempts created')

    // 9. VOEG USER LESSON PROGRESS TOE
    console.log('📊 Creating user lesson progress...')
    
    await prisma.userLessonProgress.createMany({
      data: [
        // Demo gebruiker heeft eerste 2 lessons voltooid (inclusief quiz)
        {
          userId: regularUser.id,
          lessonId: lessons[0].id,
          completed: true
        },
        {
          userId: regularUser.id,
          lessonId: lessons[1].id, 
          completed: true
        },
        // Derde lesson is bezig (niet voltooid, quiz niet gehaald)
        {
          userId: regularUser.id,
          lessonId: lessons[2].id,
          completed: false
        },
        // Admin gebruiker heeft ook wat progress
        {
          userId: adminUser.id,
          lessonId: lessons[0].id,
          completed: true
        }
      ]
    })
    console.log('✅ User lesson progress created')

    // 10. Maak enrollment voor demo gebruiker
    await prisma.enrollment.create({
      data: {
        userId: regularUser.id,
        courseId: course.id
      }
    })
    console.log('✅ Enrollment created')

    // 11. Final counts
    const lessonCount = await prisma.lesson.count()
    const moduleCount = await prisma.module.count()
    const courseCount = await prisma.course.count()
    const userCount = await prisma.user.count()
    const progressCount = await prisma.userLessonProgress.count()
    const questionCount = await prisma.quizQuestion.count()
    const attemptCount = await prisma.quizAttempt.count()

    console.log('📊 Final database stats:')
    console.log('   Users:', userCount)
    console.log('   Lessons:', lessonCount)
    console.log('   Modules:', moduleCount) 
    console.log('   Courses:', courseCount)
    console.log('   Quiz Questions:', questionCount)
    console.log('   Quiz Attempts:', attemptCount)
    console.log('   Progress records:', progressCount)
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