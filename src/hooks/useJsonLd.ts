import { useEffect } from 'react';

/**
 * Injects a <script type="application/ld+json"> into <head>.
 * One script tag per unique id. Cleaned up on unmount.
 */
export function useJsonLd(id: string, data?: object) {
  useEffect(() => {
    const scriptId = `jsonld-${id}`;
    let el = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!data) {
      el?.remove();
      return;
    }
    if (!el) {
      el = document.createElement('script');
      el.id = scriptId;
      el.type = 'application/ld+json';
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify(data);
    return () => {
      document.getElementById(scriptId)?.remove();
    };
  }, [id, data ? JSON.stringify(data) : '']); // eslint-disable-line react-hooks/exhaustive-deps
}
