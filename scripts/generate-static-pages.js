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

const projects = [
  {
    slug: 'cinquanta-u',
    year: 2025,
    image: '/images/projects/cinquanta-u/thumb.png',
    copy: {
      ca: { title: 'Cinquanta-u', discipline: 'Disseny de producte', description: 'Recerca i materialització d’un esbós de cadira mai produït de l’arquitecte Germán Rodríguez Arias.' },
      es: { title: 'Cinquanta-u', discipline: 'Diseño de producto', description: 'Investigación y materialización de un boceto de silla nunca producido del arquitecto Germán Rodríguez Arias.' },
      en: { title: 'Cinquanta-u', discipline: 'Product design', description: 'Research and materialisation of an unproduced chair sketch by architect Germán Rodríguez Arias.' },
    },
  },
  {
    slug: 'bathndustry',
    year: 2024,
    image: '/images/projects/bathndustry/thumb.png',
    copy: {
      ca: { title: "Bath'n'dustry", discipline: 'Instal·lació', description: 'Intervenció per al festival NYS desenvolupada amb TOI TOI, transformant un bany portàtil en una instal·lació funcional.' },
      es: { title: "Bath'n'dustry", discipline: 'Instalación', description: 'Intervención para el festival NYS desarrollada con TOI TOI, transformando un baño portátil en una instalación funcional.' },
      en: { title: "Bath'n'dustry", discipline: 'Installation', description: 'An intervention for the NYS festival with TOI TOI, transforming a portable toilet into a functional installation.' },
    },
  },
  {
    slug: 'udden',
    year: 2024,
    image: '/images/projects/udden/thumb.png',
    copy: {
      ca: { title: 'Udden', discipline: 'Instal·lació lumínica', description: 'Instal·lació per al festival Lights in Alingsås, inspirada en el mite de l’inframón.' },
      es: { title: 'Udden', discipline: 'Instalación lumínica', description: 'Instalación para el festival Lights in Alingsås, inspirada en el mito del inframundo.' },
      en: { title: 'Udden', discipline: 'Light installation', description: 'An installation for the Lights in Alingsås festival, inspired by the myth of the underworld.' },
    },
  },
  {
    slug: 'ona',
    year: 2022,
    image: '/images/projects/ona/thumb.png',
    copy: {
      ca: { title: 'ONA', discipline: 'Disseny de joguina', description: 'Joguina de cartró per crear formes tridimensionals de manera ràpida i il·limitada.' },
      es: { title: 'ONA', discipline: 'Diseño de juguete', description: 'Juguete de cartón para crear formas tridimensionales de manera rápida e ilimitada.' },
      en: { title: 'ONA', discipline: 'Toy design', description: 'A cardboard toy for creating three-dimensional shapes quickly and without limits.' },
    },
  },
  {
    slug: 'museu',
    year: 2022,
    image: '/images/projects/museu/thumb.png',
    copy: {
      ca: { title: 'Museu de la Rajola Hidràulica', discipline: 'Documentació i fabricació', description: 'Projecte de recuperació de rajoles hidràuliques i reproducció de motlles amb disseny i impressió 3D.' },
      es: { title: 'Museo de la Teja Hidráulica', discipline: 'Documentación y fabricación', description: 'Proyecto de recuperación de baldosas hidráulicas y reproducción de moldes con diseño e impresión 3D.' },
      en: { title: 'Hydraulic Tile Museum', discipline: 'Documentation & fabrication', description: 'A project recovering hydraulic tiles and reproducing historic moulds through 3D design and printing.' },
    },
  },
  {
    slug: 'videoclip',
    year: 2024,
    image: '/images/projects/videoclip/thumb.png',
    copy: {
      ca: { title: 'Copeo Traïdor', discipline: 'Direcció d’art', description: 'Direcció d’art per al videoclip Copeo Traïdor de Marala amb Queralt Lahoz.' },
      es: { title: 'Copeo Traidor', discipline: 'Dirección de arte', description: 'Dirección de arte para el videoclip Copeo Traïdor de Marala con Queralt Lahoz.' },
      en: { title: 'Copeo Traïdor', discipline: 'Art direction', description: 'Art direction for the music video Copeo Traïdor by Marala with Queralt Lahoz.' },
    },
  },
  {
    slug: 'utopia',
    year: 2025,
    image: '/images/projects/utopia/thumb.png',
    copy: {
      ca: { title: 'Utopia', discipline: 'Disseny especulatiu', description: 'Projecte especulatiu sobre el futur de l’habitatge a Catalunya, desenvolupat per deu estudiants.' },
      es: { title: 'Utopia', discipline: 'Diseño especulativo', description: 'Proyecto especulativo sobre el futuro de la vivienda en Cataluña, desarrollado por diez estudiantes.' },
      en: { title: 'Utopia', discipline: 'Speculative design', description: 'A speculative project on the future of housing in Catalonia, developed by ten students.' },
    },
  },
];

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
