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

  // If blocked, show the "Limit Reached" UI
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
            Sign in or create an account to get more access.
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

  // URL Logic:
  const rawUrl = paper.cloudinaryUrl;
  let isImagePreview = false;
  let displayUrl = "";

  const isRawResource = rawUrl.includes("/raw/upload/");

  if (access.mode === "first-page-only") {
    if (isRawResource) {
      // If it's a raw resource, we can't do image transformations
      // Fallback: Show the PDF but maybe with some message or just the iframe
      // For now, let's just show the PDF in iframe but it's not ideal for "first-page-only"
      // Alternatively, we keep isImagePreview = false and just show the PDF.
      isImagePreview = false;
      displayUrl = rawUrl;
    } else {
      // For guests, show high-quality JPG preview (Guaranteed to work for 'image' resources)
      isImagePreview = true;
      displayUrl = rawUrl.replace("/upload/", "/upload/f_jpg,pg_1,w_1200,c_limit,q_auto:best/").replace(".pdf", ".jpg");
    }
  } else {
    // For authenticated users, use direct URL with PDF parameters
    displayUrl = rawUrl;
    
    // Ensure we don't have double #
    const baseUrl = displayUrl.split('#')[0];
    displayUrl = `${baseUrl}#toolbar=0&navpanes=0&scrollbar=1`;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PreviewTracker />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <Link href="/subjects" className="hover:text-blue-600 transition-colors">Subjects</Link>
          <span>/</span>
          <Link href={`/subjects/${paper.subject.name.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-blue-600 transition-colors">
            {paper.subject.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{paper.year} Preview</span>
        </div>
        
        {access.mode === "first-page-only" && (
          <span className="text-xs font-semibold text-orange-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-200 shadow-sm">
            Guest Preview: {access.count}/5 Used
          </span>
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Viewer Area */}
        <div className="lg:col-span-3">
          <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden border-4 border-gray-800 min-h-[600px] lg:h-[850px] relative flex items-center justify-center">
            {isImagePreview ? (
              <div className="w-full h-full overflow-y-auto bg-gray-100 p-4 custom-scrollbar">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={displayUrl} 
                  alt={`${paper.title} - First Page`} 
                  className="w-full max-w-3xl mx-auto shadow-2xl rounded-sm"
                />
                <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-gray-900 via-gray-900/90 to-transparent flex flex-col items-center justify-end pb-10">
                  <p className="text-white font-bold text-xl mb-4 tracking-tight">Want to unlock the full paper?</p>
                  <Link href="/auth/signin" className="px-8 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transform hover:scale-105 transition-all shadow-lg">
                    Sign In for Full Access
                  </Link>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-white relative">
                <iframe 
                  src={displayUrl} 
                  className="w-full h-full border-none"
                  title={paper.title}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                   <a 
                    href={rawUrl} 
                    download={`${paper.title}.pdf`}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-5 rounded-lg shadow-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </a>
                   <a 
                    href={rawUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-xl transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 border rounded-xl shadow-sm">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">{paper.title}</h1>
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-gray-500">Subject</span>
                <span className="font-semibold text-gray-900">{paper.subject.name}</span>
              </div>
              <div className="flex justify-between items-center text-sm border-b pb-2">
                <span className="text-gray-500">Year</span>
                <span className="font-semibold text-gray-900">{paper.year}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Type</span>
                <span className="font-semibold text-blue-600 uppercase text-xs tracking-wider px-2 py-0.5 bg-blue-50 rounded-md">
                  {paper.paperType}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 border border-blue-100 rounded-xl shadow-sm">
            <h3 className="font-bold text-blue-900">
              {access.mode === "full" ? "Study with Confidence" : "Unlock Full Access"}
            </h3>
            <p className="mt-2 text-sm text-blue-700 leading-relaxed">
              {access.mode === "full" 
                ? "You have full access to this paper. Premium members get unlimited downloads and detailed solutions."
                : "Guests can only view the first page. Sign in to see all questions and solutions."}
            </p>
            
            <div className="mt-6 space-y-3">
              {access.mode === "full" ? (
                <button className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md">
                  Download Full PDF
                </button>
              ) : (
                <Link 
                  href="/auth/signin"
                  className="block w-full text-center py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all shadow-md"
                >
                  Sign In for Full PDF
                </Link>
              )}
              <Link 
                href="/pricing"
                className="block w-full text-center py-2.5 text-blue-600 font-bold border border-blue-600 rounded-lg hover:bg-blue-50 transition-all"
              >
                View Premium Plans
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
