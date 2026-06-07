import prisma from "@/lib/prisma";

export async function getFaculties() {
  return await prisma.faculty.findMany({
    include: {
      subjects: true,
    },
  });
}

export async function getSubjects() {
  return await prisma.subject.findMany({
    include: {
      faculties: true,
    },
  });
}

export async function getAllPapers() {
  return await prisma.paper.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      subject: true,
    },
    orderBy: { year: 'desc' },
  });
}
