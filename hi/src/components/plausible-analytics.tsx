"use client";

import Script from "next/script";

const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

/** Privacy-friendly analytics; only loads when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set. */
export default function PlausibleAnalytics() {
  if (!domain?.trim()) return null;

  return (
    <Script
      defer
      data-domain={domain.trim()}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
