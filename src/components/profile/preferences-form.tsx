"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getFaculties, getSubjectsByFaculty, updatePreferences, getUserPreferences } from "@/lib/actions/onboarding";
import { Faculty, Subject } from "@prisma/client";
import { Loader2, Check, Save, GraduationCap, BookOpen, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export default function ProfilePreferences() {
  const { data: session, update } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      const [facultyData, userPrefs] = await Promise.all([
        getFaculties(),
        getUserPreferences()
      ]);
      
      setFaculties(facultyData);
      
      if (userPrefs) {
        setSelectedFaculty(userPrefs.facultyId);
        setSelectedSubjects(userPrefs.selectedSubjects.map(s => s.id));
        
        if (userPrefs.facultyId) {
          const subjectData = await getSubjectsByFaculty(userPrefs.facultyId);
          setSubjects(subjectData);
        }
      }
      setLoading(false);
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedFaculty && !loading) {
      async function loadSubjects(facultyId: string) {
        const data = await getSubjectsByFaculty(facultyId);
        setSubjects(data);
      }
      loadSubjects(selectedFaculty);
    }
  }, [selectedFaculty, loading]);

  const handleFacultyChange = (id: string) => {
    if (id !== selectedFaculty) {
      setSelectedFaculty(id);
      setSelectedSubjects([]); // Reset subjects if faculty changes
    }
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!selectedFaculty || selectedSubjects.length === 0) {
      setError("Please select a faculty and at least one subject.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    const res = await updatePreferences(selectedFaculty, selectedSubjects);

    if (res.success) {
      await update({
        facultyId: selectedFaculty,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError(res.error || "An error occurred.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">Loading Preferences</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-indigo-600" />
            Study Preferences
          </h3>
          <p className="mt-1 text-slate-500 font-medium">
            Fine-tune your focus areas for personalized recommendations.
          </p>
        </div>
        <div className="hidden sm:block">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100 uppercase tracking-widest">
            {selectedSubjects.length} Subjects Selected
          </span>
        </div>
      </div>

      <div className="space-y-10">
        {/* Faculty Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-5 w-5 text-indigo-600" />
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Target Faculty</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {faculties.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFacultyChange(f.id)}
                className={clsx(
                  "relative group px-6 py-4 border rounded-[1.5rem] text-sm font-bold transition-all overflow-hidden",
                  selectedFaculty === f.id
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "border-slate-100 bg-white text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30"
                )}
              >
                <span className="relative z-10">{f.name}</span>
                {selectedFaculty === f.id && (
                  <motion.div 
                    layoutId="faculty-glow"
                    className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600"
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Subject Selection */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="h-5 w-5 text-indigo-600" />
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">Core Subjects</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <AnimatePresence mode="popLayout">
              {subjects.map((s) => (
                <motion.button
                  key={s.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => toggleSubject(s.id)}
                  className={clsx(
                    "flex items-center justify-between px-5 py-4 border rounded-2xl text-sm font-bold transition-all group hover-card",
                    selectedSubjects.includes(s.id)
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/10"
                      : "border-slate-100 bg-white text-slate-600 hover:border-indigo-200"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <div className={clsx(
                      "w-2 h-2 rounded-full transition-all",
                      selectedSubjects.includes(s.id) ? "bg-indigo-600 scale-125" : "bg-slate-200"
                    )} />
                    {s.name}
                  </span>
                  {selectedSubjects.includes(s.id) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <Check className="h-4 w-4 text-indigo-600" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        </section>

        <div className="pt-6">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold"
              >
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-sm font-bold flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Your study preferences have been updated successfully!
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <p className="text-xs font-bold text-slate-400 max-w-xs">
              Updating your preferences will refine your dashboard recommendations and available study materials.
            </p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center px-8 py-3.5 bg-indigo-600 text-white rounded-2xl text-sm font-black hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
