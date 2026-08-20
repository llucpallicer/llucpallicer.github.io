import { Link } from 'react-router-dom';
import { archiveProjectTitle, projects } from '@/data/projects';
import { projectPagePath } from '@/utils/projectLinks';
import { useLocale } from '@/hooks/useLocale';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { archiveTableHeaders, pageTitles } from '@/i18n/messages';
import styles from './ProjectsPage.module.css';

export function ProjectsPage() {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const titles = pageTitles[locale];
  const headers = archiveTableHeaders[locale];

  usePageTitle(titles.archive);

  if (isMobile) {
    return (
      <div className={styles.page}>
        <ul className={styles.mobileList}>
          {projects.map((p) => (
            <li key={p.slug}>
              <Link to={projectPagePath(locale, p.slug, true)} className={styles.mobileLink}>
                {archiveProjectTitle(p, locale)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">{headers.project}</th>
            <th scope="col">{headers.client}</th>
            <th scope="col">{headers.year}</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => {
            const copy = p.copy[locale];
            return (
              <tr key={p.slug}>
                <td>
                  <Link to={projectPagePath(locale, p.slug)} className={styles.projectLink}>
                    {copy.title}
                  </Link>
                </td>
                <td className={styles.client}>{copy.client ?? ''}</td>
                <td className={styles.year}>{copy.year}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
