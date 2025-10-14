const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    console.log('Testing database...')
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database works:', result)
  } catch (error) {
    console.log('❌ Database error:', error.message)
  }
}
test()
