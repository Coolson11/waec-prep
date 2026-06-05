"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { getAuditLogs } from "@/lib/actions/super-admin";
import { Loader2 } from "lucide-react";

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs().then((res) => { setLogs(res); setLoading(false); });
  }, []);

  const columns = [
    { header: "Action", accessor: "action" },
    { header: "User ID", accessor: "userId" },
    { header: "Time", accessor: "createdAt", render: (l: any) => new Date(l.createdAt).toLocaleString() }
  ];

  if (loading) return <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Audit Logs</h1>
      <DataTable data={logs} columns={columns} />
    </div>
  );
}
