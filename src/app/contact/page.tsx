"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("সব ফিল্ড পূরণ করো");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      toast.success("তোমার মেসেজ পাঠানো হয়েছে, শীঘ্রই যোগাযোগ করব!");
      setForm({ name: "", email: "", message: "" });
      setSubmitting(false);
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl font-bold text-ink">যোগাযোগ করো</h1>
        <p className="text-muted mt-2">কোনো প্রশ্ন, পরামর্শ বা সমস্যা থাকলে আমাদের জানাও</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-10">
        <div className="space-y-5">
          <div className="script-card p-5 flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-margin/10 text-margin"><Mail size={20} /></span>
            <div>
              <p className="text-sm font-semibold text-ink">ইমেইল</p>
              <p className="text-sm text-muted">support@porashonasohayok.com</p>
            </div>
          </div>
          <div className="script-card p-5 flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-margin/10 text-margin"><Phone size={20} /></span>
            <div>
              <p className="text-sm font-semibold text-ink">ফোন</p>
              <p className="text-sm text-muted">+৮৮০ ১৭xx-xxxxxx</p>
            </div>
          </div>
          <div className="script-card p-5 flex items-center gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-margin/10 text-margin"><MapPin size={20} /></span>
            <div>
              <p className="text-sm font-semibold text-ink">ঠিকানা</p>
              <p className="text-sm text-muted">ঢাকা, বাংলাদেশ</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="script-card p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">নাম</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
              placeholder="তোমার নাম"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">ইমেইল</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">মেসেজ</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
              placeholder="তোমার প্রশ্ন বা মতামত লেখো..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 rounded-md bg-margin text-paper font-semibold py-2.5 text-sm hover:bg-margin-soft transition-colors disabled:opacity-60"
          >
            <Send size={15} /> {submitting ? "পাঠানো হচ্ছে..." : "মেসেজ পাঠাও"}
          </button>
        </form>
      </div>
    </div>
  );
}
