import type { Locale, NavLabels } from '@/data/types';

export const navLabels: Record<Locale, NavLabels> = {
  ca: {
    brand: 'Lluc',
    projects: 'Projectes',
    diary: 'Diari',
    contact: 'Contacte',
    menu: 'Menú',
    exit: 'Sortir',
    languages: { ca: 'Català', es: 'Castellano', en: 'English' },
  },
  es: {
    brand: 'Lluc',
    projects: 'Proyectos',
    diary: 'Diario',
    contact: 'Contacto',
    menu: 'Menú',
    exit: 'Salir',
    languages: { ca: 'Català', es: 'Castellano', en: 'English' },
  },
  en: {
    brand: 'Lluc',
    projects: 'Projects',
    diary: 'Diary',
    contact: 'Contact',
    menu: 'Menu',
    exit: 'Exit',
    languages: { ca: 'Català', es: 'Castellano', en: 'English' },
  },
};

export const pageTitles: Record<Locale, { archive: string; diary: string; contact: string }> = {
  ca: { archive: 'Arxiu de projectes', diary: 'Diari', contact: 'Contacte' },
  es: { archive: 'Archivo de proyectos', diary: 'Diario', contact: 'Contacto' },
  en: { archive: 'Project archive', diary: 'Diary', contact: 'Contact' },
};

export const sidebarLabels: Record<Locale, { archive: string; nextProject: string }> = {
  ca: { archive: 'Arxiu', nextProject: 'Següent projecte' },
  es: { archive: 'Archivo', nextProject: 'Siguiente proyecto' },
  en: { archive: 'Archive', nextProject: 'Next project' },
};

export const archiveTableHeaders: Record<Locale, { project: string; client: string; year: string }> = {
  ca: { project: 'Projecte', client: 'Client', year: 'Any' },
  es: { project: 'Proyecto', client: 'Cliente', year: 'Año' },
  en: { project: 'Project', client: 'Client', year: 'Year' },
};
