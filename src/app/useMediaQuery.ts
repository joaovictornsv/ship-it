import { useEffect, useState } from 'react';

/**
 * Subscribe to a CSS media query. Initial value reads `matchMedia` synchronously
 * (SPA — no SSR) so the first paint matches the current viewport.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => {
      setMatches(media.matches);
    };
    onChange();
    media.addEventListener('change', onChange);
    return () => {
      media.removeEventListener('change', onChange);
    };
  }, [query]);

  return matches;
}
