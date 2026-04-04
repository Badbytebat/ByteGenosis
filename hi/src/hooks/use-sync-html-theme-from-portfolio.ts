"use client";

import * as React from "react";
import type { PortfolioData } from "@/lib/types";

/**
 * Notes/project routes: set theme on <html> only. A nested `className="dark"` on a
 * wrapper matches `.dark { ... }` in globals and resets palette variables.
 */
export function useSyncHtmlThemeFromPortfolio(
  data: PortfolioData | null,
  darkMode: boolean
): void {
  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  React.useEffect(() => {
    if (!data) return;
    document.documentElement.setAttribute("data-palette", data.themePalette);
  }, [data]);
}
