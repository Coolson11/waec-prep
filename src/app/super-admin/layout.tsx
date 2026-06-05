import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/admin/topbar";

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session || session.user.role !== Role.SUPER_ADMIN) {
    redirect("/"); // Redirect unauthorized users
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
