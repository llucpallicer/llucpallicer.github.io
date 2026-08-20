import { useLocale } from '@/hooks/useLocale';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { contactContent, diaryContent } from '@/data/content';
import { siteConfig } from '@/config/site';
import { pageTitles } from '@/i18n/messages';
import { parseDiaryBlocks } from '@/utils/parseDiaryBlocks';
import styles from './ContentPage.module.css';

export function DiaryPage() {
  const locale = useLocale();
  const content = diaryContent[locale];
  const blocks = content.body ? parseDiaryBlocks(content.body) : [];

  usePageTitle(pageTitles[locale].diary);

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
              rel="noreferrer"
            >
              {content.social}
            </a>
          )}
        </aside>
      </div>
    </div>
  );
}
