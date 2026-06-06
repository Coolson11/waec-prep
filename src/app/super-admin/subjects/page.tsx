"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { getSubjects, deleteSubject, createSubject, updateSubject, getFaculties } from "@/lib/actions/super-admin";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { Loader2, Trash2, Plus, Pencil, X } from "lucide-react";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any | null>(null);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [modal, setModal] = useState<{isOpen: boolean, action: () => void, title: string, description: string}>({
    isOpen: false, action: () => {}, title: '', description: ''
  });

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function loadData() {
    setLoading(true);
    const [sData, fData] = await Promise.all([getSubjects(), getFaculties()]);
    setSubjects(sData);
    setFaculties(fData);
    setLoading(false);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      code: formData.get("code") as string,
      facultyId: formData.get("facultyId") as string,
    };

    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, data);
        setNotification({type: 'success', message: "Subject updated successfully"});
      } else {
        await createSubject(data);
        setNotification({type: 'success', message: "Subject created successfully"});
      }
      setIsFormOpen(false);
      setEditingSubject(null);
      loadData();
    } catch (err: any) {
      setNotification({type: 'error', message: err.message || "Something went wrong"});
    }
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Code", accessor: "code" },
    { header: "Faculty", accessor: "faculty", render: (s: any) => s.faculty.name },
    { header: "Actions", accessor: "id", render: (s: any) => (
      <div className="flex gap-2">
        <button
          onClick={() => { setEditingSubject(s); setIsFormOpen(true); }}
          className="p-2 hover:bg-indigo-50 rounded-lg"
        >
          <Pencil className="h-4 w-4 text-indigo-600" />
        </button>
        <button
          onClick={() => setModal({
            isOpen: true,
            title: "Delete Subject",
            description: `Are you sure you want to delete ${s.name}? This action cannot be undone.`,
            action: async () => { 
              try {
                await deleteSubject(s.id); 
                setNotification({type: 'success', message: "Subject deleted"});
                loadData(); 
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
        <h1 className="text-2xl font-black text-slate-900">Subject Management</h1>
        <button onClick={() => { setEditingSubject(null); setIsFormOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold">
          <Plus className="h-4 w-4" /> Add Subject
        </button>
      </div>

      <DataTable data={subjects} columns={columns} />
      
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4">
            <h2 className="text-lg font-black">{editingSubject ? "Edit" : "Add"} Subject</h2>
            <input name="name" defaultValue={editingSubject?.name} placeholder="Name" className="w-full p-3 border rounded-xl" required />
            <input name="code" defaultValue={editingSubject?.code} placeholder="Code" className="w-full p-3 border rounded-xl" required />
            <select name="facultyId" defaultValue={editingSubject?.facultyId} className="w-full p-3 border rounded-xl" required>
              <option value="">Select Faculty</option>
              {faculties.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
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


