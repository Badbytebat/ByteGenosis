import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim();
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

function isPlaceholderSupabaseHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  return (
    h.includes("your_project_ref") ||
    h.includes("changeme") ||
    h.includes("placeholder") ||
    h === "example.supabase.co"
  );
}

function isValidSupabaseUrl(u: string): boolean {
  if (!u) return false;
  try {
    const parsed = new URL(u);
    if (parsed.protocol !== "https:") return false;
    if (!parsed.hostname.toLowerCase().endsWith(".supabase.co")) return false;
    if (isPlaceholderSupabaseHost(parsed.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

function isValidSupabaseAnonKey(key: string): boolean {
  if (!key || key === "CHANGEME" || key === "your_anon_public_key_here") {
    return false;
  }
  if (key.startsWith("eyJ")) return key.length > 40;
  if (key.startsWith("sb_publishable_")) return key.length > 24;
  return key.length > 30;
}

export const isSupabaseConfigured = Boolean(
  isValidSupabaseUrl(url) && isValidSupabaseAnonKey(anonKey)
);

let browserClient: SupabaseClient | null = null;

/** Single browser client; session persisted by Supabase (localStorage). */
export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!browserClient) {
    browserClient = createClient(url, anonKey);
  }
  return browserClient;
}
