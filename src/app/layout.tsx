import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/layout/PageTransition";

export const metadata: Metadata = {
  title: "পড়াশোনা সহায়ক | HSC-SSC স্টাডি প্ল্যাটফর্ম",
  description:
    "HSC ও SSC শিক্ষার্থীদের জন্য নোটস শেয়ারিং, AI দিয়ে ফ্ল্যাশকার্ড/MCQ তৈরি এবং AI টিউটরের মাধ্যমে পড়াশোনার সহায়ক প্ল্যাটফর্ম।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-charcoal" suppressHydrationWarning>
        <Providers>
          <Navbar />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}