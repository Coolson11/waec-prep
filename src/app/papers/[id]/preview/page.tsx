import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { checkPreviewAccess, incrementPreviewCount } from "@/lib/actions/preview";
import Link from "next/link";

export default async function PaperPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const paper = await prisma.paper.findUnique({
    where: { id: resolvedParams.id },
    include: { subject: true }
  });

  if (!paper || !paper.subject) {
    notFound();
  }

  const access = await checkPreviewAccess();

  if (!access.allowed) {
    // Redirect to upgrade or sign in page if limit reached
    redirect("/pricing?reason=limit-reached");
  }

  // Increment preview count
  await incrementPreviewCount();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Link href="/subjects" className="hover:text-blue-600">Subjects</Link>
          <span>/</span>
          <Link href={`/subjects/${paper.subject.name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-600">
            {paper.subject.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{paper.year} Preview</span>
        </div>
        
        {access.count !== -1 && (
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
            {5 - (access.count + 1)} previews remaining
          </span>
        )}
      </div>

      <div className="mt-8 bg-white border rounded-xl shadow-lg overflow-hidden min-h-[800px] flex flex-col items-center justify-center relative">
        {/* In a real scenario, this would be an iframe with the first page of the PDF */}
        <div className="p-12 text-center">
          <h2 className="text-2xl font-bold">{paper.title}</h2>
          <p className="text-gray-500 mt-2">Previewing first page of {paper.paperCode}</p>
          
          <div className="mt-12 w-full max-w-2xl aspect-[1/1.414] bg-gray-100 border border-gray-200 rounded shadow-inner flex flex-col p-10 text-left">
            <div className="h-4 w-1/3 bg-gray-300 rounded mb-6"></div>
            <div className="h-8 w-1/2 bg-gray-400 rounded mb-10"></div>
            <div className="space-y-4">
              <div className="h-3 w-full bg-gray-300 rounded"></div>
              <div className="h-3 w-full bg-gray-300 rounded"></div>
              <div className="h-3 w-3/4 bg-gray-300 rounded"></div>
            </div>
            <div className="mt-20 h-40 w-full border-2 border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
              [Diagram Placeholder]
            </div>
          </div>
        </div>

        {/* Overlay for "Upgrade to see full" */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center justify-end p-12 text-center">
          <h3 className="text-xl font-bold text-gray-900">Want to see the full paper?</h3>
          <p className="text-gray-600 mt-2 max-w-md">Download the complete PDF and get access to all questions and detailed solutions.</p>
          <div className="mt-6 flex gap-4">
            <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
              Download Full Paper
            </button>
            <Link href="/pricing" className="px-6 py-2 text-blue-600 font-semibold border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              Go Premium
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
