const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Seeding Faculties and Subjects
  const facultyNames = ['Science', 'Art', 'Commercial'];
  const facultyMap = {};

  for (const name of facultyNames) {
    const faculty = await prisma.faculty.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    facultyMap[name] = faculty.id;
  }

  const subjects = [
    // Shared subjects
    { name: 'Mathematics', code: 'SUBJ001', facultyNames: ['Science', 'Art', 'Commercial'] },
    { name: 'English Language', code: 'SUBJ002', facultyNames: ['Science', 'Art', 'Commercial'] },
    { name: 'Civic Education', code: 'SUBJ003', facultyNames: ['Science', 'Art', 'Commercial'] },
    
    // Science subjects
    { name: 'Biology', code: 'SUBJ004', facultyNames: ['Science'] },
    { name: 'Chemistry', code: 'SUBJ005', facultyNames: ['Science'] },
    { name: 'Physics', code: 'SUBJ006', facultyNames: ['Science'] },
    { name: 'Further Mathematics', code: 'SUBJ007', facultyNames: ['Science'] },
    
    // Art subjects
    { name: 'Literature in English', code: 'SUBJ008', facultyNames: ['Art'] },
    { name: 'Government', code: 'SUBJ009', facultyNames: ['Art'] },
    { name: 'History', code: 'SUBJ010', facultyNames: ['Art'] },
    { name: 'CRS', code: 'SUBJ011', facultyNames: ['Art'] },
    
    // Commercial subjects
    { name: 'Financial Accounting', code: 'SUBJ012', facultyNames: ['Commercial'] },
    { name: 'Commerce', code: 'SUBJ013', facultyNames: ['Commercial'] },
    { name: 'Economics', code: 'SUBJ014', facultyNames: ['Commercial', 'Art'] },
  ];

  for (const s of subjects) {
    await prisma.subject.upsert({
      where: { code: s.code },
      update: { 
        name: s.name,
        faculties: {
          set: s.facultyNames.map(fname => ({ id: facultyMap[fname] }))
        }
      },
      create: {
        name: s.name,
        code: s.code,
        faculties: {
          connect: s.facultyNames.map(fname => ({ id: facultyMap[fname] }))
        }
      },
    });
  }

  // Seeding Super Admin and Admin
  const seedUsers = async () => {
    const users = [
      {
        email: process.env.SUPER_ADMIN_EMAIL,
        password: process.env.SUPER_ADMIN_PASSWORD,
        role: 'SUPER_ADMIN',
        name: 'Super Admin'
      },
      {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'ADMIN',
        name: 'Admin User'
      }
    ];

    for (const user of users) {
      if (!user.email || !user.password) {
        console.warn(`Skipping user seeding for ${user.role} due to missing credentials.`);
        continue;
      }
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await prisma.user.upsert({
        where: { email: user.email },
        update: { password: hashedPassword, role: user.role, name: user.name },
        create: { email: user.email, password: hashedPassword, role: user.role, name: user.name },
      });
      console.log(`Seeded user: ${user.email} as ${user.role}`);
    }
  };

  await seedUsers();

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
