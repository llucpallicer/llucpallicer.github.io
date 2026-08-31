import { useEffect } from 'react';

const SITE_URL = 'https://llucpallicer.com';
const LOCALES = ['ca', 'es', 'en'] as const;

type Locale = (typeof LOCALES)[number];

export interface MetaConfig {
  locale: Locale;
  /** Canonical path, e.g. "/ca/projectes/cinquanta-u" */
  path: string;
  /** Alternate paths for each locale — same index order as LOCALES */
  alternatePaths?: Record<Locale, string>;
  description: string;
  /** OG image absolute URL; defaults to the lead portfolio project image. */
  ogImage?: string;
  ogType?: 'website' | 'article';
}

function setMeta(name: string, content: string, isProperty = false) {
  const attr = isProperty ? 'property' : 'name';
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string, extra?: Record<string, string>) {
  // Match by rel + href so we can have multiple hreflang links
  const selector = extra?.hreflang
    ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (extra) Object.entries(extra).forEach(([k, v]) => el!.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useMeta({ locale, path, alternatePaths, description, ogImage, ogType = 'website' }: MetaConfig) {
  useEffect(() => {
    const canonical = `${SITE_URL}${path}`;
    const image = ogImage ?? `${SITE_URL}/images/projects/cinquanta-u/thumb.png`;
    const title = document.title;

    // Description
    setMeta('description', description);

    // Canonical
    setLink('canonical', canonical);

    // hreflang alternates
    if (alternatePaths) {
      LOCALES.forEach((loc) => {
        setLink('alternate', `${SITE_URL}${alternatePaths[loc]}`, { hreflang: loc });
      });
      // x-default → Catalan
      setLink('alternate', `${SITE_URL}${alternatePaths['ca']}`, { hreflang: 'x-default' });
    }

    // Open Graph
    setMeta('og:type', ogType, true);
    setMeta('og:url', canonical, true);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:image', image, true);
    setMeta('og:locale', locale === 'ca' ? 'ca_ES' : locale === 'es' ? 'es_ES' : 'en_GB', true);

    // Twitter / X card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', image);
  });
}
