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

export async function getDashboardStats() {
  const totalPapers = await prisma.paper.count({
    where: { status: 'PUBLISHED' }
  });
  
  const totalSubjects = await prisma.subject.count();

  return {
    totalPapers,
    totalSubjects
  };
}

export async function getRecentActivity(userId: string) {
  const [views, downloads] = await Promise.all([
    prisma.view.findMany({
      where: { userId },
      include: { paper: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.download.findMany({
      where: { userId },
      include: { paper: true },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  ]);

  const activities = [
    ...views.map(v => ({
      id: v.id,
      type: 'view',
      title: v.paper.title,
      paperId: v.paperId,
      createdAt: v.createdAt,
    })),
    ...downloads.map(d => ({
      id: d.id,
      type: 'download',
      title: d.paper.title,
      paperId: d.paperId,
      createdAt: d.createdAt,
    }))
  ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
   .slice(0, 5);

  return activities;
}
