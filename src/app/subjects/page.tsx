import { getFaculties } from "@/lib/data";
import Link from "next/link";

export default async function SubjectsPage() {
  const faculties = await getFaculties();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold">Subjects</h1>
      <p className="text-gray-600 mt-2 text-lg">Browse past papers by faculty and subject.</p>
      
      <div className="mt-12 space-y-16">
        {faculties.map((faculty) => (
          <div key={faculty.id}>
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">{faculty.name}</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {faculty.subjects.map((subject) => (
                <Link
                  key={subject.id}
                  href={`/subjects/${subject.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="group relative flex flex-col items-start p-6 bg-white border rounded-xl hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {subject.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{subject.code}</p>
                  <span className="mt-4 text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    View Papers →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
