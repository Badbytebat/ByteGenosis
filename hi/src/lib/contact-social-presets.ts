/**
 * Preset platforms for Contact cards: `value` is stored as `ContactMethod.icon` and maps to icons in contact.tsx.
 */
export const CONTACT_SOCIAL_PRESETS = [
  { value: "Mail", label: "Email" },
  { value: "Linkedin", label: "LinkedIn" },
  { value: "Github", label: "GitHub" },
  { value: "Instagram", label: "Instagram" },
  { value: "Twitter", label: "X (Twitter)" },
  { value: "Facebook", label: "Facebook" },
  { value: "Youtube", label: "YouTube" },
  { value: "Globe", label: "Website" },
  { value: "Discord", label: "Discord" },
  { value: "MessageCircle", label: "Telegram / messages" },
  { value: "Whatsapp", label: "WhatsApp" },
  { value: "Kaggle", label: "Kaggle" },
  { value: "HackerRank", label: "HackerRank" },
  { value: "GeeksforGeeks", label: "GeeksforGeeks" },
  { value: "LeetCode", label: "LeetCode" },
  { value: "Codepen", label: "CodePen" },
  { value: "Dribbble", label: "Dribbble" },
  { value: "Behance", label: "Behance" },
  { value: "Medium", label: "Medium" },
  { value: "Rss", label: "RSS / blog" },
] as const;

export type ContactSocialPresetValue = (typeof CONTACT_SOCIAL_PRESETS)[number]["value"];

export function getPresetLabelForIcon(icon: string): string {
  const p = CONTACT_SOCIAL_PRESETS.find((x) => x.value === icon);
  return p?.label ?? icon;
}
