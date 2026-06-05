"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { getAdmins, removeAdminRole } from "@/lib/actions/super-admin";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { Loader2, UserMinus } from "lucide-react";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{isOpen: boolean, action: () => void, title: string, description: string}>({
    isOpen: false, action: () => {}, title: '', description: ''
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    setLoading(true);
    const data = await getAdmins();
    setAdmins(data);
    setLoading(false);
  }

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Actions", accessor: "id", render: (a: any) => (
      <button 
        onClick={() => setModal({
          isOpen: true,
          title: "Remove Admin Role",
          description: `Are you sure you want to remove ${a.name} from being an admin?`,
          action: async () => { await removeAdminRole(a.id); loadAdmins(); }
        })}
        className="p-2 hover:bg-rose-50 rounded-lg"
      >
        <UserMinus className="h-4 w-4 text-rose-600" />
      </button>
    )}
  ];

  if (loading) return <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Admin Management</h1>
      <DataTable data={admins} columns={columns} />
      <ConfirmationModal {...modal} onClose={() => setModal({...modal, isOpen: false})} onConfirm={modal.action} />
    </div>
  );
}
