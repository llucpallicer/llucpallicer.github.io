import { getHomeProjects } from '@/data/projects';
import { ProjectCard } from '@/components/project/ProjectCard';
import { useLocale } from '@/hooks/useLocale';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { navLabels } from '@/i18n/messages';
import styles from './HomePage.module.css';

export function HomePage() {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const homeProjects = getHomeProjects();

  usePageTitle(navLabels[locale].brand);

  if (isMobile) {
    return (
      <div className={styles.homeMobile}>
        <div className={styles.scrollTrack}>
          {homeProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              locale={locale}
              project={project}
              variant="mobile"
              homeIndex={index + 1}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.home}>
      {homeProjects.map((project) => (
        <ProjectCard key={project.slug} locale={locale} project={project} />
      ))}
    </div>
  );
}
