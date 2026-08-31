import { Link, Navigate, useParams } from 'react-router-dom';
import { getProject } from '@/data/projects';
import { projectBodies } from '@/data/content';
import {
  detailImageCounts,
  getGallery,
  phoneProjectImageCounts,
  phoneProjectImageUrl,
  projectDetailImageUrl,
  projectThumbUrl,
} from '@/data/galleries';
import { useLocale } from '@/hooks/useLocale';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useMeta } from '@/hooks/useMeta';
import { useJsonLd } from '@/hooks/useJsonLd';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { navLabels } from '@/i18n/messages';
import { creativeWorkSchema } from '@/seo/schemas';
import styles from './ProjectDetailPage.module.css';

export function ProjectDetailPage() {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const { slug } = useParams<{ slug: string }>();
  const project = slug ? getProject(slug) : undefined;
  const pageTitle = project ? `${project.copy[locale].title} / ${project.copy[locale].year}` : '';

  usePageTitle(pageTitle);

  const copy = project?.copy[locale];
  const gallery = project ? getGallery(project.slug) : undefined;
  const body = project ? projectBodies[project.slug]?.[locale] : undefined;
  const firstSentence = body ? body.split(/[.!?]/)[0] + '.' : '';
  const description = copy
    ? firstSentence ||
      `${copy.title} — ${copy.discipline ?? 'project'} by Lluc Pallicer, ${copy.year}.${copy.client ? ` Client: ${copy.client}.` : ''}`
    : 'Archive of projects by Lluc Pallicer.';

  useMeta({
    locale,
    path: project ? `/${locale}/projectes/${project.slug}` : `/${locale}/projectes`,
    alternatePaths: {
      ca: project ? `/ca/projectes/${project.slug}` : '/ca/projectes',
      es: project ? `/es/projectes/${project.slug}` : '/es/projectes',
      en: project ? `/en/projectes/${project.slug}` : '/en/projectes',
    },
    description,
    ogImage: project ? `https://llucpallicer.com${projectThumbUrl(project.slug)}` : undefined,
    ogType: 'article',
  });

  useJsonLd(
    `project-${slug ?? 'unknown'}`,
    project && copy
      ? creativeWorkSchema({
          name: copy.title,
          description,
          year: copy.year,
          slug: project.slug,
          locale,
          discipline: copy.discipline,
          client: copy.client,
        })
      : undefined,
  );

  if (!project || !copy) return <Navigate to={`/${locale}/projectes`} replace />;

  if (project.slug === 'utopia' && !isMobile) {
    const first = gallery?.first ?? 1;
    return <Navigate to={`/${locale}/projectes/utopia/fotos/${first}`} replace />;
  }

  const labels = navLabels[locale];
  const detailCount = detailImageCounts[project.slug] ?? 0;
  const phoneCount = phoneProjectImageCounts[project.slug] ?? 0;
  const firstSlide = gallery?.first;
  const altBase = `${copy.title} — ${copy.discipline ?? 'project'} by Lluc Pallicer, ${copy.year}`;

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
                alt={i === 0 ? altBase : `${altBase} — image ${i + 1}`}
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
              const imgAlt = isHero ? altBase : `${altBase} — image ${index}`;

              if (isHero && firstSlide) {
                return (
                  <Link
                    key={index}
                    to={`/${locale}/projectes/${project.slug}/fotos/${firstSlide}`}
                    className={styles.filmFrame}
                    aria-label={`${copy.title} gallery`}
                  >
                    <img src={src} alt={imgAlt} loading="eager" />
                  </Link>
                );
              }

              return (
                <div key={index} className={styles.filmFrame}>
                  <img src={src} alt={imgAlt} loading="lazy" />
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
