"use client";

import { useState } from "react";
import { Sidebar } from "@/components/admin/sidebar";
import { TopBar } from "@/components/admin/topbar";

export function SuperAdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar container with fixed height/overflow handling */}
      <div className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 overflow-y-auto">
        <Sidebar isOpen={true} onClose={() => {}} />
      </div>
      
      {/* Mobile sidebar (managed by sidebar component) */}
      <div className="md:hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Sticky TopBar */}
        <div className="sticky top-0 z-30">
          <TopBar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
        <main className="p-4 sm:p-8 flex-grow">{children}</main>
      </div>
    </div>
  );
}

