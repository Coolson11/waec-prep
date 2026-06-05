const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Seeding Faculties and Subjects
  const faculties = [
    {
      name: 'Science',
      subjects: [
        'Mathematics', 'English Language', 'Biology', 'Chemistry', 'Physics',
        'Further Mathematics', 'Agricultural Science', 'Geography', 'Technical Drawing',
        'Computer Studies', 'Data Processing', 'Animal Husbandry', 'Health Science'
      ]
    },
    {
      name: 'Art',
      subjects: [
        'Literature in English', 'Government', 'History', 'CRS', 'IRS',
        'French', 'Music', 'Visual Arts', 'Yoruba', 'Civic Education',
        'Economics', 'Social Studies', 'Dyeing & Bleaching'
      ]
    },
    {
      name: 'Commercial',
      subjects: [
        'Financial Accounting', 'Commerce', 'Office Practice', 'Insurance',
        'Store Management', 'Marketing', 'Typewriting', 'Shorthand',
        'Business Management', 'Book Keeping', 'Salesmanship', 'Auto Mechanics', 'Building Construction'
      ]
    }
  ];

  let subjectCount = 1;

  for (const f of faculties) {
    const faculty = await prisma.faculty.upsert({
      where: { name: f.name },
      update: {},
      create: { name: f.name },
    });

    for (const s of f.subjects) {
      const code = `SUBJ${String(subjectCount).padStart(3, '0')}`;
      await prisma.subject.upsert({
        where: { code: code },
        update: { name: s, facultyId: faculty.id },
        create: {
          name: s,
          code: code,
          facultyId: faculty.id,
        },
      });
      subjectCount++;
    }
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
