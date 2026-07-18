"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Star, Eye, GraduationCap, BookOpen, ThumbsUp, User as UserIcon } from "lucide-react";
import api from "@/lib/api";
import { Note } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import NoteCard from "@/components/notes/NoteCard";

export default function NoteDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [ratingValue, setRatingValue] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      const { data } = await api.get(`/notes/${id}`);
      return data as { note: Note; relatedNotes: Note[] };
    },
  });

  const handleUpvote = async () => {
    if (!user) return toast.error("আপভোট দিতে লগইন করুন");
    try {
      await api.post(`/notes/${id}/upvote`);
      queryClient.invalidateQueries({ queryKey: ["note", id] });
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    }
  };

  const handleRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("রিভিউ দিতে লগইন করুন");
    setSubmitting(true);
    try {
      await api.post(`/notes/${id}/rate`, { value: ratingValue, comment });
      toast.success("রিভিউ দেওয়ার জন্য ধন্যবাদ!");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["note", id] });
    } catch {
      toast.error("রিভিউ দিতে সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-muted">লোড হচ্ছে...</div>;
  }

  if (!data?.note) {
    return <div className="max-w-4xl mx-auto px-4 py-20 text-center text-muted">নোট পাওয়া যায়নি</div>;
  }

  const { note, relatedNotes } = data;
  const authorName = typeof note.author === "object" ? note.author.name : "";
  const isUpvoted = user ? note.upvotes.includes(user.id) : false;
  const gallery = [note.imageUrl, ...(note.additionalImages || [])];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Media gallery */}
      <div className="script-card overflow-hidden mb-3">
        <img src={gallery[activeImage]} alt={note.title} className="w-full h-64 sm:h-80 object-cover" />
      </div>
      {gallery.length > 1 && (
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`shrink-0 h-16 w-20 rounded-md overflow-hidden border-2 transition-colors ${
                activeImage === i ? "border-margin" : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`${note.title} - ছবি ${i + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-margin/10 text-margin text-xs font-semibold px-2.5 py-1">
          <GraduationCap size={12} /> {note.studyClass}
        </span>
        <span className="text-xs font-semibold text-ink-soft bg-paper-alt px-2.5 py-1 rounded-full">
          {note.subject} · {note.chapter}
        </span>
      </div>
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-3">{note.title}</h1>

      <div className="flex flex-wrap items-center gap-4 text-sm text-ink-soft mb-8 pb-6 border-b border-ink/10">
        <span className="flex items-center gap-1"><UserIcon size={14} /> {authorName}</span>
        <span className="flex items-center gap-1"><Star size={14} className="text-marigold fill-marigold" /> {note.averageRating || "নতুন"} ({note.ratings.length} রিভিউ)</span>
        <span className="flex items-center gap-1"><Eye size={14} /> {note.views} বার দেখা হয়েছে</span>
        <button
          onClick={handleUpvote}
          className={`ml-auto flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            isUpvoted ? "bg-margin text-paper" : "border border-ink/15 text-ink-soft hover:border-margin"
          }`}
        >
          <ThumbsUp size={14} /> {note.upvotes.length}
        </button>
      </div>

      {/* Description / Overview */}
      <section className="mb-8">
        <h2 className="font-display text-lg font-semibold text-ink mb-2 flex items-center gap-2">
          <BookOpen size={18} className="text-margin" /> বিস্তারিত বিবরণ
        </h2>
        <p className="text-ink-soft leading-relaxed whitespace-pre-line">{note.fullDescription}</p>
      </section>

      {/* Key info */}
      <section className="mb-8 script-card p-5">
        <h2 className="font-display text-lg font-semibold text-ink mb-3">মূল তথ্য</h2>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-muted">ক্লাস</dt><dd className="font-medium text-ink">{note.studyClass}</dd></div>
          <div><dt className="text-muted">সাবজেক্ট</dt><dd className="font-medium text-ink">{note.subject}</dd></div>
          <div><dt className="text-muted">চ্যাপ্টার</dt><dd className="font-medium text-ink">{note.chapter}</dd></div>
          <div><dt className="text-muted">আপলোডের তারিখ</dt><dd className="font-medium text-ink">{new Date(note.createdAt).toLocaleDateString("bn-BD")}</dd></div>
        </dl>
        {note.fileUrl && (
          <a href={note.fileUrl} target="_blank" rel="noreferrer" className="inline-block mt-4 text-sm font-semibold text-margin hover:underline">
            ফাইল ডাউনলোড করুন →
          </a>
        )}
      </section>

      {/* Reviews */}
      <section className="mb-10">
        <h2 className="font-display text-lg font-semibold text-ink mb-3">রিভিউ ({note.ratings.length})</h2>
        <div className="space-y-4 mb-6">
          {note.ratings.length === 0 && <p className="text-sm text-muted">এখনো কোনো রিভিউ নেই, প্রথম রিভিউ দাও!</p>}
          {note.ratings.map((r, i) => {
            const ru = typeof r.user === "object" ? r.user : null;
            return (
              <div key={i} className="script-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-ink">{ru?.name || "শিক্ষার্থী"}</span>
                  <span className="flex items-center gap-1 text-xs text-marigold">
                    <Star size={12} className="fill-marigold" /> {r.value}/৫
                  </span>
                </div>
                {r.comment && <p className="text-sm text-ink-soft">{r.comment}</p>}
              </div>
            );
          })}
        </div>

        {user ? (
          <form onSubmit={handleRate} className="script-card p-4 space-y-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((v) => (
                <button type="button" key={v} onClick={() => setRatingValue(v)}>
                  <Star size={20} className={v <= ratingValue ? "text-marigold fill-marigold" : "text-ruled"} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="তোমার মতামত লিখো (ঐচ্ছিক)"
              className="w-full rounded-md border border-ink/15 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
              rows={2}
            />
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-margin text-paper text-sm font-semibold px-4 py-2 hover:bg-margin-soft transition-colors disabled:opacity-60"
            >
              {submitting ? "জমা হচ্ছে..." : "রিভিউ জমা দাও"}
            </button>
          </form>
        ) : (
          <p className="text-sm text-muted">রিভিউ দিতে <Link href="/login" className="text-margin font-semibold">লগইন করো</Link>।</p>
        )}
      </section>

      {/* Related */}
      {relatedNotes.length > 0 && (
        <section>
          <h2 className="font-display text-lg font-semibold text-ink mb-4">সম্পর্কিত নোট</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {relatedNotes.map((n) => <NoteCard key={n._id} note={n} />)}
          </div>
        </section>
      )}
    </div>
  );
}
