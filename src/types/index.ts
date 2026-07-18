export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  studyClass?: "SSC" | "HSC" | "Other";
}

export interface Note {
  _id: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  subject: string;
  studyClass: "SSC" | "HSC";
  chapter: string;
  imageUrl: string;
  additionalImages: string[];
  fileUrl?: string;
  author: { _id: string; name: string; avatar: string } | string;
  ratings: Rating[];
  averageRating: number;
  views: number;
  upvotes: string[];
  createdAt: string;
}

export interface Rating {
  user: { _id: string; name: string; avatar: string } | string;
  value: number;
  comment?: string;
  createdAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface Card {
  question: string;
  answer: string;
  options?: string[];
  correctOptionIndex?: number;
}

export interface FlashcardSet {
  _id: string;
  topic: string;
  subject: string;
  studyClass: "SSC" | "HSC";
  difficulty: "Easy" | "Medium" | "Hard";
  type: "flashcard" | "mcq";
  cards: Card[];
  createdAt: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
}

export interface ChatSessionSummary {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}
