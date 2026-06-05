"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/admin/topbar";

export function SuperAdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        <main className="p-4 sm:p-8">{children}</main>
      </div>
    </div>
  );
}
