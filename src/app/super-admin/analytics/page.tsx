"use client";
import { useState, useEffect } from "react";
import { getAnalytics } from "@/lib/actions/super-admin";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then((res) => { setData(res); setLoading(false); });
  }, []);

  if (loading) return <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data && Object.entries(data).map(([key, value]) => (
          <div key={key} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{key}</div>
            <div className="text-3xl font-black text-slate-900">{String(value)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
