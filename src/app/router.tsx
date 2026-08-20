import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { LocaleGuard } from '@/hooks/useLocale';
import { HomePage } from '@/pages/HomePage';
import { ProjectsPage } from '@/pages/ProjectsPage';
import { ProjectDetailPage } from '@/pages/ProjectDetailPage';
import { GalleryPage } from '@/pages/GalleryPage';
import { DiaryPage, ContactPage } from '@/pages/ContentPage';
import { MobileMenuPage } from '@/pages/MobileMenuPage';

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/ca" replace />} />

      <Route
        path="/:locale"
        element={
          <LocaleGuard>
            <AppShell />
          </LocaleGuard>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="projectes" element={<ProjectsPage />} />
        <Route path="projectes/:slug" element={<ProjectDetailPage />} />
        <Route path="projectes/:slug/fotos/:slide" element={<GalleryPage />} />
        <Route path="diari" element={<DiaryPage />} />
        <Route path="contacte" element={<ContactPage />} />
        <Route path="menu" element={<MobileMenuPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/ca" replace />} />
    </Routes>
  );
}
