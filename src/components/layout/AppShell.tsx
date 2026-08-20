import { Outlet, useLocation } from 'react-router-dom';
import { SideNav } from './SideNav';
import { MobileHeader } from './MobileHeader';
import { useLocale } from '@/hooks/useLocale';
import { useIsMobile } from '@/hooks/useMediaQuery';
import styles from './AppShell.module.css';

export function AppShell() {
  const locale = useLocale();
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const isMenu = pathname.endsWith('/menu');

  return (
    <div className={styles.shell} data-device={isMobile ? 'phone' : 'desktop'}>
      {isMobile ? <MobileHeader locale={locale} showMenu={!isMenu} /> : <SideNav locale={locale} />}
      <main className={styles.main} data-menu={isMenu ? 'true' : undefined}>
        <Outlet />
      </main>
    </div>
  );
}
