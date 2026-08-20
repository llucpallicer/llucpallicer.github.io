import { Link, Navigate, useParams } from 'react-router-dom';
import { getProject } from '@/data/projects';
import { projectBodies } from '@/data/content';
import {
  detailImageCounts,
  getGallery,
  phoneProjectImageCounts,
  phoneProjectImageUrl,
  projectDetailImageUrl,
} from '@/data/galleries';
import { useLocale } from '@/hooks/useLocale';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { navLabels } from '@/i18n/messages';
import styles from './ProjectDetailPage.module.css';

export function ProjectDetailPage() {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;
  const pageTitle = project ? `${project.copy[locale].title} / ${project.copy[locale].year}` : '';

  usePageTitle(pageTitle);

  if (!project) return <Navigate to={`/${locale}/projectes`} replace />;

  if (project.slug === 'utopia' && !isMobile) {
    const gallery = getGallery('utopia');
    const first = gallery?.first ?? 1;
    return <Navigate to={`/${locale}/projectes/utopia/fotos/${first}`} replace />;
  }

  const copy = project.copy[locale];
  const labels = navLabels[locale];
  const gallery = getGallery(project.slug);
  const body = projectBodies[project.slug]?.[locale];
  const detailCount = detailImageCounts[project.slug] ?? 0;
  const phoneCount = phoneProjectImageCounts[project.slug] ?? 0;
  const firstSlide = gallery?.first;

  return (
    <article className={styles.page}>
      <header className={styles.header}>
        <h1>
          {copy.title} / {copy.year}
        </h1>
        {!isMobile && (
          <Link to={`/${locale}/projectes`} className={styles.back}>
            ← {labels.projects}
          </Link>
        )}
      </header>

      {isMobile ? (
        phoneCount > 0 && (
          <div className={styles.mobileStack}>
            {Array.from({ length: phoneCount }, (_, i) => (
              <img
                key={i}
                src={phoneProjectImageUrl(project.slug, i + 1)}
                alt=""
                className={styles.mobileImage}
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            ))}
          </div>
        )
      ) : (
        detailCount > 0 && (
          <div className={styles.filmstrip}>
            {Array.from({ length: detailCount }, (_, i) => {
              const index = i + 1;
              const src = projectDetailImageUrl(project.slug, index);
              const isHero = index === 1;

              if (isHero && firstSlide) {
                return (
                  <Link
                    key={index}
                    to={`/${locale}/projectes/${project.slug}/fotos/${firstSlide}`}
                    className={styles.filmFrame}
                    aria-label={`${copy.title} gallery`}
                  >
                    <img src={src} alt="" loading="eager" />
                  </Link>
                );
              }

              return (
                <div key={index} className={styles.filmFrame}>
                  <img src={src} alt="" loading="lazy" />
                </div>
              );
            })}
          </div>
        )
      )}

      {body && (
        <div className={styles.body}>
          {body.split('\n\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      )}
    </article>
  );
}
