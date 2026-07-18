import Link from "next/link";
import { BookOpenText, Mail, Phone, MapPin, Globe, Send } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-ink/10 bg-ink text-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-marigold text-ink">
                <BookOpenText size={20} />
              </span>
              <span className="font-display font-bold text-lg">পড়াশোনা সহায়ক</span>
            </div>
            <p className="text-sm text-paper/70 leading-relaxed">
              HSC ও SSC শিক্ষার্থীদের জন্য নোটস শেয়ারিং ও AI-চালিত পড়াশোনার সহায়ক প্ল্যাটফর্ম।
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-marigold">দ্রুত লিংক</h4>
            <ul className="space-y-2 text-sm text-paper/75">
              <li><Link href="/notes" className="hover:text-marigold transition-colors">নোটস এক্সপ্লোর</Link></li>
              <li><Link href="/ai-tutor" className="hover:text-marigold transition-colors">AI টিউটর</Link></li>
              <li><Link href="/flashcards" className="hover:text-marigold transition-colors">ফ্ল্যাশকার্ড জেনারেটর</Link></li>
              <li><Link href="/about" className="hover:text-marigold transition-colors">আমাদের সম্পর্কে</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-marigold">সাপোর্ট</h4>
            <ul className="space-y-2 text-sm text-paper/75">
              <li><Link href="/contact" className="hover:text-marigold transition-colors">যোগাযোগ করুন</Link></li>
              <li><Link href="/notes/add" className="hover:text-marigold transition-colors">নোট আপলোড করুন</Link></li>
              <li><Link href="/register" className="hover:text-marigold transition-colors">অ্যাকাউন্ট তৈরি করুন</Link></li>
              <li><Link href="/login" className="hover:text-marigold transition-colors">লগইন</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-marigold">যোগাযোগ</h4>
            <ul className="space-y-2.5 text-sm text-paper/75">
              <li>
                <a href="mailto:support@porashonasohayok.com" className="flex items-center gap-2 hover:text-marigold transition-colors">
                  <Mail size={15} /> support@porashonasohayok.com
                </a>
              </li>
              <li>
                <a href="tel:+8801700000000" className="flex items-center gap-2 hover:text-marigold transition-colors">
                  <Phone size={15} /> +৮৮০ ১৭xx-xxxxxx
                </a>
              </li>
              <li className="flex items-center gap-2"><MapPin size={15} /> ঢাকা, বাংলাদেশ</li>
            </ul>
            <div className="flex items-center gap-3 mt-4">
              <Link href="/contact" aria-label="যোগাযোগ পেজ" className="p-2 rounded-md bg-paper/10 hover:bg-marigold hover:text-ink transition-colors"><Globe size={16} /></Link>
              <a href="mailto:support@porashonasohayok.com" aria-label="ইমেইল পাঠান" className="p-2 rounded-md bg-paper/10 hover:bg-marigold hover:text-ink transition-colors"><Mail size={16} /></a>
              <Link href="/ai-tutor" aria-label="AI টিউটরের সাথে চ্যাট করুন" className="p-2 rounded-md bg-paper/10 hover:bg-marigold hover:text-ink transition-colors"><Send size={16} /></Link>
            </div>
          </div>
        </div>

        <div className="torn-divider my-8 opacity-20" />

        <p className="text-center text-xs text-paper/60">
          © {year} পড়াশোনা সহায়ক। সর্বস্বত্ব সংরক্ষিত।
        </p>
      </div>
    </footer>
  );
}
