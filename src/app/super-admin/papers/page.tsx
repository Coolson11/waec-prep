"use client";
import { useState, useEffect } from "react";
import { DataTable } from "@/components/admin/DataTable";
import { getPapers, deletePaper } from "@/lib/actions/super-admin";
import { ConfirmationModal } from "@/components/admin/ConfirmationModal";
import { Loader2, Trash2 } from "lucide-react";

export default function PapersPage() {
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [modal, setModal] = useState<{isOpen: boolean, action: () => void, title: string, description: string}>({
    isOpen: false, action: () => {}, title: '', description: ''
  });

  useEffect(() => { loadPapers(); }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function loadPapers() {
    setLoading(true);
    const data = await getPapers();
    setPapers(data);
    setLoading(false);
  }

  const columns = [
    { header: "Title", accessor: "title" },
    { header: "Subject", accessor: "subject", render: (p: any) => p.subject.name },
    { header: "Type", accessor: "paperType" },
    { header: "Actions", accessor: "id", render: (p: any) => (
      <button
        onClick={() => setModal({
          isOpen: true,
          title: "Delete Paper",
          description: `Are you sure you want to delete ${p.title}?`,
          action: async () => { 
            try {
              await deletePaper(p.id); 
              setNotification({type: 'success', message: "Paper deleted"});
              loadPapers(); 
            } catch (err: any) {
              setNotification({type: 'error', message: err.message || "Something went wrong"});
            }
          }
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
      {notification && (
        <div className={`p-4 rounded-xl text-white font-bold ${notification.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
          {notification.message}
        </div>
      )}
      <h1 className="text-2xl font-black text-slate-900">Paper Management</h1>
      <DataTable data={papers} columns={columns} />
      <ConfirmationModal {...modal} onClose={() => setModal({...modal, isOpen: false})} onConfirm={modal.action} />
    </div>
  );
}

