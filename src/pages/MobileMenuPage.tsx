import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '@/hooks/useLocale';
import { usePageTitle } from '@/hooks/usePageTitle';
import { diaryEntries } from '@/data/diary';
import { projects, sidebarProjectTitle } from '@/data/projects';
import { navLabels, sidebarLabels } from '@/i18n/messages';
import type { Locale } from '@/data/types';
import { projectPagePath } from '@/utils/projectLinks';
import styles from './MobileMenuPage.module.css';

export function MobileMenuPage() {
  const locale = useLocale();
  const labels = navLabels[locale];
  const sidebar = sidebarLabels[locale];
  const { pathname } = useLocation();
  const suffix = pathname.replace(/^\/(ca|es|en)/, '') || '';
  const inProjects = pathname.includes('/projectes');
  const inDiary = pathname.includes('/diari');

  usePageTitle(labels.menu);

  return (
    <nav className={styles.menu} aria-label="Mobile menu">
      <Link to={`/${locale}/projectes`} className={styles.link}>
        {labels.projects}
      </Link>
      <Link to={`/${locale}/diari`} className={styles.link}>
        {labels.diary}
      </Link>
      <Link to={`/${locale}/contacte`} className={styles.link}>
        {labels.contact}
      </Link>

      {inProjects && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>{sidebar.archive}</span>
          {projects.map((project) => (
            <Link key={project.slug} to={projectPagePath(locale, project.slug)} className={styles.link}>
              {sidebarProjectTitle(project, locale)}
            </Link>
          ))}
        </div>
      )}

      {inDiary && (
        <div className={styles.section}>
          {diaryEntries.map((entry) => (
            <Link key={entry.slug} to={`/${locale}/diari`} className={styles.link}>
              {entry.copy[locale]}
            </Link>
          ))}
        </div>
      )}

      <div className={styles.lang}>
        {(['ca', 'es', 'en'] as Locale[]).map((loc) => (
          <Link
            key={loc}
            to={`/${loc}${suffix}`}
            className={loc === locale ? `${styles.link} ${styles.active}` : styles.link}
          >
            {labels.languages[loc]}
          </Link>
        ))}
      </div>
    </nav>
  );
}
