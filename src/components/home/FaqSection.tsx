"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "পড়াশোনা সহায়ক ব্যবহার করতে কি টাকা লাগে?",
    a: "না, নোটস ব্রাউজ করা, AI টিউটরের সাথে চ্যাট করা এবং ফ্ল্যাশকার্ড/MCQ জেনারেট করা— সবকিছুই সম্পূর্ণ ফ্রি।",
  },
  {
    q: "AI টিউটর কি ভুল উত্তর দিতে পারে?",
    a: "AI টিউটর সাধারণত নির্ভরযোগ্য উত্তর দেয়, তবে যেকোনো AI-এর মতোই মাঝে মাঝে ভুল হতে পারে। গুরুত্বপূর্ণ তথ্যের জন্য সবসময় বইয়ের সাথে মিলিয়ে নেওয়া ভালো অভ্যাস।",
  },
  {
    q: "আমি কি নিজের বানানো নোট শেয়ার করতে পারব?",
    a: "অবশ্যই! লগইন করে 'নোট যোগ করুন' পেজ থেকে আপনি আপনার নিজের নোট আপলোড করে অন্য শিক্ষার্থীদের সাহায্য করতে পারবেন।",
  },
  {
    q: "ফ্ল্যাশকার্ড জেনারেটর কীভাবে কাজ করে?",
    a: "আপনি একটা টপিক লিখে দিলে, ক্লাস ও ডিফিকাল্টি সিলেক্ট করলে AI স্বয়ংক্রিয়ভাবে সেই টপিকের ওপর ফ্ল্যাশকার্ড বা MCQ তৈরি করে দেয়, যেগুলো আপনি নিজের ড্যাশবোর্ডে সেভ করে রাখতে পারবেন।",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto divide-y divide-ink/10">
      {faqs.map((item, i) => (
        <div key={i} className="py-4">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between text-left gap-4 focus-ring rounded-sm"
            aria-expanded={openIndex === i}
          >
            <span className="font-medium text-ink">{item.q}</span>
            <ChevronDown
              size={18}
              className={`shrink-0 text-margin transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""}`}
            />
          </button>
          {openIndex === i && (
            <p className="mt-2.5 text-sm text-muted leading-relaxed pr-6">{item.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
