import type { ProjectSlug } from './types';

export interface GalleryNav {
  slides: number[];
  first: number | null;
  exitToHome: boolean;
  prev: Record<number, number | null>;
  next: Record<number, number | null>;
}

export const galleries: Record<ProjectSlug, GalleryNav> = {
  "cinquanta-u": {
    "slides": [
      1,
      2,
      3,
      4,
      5,
      6
    ],
    "first": 1,
    "exitToHome": false,
    "prev": {
      "1": null,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4,
      "6": 5
    },
    "next": {
      "1": 2,
      "2": 3,
      "3": 4,
      "4": 5,
      "5": 6,
      "6": null
    }
  },
  "bathndustry": {
    "slides": [
      1,
      2,
      4,
      5,
      6
    ],
    "first": 1,
    "exitToHome": false,
    "prev": {
      "1": null,
      "2": 1,
      "4": 2,
      "5": 4,
      "6": 5
    },
    "next": {
      "1": 2,
      "2": 4,
      "4": 5,
      "5": 6,
      "6": null
    }
  },
  "udden": {
    "slides": [
      1,
      2,
      3,
      4,
      5
    ],
    "first": 1,
    "exitToHome": false,
    "prev": {
      "1": null,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4
    },
    "next": {
      "1": 2,
      "2": 3,
      "3": 4,
      "4": 5,
      "5": null
    }
  },
  "ona": {
    "slides": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10
    ],
    "first": 1,
    "exitToHome": false,
    "prev": {
      "1": null,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4,
      "6": 5,
      "7": 6,
      "8": 7,
      "9": 8,
      "10": 9
    },
    "next": {
      "1": 2,
      "2": 3,
      "3": 4,
      "4": 5,
      "5": 6,
      "6": 7,
      "7": 8,
      "8": 9,
      "9": 10,
      "10": null
    }
  },
  "museu": {
    "slides": [
      1,
      2,
      3,
      4,
      5,
      6,
      7
    ],
    "first": 1,
    "exitToHome": false,
    "prev": {
      "1": null,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4,
      "6": 5,
      "7": 6
    },
    "next": {
      "1": 2,
      "2": 3,
      "3": 4,
      "4": 5,
      "5": 6,
      "6": 7,
      "7": null
    }
  },
  "videoclip": {
    "slides": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10
    ],
    "first": 1,
    "exitToHome": false,
    "prev": {
      "1": null,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4,
      "6": 5,
      "7": 6,
      "8": 7,
      "9": 8,
      "10": 9
    },
    "next": {
      "1": 2,
      "2": 3,
      "3": 4,
      "4": 5,
      "5": 6,
      "6": 7,
      "7": 8,
      "8": 9,
      "9": 10,
      "10": null
    }
  },
  "utopia": {
    "slides": [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14
    ],
    "first": 1,
    "exitToHome": true,
    "prev": {
      "1": null,
      "2": 1,
      "3": 2,
      "4": 3,
      "5": 4,
      "6": 5,
      "7": 6,
      "8": 7,
      "9": 8,
      "10": 9,
      "11": 10,
      "12": 11,
      "13": 12,
      "14": 13
    },
    "next": {
      "1": 2,
      "2": 3,
      "3": 4,
      "4": 5,
      "5": 6,
      "6": 7,
      "7": 8,
      "8": 9,
      "9": 10,
      "10": 11,
      "11": 12,
      "12": 13,
      "13": 14,
      "14": null
    }
  }
} as Record<ProjectSlug, GalleryNav>;

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

export const detailImageCounts: Record<ProjectSlug, number> = {
  "cinquanta-u": 6,
  "bathndustry": 5,
  "udden": 5,
  "ona": 10,
  "museu": 7,
  "videoclip": 10,
  "utopia": 0
} as Record<ProjectSlug, number>;

export const phoneProjectImageCounts: Record<ProjectSlug, number> = {
  "cinquanta-u": 6,
  "bathndustry": 5,
  "udden": 5,
  "ona": 11,
  "museu": 7,
  "videoclip": 11,
  "utopia": 12
} as Record<ProjectSlug, number>;

export function phoneHomeImageUrl(index: number): string {
  return `/images/phone/home/${index}.png`;
}

export function phoneProjectImageUrl(slug: ProjectSlug, index: number): string {
  return `/images/phone/projects/${slug}/image-${index}.png`;
}
