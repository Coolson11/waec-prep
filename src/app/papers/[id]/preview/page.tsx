import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { checkPreviewAccess } from "@/lib/actions/preview";
import Link from "next/link";
import { PreviewTracker } from "@/components/providers/preview-tracker";

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

  // If blocked, show the "Limit Reached" UI instead of redirecting
  if (access.mode === "blocked") {
    return (
      <div className="p-6 max-w-5xl mx-auto min-h-[70vh] flex items-center justify-center">
        <div className="bg-white p-10 border rounded-2xl shadow-xl max-w-md text-center">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m4-6a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Preview Limit Reached</h2>
          <p className="mt-4 text-gray-600">
            You've used all {access.count} of your free guest previews. 
            Sign in or create an account to get more access, or go premium for unlimited downloads.
          </p>
          <div className="mt-8 flex flex-col gap-3">
            <Link 
              href="/auth/signup" 
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Free Account
            </Link>
            <Link 
              href="/auth/signin" 
              className="w-full py-3 text-blue-600 font-bold border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Logic for PDF URL: If guest, use Cloudinary's pg_1 transformation
  let displayUrl = paper.cloudinaryUrl;
  if (access.mode === "first-page-only" && displayUrl.includes("upload/")) {
    displayUrl = displayUrl.replace("upload/", "upload/pg_1/");
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PreviewTracker />
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
        
        {access.mode === "first-page-only" && (
          <span className="text-xs font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
            Guest Preview: {access.count}/5 Used
          </span>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* PDF Viewer Area */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border-4 border-gray-800 aspect-[1/1.414] lg:aspect-auto lg:h-[800px] relative">
            <iframe 
              src={`${displayUrl}#toolbar=0`} 
              className="w-full h-full border-none"
              title={paper.title}
            />
            
            {access.mode === "first-page-only" && (
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
            )}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 border rounded-xl shadow-sm">
            <h1 className="text-xl font-bold text-gray-900">{paper.title}</h1>
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subject</span>
                <span className="font-medium">{paper.subject.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Year</span>
                <span className="font-medium">{paper.year}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Type</span>
                <span className="font-medium uppercase">{paper.paperType}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 border border-blue-100 rounded-xl">
            <h3 className="font-bold text-blue-900">
              {access.mode === "full" ? "Ready to Download?" : "Want the Full PDF?"}
            </h3>
            <p className="mt-2 text-sm text-blue-700">
              {access.mode === "full" 
                ? "You have full access to preview this paper. Premium members get unlimited downloads."
                : "Guests can only preview the first page. Sign in for full access and solutions."}
            </p>
            
            <div className="mt-6 space-y-3">
              {access.mode === "full" ? (
                <button className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                  Download PDF
                </button>
              ) : (
                <Link 
                  href="/auth/signin"
                  className="block w-full text-center py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
                >
                  Sign In for Full Access
                </Link>
              )}
              <Link 
                href="/pricing"
                className="block w-full text-center py-2 text-blue-600 font-semibold border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
              >
                Go Premium
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
