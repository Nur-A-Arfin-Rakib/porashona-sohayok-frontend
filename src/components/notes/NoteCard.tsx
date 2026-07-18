import Link from "next/link";
import { Star, Eye, GraduationCap } from "lucide-react";
import { Note } from "@/types";

export default function NoteCard({ note }: { note: Note }) {
  const authorName = typeof note.author === "object" ? note.author.name : "";

  return (
    <div className="script-card flex flex-col h-full overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200">
      <div className="relative h-40 w-full overflow-hidden bg-paper-alt">
        <img src={note.imageUrl} alt={note.title} className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-ink/85 text-paper text-xs font-medium px-2.5 py-1">
          <GraduationCap size={12} /> {note.studyClass}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-4">
        <span className="text-xs font-semibold text-margin mb-1">{note.subject} · {note.chapter}</span>
        <h3 className="font-display font-semibold text-ink text-base leading-snug mb-1.5 line-clamp-2">
          {note.title}
        </h3>
        <p className="text-sm text-muted line-clamp-2 mb-3">{note.shortDescription}</p>

        <div className="mt-auto flex items-center justify-between text-xs text-ink-soft pt-3 border-t border-ink/10">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Star size={13} className="text-marigold fill-marigold" /> {note.averageRating || "নতুন"}
            </span>
            <span className="flex items-center gap-1">
              <Eye size={13} /> {note.views}
            </span>
          </div>
          {authorName && <span className="truncate max-w-[80px]">{authorName}</span>}
        </div>

        <Link
          href={`/notes/${note._id}`}
          className="mt-3 inline-flex items-center justify-center w-full rounded-md bg-ink text-paper text-sm font-semibold py-2 hover:bg-margin transition-colors focus-ring"
        >
          বিস্তারিত দেখুন
        </Link>
      </div>
    </div>
  );
}
