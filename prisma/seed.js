const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
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
