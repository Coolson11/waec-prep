"use client";

import { useSession } from "next-auth/react";

export function TopBar() {
  const { data: session } = useSession();

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
      <h2 className="text-lg font-black text-slate-900 tracking-tight">System Overview</h2>
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-slate-600">{session?.user?.name}</span>
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center font-black text-indigo-700">
          {session?.user?.name?.charAt(0) || "A"}
        </div>
      </div>
    </header>
  );
}
