"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BookOpenText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", studyClass: "HSC" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2) errs.name = "নাম কমপক্ষে ২ অক্ষরের হতে হবে";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "সঠিক ইমেইল দিন";
    if (form.password.length < 6) errs.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password, form.studyClass);
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে, স্বাগতম!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "রেজিস্ট্রেশন করতে সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="text-center mb-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-margin text-paper mb-3"><BookOpenText size={24} /></span>
        <h1 className="font-display text-2xl font-bold text-ink">অ্যাকাউন্ট তৈরি করো</h1>
        <p className="text-sm text-muted mt-1">ফ্রি অ্যাকাউন্ট খুলে পড়াশোনা শুরু করো</p>
      </div>

      <div className="script-card p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">পুরো নাম</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
              placeholder="তোমার নাম"
            />
            {errors.name && <p className="text-xs text-margin mt-1">{errors.name}</p>}
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
            {errors.email && <p className="text-xs text-margin mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">ক্লাস</label>
            <select
              value={form.studyClass}
              onChange={(e) => setForm({ ...form, studyClass: e.target.value })}
              className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
            >
              <option value="HSC">HSC</option>
              <option value="SSC">SSC</option>
              <option value="Other">অন্যান্য</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">পাসওয়ার্ড</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-margin mt-1">{errors.password}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-margin text-paper font-semibold py-2.5 text-sm hover:bg-margin-soft transition-colors disabled:opacity-60"
          >
            {submitting ? "তৈরি হচ্ছে..." : "রেজিস্টার করো"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-ink/10" /><span className="text-xs text-muted">অথবা</span><div className="h-px flex-1 bg-ink/10" />
        </div>

        <GoogleAuthButton />
      </div>

      <p className="text-center text-sm text-muted mt-6">
        আগে থেকেই অ্যাকাউন্ট আছে? <Link href="/login" className="text-margin font-semibold hover:underline">লগইন করো</Link>
      </p>
    </div>
  );
}
