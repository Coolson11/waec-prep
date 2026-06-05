import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming these exist, if not, I'll use raw divs

export default async function SuperAdminDashboard() {
  // Aggregate stats
  const [userCount, adminCount, paperCount, subjectCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } } }),
    prisma.paper.count(),
    prisma.subject.count(),
  ]);

  const stats = [
    { title: "Total Users", value: userCount },
    { title: "Total Admins", value: adminCount },
    { title: "Total Papers", value: paperCount },
    { title: "Total Subjects", value: subjectCount },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.title} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.title}</h3>
            <p className="text-3xl font-black text-slate-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>
      {/* Add Recent Activity/Charts here later */}
    </div>
  );
}
