"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { uploadPaper } from "@/lib/actions/paper";
import prisma from "@/lib/prisma"; // This won't work in client component, need to fetch subjects

export default function AdminUploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [subjects, setSubjects] = useState<{id: string, name: string}[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/");
    }
    
    // Fetch subjects via API
    fetch("/api/subjects")
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(err => console.error("Failed to fetch subjects", err));
  }, [status]);

  if (status === "loading") return <p className="p-6">Loading...</p>;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      await uploadPaper(formData);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong during upload.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold">Upload Past Paper</h1>
      <p className="text-gray-600 mt-2">Add a new WAEC past paper to the archive.</p>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-6 bg-white p-8 border rounded-xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Paper Title</label>
            <input 
              name="title"
              type="text" 
              placeholder="e.g. Mathematics Paper 1 2023" 
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <select name="subjectId" className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <input 
              name="year"
              type="number" 
              defaultValue={new Date().getFullYear()} 
              className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Paper Type</label>
            <select name="paperType" className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="Paper 1">Paper 1 (Objectives)</option>
              <option value="Paper 2">Paper 2 (Theory)</option>
              <option value="Paper 3">Paper 3 (Practical)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">PDF File</label>
          <input 
            name="file"
            type="file" 
            accept=".pdf"
            className="w-full border rounded-md px-3 py-2 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Upload & Publish"}
          </button>
        </div>
      </form>
    </div>
  );
}
