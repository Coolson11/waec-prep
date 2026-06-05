"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { getSubscriptions, cancelSubscription } from "@/lib/actions/super-admin";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { Loader2, Ban } from "lucide-react";

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{isOpen: boolean, action: () => void, title: string, description: string}>({
    isOpen: false, action: () => {}, title: '', description: ''
  });

  useEffect(() => { loadSubscriptions(); }, []);

  async function loadSubscriptions() {
    setLoading(true);
    const data = await getSubscriptions();
    setSubscriptions(data);
    setLoading(false);
  }

  const columns = [
    { header: "User", accessor: "user", render: (s: any) => s.user.name || s.user.email },
    { header: "Plan", accessor: "plan" },
    { header: "Status", accessor: "isActive", render: (s: any) => s.isActive ? "Active" : "Cancelled" },
    { header: "Actions", accessor: "id", render: (s: any) => s.isActive && (
      <button
        onClick={() => setModal({
          isOpen: true,
          title: "Cancel Subscription",
          description: `Are you sure you want to cancel the subscription for ${s.user.name || s.user.email}?`,
          action: async () => { await cancelSubscription(s.id); loadSubscriptions(); }
        })}
        className="p-2 hover:bg-amber-50 rounded-lg"
      >
        <Ban className="h-4 w-4 text-amber-600" />
      </button>
    )}
  ];

  if (loading) return <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Subscription Management</h1>
      <DataTable data={subscriptions} columns={columns} />
      <ConfirmationModal {...modal} onClose={() => setModal({...modal, isOpen: false})} onConfirm={modal.action} />
    </div>
  );
}
