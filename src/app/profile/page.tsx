import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import ProfilePreferences from "@/components/profile/preferences-form";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow sm:rounded-lg border border-gray-100 overflow-hidden">
        <div className="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Account Profile</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage your personal information and study preferences.
          </p>
        </div>
        
        <div className="px-4 py-5 sm:p-6 space-y-8">
          {/* User Info Section */}
          <div className="flex items-center space-y-4 sm:space-y-0 sm:space-x-6 flex-col sm:flex-row border-b pb-8">
            <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
              {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{session.user?.name || "User"}</h3>
              <p className="text-gray-500">{session.user?.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                {session.user?.role}
              </span>
            </div>
          </div>

          {/* Preferences Section */}
          <ProfilePreferences />
        </div>
      </div>
    </div>
  );
}
