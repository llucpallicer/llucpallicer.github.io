import type { Locale, ProjectSlug } from '@/data/types';

export function projectPagePath(locale: Locale, slug: ProjectSlug, _isMobile = false): string {
  return `/${locale}/projectes/${slug}`;
}
