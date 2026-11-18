import type { Locale, Project, ProjectSlug } from './types';
import projectsData from './projects.json';

export interface ProjectEntry {
  slug: ProjectSlug;
  year: number;
  showOnHome?: boolean;
  image?: string;
  copy: Record<
    Locale,
    {
      title: string;
      sidebarTitle?: string;
      client?: string;
      year: number;
      discipline?: string;
      description?: string;
      body?: string;
    }
  >;
  slides?: number[];
  exitToHome?: boolean;
  detailImageCount?: number;
  phoneProjectImageCount?: number;
}

export const rawProjects: ProjectEntry[] = projectsData as ProjectEntry[];

/** Sidebar + archive table order. */
export const projects: Project[] = rawProjects.map((p) => ({
  slug: p.slug,
  year: p.year,
  copy: p.copy,
}));

/** Home page card order. */
export const homeProjectSlugs: ProjectSlug[] = rawProjects
  .filter((p) => p.showOnHome !== false)
  .map((p) => p.slug);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getHomeProjects(): Project[] {
  return homeProjectSlugs
    .map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => p !== undefined);
}

export function sidebarProjectTitle(project: Project, locale: Locale): string {
  return project.copy[locale].sidebarTitle ?? project.copy[locale].title;
}

export function archiveProjectTitle(project: Project, locale: Locale): string {
  return project.copy[locale].title;
}

export function getNextProject(currentSlug: string): Project | undefined {
  const index = projects.findIndex((p) => p.slug === currentSlug);
  if (index < 0 || index >= projects.length - 1) return undefined;
  return projects[index + 1];
}
