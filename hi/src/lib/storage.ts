"use client";

import { getSupabaseBrowserClient } from "./supabase/client";
import { PORTFOLIO_STORAGE_BUCKET } from "./supabase-storage-path";

const BUCKET = PORTFOLIO_STORAGE_BUCKET;
/** PDFs and images for resume + about photo; matches your ~50 MB cap. */
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024;

function isAllowedUpload(file: File): boolean {
  if (file.size > MAX_UPLOAD_BYTES) return false;
  const t = file.type;
  if (t.startsWith("image/") || t === "application/pdf") return true;
  const n = file.name.toLowerCase();
  return (
    n.endsWith(".pdf") ||
    /\.(png|jpg|jpeg|gif|webp|avif|heic|bmp|ico|svg)$/i.test(n)
  );
}

function isAllowedAudio(file: File): boolean {
  if (file.size > MAX_UPLOAD_BYTES) return false;
  const t = file.type;
  if (t.startsWith("audio/")) return true;
  const n = file.name.toLowerCase();
  return /\.(mp3|m4a|aac|ogg|oga|wav|webm|flac)$/i.test(n);
}

export const uploadFile = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File is too large (maximum size is 50 MB).");
  }
  if (!isAllowedUpload(file)) {
    throw new Error("Only images and PDF files are allowed.");
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
    );
  }

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    let msg = uploadError.message || "Upload failed.";
    if (uploadError.message?.toLowerCase().includes("row-level security")) {
      msg =
        "Permission denied. Check Storage policies in Supabase (authenticated users need insert access to bucket portfolio-files).";
    }
    throw new Error(msg);
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!pub?.publicUrl) {
    throw new Error("Could not get public URL for uploaded file.");
  }
  return pub.publicUrl;
};

/** Background music uploads (same bucket; Supabase must allow these MIME types if restricted). */
export const uploadAudioFile = async (file: File, path: string): Promise<string> => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File is too large (maximum size is 50 MB).");
  }
  if (!isAllowedAudio(file)) {
    throw new Error("Only common audio formats are allowed (e.g. MP3, M4A, OGG, WAV).");
  }

  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
    );
  }

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    let msg = uploadError.message || "Upload failed.";
    if (uploadError.message?.toLowerCase().includes("row-level security")) {
      msg =
        "Permission denied. Check Storage policies in Supabase (authenticated users need insert access to bucket portfolio-files).";
    }
    throw new Error(msg);
  }

  const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(path);
  if (!pub?.publicUrl) {
    throw new Error("Could not get public URL for uploaded file.");
  }
  return pub.publicUrl;
};
