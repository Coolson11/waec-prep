"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function getFaculties() {
  return await prisma.faculty.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getSubjectsByFaculty(facultyId: string) {
  return await prisma.subject.findMany({
    where: {
      faculties: {
        some: {
          id: facultyId,
        },
      },
    },
    orderBy: { name: "asc" },
  });
}

export async function completeProfile(facultyId: string, subjectIds: string[]) {
  const session = await getSession();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  if (subjectIds.length === 0) {
    return { error: "Please select at least one subject." };
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        facultyId,
        profileCompleted: true,
        selectedSubjects: {
          set: subjectIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/profile");
    
    return { success: true };
  } catch (error) {
    console.error("Complete profile error:", error);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function updatePreferences(facultyId: string, subjectIds: string[]) {
  // Re-use completeProfile logic for updating preferences
  return await completeProfile(facultyId, subjectIds);
}

export async function getUserPreferences() {
  const session = await getSession();

  if (!session?.user?.id) {
    return null;
  }

  return await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      faculty: true,
      selectedSubjects: true,
    },
  });
}
