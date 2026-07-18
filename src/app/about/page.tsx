import { GraduationCap, Target, Users, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div>
      <section className="ruled-paper border-b border-ink/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <GraduationCap size={36} className="mx-auto text-margin mb-4" />
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink">আমাদের সম্পর্কে</h1>
          <p className="text-ink-soft mt-4 max-w-2xl mx-auto leading-relaxed">
            পড়াশোনা সহায়ক তৈরি হয়েছে বাংলাদেশের HSC ও SSC শিক্ষার্থীদের জন্য, যেন কোয়ালিটি স্টাডি ম্যাটেরিয়াল
            আর AI-এর সহায়তা প্রতিটি শিক্ষার্থীর নাগালের মধ্যে থাকে — শহর হোক বা গ্রাম।
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-3 gap-6">
          <div className="script-card p-6 text-center">
            <Target className="mx-auto text-margin mb-3" size={26} />
            <h3 className="font-display font-semibold text-ink mb-2">আমাদের লক্ষ্য</h3>
            <p className="text-sm text-muted leading-relaxed">
              বোর্ড পরীক্ষার প্রস্তুতিকে আরও সহজ, সুসংগঠিত ও কার্যকর করে তোলা, প্রযুক্তির সঠিক ব্যবহারের মাধ্যমে।
            </p>
          </div>
          <div className="script-card p-6 text-center">
            <Users className="mx-auto text-margin mb-3" size={26} />
            <h3 className="font-display font-semibold text-ink mb-2">কমিউনিটি চালিত</h3>
            <p className="text-sm text-muted leading-relaxed">
              এখানে যত নোট আছে তার বেশিরভাগই আমাদের নিজেদের শিক্ষার্থীদের শেয়ার করা — একজন আরেকজনকে সাহায্য করার মধ্য দিয়েই এই প্ল্যাটফর্ম বেড়ে উঠছে।
            </p>
          </div>
          <div className="script-card p-6 text-center">
            <Sparkles className="mx-auto text-margin mb-3" size={26} />
            <h3 className="font-display font-semibold text-ink mb-2">AI দিয়ে সহায়তা</h3>
            <p className="text-sm text-muted leading-relaxed">
              AI টিউটর ও ফ্ল্যাশকার্ড জেনারেটর দিয়ে যেকোনো সময় প্রশ্ন করা ও দ্রুত রিভিশন দেওয়ার সুযোগ, একদম বিনামূল্যে।
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper-alt border-t border-ink/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="font-display text-2xl font-bold text-ink mb-4 text-center">আমাদের গল্প</h2>
          <p className="text-ink-soft leading-relaxed">
            আমরা নিজেরাও একসময় HSC-SSC পরীক্ষার্থী ছিলাম, আর জানি রাত জেগে একটা টপিক না বুঝতে পারার হতাশা কেমন হয়।
            পড়াশোনা সহায়ক তৈরির পেছনের চিন্তা ছিল সহজ — এমন একটা জায়গা বানানো যেখানে ভালো নোট খুঁজে পাওয়া যাবে,
            আর দরকার হলে সাথে সাথে একটা AI টিউটরকে জিজ্ঞেস করা যাবে, ঠিক যেমন একজন সিনিয়র ভাই বা আপুর কাছে জিজ্ঞেস করা যেত।
            আজ হাজারো শিক্ষার্থী প্রতিদিন এই প্ল্যাটফর্ম ব্যবহার করছে, আর আমরা প্রতিনিয়ত এটাকে আরও ভালো করার চেষ্টা করছি।
          </p>
        </div>
      </section>
    </div>
  );
}
