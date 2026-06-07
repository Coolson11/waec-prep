"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function DashboardSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/papers?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="mt-6 flex gap-3 p-1.5 bg-slate-50 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
      <input 
        type="text" 
        placeholder="e.g. Mathematics 2023 Theory..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="bg-transparent border-none focus:ring-0 text-sm px-4 w-full text-slate-900 placeholder-slate-400 font-medium" 
      />
      <button type="submit" className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
        Search
      </button>
    </form>
  );
}
