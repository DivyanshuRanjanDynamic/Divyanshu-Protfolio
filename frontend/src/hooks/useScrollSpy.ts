import { useState, useEffect } from 'react';

export function useScrollSpy(sectionIds: string[], offset = 100) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;
      let current = '';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop - offset;
        if (scrollY >= top) current = id;
      }

      setActiveId(current);
    };

    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, [sectionIds, offset]);

  return activeId;
}
