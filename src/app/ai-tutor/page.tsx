"use client";

import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { Send, MessageCircleQuestion, Plus, Trash2, Bot, User as UserIcon } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { ChatMessage, ChatSessionSummary } from "@/types";
import ProtectedRoute from "@/components/ProtectedRoute";

function AiTutorContent() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSessionSummary[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadSessions = async () => {
    const { data } = await api.get("/ai/chats");
    setSessions(data.sessions);
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const openSession = async (id: string) => {
    const { data } = await api.get(`/ai/chats/${id}`);
    setSessionId(id);
    setMessages(data.session.messages);
    setSuggestions([]);
  };

  const startNewChat = () => {
    setSessionId(null);
    setMessages([]);
    setSuggestions([]);
  };

  const deleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await api.delete(`/ai/chats/${id}`);
    if (sessionId === id) startNewChat();
    loadSessions();
  };

  const sendMessage = async (text?: string) => {
    const messageText = text ?? input;
    if (!messageText.trim() || streaming) return;

    setInput("");
    setSuggestions([]);
    setMessages((prev) => [...prev, { role: "user", content: messageText }]);
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const token = Cookies.get("token");
      const url = `${API_BASE_URL}/ai/chat${sessionId ? `/${sessionId}` : ""}`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        credentials: "include",
        body: JSON.stringify({ message: messageText }),
      });

      if (!res.body) throw new Error("স্ট্রিম পাওয়া যায়নি");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || "";

        for (const part of parts) {
          if (!part.startsWith("data: ")) continue;
          const payload = JSON.parse(part.slice(6));

          if (payload.type === "chunk") {
            setMessages((prev) => {
              const copy = [...prev];
              copy[copy.length - 1] = {
                ...copy[copy.length - 1],
                content: copy[copy.length - 1].content + payload.content,
              };
              return copy;
            });
          } else if (payload.type === "done") {
            if (!sessionId) setSessionId(payload.sessionId);
            setSuggestions(payload.suggestions || []);
            loadSessions();
          } else if (payload.type === "error") {
            toast.error(payload.message);
          }
        }
      }
    } catch (err) {
      toast.error("AI টিউটরের সাথে সংযোগ করতে সমস্যা হয়েছে");
    } finally {
      setStreaming(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-margin/10 text-margin"><MessageCircleQuestion size={20} /></span>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">AI টিউটর</h1>
          <p className="text-sm text-muted">তোমার যেকোনো পড়ার প্রশ্ন জিজ্ঞেস করো</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Sessions sidebar */}
        <div className="script-card p-4 h-fit">
          <button onClick={startNewChat} className="w-full flex items-center justify-center gap-1.5 rounded-md bg-margin text-paper text-sm font-semibold py-2 mb-3 hover:bg-margin-soft transition-colors">
            <Plus size={15} /> নতুন চ্যাট
          </button>
          <div className="space-y-1 max-h-[420px] overflow-y-auto">
            {sessions.map((s) => (
              <div
                key={s._id}
                onClick={() => openSession(s._id)}
                className={`flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer ${sessionId === s._id ? "bg-margin/10 text-margin" : "text-ink-soft hover:bg-paper-alt"}`}
              >
                <span className="truncate">{s.title}</span>
                <button onClick={(e) => deleteSession(s._id, e)} className="text-muted hover:text-margin shrink-0 ml-2"><Trash2 size={13} /></button>
              </div>
            ))}
            {sessions.length === 0 && <p className="text-xs text-muted px-3">এখনো কোনো চ্যাট নেই</p>}
          </div>
        </div>

        {/* Chat window */}
        <div className="script-card flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center text-muted">
                <Bot size={32} className="mb-3 text-margin" />
                <p className="font-medium text-ink-soft">হাই {user?.name?.split(" ")[0]}! আমি তোমার AI টিউটর।</p>
                <p className="text-sm mt-1">যেকোনো সাবজেক্টের প্রশ্ন করো, ধাপে ধাপে বুঝিয়ে দেব।</p>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink text-paper"><Bot size={14} /></span>
                )}
                <div className={`max-w-[75%] rounded-lg px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${m.role === "user" ? "bg-margin text-paper" : "bg-paper-alt text-ink-soft"}`}>
                  {m.content || (streaming && i === messages.length - 1 ? (
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-muted animate-bounce" />
                    </span>
                  ) : null)}
                </div>
                {m.role === "user" && (
                  <img src={user?.avatar} alt="" className="h-7 w-7 rounded-full shrink-0" />
                )}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {suggestions.length > 0 && !streaming && (
            <div className="px-5 pb-2 flex flex-wrap gap-2">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} className="text-xs rounded-full border border-margin/30 text-margin px-3 py-1.5 hover:bg-margin/10 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
            className="flex items-center gap-2 border-t border-ink/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="তোমার প্রশ্ন লেখো..."
              disabled={streaming}
              className="flex-1 rounded-md border border-ink/15 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-margin/40 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={streaming || !input.trim()}
              className="flex items-center justify-center h-10 w-10 rounded-md bg-margin text-paper hover:bg-margin-soft transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AiTutorPage() {
  return (
    <ProtectedRoute>
      <AiTutorContent />
    </ProtectedRoute>
  );
}
