/**
 * Generates /dist/sitemap.xml and /public/sitemap.xml at build time.
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');
const PUBLIC = resolve(__dirname, '../public');
const SITE = 'https://llucpallicer.com';
const LOCALES = ['ca', 'es', 'en'];
const TODAY = new Date().toISOString().slice(0, 10);

const projects = JSON.parse(readFileSync(resolve(__dirname, '../src/data/projects.json'), 'utf-8'));
const projectSlugs = projects.map((p) => p.slug);

function url(loc, priority, changefreq) {
  return `  <url>\n    <loc>${SITE}${loc}</loc>\n    <lastmod>${TODAY}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const urls = [];

for (const locale of LOCALES) {
  // Home
  urls.push(url(`/${locale}`, '1.0', 'monthly'));
  // Projects list
  urls.push(url(`/${locale}/projectes`, '0.8', 'monthly'));
  // Project detail pages
  for (const slug of projectSlugs) {
    urls.push(url(`/${locale}/projectes/${slug}`, '0.9', 'monthly'));
  }
  // Diary
  urls.push(url(`/${locale}/diari`, '0.7', 'monthly'));
  // Contact
  urls.push(url(`/${locale}/contacte`, '0.6', 'yearly'));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>`;

if (!existsSync(DIST)) {
  mkdirSync(DIST, { recursive: true });
}
writeFileSync(resolve(DIST, 'sitemap.xml'), sitemap, 'utf-8');
writeFileSync(resolve(PUBLIC, 'sitemap.xml'), sitemap, 'utf-8');
console.log(`✓ sitemap.xml written (${urls.length} URLs)`);
