import { getSession } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6 text-center">
      <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl">
        Master Your Exams with <span className="text-blue-600">WAEC Prep</span>
      </h1>
      <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl">
        Access thousands of WAEC past papers, organized by subject and year. 
        Start your preparation today with the most reliable past question platform.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link
          href="/api/auth/signin"
          className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          Get Started
        </Link>
        <Link href="/about" className="text-sm font-semibold leading-6 text-gray-900">
          Learn more <span aria-hidden="true">→</span>
        </Link>
      </div>
      
      <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-3">
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold">Searchable Archive</h3>
          <p className="mt-2 text-gray-600 text-sm">Find any paper in seconds with our advanced filtering system.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold">Mobile Ready</h3>
          <p className="mt-2 text-gray-600 text-sm">Study on the go. Our platform works perfectly on any device.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border">
          <h3 className="text-lg font-bold">Detailed Solutions</h3>
          <p className="mt-2 text-gray-600 text-sm">Understand the "why" behind every answer with clear explanations.</p>
        </div>
      </div>
    </div>
  );
}
