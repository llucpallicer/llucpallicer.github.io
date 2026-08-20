import type { Locale } from './types';

export interface DiaryEntry {
  slug: string;
  copy: Record<Locale, string>;
}

export const diaryEntries: DiaryEntry[] = [
  {
    slug: '00-00-00',
    copy: {
      ca: "00.00.00 / L'habitatge que el GATCPAC no va construir a Mallorca.",
      es: '00.00.00 / Los apartamentos que el GATCPAC no construyó en Mallorca.',
      en: '00.00.00 / The Apartments That GATCPAC Never Built in Mallorca',
    },
  },
];
