import { NavLink, useLocation } from 'react-router-dom';
import type { Locale } from '@/data/types';
import { diaryEntries } from '@/data/diary';
import { getNextProject, projects, sidebarProjectTitle } from '@/data/projects';
import { navLabels, sidebarLabels } from '@/i18n/messages';
import { projectPagePath } from '@/utils/projectLinks';
import styles from './SideNav.module.css';

interface SideNavProps {
  locale: Locale;
}

export function SideNav({ locale }: SideNavProps) {
  const labels = navLabels[locale];
  const sidebar = sidebarLabels[locale];
  const base = `/${locale}`;
  const { pathname } = useLocation();

  const inProjects = pathname.includes('/projectes');
  const inDiary = pathname.includes('/diari');
  const currentSlug = pathname.match(/\/projectes\/([^/]+)/)?.[1];
  const nextProject = currentSlug ? getNextProject(currentSlug) : undefined;

  return (
    <nav className={styles.nav} aria-label="Main">
      <NavLink to={base} end className={({ isActive }) => (isActive ? styles.active : undefined)}>
        {labels.brand}
      </NavLink>
      <NavLink to={`${base}/projectes`} className={({ isActive }) => (isActive ? styles.active : undefined)}>
        {labels.projects}
      </NavLink>
      <NavLink to={`${base}/diari`} className={({ isActive }) => (isActive ? styles.active : undefined)}>
        {labels.diary}
      </NavLink>
      <NavLink to={`${base}/contacte`} className={({ isActive }) => (isActive ? styles.active : undefined)}>
        {labels.contact}
      </NavLink>

      {inProjects && (
        <div className={styles.section}>
          <span className={styles.sectionLabel}>{sidebar.archive}</span>
          {projects.map((project) => (
            <NavLink
              key={project.slug}
              to={projectPagePath(locale, project.slug)}
              className={({ isActive }) =>
                isActive || currentSlug === project.slug ? styles.active : undefined
              }
            >
              {sidebarProjectTitle(project, locale)}
            </NavLink>
          ))}
          {nextProject && (
            <NavLink to={projectPagePath(locale, nextProject.slug)} className={styles.next}>
              {sidebar.nextProject}
            </NavLink>
          )}
        </div>
      )}

      {inDiary && (
        <div className={styles.section}>
          {diaryEntries.map((entry) => (
            <NavLink
              key={entry.slug}
              to={`${base}/diari`}
              end
              className={({ isActive }) => (isActive ? styles.active : undefined)}
            >
              {entry.copy[locale]}
            </NavLink>
          ))}
        </div>
      )}

      <div className={styles.lang}>
        {(['ca', 'es', 'en'] as Locale[]).map((loc) => (
          <LocaleSwitch key={loc} target={loc} label={labels.languages[loc]} active={loc === locale} />
        ))}
      </div>
    </nav>
  );
}

function LocaleSwitch({ target, label, active }: { target: Locale; label: string; active: boolean }) {
  const { pathname } = useLocation();
  const suffix = pathname.replace(/^\/(ca|es|en)/, '') || '';
  const href = `/${target}${suffix}`;

  return (
    <NavLink to={href} className={active ? styles.active : styles.muted}>
      {label}
    </NavLink>
  );
}
