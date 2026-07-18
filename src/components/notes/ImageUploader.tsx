"use client";

import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { UploadCloud, X, Loader2, ImageIcon } from "lucide-react";
import api from "@/lib/api";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  height?: string;
}

export default function ImageUploader({ value, onChange, label, height = "h-40" }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const uploadFile = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("শুধু JPG, PNG, WEBP বা GIF ছবি আপলোড করা যাবে");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`ছবির সাইজ সর্বোচ্চ ${MAX_SIZE_MB}MB হতে পারবে`);
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    try {
      const { data } = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onChange(data.url);
      toast.success("ছবি আপলোড হয়েছে!");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "ছবি আপলোড করতে সমস্যা হয়েছে");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-ink mb-1.5">{label}</label>}

      {value ? (
        <div className="relative group">
          <img src={value} alt="আপলোড করা ছবি" className={`w-full ${height} object-cover rounded-md border border-ink/15`} />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 flex items-center justify-center h-7 w-7 rounded-full bg-ink/80 text-paper opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="ছবি সরাও"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          disabled={uploading}
          className={`w-full ${height} flex flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed transition-colors ${
            dragOver ? "border-margin bg-margin/5" : "border-ink/20 hover:border-margin/50"
          } disabled:opacity-60`}
        >
          {uploading ? (
            <>
              <Loader2 size={22} className="animate-spin text-margin" />
              <span className="text-xs text-muted">আপলোড হচ্ছে...</span>
            </>
          ) : (
            <>
              <UploadCloud size={22} className="text-muted" />
              <span className="text-xs text-ink-soft font-medium">ছবি টেনে আনো অথবা ক্লিক করে বাছাই করো</span>
              <span className="text-[11px] text-muted flex items-center gap-1">
                <ImageIcon size={11} /> JPG, PNG, WEBP · সর্বোচ্চ {MAX_SIZE_MB}MB
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
