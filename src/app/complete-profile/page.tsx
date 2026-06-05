"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getFaculties, getSubjectsByFaculty, completeProfile } from "@/lib/actions/onboarding";
import { Faculty, Subject } from "@prisma/client";
import { Loader2, Check, ChevronRight, ChevronLeft, GraduationCap, Sparkles, BookOpen, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export default function CompleteProfilePage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFaculties() {
      const data = await getFaculties();
      setFaculties(data);
    }
    loadFaculties();
  }, []);

  useEffect(() => {
    if (selectedFaculty) {
      async function loadSubjects() {
        setLoading(true);
        const data = await getSubjectsByFaculty(selectedFaculty);
        setSubjects(data);
        setLoading(false);
      }
      loadSubjects();
    }
  }, [selectedFaculty]);

  const handleFacultySelect = (id: string) => {
    setSelectedFaculty(id);
    setSelectedSubjects([]); 
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedFaculty) {
      setStep(2);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFaculty || selectedSubjects.length === 0) {
      setError("Please select a faculty and at least one subject.");
      return;
    }

    setLoading(true);
    setError(null);

    const res = await completeProfile(selectedFaculty, selectedSubjects);

    if (res.success) {
      await update({
        profileCompleted: true,
        facultyId: selectedFaculty,
      });
      router.push("/dashboard");
      router.refresh();
    } else {
      setError(res.error || "An error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl py-10 px-6 sm:px-12 shadow-2xl shadow-indigo-500/10 rounded-[3rem] border border-white"
        >
          {/* Header Info */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-600 rounded-2xl mb-4 shadow-lg shadow-indigo-200">
              <Sparkles className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Personalize Your Experience
            </h2>
            <p className="mt-2 text-slate-500 font-medium">
              We&apos;ll tailor your study materials based on your selections
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="max-w-xs mx-auto mb-12">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                Progress
              </span>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                Step {step} of 2
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 p-0.5 border border-slate-50">
              <motion.div
                layout
                className="bg-indigo-600 h-full rounded-full shadow-sm"
                initial={false}
                animate={{ width: step === 1 ? "50%" : "100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="min-h-[350px]">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-2 ml-1">
                    <Layers className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Select Your Faculty</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {faculties.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => handleFacultySelect(f.id)}
                        className={clsx(
                          "relative group p-8 border-2 rounded-[2.5rem] transition-all flex flex-col items-center text-center",
                          selectedFaculty === f.id
                            ? "border-indigo-600 bg-indigo-50/50 shadow-xl shadow-indigo-500/5 ring-4 ring-indigo-500/5"
                            : "border-slate-100 hover:border-indigo-200 hover:bg-slate-50/50"
                        )}
                      >
                        <div className={clsx(
                          "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                          selectedFaculty === f.id ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-400"
                        )}>
                          <GraduationCap className="h-7 w-7" />
                        </div>
                        <span className="font-black text-slate-900 tracking-tight uppercase text-xs tracking-widest">
                          {f.name}
                        </span>
                        {selectedFaculty === f.id && (
                          <motion.div 
                            layoutId="check-icon"
                            className="absolute top-4 right-4"
                          >
                            <Check className="h-5 w-5 text-indigo-600" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 mb-2 ml-1">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Select Your Subjects</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {subjects.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => toggleSubject(s.id)}
                        className={clsx(
                          "flex items-center justify-between p-5 border-2 rounded-2xl transition-all group",
                          selectedSubjects.includes(s.id)
                            ? "border-indigo-600 bg-indigo-50 text-indigo-700 font-black"
                            : "border-slate-100 hover:border-indigo-100 text-slate-600 font-bold"
                        )}
                      >
                        <span className="text-sm">{s.name}</span>
                        <div className={clsx(
                          "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors",
                          selectedSubjects.includes(s.id) ? "bg-indigo-600 border-indigo-600" : "border-slate-200"
                        )}>
                          {selectedSubjects.includes(s.id) && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
            {step === 2 ? (
              <button
                onClick={handleBack}
                className="flex items-center px-6 py-3 text-sm font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </button>
            ) : <div />}

            <div className="flex gap-4">
              {step === 1 ? (
                <button
                  disabled={!selectedFaculty}
                  onClick={handleNext}
                  className="flex items-center px-10 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  disabled={loading || selectedSubjects.length === 0}
                  onClick={handleSubmit}
                  className="flex items-center px-10 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Finish Setup
                      <Check className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
