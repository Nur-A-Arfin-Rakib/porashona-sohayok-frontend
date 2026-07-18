"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Sparkles, RefreshCw, Trash2, ChevronLeft, ChevronRight, ListChecks, Layers } from "lucide-react";
import api from "@/lib/api";
import { FlashcardSet } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";
import { SUBJECTS } from "@/lib/constants";

const subjects = SUBJECTS;

function FlashcardsContent() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    topic: "",
    subject: "Physics",
    studyClass: "HSC",
    difficulty: "Medium",
    type: "flashcard" as "flashcard" | "mcq",
    count: 5,
  });
  const [generating, setGenerating] = useState(false);
  const [activeSet, setActiveSet] = useState<FlashcardSet | null>(null);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const { data: sets, isLoading } = useQuery({
    queryKey: ["my-sets"],
    queryFn: async () => {
      const { data } = await api.get("/ai/my-sets");
      return data.sets as FlashcardSet[];
    },
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) return toast.error("টপিক লিখো");
    setGenerating(true);
    try {
      const { data } = await api.post("/ai/generate-cards", form);
      toast.success(`${form.count}টা ${form.type === "mcq" ? "MCQ" : "ফ্ল্যাশকার্ড"} তৈরি হয়েছে!`);
      queryClient.invalidateQueries({ queryKey: ["my-sets"] });
      openSet(data.set);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "জেনারেট করতে সমস্যা হয়েছে, আবার চেষ্টা করো");
    } finally {
      setGenerating(false);
    }
  };

  const openSet = (set: FlashcardSet) => {
    setActiveSet(set);
    setCardIndex(0);
    setFlipped(false);
    setAnswers({});
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই সেটটি ডিলিট করতে চাও?")) return;
    try {
      await api.delete(`/ai/sets/${id}`);
      queryClient.invalidateQueries({ queryKey: ["my-sets"] });
      if (activeSet?._id === id) setActiveSet(null);
      toast.success("ডিলিট হয়ে গেছে");
    } catch {
      toast.error("ডিলিট করতে সমস্যা হয়েছে");
    }
  };

  const regenerate = () => handleGenerate({ preventDefault: () => {} } as React.FormEvent);

  const nextCard = () => {
    if (!activeSet) return;
    setFlipped(false);
    setCardIndex((i) => Math.min(i + 1, activeSet.cards.length - 1));
  };
  const prevCard = () => {
    setFlipped(false);
    setCardIndex((i) => Math.max(i - 1, 0));
  };

  const currentCard = activeSet?.cards[cardIndex];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-margin/10 text-margin"><Sparkles size={20} /></span>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">AI ফ্ল্যাশকার্ড ও MCQ জেনারেটর</h1>
          <p className="text-sm text-muted">যেকোনো টপিক লিখে দাও, AI মুহূর্তেই স্টাডি কার্ড তৈরি করে দেবে</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* Generator form */}
        <div className="script-card p-5 h-fit">
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">টপিক / চ্যাপ্টার</label>
              <input
                value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="যেমন: নিউটনের গতিসূত্র"
                className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">ক্লাস</label>
                <select value={form.studyClass} onChange={(e) => setForm({ ...form, studyClass: e.target.value })} className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm">
                  <option value="HSC">HSC</option>
                  <option value="SSC">SSC</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">সাবজেক্ট</label>
                <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm">
                  {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">ডিফিকাল্টি</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm">
                  <option value="Easy">সহজ</option>
                  <option value="Medium">মাঝারি</option>
                  <option value="Hard">কঠিন</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-1.5">সংখ্যা</label>
                <select value={form.count} onChange={(e) => setForm({ ...form, count: Number(e.target.value) })} className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm">
                  {[5, 10, 15].map((n) => <option key={n} value={n}>{n}টা</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1.5">ধরন</label>
              <div className="grid grid-cols-2 gap-2">
                <button type="button" onClick={() => setForm({ ...form, type: "flashcard" })} className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium border transition-colors ${form.type === "flashcard" ? "bg-margin text-paper border-margin" : "border-ink/15 text-ink-soft"}`}>
                  <Layers size={14} /> ফ্ল্যাশকার্ড
                </button>
                <button type="button" onClick={() => setForm({ ...form, type: "mcq" })} className={`flex items-center justify-center gap-1.5 rounded-md py-2 text-sm font-medium border transition-colors ${form.type === "mcq" ? "bg-margin text-paper border-margin" : "border-ink/15 text-ink-soft"}`}>
                  <ListChecks size={14} /> MCQ
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={generating}
              className="w-full flex items-center justify-center gap-2 rounded-md bg-margin text-paper font-semibold py-2.5 text-sm hover:bg-margin-soft transition-colors disabled:opacity-60"
            >
              <Sparkles size={16} /> {generating ? "জেনারেট হচ্ছে..." : "জেনারেট করো"}
            </button>
          </form>

          <div className="torn-divider my-5" />
          <h3 className="text-sm font-semibold text-ink mb-3">তোমার সংরক্ষিত সেট</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {isLoading && <p className="text-xs text-muted">লোড হচ্ছে...</p>}
            {sets?.map((s) => (
              <div key={s._id} className={`flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer border ${activeSet?._id === s._id ? "border-margin bg-margin/5" : "border-ink/10 hover:border-margin/40"}`} onClick={() => openSet(s)}>
                <span className="truncate text-ink-soft">{s.topic}</span>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(s._id); }} className="text-muted hover:text-margin shrink-0 ml-2">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {sets?.length === 0 && <p className="text-xs text-muted">এখনো কোনো সেট তৈরি করোনি</p>}
          </div>
        </div>

        {/* Viewer */}
        <div>
          {!activeSet ? (
            <div className="script-card flex flex-col items-center justify-center py-24 text-center">
              <Sparkles size={32} className="text-muted mb-3" />
              <p className="text-ink-soft font-medium">একটা টপিক লিখে জেনারেট করো, অথবা আগের কোনো সেট বাছাই করো</p>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink">{activeSet.topic}</h2>
                  <p className="text-xs text-muted">{activeSet.subject} · {activeSet.studyClass} · {activeSet.difficulty} · কার্ড {cardIndex + 1}/{activeSet.cards.length}</p>
                </div>
                <button onClick={regenerate} disabled={generating} className="flex items-center gap-1.5 text-sm font-medium text-margin hover:underline disabled:opacity-50">
                  <RefreshCw size={14} className={generating ? "animate-spin" : ""} /> রিজেনারেট
                </button>
              </div>

              {activeSet.type === "flashcard" ? (
                <div
                  onClick={() => setFlipped(!flipped)}
                  className="script-card cursor-pointer h-72 flex items-center justify-center p-8 text-center select-none"
                >
                  <div>
                    <span className="text-xs font-mono text-muted uppercase tracking-widest">{flipped ? "উত্তর" : "প্রশ্ন"}</span>
                    <p className="mt-3 font-display text-xl text-ink leading-relaxed">
                      {flipped ? currentCard?.answer : currentCard?.question}
                    </p>
                    <p className="mt-4 text-xs text-muted">কার্ডে ক্লিক করে উল্টাও</p>
                  </div>
                </div>
              ) : (
                <div className="script-card p-8">
                  <div className="flex items-center justify-between mb-5 gap-3">
                    <p className="font-display text-lg text-ink">{currentCard?.question}</p>
                    <span className="shrink-0 text-sm font-semibold text-margin bg-margin/10 rounded-full px-3 py-1">
                      স্কোর: {Object.keys(answers).filter((k) => activeSet.cards[Number(k)] && answers[Number(k)] === activeSet.cards[Number(k)].correctOptionIndex).length}/{activeSet.cards.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {currentCard?.options?.map((opt, i) => {
                      const isCorrect = i === currentCard.correctOptionIndex;
                      const selected = answers[cardIndex];
                      const isSelected = selected === i;
                      let style = "border-ink/15 hover:border-margin/40";
                      if (selected !== undefined) {
                        if (isCorrect) style = "border-green-600 bg-green-50 text-green-800";
                        else if (isSelected) style = "border-margin bg-margin/5 text-margin";
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => setAnswers({ ...answers, [cardIndex]: i })}
                          disabled={selected !== undefined}
                          className={`w-full text-left rounded-md border px-4 py-2.5 text-sm transition-colors ${style}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {answers[cardIndex] !== undefined && (
                    <p className="mt-4 text-sm text-ink-soft bg-paper-alt rounded-md p-3">{currentCard?.answer}</p>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mt-4">
                <button onClick={prevCard} disabled={cardIndex === 0} className="flex items-center gap-1 text-sm text-ink-soft disabled:opacity-30"><ChevronLeft size={16} /> আগেরটা</button>
                <button onClick={nextCard} disabled={cardIndex === activeSet.cards.length - 1} className="flex items-center gap-1 text-sm text-ink-soft disabled:opacity-30">পরেরটা <ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FlashcardsPage() {
  return (
    <ProtectedRoute>
      <FlashcardsContent />
    </ProtectedRoute>
  );
}