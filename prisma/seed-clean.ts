import { PrismaClient, LessonType, UserRole, CourseStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting clean seed...')
  
  try {
    // 1. Maak organization
    const org = await prisma.organization.create({
      data: {
        name: 'Demo Bedrijf',
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

    // 3. Maak EEN course met PRECIES 4 lessons
    const course = await prisma.course.create({
      data: {
        title: 'Basis Cybersecurity',
        slug: 'basis-cybersecurity',
        description: 'Basis cybersecurity training',
        status: CourseStatus.PUBLISHED,
        orgId: org.id,
        modules: {
          create: [
            {
              title: 'Module 1 - Wachtwoorden',
              order: 1,
              lessons: {
                create: [
                  {
                    title: 'Introductie Wachtwoordbeveiliging',
                    description: 'Leer over sterke wachtwoorden',
                    type: LessonType.TEXT,
                    content: JSON.stringify({ text: 'Content hier...' }),
                    order: 1,
                    durationMinutes: 10,
                    status: 'PUBLISHED',
                    difficulty: 'beginner',
                    tags: JSON.stringify(['wachtwoord']),
                    category: 'Security Basics'
                  },
                  {
                    title: 'Two-factor authenticatie',
                    description: 'Uitleg over 2FA',
                    type: LessonType.TEXT,
                    content: JSON.stringify({ text: 'Content hier...' }),
                    order: 2,
                    durationMinutes: 8,
                    status: 'PUBLISHED',
                    difficulty: 'beginner',
                    tags: JSON.stringify(['2fa']),
                    category: 'Technical Security'
                  }
                ]
              }
            },
            {
              title: 'Module 2 - Phishing',
              order: 2,
              lessons: {
                create: [
                  {
                    title: 'Phishing herkennen',
                    description: 'Leer phishing herkennen',
                    type: LessonType.TEXT,
                    content: JSON.stringify({ text: 'Content hier...' }),
                    order: 1,
                    durationMinutes: 15,
                    status: 'PUBLISHED',
                    difficulty: 'beginner',
                    tags: JSON.stringify(['phishing']),
                    category: 'Security Basics'
                  },
                  {
                    title: 'CEO-fraude herkennen',
                    description: 'Leer CEO-fraude herkennen',
                    type: LessonType.TEXT,
                    content: JSON.stringify({ text: 'Content hier...' }),
                    order: 2,
                    durationMinutes: 12,
                    status: 'PUBLISHED',
                    difficulty: 'intermediate',
                    tags: JSON.stringify(['ceo-fraude']),
                    category: 'Advanced Security'
                  }
                ]
              }
            }
          ]
        }
      }
    })

    console.log('✅ Course created with 4 lessons')

    // 4. Check final counts
    const lessonCount = await prisma.lesson.count()
    const moduleCount = await prisma.module.count()
    const courseCount = await prisma.course.count()

    console.log('📊 Final counts:')
    console.log('   Courses:', courseCount)
    console.log('   Modules:', moduleCount)
    console.log('   Lessons:', lessonCount)
    console.log('🎉 Clean seeding completed!')
    
  } catch (error) {
    console.error('❌ SEED ERROR:', error)
    throw error
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())