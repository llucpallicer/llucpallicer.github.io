import type { Locale } from './types';
import diaryData from './diary.json';

export interface DiaryEntry {
  slug: string;
  copy: Record<Locale, string>;
}

export const diaryEntries: DiaryEntry[] = (diaryData as Array<{ slug: string; copy: Record<Locale, string> }>).map(
  (entry) => ({
    slug: entry.slug,
    copy: entry.copy,
  })
);
