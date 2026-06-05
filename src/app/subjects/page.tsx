import { getFaculties } from "@/lib/data";
import Link from "next/link";
import { BookOpen, GraduationCap, ArrowRight, Library, Sparkles } from "lucide-react";

export default async function SubjectsPage() {
  const faculties = await getFaculties();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
          <Library className="h-3 w-3" />
          Resource Library
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Explore by <span className="text-indigo-600">Subject</span>
        </h1>
        <p className="text-slate-500 font-medium text-lg">
          Master every topic with our comprehensive collection of past papers organized by faculty.
        </p>
      </div>
      
      {/* Faculty Sections */}
      <div className="space-y-20">
        {faculties.map((faculty) => (
          <div key={faculty.id} className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 text-indigo-600">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{faculty.name}</h2>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{faculty.subjects.length} Subjects Available</p>
              </div>
              <div className="flex-grow border-t-2 border-slate-50 border-dashed" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {faculty.subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/subjects/${subject.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group relative bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover-card flex flex-col items-start overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-10 transition-opacity translate-x-4 group-hover:translate-x-0">
                    <Sparkles className="h-12 w-12 text-indigo-600" />
                  </div>
                  
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                    {subject.name}
                  </h3>
                  <p className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">{subject.code}</p>
                  
                  <div className="mt-8 flex items-center text-xs font-black text-indigo-600 uppercase tracking-widest group-hover:gap-2 transition-all">
                    Explore Papers <ArrowRight className="h-3 w-3" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
