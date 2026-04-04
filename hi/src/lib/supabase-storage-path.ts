/** Bucket used by `uploadFile` / `uploadAudioFile`. */
export const PORTFOLIO_STORAGE_BUCKET = "portfolio-files";

const PUBLIC_SEGMENT = `/object/public/${PORTFOLIO_STORAGE_BUCKET}/`;

/**
 * If `url` is a Supabase public object URL for this bucket, returns the object path inside the bucket.
 * Otherwise returns null (external URL or signed URL).
 */
export function tryExtractPortfolioStorageObjectPath(url: string): string | null {
  const t = url.trim();
  if (!t) return null;
  const i = t.indexOf(PUBLIC_SEGMENT);
  if (i === -1) return null;
  let rest = t.slice(i + PUBLIC_SEGMENT.length);
  const q = rest.indexOf("?");
  if (q !== -1) rest = rest.slice(0, q);
  try {
    return decodeURIComponent(rest);
  } catch {
    return rest;
  }
}
