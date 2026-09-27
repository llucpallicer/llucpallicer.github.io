import type { Locale, Project, ProjectSlug } from './types';

/** Sidebar + archive table order. */
export const projects: Project[] = [
  {
    slug: 'cinquanta-u',
    year: 2025,
    copy: {
      ca: { title: 'Cinquanta-u', year: 2025, discipline: 'Disseny de producte' },
      es: { title: 'Cinquanta-u', year: 2025, discipline: 'Diseño de producto' },
      en: { title: 'Cinquanta-u', year: 2025, discipline: 'Product design' },
    },
  },
  {
    slug: 'udden',
    year: 2024,
    copy: {
      ca: { title: 'Udden', client: 'Lightecture / Lights in Alingsås', year: 2024, discipline: 'Instal·lació lumínica' },
      es: { title: 'Udden', client: 'Lightecture / Lights in Alingsås', year: 2024, discipline: 'Instalación lumínica' },
      en: { title: 'Udden', client: 'Lightecture / Lights in Alingsås', year: 2024, discipline: 'Light installation' },
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
        discipline: 'Documentació i fabricació',
      },
      es: {
        title: 'Museo de la Teja Hidráulica',
        sidebarTitle: 'Museo Rajola Hidràulica',
        client: 'Museu de la Rajola Hidràulica',
        year: 2022,
        discipline: 'Documentación y fabricación',
      },
      en: {
        title: 'Hydraulic Tile Museum',
        sidebarTitle: 'Hydraulic Tile Museum',
        client: 'Museu de la Rajola Hidràulica',
        year: 2022,
        discipline: 'Documentation & fabrication',
      },
    },
  },
  {
    slug: 'ona',
    year: 2022,
    copy: {
      ca: { title: 'ONA', year: 2022, discipline: 'Disseny de joguina' },
      es: { title: 'ONA', year: 2022, discipline: 'Diseño de juguete' },
      en: { title: 'ONA', year: 2022, discipline: 'Toy design' },
    },
  },
  {
    slug: 'videoclip',
    year: 2024,
    copy: {
      ca: { title: 'Copeo Traïdor', client: 'Queralt Lahoz', year: 2024, discipline: 'Direcció d\'art' },
      es: { title: 'Copeo Traidor', client: 'Queralt Lahoz', year: 2024, discipline: 'Dirección de arte' },
      en: { title: 'Copeo Traïdor', client: 'Queralt Lahoz', year: 2024, discipline: 'Art direction' },
    },
  },
  {
    slug: 'utopia',
    year: 2025,
    copy: {
      ca: { title: 'Utopia', client: 'SIMON / EINA', year: 2025, discipline: 'Disseny especulatiu' },
      es: { title: 'Utopia', client: 'SIMON / EINA', year: 2025, discipline: 'Diseño especulativo' },
      en: { title: 'Utopia', client: 'SIMON / EINA', year: 2025, discipline: 'Speculative design' },
    },
  },
  {
    slug: 'bathndustry',
    year: 2024,
    copy: {
      ca: { title: "Bath'n'dustry", client: 'TOI TOI', year: 2024, discipline: 'Instal·lació' },
      es: { title: "Bath'n'dustry", client: 'TOI TOI', year: 2024, discipline: 'Instalación' },
      en: { title: "Bath'n'dustry", client: 'TOI TOI', year: 2024, discipline: 'Installation' },
    },
  },
];

/** Home page card order. */
export const homeProjectSlugs: ProjectSlug[] = [
  'cinquanta-u',
  'udden',
  'museu',
  'ona',
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
