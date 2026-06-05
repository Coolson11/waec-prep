"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { uploadPaper } from "@/lib/actions/paper";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudUpload, 
  FileText, 
  BookOpen, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X,
  Plus
} from "lucide-react";
import { clsx } from "clsx";

export default function AdminUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subjects, setSubjects] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
    
    fetch("/api/subjects")
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(err => console.error("Failed to fetch subjects", err));
  }, [status]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Verifying Credentials</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      await uploadPaper(formData);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="space-y-4 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
          <CloudUpload className="h-3.5 w-3.5" />
          Content Repository
        </div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Upload Past Paper</h1>
        <p className="text-slate-500 font-medium text-lg">
          Add new study materials to the WAEC Prep archive.
        </p>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-[1.5rem] text-sm font-bold flex items-center gap-3"
          >
            <AlertCircle className="h-5 w-5" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="bg-white p-8 sm:p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Title */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest ml-1">
                <FileText className="h-4 w-4 text-indigo-500" />
                Paper Title
              </label>
              <input 
                name="title"
                type="text" 
                placeholder="e.g. Mathematics Paper 1 2023" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder-slate-300"
                required
              />
            </div>
            
            {/* Subject */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest ml-1">
                <BookOpen className="h-4 w-4 text-indigo-500" />
                Subject Area
              </label>
              <div className="relative">
                <select 
                  name="subjectId" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>{subject.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Plus className="h-4 w-4 text-slate-400 rotate-45" />
                </div>
              </div>
            </div>
            
            {/* Year */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest ml-1">
                <Calendar className="h-4 w-4 text-indigo-500" />
                Examination Year
              </label>
              <input 
                name="year"
                type="number" 
                defaultValue={new Date().getFullYear()} 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 placeholder-slate-300"
                required
              />
            </div>
            
            {/* Type */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest ml-1">
                <Layers className="h-4 w-4 text-indigo-500" />
                Paper Category
              </label>
              <div className="relative">
                <select 
                  name="paperType" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                >
                  <option value="Paper 1">Paper 1 (Objectives)</option>
                  <option value="Paper 2">Paper 2 (Theory)</option>
                  <option value="Paper 3">Paper 3 (Practical)</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Plus className="h-4 w-4 text-slate-400 rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-black text-slate-400 uppercase tracking-widest ml-1">
              <CloudUpload className="h-4 w-4 text-indigo-500" />
              Document Upload (PDF)
            </label>
            <div 
              className={clsx(
                "relative h-48 rounded-[2rem] border-4 border-dashed transition-all flex flex-col items-center justify-center space-y-3 p-6 group",
                dragActive ? "border-indigo-600 bg-indigo-50/50" : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-200"
              )}
            >
              <input 
                name="file"
                type="file" 
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDrop={() => setDragActive(false)}
                required
              />
              
              <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                {fileName ? (
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                ) : (
                  <FileText className="h-8 w-8 text-slate-300" />
                )}
              </div>
              
              <div className="text-center">
                <p className="text-sm font-black text-slate-900 uppercase tracking-widest">
                  {fileName || "Drag & Drop or Click to Upload"}
                </p>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                  Maximum file size: 20MB
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end items-center gap-6 p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100">
          <p className="text-xs font-bold text-slate-400 text-center sm:text-left">
            By clicking &ldquo;Upload & Publish&rdquo;, you confirm that this document is accurate and verified for student use.
          </p>
          <div className="flex gap-4 w-full sm:w-auto">
            <button 
              type="button" 
              onClick={() => router.back()}
              className="flex-1 sm:flex-none px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 sm:flex-none inline-flex items-center justify-center px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Upload & Publish <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
