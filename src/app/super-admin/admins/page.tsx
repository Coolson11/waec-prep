"use client";

import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { getAdmins, createAdmin, updateAdmin, deleteAdmin, demoteToStudent } from "@/lib/actions/super-admin";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { Loader2, Trash2, Plus, Pencil, UserMinus } from "lucide-react";

export default function AdminsPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<any | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [modal, setModal] = useState<{isOpen: boolean, action: () => void, title: string, description: string}>({
    isOpen: false, action: () => {}, title: '', description: ''
  });
  const [search, setSearch] = useState("");

  useEffect(() => { loadAdmins(); }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function loadAdmins() {
    setLoading(true);
    const data = await getAdmins();
    setAdmins(data);
    setLoading(false);
  }

  const filteredAdmins = admins.filter(a => 
    a.name?.toLowerCase().includes(search.toLowerCase()) || 
    a.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      if (editingAdmin) {
        await updateAdmin(editingAdmin.id, {name: data.name, email: data.email});
        setNotification({type: 'success', message: "Admin updated successfully"});
      } else {
        await createAdmin(data);
        setNotification({type: 'success', message: "Admin created successfully"});
      }
      setIsFormOpen(false);
      setEditingAdmin(null);
      loadAdmins();
    } catch (err: any) {
      setNotification({type: 'error', message: err.message || "Something went wrong"});
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Email", accessor: "email" },
    { header: "Actions", accessor: "id", render: (a: any) => (
      <div className="flex gap-2">
        <button onClick={() => { setEditingAdmin(a); setIsFormOpen(true); }} className="p-2 hover:bg-indigo-50 rounded-lg"><Pencil className="h-4 w-4 text-indigo-600" /></button>
        <button onClick={() => setModal({
          isOpen: true,
          title: "Demote to Student",
          description: `Are you sure you want to demote ${a.name} to Student?`,
          action: async () => {
            try { await demoteToStudent(a.id); setNotification({type: 'success', message: "Demoted successfully"}); loadAdmins(); }
            catch (err: any) { setNotification({type: 'error', message: err.message}); }
          }
        })} className="p-2 hover:bg-yellow-50 rounded-lg"><UserMinus className="h-4 w-4 text-yellow-600" /></button>
        <button onClick={() => setModal({
          isOpen: true,
          title: "Delete Admin",
          description: `Are you sure you want to delete ${a.name}?`,
          action: async () => {
            try { await deleteAdmin(a.id); setNotification({type: 'success', message: "Deleted successfully"}); loadAdmins(); }
            catch (err: any) { setNotification({type: 'error', message: err.message}); }
          }
        })} className="p-2 hover:bg-rose-50 rounded-lg"><Trash2 className="h-4 w-4 text-rose-600" /></button>
      </div>
    )}
  ];

  if (loading) return <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />;

  return (
    <div className="space-y-6">
      {notification && <div className={`p-4 rounded-xl text-white font-bold ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>{notification.message}</div>}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900">Admin Management</h1>
        <button onClick={() => { setEditingAdmin(null); setIsFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold"><Plus className="h-4 w-4" /> Add Admin</button>
      </div>
      <DataTable data={filteredAdmins} columns={columns} onSearch={setSearch} />
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4">
            <h2 className="text-lg font-black">{editingAdmin ? "Edit" : "Add"} Admin</h2>
            <input name="name" defaultValue={editingAdmin?.name} placeholder="Name" className="w-full p-3 border rounded-xl" required />
            <input name="email" defaultValue={editingAdmin?.email} placeholder="Email" className="w-full p-3 border rounded-xl" required />
            {!editingAdmin && <input name="password" type="password" placeholder="Password" className="w-full p-3 border rounded-xl" required />}
            <div className="flex gap-2"><button type="submit" className="flex-1 bg-indigo-600 text-white p-3 rounded-xl font-bold">Save</button><button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-slate-100 p-3 rounded-xl font-bold">Cancel</button></div>
          </form>
        </div>
      )}
      <ConfirmationModal {...modal} onClose={() => setModal({...modal, isOpen: false})} onConfirm={modal.action} />
    </div>
  );
}

