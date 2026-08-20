import { Link } from 'react-router-dom';
import type { Locale } from '@/data/types';
import { navLabels } from '@/i18n/messages';
import styles from './MobileHeader.module.css';

interface MobileHeaderProps {
  locale: Locale;
  showMenu?: boolean;
}

export function MobileHeader({ locale, showMenu = true }: MobileHeaderProps) {
  const labels = navLabels[locale];

  return (
    <header className={styles.header}>
      <Link to={`/${locale}`} className={styles.brand}>
        {labels.brand}
      </Link>
      {showMenu && (
        <Link to={`/${locale}/menu`} className={styles.menu}>
          {labels.menu}
        </Link>
      )}
    </header>
  );
}
