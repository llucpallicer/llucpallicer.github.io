import { useParams, Navigate } from 'react-router-dom';
import type { Locale } from '@/data/types';

const LOCALES: Locale[] = ['ca', 'es', 'en'];

export function useLocale(): Locale {
  const { locale } = useParams<{ locale: string }>();
  if (locale && LOCALES.includes(locale as Locale)) {
    return locale as Locale;
  }
  return 'ca';
}

export function LocaleGuard({ children }: { children: React.ReactNode }) {
  const { locale } = useParams<{ locale: string }>();
  if (!locale || !LOCALES.includes(locale as Locale)) {
    return <Navigate to="/ca" replace />;
  }
  return <>{children}</>;
}

export function localePath(locale: Locale, ...segments: string[]) {
  return `/${locale}/${segments.filter(Boolean).join('/')}`;
}
