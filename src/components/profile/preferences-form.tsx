"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getFaculties, getSubjectsByFaculty, updatePreferences, getUserPreferences } from "@/lib/actions/onboarding";
import { Faculty, Subject } from "@prisma/client";
import { Loader2, Check, Save } from "lucide-react";
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
      async function loadSubjects() {
        const data = await getSubjectsByFaculty(selectedFaculty);
        setSubjects(data);
      }
      loadSubjects();
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
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Study Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Update your faculty and selected subjects.
        </p>
      </div>

      <div className="space-y-6">
        {/* Faculty Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your Faculty
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {faculties.map((f) => (
              <button
                key={f.id}
                onClick={() => handleFacultyChange(f.id)}
                className={clsx(
                  "px-4 py-3 border rounded-lg text-sm font-medium transition-all",
                  selectedFaculty === f.id
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                )}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Selected Subjects
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleSubject(s.id)}
                className={clsx(
                  "flex items-center justify-between px-4 py-2 border rounded-md text-sm transition-all",
                  selectedSubjects.includes(s.id)
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                )}
              >
                <span>{s.name}</span>
                {selectedSubjects.includes(s.id) && <Check className="h-3 w-3" />}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-100 text-green-600 rounded-md text-sm">
            Preferences updated successfully!
          </div>
        )}

        <div className="pt-4 border-t flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
  );
}
