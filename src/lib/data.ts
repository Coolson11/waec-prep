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
      faculty: true,
    },
  });
}
