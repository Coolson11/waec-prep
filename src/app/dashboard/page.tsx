import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome back, {session.user?.name}</h1>
      <p className="text-gray-600">You are logged in as a {session.user?.role?.toLowerCase()}.</p>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">My Subjects</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your 7-9 selected subjects.</p>
          <button className="mt-4 text-blue-600 text-sm font-medium hover:underline">Select Subjects →</button>
        </div>
        
        <div className="p-6 bg-white border rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">Quick Search</h2>
          <p className="text-gray-500 text-sm mt-1">Jump straight to a specific paper.</p>
          <div className="mt-4 flex gap-2">
            <input type="text" placeholder="e.g. Maths 2023" className="border rounded px-3 py-1 text-sm w-full" />
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Search</button>
          </div>
        </div>

        {session.user?.role !== 'STUDENT' && (
          <div className="p-6 bg-blue-50 border border-blue-100 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg text-blue-900">Admin Panel</h2>
            <p className="text-blue-700 text-sm mt-1">Upload and manage past papers.</p>
            <Link href="/admin/upload" className="mt-4 inline-block text-blue-600 text-sm font-medium hover:underline">Go to Admin →</Link>
          </div>
        )}
      </div>
    </div>
  );
}
