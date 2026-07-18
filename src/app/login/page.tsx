"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BookOpenText, Wand2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import GoogleAuthButton from "@/components/GoogleAuthButton";

export default function LoginPage() {
  const { login, demoLogin } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const validate = () => {
    const errs: typeof errors = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = "সঠিক ইমেইল দিন";
    if (password.length < 6) errs.password = "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("লগইন সফল হয়েছে!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "লগইন করতে সমস্যা হয়েছে");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async () => {
    setDemoLoading(true);
    try {
      await demoLogin();
      toast.success("ডেমো অ্যাকাউন্টে লগইন সফল হয়েছে!");
      router.push("/dashboard");
    } catch {
      toast.error("ডেমো লগইন করতে সমস্যা হয়েছে");
    } finally {
      setDemoLoading(false);
    }
  };

  // Demo credential auto-fill button (fills the form; user can then submit, or we log in directly via handleDemo)
  const autoFillDemo = () => {
    setEmail("demo@porashonasohayok.com");
    setPassword("Demo@1234");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="text-center mb-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-margin text-paper mb-3"><BookOpenText size={24} /></span>
        <h1 className="font-display text-2xl font-bold text-ink">আবার স্বাগতম</h1>
        <p className="text-sm text-muted mt-1">তোমার অ্যাকাউন্টে লগইন করো</p>
      </div>

      <div className="script-card p-6">
        <button
          onClick={handleDemo}
          disabled={demoLoading}
          className="w-full flex items-center justify-center gap-2 rounded-md border border-marigold bg-marigold/10 text-ink font-semibold py-2.5 text-sm hover:bg-marigold/20 transition-colors disabled:opacity-60 mb-3"
        >
          <Wand2 size={16} /> {demoLoading ? "লগইন হচ্ছে..." : "ডেমো অ্যাকাউন্টে লগইন করো"}
        </button>
        <button
          type="button"
          onClick={autoFillDemo}
          className="w-full text-xs text-muted hover:text-margin mb-4"
        >
          অথবা ডেমো ক্রেডেনশিয়াল ফর্মে বসাও
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px flex-1 bg-ink/10" /><span className="text-xs text-muted">অথবা</span><div className="h-px flex-1 bg-ink/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">ইমেইল</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-margin mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1.5">পাসওয়ার্ড</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {submitting ? "লগইন হচ্ছে..." : "লগইন করো"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-ink/10" /><span className="text-xs text-muted">অথবা</span><div className="h-px flex-1 bg-ink/10" />
        </div>

        <GoogleAuthButton />
      </div>

      <p className="text-center text-sm text-muted mt-6">
        অ্যাকাউন্ট নেই? <Link href="/register" className="text-margin font-semibold hover:underline">রেজিস্টার করো</Link>
      </p>
    </div>
  );
}
