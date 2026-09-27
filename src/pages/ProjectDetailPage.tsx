import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getProject } from '@/data/projects';
import { projectBodies } from '@/data/content';
import {
  detailImageCounts,
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

  const [activeIndex, setActiveIndex] = useState(0);
  const filmstripRef = useRef<HTMLDivElement>(null);

  const detailCount = project ? detailImageCounts[project.slug] ?? 0 : 0;
  const phoneCount = project ? phoneProjectImageCounts[project.slug] ?? 0 : 0;

  useEffect(() => {
    setActiveIndex(0);
    if (filmstripRef.current) {
      filmstripRef.current.scrollLeft = 0;
    }
  }, [project?.slug]);

  const handleScroll = useCallback(() => {
    const container = filmstripRef.current;
    if (!container) return;
    const frames = container.querySelectorAll<HTMLElement>(`.${styles.filmFrame}`);
    if (!frames.length) return;

    const containerLeft = container.getBoundingClientRect().left;
    let closestIndex = 0;
    let minDiff = Infinity;

    frames.forEach((frame, idx) => {
      const diff = Math.abs(frame.getBoundingClientRect().left - containerLeft);
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = idx;
      }
    });

    setActiveIndex(closestIndex);
  }, []);

  const scrollToSlide = useCallback(
    (targetIndex: number) => {
      const container = filmstripRef.current;
      if (!container) return;
      const clampedIndex = Math.max(0, Math.min(targetIndex, detailCount - 1));
      const frames = container.querySelectorAll<HTMLElement>(`.${styles.filmFrame}`);
      const frame = frames[clampedIndex];
      if (frame) {
        container.scrollTo({ left: frame.offsetLeft, behavior: 'smooth' });
        setActiveIndex(clampedIndex);
      }
    },
    [detailCount],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        scrollToSlide(activeIndex - 1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        scrollToSlide(activeIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, scrollToSlide]);

  if (!project || !copy) return <Navigate to={`/${locale}/projectes`} replace />;

  const labels = navLabels[locale];
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
          <div className={styles.sliderContainer}>
            <div
              ref={filmstripRef}
              className={styles.filmstrip}
              onScroll={handleScroll}
              tabIndex={0}
              aria-label={`${copy.title} images`}
            >
              {Array.from({ length: detailCount }, (_, i) => {
                const index = i + 1;
                const src = projectDetailImageUrl(project.slug, index);
                const isHero = index === 1;
                const imgAlt = isHero ? altBase : `${altBase} — image ${index}`;

                return (
                  <div
                    key={index}
                    className={styles.filmFrame}
                    onClick={() => scrollToSlide(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        scrollToSlide(i);
                      }
                    }}
                    aria-label={`${copy.title} — ${index}/${detailCount}`}
                  >
                    <img src={src} alt={imgAlt} loading={isHero ? 'eager' : 'lazy'} />
                  </div>
                );
              })}
            </div>

            <div className={styles.controls} aria-label="Gallery controls">
              <button
                type="button"
                onClick={() => scrollToSlide(activeIndex - 1)}
                disabled={activeIndex === 0}
                className={activeIndex === 0 ? styles.arrowDisabled : styles.arrow}
                aria-label="Previous image"
              >
                ‹
              </button>
              <span className={styles.counter}>
                {activeIndex + 1}/{detailCount}
              </span>
              <button
                type="button"
                onClick={() => scrollToSlide(activeIndex + 1)}
                disabled={activeIndex >= detailCount - 1}
                className={activeIndex >= detailCount - 1 ? styles.arrowDisabled : styles.arrow}
                aria-label="Next image"
              >
                ›
              </button>
            </div>
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
