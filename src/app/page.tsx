import { getSession } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BookOpen, Search, Smartphone, Award, ArrowRight, CheckCircle2, Star } from "lucide-react";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 animate-fade-in">
              <Star className="h-3 w-3 fill-current" />
              The #1 WAEC Prep Platform
            </div>
            
            <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl leading-[1.1]">
              Master Your Exams with <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">Precision</span>
            </h1>
            
            <p className="text-lg sm:text-xl leading-relaxed text-slate-500 font-medium max-w-2xl mx-auto">
              Access thousands of verified WAEC past papers, organized by faculty and year. 
              The most polished prep experience for the modern student.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-10 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                Start Learning Now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/papers" 
                className="w-full sm:w-auto px-10 py-4 bg-white text-slate-700 rounded-[1.5rem] font-black text-sm uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              >
                Browse Papers
              </Link>
            </div>

            <div className="pt-10 flex flex-wrap justify-center gap-8 text-slate-400 font-bold text-xs uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> 10k+ Questions
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Verified Solutions
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Offline Access
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-indigo-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-violet-100 rounded-full blur-3xl opacity-50" />
      </section>
      
      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-sm font-black text-indigo-600 uppercase tracking-[0.2em]">Why Choose Us</h2>
            <p className="text-3xl font-black text-slate-900 tracking-tight sm:text-4xl">Built for Student Success</p>
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            <div className="group p-10 bg-slate-50 rounded-[3rem] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                <Search className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Smart Archive</h3>
              <p className="mt-4 text-slate-500 font-medium leading-relaxed">
                Find any paper in seconds with our advanced filtering system. Search by year, subject, or paper type.
              </p>
            </div>

            <div className="group p-10 bg-slate-50 rounded-[3rem] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                <Smartphone className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Seamlessly Mobile</h3>
              <p className="mt-4 text-slate-500 font-medium leading-relaxed">
                Study anywhere, anytime. Our platform is fully optimized for mobile devices, tablets, and desktops.
              </p>
            </div>

            <div className="group p-10 bg-slate-50 rounded-[3rem] border border-transparent hover:border-indigo-100 hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500">
              <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center mb-8 shadow-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500">
                <Award className="h-8 w-8 text-indigo-600 group-hover:text-white transition-colors duration-500" />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Expert Solutions</h3>
              <p className="mt-4 text-slate-500 font-medium leading-relaxed">
                Master the "why" behind every answer with clear explanations and step-by-step verified solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-20 bg-indigo-600 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-20 opacity-10">
          <BookOpen className="w-96 h-96 text-white -rotate-12" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl font-black text-white sm:text-4xl mb-10 tracking-tight">
            Ready to ace your exams?
          </h2>
          <Link
            href="/auth/signup"
            className="inline-flex items-center px-12 py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-50 shadow-2xl transition-all active:scale-95"
          >
            Create Your Free Account <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <p className="mt-6 text-indigo-100 font-bold text-sm tracking-wide">
            Join 5,000+ students already preparing with WAEC Prep
          </p>
        </div>
      </section>
    </div>
  );
}
