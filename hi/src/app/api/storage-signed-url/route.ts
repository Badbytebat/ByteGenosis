import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { PORTFOLIO_STORAGE_BUCKET } from "@/lib/supabase-storage-path";

export const runtime = "nodejs";

/** Only these prefixes may be signed (mitigates open proxy abuse). */
const ALLOWED = /^(music|favicons|photos|resumes|logos)\//;

/**
 * Returns a short-lived signed URL so visitors can play / view private bucket objects.
 * Requires `SUPABASE_SERVICE_ROLE_KEY` in server env (never expose to client).
 */
export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get("path");
  if (!path || path.includes("..") || !ALLOWED.test(path)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "Signing not configured (add SUPABASE_SERVICE_ROLE_KEY for private bucket playback)" },
      { status: 501 }
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await supabase.storage
    .from(PORTFOLIO_STORAGE_BUCKET)
    .createSignedUrl(path, 3600);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message ?? "Could not create signed URL" },
      { status: 500 }
    );
  }

  return NextResponse.json({ signedUrl: data.signedUrl });
}
