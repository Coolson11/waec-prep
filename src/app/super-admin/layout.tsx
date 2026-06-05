import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { SuperAdminLayoutWrapper } from "./layout-wrapper";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== Role.SUPER_ADMIN) {
    redirect("/"); // Redirect unauthorized users
  }

  return <SuperAdminLayoutWrapper>{children}</SuperAdminLayoutWrapper>;
}
