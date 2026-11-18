import type { ProjectSlug } from './types';
import rawProjects from './projects.json';
import type { ProjectEntry } from './projects';

export interface GalleryNav {
  slides: number[];
  first: number | null;
  exitToHome: boolean;
  prev: Record<number, number | null>;
  next: Record<number, number | null>;
}

export function buildGalleryNav(slides: number[] = [], exitToHome = false): GalleryNav {
  const prev: Record<number, number | null> = {};
  const next: Record<number, number | null> = {};
  for (let i = 0; i < slides.length; i++) {
    const curr = slides[i];
    prev[curr] = i > 0 ? slides[i - 1] : null;
    next[curr] = i < slides.length - 1 ? slides[i + 1] : null;
  }
  return {
    slides,
    first: slides.length > 0 ? slides[0] : null,
    exitToHome,
    prev,
    next,
  };
}

const projectsList = rawProjects as ProjectEntry[];

export const galleries: Record<ProjectSlug, GalleryNav> = Object.fromEntries(
  projectsList.map((p) => [p.slug, buildGalleryNav(p.slides || [], p.exitToHome || false)])
);

export function getGallery(slug: ProjectSlug): GalleryNav | undefined {
  return galleries[slug];
}

export function galleryImageUrl(slug: ProjectSlug, slide: number): string {
  return `/images/galleries/${slug}/${slide}.png`;
}

export function projectThumbUrl(slug: ProjectSlug): string {
  return `/images/projects/${slug}/thumb.png`;
}

export function projectDetailImageUrl(slug: ProjectSlug, index: number): string {
  return `/images/projects/${slug}/detail/image-${index}.png`;
}

export const detailImageCounts: Record<ProjectSlug, number> = Object.fromEntries(
  projectsList.map((p) => [p.slug, p.detailImageCount ?? (p.slides?.length || 0)])
);

export const phoneProjectImageCounts: Record<ProjectSlug, number> = Object.fromEntries(
  projectsList.map((p) => [p.slug, p.phoneProjectImageCount ?? p.detailImageCount ?? (p.slides?.length || 0)])
);

export function phoneHomeImageUrl(index: number): string {
  return `/images/phone/home/${index}.png`;
}

export function phoneProjectImageUrl(slug: ProjectSlug, index: number): string {
  return `/images/phone/projects/${slug}/image-${index}.png`;
}
