"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  AlertCircle, 
  Loader2, 
  Filter, 
  RefreshCcw,
  BookOpen,
  Calendar,
  Layers,
  Archive
} from "lucide-react";
import { clsx } from "clsx";

interface Paper {
  id: string;
  title: string;
  subject: { name: string };
  year: number;
  paperType: string;
  cloudinaryUrl: string | null;
  paperCode: string;
  examBody: string;
}

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchPapers() {
      try {
        const res = await fetch("/api/papers");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch papers");
        }
        const data = await res.json();
        setPapers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPapers();
  }, []);

  const filteredPapers = papers.filter(paper => 
    paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.paperCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
        <Loader2 className="h-12 w-12 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">Curating Archive</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-rose-500/5 max-w-md"
        >
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Access Error</h2>
          <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
          >
            <RefreshCcw className="h-4 w-4" /> Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header & Search */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
            <Archive className="h-3 w-3" />
            Central Archive
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">Past Papers</h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl">
            Complete your preparation with verified questions from previous years.
          </p>
        </div>
        
        <div className="relative w-full lg:max-w-md group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search papers by subject or year..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
          />
        </div>
      </div>
      
      {/* Papers Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper, index) => (
              <motion.div 
                key={paper.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover-card flex flex-col group overflow-hidden"
              >
                <div className="p-8 flex-1 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest">
                        {paper.examBody}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full">
                      <Calendar className="h-3 w-3" />
                      {paper.year}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2 min-h-[3.5rem]">
                      {paper.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                        {paper.subject.name}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Layers className="h-3.5 w-3.5 text-indigo-500" />
                        {paper.paperType}
                      </div>
                    </div>
                  </div>

                  {!paper.cloudinaryUrl && (
                    <div className="p-3 bg-amber-50 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-100 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Digital Copy Pending
                    </div>
                  )}
                </div>
                
                <div className="px-8 pb-8 pt-2">
                  <div className="flex gap-3">
                    <Link 
                      href={`/papers/${paper.id}/preview`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-2xl hover:bg-indigo-100 transition-all group-hover:shadow-md"
                    >
                      <Eye className="h-4 w-4" /> Preview
                    </Link>
                    <button 
                      disabled={!paper.cloudinaryUrl}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 text-xs font-black uppercase tracking-widest text-white bg-indigo-600 rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none active:scale-95"
                    >
                      <Download className="h-4 w-4" /> Get PDF
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-24 text-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem]"
            >
              <div className="mx-auto w-24 h-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-slate-300 mb-6">
                <Search className="h-10 w-10" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">No Results Found</h3>
              <p className="mt-2 text-slate-500 font-medium max-w-sm mx-auto leading-relaxed px-6">
                We couldn&apos;t find any papers matching &ldquo;{searchQuery}&rdquo;. Try using different keywords or exploring by subject.
              </p>
              <button 
                onClick={() => setSearchQuery("")}
                className="mt-8 inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-[0.2em] hover:gap-4 transition-all"
              >
                Clear Search <RefreshCcw className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
