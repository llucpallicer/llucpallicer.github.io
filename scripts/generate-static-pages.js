/**
 * Generates static HTML entry points for every public route.
 *
 * GitHub Pages does not rewrite SPA routes. Giving each route its own
 * index.html means crawlers and social preview bots receive a 200 response
 * with page-specific metadata before executing any JavaScript.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');
const SITE_URL = 'https://llucpallicer.com';
const LOCALES = ['ca', 'es', 'en'];

const localeNames = { ca: 'Català', es: 'Castellano', en: 'English' };
const ogLocales = { ca: 'ca_ES', es: 'es_ES', en: 'en_GB' };

const siteCopy = {
  ca: {
    home: 'Lluc Pallicer — dissenyador de producte i investigador a Barcelona. Projectes de disseny de producte, instal·lacions i direcció d’art.',
    archive: 'Arxiu de tots els projectes de Lluc Pallicer: disseny de producte, instal·lacions, direcció d’art i més.',
    diary: 'Diari de recerca de Lluc Pallicer. Article sobre l’habitatge que el GATCPAC no va construir a Mallorca.',
    contact: 'Lluc Pallicer — dissenyador de producte nascut a Mallorca, format a EINA (Barcelona). Contacte i informació professional.',
    archiveTitle: 'Projectes',
    diaryTitle: 'Diari',
    contactTitle: 'Contacte',
    diaryHeadline: 'L’habitatge que el GATCPAC no va construir a Mallorca',
  },
  es: {
    home: 'Lluc Pallicer — diseñador de producto e investigador en Barcelona. Proyectos de diseño de producto, instalaciones y dirección de arte.',
    archive: 'Archivo de todos los proyectos de Lluc Pallicer: diseño de producto, instalaciones, dirección de arte y más.',
    diary: 'Diario de investigación de Lluc Pallicer. Artículo sobre los apartamentos que el GATCPAC no construyó en Mallorca.',
    contact: 'Lluc Pallicer — diseñador de producto nacido en Mallorca, formado en EINA (Barcelona). Contacto e información profesional.',
    archiveTitle: 'Proyectos',
    diaryTitle: 'Diario',
    contactTitle: 'Contacto',
    diaryHeadline: 'Los apartamentos que el GATCPAC no construyó en Mallorca',
  },
  en: {
    home: 'Lluc Pallicer — product designer and researcher based in Barcelona. Projects in product design, installations, and art direction.',
    archive: 'Archive of all projects by Lluc Pallicer: product design, installations, art direction, and more.',
    diary: 'Research diary by Lluc Pallicer. Article on the apartments that GATCPAC never built in Mallorca.',
    contact: 'Lluc Pallicer — product designer born in Mallorca, trained at EINA (Barcelona). Contact and professional information.',
    archiveTitle: 'Projects',
    diaryTitle: 'Diary',
    contactTitle: 'Contact',
    diaryHeadline: 'The Apartments That GATCPAC Never Built in Mallorca',
  },
};

const projects = JSON.parse(readFileSync(resolve(__dirname, '../src/data/projects.json'), 'utf-8'));

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function personSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Lluc Pallicer',
    url: SITE_URL,
    jobTitle: 'Product Designer',
    workLocation: { '@type': 'Place', name: 'Barcelona, Catalunya, Spain' },
    sameAs: ['https://www.instagram.com/lluc.pallicer.ribas/'],
  };
}

function renderPage(template, { locale, path, title, description, image, type = 'website', schema }) {
  const canonical = `${SITE_URL}${path}`;
  const fullTitle = title === 'Lluc Pallicer' ? title : `${title} — Lluc Pallicer`;
  const alternateLinks = LOCALES.map((alternateLocale) => {
    const alternatePath = path.replace(`/${locale}`, `/${alternateLocale}`);
    return `<link rel="alternate" hreflang="${alternateLocale}" href="${SITE_URL}${alternatePath}" />`;
  }).join('\n    ');
  const fallback = `<noscript><main><h1>${escapeHtml(title)}</h1><p>${escapeHtml(description)}</p><p><a href="${canonical}">${escapeHtml(canonical)}</a></p></main></noscript>`;
  const routeMetadata = `
    <link rel="canonical" href="${canonical}" />
    ${alternateLinks}
    <link rel="alternate" hreflang="x-default" href="${SITE_URL}${path.replace(`/${locale}`, '/ca')}" />
    <meta property="og:type" content="${type}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:title" content="${escapeHtml(fullTitle)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:image" content="${SITE_URL}${image}" />
    <meta property="og:locale" content="${ogLocales[locale]}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${SITE_URL}${image}" />
    <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`;

  return template
    .replace('<html lang="ca">', `<html lang="${locale}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`)
    .replace(/<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
    .replace(/<meta property="og:type" content="[^"]*" \/>/, '')
    .replace(/<meta property="og:image" content="[^"]*" \/>/, '')
    .replace(/<meta name="twitter:card" content="[^"]*" \/>/, '')
    .replace('<link rel="author" href="https://llucpallicer.com/ca/contacte" />', `<link rel="author" href="${SITE_URL}/${locale}/contacte" />${routeMetadata}`)
    .replace('<div id="root"></div>', `<div id="root"></div>${fallback}`);
}

const template = readFileSync(resolve(DIST, 'index.html'), 'utf-8');
let count = 0;

for (const locale of LOCALES) {
  const copy = siteCopy[locale];
  const pages = [
    {
      path: `/${locale}`,
      title: 'Lluc Pallicer',
      description: copy.home,
      image: '/images/projects/cinquanta-u/thumb.png',
      schema: personSchema(),
    },
    {
      path: `/${locale}/projectes`,
      title: copy.archiveTitle,
      description: copy.archive,
      image: '/images/projects/cinquanta-u/thumb.png',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: copy.archiveTitle,
        url: `${SITE_URL}/${locale}/projectes`,
        inLanguage: locale,
      },
    },
    {
      path: `/${locale}/diari`,
      title: copy.diaryTitle,
      description: copy.diary,
      image: '/images/projects/cinquanta-u/thumb.png',
      type: 'article',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: copy.diaryHeadline,
        description: copy.diary,
        inLanguage: locale,
        url: `${SITE_URL}/${locale}/diari`,
        author: { '@type': 'Person', name: 'Lluc Pallicer', url: SITE_URL },
      },
    },
    {
      path: `/${locale}/contacte`,
      title: copy.contactTitle,
      description: copy.contact,
      image: '/images/projects/cinquanta-u/thumb.png',
      schema: personSchema(),
    },
  ];

  for (const project of projects) {
    const projectCopy = project.copy[locale];
    pages.push({
      path: `/${locale}/projectes/${project.slug}`,
      title: `${projectCopy.title} / ${project.year}`,
      description: projectCopy.description,
      image: project.image,
      type: 'article',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: projectCopy.title,
        description: projectCopy.description,
        dateCreated: String(project.year),
        url: `${SITE_URL}/${locale}/projectes/${project.slug}`,
        creator: { '@type': 'Person', name: 'Lluc Pallicer', url: SITE_URL },
        genre: projectCopy.discipline,
        image: `${SITE_URL}${project.image}`,
      },
    });
  }

  for (const page of pages) {
    const outputPath = resolve(DIST, `.${page.path}`, 'index.html');
    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, renderPage(template, { locale, ...page }), 'utf-8');
    count += 1;
  }
}

console.log(`✓ static route pages written (${count} routes)`);
