"use client";

import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Eye, Star, Trash2, FolderKanban, Plus } from "lucide-react";
import api from "@/lib/api";
import { Note } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";

function ManageNotesContent() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["my-notes"],
    queryFn: async () => {
      const { data } = await api.get("/notes/mine/all");
      return data.notes as Note[];
    },
  });

  const handleDelete = async (id: string) => {
    if (!confirm("তুমি কি নিশ্চিত এই নোটটি ডিলিট করতে চাও?")) return;
    try {
      await api.delete(`/notes/${id}`);
      toast.success("নোট ডিলিট হয়ে গেছে");
      queryClient.invalidateQueries({ queryKey: ["my-notes"] });
    } catch {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-margin/10 text-margin"><FolderKanban size={20} /></span>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">আমার নোট ম্যানেজ করো</h1>
            <p className="text-sm text-muted">তোমার আপলোড করা নোটসগুলো দেখো ও ডিলিট করো</p>
          </div>
        </div>
        <Link href="/notes/add" className="inline-flex items-center gap-1.5 rounded-md bg-margin text-paper text-sm font-semibold px-4 py-2.5 hover:bg-margin-soft transition-colors">
          <Plus size={16} /> নতুন নোট
        </Link>
      </div>

      {isLoading ? (
        <p className="text-center text-muted py-16">লোড হচ্ছে...</p>
      ) : data && data.length > 0 ? (
        <div className="script-card overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-ink/10 text-left text-muted">
                <th className="p-4 font-medium">টাইটেল</th>
                <th className="p-4 font-medium">সাবজেক্ট</th>
                <th className="p-4 font-medium">রেটিং</th>
                <th className="p-4 font-medium">ভিউ</th>
                <th className="p-4 font-medium text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody>
              {data.map((note) => (
                <tr key={note._id} className="border-b border-ink/5 last:border-none hover:bg-paper-alt/50">
                  <td className="p-4 font-medium text-ink max-w-xs truncate">{note.title}</td>
                  <td className="p-4 text-ink-soft">{note.subject}</td>
                  <td className="p-4 text-ink-soft"><span className="flex items-center gap-1"><Star size={12} className="text-marigold fill-marigold" /> {note.averageRating || "-"}</span></td>
                  <td className="p-4 text-ink-soft"><span className="flex items-center gap-1"><Eye size={12} /> {note.views}</span></td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/notes/${note._id}`} className="text-margin hover:underline text-xs font-semibold">দেখুন</Link>
                      <button onClick={() => handleDelete(note._id)} className="text-muted hover:text-margin">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-20 script-card">
          <p className="text-ink-soft font-medium mb-2">তুমি এখনো কোনো নোট আপলোড করোনি</p>
          <Link href="/notes/add" className="text-margin font-semibold text-sm hover:underline">প্রথম নোট আপলোড করো →</Link>
        </div>
      )}
    </div>
  );
}

export default function ManageNotesPage() {
  return (
    <ProtectedRoute>
      <ManageNotesContent />
    </ProtectedRoute>
  );
}
