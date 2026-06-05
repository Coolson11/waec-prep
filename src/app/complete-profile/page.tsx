"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getFaculties, getSubjectsByFaculty, completeProfile } from "@/lib/actions/onboarding";
import { Faculty, Subject } from "@prisma/client";
import { Loader2, Check, ChevronRight, ChevronLeft } from "lucide-react";
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
    setSelectedSubjects([]); // Reset subjects when faculty changes
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
      // Update session to reflect completion
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-blue-600 uppercase">
                Step {step} of 2
              </span>
              <span className="text-xs font-semibold text-blue-600 uppercase">
                {step === 1 ? "Faculty Selection" : "Subject Selection"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={clsx(
                  "bg-blue-600 h-2 rounded-full transition-all duration-300",
                  step === 1 ? "w-1/2" : "w-full"
                )}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {step === 1 ? "Choose your Faculty" : "Select your Subjects"}
          </h2>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {faculties.map((f) => (
                <button
                  key={f.id}
                  onClick={() => handleFacultySelect(f.id)}
                  className={clsx(
                    "p-6 border-2 rounded-xl text-center transition-all",
                    selectedFaculty === f.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-100 hover:border-blue-300 bg-white"
                  )}
                >
                  <div className="font-semibold text-lg text-gray-900">
                    {f.name}
                  </div>
                  {selectedFaculty === f.id && (
                    <div className="mt-2 flex justify-center">
                      <Check className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Choose the subjects you want to focus on. (Minimum 1)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                {subjects.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => toggleSubject(s.id)}
                    className={clsx(
                      "flex items-center justify-between p-4 border rounded-lg transition-all",
                      selectedSubjects.includes(s.id)
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-200 text-gray-700"
                    )}
                  >
                    <span className="font-medium">{s.name}</span>
                    {selectedSubjects.includes(s.id) && (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-between">
            {step === 2 && (
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            )}
            <div className="ml-auto">
              {step === 1 ? (
                <button
                  disabled={!selectedFaculty}
                  onClick={handleNext}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              ) : (
                <button
                  disabled={loading || selectedSubjects.length === 0}
                  onClick={handleSubmit}
                  className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Complete Setup"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
