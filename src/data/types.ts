export type Locale = 'ca' | 'es' | 'en';

export type ProjectSlug =
  | 'cinquanta-u'
  | 'bathndustry'
  | 'udden'
  | 'ona'
  | 'museu'
  | 'videoclip'
  | 'utopia';

export interface ProjectCopy {
  title: string;
  sidebarTitle?: string;
  client?: string;
  year: number;
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
