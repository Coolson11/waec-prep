"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { getSubjects, deleteSubject } from "@/lib/actions/super-admin";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { Loader2, Trash2 } from "lucide-react";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{isOpen: boolean, action: () => void, title: string, description: string}>({
    isOpen: false, action: () => {}, title: '', description: ''
  });

  useEffect(() => { loadSubjects(); }, []);

  async function loadSubjects() {
    setLoading(true);
    const data = await getSubjects();
    setSubjects(data);
    setLoading(false);
  }

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Code", accessor: "code" },
    { header: "Faculty", accessor: "faculty", render: (s: any) => s.faculty.name },
    { header: "Actions", accessor: "id", render: (s: any) => (
      <button
        onClick={() => setModal({
          isOpen: true,
          title: "Delete Subject",
          description: `Are you sure you want to delete ${s.name}?`,
          action: async () => { await deleteSubject(s.id); loadSubjects(); }
        })}
        className="p-2 hover:bg-rose-50 rounded-lg"
      >
        <Trash2 className="h-4 w-4 text-rose-600" />
      </button>
    )}
  ];

  if (loading) return <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-slate-900">Subject Management</h1>
      <DataTable data={subjects} columns={columns} />
      <ConfirmationModal {...modal} onClose={() => setModal({...modal, isOpen: false})} onConfirm={modal.action} />
    </div>
  );
}
