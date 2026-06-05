import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Calendar, Layers, Archive, ArrowLeft, Eye, Download, Sparkles, AlertCircle } from "lucide-react";

export default async function SubjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.slug) {
    notFound();
  }

  const subjectName = resolvedParams.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const subject = await prisma.subject.findFirst({
    where: { 
      name: {
        equals: subjectName,
        mode: 'insensitive'
      }
    },
    include: {
      papers: {
        where: { status: 'PUBLISHED' },
        orderBy: { year: 'desc' },
        include: {
          subject: true
        }
      }
    }
  });

  if (!subject) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Breadcrumbs & Header */}
      <div className="space-y-6">
        <Link 
          href="/subjects" 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Subjects
        </Link>
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
              <BookOpen className="h-3.5 w-3.5" />
              Subject Hub
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">{subject.name}</h1>
            <p className="text-slate-500 font-medium text-lg max-w-xl">
              Access and study verified {subject.name} past papers from previous years.
            </p>
          </div>
          
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Code</p>
              <p className="text-sm font-black text-slate-900 mt-1">{subject.code}</p>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Papers</p>
              <p className="text-sm font-black text-slate-900 mt-1">{subject.papers.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Papers Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {subject.papers.length > 0 ? (
          subject.papers.map((paper) => (
            <div key={paper.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover-card flex flex-col group overflow-hidden">
              <div className="p-8 flex-1 space-y-6">
                <div className="flex justify-between items-start">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest">
                    {paper.examBody}
                  </span>
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
            </div>
          ))
        ) : (
          <div className="col-span-full py-24 text-center bg-slate-50 border-4 border-dashed border-slate-200 rounded-[3rem]">
            <div className="mx-auto w-24 h-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center text-slate-300 mb-6">
              <Archive className="h-10 w-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Empty Archive</h3>
            <p className="mt-2 text-slate-500 font-medium max-w-sm mx-auto leading-relaxed px-6">
              We haven&apos;t added any papers for {subject.name} yet. Check back soon or request a paper through our support.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
