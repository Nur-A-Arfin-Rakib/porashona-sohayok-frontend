import { Star } from "lucide-react";

const testimonials = [
  {
    name: "সাদিয়া আক্তার",
    role: "HSC ২০২৬, বিজ্ঞান বিভাগ",
    quote:
      "রাত ১২টায় পদার্থবিজ্ঞানের একটা টপিক বুঝতে না পেরে AI টিউটরকে জিজ্ঞেস করেছিলাম, সাথে সাথেই ধাপে ধাপে বুঝিয়ে দিল। এখন এটা আমার নিয়মিত পড়ার সঙ্গী।",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Sadia",
  },
  {
    name: "তানভীর হোসেন",
    role: "SSC ২০২৭",
    quote:
      "পরীক্ষার আগের রাতে ফ্ল্যাশকার্ড জেনারেটর দিয়ে দ্রুত রিভিশন দিতে পারি। MCQ অপশনটা মূল বই থেকে যেভাবে প্রশ্ন আসে, প্রায় সেভাবেই তৈরি হয়।",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Tanvir",
  },
  {
    name: "নুসরাত জাহান",
    role: "HSC ২০২৫, মানবিক বিভাগ",
    quote:
      "অন্য শিক্ষার্থীদের আপলোড করা নোটগুলো থেকে অনেক নতুন দৃষ্টিকোণ পাই, যা শুধু বই পড়ে পেতাম না।",
    avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Nusrat",
  },
];

export default function Testimonials() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials.map((t) => (
        <div key={t.name} className="script-card p-5 flex flex-col">
          <div className="flex text-marigold mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className="fill-marigold" />
            ))}
          </div>
          <p className="text-sm text-ink-soft leading-relaxed flex-1">"{t.quote}"</p>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-ink/10">
            <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full bg-paper-alt" />
            <div>
              <p className="text-sm font-semibold text-ink">{t.name}</p>
              <p className="text-xs text-muted">{t.role}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
