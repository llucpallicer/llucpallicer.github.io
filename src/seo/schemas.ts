/**
 * schema.org JSON-LD object factories.
 * All functions return plain objects — no imports needed at runtime.
 */

const SITE_URL = 'https://llucpallicer.com';

export function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Lluc Pallicer',
    url: SITE_URL,
    jobTitle: 'Product Designer',
    description:
      'Product designer and researcher based in Barcelona. Born in Palma, Mallorca. Studied Product Design at EINA. Works in product design, installations, and art direction.',
    birthPlace: { '@type': 'Place', name: 'Palma, Mallorca, Spain' },
    workLocation: { '@type': 'Place', name: 'Barcelona, Catalunya, Spain' },
    alumniOf: {
      '@type': 'EducationalOrganization',
      name: 'EINA Centre Universitari de Disseny i Art',
      url: 'https://www.eina.cat',
    },
    knowsLanguage: ['ca', 'es', 'en'],
    email: 'mail@llucpallicer.com',
    sameAs: ['https://www.instagram.com/lluc.pallicer.ribas/'],
  };
}

export interface CreativeWorkArgs {
  name: string;
  description: string;
  year: number;
  slug: string;
  locale: string;
  discipline?: string;
  client?: string;
}

export function creativeWorkSchema({
  name,
  description,
  year,
  slug,
  locale,
  discipline,
  client,
}: CreativeWorkArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name,
    description,
    dateCreated: String(year),
    url: `${SITE_URL}/${locale}/projectes/${slug}`,
    creator: {
      '@type': 'Person',
      name: 'Lluc Pallicer',
      url: SITE_URL,
    },
    ...(discipline ? { genre: discipline } : {}),
    ...(client
      ? {
          contributor: {
            '@type': 'Organization',
            name: client,
          },
        }
      : {}),
    image: `${SITE_URL}/images/projects/${slug}/thumb.png`,
  };
}

export interface ArticleArgs {
  headline: string;
  description: string;
  locale: string;
  url: string;
}

export function articleSchema({ headline, description, locale, url }: ArticleArgs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    inLanguage: locale,
    url,
    author: {
      '@type': 'Person',
      name: 'Lluc Pallicer',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Person',
      name: 'Lluc Pallicer',
      url: SITE_URL,
    },
  };
}
