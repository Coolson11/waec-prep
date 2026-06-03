const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAdmin() {
  const email = 'admin@example.com';
  const user = await prisma.user.findUnique({
    where: { email },
    select: { email: true, role: true, password: true }
  });

  if (user) {
    console.log('User found:', user.email);
    console.log('Role:', user.role);
    console.log('Has password:', !!user.password);
  } else {
    console.log('User not found:', email);
  }
  await prisma.$disconnect();
}

checkAdmin();
