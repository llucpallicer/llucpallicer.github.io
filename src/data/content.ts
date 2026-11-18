import type { Locale, ProjectSlug } from './types';
import rawProjects from './projects.json';
import rawDiary from './diary.json';
import type { ProjectEntry } from './projects';

export interface ContactContent {
  email: string;
  social: string;
  cvLabel: string;
  bio: string[];
}

export interface DiaryContent {
  headline: string;
  body: string;
}

export const contactContent: Record<Locale, ContactContent> = {
  "ca": {
    "email": "mail@llucpallicer.com",
    "social": "@lluc.pallicer.ribas",
    "cvLabel": "Enllaç al CV",
    "bio": [
      "Nascut el 1998 a la meravellosa illa de Mallorca, a Palma vaig cursar els meus estudis de fotografia abans de traslladar-me a Barcelona, on vaig estudiar Disseny de Producte a EINA. Actualment, col·laboro en tasques de documentació a l’Arxiu del DHUB, contribuint a organitzar el material comercial de les empreses vinculades al disseny industrial. Paral·lelament, continuo desenvolupant noves recerques i treballo de manera independent en l’àmbit del disseny de producte."
    ]
  },
  "es": {
    "email": "mail@llucpallicer.com",
    "social": "@lluc.pallicer.ribas",
    "cvLabel": "Enlace al CV",
    "bio": [
      "Nacido en 1998 en la maravillosa isla de Mallorca, estudié fotografía en Palma antes de trasladarme a Barcelona, donde cursé Diseño de Producto en EINA. Actualmente colaboro en tareas de documentación en el Archivo del DHUB, contribuyendo a organizar el material comercial de las empresas vinculadas al diseño industrial. Paralelamente, continúo desarrollando nuevas líneas de investigación y trabajo de manera independiente en el ámbito del diseño de producto."
    ]
  },
  "en": {
    "email": "mail@llucpallicer.com",
    "social": "@lluc.pallicer.ribas",
    "cvLabel": "Link to CV",
    "bio": [
      "Born in 1998 on the wonderful island of Mallorca, I studied photography in Palma before moving to Barcelona, where I completed a Product Design degree at EINA. I am currently collaborating on documentation tasks at the DHUB Archive, contributing to the organisation of commercial materials from companies linked to industrial design. In parallel, I continue developing new lines of research and work independently in the field of product design."
    ]
  }
};

export const diaryContent: Record<Locale, DiaryContent> =
  (rawDiary[0]?.content as Record<Locale, DiaryContent>) ?? {
    ca: { headline: '', body: '' },
    es: { headline: '', body: '' },
    en: { headline: '', body: '' },
  };

export const projectBodies: Partial<Record<ProjectSlug, Record<Locale, string>>> = Object.fromEntries(
  (rawProjects as ProjectEntry[]).map((p) => [
    p.slug,
    {
      ca: p.copy.ca.body || '',
      es: p.copy.es.body || '',
      en: p.copy.en.body || '',
    },
  ])
);
