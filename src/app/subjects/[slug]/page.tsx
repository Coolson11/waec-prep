import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function SubjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  if (!resolvedParams?.slug) {
    notFound();
  }

  const subjectName = resolvedParams.slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  const subject = await prisma.subject.findFirst({
    where: { 
      name: {
        equals: subjectName,
        mode: 'insensitive'
      }
    },
    include: {
      papers: {
        where: { status: 'PUBLISHED' },
        orderBy: { year: 'desc' },
        include: {
          subject: true
        }
      }
    }
  });

  if (!subject) {
    notFound();
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <Link href="/subjects" className="hover:text-blue-600 transition-colors">Subjects</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{subject.name}</span>
      </div>
      
      <h1 className="mt-4 text-4xl font-bold">{subject.name} Past Papers</h1>
      <p className="mt-2 text-gray-600">Access and study {subject.name} papers from previous years.</p>
      
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {subject.papers.length > 0 ? (
          subject.papers.map((paper) => (
            <div key={paper.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{paper.title}</h3>
                    <p className="text-sm text-gray-500">{paper.subject.name} • {paper.year}</p>
                    <p className="text-xs text-gray-400 mt-1">{paper.paperType}</p>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {paper.examBody}
                  </span>
                </div>

                {!paper.cloudinaryUrl && (
                  <div className="mt-4 p-2 bg-amber-50 text-amber-700 text-xs rounded border border-amber-100 font-medium">
                    PDF unavailable
                  </div>
                )}
                
                <div className="mt-6 flex gap-3">
                  <Link 
                    href={`/papers/${paper.id}/preview`}
                    className="flex-1 text-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    Preview
                  </Link>
                  <button 
                    disabled={!paper.cloudinaryUrl}
                    className="flex-1 text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:bg-gray-400"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-white border border-dashed rounded-xl">
            <p className="text-gray-500">No papers found for this subject yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
