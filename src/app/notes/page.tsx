"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, BookX } from "lucide-react";
import api from "@/lib/api";
import { Note, PaginationInfo } from "@/types";
import NoteCard from "@/components/notes/NoteCard";
import NoteCardSkeleton from "@/components/notes/NoteCardSkeleton";
import { SUBJECTS } from "@/lib/constants";

const subjects = SUBJECTS;

function NotesExplorer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [subject, setSubject] = useState(searchParams.get("subject") || "");
  const [studyClass, setStudyClass] = useState(searchParams.get("studyClass") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setSubject(searchParams.get("subject") || "");
    setStudyClass(searchParams.get("studyClass") || "");
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", search, subject, studyClass, sort, page],
    queryFn: async () => {
      const { data } = await api.get("/notes", {
        params: { search, subject, studyClass, sort, page, limit: 8 },
      });
      return data as { notes: Note[]; pagination: PaginationInfo };
    },
  });

  const applyFilters = (overrides: Record<string, string | number> = {}) => {
    const params = new URLSearchParams();
    const state = { search, subject, studyClass, sort, page: 1, ...overrides };
    if (state.search) params.set("search", String(state.search));
    if (state.subject) params.set("subject", String(state.subject));
    if (state.studyClass) params.set("studyClass", String(state.studyClass));
    if (state.sort) params.set("sort", String(state.sort));
    if (state.page && state.page !== 1) params.set("page", String(state.page));
    router.push(`/notes?${params.toString()}`);
    if (state.page) setPage(Number(state.page));
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ page: 1 });
  };

  const goToPage = (p: number) => {
    setPage(p);
    applyFilters({ page: p });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink">নোটস এক্সপ্লোর করো</h1>
        <p className="text-muted mt-1">সাবজেক্ট, ক্লাস দিয়ে ফিল্টার করে দরকারি নোট খুঁজে নাও</p>
      </div>

      {/* Filters bar */}
      <form onSubmit={handleSearchSubmit} className="script-card p-4 sm:p-5 mb-8 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="টপিক বা টাইটেল লিখে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 rounded-md border border-ink/15 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
          />
        </div>

        <select
          value={subject}
          onChange={(e) => { setSubject(e.target.value); applyFilters({ subject: e.target.value, page: 1 }); }}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
        >
          <option value="">সব সাবজেক্ট</option>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        <select
          value={studyClass}
          onChange={(e) => { setStudyClass(e.target.value); applyFilters({ studyClass: e.target.value, page: 1 }); }}
          className="rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
        >
          <option value="">সব ক্লাস</option>
          <option value="SSC">SSC</option>
          <option value="HSC">HSC</option>
        </select>

        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={15} className="text-muted" />
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); applyFilters({ sort: e.target.value, page: 1 }); }}
            className="rounded-md border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
          >
            <option value="newest">নতুন আগে</option>
            <option value="oldest">পুরাতন আগে</option>
            <option value="rating">সর্বোচ্চ রেটিং</option>
            <option value="popular">সর্বাধিক দেখা</option>
          </select>
        </div>

        <button
          type="submit"
          className="rounded-md bg-margin text-paper text-sm font-semibold px-4 py-2 hover:bg-margin-soft transition-colors focus-ring"
        >
          খুঁজুন
        </button>
      </form>

      {isError && (
        <p className="text-center text-margin py-10">নোট লোড করতে সমস্যা হয়েছে, একটু পর আবার চেষ্টা করুন।</p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => <NoteCardSkeleton key={i} />)}
        </div>
      ) : data && data.notes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {data.notes.map((note) => <NoteCard key={note._id} note={note} />)}
          </div>

          {data.pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                disabled={page <= 1}
                onClick={() => goToPage(page - 1)}
                className="p-2 rounded-md border border-ink/15 disabled:opacity-30 hover:border-margin transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              {Array.from({ length: data.pagination.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${
                    page === i + 1 ? "bg-margin text-paper" : "border border-ink/15 text-ink-soft hover:border-margin"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page >= data.pagination.pages}
                onClick={() => goToPage(page + 1)}
                className="p-2 rounded-md border border-ink/15 disabled:opacity-30 hover:border-margin transition-colors"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20">
          <BookX size={40} className="mx-auto text-muted mb-3" />
          <p className="text-ink-soft font-medium">কোনো নোট পাওয়া যায়নি</p>
          <p className="text-sm text-muted mt-1">ফিল্টার পরিবর্তন করে আবার চেষ্টা করো</p>
        </div>
      )}
    </div>
  );
}

export default function NotesPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted">লোড হচ্ছে...</div>}>
      <NotesExplorer />
    </Suspense>
  );
}
