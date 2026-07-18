"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { LayoutDashboard, FileStack, Sparkles, MessageCircleQuestion, ArrowRight } from "lucide-react";
import api from "@/lib/api";
import { Note, FlashcardSet, ChatSessionSummary } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

function DashboardContent() {
  const { user } = useAuth();

  const { data: myNotes } = useQuery({
    queryKey: ["my-notes"],
    queryFn: async () => (await api.get("/notes/mine/all")).data.notes as Note[],
  });
  const { data: mySets } = useQuery({
    queryKey: ["my-sets"],
    queryFn: async () => (await api.get("/ai/my-sets")).data.sets as FlashcardSet[],
  });
  const { data: myChats } = useQuery({
    queryKey: ["my-chats"],
    queryFn: async () => (await api.get("/ai/chats")).data.sessions as ChatSessionSummary[],
  });

  const chartData = useMemo(() => {
    if (!mySets) return [];
    const bySubject: Record<string, number> = {};
    mySets.forEach((s) => { bySubject[s.subject] = (bySubject[s.subject] || 0) + s.cards.length; });
    return Object.entries(bySubject).map(([subject, cards]) => ({ subject, cards }));
  }, [mySets]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-margin/10 text-margin"><LayoutDashboard size={20} /></span>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">হ্যালো, {user?.name?.split(" ")[0]}!</h1>
          <p className="text-sm text-muted">তোমার পড়াশোনার অগ্রগতি এক নজরে দেখো</p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-3 gap-5 mb-10">
        <div className="script-card p-5 flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-margin/10 text-margin shrink-0"><FileStack size={20} /></span>
          <div>
            <p className="font-display text-2xl font-bold text-ink">{myNotes?.length ?? "-"}</p>
            <p className="text-xs text-muted">আপলোড করা নোট</p>
          </div>
        </div>
        <div className="script-card p-5 flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-marigold/15 text-marigold shrink-0"><Sparkles size={20} /></span>
          <div>
            <p className="font-display text-2xl font-bold text-ink">{mySets?.length ?? "-"}</p>
            <p className="text-xs text-muted">ফ্ল্যাশকার্ড/MCQ সেট</p>
          </div>
        </div>
        <div className="script-card p-5 flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-md bg-ink/10 text-ink shrink-0"><MessageCircleQuestion size={20} /></span>
          <div>
            <p className="font-display text-2xl font-bold text-ink">{myChats?.length ?? "-"}</p>
            <p className="text-xs text-muted">AI টিউটর কনভারসেশন</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="script-card p-5 mb-10">
        <h2 className="font-display text-lg font-semibold text-ink mb-4">সাবজেক্ট অনুযায়ী জেনারেটেড কার্ড</h2>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#c7d1e0" />
              <XAxis dataKey="subject" tick={{ fontSize: 12, fill: "#6b7280" }} />
              <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, borderColor: "#c7d1e0" }} />
              <Bar dataKey="cards" fill="#c0392b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-muted py-10 text-center">এখনো কোনো ফ্ল্যাশকার্ড জেনারেট করোনি। <Link href="/flashcards" className="text-margin font-semibold">শুরু করো →</Link></p>
        )}
      </div>

      {/* Recent activity */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="script-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-ink">সাম্প্রতিক ফ্ল্যাশকার্ড সেট</h2>
            <Link href="/flashcards" className="text-xs font-semibold text-margin flex items-center gap-1">সব <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-2">
            {mySets?.slice(0, 5).map((s) => (
              <div key={s._id} className="flex items-center justify-between text-sm py-1.5 border-b border-ink/5 last:border-none">
                <span className="text-ink-soft truncate">{s.topic}</span>
                <span className="text-xs text-muted shrink-0">{s.cards.length} কার্ড</span>
              </div>
            ))}
            {mySets?.length === 0 && <p className="text-xs text-muted">কোনো সেট নেই</p>}
          </div>
        </div>

        <div className="script-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-base font-semibold text-ink">সাম্প্রতিক AI টিউটর চ্যাট</h2>
            <Link href="/ai-tutor" className="text-xs font-semibold text-margin flex items-center gap-1">সব <ArrowRight size={12} /></Link>
          </div>
          <div className="space-y-2">
            {myChats?.slice(0, 5).map((c) => (
              <div key={c._id} className="text-sm py-1.5 border-b border-ink/5 last:border-none text-ink-soft truncate">
                {c.title}
              </div>
            ))}
            {myChats?.length === 0 && <p className="text-xs text-muted">কোনো চ্যাট নেই</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
