// prisma/seed.ts - VEREENVOUDIGDE VERSIE
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Cleanup bestaande data
  await prisma.enrollment.deleteMany()
  await prisma.lesson.deleteMany()
  await prisma.module.deleteMany()
  await prisma.course.deleteMany()
  await prisma.user.deleteMany()
  await prisma.tenant.deleteMany()

  // Maak een demo tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Demo Organisatie',
      slug: 'demo-organisatie',
    },
  })

  // Maak demo user
  const user = await prisma.user.create({
    data: {
      email: 'admin@secaca.nl',
      tenantId: tenant.id,
      role: 'ADMIN',
    },
  })

  // Maak demo courses
  const phishingCourse = await prisma.course.create({
    data: {
      title: 'Phishing Herkenning Basis',
      description: 'Leer phishing emails herkennen en voorkom cyberaanvallen',
      price: 49.99,
      isPublished: true,
      tenantId: tenant.id,
    },
  })

  const passwordCourse = await prisma.course.create({
    data: {
      title: 'Wachtwoord Beveiliging',
      description: 'Best practices voor sterke wachtwoorden en password managers',
      price: 29.99,
      isPublished: true,
      tenantId: tenant.id,
    },
  })

  // Maak een enrollment (gebruiker ingeschreven voor cursus)
  await prisma.enrollment.create({
    data: {
      userId: user.id,
      courseId: phishingCourse.id,
      status: 'ACTIVE',
      progress: 25,
    },
  })

  console.log('✅ Database seeded successfully!')
  console.log(`📊 Tenant: ${tenant.name}`)
  console.log(`👤 User: ${user.email}`)
  console.log(`📚 Courses: ${phishingCourse.title}, ${passwordCourse.title}`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })