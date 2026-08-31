import { Link, Navigate, useParams } from 'react-router-dom';
import { getProject } from '@/data/projects';
import { galleryImageUrl, getGallery } from '@/data/galleries';
import { useLocale } from '@/hooks/useLocale';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useMeta } from '@/hooks/useMeta';
import { useJsonLd } from '@/hooks/useJsonLd';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { navLabels } from '@/i18n/messages';
import { projectBodies } from '@/data/content';
import { creativeWorkSchema } from '@/seo/schemas';
import styles from './GalleryPage.module.css';

export function GalleryPage() {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const { slug, slide } = useParams<{ slug: string; slide: string }>();
  const project = slug ? getProject(slug) : undefined;
  const gallery = project ? getGallery(project.slug) : undefined;
  const index = Number(slide ?? 1);
  const pageTitle = project ? `${project.copy[locale].title} / ${project.copy[locale].year}` : '';

  usePageTitle(pageTitle);

  const copy = project?.copy[locale];
  const body = project ? projectBodies[project.slug]?.[locale] : undefined;
  const firstSentence = body ? body.split(/[.!?]/)[0] + '.' : '';
  const description = copy
    ? firstSentence || `${copy.title} — ${copy.discipline ?? 'project'} by Lluc Pallicer, ${copy.year}.`
    : 'Archive of projects by Lluc Pallicer.';

  // Gallery images are part of the parent project, so they canonicalise to its detail URL.
  useMeta({
    locale,
    path: project ? `/${locale}/projectes/${project.slug}` : `/${locale}/projectes`,
    alternatePaths: {
      ca: project ? `/ca/projectes/${project.slug}` : '/ca/projectes',
      es: project ? `/es/projectes/${project.slug}` : '/es/projectes',
      en: project ? `/en/projectes/${project.slug}` : '/en/projectes',
    },
    description,
    ogImage: project ? `https://llucpallicer.com${galleryImageUrl(project.slug, index)}` : undefined,
    ogType: 'article',
  });

  useJsonLd(
    `gallery-project-${slug ?? 'unknown'}`,
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

  if (isMobile && project) {
    return <Navigate to={`/${locale}/projectes/${project.slug}`} replace />;
  }

  if (!project || !copy || !gallery || !gallery.slides.includes(index)) {
    return <Navigate to={`/${locale}/projectes/${slug ?? ''}`} replace />;
  }

  const labels = navLabels[locale];
  const prev = gallery.prev[index];
  const next = gallery.next[index];
  const position = gallery.slides.indexOf(index) + 1;
  const total = gallery.slides.length;
  const exit = gallery.exitToHome ? `/${locale}` : `/${locale}/projectes/${project.slug}`;

  return (
    <div className={styles.gallery}>
      <div className={styles.topBar}>
        <Link to={exit} className={styles.exit}>
          {labels.exit}
        </Link>
        <h1 className={styles.title}>
          {copy.title} / {copy.year}
        </h1>
      </div>

      <div className={styles.viewer}>
        <img
          src={galleryImageUrl(project.slug, index)}
          alt={`${copy.title} — ${position}/${total}`}
          className={styles.image}
        />
      </div>

      <div className={styles.controls}>
        {prev ? (
          <Link to={`/${locale}/projectes/${project.slug}/fotos/${prev}`} className={styles.arrow}>
            ‹
          </Link>
        ) : (
          <span className={styles.arrowDisabled}>‹</span>
        )}
        <span className={styles.counter}>
          {position}/{total}
        </span>
        {next ? (
          <Link to={`/${locale}/projectes/${project.slug}/fotos/${next}`} className={styles.arrow}>
            ›
          </Link>
        ) : (
          <span className={styles.arrowDisabled}>›</span>
        )}
      </div>
    </div>
  );
}
