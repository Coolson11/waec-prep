import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";

async function promoteUser(email: string, role: Role) {
  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role },
    });
    console.log(`User ${email} promoted to ${role}`);
    return user;
  } catch (error) {
    console.error(`Failed to promote user: ${error}`);
  }
}

// Example usage:
// promoteUser('admin@example.com', Role.ADMIN);
// promoteUser('superadmin@example.com', Role.SUPER_ADMIN);
