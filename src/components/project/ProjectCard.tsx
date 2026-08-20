import { Link } from 'react-router-dom';
import type { Locale, Project } from '@/data/types';
import { phoneHomeImageUrl, projectThumbUrl } from '@/data/galleries';
import { projectPagePath } from '@/utils/projectLinks';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  locale: Locale;
  project: Project;
  variant?: 'desktop' | 'mobile';
  homeIndex?: number;
}

export function ProjectCard({ locale, project, variant = 'desktop', homeIndex }: ProjectCardProps) {
  const copy = project.copy[locale];
  const isMobile = variant === 'mobile';
  const href = projectPagePath(locale, project.slug, isMobile);

  const imageSrc =
    isMobile && homeIndex ? phoneHomeImageUrl(homeIndex) : projectThumbUrl(project.slug);

  return (
    <Link
      to={href}
      className={isMobile ? `${styles.card} ${styles.cardMobile}` : styles.card}
    >
      <img src={imageSrc} alt={copy.title} className={styles.image} loading="lazy" />
      <span className={isMobile ? `${styles.label} ${styles.labelVisible}` : styles.label}>
        {copy.title}
        {'\n'}
        {copy.year}
      </span>
    </Link>
  );
}
