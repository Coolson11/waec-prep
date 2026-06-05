"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { getUsers, updateUserRole, toggleSuspension, deleteUser } from "@/lib/actions/super-admin";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { Loader2, MoreVertical, Shield, Ban, Trash2, User } from "lucide-react";
import { Role } from "@prisma/client";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{isOpen: boolean, action: () => void, title: string, description: string}>({
    isOpen: false, action: () => {}, title: '', description: ''
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  }

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "suspended", render: (u: any) => u.suspended ? "Suspended" : "Active" },
    { header: "Actions", accessor: "id", render: (u: any) => (
      <div className="flex gap-2">
        <button 
          onClick={() => setModal({
            isOpen: true,
            title: u.suspended ? "Reactivate User" : "Suspend User",
            description: `Are you sure you want to ${u.suspended ? "reactivate" : "suspend"} ${u.name}?`,
            action: async () => { await toggleSuspension(u.id, !u.suspended); loadUsers(); }
          })}
          className="p-2 hover:bg-slate-100 rounded-lg"
        >
          {u.suspended ? <User className="h-4 w-4 text-emerald-600" /> : <Ban className="h-4 w-4 text-amber-600" />}
        </button>
        <button 
          onClick={() => setModal({
            isOpen: true,
            title: "Delete User",
            description: `Are you sure you want to delete ${u.name}? This action cannot be undone.`,
            action: async () => { await deleteUser(u.id); loadUsers(); }
          })}
          className="p-2 hover:bg-rose-50 rounded-lg"
        >
          <Trash2 className="h-4 w-4 text-rose-600" />
        </button>
      </div>
    )}
  ];

  if (loading) return <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">User Management</h1>
      <DataTable data={users} columns={columns} />
      <ConfirmationModal {...modal} onClose={() => setModal({...modal, isOpen: false})} onConfirm={modal.action} />
    </div>
  );
}
