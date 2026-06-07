import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { checkPreviewAccess } from "@/lib/actions/preview";
import Link from "next/link";
import Image from "next/image";
import { PreviewTracker } from "@/components/providers/preview-tracker";
import { 
  ArrowLeft, 
  Lock, 
  ChevronRight, 
  Download, 
  Maximize, 
  BookOpen, 
  Calendar, 
  Layers, 
  ShieldCheck,
  Star,
  Zap,
  Info
} from "lucide-react";
import { clsx } from "clsx";

export default async function PaperPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const paper = await prisma.paper.findUnique({
    where: { id: resolvedParams.id },
    include: { subject: true }
  });

  if (!paper || !paper.subject) {
    notFound();
  }

  const access = await checkPreviewAccess();

  // If blocked, show the "Limit Reached" UI
  if (access.mode === "blocked") {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white">
        <div className="bg-white/80 backdrop-blur-xl p-12 rounded-[3rem] border border-white shadow-2xl shadow-indigo-500/10 max-w-lg text-center space-y-8">
          <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
            <Lock className="h-10 w-10 text-amber-600" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Access Locked</h2>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              You&apos;ve used all <span className="text-indigo-600 font-black">{access.count}</span> free guest previews. 
              Join thousands of students getting full access every day.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <Link 
              href="/auth/signup" 
              className="group flex items-center justify-center gap-3 px-8 py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-[0.98]"
            >
              Create Free Account <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/auth/signin" 
              className="px-8 py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black text-sm uppercase tracking-widest border-2 border-indigo-50 hover:bg-indigo-50 transition-all"
            >
              Existing Member? Sign In
            </Link>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Unlimited access starts here</p>
        </div>
      </div>
    );
  }

  // URL Logic:
  const rawUrl = paper.cloudinaryUrl || "";
  let isImagePreview = false;
  let displayUrl = "";

  const isRawResource = rawUrl.includes("/raw/upload/");

  if (access.mode === "first-page-only") {
    if (isRawResource) {
      isImagePreview = false;
      displayUrl = rawUrl;
    } else {
      isImagePreview = true;
      displayUrl = rawUrl.replace("/upload/", "/upload/f_jpg,pg_1,w_1200,c_limit,q_auto:best/").replace(".pdf", ".jpg");
    }
  } else {
    displayUrl = rawUrl;
    const baseUrl = displayUrl.split('#')[0];
    displayUrl = `${baseUrl}#toolbar=0&navpanes=0&scrollbar=1`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <PreviewTracker paperId={paper.id} />
      
      {/* Header & Breadcrumbs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-4">
          <Link 
            href={`/subjects/${paper.subject.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors group"
          >
            <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> Back to {paper.subject.name}
          </Link>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-indigo-600 shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{paper.title}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-widest">
                    <Calendar className="h-3 w-3" /> {paper.year} Edition
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-black bg-slate-50 text-slate-500 px-2.5 py-1 rounded-full border border-slate-100 uppercase tracking-widest">
                    <Layers className="h-3 w-3" /> {paper.paperType}
                  </span>
                </div>
              </div>
          </div>
        </div>

        {access.mode === "first-page-only" && (
          <div className="flex items-center gap-4 px-6 py-4 bg-amber-50 rounded-3xl border border-amber-100">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Guest Access Mode</p>
              <p className="text-sm font-bold text-amber-900 leading-none">{access.count}/5 Previews Used</p>
            </div>
            <div className="w-px h-8 bg-amber-200" />
            <Link href="/auth/signup" className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700">
              Upgrade Now
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Viewer Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border-[12px] border-slate-800 h-[50vh] lg:h-[900px] relative flex items-center justify-center">
            {isImagePreview ? (
              <div className="w-full h-full overflow-y-auto bg-slate-100 p-8 custom-scrollbar">
                <Image 
                  src={displayUrl} 
                  alt={`${paper.title} - First Page Preview`} 
                  width={800}
                  height={1000}
                  className="w-full max-w-3xl mx-auto shadow-2xl rounded-sm"
                />
                <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-slate-900 via-slate-900/95 to-transparent flex flex-col items-center justify-end pb-16 px-6 text-center">
                  <div className="bg-indigo-600 p-3 rounded-2xl mb-6 shadow-lg shadow-indigo-500/20">
                    <Lock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-black text-2xl mb-3 tracking-tight">Full Paper is Locked</h3>
                  <p className="text-slate-400 font-medium mb-8 max-w-md">
                    Join our learning community to access all pages, detailed solutions, and high-quality PDF downloads.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                    <Link href="/auth/signup" className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95">
                      Get Full Access
                    </Link>
                    <Link href="/auth/signin" className="flex-1 px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95">
                      Sign In
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-white relative">
                <iframe 
                  src={displayUrl} 
                  className="w-full h-full border-none"
                  title={paper.title}
                />
                <div className="absolute top-6 right-6 flex gap-3">
                   <a 
                    href={rawUrl} 
                    download={`${paper.title}.pdf`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3.5 rounded-2xl shadow-2xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
                   <a 
                    href={rawUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-slate-900/80 backdrop-blur-md hover:bg-slate-900 text-white p-3.5 rounded-2xl shadow-2xl transition-all flex items-center justify-center hover:scale-105 active:scale-95 border border-white/10"
                  >
                    <Maximize className="h-4 w-4" />
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 flex items-start gap-4">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
              <Info className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Study Tip</p>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Take this paper under timed conditions to simulate the real exam environment. Focus on the most frequent topics first.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Examination Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Exam Body</span>
                <span className="text-sm font-black text-slate-900">{paper.examBody}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject</span>
                <span className="text-sm font-black text-slate-900">{paper.subject.name}</span>
              </div>
              <div className="flex justify-between items-center py-4 border-b border-slate-50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Year</span>
                <span className="text-sm font-black text-slate-900">{paper.year} Edition</span>
              </div>
              <div className="flex justify-between items-center py-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="h-3 w-3" /> Verified
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Star className="w-24 h-24" />
            </div>
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                <Zap className="h-3 w-3 fill-current" /> Premium Feature
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-black tracking-tight leading-tight">
                  {access.mode === "full" ? "Maximize Learning" : "Unlock the Full Document"}
                </h3>
                <p className="text-indigo-100 text-sm font-medium leading-relaxed">
                  {access.mode === "full" 
                    ? "Get step-by-step video solutions and expert breakdowns for every question in this paper."
                    : "Experience the platform with no limits. High-speed downloads, printing access, and ad-free study."}
                </p>
              </div>
              
              <div className="pt-2">
                {access.mode === "full" ? (
                  <Link 
                    href="/pricing"
                    className="block w-full text-center py-4 bg-white text-indigo-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-50 transition-all shadow-xl active:scale-[0.98]"
                  >
                    Explore Solutions
                  </Link>
                ) : (
                  <Link 
                    href="/auth/signup"
                    className="block w-full text-center py-4 bg-white text-indigo-600 font-black text-xs uppercase tracking-widest rounded-2xl hover:bg-indigo-50 transition-all shadow-xl active:scale-[0.98]"
                  >
                    Go Premium Free
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
