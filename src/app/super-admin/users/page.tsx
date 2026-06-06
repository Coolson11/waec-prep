"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { getUsers, toggleSuspension, deleteUser, promoteToAdmin } from "@/lib/actions/super-admin";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { Loader2, Ban, Trash2, User, ShieldCheck } from "lucide-react";
import { Role } from "@prisma/client";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [modal, setModal] = useState<{isOpen: boolean, action: () => void, title: string, description: string}>({
    isOpen: false, action: () => {}, title: '', description: ''
  });
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");

  useEffect(() => { loadUsers(); }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function loadUsers() {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  }

  const filteredUsers = users.filter(u => 
    (u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) &&
    (roleFilter === "ALL" || u.role === roleFilter)
  );

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Role", accessor: "role" },
    { header: "Status", accessor: "suspended", render: (u: any) => u.suspended ? "Suspended" : "Active" },
    { header: "Actions", accessor: "id", render: (u: any) => (
      <div className="flex gap-2">
        {u.role === Role.STUDENT && (
          <button onClick={() => setModal({
            isOpen: true,
            title: "Promote to Admin",
            description: `Are you sure you want to promote ${u.name} to Admin?`,
            action: async () => {
              try { await promoteToAdmin(u.id); setNotification({type: 'success', message: "Promoted successfully"}); loadUsers(); }
              catch (err: any) { setNotification({type: 'error', message: err.message}); }
            }
          })} className="p-2 hover:bg-indigo-50 rounded-lg"><ShieldCheck className="h-4 w-4 text-indigo-600" /></button>
        )}
        <button 
          onClick={() => setModal({
            isOpen: true,
            title: u.suspended ? "Reactivate User" : "Suspend User",
            description: `Are you sure you want to ${u.suspended ? "reactivate" : "suspend"} ${u.name}?`,
            action: async () => {
              try { await toggleSuspension(u.id, !u.suspended); setNotification({type: 'success', message: "Status updated"}); loadUsers(); }
              catch (err: any) { setNotification({type: 'error', message: err.message}); }
            }
          })}
          className="p-2 hover:bg-slate-100 rounded-lg"
        >
          {u.suspended ? <User className="h-4 w-4 text-emerald-600" /> : <Ban className="h-4 w-4 text-amber-600" />}
        </button>
        <button 
          onClick={() => setModal({
            isOpen: true,
            title: "Delete User",
            description: `Are you sure you want to delete ${u.name}?`,
            action: async () => {
              try { await deleteUser(u.id); setNotification({type: 'success', message: "Deleted successfully"}); loadUsers(); }
              catch (err: any) { setNotification({type: 'error', message: err.message}); }
            }
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
      {notification && <div className={`p-4 rounded-xl text-white font-bold ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>{notification.message}</div>}
      <h1 className="text-2xl font-black text-slate-900">User Management</h1>
      <select onChange={(e) => setRoleFilter(e.target.value)} className="p-3 border rounded-xl">
        <option value="ALL">All Roles</option>
        {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <DataTable data={filteredUsers} columns={columns} onSearch={setSearch} />
      <ConfirmationModal {...modal} onClose={() => setModal({...modal, isOpen: false})} onConfirm={modal.action} />
    </div>
  );
}

