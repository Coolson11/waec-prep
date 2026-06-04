"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Paper {
  id: string;
  title: string;
  subject: { name: string };
  year: number;
  paperType: string;
  cloudinaryUrl: string | null;
  paperCode: string;
  examBody: string;
}

export default function PapersPage() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPapers() {
      try {
        const res = await fetch("/api/papers");
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to fetch papers");
        }
        const data = await res.json();
        setPapers(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPapers();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-lg text-gray-600">Loading past papers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="bg-red-50 text-red-600 p-8 rounded-xl border border-red-100 max-w-md">
          <h2 className="text-2xl font-bold mb-2">Oops!</h2>
          <p className="mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Past Papers Archive</h1>
          <p className="mt-2 text-gray-600 text-lg">Browse through our collection of WAEC past papers.</p>
        </div>
        <div className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-lg">
          Total Papers: {papers.length}
        </div>
      </div>
      
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {papers.length > 0 ? (
          papers.map((paper) => (
            <div key={paper.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{paper.title}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1 text-sm text-gray-500">
                      <span>{paper.subject.name}</span>
                      <span>•</span>
                      <span>{paper.year}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-wider">{paper.paperType}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {paper.examBody}
                  </span>
                </div>

                {!paper.cloudinaryUrl && (
                  <div className="mt-4 p-2 bg-amber-50 text-amber-700 text-xs rounded border border-amber-100 font-semibold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    PDF unavailable
                  </div>
                )}
              </div>
              
              <div className="px-6 pb-6 mt-auto">
                <div className="flex gap-3">
                  <Link 
                    href={`/papers/${paper.id}/preview`}
                    className="flex-1 text-center px-4 py-2 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Preview
                  </Link>
                  <button 
                    disabled={!paper.cloudinaryUrl}
                    className="flex-1 text-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">No Papers Found</h3>
            <p className="mt-2 text-gray-500 max-w-xs mx-auto">We couldn't find any past papers in the archive. Check back later or try a different search.</p>
            <Link 
              href="/subjects" 
              className="mt-6 inline-block text-blue-600 font-semibold hover:underline"
            >
              Browse by Subject instead
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
