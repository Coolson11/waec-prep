import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";
import { 
  BookOpen, 
  FileText, 
  Search, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  Sparkles,
  ShieldCheck,
  Plus
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  // Redirect Super Admin to their dashboard
  if (session.user.role === Role.SUPER_ADMIN) {
    redirect("/super-admin");
  }

  // Redirect Admin to their dashboard
  if (session.user.role === Role.ADMIN) {
    redirect("/admin/upload");
  }

  if (!session.user.profileCompleted) {
    redirect("/complete-profile");
  }

  const stats = [
    { name: "Total Papers", value: "150+", icon: FileText, color: "text-blue-600", bg: "bg-blue-100" },
    { name: "Subjects", value: "12", icon: BookOpen, color: "text-indigo-600", bg: "bg-indigo-100" },
    { name: "Prep Score", value: "85%", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
    { name: "Study Streak", value: "5 Days", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {session.user?.name?.split(' ')[0]}! <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="mt-1 text-slate-500 font-medium">
            Ready to conquer your WAEC exams today?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link 
            href="/papers" 
            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95"
          >
            Practice Now <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover-card">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.name}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Search Section */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Search className="w-32 h-32 text-indigo-600 -rotate-12" />
            </div>
            <div className="relative">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <Search className="h-5 w-5 text-indigo-600" />
                Quick Paper Search
              </h2>
              <p className="mt-1 text-slate-500 text-sm font-medium">
                Find exactly what you need in seconds
              </p>
              <div className="mt-6 flex gap-3 p-1.5 bg-slate-50 rounded-2xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <input 
                  type="text" 
                  placeholder="e.g. Mathematics 2023 Theory..." 
                  className="bg-transparent border-none focus:ring-0 text-sm px-4 w-full text-slate-900 placeholder-slate-400 font-medium" 
                />
                <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Activity Section Placeholder */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 ml-1">
              <Clock className="h-5 w-5 text-indigo-600" />
              Recent Activity
            </h3>
            <div className="bg-white rounded-3xl border border-slate-100 divide-y divide-slate-50 overflow-hidden shadow-sm">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Mathematics Paper 1 (2022)</p>
                      <p className="text-xs font-medium text-slate-500">Viewed 2 hours ago</p>
                    </div>
                  </div>
                  <button className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity p-2">
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Study Plan Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
              <Sparkles className="w-24 h-24" />
            </div>
            <div className="relative">
              <h2 className="text-xl font-bold flex items-center gap-2">
                My Subjects
              </h2>
              <p className="mt-2 text-indigo-100 text-sm font-medium leading-relaxed">
                Manage your selected 7-9 subjects and track your progress in each.
              </p>
              <Link 
                href="/profile" 
                className="mt-6 inline-flex items-center text-sm font-bold bg-white/20 backdrop-blur-md hover:bg-white/30 px-5 py-2.5 rounded-xl transition-all"
              >
                Manage Subjects <Plus className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Admin Panel (Conditional) */}
          {session.user?.role !== 'STUDENT' && (
            <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 shadow-sm group">
              <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                Admin Panel
              </h2>
              <p className="mt-2 text-emerald-700 text-sm font-medium leading-relaxed">
                Maintain the repository by uploading and managing past papers.
              </p>
              <Link 
                href="/admin/upload" 
                className="mt-6 inline-flex items-center text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 rounded-xl transition-all shadow-md shadow-emerald-200"
              >
                Go to Admin <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
