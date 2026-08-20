import type { Locale, ProjectSlug } from '@/data/types';
import { getGallery } from '@/data/galleries';

export function projectPagePath(locale: Locale, slug: ProjectSlug, isMobile = false): string {
  if (slug === 'utopia' && !isMobile) {
    const first = getGallery('utopia')?.first ?? 1;
    return `/${locale}/projectes/utopia/fotos/${first}`;
  }
  return `/${locale}/projectes/${slug}`;
}
