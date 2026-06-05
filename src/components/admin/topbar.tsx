"use client";

import { useSession } from "next-auth/react";
import { Menu } from "lucide-react";

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
        >
          <Menu className="h-6 w-6" />
        </button>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">System Overview</h2>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:inline text-sm font-bold text-slate-600">{session?.user?.name}</span>
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-black text-indigo-700">
          {session?.user?.name?.charAt(0) || "A"}
        </div>
      </div>
    </header>
  );
}
