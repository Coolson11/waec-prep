"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { getFaculties, deleteFaculty, createFaculty, updateFaculty } from "@/lib/actions/super-admin";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { Loader2, Trash2, Plus, Pencil } from "lucide-react";

export default function FacultiesPage() {
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [modal, setModal] = useState<{isOpen: boolean, action: () => void, title: string, description: string}>({
    isOpen: false, action: () => {}, title: '', description: ''
  });

  useEffect(() => { loadFaculties(); }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function loadFaculties() {
    setLoading(true);
    const data = await getFaculties();
    setFaculties(data);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      if (editingFaculty) {
        await updateFaculty(editingFaculty.id, name);
        setNotification({type: 'success', message: "Faculty updated successfully"});
      } else {
        await createFaculty(name);
        setNotification({type: 'success', message: "Faculty created successfully"});
      }
      setIsFormOpen(false);
      setEditingFaculty(null);
      loadFaculties();
    } catch (err: any) {
      setNotification({type: 'error', message: err.message || "Something went wrong"});
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Subjects", accessor: "id", render: (f: any) => f._count.subjects },
    { header: "Users", accessor: "id", render: (f: any) => f._count.users },
    { header: "Actions", accessor: "id", render: (f: any) => (
      <div className="flex gap-2">
        <button
          onClick={() => { setEditingFaculty(f); setIsFormOpen(true); }}
          className="p-2 hover:bg-indigo-50 rounded-lg"
        >
          <Pencil className="h-4 w-4 text-indigo-600" />
        </button>
        <button
          onClick={() => setModal({
            isOpen: true,
            title: "Delete Faculty",
            description: `Are you sure you want to delete ${f.name}? This action cannot be undone and will fail if subjects are associated.`,
            action: async () => { 
              try {
                await deleteFaculty(f.id); 
                setNotification({type: 'success', message: "Faculty deleted"});
                loadFaculties(); 
              } catch (err: any) {
                setNotification({type: 'error', message: err.message});
              }
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
      {notification && (
        <div className={`p-4 rounded-xl text-white font-bold ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {notification.message}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900">Faculty Management</h1>
        <button onClick={() => { setEditingFaculty(null); setIsFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold">
          <Plus className="h-4 w-4" /> Add Faculty
        </button>
      </div>
      <DataTable data={faculties} columns={columns} />
      
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4">
            <h2 className="text-lg font-black">{editingFaculty ? "Edit" : "Add"} Faculty</h2>
            <input name="name" defaultValue={editingFaculty?.name} placeholder="Faculty Name" className="w-full p-3 border rounded-xl" required />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-indigo-600 text-white p-3 rounded-xl font-bold">Save</button>
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 bg-slate-100 p-3 rounded-xl font-bold">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <ConfirmationModal {...modal} onClose={() => setModal({...modal, isOpen: false})} onConfirm={modal.action} />
    </div>
  );
}

