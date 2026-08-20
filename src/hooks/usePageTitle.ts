import { useEffect } from 'react';

export function usePageTitle(title: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} — Lluc Pallicer` : 'Lluc Pallicer';
    return () => {
      document.title = previous;
    };
  }, [title]);
}
