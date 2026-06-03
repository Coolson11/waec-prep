import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Role } from "@prisma/client";

export async function getSession() {
  return await getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === Role.ADMIN || user?.role === Role.SUPER_ADMIN;
}

export async function isSuperAdmin() {
  const user = await getCurrentUser();
  return user?.role === Role.SUPER_ADMIN;
}
