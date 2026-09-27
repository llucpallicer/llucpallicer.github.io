import { Navigate, useParams } from 'react-router-dom';

export function GalleryPage() {
  const { locale, slug } = useParams<{ locale: string; slug: string }>();
  return <Navigate to={`/${locale ?? 'ca'}/projectes/${slug ?? ''}`} replace />;
}

