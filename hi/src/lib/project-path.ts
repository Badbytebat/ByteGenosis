import type { Project } from "@/lib/types";
import { slugify } from "@/lib/slug";

export function getProjectSlug(p: Project): string {
  return p.slug?.trim() || slugify(p.title) || `project-${p.id}`;
}

export function getProjectPath(p: Project): string {
  return `/projects/${getProjectSlug(p)}`;
}
