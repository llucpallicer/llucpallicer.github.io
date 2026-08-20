import type { Locale, Project, ProjectSlug } from './types';

/** Sidebar + archive table order (matches Figma). */
export const projects: Project[] = [
  {
    slug: 'cinquanta-u',
    year: 2025,
    copy: {
      ca: { title: 'Cinquanta-u', year: 2025 },
      es: { title: 'Cinquanta-u', year: 2025 },
      en: { title: 'Cinquanta-u', year: 2025 },
    },
  },
  {
    slug: 'bathndustry',
    year: 2024,
    copy: {
      ca: { title: "Bath'n'dustry", client: 'TOI TOI', year: 2024 },
      es: { title: "Bath'n'dustry", client: 'TOI TOI', year: 2024 },
      en: { title: "Bath'n'dustry", client: 'TOI TOI', year: 2024 },
    },
  },
  {
    slug: 'udden',
    year: 2024,
    copy: {
      ca: { title: 'Udden', client: 'Lightecture / Lights in Alingsås', year: 2024 },
      es: { title: 'Udden', client: 'Lightecture / Lights in Alingsås', year: 2024 },
      en: { title: 'Udden', client: 'Lightecture / Lights in Alingsås', year: 2024 },
    },
  },
  {
    slug: 'ona',
    year: 2022,
    copy: {
      ca: { title: 'ONA', year: 2022 },
      es: { title: 'ONA', year: 2022 },
      en: { title: 'ONA', year: 2022 },
    },
  },
  {
    slug: 'museu',
    year: 2022,
    copy: {
      ca: {
        title: 'Museu de la Rajola Hidràulica',
        sidebarTitle: 'Museu Rajola Hidràulica',
        client: 'Museu de la Rajola Hidràulica',
        year: 2022,
      },
      es: {
        title: 'Museo de la Teja Hidráulica',
        sidebarTitle: 'Museo Rajola Hidràulica',
        client: 'Museu de la Rajola Hidràulica',
        year: 2022,
      },
      en: {
        title: 'Hydraulic Tile Museum',
        sidebarTitle: 'Hydraulic Tile Museum',
        client: 'Museu de la Rajola Hidràulica',
        year: 2022,
      },
    },
  },
  {
    slug: 'videoclip',
    year: 2024,
    copy: {
      ca: { title: 'Copeo Traïdor', client: 'Queralt Lahoz', year: 2024 },
      es: { title: 'Copeo Traidor', client: 'Queralt Lahoz', year: 2024 },
      en: { title: 'Copeo Traïdor', client: 'Queralt Lahoz', year: 2024 },
    },
  },
  {
    slug: 'utopia',
    year: 2025,
    copy: {
      ca: { title: 'Utopia', client: 'SIMON / EINA', year: 2025 },
      es: { title: 'Utopia', client: 'SIMON / EINA', year: 2025 },
      en: { title: 'Utopia', client: 'SIMON / EINA', year: 2025 },
    },
  },
];

/** Home page card order (matches Figma Home/Cat + phone/home/*.png). */
export const homeProjectSlugs: ProjectSlug[] = [
  'cinquanta-u',
  'udden',
  'ona',
  'museu',
  'videoclip',
  'utopia',
  'bathndustry',
];

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
