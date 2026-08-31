import { useLocale } from '@/hooks/useLocale';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useMeta } from '@/hooks/useMeta';
import { useJsonLd } from '@/hooks/useJsonLd';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { contactContent, diaryContent } from '@/data/content';
import { siteConfig } from '@/config/site';
import { pageTitles } from '@/i18n/messages';
import { parseDiaryBlocks } from '@/utils/parseDiaryBlocks';
import { articleSchema, personSchema } from '@/seo/schemas';
import styles from './ContentPage.module.css';

const DIARY_DESCRIPTIONS: Record<string, string> = {
  ca: 'Diari de recerca de Lluc Pallicer. Article sobre l\'habitatge que el GATCPAC no va construir a Mallorca.',
  es: 'Diario de investigación de Lluc Pallicer. Artículo sobre los apartamentos que el GATCPAC no construyó en Mallorca.',
  en: 'Research diary by Lluc Pallicer. Article on the apartments that GATCPAC never built in Mallorca.',
};

const DIARY_HEADLINES: Record<string, string> = {
  ca: 'L\'habitatge que el GATCPAC no va construir a Mallorca',
  es: 'Los apartamentos que el GATCPAC no construyó en Mallorca',
  en: 'The Apartments That GATCPAC Never Built in Mallorca',
};

const CONTACT_DESCRIPTIONS: Record<string, string> = {
  ca: 'Lluc Pallicer — dissenyador de producte nascut a Mallorca, format a EINA (Barcelona). Contacte i informació professional.',
  es: 'Lluc Pallicer — diseñador de producto nacido en Mallorca, formado en EINA (Barcelona). Contacto e información profesional.',
  en: 'Lluc Pallicer — product designer born in Mallorca, trained at EINA (Barcelona). Contact and professional information.',
};

export function DiaryPage() {
  const locale = useLocale();
  const content = diaryContent[locale];
  const blocks = content.body ? parseDiaryBlocks(content.body) : [];

  usePageTitle(pageTitles[locale].diary);
  useMeta({
    locale,
    path: `/${locale}/diari`,
    alternatePaths: { ca: '/ca/diari', es: '/es/diari', en: '/en/diari' },
    description: DIARY_DESCRIPTIONS[locale],
    ogType: 'article',
  });
  useJsonLd('diary-article', articleSchema({
    headline: DIARY_HEADLINES[locale],
    description: DIARY_DESCRIPTIONS[locale],
    locale,
    url: `https://llucpallicer.com/${locale}/diari`,
  }));

  return (
    <article className={styles.page}>
      <h1>{pageTitles[locale].diary}</h1>
      {content.headline && <p className={styles.headline}>{content.headline}</p>}
      <div className={styles.article}>
        {blocks.map((block, i) => {
          if (block.type === 'figure') {
            return (
              <figure key={i} className={styles.figure}>
                <figcaption>{block.caption}</figcaption>
              </figure>
            );
          }
          if (block.type === 'bibliography') {
            return (
              <section key={i} className={styles.bibliography}>
                {block.text}
              </section>
            );
          }
          return <p key={i}>{block.text}</p>;
        })}
      </div>
    </article>
  );
}

export function ContactPage() {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const content = contactContent[locale];

  usePageTitle(pageTitles[locale].contact);
  useMeta({
    locale,
    path: `/${locale}/contacte`,
    alternatePaths: { ca: '/ca/contacte', es: '/es/contacte', en: '/en/contacte' },
    description: CONTACT_DESCRIPTIONS[locale],
  });
  useJsonLd('contact-person', personSchema());

  return (
    <div className={`${styles.page} ${isMobile ? styles.contactMobile : styles.contactDesktop}`}>
      <h1>{pageTitles[locale].contact}</h1>

      <div className={styles.contactLayout}>
        <div className={styles.body}>
          {content.bio.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>

        <aside className={styles.contactAside}>
          {content.cvLabel &&
            (siteConfig.cvUrl ? (
              <a href={siteConfig.cvUrl} className={styles.link} target="_blank" rel="noreferrer">
                {content.cvLabel}
              </a>
            ) : (
              <span className={styles.cvLabel}>{content.cvLabel}</span>
            ))}
          {content.email && (
            <a href={`mailto:${content.email}`} className={styles.link}>
              {content.email}
            </a>
          )}
          {content.social && (
            <a
              href={`https://instagram.com/${content.social.replace('@', '')}`}
              className={styles.link}
              target="_blank"
              rel="me noreferrer"
            >
              {content.social}
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}
