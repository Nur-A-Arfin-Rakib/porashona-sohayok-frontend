"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FilePlus2, X, ImagePlus } from "lucide-react";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import ImageUploader from "@/components/notes/ImageUploader";
import { SUBJECTS } from "@/lib/constants";

const subjects = SUBJECTS;

function AddNoteForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    subject: "",
    studyClass: "HSC",
    chapter: "",
    imageUrl: "",
    fileUrl: "",
  });
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const addExtraImage = (url: string) => {
    if (!url.trim()) return;
    if (additionalImages.length >= 6) {
      toast.error("সর্বোচ্চ ৬টা অতিরিক্ত ছবি যোগ করা যাবে");
      return;
    }
    setAdditionalImages((prev) => [...prev, url]);
  };

  const removeExtraImage = (index: number) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.shortDescription || !form.fullDescription || !form.subject || !form.chapter) {
      toast.error("দয়া করে সব প্রয়োজনীয় ফিল্ড পূরণ করুন");
      return;
    }
    setSubmitting(true);
    try {
      const { data } = await api.post("/notes", { ...form, additionalImages });
      toast.success("নোট সফলভাবে আপলোড হয়েছে!");
      router.push(`/notes/${data.note._id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "নোট আপলোড করতে সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-margin/10 text-margin"><FilePlus2 size={20} /></span>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">নতুন নোট আপলোড করো</h1>
          <p className="text-sm text-muted">তোমার নোট শেয়ার করে অন্যদের সাহায্য করো</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="script-card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">টাইটেল *</label>
          <input
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="যেমন: নিউটনের গতিসূত্র - সহজ ব্যাখ্যা"
            className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">ক্লাস *</label>
            <select
              value={form.studyClass}
              onChange={(e) => update("studyClass", e.target.value)}
              className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
            >
              <option value="HSC">HSC</option>
              <option value="SSC">SSC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">সাবজেক্ট *</label>
            <select
              value={form.subject}
              onChange={(e) => update("subject", e.target.value)}
              className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
            >
              <option value="">সাবজেক্ট বাছাই করো</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">চ্যাপ্টার *</label>
          <input
            value={form.chapter}
            onChange={(e) => update("chapter", e.target.value)}
            placeholder="যেমন: গতি ও বল"
            className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">সংক্ষিপ্ত বিবরণ *</label>
          <input
            value={form.shortDescription}
            onChange={(e) => update("shortDescription", e.target.value)}
            maxLength={200}
            placeholder="১-২ লাইনে নোটের সারমর্ম"
            className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">বিস্তারিত বিবরণ *</label>
          <textarea
            value={form.fullDescription}
            onChange={(e) => update("fullDescription", e.target.value)}
            rows={6}
            placeholder="নোটের পূর্ণ বিবরণ লেখো..."
            className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
          />
        </div>

        <ImageUploader
          label="প্রচ্ছদ ছবি (ঐচ্ছিক)"
          value={form.imageUrl}
          onChange={(url) => update("imageUrl", url)}
        />

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5 flex items-center gap-1.5">
            <ImagePlus size={15} /> আরও ছবি যোগ করো (ঐচ্ছিক গ্যালারি, সর্বোচ্চ ৬টা)
          </label>

          {additionalImages.length > 0 && (
            <div className="mb-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
              {additionalImages.map((url, i) => (
                <div key={i} className="relative group">
                  <img src={url} alt={`অতিরিক্ত ছবি ${i + 1}`} className="h-16 w-full object-cover rounded-md border border-ink/10" />
                  <button
                    type="button"
                    onClick={() => removeExtraImage(i)}
                    className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-margin text-paper opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="ছবি সরাও"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {additionalImages.length < 6 && (
            <ImageUploader
              value=""
              height="h-24"
              onChange={(url) => { if (url) addExtraImage(url); }}
            />
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1.5">ফাইলের লিংক (ঐচ্ছিক - PDF/Doc)</label>
          <input
            value={form.fileUrl}
            onChange={(e) => update("fileUrl", e.target.value)}
            placeholder="https://drive.google.com/..."
            className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-margin text-paper font-semibold py-3 text-sm hover:bg-margin-soft transition-colors disabled:opacity-60"
        >
          {submitting ? "আপলোড হচ্ছে..." : "নোট সাবমিট করো"}
        </button>
      </form>
    </div>
  );
}

export default function AddNotePage() {
  return (
    <ProtectedRoute>
      <AddNoteForm />
    </ProtectedRoute>
  );
}
