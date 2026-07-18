"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpenText, Menu, X, LogOut, LayoutDashboard, Sparkles, MessageCircleQuestion, FilePlus2, FolderKanban } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const publicLinks = [
  { href: "/", label: "হোম" },
  { href: "/notes", label: "নোটস" },
  { href: "/about", label: "সম্পর্কে" },
  { href: "/contact", label: "যোগাযোগ" },
];

const privateLinks = [
  { href: "/", label: "হোম" },
  { href: "/notes", label: "নোটস" },
  { href: "/ai-tutor", label: "AI টিউটর", icon: MessageCircleQuestion },
  { href: "/flashcards", label: "ফ্ল্যাশকার্ড", icon: Sparkles },
  { href: "/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/notes/manage", label: "আমার নোট", icon: FolderKanban },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const links = user ? privateLinks : publicLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    router.push("/");
  };

  return (
    <header className={`sticky top-0 z-50 w-full bg-paper/90 backdrop-blur-md border-b transition-shadow duration-300 ${scrolled ? "border-ink/10 shadow-[0_2px_16px_-4px_rgba(27,42,74,0.12)]" : "border-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0 focus-ring rounded-sm group">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-margin text-paper transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
              <BookOpenText size={20} />
            </span>
            <span className="font-display font-bold text-lg text-ink">পড়াশোনা সহায়ক</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors focus-ring ${
                    active ? "text-margin" : "text-ink-soft hover:text-margin"
                  }`}
                >
                  {link.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute left-3 right-3 -bottom-[1px] h-[2px] bg-margin rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-24 rounded-md bg-ruled/40 animate-pulse" />
            ) : user ? (
              <>
                <Link
                  href="/notes/add"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-semibold bg-marigold/90 text-ink hover:bg-marigold hover:-translate-y-0.5 hover:shadow-md transition-all focus-ring"
                >
                  <FilePlus2 size={16} /> নোট যোগ করুন
                </Link>
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="h-9 w-9 rounded-full border border-ink/10 object-cover"
                />
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-md text-ink-soft hover:text-margin hover:bg-margin/10 transition-colors focus-ring"
                  aria-label="লগআউট"
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-ink-soft hover:text-margin transition-colors focus-ring"
                >
                  লগইন
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-md text-sm font-semibold bg-margin text-paper hover:bg-margin-soft transition-colors focus-ring"
                >
                  রেজিস্টার করুন
                </Link>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-ink focus-ring rounded-md"
            onClick={() => setOpen(!open)}
            aria-label="মেনু খুলুন"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden border-t border-ink/10 bg-paper"
          >
            <div className="px-4 pb-4 pt-2 space-y-1">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block px-3 py-2 rounded-md text-sm font-medium text-ink-soft hover:text-margin hover:bg-margin/5"
                >
                  {link.label}
                </Link>
              ))}
              <div className="torn-divider my-2" />
              {user ? (
                <>
                  <Link
                    href="/notes/add"
                    onClick={() => setOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-semibold text-ink bg-marigold/80"
                  >
                    + নোট যোগ করুন
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-margin"
                  >
                    লগআউট
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-ink-soft">
                    লগইন
                  </Link>
                  <Link href="/register" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm font-semibold text-paper bg-margin">
                    রেজিস্টার করুন
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
