"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Search, Sparkles, MessageCircleQuestion, Users, FileStack,
  Atom, FlaskConical, Calculator, Dna, Languages, Landmark, ArrowRight,
  UploadCloud, Wand2, GraduationCap,
} from "lucide-react";
import api from "@/lib/api";
import { Note } from "@/types";
import NoteCard from "@/components/notes/NoteCard";
import NoteCardSkeleton from "@/components/notes/NoteCardSkeleton";
import Testimonials from "@/components/home/Testimonials";
import FaqSection from "@/components/home/FaqSection";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/motion/Reveal";
import AnimatedCounter from "@/components/motion/AnimatedCounter";

const subjects = [
  { name: "পদার্থবিজ্ঞান", en: "Physics", icon: Atom },
  { name: "রসায়ন", en: "Chemistry", icon: FlaskConical },
  { name: "উচ্চতর গণিত", en: "Higher Math", icon: Calculator },
  { name: "জীববিজ্ঞান", en: "Biology", icon: Dna },
  { name: "ইংরেজি", en: "English", icon: Languages },
  { name: "বাংলাদেশ স্টাডিজ", en: "Bangladesh Studies", icon: Landmark },
];

export default function HomePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [studyClass, setStudyClass] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["popular-notes"],
    queryFn: async () => {
      const { data } = await api.get("/notes", { params: { sort: "popular", limit: 4 } });
      return data.notes as Note[];
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const { data } = await api.get("/stats");
      return data.stats as { noteCount: number; userCount: number; chatCount: number; flashcardCount: number };
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (studyClass) params.set("studyClass", studyClass);
    router.push(`/notes?${params.toString()}`);
  };

  return (
    <div>
      {/* HERO — styled like a board-exam answer script cover page */}
      <section className="relative overflow-hidden ruled-paper border-b border-ink/10" style={{ minHeight: "68vh" }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 flex flex-col justify-center min-h-[68vh]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="script-card margin-line px-6 py-8 sm:px-10 sm:py-10"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="pl-16 text-xs tracking-widest font-mono text-margin uppercase mb-2"
            >
              উত্তরপত্র · Porashona Sohayok
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.55 }}
              className="pl-16 font-display text-3xl sm:text-5xl font-extrabold text-ink leading-tight"
            >
              তোমার HSC-SSC প্রস্তুতির <span className="text-margin">সহায়ক খাতা</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.55 }}
              className="pl-16 mt-4 text-ink-soft text-base sm:text-lg max-w-xl leading-relaxed"
            >
              হাজারো শিক্ষার্থীর শেয়ার করা নোটস ঘাঁটো, আর AI টিউটর ও ফ্ল্যাশকার্ড জেনারেটর দিয়ে
              যেকোনো টপিক মুহূর্তেই বুঝে ফেলো।
            </motion.p>

            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.42, duration: 0.55 }}
              onSubmit={handleSearch}
              className="pl-16 mt-7 flex flex-col sm:flex-row gap-2 max-w-xl"
            >
              <div className="relative flex-1">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="যেমন: নিউটনের সূত্র, Tense, ত্রিকোণমিতি..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-md border border-ink/15 bg-paper text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
                />
              </div>
              <select
                value={studyClass}
                onChange={(e) => setStudyClass(e.target.value)}
                className="rounded-md border border-ink/15 bg-paper px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40"
              >
                <option value="">সব ক্লাস</option>
                <option value="SSC">SSC</option>
                <option value="HSC">HSC</option>
              </select>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-margin text-paper font-semibold px-5 py-2.5 text-sm hover:bg-margin-soft transition-colors focus-ring"
              >
                খুঁজুন <ArrowRight size={15} />
              </motion.button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.5 }}
              className="pl-16 mt-6 flex flex-wrap gap-2 text-xs text-muted"
            >
              <span>জনপ্রিয়:</span>
              {["নিউটনের সূত্র", "Tense", "কোষ বিভাজন", "জৈব রসায়ন"].map((t) => (
                <button
                  key={t}
                  onClick={() => router.push(`/notes?search=${encodeURIComponent(t)}`)}
                  className="underline decoration-dotted hover:text-margin"
                >
                  {t}
                </button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* STATS — marksheet style, real numbers from the database */}
      <section className="border-b border-ink/10 bg-ink text-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: "শেয়ারকৃত নোট", value: stats?.noteCount ?? 0 },
            { label: "নিবন্ধিত শিক্ষার্থী", value: stats?.userCount ?? 0 },
            { label: "AI টিউটর কনভারসেশন", value: stats?.chatCount ?? 0 },
            { label: "জেনারেটেড কার্ড", value: stats?.flashcardCount ?? 0 },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl sm:text-3xl font-bold text-marigold">
                <AnimatedCounter value={s.value} />
              </p>
              <p className="text-xs sm:text-sm text-paper/70 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SUBJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">বিষয় অনুযায়ী খুঁজুন</h2>
          <p className="text-muted mt-2">তোমার প্রয়োজনীয় বিষয়ে সরাসরি চলে যাও</p>
        </Reveal>
        <StaggerGroup className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {subjects.map((s) => (
            <StaggerItem key={s.en}>
              <Link
                href={`/notes?subject=${encodeURIComponent(s.en)}`}
                className="script-card flex flex-col items-center justify-center gap-2 py-6 h-full hover:-translate-y-1.5 hover:shadow-lg hover:border-margin/40 transition-all duration-200 focus-ring"
              >
                <s.icon size={26} className="text-margin" />
                <span className="text-sm font-medium text-ink text-center">{s.name}</span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* FEATURES */}
      <section className="bg-paper-alt border-y border-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Reveal className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">যা যা পাবে</h2>
            <p className="text-muted mt-2">পড়াশোনাকে সহজ করার জন্য যা যা দরকার, সব একসাথে</p>
          </Reveal>
          <StaggerGroup className="grid gap-6 sm:grid-cols-3">
            <StaggerItem className="script-card p-6 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200">
              <FileStack className="text-margin mb-3" size={26} />
              <h3 className="font-display font-semibold text-ink mb-1.5">নোটস শেয়ারিং</h3>
              <p className="text-sm text-muted leading-relaxed">
                সাবজেক্ট ও চ্যাপ্টার অনুযায়ী নোট খুঁজে পড়ো, নিজের নোটও আপলোড করে অন্যদের সাহায্য করো।
              </p>
            </StaggerItem>
            <StaggerItem className="script-card p-6 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200">
              <Sparkles className="text-margin mb-3" size={26} />
              <h3 className="font-display font-semibold text-ink mb-1.5">AI ফ্ল্যাশকার্ড ও MCQ</h3>
              <p className="text-sm text-muted leading-relaxed">
                যেকোনো টপিক লিখে দাও, AI সেকেন্ডেই ফ্ল্যাশকার্ড বা MCQ সেট বানিয়ে দেবে রিভিশনের জন্য।
              </p>
            </StaggerItem>
            <StaggerItem className="script-card p-6 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-200">
              <MessageCircleQuestion className="text-margin mb-3" size={26} />
              <h3 className="font-display font-semibold text-ink mb-1.5">AI টিউটর</h3>
              <p className="text-sm text-muted leading-relaxed">
                রাত-বিরাতে যেকোনো প্রশ্ন করো, স্ট্রিমিং রেসপন্সে ধাপে ধাপে বুঝিয়ে দেবে AI টিউটর।
              </p>
            </StaggerItem>
          </StaggerGroup>
        </div>
      </section>

      {/* POPULAR NOTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">জনপ্রিয় নোটস</h2>
            <p className="text-muted mt-1">সবচেয়ে বেশি দেখা নোটসগুলো দেখে নাও</p>
          </div>
          <Link href="/notes" className="text-sm font-semibold text-margin hover:text-margin-soft flex items-center gap-1 shrink-0">
            সব দেখুন <ArrowRight size={14} />
          </Link>
        </Reveal>
        <StaggerGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <NoteCardSkeleton key={i} />)
            : data?.map((note) => (
                <StaggerItem key={note._id}>
                  <NoteCard note={note} />
                </StaggerItem>
              ))}
        </StaggerGroup>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-ink text-paper">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Reveal className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">কীভাবে শুরু করবে</h2>
            <p className="text-paper/70 mt-2">মাত্র ৩ ধাপে তোমার পড়াশোনা সহজ করো</p>
          </Reveal>
          <StaggerGroup className="grid gap-8 sm:grid-cols-3" staggerDelay={0.15}>
            {[
              { step: "০১", title: "অ্যাকাউন্ট খোলো", desc: "কয়েক সেকেন্ডেই রেজিস্টার করো, অথবা Google দিয়ে সরাসরি লগইন করো।", icon: Users },
              { step: "০২", title: "নোট খুঁজো বা আপলোড করো", desc: "প্রয়োজনীয় নোট খুঁজে পড়ো, নিজের নোটও শেয়ার করো।", icon: UploadCloud },
              { step: "০৩", title: "AI দিয়ে রিভিশন দাও", desc: "ফ্ল্যাশকার্ড জেনারেট করো অথবা AI টিউটরের সাথে চ্যাট করো।", icon: Wand2 },
            ].map((s) => (
              <StaggerItem key={s.step} className="text-center">
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-marigold text-ink font-display font-bold mb-4"
                >
                  {s.step}
                </motion.div>
                <s.icon size={22} className="mx-auto text-marigold mb-2" />
                <h3 className="font-display font-semibold mb-1.5">{s.title}</h3>
                <p className="text-sm text-paper/70 leading-relaxed max-w-xs mx-auto">{s.desc}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Reveal className="text-center mb-10">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">শিক্ষার্থীরা যা বলে</h2>
          <p className="text-muted mt-2">সারাদেশের শিক্ষার্থীদের অভিজ্ঞতা</p>
        </Reveal>
        <Reveal delay={0.1}>
          <Testimonials />
        </Reveal>
      </section>

      {/* FAQ */}
      <section className="bg-paper-alt border-y border-ink/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Reveal className="text-center mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">সাধারণ জিজ্ঞাসা</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <FaqSection />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <Reveal>
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <GraduationCap size={36} className="mx-auto text-margin mb-4" />
          </motion.div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink">আজই শুরু করো তোমার প্রস্তুতি</h2>
          <p className="text-muted mt-3 max-w-lg mx-auto">
            বিনামূল্যে অ্যাকাউন্ট খুলে নোটস, AI টিউটর ও ফ্ল্যাশকার্ড জেনারেটর ব্যবহার শুরু করো এখনই।
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/register" className="inline-block rounded-md bg-margin text-paper font-semibold px-6 py-3 text-sm hover:bg-margin-soft transition-colors focus-ring">
                ফ্রি অ্যাকাউন্ট খুলুন
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link href="/notes" className="inline-block rounded-md border border-ink/20 text-ink font-semibold px-6 py-3 text-sm hover:border-margin hover:text-margin transition-colors focus-ring">
                নোটস দেখুন
              </Link>
            </motion.div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
