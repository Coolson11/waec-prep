"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

async function verifySuperAdmin() {
  const session = await getSession();
  if (!session || session.user.role !== Role.SUPER_ADMIN) {
    throw new Error("Unauthorized");
  }
}

// Helper for Audit Logs
async function createAuditLog(action: string, userId: string, details?: any) {
  const session = await getSession();
  await prisma.auditLog.create({
    data: {
      action,
      userId: session!.user.id,
      details: { targetUserId: userId, ...details }
    }
  });
}

// Admin Management
export async function createAdmin(data: { name: string; email: string; password: string }) {
  await verifySuperAdmin();
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const admin = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: Role.ADMIN
    }
  });
  await createAuditLog("ADMIN_CREATED", admin.id, { email: data.email });
  revalidatePath("/super-admin/admins");
}

export async function updateAdmin(id: string, data: { name: string; email: string }) {
  await verifySuperAdmin();
  const updatedAdmin = await prisma.user.update({
    where: { id },
    data: { name: data.name, email: data.email }
  });
  await createAuditLog("ADMIN_UPDATED", id);
  revalidatePath("/super-admin/admins");
}

export async function deleteAdmin(id: string) {
  await verifySuperAdmin();
  const user = await prisma.user.findUnique({ where: { id } });
  if (user?.role === Role.SUPER_ADMIN) throw new Error("Cannot delete SUPER_ADMIN");
  
  await prisma.user.delete({ where: { id } });
  await createAuditLog("ADMIN_DELETED", id);
  revalidatePath("/super-admin/admins");
}

export async function promoteToAdmin(userId: string) {
  await verifySuperAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role: Role.ADMIN } });
  await createAuditLog("USER_PROMOTED_TO_ADMIN", userId);
  revalidatePath("/super-admin/users");
  revalidatePath("/super-admin/admins");
}

export async function demoteToStudent(userId: string) {
  await verifySuperAdmin();
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user?.role === Role.SUPER_ADMIN) throw new Error("Cannot demote SUPER_ADMIN");
  
  await prisma.user.update({ where: { id: userId }, data: { role: Role.STUDENT } });
  await createAuditLog("ADMIN_DEMOTED_TO_STUDENT", userId);
  revalidatePath("/super-admin/users");
  revalidatePath("/super-admin/admins");
}

export async function getUsers() {
  await verifySuperAdmin();
  return await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { subscriptions: true }
  });
}

export async function getAdmins() {
  await verifySuperAdmin();
  return await prisma.user.findMany({
    where: { role: Role.ADMIN },
    orderBy: { createdAt: "desc" }
  });
}

export async function removeAdminRole(userId: string) {
  await verifySuperAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { role: Role.STUDENT },
  });
  revalidatePath("/super-admin/admins");
}

export async function updateUserRole(userId: string, role: Role) {
  await verifySuperAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  revalidatePath("/super-admin/users");
}

export async function toggleSuspension(userId: string, suspended: boolean) {
  await verifySuperAdmin();
  await prisma.user.update({
    where: { id: userId },
    data: { suspended },
  });
  revalidatePath("/super-admin/users");
}

export async function deleteUser(userId: string) {
  await verifySuperAdmin();
  await prisma.user.delete({
    where: { id: userId },
  });
  revalidatePath("/super-admin/users");
}

// Faculties
export async function getFaculties() {
  await verifySuperAdmin();
  return await prisma.faculty.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { subjects: true, users: true } } }
  });
}

export async function createFaculty(name: string) {
  await verifySuperAdmin();
  await prisma.faculty.create({ data: { name } });
  revalidatePath("/super-admin/faculties");
}

export async function updateFaculty(id: string, name: string) {
  await verifySuperAdmin();
  await prisma.faculty.update({
    where: { id },
    data: { name }
  });
  revalidatePath("/super-admin/faculties");
}

export async function deleteFaculty(id: string) {
  await verifySuperAdmin();
  const faculty = await prisma.faculty.findUnique({
    where: { id },
    include: { _count: { select: { subjects: true } } }
  });

  if (!faculty) throw new Error("Faculty not found");
  if (faculty._count.subjects > 0) {
    throw new Error("Cannot delete faculty: it has associated subjects. Please remove or reassign them first.");
  }

  await prisma.faculty.delete({ where: { id } });
  revalidatePath("/super-admin/faculties");
}


// Subjects
export async function getSubjects() {
  await verifySuperAdmin();
  return await prisma.subject.findMany({
    orderBy: { code: "asc" },
    include: { faculty: true }
  });
}

export async function createSubject(data: { name: string; code: string; facultyId: string }) {
  await verifySuperAdmin();
  await prisma.subject.create({ data });
  revalidatePath("/super-admin/subjects");
}

export async function updateSubject(id: string, data: { name: string; code: string; facultyId: string }) {
  await verifySuperAdmin();
  await prisma.subject.update({
    where: { id },
    data
  });
  revalidatePath("/super-admin/subjects");
}

export async function deleteSubject(id: string) {
  await verifySuperAdmin();
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: { _count: { select: { papers: true, selectedByUsers: true } } }
  });

  if (!subject) throw new Error("Subject not found");
  if (subject._count.papers > 0 || subject._count.selectedByUsers > 0) {
    throw new Error("Cannot delete subject: it has linked papers or users.");
  }

  await prisma.subject.delete({ where: { id } });
  revalidatePath("/super-admin/subjects");
}




// Papers
export async function getPapers() {
  await verifySuperAdmin();
  return await prisma.paper.findMany({
    orderBy: { createdAt: "desc" },
    include: { subject: true }
  });
}

export async function deletePaper(id: string) {
  await verifySuperAdmin();
  await prisma.paper.delete({ where: { id } });
  revalidatePath("/super-admin/papers");
}


// Subscriptions
export async function getSubscriptions() {
  await verifySuperAdmin();
  return await prisma.subscription.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true }
  });
}

export async function cancelSubscription(id: string) {
  await verifySuperAdmin();
  await prisma.subscription.update({
    where: { id },
    data: { isActive: false }
  });
  revalidatePath("/super-admin/subscriptions");
}

// Analytics
export async function getAnalytics() {
  await verifySuperAdmin();
  const downloads = await prisma.download.count();
  const views = await prisma.view.count();
  const users = await prisma.user.count();
  return { downloads, views, users };
}

// Audit Logs
export async function getAuditLogs() {
  await verifySuperAdmin();
  return await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 50
  });
}
