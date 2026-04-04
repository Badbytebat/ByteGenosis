
export interface Experience {
  id: number;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
  /** URL segment for /projects/[slug] case-study page; auto-derived from title if empty. */
  slug?: string;
  /** Optional long-form write-up shown on the case-study page. */
  caseStudyBody?: string;
}

export interface Qualification {
  id: number;
  type: 'education' | 'certification';
  title: string;
  institution: string;
  duration: string;
  description: string;
  link?: string;
}

export interface ContactMethod {
  id: number;
  icon: string;
  label: string;
  value: string;
  href: string;
}

export interface HeaderData {
  logoText: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
}

export interface AboutData {
  imageUrl: string;
  title: string;
  description1: string;
  description2: string;
  description3: string;
}

/** Editable AI chat settings (saved with portfolio JSON). */
export interface AiAssistantSettings {
  /** Main instructions for the floating chatbot (persona + rules). */
  instructions: string;
  /** Extra free-form context about you (tone, goals, facts not in other sections). */
  extraDetails: string;
}

/** SEO / sharing defaults (also synced to document title & meta from the client). */
export interface SiteMeta {
  title: string;
  description: string;
  /** Absolute or site-relative image URL for Open Graph / Twitter cards. */
  ogImageUrl?: string;
  twitterSite?: string;
}

/** Short blog-style note (MDX-free; plain text / markdown-friendly body). */
export interface NotePost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: string;
}

export interface DownloadableAsset {
  id: number;
  label: string;
  url: string;
}

/** Optional ambient tracks (URL or uploaded file); visitors can switch track / mute. */
export interface BackgroundMusicTrack {
  id: number;
  label: string;
  url: string;
}

/** Extra color palettes beyond the default dark/light pair. */
export type ThemePalette = 'default' | 'midnight' | 'ocean' | 'paper' | 'luxury';

export const THEME_PALETTES: ThemePalette[] = [
  'default',
  'midnight',
  'ocean',
  'paper',
  'luxury',
];

export function isThemePalette(value: unknown): value is ThemePalette {
  return typeof value === 'string' && THEME_PALETTES.includes(value as ThemePalette);
}

export function parseThemePalette(value: unknown): ThemePalette {
  return isThemePalette(value) ? value : 'default';
}

export interface PortfolioData {
  header: HeaderData;
  hero: HeroData;
  about: AboutData;
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  qualifications: Qualification[];
  contact: ContactMethod[];
  resumeUrl: string;
  aiAssistant: AiAssistantSettings;
  siteMeta: SiteMeta;
  notes: NotePost[];
  downloadableAssets: DownloadableAsset[];
  /** Optional background music; empty = no player. */
  backgroundMusicTracks: BackgroundMusicTrack[];
  /** Visual theme: dark/light plus optional palette (saved with portfolio). */
  themePalette: ThemePalette;
}
