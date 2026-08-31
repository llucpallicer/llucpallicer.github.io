import { getHomeProjects } from '@/data/projects';
import { ProjectCard } from '@/components/project/ProjectCard';
import { useLocale } from '@/hooks/useLocale';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useMeta } from '@/hooks/useMeta';
import { useJsonLd } from '@/hooks/useJsonLd';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { navLabels } from '@/i18n/messages';
import { personSchema } from '@/seo/schemas';
import styles from './HomePage.module.css';

const HOME_DESCRIPTIONS: Record<string, string> = {
  ca: 'Lluc Pallicer — dissenyador de producte i investigador a Barcelona. Projectes de disseny de producte, instal·lacions i direcció d\'art.',
  es: 'Lluc Pallicer — diseñador de producto e investigador en Barcelona. Proyectos de diseño de producto, instalaciones y dirección de arte.',
  en: 'Lluc Pallicer — product designer and researcher based in Barcelona. Projects in product design, installations, and art direction.',
};

export function HomePage() {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const homeProjects = getHomeProjects();

  usePageTitle(navLabels[locale].brand);
  useMeta({
    locale,
    path: `/${locale}`,
    alternatePaths: { ca: '/ca', es: '/es', en: '/en' },
    description: HOME_DESCRIPTIONS[locale],
  });
  useJsonLd('person', personSchema());

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
