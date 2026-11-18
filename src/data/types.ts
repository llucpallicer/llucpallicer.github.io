export type Locale = 'ca' | 'es' | 'en';

export type ProjectSlug = string;

export interface ProjectCopy {
  title: string;
  sidebarTitle?: string;
  client?: string;
  year: number;
  /** Short discipline label for schema.org and meta, e.g. "Product design" */
  discipline?: string;
}

export interface Project {
  slug: ProjectSlug;
  year: number;
  copy: Record<Locale, ProjectCopy>;
}

export interface NavLabels {
  brand: string;
  projects: string;
  diary: string;
  contact: string;
  menu: string;
  exit: string;
  languages: Record<Locale, string>;
}
