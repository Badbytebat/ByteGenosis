import { getSupabaseBrowserClient } from "./supabase/client";
import type { PortfolioData } from "./types";
import { defaultData } from "./data";

const PORTFOLIO_ROW_ID = "main-portfolio";

/** Merge partial/legacy JSON into a full `PortfolioData` (used for load + import). */
export function mergePortfolioRow(raw: Record<string, unknown> | null): PortfolioData {
  if (!raw || typeof raw !== "object") return defaultData;
  const d = raw as Partial<PortfolioData>;
  return {
    header: d.header ?? defaultData.header,
    hero: d.hero ?? defaultData.hero,
    about: d.about ?? defaultData.about,
    experience: d.experience ?? defaultData.experience,
    skills: d.skills ?? defaultData.skills,
    projects: d.projects ?? defaultData.projects,
    qualifications: d.qualifications ?? defaultData.qualifications,
    contact: d.contact ?? defaultData.contact,
    resumeUrl: d.resumeUrl ?? defaultData.resumeUrl,
    aiAssistant: d.aiAssistant
      ? {
          instructions:
            d.aiAssistant.instructions ?? defaultData.aiAssistant.instructions,
          extraDetails:
            d.aiAssistant.extraDetails ?? defaultData.aiAssistant.extraDetails,
        }
      : defaultData.aiAssistant,
    siteMeta: d.siteMeta
      ? {
          title: d.siteMeta.title ?? defaultData.siteMeta.title,
          description:
            d.siteMeta.description ?? defaultData.siteMeta.description,
          ogImageUrl: d.siteMeta.ogImageUrl ?? defaultData.siteMeta.ogImageUrl,
          twitterSite:
            d.siteMeta.twitterSite ?? defaultData.siteMeta.twitterSite,
        }
      : defaultData.siteMeta,
    notes: Array.isArray(d.notes) ? d.notes : defaultData.notes,
    downloadableAssets: Array.isArray(d.downloadableAssets)
      ? d.downloadableAssets
      : defaultData.downloadableAssets,
    themePalette: d.themePalette ?? defaultData.themePalette,
  };
}

export const getPortfolioData = async (): Promise<PortfolioData> => {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return defaultData;
  }
  try {
    const { data, error } = await supabase
      .from("portfolios")
      .select("data")
      .eq("id", PORTFOLIO_ROW_ID)
      .maybeSingle();

    if (error) {
      console.error("Error fetching portfolio data:", error);
      return defaultData;
    }
    if (!data?.data) {
      console.log("No portfolio row found, returning default data.");
      return defaultData;
    }
    return mergePortfolioRow(data.data as Record<string, unknown>);
  } catch (error) {
    console.error("Error fetching portfolio data:", error);
    return defaultData;
  }
};

export const savePortfolioData = async (
  update: Partial<PortfolioData>
): Promise<void> => {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
    );
  }
  try {
    const { data: row, error: fetchError } = await supabase
      .from("portfolios")
      .select("data")
      .eq("id", PORTFOLIO_ROW_ID)
      .maybeSingle();

    if (fetchError) {
      console.error("Error loading portfolio for save:", fetchError);
      throw new Error(fetchError.message);
    }

    const base = mergePortfolioRow(row?.data as Record<string, unknown> | null);
    const merged: PortfolioData = { ...base, ...update };

    const { error } = await supabase.from("portfolios").upsert(
      {
        id: PORTFOLIO_ROW_ID,
        data: merged,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );
    if (error) {
      console.error("Error saving portfolio data:", error);
      throw new Error(error.message || "Failed to save portfolio data.");
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("Supabase")) throw error;
    console.error("Error saving portfolio data:", error);
    throw new Error("Failed to save data.");
  }
};
