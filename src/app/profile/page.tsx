import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ProfilePreferences from "@/components/profile/preferences-form";
import { motion } from "framer-motion";
import { User, Mail, Shield, BookOpen, Settings } from "lucide-react";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Header Card */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600 to-violet-600" />
        <div className="relative px-8 pb-8 pt-16">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-[2rem] bg-white p-1.5 shadow-xl shadow-indigo-500/10">
                <div className="h-full w-full rounded-[1.75rem] bg-indigo-50 flex items-center justify-center text-indigo-600 text-4xl font-black">
                  {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white h-8 w-8 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="flex-grow space-y-1">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {session.user?.name || "Member User"}
              </h1>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-1.5 text-slate-500 font-bold text-sm bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                  <Mail className="h-3.5 w-3.5" />
                  {session.user?.email}
                </div>
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-sm bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  <Shield className="h-3.5 w-3.5" />
                  {session.user?.role} Account
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="p-3 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all border border-transparent hover:border-indigo-100">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats/Quick Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              Academic Status
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <span className="text-sm font-bold text-slate-500">Profile Progress</span>
                <span className="text-sm font-black text-emerald-600">100%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <span className="text-sm font-bold text-slate-500">Account Type</span>
                <span className="text-sm font-black text-indigo-600">Premium</span>
              </div>
              <div className="p-4 bg-indigo-600 rounded-2xl text-center">
                <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Downloads Used</p>
                <p className="text-white text-xl font-black">24 / 50</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Main Preferences Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <ProfilePreferences />
          </div>
        </div>
      </div>
    </div>
  );
}
